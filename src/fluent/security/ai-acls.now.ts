import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { admin } from '../roles/roles.now'

// PIV-054.06 – the AI log is read by PIVOT admins only. It is written by the PIVOT server code (no create/write ACLs).
Acl({ $id: Now.ID['acl-ai_log-read-row-admin'], type: 'record', table: 'x_enno_pivot_ai_log', operation: 'read', decisionType: 'allow', roles: [admin], adminOverrides: true, active: true, description: 'Only PIVOT admins can read the AI log.' })
Acl({ $id: Now.ID['acl-ai_log-read-all-admin'], type: 'record', table: 'x_enno_pivot_ai_log', field: '*', operation: 'read', decisionType: 'allow', roles: [admin], adminOverrides: true, active: true, description: 'Only PIVOT admins can read the AI log fields.' })
Acl({ $id: Now.ID['acl-ai_log-delete-row-admin'], type: 'record', table: 'x_enno_pivot_ai_log', operation: 'delete', decisionType: 'allow', roles: [admin], adminOverrides: true, active: true, description: 'Only PIVOT admins can delete AI log entries.' })
