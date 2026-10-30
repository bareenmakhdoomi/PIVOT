import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const createSecurityDefect = BusinessRule({
    $id: Now.ID['br-security-test-defect'],
    name: 'PIVOT - Create security defect for failed test',
    table: 'x_enno_pivot_security_test_log',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: `(function executeRule(current, previous) {
    if (current.getValue('result') !== 'fail') return;

    var defect = new GlideRecord('x_enno_pivot_security_defect');
    defect.addQuery('test_log', current.getUniqueValue());
    defect.query();

    if (defect.next()) {
        defect.setValue('role', current.getValue('role'));
        defect.setValue('table_name', current.getValue('table_name'));
        defect.setValue('expected_result', current.getValue('expected_result'));
        defect.setValue('actual_result', current.getValue('actual_result'));
        if (!previous || previous.getValue('result') !== 'fail') defect.setValue('status', 'open');
        defect.update();
        return;
    }

    defect.initialize();
    defect.setValue('test_log', current.getUniqueValue());
    defect.setValue('status', 'open');
    defect.setValue('role', current.getValue('role'));
    defect.setValue('table_name', current.getValue('table_name'));
    defect.setValue('expected_result', current.getValue('expected_result'));
    defect.setValue('actual_result', current.getValue('actual_result'));
    defect.insert();
})(current, previous);`,
})
