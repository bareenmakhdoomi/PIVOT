import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { viewer, analyst, business_owner, admin } from '../roles/roles.now'

// PIV-063.08 – the PIVOT API as each role. Each assertion names the endpoint and the role, so a broken ACL or role check
// shows exactly where it fails. The REST layer adds one more check before this code: users without a PIVOT role get 403
// (REST ACL x_enno_pivot_workspace_api, role x_enno_pivot.viewer) – covered by the no-role test below.

Test({
    $id: Now.ID['atf-api-viewer'],
    name: 'PIVOT – API as viewer',
    description: 'Viewer: every read endpoint returns data; every action is refused.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-api-viewer-user'],
        firstName: 'ATF',
        lastName: 'API viewer',
        fieldValues: {},
        groups: [],
        roles: [viewer],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-api-viewer-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/api-read.ts');
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var ROLE = 'viewer';
    var req = function (q, p) { var qp = {}; for (var k in (q || {})) qp[k] = [String(q[k])]; return { queryParams: qp, pathParams: p || {} }; };
    var read = function (endpoint, fn) { var ok = true, msg = ''; try { var r = fn(); ok = r !== null && r !== undefined; } catch (e) { ok = false; msg = String(e); } assertEqual({ name: 'GET ' + endpoint + ' as ' + ROLE + ' returns data ' + msg, shouldbe: true, value: ok }); };
    var act = function (body, expectOk, expectText) {
        var r = W.runActionWithNote(body);
        var text = r.ok ? r.note : (r.error || JSON.stringify(r.errors));
        assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + (expectOk ? ' succeeds' : ' is refused'), shouldbe: expectOk, value: !!r.ok });
        if (expectText) assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + ' message', shouldbe: expectText, value: text });
    };
    var reads = function () {
        read('/dashboard', function () { return R.dashboard(); });
        read('/analytics', function () { return R.analytics(req({})); });
        read('/capabilities', function () { return R.capabilities(req({ size: 5 })); });
        read('/opportunities', function () { return R.opportunities(req({ size: 5 })); });
        read('/roadmap', function () { return R.roadmap(); });
        read('/outcomes', function () { return R.outcomes(req({ size: 5 })); });
        read('/assessments', function () { return R.assessments(req({ size: 5 })); });
        read('/assessments/running', function () { return R.running(); });
        read('/reports', function () { return R.reports(); });
        read('/properties', function () { return R.properties(); });
        read('/search', function () { return R.search(req({ q: 'PV' })); });
        read('/notifications', function () { return R.notifications(); });
        assertEqual({ name: 'GET /opportunities size 500 as ' + ROLE + ' is capped at 50', shouldbe: 50, value: R.opportunities(req({ size: 500 })).size });
    };
    reads();
    act({ action: 'accept', number: 'PVO_ATF_NONE' }, false, 'Only analysts and admins can work opportunities.');
    act({ action: 'reorder', phase: 'now', numbers: [] }, false, 'Only analysts and admins can change the roadmap order.');
    act({ action: 'saveOutcome', fields: {} }, false, 'Only business owners and admins can create outcomes.');
    act({ action: 'mapFamily', ids: [], family: 'itsm' }, false, 'Only PIVOT admins can map product families.');
    act({ action: 'runNow' }, false, 'Only PIVOT admins can start a run.');
    act({ action: 'setProp', name: 'x_enno_pivot.utilization_threshold', value: '60' }, false, 'Only PIVOT admins can change PIVOT properties.');
    var props = R.properties(), anyEditable = false;
    for (var i = 0; i < props.length; i++) if (props[i].editable) anyEditable = true;
    assertEqual({ name: 'GET /properties as viewer: nothing editable', shouldbe: false, value: anyEditable });
    stepResult.setOutputMessage('API as viewer: reads, actions and refusals match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-api-analyst'],
    name: 'PIVOT – API as analyst',
    description: 'Analyst: reads; opportunity actions pass the role check; admin actions are refused.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-api-analyst-user'],
        firstName: 'ATF',
        lastName: 'API analyst',
        fieldValues: {},
        groups: [],
        roles: [analyst],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-api-analyst-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/api-read.ts');
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var ROLE = 'analyst';
    var req = function (q, p) { var qp = {}; for (var k in (q || {})) qp[k] = [String(q[k])]; return { queryParams: qp, pathParams: p || {} }; };
    var read = function (endpoint, fn) { var ok = true, msg = ''; try { var r = fn(); ok = r !== null && r !== undefined; } catch (e) { ok = false; msg = String(e); } assertEqual({ name: 'GET ' + endpoint + ' as ' + ROLE + ' returns data ' + msg, shouldbe: true, value: ok }); };
    var act = function (body, expectOk, expectText) {
        var r = W.runActionWithNote(body);
        var text = r.ok ? r.note : (r.error || JSON.stringify(r.errors));
        assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + (expectOk ? ' succeeds' : ' is refused'), shouldbe: expectOk, value: !!r.ok });
        if (expectText) assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + ' message', shouldbe: expectText, value: text });
    };
    var reads = function () {
        read('/dashboard', function () { return R.dashboard(); });
        read('/analytics', function () { return R.analytics(req({})); });
        read('/capabilities', function () { return R.capabilities(req({ size: 5 })); });
        read('/opportunities', function () { return R.opportunities(req({ size: 5 })); });
        read('/roadmap', function () { return R.roadmap(); });
        read('/outcomes', function () { return R.outcomes(req({ size: 5 })); });
        read('/assessments', function () { return R.assessments(req({ size: 5 })); });
        read('/assessments/running', function () { return R.running(); });
        read('/reports', function () { return R.reports(); });
        read('/properties', function () { return R.properties(); });
        read('/search', function () { return R.search(req({ q: 'PV' })); });
        read('/notifications', function () { return R.notifications(); });
        assertEqual({ name: 'GET /opportunities size 500 as ' + ROLE + ' is capped at 50', shouldbe: 50, value: R.opportunities(req({ size: 500 })).size });
    };
    reads();
    act({ action: 'accept', number: 'PVO_ATF_NONE' }, false, 'Opportunity PVO_ATF_NONE was not found.');
    act({ action: 'saveOutcome', fields: {} }, false, 'Only business owners and admins can create outcomes.');
    act({ action: 'runNow' }, false, 'Only PIVOT admins can start a run.');
    act({ action: 'setProp', name: 'x_enno_pivot.utilization_threshold', value: '60' }, false, 'Only PIVOT admins can change PIVOT properties.');
    stepResult.setOutputMessage('API as analyst: reads, actions and refusals match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-api-business_owner'],
    name: 'PIVOT – API as business owner',
    description: 'Business owner: reads; all outcomes returned, none editable (the test user owns none); opportunity and admin actions refused.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-api-business_owner-user'],
        firstName: 'ATF',
        lastName: 'API business_owner',
        fieldValues: {},
        groups: [],
        roles: [business_owner],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-api-business_owner-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/api-read.ts');
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var ROLE = 'business_owner';
    var req = function (q, p) { var qp = {}; for (var k in (q || {})) qp[k] = [String(q[k])]; return { queryParams: qp, pathParams: p || {} }; };
    var read = function (endpoint, fn) { var ok = true, msg = ''; try { var r = fn(); ok = r !== null && r !== undefined; } catch (e) { ok = false; msg = String(e); } assertEqual({ name: 'GET ' + endpoint + ' as ' + ROLE + ' returns data ' + msg, shouldbe: true, value: ok }); };
    var act = function (body, expectOk, expectText) {
        var r = W.runActionWithNote(body);
        var text = r.ok ? r.note : (r.error || JSON.stringify(r.errors));
        assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + (expectOk ? ' succeeds' : ' is refused'), shouldbe: expectOk, value: !!r.ok });
        if (expectText) assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + ' message', shouldbe: expectText, value: text });
    };
    var reads = function () {
        read('/dashboard', function () { return R.dashboard(); });
        read('/analytics', function () { return R.analytics(req({})); });
        read('/capabilities', function () { return R.capabilities(req({ size: 5 })); });
        read('/opportunities', function () { return R.opportunities(req({ size: 5 })); });
        read('/roadmap', function () { return R.roadmap(); });
        read('/outcomes', function () { return R.outcomes(req({ size: 5 })); });
        read('/assessments', function () { return R.assessments(req({ size: 5 })); });
        read('/assessments/running', function () { return R.running(); });
        read('/reports', function () { return R.reports(); });
        read('/properties', function () { return R.properties(); });
        read('/search', function () { return R.search(req({ q: 'PV' })); });
        read('/notifications', function () { return R.notifications(); });
        assertEqual({ name: 'GET /opportunities size 500 as ' + ROLE + ' is capped at 50', shouldbe: 50, value: R.opportunities(req({ size: 500 })).size });
    };
    reads();
    var out = R.outcomes(req({ size: 50 })), editable = 0;
    for (var i = 0; i < out.items.length; i++) if (out.items[i].editable) editable++;
    assertEqual({ name: 'GET /outcomes as business_owner: only own outcomes editable (owns none)', shouldbe: 0, value: editable });
    act({ action: 'accept', number: 'PVO_ATF_NONE' }, false, 'Only analysts and admins can work opportunities.');
    act({ action: 'runNow' }, false, 'Only PIVOT admins can start a run.');
    act({ action: 'setProp', name: 'x_enno_pivot.utilization_threshold', value: '60' }, false, 'Only PIVOT admins can change PIVOT properties.');
    stepResult.setOutputMessage('API as business_owner: reads, actions and refusals match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-api-admin'],
    name: 'PIVOT – API as admin',
    description: 'Admin: reads; properties editable; invalid property value refused with the validation message and not saved.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-api-admin-user'],
        firstName: 'ATF',
        lastName: 'API admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-api-admin-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/api-read.ts');
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var ROLE = 'admin';
    var req = function (q, p) { var qp = {}; for (var k in (q || {})) qp[k] = [String(q[k])]; return { queryParams: qp, pathParams: p || {} }; };
    var read = function (endpoint, fn) { var ok = true, msg = ''; try { var r = fn(); ok = r !== null && r !== undefined; } catch (e) { ok = false; msg = String(e); } assertEqual({ name: 'GET ' + endpoint + ' as ' + ROLE + ' returns data ' + msg, shouldbe: true, value: ok }); };
    var act = function (body, expectOk, expectText) {
        var r = W.runActionWithNote(body);
        var text = r.ok ? r.note : (r.error || JSON.stringify(r.errors));
        assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + (expectOk ? ' succeeds' : ' is refused'), shouldbe: expectOk, value: !!r.ok });
        if (expectText) assertEqual({ name: 'POST /action ' + body.action + ' as ' + ROLE + ' message', shouldbe: expectText, value: text });
    };
    var reads = function () {
        read('/dashboard', function () { return R.dashboard(); });
        read('/analytics', function () { return R.analytics(req({})); });
        read('/capabilities', function () { return R.capabilities(req({ size: 5 })); });
        read('/opportunities', function () { return R.opportunities(req({ size: 5 })); });
        read('/roadmap', function () { return R.roadmap(); });
        read('/outcomes', function () { return R.outcomes(req({ size: 5 })); });
        read('/assessments', function () { return R.assessments(req({ size: 5 })); });
        read('/assessments/running', function () { return R.running(); });
        read('/reports', function () { return R.reports(); });
        read('/properties', function () { return R.properties(); });
        read('/search', function () { return R.search(req({ q: 'PV' })); });
        read('/notifications', function () { return R.notifications(); });
        assertEqual({ name: 'GET /opportunities size 500 as ' + ROLE + ' is capped at 50', shouldbe: 50, value: R.opportunities(req({ size: 500 })).size });
    };
    reads();
    var props = R.properties(), allEditable = true;
    for (var i = 0; i < props.length; i++) if (!props[i].editable) allEditable = false;
    assertEqual({ name: 'GET /properties as admin: editable', shouldbe: true, value: allEditable });
    var before = gs.getProperty('x_enno_pivot.utilization_threshold');
    act({ action: 'setProp', name: 'x_enno_pivot.utilization_threshold', value: '150' }, false, 'Threshold must be a whole number from 0 to 100');
    assertEqual({ name: 'POST /action setProp as admin: invalid value not saved', shouldbe: before, value: gs.getProperty('x_enno_pivot.utilization_threshold') });
    act({ action: 'accept', number: 'PVO_ATF_NONE' }, false, 'Opportunity PVO_ATF_NONE was not found.');
    stepResult.setOutputMessage('API as admin: reads, actions and refusals match the access matrix.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-api-norole'],
    name: 'PIVOT – API as a user without a PIVOT role',
    description: 'No PIVOT role: the PIVOT tables return no rows to the user. The REST ACL x_enno_pivot_workspace_api (role x_enno_pivot.viewer) answers 403 before any API code runs – check it with the REST API Explorer while impersonating pivot.norole.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-api-norole-user'],
        firstName: 'ATF',
        lastName: 'API no role',
        fieldValues: {},
        groups: [],
        roles: [],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-api-norole-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    assertEqual({ name: 'no-role user has no PIVOT role', shouldbe: false, value: gs.hasRole('x_enno_pivot.viewer') });
    var tables = ['x_enno_pivot_capability', 'x_enno_pivot_opportunity', 'x_enno_pivot_business_outcome', 'x_enno_pivot_assessment', 'x_enno_pivot_roadmap_item'];
    for (var i = 0; i < tables.length; i++) { var g = new GlideRecordSecure(tables[i]); g.setLimit(1); g.query(); assertEqual({ name: tables[i] + ' as no-role user: no rows', shouldbe: false, value: g.hasNext() }); }
    stepResult.setOutputMessage('A user without a PIVOT role gets no PIVOT data.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
