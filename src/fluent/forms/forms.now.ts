import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

// Default platform forms (admin fallback views; the main UI is the PIVOT workspace)
Form({
    table: 'x_enno_pivot_capability',
    view: default_view,
    sections: [
        { caption: 'Capability', content: [{ layout: 'two-column', leftElements: [{ field: 'number', type: 'table_field' }, { field: 'name', type: 'table_field' }, { field: 'product_family', type: 'table_field' }, { field: 'source', type: 'table_field' }, { field: 'active', type: 'table_field' }], rightElements: [{ field: 'licensed', type: 'table_field' }, { field: 'installed', type: 'table_field' }, { field: 'entitled_count', type: 'table_field' }, { field: 'allocated_count', type: 'table_field' }, { field: 'app_scope', type: 'table_field' }] }] },
        { caption: 'Measurement', content: [{ layout: 'two-column', leftElements: [{ field: 'measure_table', type: 'table_field' }, { field: 'date_field', type: 'table_field' }, { field: 'days_back', type: 'table_field' }], rightElements: [{ field: 'target_value', type: 'table_field' }, { field: 'weight', type: 'table_field' }] }] },
        { caption: 'Measurement filter', content: [{ layout: 'one-column', elements: [{ field: 'measure_filter', type: 'table_field' }] }] },
        { caption: 'Discovery', content: [{ layout: 'two-column', leftElements: [{ field: 'last_discovered', type: 'table_field' }, { field: 'source_id', type: 'table_field' }, { field: 'version', type: 'table_field' }, { field: 'linked_app', type: 'table_field' }], rightElements: [{ field: 'not_found', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
    ],
})

Form({
    table: 'x_enno_pivot_assessment',
    view: default_view,
    sections: [
        { caption: 'Assessment', content: [{ layout: 'two-column', leftElements: [{ field: 'number', type: 'table_field' }, { field: 'run_date', type: 'table_field' }, { field: 'trigger', type: 'table_field' }, { field: 'run_by', type: 'table_field' }], rightElements: [{ field: 'status', type: 'table_field' }, { field: 'overall_score', type: 'table_field' }, { field: 'duration', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
        { caption: 'Run summary', content: [{ layout: 'two-column', leftElements: [{ field: 'scored_count', type: 'table_field' }, { field: 'not_measured_count', type: 'table_field' }], rightElements: [{ field: 'inactive_count', type: 'table_field' }, { field: 'slow_count', type: 'table_field' }] }] },
        { caption: 'Log', content: [{ layout: 'one-column', elements: [{ field: 'log', type: 'table_field' }] }] },
    ],
})

Form({
    table: 'x_enno_pivot_result',
    view: default_view,
    sections: [
        { caption: 'Result', content: [{ layout: 'two-column', leftElements: [{ field: 'assessment', type: 'table_field' }, { field: 'capability', type: 'table_field' }, { field: 'licensed', type: 'table_field' }, { field: 'installed', type: 'table_field' }, { field: 'weight', type: 'table_field' }], rightElements: [{ field: 'measurement_status', type: 'table_field' }, { field: 'actual_value', type: 'table_field' }, { field: 'target_value', type: 'table_field' }, { field: 'score', type: 'table_field' }, { field: 'reason', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
        { caption: 'Measurement', content: [{ layout: 'two-column', leftElements: [{ field: 'measure_table', type: 'table_field' }, { field: 'filter_used', type: 'table_field' }, { field: 'days_back', type: 'table_field' }, { field: 'duration_ms', type: 'table_field' }], rightElements: [{ field: 'entitled_count', type: 'table_field' }, { field: 'allocated_count', type: 'table_field' }, { field: 'utilization', type: 'table_field' }, { field: 'over_allocated', type: 'table_field' }] }] },
    ],
})

Form({
    table: 'x_enno_pivot_opportunity',
    view: default_view,
    sections: [
        { caption: 'Opportunity', content: [{ layout: 'two-column', leftElements: [{ field: 'number', type: 'table_field' }, { field: 'capability', type: 'table_field' }, { field: 'type', type: 'table_field' }, { field: 'assessment', type: 'table_field' }, { field: 'outcome', type: 'table_field' }], rightElements: [{ field: 'state', type: 'table_field' }, { field: 'assigned_to', type: 'table_field' }, { field: 'priority', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
        { caption: 'Description', content: [{ layout: 'one-column', elements: [{ field: 'description', type: 'table_field' }] }] },
        { caption: 'Priority', content: [{ layout: 'two-column', leftElements: [{ field: 'value', type: 'table_field' }, { field: 'business_impact', type: 'table_field' }, { field: 'effort', type: 'table_field' }], rightElements: [{ field: 'priority_reason', type: 'table_field' }] }] },
        { caption: 'Decision', content: [{ layout: 'one-column', elements: [{ field: 'rejection_reason', type: 'table_field' }] }] },
    ],
})

Form({
    table: 'x_enno_pivot_roadmap_item',
    view: default_view,
    sections: [
        { caption: 'Roadmap item', content: [{ layout: 'two-column', leftElements: [{ field: 'assessment', type: 'table_field' }, { field: 'opportunity', type: 'table_field' }], rightElements: [{ field: 'phase', type: 'table_field' }, { field: 'sequence', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
    ],
})

Form({
    table: 'x_enno_pivot_business_outcome',
    view: default_view,
    sections: [
        { caption: 'Business outcome', content: [{ layout: 'two-column', leftElements: [{ field: 'capability', type: 'table_field' }, { field: 'kpi', type: 'table_field' }, { field: 'direction', type: 'table_field' }, { field: 'period', type: 'table_field' }], rightElements: [{ field: 'owner', type: 'table_field' }, { field: 'status', type: 'table_field' }, { field: 'important_objective', type: 'table_field' }, { field: 'low_volume_expected', type: 'table_field' }] }] },
        { caption: 'Objective', content: [{ layout: 'one-column', elements: [{ field: 'objective', type: 'table_field' }, { field: 'expected_benefit', type: 'table_field' }] }] },
        { caption: 'Measurement', content: [{ layout: 'two-column', leftElements: [{ field: 'measurement_type', type: 'table_field' }, { field: 'kpi_table', type: 'table_field' }, { field: 'kpi_aggregate', type: 'table_field' }, { field: 'kpi_field', type: 'table_field' }], rightElements: [{ field: 'baseline', type: 'table_field' }, { field: 'baseline_date', type: 'table_field' }, { field: 'current_value', type: 'table_field' }, { field: 'target', type: 'table_field' }] }] },
        { caption: 'Manual value', content: [{ layout: 'two-column', leftElements: [{ field: 'manual_value', type: 'table_field' }], rightElements: [{ field: 'manual_value_date', type: 'table_field' }] }] },
        { caption: 'KPI filter and baseline change', content: [{ layout: 'one-column', elements: [{ field: 'kpi_filter', type: 'table_field' }, { field: 'baseline_change_reason', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
    ],
})

Form({
    table: 'x_enno_pivot_outcome_result',
    view: default_view,
    sections: [
        { caption: 'Outcome result', content: [{ layout: 'two-column', leftElements: [{ field: 'assessment', type: 'table_field' }, { field: 'outcome', type: 'table_field' }, { field: 'outcome_status', type: 'table_field' }], rightElements: [{ field: 'baseline', type: 'table_field' }, { field: 'actual', type: 'table_field' }, { field: 'target', type: 'table_field' }, { field: 'improvement_pct', type: 'table_field' }, { field: 'sys_domain', type: 'table_field' }] }] },
    ],
})
