import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015290-license-discovery'],
    name: 'PIVOT - Discovered subscriptions are licensed',
    description: 'Runs discovery and verifies every current subscription is licensed, the License source records are current, and the licensed=true count matches the number discovered.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015290-license-discovery-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var result = D.runDiscovery();
    assertEqual({ name: 'discovery completed without errors', shouldbe: true, value: result.ok });

    var expected = result.licences.read - result.licences.skipped;
    var currentCount = 0;
    var current = new GlideRecord(CAP);
    current.addQuery('source', 'subscription');
    current.addQuery('not_found', false);
    current.addNotNullQuery('source_id');
    current.query();
    var everyCurrentSubscriptionLicensed = true;
    while (current.next()) {
        currentCount++;
        if (current.getValue('licensed') != '1' && current.getValue('licensed') != 'true') {
            everyCurrentSubscriptionLicensed = false;
        }
    }
    assertEqual({ name: 'all current subscription Capabilities are licensed', shouldbe: true, value: everyCurrentSubscriptionLicensed });
    assertEqual({ name: 'current subscription count matches discovered subscriptions', shouldbe: expected, value: currentCount });

    var licensedCount = 0;
    var onlyCurrentSubscriptionsLicensed = true;
    var licensed = new GlideRecord(CAP);
    licensed.addQuery('licensed', true);
    licensed.query();
    while (licensed.next()) {
        licensedCount++;
        if (licensed.getValue('source') != 'subscription' ||
            (licensed.getValue('not_found') != '0' && licensed.getValue('not_found') != 'false') ||
            !licensed.getValue('source_id')) {
            onlyCurrentSubscriptionsLicensed = false;
        }
    }
    assertEqual({ name: 'licensed=true records are current discovered subscriptions only', shouldbe: true, value: onlyCurrentSubscriptionsLicensed });
    assertEqual({ name: 'licensed=true count matches subscriptions discovered in this run', shouldbe: expected, value: licensedCount });

    stepResult.setOutputMessage('Discovered subscription Capabilities are licensed and the licensed=true filter count matches this discovery run.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
