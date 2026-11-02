import '@servicenow/sdk/global'
import {
    Table, StringColumn, ChoiceColumn, ReferenceColumn, MultiLineTextColumn, TableNameColumn, DomainIdColumn,
} from '@servicenow/sdk/core'

export const x_enno_pivot_security_defect = Table({
    name: 'x_enno_pivot_security_defect',
    label: 'Security Defect',
    display: 'number',
    audit: true,
    autoNumber: { prefix: 'PSD', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:global.getNextObjNumberPadded();' }),
        test_log: ReferenceColumn({ label: 'Failed test', referenceTable: 'x_enno_pivot_security_test_log', mandatory: true }),
        status: ChoiceColumn({
            label: 'Status', mandatory: true, default: 'open', dropdown: 'dropdown_without_none',
            choices: { open: { label: 'Open', sequence: 10 }, in_progress: { label: 'In progress', sequence: 20 }, resolved: { label: 'Resolved', sequence: 30 }, closed: { label: 'Closed', sequence: 40 } },
        }),
        role: StringColumn({ label: 'Tested role', maxLength: 100, mandatory: true }),
        table_name: TableNameColumn({ label: 'Table', mandatory: true }),
        expected_result: MultiLineTextColumn({ label: 'Expected result', maxLength: 4000, mandatory: true }),
        actual_result: MultiLineTextColumn({ label: 'Actual result', maxLength: 4000 }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
