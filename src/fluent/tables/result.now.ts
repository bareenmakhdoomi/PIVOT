import '@servicenow/sdk/global'
import { Table, BooleanColumn, DecimalColumn, ReferenceColumn, DomainIdColumn, ChoiceColumn, StringColumn, IntegerColumn } from '@servicenow/sdk/core'

// PIV-003 Result – one row per capability per assessment (snapshot)
export const x_enno_pivot_result = Table({
    name: 'x_enno_pivot_result',
    label: 'Result',
    schema: {
        assessment: ReferenceColumn({ label: 'Assessment', referenceTable: 'x_enno_pivot_assessment', mandatory: true }),
        capability: ReferenceColumn({ label: 'Capability', referenceTable: 'x_enno_pivot_capability', mandatory: true }),
        licensed: BooleanColumn({ label: 'Licensed' }),
        installed: BooleanColumn({ label: 'Installed' }),
        actual_value: DecimalColumn({ label: 'Actual value' }),
        target_value: DecimalColumn({ label: 'Target value' }),
        score: DecimalColumn({ label: 'Score', hint: 'Score = actual / target x 100, capped at 100. Licensed but not installed scores 0; missing data shows Not Measured (empty, not 0).' }),
        utilization: DecimalColumn({ label: 'Utilization %', hint: 'Utilization = allocated / purchased x 100. Empty when no purchased count exists.' }),
        measurement_status: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Measurement status', default: 'not_measured',
            choices: { measured: { label: 'Measured', sequence: 10 }, not_measured: { label: 'Not measured', sequence: 20 }, not_installed: { label: 'Licensed, not installed', sequence: 30 } },
        }),
        reason: StringColumn({ label: 'Reason', maxLength: 255 }),
        measure_table: StringColumn({ label: 'Measure table', maxLength: 80 }),
        filter_used: StringColumn({ label: 'Filter used', maxLength: 1000 }),
        days_back: IntegerColumn({ label: 'Days back' }),
        weight: IntegerColumn({ label: 'Weight' }),
        entitled_count: IntegerColumn({ label: 'Purchased count' }),
        allocated_count: IntegerColumn({ label: 'Allocated count' }),
        over_allocated: BooleanColumn({ label: 'Over-allocated', default: 'false', hint: 'True when utilization is above 100%.' }),
        duration_ms: IntegerColumn({ label: 'Duration (ms)' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
