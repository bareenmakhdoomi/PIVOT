import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { viewer, admin } from '../roles/roles.now'

export const pivotMenu = ApplicationMenu({
    $id: Now.ID['pivot-menu'],
    title: 'PIVOT',
    hint: 'Platform Value Navigator',
    description: 'PIVOT – Platform Value Navigator',
    roles: [viewer],
    active: true,
})

// First module: opens the workspace on the Dashboard (all PIVOT roles)
Record({
    $id: Now.ID['pivot-module-workspace'],
    table: 'sys_app_module',
    data: {
        title: 'Workspace',
        application: pivotMenu,
        link_type: 'DIRECT',
        query: 'x_enno_pivot_workspace.do',
        hint: 'Open the PIVOT workspace',
        roles: [viewer],
        active: true,
        order: 100,
    },
})

// Admin-only fallback modules (tables are added in the next step)
Record({
    $id: Now.ID['pivot-module-properties'],
    table: 'sys_app_module',
    data: {
        title: 'Properties',
        application: pivotMenu,
        link_type: 'FILTER',
        name: 'sys_properties',
        filter: 'nameSTARTSWITHx_enno_pivot.',
        roles: [admin],
        active: true,
        order: 900,
    },
})
