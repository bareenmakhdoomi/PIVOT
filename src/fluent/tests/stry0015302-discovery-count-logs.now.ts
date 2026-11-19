import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015302-discovery-count-logs'],
    name: 'PIVOT - App and plugin discovery counts are logged',
    description: 'Verifies discovery logs found, created, updated, and set-inactive counts separately for apps and plugins, and warns when no active plugins are found.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015302-discovery-count-logs-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
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

    stepResult.setOutputMessage('Discovery logged app and plugin found, created, updated, and set-inactive counts.' +
        (result.plugins.read === 0 ? ' The no-active-plugins warning was also verified.' : ''));
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
