import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015329-no-cross-scope-table-writes'],
    name: 'PIVOT - No cross-scope table write privileges',
    description: 'Checks the deployed PIVOT application scope has no cross-scope table privilege with an operation other than Read.',
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
    stepResult.setOutputMessage(violations.length
        ? 'Unexpected non-Read cross-scope table privileges: ' + violations.join(', ')
        : 'No non-Read cross-scope table privileges are configured for PIVOT.');
    return violations.length === 0;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
