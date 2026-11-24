import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015302-discovery-count-logs'],
    name: 'PIVOT - Discover every activated plugin',
    description: 'STRY0015297: verifies _fromPlugins reads every active sys_plugins row, creates or updates exactly one Plugin Capability per plugin, and falls back to the plugin ID when name is empty. Also checks the full discovery app/plugin count logs.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015302-discovery-count-logs-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var pluginSource = new GlideRecord('sys_plugins');
    pluginSource.addQuery('active', true);
    pluginSource.query();
    var activePlugins = [];
    while (pluginSource.next()) {
        var pluginId = String(pluginSource.getValue('source') || pluginSource.getUniqueValue());
        activePlugins.push({
            id: pluginId,
            name: String(pluginSource.getValue('name') || pluginId)
        });
    }

    assertEqual({ name: 'active sys_plugins rows are available', shouldbe: true, value: activePlugins.length > 0 });
    if (!activePlugins.length) {
        stepResult.setOutputMessage('No active sys_plugins rows are available; plugin discovery assertions could not run.');
        return false;
    }

    var beforeCounts = {};
    var existingPluginCaps = new GlideRecord('x_enno_pivot_capability');
    existingPluginCaps.addQuery('source', 'plugin');
    existingPluginCaps.query();
    while (existingPluginCaps.next()) {
        var existingPluginId = String(existingPluginCaps.getValue('source_id') || '');
        if (existingPluginId) {
            var beforeCountKey = '$' + existingPluginId;
            beforeCounts[beforeCountKey] = (beforeCounts[beforeCountKey] || 0) + 1;
        }
    }

    var pluginResult = D._fromPlugins();
    assertEqual({ name: '_fromPlugins completes without errors', shouldbe: true, value: pluginResult.ok });
    assertEqual({ name: 'every active sys_plugins record is read', shouldbe: activePlugins.length, value: pluginResult.plugins.read });
    assertEqual({
        name: 'every active plugin Capability is created or updated',
        shouldbe: activePlugins.length,
        value: pluginResult.plugins.created + pluginResult.plugins.updated
    });
    assertEqual({ name: 'active plugin records are not skipped', shouldbe: 0, value: pluginResult.plugins.skipped });
    var capabilityProbe = new GlideRecord('x_enno_pivot_capability');
    assertEqual({
        name: 'Capability table has the source_id field used by plugin discovery',
        shouldbe: true,
        value: capabilityProbe.isValidField('source_id')
    });

    var allPluginsHaveInstalledCapability = true;
    var firstInstalledFailure = '';
    var noNewPluginDuplicates = true;
    var firstDuplicateFailure = '';
    for (var p = 0; p < activePlugins.length; p++) {
        var pluginCaps = new GlideRecord('x_enno_pivot_capability');
        pluginCaps.addQuery('source', 'plugin');
        pluginCaps.addQuery('source_id', activePlugins[p].id);
        pluginCaps.query();
        var afterCount = 0;
        var matchingRecords = [];
        var hasInstalledCapability = false;
        var capabilityFailure = '';
        while (pluginCaps.next()) {
            afterCount++;
            var source = String(pluginCaps.getValue('source'));
            matchingRecords.push('sys_id="' + String(pluginCaps.getUniqueValue()) + '", source="' + source + '"');
            var actualName = String(pluginCaps.getValue('name'));
            var active = String(pluginCaps.getValue('active'));
            var installed = String(pluginCaps.getValue('installed'));
            var notFound = String(pluginCaps.getValue('not_found'));
            if (actualName === activePlugins[p].name &&
                (installed == '1' || installed == 'true') &&
                (active == '1' || active == 'true') &&
                (notFound == '0' || notFound == 'false')) {
                hasInstalledCapability = true;
            } else if (!capabilityFailure && actualName !== activePlugins[p].name) {
                capabilityFailure = 'expected name "' + activePlugins[p].name + '", actual name "' + actualName + '"';
            } else if (!capabilityFailure && active != '1' && active != 'true') {
                capabilityFailure = 'expected active=true, actual active="' + active + '"';
            } else if (!capabilityFailure && installed != '1' && installed != 'true') {
                capabilityFailure = 'expected installed=true, actual installed="' + installed + '"';
            } else if (!capabilityFailure && notFound != '0' && notFound != 'false') {
                capabilityFailure = 'expected not_found=false, actual not_found="' + notFound + '"';
            }
        }
        if (!hasInstalledCapability) {
            allPluginsHaveInstalledCapability = false;
            if (!firstInstalledFailure) {
                firstInstalledFailure = 'pluginId "' + activePlugins[p].id +
                    '": expected at least one installed Capability named "' + activePlugins[p].name + '"' +
                    (capabilityFailure ? '; ' + capabilityFailure : '; no matching Capability found');
            }
        }

        var beforeCount = beforeCounts['$' + activePlugins[p].id] || 0;
        var expectedAfterCount = Math.max(1, beforeCount);
        if (afterCount !== expectedAfterCount) {
            noNewPluginDuplicates = false;
            if (!firstDuplicateFailure) {
                firstDuplicateFailure = 'pluginId "' + activePlugins[p].id + '": before count ' + beforeCount +
                    ', expected after count ' + expectedAfterCount + ', actual after count ' + afterCount +
                    (afterCount > 1 ? '; matching records: ' + matchingRecords.join('; ') : '');
            }
        }
    }
    assertEqual({
        name: 'every active plugin has an installed Capability with its name or ID' +
            (firstInstalledFailure ? ' (first failure: ' + firstInstalledFailure + ')' : ''),
        shouldbe: true,
        value: allPluginsHaveInstalledCapability
    });
    assertEqual({
        name: '_fromPlugins does not create duplicate plugin Capabilities' +
            (firstDuplicateFailure ? ' (first failure: ' + firstDuplicateFailure + ')' : ''),
        shouldbe: true,
        value: noNewPluginDuplicates
    });
    assertEqual({
        name: 'empty plugin name falls back to its plugin ID',
        shouldbe: 'com.example.plugin',
        value: D._pluginName('', 'com.example.plugin')
    });

    var result = D.runDiscovery();
    var hasLine = function(prefix) {
        for (var i = 0; i < result.log.length; i++) {
            if (result.log[i].message.indexOf(prefix) === 0) return true;
        }
        return false;
    };

    var appSummary = 'Apps: found ' + result.apps.read + ', created ' + result.apps.created +
        ', updated ' + result.apps.updated + ', set inactive ' + result.apps.setInactive;
    var pluginSummary = 'Plugins: found ' + result.plugins.read + ', created ' + result.plugins.created +
        ', updated ' + result.plugins.updated + ', set inactive ' + result.plugins.setInactive;
    assertEqual({ name: 'Apps summary includes found, created, updated, and set-inactive counts', shouldbe: true, value: hasLine(appSummary) });
    assertEqual({ name: 'Plugins summary includes found, created, updated, and set-inactive counts', shouldbe: true, value: hasLine(pluginSummary) });

    var noPluginsWarning = false;
    for (var j = 0; j < result.log.length; j++) {
        if (result.log[j].level === 'warn' && result.log[j].message.indexOf('No active plugins found') === 0) {
            noPluginsWarning = true;
        }
    }
    if (result.plugins.read === 0) {
        assertEqual({ name: 'zero discovered plugins produces the required warning', shouldbe: true, value: noPluginsWarning });
    }

    stepResult.setOutputMessage('_fromPlugins discovered all ' + activePlugins.length +
        ' active sys_plugins records; discovery logged app and plugin found, created, updated, and set-inactive counts.' +
        (result.plugins.read === 0 ? ' The no-active-plugins warning was also verified.' : ''));
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
