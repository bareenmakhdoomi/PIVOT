import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { pivotMenu } from './menu.now'

// PIV-054.06 AC 2 – AI usage: AI suggestions of the last 30 days, grouped by skill (admins only).
Record({
    $id: Now.ID['pivot-module-ai-usage'],
    table: 'sys_app_module',
    data: {
        title: 'AI usage', application: pivotMenu, link_type: 'FILTER', name: 'x_enno_pivot_ai_log',
        filter: 'sys_created_onRELATIVEGT@dayofweek@ago@30^GROUPBYskill^ORDERBYDESCsys_created_on',
        hint: 'AI suggestions and decisions of the last 30 days, by skill', roles: ['x_enno_pivot.admin'], active: true, order: 290,
    },
})
