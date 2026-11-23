import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015301-exclude-pivot-app'],
    name: 'PIVOT - Exclude its own Store app from discovery',
    description: 'Verifies the active x_enno_pivot Store app is excluded, no Capability is created for it, and discovery logs the exclusion.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015301-exclude-pivot-app-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var app = new GlideRecord('sys_store_app');
    app.addQuery('scope', 'x_enno_pivot');
    app.addQuery('active', true);
    app.setLimit(1);
    app.query();
    var hasActivePivotApp = app.next();
    assertEqual({ name: 'active PIVOT Store app is present', shouldbe: true, value: hasActivePivotApp });
    if (!hasActivePivotApp) {
        stepResult.setOutputMessage('The active x_enno_pivot Store app was not found; exclusion assertions could not run.');
        return false;
    }

    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var result = D.runDiscovery();
    assertEqual({ name: 'discovery completed without errors', shouldbe: true, value: result.ok });

    var capability = new GlideRecord('x_enno_pivot_capability');
    capability.addQuery('source', 'store_app');
    capability.addQuery('source_id', 'x_enno_pivot');
    capability.query();
    var capabilityCount = 0;
    while (capability.next()) capabilityCount++;
    assertEqual({ name: 'no PIVOT Store app Capability exists', shouldbe: 0, value: capabilityCount });

    var hasExpectedLog = false;
    for (var i = 0; i < result.log.length; i++) {
        if (result.log[i].message.indexOf('1 app excluded: x_enno_pivot') !== -1) {
            hasExpectedLog = true;
            break;
        }
    }
    assertEqual({ name: 'discovery log reports one excluded PIVOT app', shouldbe: true, value: hasExpectedLog });
    stepResult.setOutputMessage('Discovery excluded x_enno_pivot, created no Capability for it, and logged "1 app excluded: x_enno_pivot".');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
