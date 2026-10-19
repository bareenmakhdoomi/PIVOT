import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { viewer } from '../roles/roles.now'

// Store certification (Security 2): UI pages must be protected by an ACL and a role.
Acl({
    $id: Now.ID['pivot-workspace-page-read'],
    type: 'ui_page',
    name: 'x_enno_pivot_workspace',
    operation: 'read',
    roles: [viewer],
    adminOverrides: false,
    active: true,
    description: 'Only users with a PIVOT role (x_enno_pivot.viewer or a role that contains it) can open the PIVOT workspace.',
})
