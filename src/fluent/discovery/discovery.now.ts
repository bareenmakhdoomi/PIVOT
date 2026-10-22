import '@servicenow/sdk/global'
import { ScheduledScript, CrossScopePrivilege } from '@servicenow/sdk/core'
import { discoveryJob } from '../../server/pivot/discovery'

// PIV-011 … PIV-013 – discovery on demand. An admin opens System Definition > Scheduled Jobs >
// "PIVOT – Run discovery" and clicks Execute Now. From Sprint 4 the assessment runner calls the same code
// as step 2 of every run (weekly job and Run Now).
export const discoveryOnDemand = ScheduledScript({
    $id: Now.ID['pivot-job-discovery'],
    name: 'PIVOT – Run discovery',
    active: true,
    frequency: 'on_demand',
    script: discoveryJob,
})

// PIV-016 – Read-only access to the source tables (design B5). PIVOT never writes outside its scope.
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-sn_sub_man_st_subscription_overview'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sn_sub_man_st_subscription_overview',
    targetScope: 'sn_sub_man',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-subscription_entitlement'],
    operation: 'read',
    status: 'allowed',
    targetName: 'subscription_entitlement',
    targetScope: 'sn_entitlement',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-license_details'],
    operation: 'read',
    status: 'allowed',
    targetName: 'license_details',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-ua_app_family'],
    operation: 'read',
    status: 'allowed',
    targetName: 'ua_app_family',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-sys_store_app'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_store_app',
    targetScope: 'sn_appclient',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-v_plugin'],
    operation: 'read',
    status: 'allowed',
    targetName: 'v_plugin',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
