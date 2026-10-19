import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { viewer } from '../roles/roles.now'

export const pivotMenu = ApplicationMenu({
    $id: Now.ID['pivot-menu'],
    title: 'PIVOT',
    hint: 'Platform Value Navigator',
    description: 'PIVOT – Platform Value Navigator',
    roles: [viewer],
    active: true,
})

// First module: opens the workspace on the Dashboard (all PIVOT roles) – PIV-008.02
Record({
    $id: Now.ID['pivot-module-workspace'],
    table: 'sys_app_module',
    data: {
        title: 'Workspace', application: pivotMenu, link_type: 'DIRECT', query: 'x_enno_pivot_workspace.do',
        hint: 'Open the PIVOT workspace', roles: ['x_enno_pivot.viewer'], active: true, order: 100,
    },
})

// Admin-only fallback modules (PIV-008.03). Every list module has a filter (certification: module filters).
Record({
    $id: Now.ID['pivot-module-setup-separator'],
    table: 'sys_app_module',
    data: { title: 'Administration', application: pivotMenu, link_type: 'SEPARATOR', roles: ['x_enno_pivot.admin'], active: true, order: 200 },
})
Record({
    $id: Now.ID['pivot-module-capabilities'],
    table: 'sys_app_module',
    data: { title: 'Capabilities', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_capability', filter: 'active=true^ORDERBYname', roles: ['x_enno_pivot.admin'], active: true, order: 210 },
})
Record({
    $id: Now.ID['pivot-module-needs-mapping'],
    table: 'sys_app_module',
    data: { title: 'Needs mapping', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_capability', filter: 'active=true^product_familyISEMPTY^ORDERBYname', roles: ['x_enno_pivot.admin'], active: true, order: 220 },
})
Record({
    $id: Now.ID['pivot-module-assessments'],
    table: 'sys_app_module',
    data: { title: 'Assessments', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_assessment', filter: 'ORDERBYDESCrun_date', roles: ['x_enno_pivot.admin'], active: true, order: 230 },
})
Record({
    $id: Now.ID['pivot-module-opportunities'],
    table: 'sys_app_module',
    data: { title: 'Opportunities', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_opportunity', filter: 'stateINopen,accepted^ORDERBYDESCpriority', roles: ['x_enno_pivot.admin'], active: true, order: 240 },
})
Record({
    $id: Now.ID['pivot-module-outcomes'],
    table: 'sys_app_module',
    data: { title: 'Business Outcomes', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_business_outcome', filter: 'ORDERBYkpi', roles: ['x_enno_pivot.admin'], active: true, order: 250 },
})
Record({
    $id: Now.ID['pivot-module-properties'],
    table: 'sys_app_module',
    data: { title: 'Properties', application: pivotMenu, link_type: 'FILTER', name: 'sys_properties', filter: 'nameSTARTSWITHx_enno_pivot.', roles: ['x_enno_pivot.admin'], active: true, order: 900 },
})
