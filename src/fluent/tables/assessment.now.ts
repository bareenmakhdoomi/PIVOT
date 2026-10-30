import '@servicenow/sdk/global'
import { IntegerColumn, Table, StringColumn, ChoiceColumn, DecimalColumn, ReferenceColumn, DateTimeColumn, DurationColumn, MultiLineTextColumn, DomainIdColumn } from '@servicenow/sdk/core'

// PIV-003 Assessment – one record per run (weekly or Run Now)
export const x_enno_pivot_assessment = Table({
    name: 'x_enno_pivot_assessment',
    label: 'Assessment',
    display: 'number',
    audit: true, // PIV-003.06: creates, changes and deletes appear in the audit history
    autoNumber: { prefix: 'PVA', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:global.getNextObjNumberPadded();' }),
        run_date: DateTimeColumn({ label: 'Run date', default: 'javascript:new GlideDateTime().getDisplayValue()' }),
        status: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Status', default: 'queued',
            choices: { queued: { label: 'Queued', sequence: 10 }, running: { label: 'Running', sequence: 20 }, complete: { label: 'Complete', sequence: 30 }, complete_with_warnings: { label: 'Completed with warnings', sequence: 35 }, failed: { label: 'Failed', sequence: 40 } },
        }),
        trigger: ChoiceColumn({ dropdown: 'dropdown_without_none',
            label: 'Trigger', default: 'weekly',
            choices: { weekly: { label: 'Weekly schedule', sequence: 10 }, run_now: { label: 'Run Now', sequence: 20 } },
        }),
        overall_score: DecimalColumn({ label: 'Overall score', hint: 'Weighted average of capability scores. Not Measured capabilities are excluded.' }),
        run_by: ReferenceColumn({ label: 'Run by', referenceTable: 'sys_user', default: 'javascript:gs.getUserID()' }),
        duration: DurationColumn({ label: 'Duration' }),
        log: MultiLineTextColumn({ label: 'Log', maxLength: 65000, attributes: { no_audit: true } }), // the run log changes many times per run – not audited
        opportunities_created: IntegerColumn({ label: 'Opportunities created', hint: 'New opportunities created by the gap rules in this run (PIV-028.02)' }),
        scored_count: IntegerColumn({ label: 'Capabilities scored' }),
        not_measured_count: IntegerColumn({ label: 'Not measured' }),
        inactive_count: IntegerColumn({ label: 'Skipped as inactive' }),
        slow_count: IntegerColumn({ label: 'Slow capabilities' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
