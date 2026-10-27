import '@servicenow/sdk/global'
import { List, Record, default_view } from '@servicenow/sdk/core'

// PIV-004.05 – Roadmap Items related list on the Opportunity form (end-of-form related list, default view).
export const opportunityRelatedLists = Record({
    $id: Now.ID['opportunity-related-lists'],
    table: 'sys_ui_related_list',
    data: { name: 'x_enno_pivot_opportunity', view: 'Default view' },
})
Record({
    $id: Now.ID['opportunity-related-list-roadmap-items'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: opportunityRelatedLists, related_list: 'x_enno_pivot_roadmap_item.opportunity', position: 0, order_by: 'sequence' },
})

// Columns of the Roadmap Item list (also used by the related list): phase and sequence first.
List({
    table: 'x_enno_pivot_roadmap_item',
    view: default_view,
    columns: ['phase', 'sequence', 'assessment', 'opportunity'],
})
