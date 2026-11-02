import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const validateEntitledCount = BusinessRule({
    $id: Now.ID['validate_entitled_count'],
    name: 'Validate Entitled Count',
    table: 'x_enno_pivot_capability',
    when: 'before',
    action: ['insert', 'update'],
    order: 90,
    active: true,
    script: `(function executeRule(current, previous /*null when async*/) {
        var count = Number(current.getValue('entitled_count'));

        if (!isNaN(count) && count < 0) {
            gs.addErrorMessage('Entitled count cannot be negative');
            current.entitled_count.setError('Entitled count cannot be negative');
            current.setAbortAction(true);
        }
    })(current, previous);`
})