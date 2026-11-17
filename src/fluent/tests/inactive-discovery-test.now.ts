import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-inactive-app-plugin-discovery'],
    name: 'PIVOT - Inactive apps and plugins are not installed',
    description: 'Creates installed Capability fixtures for an inactive Store app and inactive plugin, runs discovery, then verifies both remain as not-found records with installed=false and that the transition is logged.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-inactive-app-plugin-discovery-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var oldDate = '2000-01-01 00:00:00';
    var fixtures = [];
    var makeFixture = function (sourceTable, inactiveValue, sourceType) {
        var source = new GlideRecord(sourceTable);
        source.addQuery('active', inactiveValue);
        source.query();
        while (source.next()) {
            var sourceId = sourceType == 'store_app' ? source.getValue('scope') : source.getValue('id');
            if (!sourceId) continue;
            var existing = new GlideRecord(CAP);
            existing.addQuery('source', sourceType);
            existing.addQuery('source_id', sourceId);
            existing.setLimit(1);
            existing.query();
            if (existing.hasNext()) continue;
            var cap = new GlideRecord(CAP);
            cap.initialize();
            cap.setValue('name', '[ATF inactive discovery] ' + (source.getValue('name') || sourceId));
            cap.setValue('source', sourceType);
            cap.setValue('source_id', sourceId);
            cap.setValue('installed', true);
            cap.setValue('active', true);
            cap.setValue('last_discovered', oldDate);
            var capId = cap.insert();
            if (capId) {
                fixtures.push(String(capId));
                return { id: String(capId), source: sourceType, sourceId: sourceId, name: cap.getValue('name') };
            }
        }
        return null;
    };
    var app = makeFixture('sys_store_app', false, 'store_app');
    var plugin = makeFixture('v_plugin', 'inactive', 'plugin');
    assertEqual({ name: 'inactive Store app test fixture available', shouldbe: true, value: !!app });
    assertEqual({ name: 'inactive plugin test fixture available', shouldbe: true, value: !!plugin });
    if (!app || !plugin) {
        for (var c = 0; c < fixtures.length; c++) { var cleanup = new GlideRecord(CAP); if (cleanup.get(fixtures[c])) cleanup.deleteRecord(); }
        stepResult.setOutputMessage('Required inactive source records were unavailable; discovery assertions could not run.');
        return false;
    }
    try {
        var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
        var result = D.runDiscovery();
        assertEqual({ name: 'discovery completed without errors', shouldbe: true, value: result.ok });
        var verify = function (fixture, label) {
            var cap = new GlideRecord(CAP);
            var found = cap.get(fixture.id);
            assertEqual({ name: label + ' capability still exists', shouldbe: true, value: found });
            if (!found) return;
            assertEqual({ name: label + ' not marked installed', shouldbe: false, value: cap.getValue('installed') == '1' || cap.getValue('installed') == 'true' });
            assertEqual({ name: label + ' flagged not found', shouldbe: true, value: cap.getValue('not_found') == '1' || cap.getValue('not_found') == 'true' });
            var matches = new GlideRecord(CAP);
            matches.addQuery('source', fixture.source);
            matches.addQuery('source_id', fixture.sourceId);
            matches.query();
            var count = 0;
            while (matches.next()) count++;
            assertEqual({ name: label + ' has no duplicate Capability records', shouldbe: 1, value: count });
        };
        verify(app, 'inactive app');
        verify(plugin, 'inactive plugin');
        var logged = false;
        for (var i = 0; i < result.log.length; i++) {
            var match = /^Previously installed capabilities no longer discovered; marked not installed: (\\d+) \\(/.exec(result.log[i].message);
            if (match && Number(match[1]) >= 2) logged = true;
        }
        assertEqual({ name: 'previously installed app and plugin transitions are logged', shouldbe: true, value: logged });
        stepResult.setOutputMessage('Discovery excluded inactive source records, cleared their installed flags, retained them, and logged the transition.');
        return true;
    } finally {
        for (var j = 0; j < fixtures.length; j++) {
            var cleanupRecord = new GlideRecord(CAP);
            if (cleanupRecord.get(fixtures[j])) cleanupRecord.deleteRecord();
        }
    }
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
