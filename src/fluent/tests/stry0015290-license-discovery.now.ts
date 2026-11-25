import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015290-license-discovery'],
    name: 'PIVOT - Discovered subscriptions are licensed',
    description: 'Runs discovery and verifies subscription licensing, discovery counts, and per-subscription error isolation.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015290-license-discovery-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');

    var isolatedCounts = { read: 0, created: 0, updated: 0, skipped: 0 };
    var isolatedLog = [];
    D.processLicenseRecord('failed-subscription-id', function() { return 'Failed subscription'; }, isolatedCounts, function(level, message) {
        isolatedLog.push(level + ': ' + message);
    }, function() {
        throw new Error('simulated save failure');
    });
    D.processLicenseRecord('successful-subscription-id', function() { return 'Successful subscription'; }, isolatedCounts, function(level, message) {
        isolatedLog.push(level + ': ' + message);
    }, function() {
        isolatedCounts.created++;
    });
    assertEqual({ name: 'failed subscription sys_id and error are logged', shouldbe: true, value: isolatedLog.length === 1 && isolatedLog[0].indexOf('failed-subscription-id') >= 0 && isolatedLog[0].indexOf('simulated save failure') >= 0 });
    assertEqual({ name: 'later subscriptions continue after a save error', shouldbe: '2:1:1', value: isolatedCounts.read + ':' + isolatedCounts.skipped + ':' + isolatedCounts.created });

    var result = D.runDiscovery();
    assertEqual({ name: 'discovery completed without errors', shouldbe: true, value: result.ok });
    var expectedLicenseLog = 'Licenses: read ' + result.licences.read + ', created ' + result.licences.created + ', updated ' + result.licences.updated;
    var hasLicenseSummary = result.log.some(function(entry) {
        return entry.message.indexOf(expectedLicenseLog) === 0;
    });
    assertEqual({ name: 'discovery logs license read, created, and updated counts', shouldbe: true, value: hasLicenseSummary });

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
        // Hand-made capabilities (no source ID) are left to the admin and are not counted here.
        if (!licensed.getValue('source_id')) continue;
        licensedCount++;
        if (licensed.getValue('source') != 'subscription' ||
            (licensed.getValue('not_found') != '0' && licensed.getValue('not_found') != 'false')) {
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
