import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015329-no-cross-scope-table-writes'],
    name: 'PIVOT - Cross-scope privileges are Allowed and table-read-only',
    description: 'Checks every deployed PIVOT cross-scope privilege is Allowed and no table privilege grants an operation other than Read.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015329-no-cross-scope-table-writes-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var scope = new GlideRecord('sys_scope');
    scope.addQuery('scope', 'x_enno_pivot');
    scope.setLimit(1);
    scope.query();
    var foundScope = scope.next();
    assertEqual({ name: 'PIVOT application scope exists', shouldbe: true, value: foundScope });
    if (!foundScope) {
        stepResult.setOutputMessage('PIVOT application scope was not found; privilege assertions could not run.');
        return false;
    }

    var allPrivileges = new GlideRecord('sys_scope_privilege');
    allPrivileges.addQuery('source_scope', scope.getUniqueValue());
    allPrivileges.query();
    var privilegeCount = 0;
    var notAllowed = [];
    while (allPrivileges.next()) {
        privilegeCount++;
        if (allPrivileges.getValue('status') !== 'allowed') {
            notAllowed.push(allPrivileges.getValue('target_name') + ' (' +
                allPrivileges.getValue('operation') + ', ' +
                allPrivileges.getValue('status') + ')');
        }
    }
    assertEqual({
        name: 'PIVOT cross-scope privilege entries exist',
        shouldbe: true,
        value: privilegeCount > 0
    });
    assertEqual({
        name: 'every PIVOT cross-scope privilege is Allowed',
        shouldbe: 0,
        value: notAllowed.length
    });

    var nonReadTables = new GlideRecord('sys_scope_privilege');
    nonReadTables.addQuery('source_scope', scope.getUniqueValue());
    nonReadTables.addQuery('target_type', 'sys_db_object');
    nonReadTables.addQuery('operation', '!=', 'read');
    nonReadTables.query();
    var violations = [];
    while (nonReadTables.next()) {
        violations.push(nonReadTables.getValue('target_name') + ' (' +
            nonReadTables.getValue('operation') + ', ' +
            nonReadTables.getValue('status') + ')');
    }
    assertEqual({
        name: 'no non-Read cross-scope table privileges',
        shouldbe: 0,
        value: violations.length
    });
    stepResult.setOutputMessage(notAllowed.length || violations.length
        ? (notAllowed.length ? 'Privileges not Allowed: ' + notAllowed.join(', ') : '') +
            (notAllowed.length && violations.length ? '; ' : '') +
            (violations.length ? 'Non-Read table privileges: ' + violations.join(', ') : '')
        : 'All ' + privilegeCount + ' PIVOT cross-scope privileges are Allowed; no non-Read table privileges are configured.');
    return notAllowed.length === 0 && violations.length === 0;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
