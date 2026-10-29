import '@servicenow/sdk/global'
import { BooleanColumn, Table, StringColumn, ChoiceColumn, IntegerColumn, DecimalColumn, ReferenceColumn, MultiLineTextColumn, DomainIdColumn, GenericColumn } from '@servicenow/sdk/core'

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
        short_description: StringColumn({ label: 'Short description', maxLength: 160, readOnly: true }),
        description: MultiLineTextColumn({ label: 'Description', maxLength: 1000, readOnly: true }),
        measured_value: StringColumn({ label: 'Measured value', maxLength: 100, readOnly: true, hint: 'The value that triggered the gap in the last run (PIV-028.07)' }),
        gap_resolved: BooleanColumn({ label: 'Gap resolved', readOnly: true, default: 'false', hint: 'Set by the assessment run when the gap is no longer detected; the state is left for an analyst to confirm (PIV-030.05)' }),
        value: IntegerColumn({ label: 'Value', hint: '1–5' }),
        effort: IntegerColumn({ label: 'Effort', hint: '1–5' }),
        business_impact: IntegerColumn({ label: 'Business impact', hint: '0–5 from the linked outcome: Below target 3, On target 1, Improved 0. Empty = no outcome data, not counted (PIV-031.02).' }),
        priority: DecimalColumn({ label: 'Priority', readOnly: true, scale: 2 }),
        priority_reason: StringColumn({ label: 'Priority reason', maxLength: 500, readOnly: true }),
        state: ChoiceColumn({
            label: 'State', default: 'open',
            // PIV-032.01 – New → Accepted → In progress → Done, Rejected from any active state; Done/Rejected only reopen.
            // The value of New stays 'open' so existing records and reports keep working.
            choices: { open: { label: 'New', sequence: 10 }, accepted: { label: 'Accepted', sequence: 20 }, in_progress: { label: 'In progress', sequence: 30 }, done: { label: 'Done', sequence: 40 }, rejected: { label: 'Rejected', sequence: 50 } },
        }),
        // PIV-032.02 – owner of the action; with a group, only its members can be chosen
        assignment_group: ReferenceColumn({ label: 'Assignment group', referenceTable: 'sys_user_group', referenceQual: 'active=true' }),
        assigned_to: ReferenceColumn({
            label: 'Assigned to', referenceTable: 'sys_user', useReferenceQualifier: 'advanced',
            referenceQual: 'javascript:new x_enno_pivot.PivotOpportunityRefQual().assignedTo(current)',
            attributes: { ref_qual_elements: 'assignment_group' },
        }),
        rejection_reason: StringColumn({ label: 'Rejection reason', maxLength: 500 }),
        work_notes: GenericColumn({ label: 'Work notes', columnType: 'journal_input' }), // PIV-032.01 – who changed the state
        activity_log: MultiLineTextColumn({ label: 'Activity log', maxLength: 65000, hint: 'Written by PIVOT: decisions and notes as JSON, newest last' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
