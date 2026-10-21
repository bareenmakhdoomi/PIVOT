/*
 * PIVOT – create the 4 test users for PIV-009 (one PIVOT role each).
 * Run in Scripts - Background, scope global, on the DEV instance only.
 * Safe to re-run: existing users are reused, roles are only added if missing.
 * Sets no password – set one per user in the UI (or use impersonation).
 * Test users are NOT part of the PIVOT app (certification: no test data in the package).
 */
(function createPivotTestUsers() {
    var users = [
        ['pivot.viewer', 'PIVOT', 'Test Viewer', 'x_enno_pivot.viewer'],
        ['pivot.analyst', 'PIVOT', 'Test Analyst', 'x_enno_pivot.analyst'],
        ['pivot.bo', 'PIVOT', 'Test Business Owner', 'x_enno_pivot.business_owner'],
        ['pivot.admin', 'PIVOT', 'Test Admin', 'x_enno_pivot.admin']
    ];
    var out = [], i;
    for (i = 0; i < users.length; i++) {
        try {
            var u = new GlideRecord('sys_user');
            if (!u.get('user_name', users[i][0])) {
                u.initialize();
                u.setValue('user_name', users[i][0]);
                u.setValue('first_name', users[i][1]);
                u.setValue('last_name', users[i][2]);
                u.setValue('active', true);
                u.insert();
                out.push('Created user ' + users[i][0]);
            } else {
                out.push('User exists ' + users[i][0]);
            }
            var role = new GlideRecord('sys_user_role');
            if (!role.get('name', users[i][3])) { out.push('  ! role not found: ' + users[i][3] + ' (deploy PIVOT first)'); continue; }
            var link = new GlideRecord('sys_user_has_role');
            link.addQuery('user', u.getUniqueValue());
            link.addQuery('role', role.getUniqueValue());
            link.query();
            if (link.hasNext()) { out.push('  role already assigned: ' + users[i][3]); continue; }
            link.initialize();
            link.setValue('user', u.getUniqueValue());
            link.setValue('role', role.getUniqueValue());
            link.insert();
            out.push('  role assigned: ' + users[i][3]);
        } catch (e) {
            out.push('  ! error for ' + users[i][0] + ': ' + e);
        }
    }
    gs.print('\n' + out.join('\n'));
})();
