import '@servicenow/sdk/global'
import { CrossScopePrivilege } from '@servicenow/sdk/core'

// PIV-016 – read access to the product tables used by the seeded usage measures (PIV-015).
// These records were first created on the instance by the platform when the assessment read the tables;
// keys.ts maps each $id to that existing sys_id so the deploy takes them over instead of making duplicates.
// Read only: PIVOT counts rows, it never writes to these tables.

CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-incident'],
    operation: 'read',
    status: 'allowed',
    targetName: 'incident',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-problem'],
    operation: 'read',
    status: 'allowed',
    targetName: 'problem',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-change_request'],
    operation: 'read',
    status: 'allowed',
    targetName: 'change_request',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-sc_req_item'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sc_req_item',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-cab_meeting'],
    operation: 'read',
    status: 'allowed',
    targetName: 'cab_meeting',
    targetScope: '18351d53eb32120034d1eeea1206fe79',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-alm_asset'],
    operation: 'read',
    status: 'allowed',
    targetName: 'alm_asset',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-sn_customerservice_case'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sn_customerservice_case',
    targetScope: '51d811fad7223100b7490ee60e61034f',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-sys_cs_conversation'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_cs_conversation',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-pm_project'],
    operation: 'read',
    status: 'allowed',
    targetName: 'pm_project',
    targetScope: 'eabeaf98eb033a10520dfbdffdc0cd51',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-resource_plan'],
    operation: 'read',
    status: 'allowed',
    targetName: 'resource_plan',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-time_card'],
    operation: 'read',
    status: 'allowed',
    targetName: 'time_card',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-rm_story'],
    operation: 'read',
    status: 'allowed',
    targetName: 'rm_story',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-em_alert'],
    operation: 'read',
    status: 'allowed',
    targetName: 'em_alert',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
