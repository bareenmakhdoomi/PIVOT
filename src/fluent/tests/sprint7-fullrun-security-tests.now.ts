import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { viewer, analyst, business_owner, admin } from '../roles/roles.now'

// Sprint 7 – PIV-046 ATF: full run and security. Child suites "Full run" and "Security" (sprint7-suites.now.ts).
// Data created by a test is rolled back by ATF when the test finishes.

export const s7FullRun = Test({
    $id: Now.ID['atf-s7-full-run'],
    name: 'PIVOT S7 – Full assessment run (PIV-046.01–.03)',
    description: 'Queues an assessment (Queued), runs it (Running → Complete) and checks: run date, run by and duration set, under 10 minutes; at least one Result, Opportunity and Roadmap item; log steps in order from discover to notify; a capability on u_does_not_exist is Not Measured, the log names the table and the run still completes. All data is rolled back.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-full-run-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var cap = function (name, f) {
        var c = new GlideRecord('x_enno_pivot_capability');
        c.initialize();
        c.setValue('name', name);
        c.setValue('source', 'store_app');
        c.setValue('active', true);
        c.setValue('installed', true);
        for (var k in f) c.setValue(k, f[k]);
        return c.insert();
    };
    // a licensed-not-installed capability guarantees at least one opportunity (shelfware) and roadmap item
    var shelfId = cap('[ATF S7 run] licensed not installed', { licensed: true, installed: false });
    var missingId = cap('[ATF S7 run] missing table', { measure_table: 'u_does_not_exist', target_value: 100 });

    // PIV-046.02 – Queued first
    var q = A.queueAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'PIV-046.02 assessment queued: ' + q.message, shouldbe: true, value: q.ok });
    if (!q.ok) return false;
    var a = new GlideRecord('x_enno_pivot_assessment');
    a.get(q.sysId);
    assertEqual({ name: 'PIV-046.02 status Queued before the run', shouldbe: 'queued', value: a.getValue('status') });
    var started = new GlideDateTime().getNumericValue();
    var run = A.run(q.sysId);
    var seconds = Math.round((new GlideDateTime().getNumericValue() - started) / 1000);
    assertEqual({ name: 'PIV-046.01 run completes: ' + run.message, shouldbe: true, value: run.ok });
    a.get(q.sysId);
    var status = a.getValue('status');
    assertEqual({ name: 'PIV-046.01 status Complete (with or without warnings), was ' + status, shouldbe: true, value: status === 'complete' || status === 'complete_with_warnings' });
    assertEqual({ name: 'PIV-046.01 finished within 10 minutes (' + seconds + ' s)', shouldbe: true, value: seconds < 600 });
    // PIV-046.02 – run date, run by, duration
    assertEqual({ name: 'PIV-046.02 run date set', shouldbe: true, value: !!a.getValue('run_date') });
    assertEqual({ name: 'PIV-046.02 run by set', shouldbe: gs.getUserID(), value: a.getValue('run_by') });
    var dur = a.getValue('duration');
    assertEqual({ name: 'PIV-046.02 duration set and above 0', shouldbe: true, value: !!dur && new GlideDateTime(dur).getNumericValue() > 0 });
    var count = function (table, extra) {
        var g = new GlideAggregate(table);
        g.addQuery('assessment', q.sysId);
        if (extra) g.addEncodedQuery(extra);
        g.addAggregate('COUNT');
        g.query();
        return g.next() ? Number(g.getAggregate('COUNT')) : 0;
    };
    assertEqual({ name: 'PIV-046.01 at least one Result', shouldbe: true, value: count('x_enno_pivot_result') >= 1 });
    assertEqual({ name: 'PIV-046.01 at least one Opportunity', shouldbe: true, value: count('x_enno_pivot_opportunity') >= 1 });
    assertEqual({ name: 'PIV-046.01 at least one Roadmap item', shouldbe: true, value: count('x_enno_pivot_roadmap_item') >= 1 });
    assertEqual({ name: 'PIV-046.01 shelfware opportunity for the test capability', shouldbe: true, value: count('x_enno_pivot_opportunity', 'capability=' + shelfId + '^type=shelfware') === 1 });

    // PIV-046.02 – the log runs from discover to notify, in order
    var log = [];
    try { log = JSON.parse(a.getValue('log') || '[]'); } catch (e) { log = []; }
    var names = [];
    for (var i = 0; i < log.length; i++) {
        var m = String(log[i].message || '');
        for (var s = 0; s < A.STEPS.length; s++) if (m.indexOf(A.STEPS[s] + ': ') === 0) names.push(A.STEPS[s]);
    }
    assertEqual({ name: 'PIV-046.02 first step in the log is discover', shouldbe: 'discover', value: names[0] });
    assertEqual({ name: 'PIV-046.02 last step in the log is notify', shouldbe: 'notify', value: names[names.length - 1] });
    assertEqual({ name: 'PIV-046.02 every step logged once, in order', shouldbe: A.STEPS.join(','), value: names.join(',') });
    assertEqual({ name: 'PIV-046.02 the run was set to Running (Started line)', shouldbe: true, value: log.length > 0 && String(log[0].message).indexOf('Started by') === 0 });

    // PIV-046.03 – the missing table
    var r = new GlideRecord('x_enno_pivot_result');
    r.addQuery('assessment', q.sysId);
    r.addQuery('capability', missingId);
    r.query();
    var found = r.next();
    assertEqual({ name: 'PIV-046.03 u_does_not_exist: Result written', shouldbe: true, value: found });
    if (found) {
        assertEqual({ name: 'PIV-046.03 u_does_not_exist: Not Measured', shouldbe: 'not_measured', value: r.getValue('measurement_status') });
        assertEqual({ name: 'PIV-046.03 u_does_not_exist: score empty', shouldbe: true, value: !r.getValue('score') });
    }
    var text = a.getValue('log') || '';
    assertEqual({ name: 'PIV-046.03 log names the table u_does_not_exist', shouldbe: true, value: text.indexOf('Measure table u_does_not_exist does not exist') > -1 });
    stepResult.setOutputMessage('PIV-046.01–.03: ' + run.number + ' ' + status + ' in ' + seconds + ' s; steps ' + names.join(' > ') + '.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

// ---------------------------------------------------------------- PIV-046.04–.06 security, one test per role

export const s7SecurityViewer = Test({
    $id: Now.ID['atf-s7-sec-viewer'],
    name: 'PIVOT S7 – Security: viewer is read-only (PIV-046.04)',
    description: 'As a viewer: the workspace data loads, capabilities can be read, a capability cannot be created or changed, outcomes cannot be created.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-s7-sec-viewer-user'],
        firstName: 'ATF',
        lastName: 'S7 viewer',
        fieldValues: {},
        groups: [],
        roles: [viewer],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-sec-viewer-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/api-read.ts');
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var d = null;
    try { d = R.dashboard(); } catch (e) { d = null; }
    assertEqual({ name: 'PIV-046.04 viewer: workspace dashboard loads', shouldbe: true, value: d !== null && d !== undefined });
    var read = new GlideRecordSecure('x_enno_pivot_capability');
    read.setLimit(1);
    read.query();
    assertEqual({ name: 'PIV-046.04 viewer: can read capabilities', shouldbe: true, value: read.next() });
    var c = new GlideRecordSecure('x_enno_pivot_capability');
    c.initialize();
    assertEqual({ name: 'PIV-046.04 viewer: cannot create a capability (ACL)', shouldbe: false, value: c.canCreate() });
    c.setValue('name', '[ATF S7] viewer insert');
    assertEqual({ name: 'PIV-046.04 viewer: capability insert refused', shouldbe: true, value: !c.insert() });
    if (read.isValidRecord()) assertEqual({ name: 'PIV-046.04 viewer: cannot write a capability (ACL)', shouldbe: false, value: read.canWrite() });
    var up = W.runActionWithNote({ action: 'updateCapability', id: read.isValidRecord() ? read.getUniqueValue() : '', fields: { target: 10 } });
    assertEqual({ name: 'PIV-046.04 viewer: updateCapability refused', shouldbe: 'Only PIVOT admins can change measurement settings.', value: up.error || '' });
    var so = W.runActionWithNote({ action: 'saveOutcome', fields: {} });
    assertEqual({ name: 'PIV-046.04 viewer: saveOutcome refused', shouldbe: 'Only business owners and admins can create outcomes.', value: so.error || '' });
    stepResult.setOutputMessage('PIV-046.04 viewer is read-only.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7SecurityAnalyst = Test({
    $id: Now.ID['atf-s7-sec-analyst'],
    name: 'PIVOT S7 – Security: analyst works opportunities, not capabilities (PIV-046.05)',
    description: 'As an analyst: cannot change a capability target (ACL and workspace), can accept an opportunity, and a reject without a reason is blocked with "Please enter a rejection reason".',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-s7-sec-analyst-user'],
        firstName: 'ATF',
        lastName: 'S7 analyst',
        fieldValues: {},
        groups: [],
        roles: [analyst],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-sec-analyst-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    // test data with plain GlideRecord (no ACL check), then the checks with the analyst's rights
    var c = new GlideRecord('x_enno_pivot_capability');
    c.initialize();
    c.setValue('name', '[ATF S7] analyst capability');
    c.setValue('source', 'store_app');
    c.setValue('active', true);
    c.setValue('installed', true);
    c.setValue('target_value', 100);
    var capId = c.insert();
    var opp = function (type) {
        var o = new GlideRecord('x_enno_pivot_opportunity');
        o.initialize();
        o.setValue('capability', capId);
        o.setValue('type', type);
        o.setValue('state', 'open');
        o.setValue('value', 3);
        o.setValue('effort', 3);
        o.setValue('short_description', '[ATF S7] analyst ' + type);
        var id = o.insert();
        o.get(id);
        return o.getValue('number');
    };
    var acceptNo = opp('low_adoption'), rejectNo = opp('not_measured');

    var sec = new GlideRecordSecure('x_enno_pivot_capability');
    sec.get(capId);
    assertEqual({ name: 'PIV-046.05 analyst: cannot write the capability (ACL)', shouldbe: false, value: sec.canWrite() });
    assertEqual({ name: 'PIV-046.05 analyst: cannot write the target field (ACL)', shouldbe: false, value: sec.getElement('target_value').canWrite() });
    var up = W.runActionWithNote({ action: 'updateCapability', id: capId, fields: { target: 10 } });
    assertEqual({ name: 'PIV-046.05 analyst: updateCapability refused', shouldbe: 'Only PIVOT admins can change measurement settings.', value: up.error || '' });
    c.get(capId);
    assertEqual({ name: 'PIV-046.05 analyst: target unchanged', shouldbe: 100, value: Number(c.getValue('target_value')) });

    var acc = W.runActionWithNote({ action: 'accept', number: acceptNo });
    assertEqual({ name: 'PIV-046.05 analyst: accept works ' + (acc.error || ''), shouldbe: true, value: !!acc.ok });
    var check = new GlideRecord('x_enno_pivot_opportunity');
    check.get('number', acceptNo);
    assertEqual({ name: 'PIV-046.05 analyst: opportunity is Accepted', shouldbe: 'accepted', value: check.getValue('state') });

    var rej = W.runActionWithNote({ action: 'reject', number: rejectNo, reason: '' });
    assertEqual({ name: 'PIV-046.05 analyst: reject without reason is blocked', shouldbe: false, value: !!rej.ok });
    assertEqual({ name: 'PIV-046.05 analyst: reject message', shouldbe: 'Please enter a rejection reason', value: rej.errors ? rej.errors.rejection_reason : (rej.error || '') });
    check.get('number', rejectNo);
    assertEqual({ name: 'PIV-046.05 analyst: opportunity stays New', shouldbe: 'open', value: check.getValue('state') });
    stepResult.setOutputMessage('PIV-046.05 analyst rights match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7SecurityOwner = Test({
    $id: Now.ID['atf-s7-sec-owner'],
    name: 'PIVOT S7 – Security: business owner edits own KPI target, not capabilities (PIV-046.06)',
    description: 'As a business owner: creates an outcome, changes its KPI target, cannot change a capability.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-s7-sec-owner-user'],
        firstName: 'ATF',
        lastName: 'S7 business owner',
        fieldValues: {},
        groups: [],
        roles: [business_owner],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-sec-owner-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var c = new GlideRecord('x_enno_pivot_capability');
    c.initialize();
    c.setValue('name', '[ATF S7] owner capability');
    c.setValue('source', 'store_app');
    c.setValue('active', true);
    c.setValue('installed', true);
    c.setValue('target_value', 100);
    var capId = c.insert();
    var fields = { capability: capId, objective: 'ATF Sprint 7 owner check', kpi: '[ATF S7] owner KPI', direction: 'higher_better', measurement_type: 'manual', period: 'monthly', target: 50 };
    var made = W.runActionWithNote({ action: 'saveOutcome', fields: fields });
    assertEqual({ name: 'PIV-046.06 owner: creates an outcome ' + (made.error || JSON.stringify(made.errors || '')), shouldbe: true, value: !!made.ok });
    if (!made.ok) return false;
    fields.id = made.id;
    fields.target = 75;
    var edit = W.runActionWithNote({ action: 'saveOutcome', fields: fields });
    assertEqual({ name: 'PIV-046.06 owner: edits the KPI target ' + (edit.error || JSON.stringify(edit.errors || '')), shouldbe: true, value: !!edit.ok });
    var o = new GlideRecord('x_enno_pivot_business_outcome');
    o.get(made.id);
    assertEqual({ name: 'PIV-046.06 owner: target saved as 75', shouldbe: 75, value: Number(o.getValue('target')) });
    var sec = new GlideRecordSecure('x_enno_pivot_capability');
    sec.get(capId);
    assertEqual({ name: 'PIV-046.06 owner: cannot write a capability (ACL)', shouldbe: false, value: sec.canWrite() });
    var up = W.runActionWithNote({ action: 'updateCapability', id: capId, fields: { target: 10 } });
    assertEqual({ name: 'PIV-046.06 owner: updateCapability refused', shouldbe: 'Only PIVOT admins can change measurement settings.', value: up.error || '' });
    stepResult.setOutputMessage('PIV-046.06 business owner rights match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7SecurityAdmin = Test({
    $id: Now.ID['atf-s7-sec-admin'],
    name: 'PIVOT S7 – Security: admin edits capability and locked baseline, audited (PIV-046.06)',
    description: 'As a PIVOT admin: changes a capability target, changes a locked baseline with a reason, and the baseline change is in the audit history.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-s7-sec-admin-user'],
        firstName: 'ATF',
        lastName: 'S7 admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-sec-admin-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var c = new GlideRecord('x_enno_pivot_capability');
    c.initialize();
    c.setValue('name', '[ATF S7] admin capability');
    c.setValue('source', 'store_app');
    c.setValue('active', true);
    c.setValue('installed', true);
    c.setValue('target_value', 100);
    var capId = c.insert();
    var up = W.runActionWithNote({ action: 'updateCapability', id: capId, fields: { target: 300 } });
    assertEqual({ name: 'PIV-046.06 admin: updateCapability works ' + (up.error || JSON.stringify(up.errors || '')), shouldbe: true, value: !!up.ok });
    c.get(capId);
    assertEqual({ name: 'PIV-046.06 admin: target saved as 300', shouldbe: 300, value: Number(c.getValue('target_value')) });

    var o = new GlideRecord('x_enno_pivot_business_outcome');
    o.initialize();
    o.setValue('capability', capId);
    o.setValue('objective', 'ATF Sprint 7 admin baseline check');
    o.setValue('kpi', '[ATF S7] admin KPI');
    o.setValue('direction', 'higher_better');
    o.setValue('measurement_type', 'manual');
    o.setValue('period', 'monthly');
    o.setValue('target', 150);
    o.setValue('baseline', 100);
    o.setValue('owner', gs.getUserID());
    var outId = o.insert();
    var fields = { id: outId, capability: capId, objective: 'ATF Sprint 7 admin baseline check', kpi: '[ATF S7] admin KPI', direction: 'higher_better', measurement_type: 'manual', period: 'monthly', target: 150, baseline: 90, baseline_change_reason: 'ATF Sprint 7: corrected starting value' };
    var save = W.runActionWithNote({ action: 'saveOutcome', fields: fields });
    assertEqual({ name: 'PIV-046.06 admin: changes the locked baseline ' + (save.error || JSON.stringify(save.errors || '')), shouldbe: true, value: !!save.ok });
    o.get(outId);
    assertEqual({ name: 'PIV-046.06 admin: baseline saved as 90', shouldbe: 90, value: Number(o.getValue('baseline')) });
    assertEqual({ name: 'PIV-046.06 admin: change reason records old and new value', shouldbe: true, value: String(o.getValue('baseline_change_reason')).indexOf('Baseline changed from 100 to 90') === 0 });
    var au = new GlideRecord('sys_audit');
    au.addQuery('tablename', 'x_enno_pivot_business_outcome');
    au.addQuery('documentkey', outId);
    au.addQuery('fieldname', 'baseline');
    au.query();
    assertEqual({ name: 'PIV-046.06 admin: baseline change is in the audit history', shouldbe: true, value: au.hasNext() });
    stepResult.setOutputMessage('PIV-046.06 admin rights match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

export const s7SecurityNoRole = Test({
    $id: Now.ID['atf-s7-sec-norole'],
    name: 'PIVOT S7 – Security: a user without a PIVOT role sees no records (PIV-046.06)',
    description: 'As a user with no PIVOT role: capability, opportunity, outcome and assessment queries with ACLs return nothing, and every workspace action is refused.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-s7-sec-norole-user'],
        firstName: 'ATF',
        lastName: 'S7 no role',
        fieldValues: {},
        groups: [],
        roles: [],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-s7-sec-norole-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var tables = ['x_enno_pivot_capability', 'x_enno_pivot_opportunity', 'x_enno_pivot_business_outcome', 'x_enno_pivot_assessment', 'x_enno_pivot_result', 'x_enno_pivot_roadmap_item'];
    for (var i = 0; i < tables.length; i++) {
        var plain = new GlideAggregate(tables[i]);
        plain.addAggregate('COUNT');
        plain.query();
        var total = plain.next() ? Number(plain.getAggregate('COUNT')) : 0;
        var sec = new GlideRecordSecure(tables[i]);
        sec.setLimit(1);
        sec.query();
        assertEqual({ name: 'PIV-046.06 no role: ' + tables[i] + ' shows no records (' + total + ' exist)', shouldbe: false, value: sec.next() });
    }
    assertEqual({ name: 'PIV-046.06 no role: no PIVOT viewer role', shouldbe: false, value: gs.hasRole('x_enno_pivot.viewer') });
    var acts = [{ action: 'accept', number: 'PVO_ATF_NONE' }, { action: 'saveOutcome', fields: {} }, { action: 'updateCapability', id: '', fields: {} }, { action: 'runNow' }];
    for (var j = 0; j < acts.length; j++) {
        var r = W.runActionWithNote(acts[j]);
        assertEqual({ name: 'PIV-046.06 no role: ' + acts[j].action + ' refused', shouldbe: false, value: !!r.ok });
    }
    stepResult.setOutputMessage('PIV-046.06 a user without a PIVOT role sees and changes nothing.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
