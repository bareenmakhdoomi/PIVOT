import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { opportunityBefore, capabilityBefore, outcomeBefore, roadmapItemDefaults, assessmentBefore, resultBefore, roadmapItemBefore } from '../../server/pivot/business-rules'

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

// PIV-004.05 – New from the Roadmap Items related list: pre-fill the assessment from the opportunity.
BusinessRule({
    $id: Now.ID['br-roadmap-item-defaults-display'],
    name: 'PIVOT – Roadmap item: show the opportunity assessment on a new item',
    table: 'x_enno_pivot_roadmap_item',
    when: 'display',
    order: 100,
    active: true,
    condition: 'current.isNewRecord()',
    script: roadmapItemDefaults,
    description: 'When a new roadmap item is opened from an opportunity, the assessment is filled in from that opportunity.',
})

BusinessRule({
    $id: Now.ID['br-roadmap-item-defaults-insert'],
    name: 'PIVOT – Roadmap item: copy the opportunity assessment on insert',
    table: 'x_enno_pivot_roadmap_item',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    script: roadmapItemDefaults,
    description: 'If the assessment is empty, it is copied from the opportunity when the roadmap item is saved.',
})

BusinessRule({
    $id: Now.ID['br-assessment-validate'],
    name: 'PIVOT – Validate assessment',
    table: 'x_enno_pivot_assessment',
    when: 'before',
    action: ['insert', 'update'],
    order: 90,
    active: true,
    script: assessmentBefore,
    description: 'PIV-003.01: overall score must be between 0 and 100.',
})

BusinessRule({
    $id: Now.ID['br-result-validate'],
    name: 'PIVOT – Validate result',
    table: 'x_enno_pivot_result',
    when: 'before',
    action: ['insert', 'update'],
    order: 90,
    active: true,
    script: resultBefore,
    description: 'PIV-003.04: score must be between 0 and 100.',
})

BusinessRule({
    $id: Now.ID['br-roadmap-item-validate'],
    name: 'PIVOT – Validate roadmap item',
    table: 'x_enno_pivot_roadmap_item',
    when: 'before',
    action: ['insert', 'update'],
    order: 90,
    active: true,
    script: roadmapItemBefore,
    description: 'PIV-004.04: sequence must be 0 or greater.',
})
