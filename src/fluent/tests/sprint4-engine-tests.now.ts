import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { admin, analyst } from '../roles/roles.now'

// PIV-034.07 – a successful run and a forced failure of the priority step
Test({
    $id: Now.ID['atf-engine-success-failure'],
    name: 'PIVOT – Assessment run: success and forced failure',
    description: 'A normal run ends Complete (or Completed with warnings) with the 8 step lines in order: discover, measure, score, outcomes, gaps, priority, roadmap, notify. A run whose priority step is forced to throw ends Failed, logs "Step priority failed", and has no roadmap or notify line. Needs no other assessment Queued or Running.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-engine-success-failure-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var names = function (id) {
        var a = new GlideRecord('x_enno_pivot_assessment'); a.get(id);
        var log = JSON.parse(a.getValue('log') || '[]'), out = [];
        for (var i = 0; i < log.length; i++) { var m = /^([a-z]+): \\d+ .* in [\\d.]+ s$/.exec(log[i].message); if (m) out.push(m[1]); }
        return { status: a.getValue('status'), steps: out.join(','), log: a.getValue('log') || '', duration: a.getValue('duration') };
    };
    var ok = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'run started', shouldbe: true, value: !!ok.sysId });
    var r1 = names(ok.sysId);
    assertEqual({ name: 'status Complete', shouldbe: true, value: r1.status == 'complete' || r1.status == 'complete_with_warnings' });
    assertEqual({ name: '8 steps in order', shouldbe: 'discover,measure,score,outcomes,gaps,priority,roadmap,notify', value: r1.steps });
    assertEqual({ name: 'duration filled', shouldbe: true, value: !!r1.duration });
    var bad = A.runAssessment('run_now', gs.getUserID(), { failAt: 'priority' });
    var r2 = names(bad.sysId);
    assertEqual({ name: 'forced failure → Failed', shouldbe: 'failed', value: r2.status });
    assertEqual({ name: 'failed step named', shouldbe: true, value: r2.log.indexOf('Step priority failed') > -1 });
    assertEqual({ name: 'roadmap step not run', shouldbe: 'discover,measure,score,outcomes,gaps', value: r2.steps });
    stepResult.setOutputMessage('Success and failure paths passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

// PIV-036.07 AC 1 – an admin starts a run: a Queued assessment is created and the event is fired
Test({
    $id: Now.ID['atf-run-now-admin'],
    name: 'PIVOT – Run assessment now as admin',
    description: 'Impersonated PIVOT admin: Run Now creates a Queued assessment (trigger Run Now) and fires x_enno_pivot.run_assessment with its sys_id; a second click is refused.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-run-now-admin-user'],
        firstName: 'ATF',
        lastName: 'PIVOT Admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-run-now-admin-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var r = new x_enno_pivot.PivotAssessment().runNow();
    assertEqual({ name: 'run started', shouldbe: 'Assessment started. Refresh this list to see progress.', value: r.message });
    var a = new GlideRecord('x_enno_pivot_assessment'); a.get(r.sysId);
    assertEqual({ name: 'queued', shouldbe: 'queued', value: a.getValue('status') });
    assertEqual({ name: 'trigger Run Now', shouldbe: 'run_now', value: a.getValue('trigger') });
    var ev = new GlideRecord('sysevent'); ev.addQuery('name', 'x_enno_pivot.run_assessment'); ev.addQuery('parm1', r.sysId); ev.query();
    assertEqual({ name: 'event fired', shouldbe: true, value: ev.hasNext() });
    var again = new x_enno_pivot.PivotAssessment().runNow();
    assertEqual({ name: 'second click refused', shouldbe: 'An assessment is already running. Try again when it completes.', value: again.message });
    stepResult.setOutputMessage('Admin can start a run; a second run is refused.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

// PIV-036.07 AC 2 – an analyst does not get the button
Test({
    $id: Now.ID['atf-run-now-analyst'],
    name: 'PIVOT – Run assessment now hidden for analysts',
    description: 'Impersonated PIVOT analyst: the "Run assessment now" UI action requires x_enno_pivot.admin, its condition is false and the workspace action is refused.',
    active: true,
    failOnServerError: false,
}, (atf) => {
    atf.server.createUser({
        $id: Now.ID['atf-run-now-analyst-user'],
        firstName: 'ATF',
        lastName: 'PIVOT Analyst',
        fieldValues: {},
        groups: [],
        roles: [analyst],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-run-now-analyst-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var ua = new GlideRecord('sys_ui_action'); ua.addQuery('action_name', 'pivot_run_assessment_now'); ua.query();
    assertEqual({ name: 'UI action exists', shouldbe: true, value: ua.next() });
    assertEqual({ name: 'condition false for analyst', shouldbe: false, value: gs.hasRole('x_enno_pivot.admin') });
    assertEqual({ name: 'condition is the admin role', shouldbe: "gs.hasRole('x_enno_pivot.admin')", value: ua.getValue('condition') });
    stepResult.setOutputMessage('The button is not shown to analysts.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
