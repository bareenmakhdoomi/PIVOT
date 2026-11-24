import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015306-discovery-timestamps'],
    name: 'PIVOT - Discovery timestamps found Capabilities',
    description: 'Verifies Capability dictionary types/default and confirms discovery stamps each found record with the run start time and clears Not found.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015306-discovery-timestamps-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var dictionary = function (element) {
        var field = new GlideRecord('sys_dictionary');
        field.addQuery('name', 'x_enno_pivot_capability');
        field.addQuery('element', element);
        field.setLimit(1);
        field.query();
        return field.next() ? field : null;
    };

    var lastDiscovered = dictionary('last_discovered');
    assertEqual({ name: 'last_discovered dictionary field exists', shouldbe: true, value: !!lastDiscovered });
    if (lastDiscovered) {
        assertEqual({ name: 'last_discovered has Glide date/time type', shouldbe: 'glide_date_time', value: lastDiscovered.getValue('internal_type') });
    }

    var notFound = dictionary('not_found');
    assertEqual({ name: 'not_found dictionary field exists', shouldbe: true, value: !!notFound });
    if (notFound) {
        assertEqual({ name: 'not_found has true/false type', shouldbe: 'boolean', value: notFound.getValue('internal_type') });
        assertEqual({ name: 'not_found defaults to false', shouldbe: 'false', value: String(notFound.getValue('default_value')).toLowerCase() });
    }

    var runStartedAt = new GlideDateTime().getValue();
    var discovery = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var result = discovery.runDiscovery(runStartedAt);
    assertEqual({ name: 'discovery completed without errors', shouldbe: true, value: result.ok });

    var expected = result.licences.read - result.licences.skipped +
        result.apps.read - result.apps.skipped +
        result.plugins.read - result.plugins.skipped;
    assertEqual({ name: 'discovery found at least one source record', shouldbe: true, value: expected > 0 });

    var found = new GlideRecord('x_enno_pivot_capability');
    found.addQuery('last_discovered', runStartedAt);
    found.query();
    var stampedCount = 0;
    var everyRecordMarkedFound = true;
    while (found.next()) {
        stampedCount++;
        if (found.getValue('not_found') != '0' && found.getValue('not_found') != 'false') {
            everyRecordMarkedFound = false;
        }
    }
    assertEqual({ name: 'all discovered source records have the exact run start timestamp', shouldbe: expected, value: stampedCount });
    assertEqual({ name: 'discovered records have not_found=false', shouldbe: true, value: everyRecordMarkedFound });

    stepResult.setOutputMessage('Capability dictionary fields have the required types/default, and discovery stamped found records with the run start time while clearing Not found.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
