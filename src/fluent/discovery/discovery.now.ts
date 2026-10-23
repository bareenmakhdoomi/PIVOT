import '@servicenow/sdk/global'
import { ScheduledScript, CrossScopePrivilege } from '@servicenow/sdk/core'
import { discoveryJob } from '../../server/pivot/discovery'
import { assessmentJob } from '../../server/pivot/assessment'

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
// targetScope is a reference to sys_scope: 'global' for global tables, otherwise the ServiceNow app's scope sys_id.
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-sn_sub_man_st_subscription_overview'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sn_sub_man_st_subscription_overview',
    targetScope: '86d7bb63ff021110468365d7d3b8fe41', // sn_sub_man (sys_scope sys_id – the field is a reference)
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['pivot-xscope-read-subscription_entitlement'],
    operation: 'read',
    status: 'allowed',
    targetName: 'subscription_entitlement',
    targetScope: 'bcadabf277f311109c62f5f3cb5a992a', // sn_entitlement (sys_scope sys_id – the field is a reference)
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
    targetScope: '781f36a96fef21005be8883e6b3ee43d', // sn_appclient (sys_scope sys_id – the field is a reference)
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

// PIV-018 … PIV-025 – full assessment on demand (steps 1–6). The weekly job and Run Now arrive in Sprint 4.
export const assessmentOnDemand = ScheduledScript({
    $id: Now.ID['pivot-job-assessment'],
    name: 'PIVOT – Run assessment',
    active: true,
    frequency: 'on_demand',
    script: assessmentJob,
})
