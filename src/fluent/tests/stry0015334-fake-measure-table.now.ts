import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015334-fake-measure-table'],
    name: 'PIVOT - Invalid measurement table reason is visible on the Result',
    description: 'STRY0015334 / STRY0015335: verifies invalid measurement tables are Not Measured with a table-specific reason and grouped status counts.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015334-fake-measure-table-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var RESULT = 'x_enno_pivot_result';
    var ASSESSMENT = 'x_enno_pivot_assessment';
    var A = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/assessment.ts');
    var capName = '[ATF STRY0015334] Fake table ' + new GlideDateTime().getNumericValue();
    var reasonCapName = '[ATF STRY0015335] Missing table ' + new GlideDateTime().getNumericValue();
    var cap = new GlideRecord(CAP);
    cap.initialize();
    cap.setValue('name', capName);
    cap.setValue('source', 'manual');
    cap.setValue('active', true);
    cap.setValue('installed', true);
    cap.setValue('measure_table', 'x_fake_table');
    cap.setValue('measure_filter', '');
    cap.setValue('date_field', 'sys_created_on');
    cap.setValue('days_back', 30);
    cap.setValue('target_value', 10);
    cap.setValue('weight', 1);
    var capId = cap.insert();
    assertEqual({ name: 'fake-table Capability fixture created', shouldbe: true, value: !!capId });
    if (!capId) return false;

    var reasonCap = new GlideRecord(CAP);
    reasonCap.initialize();
    reasonCap.setValue('name', reasonCapName);
    reasonCap.setValue('source', 'manual');
    reasonCap.setValue('active', true);
    reasonCap.setValue('installed', true);
    reasonCap.setValue('measure_table', 'u_not_real');
    reasonCap.setValue('date_field', 'sys_created_on');
    reasonCap.setValue('days_back', 30);
    reasonCap.setValue('target_value', 10);
    reasonCap.setValue('weight', 1);
    var reasonCapId = reasonCap.insert();
    assertEqual({ name: 'u_not_real Capability fixture created', shouldbe: true, value: !!reasonCapId });
    if (!reasonCapId) return false;

    var run = A.runAssessment('run_now', gs.getUserID());
    assertEqual({ name: 'assessment run starts', shouldbe: true, value: !!run.sysId });
    if (!run.sysId) return false;

    var assessment = new GlideRecord(ASSESSMENT);
    var assessmentFound = assessment.get(run.sysId);
    assertEqual({ name: 'assessment record exists', shouldbe: true, value: assessmentFound });
    if (!assessmentFound) return false;
    var runStatus = String(assessment.getValue('status'));
    var completed = runStatus === 'complete' || runStatus === 'complete_with_warnings';
    assertEqual({ name: 'assessment ends Complete', shouldbe: true, value: completed });

    var log = JSON.parse(assessment.getValue('log') || '[]');
    var logPassed = false;
    for (var i = 0; i < log.length; i++) {
        if (log[i].level === 'warn' && log[i].step === 3 &&
            log[i].message.indexOf('Not measured: ' + capName) === 0 &&
            log[i].message.indexOf('Measure table x_fake_table does not exist on this instance') >= 0) {
            logPassed = true;
            break;
        }
    }
    assertEqual({ name: 'assessment log explains the fake table was skipped', shouldbe: true, value: logPassed });

    var result = new GlideRecord(RESULT);
    result.addQuery('assessment', run.sysId);
    result.addQuery('capability', capId);
    result.setLimit(1);
    result.query();
    var resultFound = result.next();
    assertEqual({ name: 'result exists for fake-table Capability', shouldbe: true, value: resultFound });
    if (!resultFound) return false;
    var fakeTableReason = 'Measure table x_fake_table does not exist on this instance';
    var notMeasured = result.getValue('measurement_status') === 'not_measured' &&
        result.getValue('reason') === fakeTableReason;
    assertEqual({ name: 'fake-table result is Not Measured with a specific reason', shouldbe: true, value: notMeasured });

    var missingTableResult = new GlideRecord(RESULT);
    missingTableResult.addQuery('assessment', run.sysId);
    missingTableResult.addQuery('capability', reasonCapId);
    missingTableResult.setLimit(1);
    missingTableResult.query();
    var missingTableFound = missingTableResult.next();
    assertEqual({ name: 'u_not_real result exists', shouldbe: true, value: missingTableFound });
    if (!missingTableFound) return false;
    var exactReason = 'Measure table u_not_real does not exist on this instance';
    var uNotRealNotMeasured = missingTableResult.getValue('measurement_status') === 'not_measured' &&
        missingTableResult.getValue('reason') === exactReason;
    assertEqual({ name: 'u_not_real result shows the exact Not Measured reason', shouldbe: true, value: uNotRealNotMeasured });

    var groupedResults = new GlideAggregate(RESULT);
    groupedResults.addQuery('assessment', run.sysId);
    groupedResults.addAggregate('COUNT');
    groupedResults.groupBy('measurement_status');
    groupedResults.query();
    var notMeasuredGroupCount = 0;
    while (groupedResults.next()) {
        if (groupedResults.getValue('measurement_status') === 'not_measured') {
            notMeasuredGroupCount = Number(groupedResults.getAggregate('COUNT')) || 0;
        }
    }
    assertEqual({ name: 'Not Measured result group has a count', shouldbe: true, value: notMeasuredGroupCount >= 2 });

    stepResult.setOutputMessage(
        (logPassed ? 'PASS' : 'FAIL') + ': log explains the invalid measure table. ' +
        (notMeasured && uNotRealNotMeasured ? 'PASS' : 'FAIL') + ': Not Measured results show the table-specific reason. ' +
        (notMeasuredGroupCount >= 2 ? 'PASS' : 'FAIL') + ': Not Measured group count is ' + notMeasuredGroupCount +
        '. Assessment status: ' + runStatus + '.'
    );
    return completed && logPassed && notMeasured && uNotRealNotMeasured && notMeasuredGroupCount >= 2;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
