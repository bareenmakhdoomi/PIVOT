import '@servicenow/sdk/global'
import { Table, BooleanColumn, DecimalColumn, ReferenceColumn, DomainIdColumn } from '@servicenow/sdk/core'

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
        score: DecimalColumn({ label: 'Score', readOnly: true, hint: '0–100. Empty = Not Measured' }),
        utilization: DecimalColumn({ label: 'Utilization %', readOnly: true }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
