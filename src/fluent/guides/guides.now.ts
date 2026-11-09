import '@servicenow/sdk/global'
import { Acl, UiPage } from '@servicenow/sdk/core'
import { admin, viewer } from '../roles/roles.now'

// PIV-043.01–.04 / .06 – the user and admin guides inside PIVOT. The pages are built from docs/PIVOT_*_Guide.md
// (the Word versions with screenshots, PIV-043.05, are made from the same files). Version = the app version.
UiPage({
    $id: Now.ID['pivot-user-guide-page'],
    endpoint: 'x_enno_pivot_user_guide.do',
    description: 'PIVOT user guide (all PIVOT roles)',
    category: 'general',
    direct: true,
    html: Now.include('./user-guide.html'),
})
UiPage({
    $id: Now.ID['pivot-admin-guide-page'],
    endpoint: 'x_enno_pivot_admin_guide.do',
    description: 'PIVOT admin guide (PIVOT admins)',
    category: 'general',
    direct: true,
    html: Now.include('./admin-guide.html'),
})

// Store certification (Security 2): UI pages are protected by an ACL and a role.
Acl({
    $id: Now.ID['pivot-user-guide-read'],
    type: 'ui_page',
    name: 'x_enno_pivot_user_guide',
    operation: 'read',
    roles: [viewer],
    adminOverrides: false,
    active: true,
    description: 'Every PIVOT role (x_enno_pivot.viewer or a role that contains it) can read the user guide.',
})
Acl({
    $id: Now.ID['pivot-admin-guide-read'],
    type: 'ui_page',
    name: 'x_enno_pivot_admin_guide',
    operation: 'read',
    roles: [admin],
    adminOverrides: false,
    active: true,
    description: 'Only PIVOT admins (x_enno_pivot.admin) can read the admin guide.',
})
