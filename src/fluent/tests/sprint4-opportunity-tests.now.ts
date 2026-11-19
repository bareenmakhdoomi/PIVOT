import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { analyst, viewer } from '../roles/roles.now'


// PIV-032.05 AC 1 – an analyst changes state and assigned to and saves; the rejection rule holds.
Test({
    $id: Now.ID['atf-opportunity-analyst'],
    name: 'PIVOT – Opportunity management as analyst',
    description: 'Impersonated analyst: New → Accepted with Assigned to = self is saved and a work note records the change; Rejected without a reason is blocked; Done cannot be set from New.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['atf-opportunity-analyst-setup'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.newRecord(); cap.setValue('name', '[ATF] Opportunity capability'); cap.setValue('source', 'manual'); cap.setValue('active', true);
    var capId = cap.insert();
    var opp = new GlideRecord('x_enno_pivot_opportunity');
    opp.newRecord();
    opp.setValue('capability', capId); opp.setValue('type', 'low_adoption'); opp.setValue('state', 'open');
    opp.setValue('short_description', '[ATF] Opportunity'); opp.setValue('description', '[ATF] Opportunity for role tests');
    opp.setValue('value', 3); opp.setValue('effort', 3);
    outputs.record_id = opp.insert();
    outputs.table = 'x_enno_pivot_opportunity';
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);` })
    atf.server.createUser({
        $id: Now.ID['atf-opportunity-analyst-user'],
        firstName: 'ATF',
        lastName: 'Analyst',
        fieldValues: {},
        groups: [],
        roles: [analyst],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-opportunity-analyst-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var find = function () { var g = new GlideRecordSecure('x_enno_pivot_opportunity'); g.addQuery('short_description', '[ATF] Opportunity'); g.orderByDesc('sys_created_on'); g.query(); return g.next() ? g : null; };
    var opp = find();
    assertEqual({ name: 'analyst can read the opportunity', shouldbe: true, value: !!opp });
    assertEqual({ name: 'analyst can write the opportunity', shouldbe: true, value: opp.canWrite() });
    var id = opp.getUniqueValue();
    opp.setValue('state', 'accepted');
    opp.setValue('assigned_to', gs.getUserID());
    opp.update();
    var chk = new GlideRecord('x_enno_pivot_opportunity'); chk.get(id);
    assertEqual({ name: 'state saved', shouldbe: 'accepted', value: chk.getValue('state') });
    assertEqual({ name: 'assigned to saved', shouldbe: gs.getUserID(), value: chk.getValue('assigned_to') });
    var j = new GlideRecord('sys_journal_field');
    j.addQuery('element_id', id); j.addQuery('element', 'work_notes'); j.addQuery('value', 'STARTSWITH', 'State changed from New to Accepted by');
    j.query();
    assertEqual({ name: 'work note records the change', shouldbe: true, value: j.hasNext() });
    opp = find(); opp.setValue('state', 'rejected'); opp.setValue('rejection_reason', ''); opp.update();
    chk.get(id);
    assertEqual({ name: 'reject without reason is blocked', shouldbe: 'accepted', value: chk.getValue('state') });
    opp = find(); opp.setValue('state', 'in_progress'); opp.update();
    chk.get(id);
    assertEqual({ name: 'Accepted → In progress', shouldbe: 'in_progress', value: chk.getValue('state') });
    opp = find(); opp.setValue('state', 'done'); opp.update();
    opp = find(); opp.setValue('state', 'accepted'); opp.update();
    chk.get(id);
    assertEqual({ name: 'Done can only be reopened', shouldbe: 'done', value: chk.getValue('state') });
    opp = find(); opp.setValue('state', 'open'); opp.update();
    chk.get(id);
    assertEqual({ name: 'Reopen → New', shouldbe: 'open', value: chk.getValue('state') });
    stepResult.setOutputMessage('Analyst can work the opportunity; state flow and rejection rule hold.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

// PIV-032.05 AC 2 / PIV-032.04 – a viewer sees the opportunity but every field is read-only and nothing can be saved.
Test({
    $id: Now.ID['atf-opportunity-viewer'],
    name: 'PIVOT – Opportunity is read-only for viewers',
    description: 'Impersonated viewer: can read the opportunity; cannot write or delete it; every field is read-only; an attempted update changes nothing.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['atf-opportunity-viewer-setup'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.newRecord(); cap.setValue('name', '[ATF] Opportunity capability'); cap.setValue('source', 'manual'); cap.setValue('active', true);
    var capId = cap.insert();
    var opp = new GlideRecord('x_enno_pivot_opportunity');
    opp.newRecord();
    opp.setValue('capability', capId); opp.setValue('type', 'low_adoption'); opp.setValue('state', 'open');
    opp.setValue('short_description', '[ATF] Opportunity'); opp.setValue('description', '[ATF] Opportunity for role tests');
    opp.setValue('value', 3); opp.setValue('effort', 3);
    outputs.record_id = opp.insert();
    outputs.table = 'x_enno_pivot_opportunity';
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);` })
    atf.server.createUser({
        $id: Now.ID['atf-opportunity-viewer-user'],
        firstName: 'ATF',
        lastName: 'Viewer',
        fieldValues: {},
        groups: [],
        roles: [viewer],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-opportunity-viewer-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var opp = new GlideRecordSecure('x_enno_pivot_opportunity');
    opp.addQuery('short_description', '[ATF] Opportunity'); opp.orderByDesc('sys_created_on'); opp.query();
    assertEqual({ name: 'viewer can read the opportunity', shouldbe: true, value: opp.next() });
    assertEqual({ name: 'no write (no Update button)', shouldbe: false, value: opp.canWrite() });
    assertEqual({ name: 'no delete (no Delete button)', shouldbe: false, value: opp.canDelete() });
    var fields = ['state', 'assignment_group', 'assigned_to', 'value', 'effort', 'business_impact', 'rejection_reason', 'work_notes', 'priority', 'priority_reason', 'short_description', 'description', 'activity_log'];
    for (var i = 0; i < fields.length; i++) assertEqual({ name: fields[i] + ' is read-only', shouldbe: false, value: opp.getElement(fields[i]).canWrite() });
    var id = opp.getUniqueValue();
    opp.setValue('state', 'accepted');
    opp.update();
    var chk = new GlideRecord('x_enno_pivot_opportunity'); chk.get(id);
    assertEqual({ name: 'attempted update changed nothing', shouldbe: 'open', value: chk.getValue('state') });
    stepResult.setOutputMessage('Viewer can only read the opportunity.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
