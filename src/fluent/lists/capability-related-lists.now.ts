import '@servicenow/sdk/global'
import { List, Record, default_view } from '@servicenow/sdk/core'

// PIV-005.04 – Business Outcomes related list on the Capability form (default view)
export const capabilityRelatedLists = Record({
    $id: Now.ID['capability-related-lists'],
    table: 'sys_ui_related_list',
    data: { name: 'x_enno_pivot_capability', view: 'Default view' },
})
Record({
    $id: Now.ID['capability-related-list-outcomes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: capabilityRelatedLists, related_list: 'x_enno_pivot_business_outcome.capability', position: 0, order_by: 'kpi' },
})

// Columns of the Business Outcome list (also used by the related list)
List({
    table: 'x_enno_pivot_business_outcome',
    view: default_view,
    columns: ['kpi', 'objective', 'measurement_type', 'baseline', 'current_value', 'target', 'status', 'owner'],
})
