import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { admin } from '../roles/roles.now'

Test({
    $id: Now.ID['atf-stry0015322-editable-measurement-target'],
    name: 'PIVOT - Assessment uses the saved Capability target',
    description: 'Runs an assessment at target 100, changes the Capability target to 150 as an admin, then verifies the next assessment stores target 150 and scores against it.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015322-editable-measurement-target-setup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.initialize();
    cap.setValue('name', '[ATF] STRY0015322 editable target ' + gs.generateGUID());
    cap.setValue('source', 'manual');
    cap.setValue('installed', true);
    cap.setValue('active', true);
    cap.setValue('measure_table', 'incident');
    cap.setValue('measure_filter', 'active=true');
    cap.setValue('date_field', 'sys_created_on');
    cap.setValue('days_back', 30);
    cap.setValue('target_value', 100);
    cap.setValue('weight', 1);
    outputs.record_id = cap.insert();
    outputs.table = 'x_enno_pivot_capability';
    assertEqual({ name: 'test Capability created with target 100', shouldbe: true, value: !!outputs.record_id });
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({
        $id: Now.ID['atf-stry0015322-editable-measurement-target-admin'],
        firstName: 'ATF',
        lastName: 'Editable Target Admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015322-editable-measurement-target-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var id = outputs.record_id;
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var first = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'first assessment completes', shouldbe: true, value: first.ok });
    var firstResult = new GlideRecord('x_enno_pivot_result');
    firstResult.addQuery('assessment', first.sysId);
    firstResult.addQuery('capability', id);
    firstResult.setLimit(1);
    firstResult.query();
    assertEqual({ name: 'first assessment records target 100', shouldbe: true, value: firstResult.next() && Number(firstResult.getValue('target_value')) === 100 });

    var changed = W.runActionWithNote({ action: 'updateCapability', id: id, fields: { target: '150' } });
    assertEqual({ name: 'admin can change target to 150', shouldbe: true, value: !!changed.ok });
    var cap = new GlideRecord('x_enno_pivot_capability');
    assertEqual({ name: 'Capability stores target 150', shouldbe: true, value: cap.get(id) && Number(cap.getValue('target_value')) === 150 });

    var second = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'next assessment completes', shouldbe: true, value: second.ok });
    var nextResult = new GlideRecord('x_enno_pivot_result');
    nextResult.addQuery('assessment', second.sysId);
    nextResult.addQuery('capability', id);
    nextResult.setLimit(1);
    nextResult.query();
    assertEqual({ name: 'next assessment records the updated target', shouldbe: true, value: nextResult.next() && Number(nextResult.getValue('target_value')) === 150 });
    var actual = Number(nextResult.getValue('actual_value'));
    var expectedScore = Math.round(Math.min(100, actual / 150 * 100));
    assertEqual({ name: 'next assessment score uses target 150', shouldbe: expectedScore, value: Number(nextResult.getValue('score')) });

    var cleanup = new GlideRecord('x_enno_pivot_result');
    cleanup.addQuery('capability', id);
    cleanup.query();
    while (cleanup.next()) cleanup.deleteRecord();
    cap.get(id);
    cap.deleteRecord();
    stepResult.setOutputMessage('The next assessment stored target 150 and scored against the updated Capability field value.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
