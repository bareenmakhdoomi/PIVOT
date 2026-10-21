import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn, DecimalColumn, ReferenceColumn, MultiLineTextColumn, DomainIdColumn } from '@servicenow/sdk/core'

// PIV-004 Opportunity – one gap found by the six gap rules
export const x_enno_pivot_opportunity = Table({
    name: 'x_enno_pivot_opportunity',
    label: 'Opportunity',
    display: 'number',
    audit: true,
    autoNumber: { prefix: 'PVO', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:global.getNextObjNumberPadded();' }),
        assessment: ReferenceColumn({ label: 'Assessment', referenceTable: 'x_enno_pivot_assessment', readOnly: true, hint: 'Last run that found or updated it' }),
        capability: ReferenceColumn({ label: 'Capability', referenceTable: 'x_enno_pivot_capability', mandatory: true, readOnly: true }),
        outcome: ReferenceColumn({ label: 'Business outcome', referenceTable: 'x_enno_pivot_business_outcome', readOnly: true }),
        type: ChoiceColumn({
            label: 'Type', readOnly: true,
            choices: {
                shelfware: { label: 'Shelfware', sequence: 10 }, idle_licences: { label: 'Idle licences', sequence: 20 },
                low_adoption: { label: 'Low adoption', sequence: 30 }, not_measured: { label: 'Not measured', sequence: 40 },
                weak_outcome: { label: 'Weak outcome', sequence: 50 }, adoption_potential: { label: 'Adoption potential', sequence: 60 },
            },
        }),
        description: MultiLineTextColumn({ label: 'Description', maxLength: 1000, readOnly: true }),
        value: IntegerColumn({ label: 'Value', hint: '1–5' }),
        effort: IntegerColumn({ label: 'Effort', hint: '1–5' }),
        business_impact: IntegerColumn({ label: 'Business impact', default: '0', hint: '0–5; 0 when there is no reliable outcome data' }),
        priority: DecimalColumn({ label: 'Priority', readOnly: true, scale: 2 }),
        priority_reason: StringColumn({ label: 'Priority reason', maxLength: 500, readOnly: true }),
        state: ChoiceColumn({
            label: 'State', default: 'open',
            choices: { open: { label: 'Open', sequence: 10 }, accepted: { label: 'Accepted', sequence: 20 }, rejected: { label: 'Rejected', sequence: 30 }, done: { label: 'Done', sequence: 40 } },
        }),
        assigned_to: ReferenceColumn({ label: 'Assigned to', referenceTable: 'sys_user' }),
        rejection_reason: StringColumn({ label: 'Rejection reason', maxLength: 500 }),
        activity_log: MultiLineTextColumn({ label: 'Activity log', maxLength: 65000, hint: 'Written by PIVOT: decisions and notes as JSON, newest last' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
