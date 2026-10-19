import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, DecimalColumn, ReferenceColumn, DateTimeColumn, DurationColumn, MultiLineTextColumn, DomainIdColumn } from '@servicenow/sdk/core'

// PIV-003 Assessment – one record per run (weekly or Run Now)
export const x_enno_pivot_assessment = Table({
    name: 'x_enno_pivot_assessment',
    label: 'Assessment',
    display: 'number',
    autoNumber: { prefix: 'PVA', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true, default: 'javascript:getNextObjNumberPadded();' }),
        run_date: DateTimeColumn({ label: 'Run date', readOnly: true }),
        status: ChoiceColumn({
            label: 'Status', readOnly: true, default: 'queued',
            choices: { queued: { label: 'Queued', sequence: 10 }, running: { label: 'Running', sequence: 20 }, complete: { label: 'Complete', sequence: 30 }, failed: { label: 'Failed', sequence: 40 } },
        }),
        trigger: ChoiceColumn({
            label: 'Trigger', readOnly: true, default: 'weekly',
            choices: { weekly: { label: 'Weekly schedule', sequence: 10 }, run_now: { label: 'Run Now', sequence: 20 } },
        }),
        overall_score: DecimalColumn({ label: 'Overall score', readOnly: true, hint: 'Platform Value Score for this run' }),
        run_by: ReferenceColumn({ label: 'Run by', referenceTable: 'sys_user', readOnly: true }),
        duration: DurationColumn({ label: 'Duration', readOnly: true }),
        log: MultiLineTextColumn({ label: 'Log', maxLength: 8000, readOnly: true }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
