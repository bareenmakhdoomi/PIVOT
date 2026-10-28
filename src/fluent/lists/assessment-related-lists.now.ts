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
