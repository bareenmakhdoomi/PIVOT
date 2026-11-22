// Run in Scripts - Background in the PIVOT application scope on a disposable development/test instance only.
// runDiscovery refreshes existing discovery Capabilities as well as exercising the temporary fixture.
// The script reads sys_store_app, sys_plugins, ua_app_family, and v_plugin; its only fixture write is a temporary
// Capability record in the PIVOT scope, removed at the end.
(function () {
    var CAP = 'x_enno_pivot_capability';
    var SCOPE = 'x_enno_pivot';
    var failures = 0;
    var inactiveCapabilityId = '';

    function report(label, passed, detail) {
        gs.info((passed ? 'PASS ' : 'FAIL ') + label + (detail ? ': ' + detail : ''));
        if (!passed) failures++;
    }

    function truthy(value) {
        return value === '1' || value === 'true';
    }

    function sourceKey(record) {
        return String(record.getValue('scope') || record.getUniqueValue());
    }

    function hasCapability(key) {
        var capability = new GlideRecord(CAP);
        capability.addQuery('source', 'store_app');
        capability.addQuery('source_id', key);
        capability.setLimit(1);
        capability.query();
        return capability.hasNext();
    }

    function hasCountLog(summary, kind) {
        var counts = kind === 'Apps' ? summary.apps : summary.plugins;
        var prefix = kind + ': found ' + counts.read + ', created ' + counts.created +
            ', updated ' + counts.updated + ', set inactive ' + counts.setInactive;
        for (var i = 0; i < summary.log.length; i++) {
            if (summary.log[i].message.indexOf(prefix) === 0) return true;
        }
        return false;
    }

    function expectedPluginCount() {
        var plugins = new GlideRecord('sys_plugins');
        if (!plugins.isValid()) return { valid: false, count: 0 };
        plugins.addQuery('active', true);
        plugins.query();
        var count = 0;
        while (plugins.next()) count++;
        return { valid: true, count: count };
    }

    try {
        var appTable = new GlideRecord('sys_store_app');
        var activeApp = null;
        var activeAppCount = 0;
        if (appTable.isValid()) {
            appTable.addQuery('active', true);
            appTable.query();
            while (appTable.next()) {
                var activeScope = String(appTable.getValue('scope') || '');
                if (activeScope === SCOPE) continue;
                activeAppCount++;
                if (!activeApp) {
                    activeApp = {
                        key: sourceKey(appTable),
                        name: String(appTable.getValue('name') || activeScope || appTable.getUniqueValue())
                    };
                }
            }
        }
        report('active test app available', !!activeApp, activeApp ? activeApp.name : 'no active non-PIVOT app found');

        var inactiveApp = null;
        var inactiveTable = new GlideRecord('sys_store_app');
        if (inactiveTable.isValid()) {
            inactiveTable.addQuery('active', false);
            inactiveTable.query();
            while (inactiveTable.next()) {
                var inactiveScope = String(inactiveTable.getValue('scope') || '');
                if (inactiveScope === SCOPE) continue;
                var candidateKey = sourceKey(inactiveTable);
                if (hasCapability(candidateKey)) continue;
                inactiveApp = {
                    key: candidateKey,
                    name: String(inactiveTable.getValue('name') || inactiveScope || inactiveTable.getUniqueValue())
                };
                break;
            }
        }
        report('inactive test app available', !!inactiveApp,
            inactiveApp ? inactiveApp.name : 'no inactive app without an existing Capability was found');

        var pluginExpected = expectedPluginCount();
        report('plugin source table available', pluginExpected.valid, 'sys_plugins');

        if (activeApp && inactiveApp && pluginExpected.valid) {
            var fixture = new GlideRecord(CAP);
            fixture.initialize();
            fixture.setValue('name', ('[STRY0015303] ' + inactiveApp.name).slice(0, 100));
            fixture.setValue('source', 'store_app');
            fixture.setValue('source_id', inactiveApp.key);
            fixture.setValue('installed', true);
            fixture.setValue('active', true);
            fixture.setValue('not_found', false);
            fixture.setValue('last_discovered', '2000-01-01 00:00:00');
            inactiveCapabilityId = String(fixture.insert() || '');
            report('inactive Capability fixture created', !!inactiveCapabilityId);

            if (inactiveCapabilityId) {
                var discovery = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts').runDiscovery();
                report('discovery completed without errors', discovery.ok);

                var appCountCorrect = discovery.apps.read === activeAppCount && hasCountLog(discovery, 'Apps');
                report('app count', appCountCorrect,
                    'expected ' + activeAppCount + ', found ' + discovery.apps.read);

                var pluginCountCorrect = discovery.plugins.read === pluginExpected.count && hasCountLog(discovery, 'Plugins');
                report('plugin count', pluginCountCorrect,
                    'expected ' + pluginExpected.count + ', found ' + discovery.plugins.read);

                var activeCapability = new GlideRecord(CAP);
                activeCapability.addQuery('source', 'store_app');
                activeCapability.addQuery('source_id', activeApp.key);
                activeCapability.query();
                var activeMatches = 0;
                var activeInstalled = false;
                while (activeCapability.next()) {
                    activeMatches++;
                    if (truthy(activeCapability.getValue('installed')) && !truthy(activeCapability.getValue('not_found'))) {
                        activeInstalled = true;
                    }
                }

                var inactiveCapability = new GlideRecord(CAP);
                var inactiveExists = inactiveCapability.get(inactiveCapabilityId);
                var inactiveNotInstalled = inactiveExists && !truthy(inactiveCapability.getValue('installed'));
                var inactiveNotFound = inactiveExists && truthy(inactiveCapability.getValue('not_found'));
                var inactiveHandled = activeMatches === 1 && activeInstalled &&
                    inactiveNotInstalled && inactiveNotFound && discovery.apps.setInactive >= 1;
                report('inactive handling', inactiveHandled,
                    'active app installed=' + activeInstalled + ', inactive app installed=' +
                    (inactiveExists ? truthy(inactiveCapability.getValue('installed')) : 'missing') +
                    ', not_found=' + (inactiveExists ? truthy(inactiveCapability.getValue('not_found')) : 'missing'));
            } else {
                report('app count', false, 'inactive Capability fixture could not be created');
                report('plugin count', false, 'inactive Capability fixture could not be created');
                report('inactive handling', false, 'inactive Capability fixture could not be created');
            }
        } else {
            report('app count', false, 'active/inactive app or plugin source table precondition failed');
            report('plugin count', false, 'active/inactive app or plugin source table precondition failed');
            report('inactive handling', false, 'active/inactive app or plugin source table precondition failed');
        }
    } catch (error) {
        report('background script execution', false, String(error));
    } finally {
        if (inactiveCapabilityId) {
            var cleanup = new GlideRecord(CAP);
            if (cleanup.get(inactiveCapabilityId) && !cleanup.deleteRecord()) {
                report('temporary Capability cleanup', false, inactiveCapabilityId);
            }
        }
    }

    gs.info(failures
        ? 'FAIL STRY0015303: ' + failures + ' check(s) failed.'
        : 'PASS STRY0015303: all checks passed.');
})();
