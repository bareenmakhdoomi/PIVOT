import '@servicenow/sdk/global'
import {
    Table, StringColumn, ChoiceColumn, ReferenceColumn, DateTimeColumn, MultiLineTextColumn, TableNameColumn, DomainIdColumn,
} from '@servicenow/sdk/core'

export const x_enno_pivot_security_test_log = Table({
    name: 'x_enno_pivot_security_test_log',
    label: 'Security Test Log',
    display: 'number',
    audit: true,
    autoNumber: { prefix: 'PST', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:global.getNextObjNumberPadded();' }),
        check_name: StringColumn({ label: 'Check', maxLength: 160, mandatory: true }),
        result: ChoiceColumn({
            label: 'Result', mandatory: true, dropdown: 'dropdown_without_none',
            choices: { pass: { label: 'Pass', sequence: 10 }, fail: { label: 'Fail', sequence: 20 } },
        }),
        tester: ReferenceColumn({ label: 'Tester', referenceTable: 'sys_user', mandatory: true, default: 'javascript:gs.getUserID()' }),
        tested_at: DateTimeColumn({ label: 'Tested at', mandatory: true, default: 'javascript:new GlideDateTime().getDisplayValue()' }),
        role: StringColumn({ label: 'Tested role', maxLength: 100, mandatory: true }),
        table_name: TableNameColumn({ label: 'Table', mandatory: true }),
        expected_result: MultiLineTextColumn({ label: 'Expected result', maxLength: 4000, mandatory: true }),
        actual_result: MultiLineTextColumn({ label: 'Actual result', maxLength: 4000 }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
