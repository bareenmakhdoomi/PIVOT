import '@servicenow/sdk/global'
import { Table, BooleanColumn, DecimalColumn, ReferenceColumn, DomainIdColumn, ChoiceColumn, StringColumn, IntegerColumn } from '@servicenow/sdk/core'

// PIV-003 Result – one row per capability per assessment (snapshot)
export const x_enno_pivot_result = Table({
    name: 'x_enno_pivot_result',
    label: 'Result',
    schema: {
        assessment: ReferenceColumn({ label: 'Assessment', referenceTable: 'x_enno_pivot_assessment', mandatory: true, readOnly: true }),
        capability: ReferenceColumn({ label: 'Capability', referenceTable: 'x_enno_pivot_capability', mandatory: true, readOnly: true }),
        licensed: BooleanColumn({ label: 'Licensed', readOnly: true }),
        installed: BooleanColumn({ label: 'Installed', readOnly: true }),
        actual_value: DecimalColumn({ label: 'Actual value', readOnly: true }),
        target_value: DecimalColumn({ label: 'Target value', readOnly: true }),
        score: DecimalColumn({ label: 'Score', readOnly: true, hint: 'Score = actual / target x 100, capped at 100. Licensed but not installed scores 0; missing data shows Not Measured (empty, not 0).' }),
        utilization: DecimalColumn({ label: 'Utilization %', readOnly: true, hint: 'Utilization = allocated / purchased x 100. Empty when no purchased count exists.' }),
        measurement_status: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Measurement status', readOnly: true, default: 'not_measured',
            choices: { measured: { label: 'Measured', sequence: 10 }, not_measured: { label: 'Not measured', sequence: 20 }, not_installed: { label: 'Licensed, not installed', sequence: 30 } },
        }),
        reason: StringColumn({ label: 'Reason', maxLength: 255, readOnly: true }),
        measure_table: StringColumn({ label: 'Measure table', maxLength: 80, readOnly: true }),
        filter_used: StringColumn({ label: 'Filter used', maxLength: 1000, readOnly: true }),
        days_back: IntegerColumn({ label: 'Days back', readOnly: true }),
        weight: IntegerColumn({ label: 'Weight', readOnly: true }),
        entitled_count: IntegerColumn({ label: 'Purchased count', readOnly: true }),
        allocated_count: IntegerColumn({ label: 'Allocated count', readOnly: true }),
        over_allocated: BooleanColumn({ label: 'Over-allocated', readOnly: true, default: 'false', hint: 'True when utilization is above 100%.' }),
        duration_ms: IntegerColumn({ label: 'Duration (ms)', readOnly: true }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
