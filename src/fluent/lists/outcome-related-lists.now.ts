import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// PIV-026.08 – Outcome Results related list on the Business Outcome form, newest first
export const outcomeRelatedLists = Record({
    $id: Now.ID['outcome-related-lists'],
    table: 'sys_ui_related_list',
    data: { name: 'x_enno_pivot_business_outcome', view: 'Default view' },
})
Record({
    $id: Now.ID['outcome-related-list-results'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: outcomeRelatedLists, related_list: 'x_enno_pivot_outcome_result.outcome', position: 0, filter: 'ORDERBYDESCsys_created_on' },
})

// PIV-027.05 – status colours (dark text on a light background keeps WCAG AA contrast in light and dark themes)
Record({ $id: Now.ID['style-outcome-result-on_target'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_outcome_result', element: 'outcome_status', value: 'on_target', style: 'background-color:#d9f2e3;color:#0b5d2a;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-result-improved'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_outcome_result', element: 'outcome_status', value: 'improved', style: 'background-color:#dce8fb;color:#123f8c;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-result-below_target'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_outcome_result', element: 'outcome_status', value: 'below_target', style: 'background-color:#fbe0e0;color:#8a1c1c;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-result-not_measured'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_outcome_result', element: 'outcome_status', value: 'not_measured', style: 'background-color:#ececf0;color:#3d4250;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-on_target'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_business_outcome', element: 'status', value: 'on_target', style: 'background-color:#d9f2e3;color:#0b5d2a;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-improved'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_business_outcome', element: 'status', value: 'improved', style: 'background-color:#dce8fb;color:#123f8c;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-below_target'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_business_outcome', element: 'status', value: 'below_target', style: 'background-color:#fbe0e0;color:#8a1c1c;font-weight:600;' } })
Record({ $id: Now.ID['style-outcome-not_measured'], table: 'sys_ui_style', data: { name: 'x_enno_pivot_business_outcome', element: 'status', value: 'not_measured', style: 'background-color:#ececf0;color:#3d4250;font-weight:600;' } })
