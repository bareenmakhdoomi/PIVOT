import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015334-fake-measure-table'],
    name: 'PIVOT - Assessment skips an invalid measurement table',
    description: 'STRY0015334: runs an assessment with one Capability using x_fake_table and verifies the assessment completes, the log explains the skipped measurement, and its result is Not Measured.',
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
            log[i].message.indexOf('Measure table not found') >= 0) {
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
    var notMeasured = result.getValue('measurement_status') === 'not_measured' &&
        result.getValue('reason') === 'Measure table not found';
    assertEqual({ name: 'fake-table result is Not Measured', shouldbe: true, value: notMeasured });

    stepResult.setOutputMessage(
        (logPassed ? 'PASS' : 'FAIL') + ': assessment log entry reports Measure table not found. ' +
        (notMeasured ? 'PASS' : 'FAIL') + ': capability status is Not Measured. Assessment status: ' + runStatus + '.'
    );
    return completed && logPassed && notMeasured;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
