import '@servicenow/sdk/global'
import { List, Record, default_view } from '@servicenow/sdk/core'

// PIV-003.05 – Results related list on the Assessment form (default view)
export const assessmentRelatedLists = Record({
    $id: Now.ID['assessment-related-lists'],
    table: 'sys_ui_related_list',
    data: { name: 'x_enno_pivot_assessment', view: 'Default view' },
})
Record({
    $id: Now.ID['assessment-related-list-results'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: assessmentRelatedLists, related_list: 'x_enno_pivot_result.assessment', position: 0, order_by: 'capability' },
})

// Columns of the Result list (also used by the related list): capability, score and utilization first.
List({
    table: 'x_enno_pivot_result',
    view: default_view,
    columns: ['capability', 'score', 'utilization', 'measurement_status', 'actual_value', 'target_value'],
})

// PIV-005.04 – Outcome Results related list on the Assessment form
Record({
    $id: Now.ID['assessment-related-list-outcome-results'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: assessmentRelatedLists, related_list: 'x_enno_pivot_outcome_result.assessment', position: 1, order_by: 'outcome' },
})
List({
    table: 'x_enno_pivot_outcome_result',
    view: default_view,
    columns: ['outcome', 'actual', 'target', 'improvement_pct', 'outcome_status', 'baseline'],
})

// PIV-003.07 – Assessment list default columns
List({
    table: 'x_enno_pivot_assessment',
    view: default_view,
    columns: ['number', 'run_date', 'status', 'overall_score', 'run_by'],
})
