import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015309-repeat-discovery'],
    name: 'PIVOT - Repeat discovery does not create duplicates',
    description: 'STRY0015309: runs discovery twice without instance changes, verifies Capability count is unchanged, and checks second-run created counts and log entries for licences, apps, and plugins.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015309-repeat-discovery-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var countCapabilities = function() {
        var records = new GlideRecord(CAP);
        records.query();
        var count = 0;
        while (records.next()) count++;
        return count;
    };
    var first = D.runDiscovery();
    assertEqual({ name: 'first discovery completes without errors', shouldbe: true, value: first.ok });
    if (!first.ok) return false;
    var countAfterFirst = countCapabilities();

    var second = D.runDiscovery();
    assertEqual({ name: 'second discovery completes without errors', shouldbe: true, value: second.ok });
    if (!second.ok) return false;
    var countAfterSecond = countCapabilities();
    assertEqual({ name: 'Capability count is unchanged on repeat discovery', shouldbe: countAfterFirst, value: countAfterSecond });
    assertEqual({ name: 'second run creates no licence Capabilities', shouldbe: 0, value: second.licences.created });
    assertEqual({ name: 'second run creates no app Capabilities', shouldbe: 0, value: second.apps.created });
    assertEqual({ name: 'second run creates no plugin Capabilities', shouldbe: 0, value: second.plugins.created });

    var hasCreatedZeroLog = function(prefix) {
        for (var i = 0; i < second.log.length; i++) {
            var message = second.log[i].message;
            if (message.indexOf(prefix) === 0 && message.indexOf(', created 0,') !== -1) return true;
        }
        return false;
    };
    assertEqual({ name: 'licence discovery log reports created 0', shouldbe: true, value: hasCreatedZeroLog('Licenses: read ') });
    assertEqual({ name: 'app discovery log reports created 0', shouldbe: true, value: hasCreatedZeroLog('Apps: found ') });
    assertEqual({ name: 'plugin discovery log reports created 0', shouldbe: true, value: hasCreatedZeroLog('Plugins: found ') });

    stepResult.setOutputMessage('Capability count stayed at ' + countAfterSecond + '; the second discovery created no licence, app, or plugin Capabilities.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
