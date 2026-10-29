import '@servicenow/sdk/global'
import { Table, ChoiceColumn, DecimalColumn, ReferenceColumn, DomainIdColumn, StringColumn } from '@servicenow/sdk/core'

// PIV-005 Outcome Result – one row per outcome per assessment (snapshot)
export const x_enno_pivot_outcome_result = Table({
    name: 'x_enno_pivot_outcome_result',
    label: 'Outcome Result',
    schema: {
        assessment: ReferenceColumn({ label: 'Assessment', referenceTable: 'x_enno_pivot_assessment', readOnly: true, mandatory: true }),
        outcome: ReferenceColumn({ label: 'Business Outcome', referenceTable: 'x_enno_pivot_business_outcome', mandatory: true, readOnly: true }),
        capability: ReferenceColumn({ label: 'Capability', referenceTable: 'x_enno_pivot_capability', readOnly: true, hint: 'Capability of the business outcome when it was measured (PIV-026.02).' }),
        baseline: DecimalColumn({ label: 'Baseline', readOnly: true }),
        actual: DecimalColumn({ label: 'Actual', readOnly: true }),
        target: DecimalColumn({ label: 'Target', readOnly: true }),
        improvement_pct: DecimalColumn({ label: 'Improvement %', readOnly: true }),
        outcome_status: ChoiceColumn({
            label: 'Outcome status', readOnly: true, default: 'not_measured',
            hint: 'On target: actual meets or beats the target. Improved: better than the baseline but not at target. Below target: equal to or worse than the baseline. Not measured: no baseline, no actual or no target.',
            choices: { improved: { label: 'Improved', sequence: 10 }, on_target: { label: 'On target', sequence: 20 }, below_target: { label: 'Below target', sequence: 30 }, not_measured: { label: 'Not measured', sequence: 40 } },
        }),
        reason: StringColumn({ label: 'Reason', maxLength: 255, readOnly: true }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
