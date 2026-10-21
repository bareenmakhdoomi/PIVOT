import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { opportunityBefore, capabilityBefore, outcomeBefore } from '../../server/pivot/business-rules'

// PIV-020/021/030 – PIVOT rules (design B6) enforced on every write, whatever the source.
BusinessRule({
    $id: Now.ID['br-opportunity-priority'],
    name: 'PIVOT – Recalculate priority and validate opportunity',
    table: 'x_enno_pivot_opportunity',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: opportunityBefore,
    description: 'Priority = (value + business impact) ÷ effort with a plain-language reason; scores 1–5 (impact 0–5); rejection needs a reason of at least 10 characters.',
})

BusinessRule({
    $id: Now.ID['br-capability-validate'],
    name: 'PIVOT – Validate capability measurement settings',
    table: 'x_enno_pivot_capability',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: capabilityBefore,
    description: 'Days back 1–365, weight 1–5, target above 0 or empty (Not Measured), valid table and family.',
})

BusinessRule({
    $id: Now.ID['br-outcome-baseline-lock'],
    name: 'PIVOT – Validate outcome and lock baseline',
    table: 'x_enno_pivot_business_outcome',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: outcomeBefore,
    description: 'Outcome fields are valid; once a baseline exists only PIVOT admins can change it, with a reason (audited).',
})
