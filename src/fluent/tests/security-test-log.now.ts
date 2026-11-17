import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-security-test-log'],
    name: 'PIVOT - Security test logging and defect creation',
    description: 'Pass logs include tester and date without creating defects. Failed logs create one defect containing the tested role, table, and expected result, and updates do not duplicate it.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-security-test-log-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var createLog = function(name, result) {
        var log = new GlideRecord('x_enno_pivot_security_test_log');
        log.initialize();
        log.setValue('check_name', name);
        log.setValue('result', result);
        log.setValue('role', 'x_enno_pivot.admin');
        log.setValue('table_name', 'x_enno_pivot_capability');
        log.setValue('expected_result', 'The capability is readable only to authorized users.');
        log.setValue('actual_result', result === 'pass' ? 'Access was denied.' : 'Access was granted.');
        return log.insert();
    };
    var defectFor = function(logId) {
        var defect = new GlideRecord('x_enno_pivot_security_defect');
        defect.addQuery('test_log', logId);
        defect.query();
        return defect.next() ? defect : null;
    };
    var countDefects = function(logId) {
        var defect = new GlideRecord('x_enno_pivot_security_defect');
        defect.addQuery('test_log', logId);
        defect.query();
        var count = 0;
        while (defect.next()) count++;
        return count;
    };

    var suffix = gs.generateGUID();
    var passId = createLog('[ATF] Security pass ' + suffix, 'pass');
    var passLog = new GlideRecord('x_enno_pivot_security_test_log');
    passLog.get(passId);
    assertEqual({ name: 'pass log records tester', shouldbe: true, value: !!passLog.getValue('tester') });
    assertEqual({ name: 'pass log records date', shouldbe: true, value: !!passLog.getValue('tested_at') });
    assertEqual({ name: 'pass does not create defect', shouldbe: 0, value: countDefects(passId) });

    var failId = createLog('[ATF] Security fail ' + suffix, 'fail');
    var defect = defectFor(failId);
    assertEqual({ name: 'failed check creates defect', shouldbe: true, value: !!defect });
    if (defect) {
        assertEqual({ name: 'defect has tested role', shouldbe: 'x_enno_pivot.admin', value: defect.getValue('role') });
        assertEqual({ name: 'defect has table', shouldbe: 'x_enno_pivot_capability', value: defect.getValue('table_name') });
        assertEqual({ name: 'defect has expected result', shouldbe: 'The capability is readable only to authorized users.', value: defect.getValue('expected_result') });
    }

    var failedLog = new GlideRecord('x_enno_pivot_security_test_log');
    failedLog.get(failId);
    failedLog.setValue('actual_result', 'Access remained granted after the check was repeated.');
    failedLog.update();
    defect = defectFor(failId);
    assertEqual({ name: 'failed log update does not duplicate defect', shouldbe: 1, value: countDefects(failId) });
    if (defect) assertEqual({ name: 'defect receives latest actual result', shouldbe: 'Access remained granted after the check was repeated.', value: defect.getValue('actual_result') });

    stepResult.setOutputMessage('Security test log and defect scenarios passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
