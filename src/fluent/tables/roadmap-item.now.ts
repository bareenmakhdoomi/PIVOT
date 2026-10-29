import '@servicenow/sdk/global'
import { Table, ChoiceColumn, IntegerColumn, ReferenceColumn, DomainIdColumn } from '@servicenow/sdk/core'

// PIV-004 Roadmap Item – Now / Next / Later, rebuilt every run
export const x_enno_pivot_roadmap_item = Table({
    name: 'x_enno_pivot_roadmap_item',
    label: 'Roadmap Item',
    schema: {
        assessment: ReferenceColumn({ label: 'Assessment', referenceTable: 'x_enno_pivot_assessment', readOnly: true }),
        opportunity: ReferenceColumn({ label: 'Opportunity', referenceTable: 'x_enno_pivot_opportunity', mandatory: true, readOnly: true }),
        phase: ChoiceColumn({ dropdown: 'dropdown_with_none',
            label: 'Phase', readOnly: true,
            choices: { now: { label: 'Now', sequence: 10 }, next: { label: 'Next', sequence: 20 }, later: { label: 'Later', sequence: 30 } },
        }),
        sequence: IntegerColumn({ label: 'Sequence', hint: '1 = highest priority within the phase' }),
        sys_domain: DomainIdColumn({ label: 'Domain' }),
    },
})
