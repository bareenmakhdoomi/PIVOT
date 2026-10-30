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

// PIV-008.03: admins see Workspace, Capabilities, Needs mapping, Properties, Assessment list in that order;
// the other admin lists follow. Every module after Workspace is admin-only.
// First module: opens the workspace on the Dashboard (all PIVOT roles) – PIV-008.02
Record({
    $id: Now.ID['pivot-module-workspace'],
    table: 'sys_app_module',
    data: {
        title: 'Workspace', application: pivotMenu, link_type: 'DIRECT', query: 'x_enno_pivot_workspace.do',
        hint: 'Open the PIVOT workspace', roles: ['x_enno_pivot.viewer'], active: true, order: 100,
    },
})

// PIV-032.02 – My Opportunities: the active opportunities assigned to the signed-in user (any PIVOT role).
Record({
    $id: Now.ID['pivot-module-my-opportunities'],
    table: 'sys_app_module',
    data: {
        title: 'My Opportunities', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_opportunity',
        filter: 'assigned_to=javascript:gs.getUserID()^stateINopen,accepted,in_progress^ORDERBYDESCpriority',
        hint: 'Opportunities assigned to me that are not done or rejected', roles: ['x_enno_pivot.viewer'], active: true, order: 110,
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
// PIV-012.09 / PIV-013.04 – capability lists by source and not found (admin fallback views)
Record({
    $id: Now.ID['pivot-module-cap-licences'],
    table: 'sys_app_module',
    data: { title: 'Licences', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_capability', filter: 'source=subscription^ORDERBYname', roles: ['x_enno_pivot.admin'], active: true, order: 310 },
})
Record({
    $id: Now.ID['pivot-module-cap-apps'],
    table: 'sys_app_module',
    data: { title: 'Store apps', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_capability', filter: 'source=store_app^ORDERBYname', roles: ['x_enno_pivot.admin'], active: true, order: 320 },
})
Record({
    $id: Now.ID['pivot-module-cap-plugins'],
    table: 'sys_app_module',
    data: { title: 'Plugins', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_capability', filter: 'source=plugin^ORDERBYname', hint: 'Active for-fee plugins found by discovery. Empty until PIVOT – Run discovery has run (PIV-012.09).', roles: ['x_enno_pivot.admin'], active: true, order: 330 },
})
Record({
    $id: Now.ID['pivot-module-cap-not-found'],
    table: 'sys_app_module',
    data: { title: 'Not found in last run', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_capability', filter: 'not_found=true^ORDERBYDESClast_discovered', roles: ['x_enno_pivot.admin'], active: true, order: 340 },
})
Record({
    $id: Now.ID['pivot-module-assessments'],
    table: 'sys_app_module',
    data: { title: 'Assessment list', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_assessment', filter: 'ORDERBYDESCrun_date', roles: ['x_enno_pivot.admin'], active: true, order: 240 },
})
Record({
    $id: Now.ID['pivot-module-opportunities'],
    table: 'sys_app_module',
    data: { title: 'Opportunities', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_opportunity', filter: 'stateINopen,accepted,in_progress^ORDERBYDESCpriority', roles: ['x_enno_pivot.admin'], active: true, order: 350 },
})
Record({
    $id: Now.ID['pivot-module-gap-resolved'],
    table: 'sys_app_module',
    data: { title: 'Gap no longer detected', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_opportunity', filter: 'gap_resolved=true^stateINopen,accepted,in_progress^ORDERBYDESCsys_updated_on', hint: 'Open opportunities whose gap the last run no longer found – confirm and close them (PIV-030.05).', roles: ['x_enno_pivot.admin'], active: true, order: 355 },
})
Record({
    $id: Now.ID['pivot-module-outcomes'],
    table: 'sys_app_module',
    data: { title: 'Business Outcomes', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_business_outcome', filter: 'ORDERBYkpi', roles: ['x_enno_pivot.admin'], active: true, order: 360 },
})
Record({
    $id: Now.ID['pivot-module-security-test-logs'],
    table: 'sys_app_module',
    data: { title: 'Security Test Logs', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_security_test_log', filter: 'ORDERBYDESCtested_at', roles: ['x_enno_pivot.security_tester', 'x_enno_pivot.admin'], active: true, order: 370 },
})
Record({
    $id: Now.ID['pivot-module-security-defects'],
    table: 'sys_app_module',
    data: { title: 'Security Defects', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_security_defect', filter: 'statusINopen,in_progress^ORDERBYDESCsys_created_on', roles: ['x_enno_pivot.security_tester', 'x_enno_pivot.admin'], active: true, order: 380 },
})
Record({
    $id: Now.ID['pivot-module-properties'],
    table: 'sys_app_module',
    data: { title: 'Properties', application: pivotMenu, link_type: 'FILTER', name: 'sys_properties', filter: 'nameSTARTSWITHx_enno_pivot.', roles: ['x_enno_pivot.admin'], active: true, order: 230 },
})
