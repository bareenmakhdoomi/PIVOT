import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015296-discover-all-apps'],
    name: 'PIVOT - Discover every active Store and custom app',
    description: 'Verifies every active sys_store_app record except PIVOT itself has one installed Capability, including apps without a for-fee family mapping, and reruns reuse the same Capability.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015296-discover-all-apps-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var source = new GlideRecord('sys_store_app');
    source.addQuery('active', true);
    source.query();
    var apps = [];
    while (source.next()) {
        var scope = String(source.getValue('scope') || '');
        if (scope === 'x_enno_pivot') continue;
        apps.push({
            id: String(source.getUniqueValue()),
            key: scope || String(source.getUniqueValue()),
            name: String(source.getValue('name') || scope || source.getUniqueValue())
        });
    }

    assertEqual({ name: 'active non-PIVOT app records are available', shouldbe: true, value: apps.length > 0 });
    if (!apps.length) {
        stepResult.setOutputMessage('No active non-PIVOT sys_store_app records were available for discovery.');
        return false;
    }

    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var first = D._fromApps();
    assertEqual({ name: 'app-only discovery completed without errors', shouldbe: true, value: first.ok });
    assertEqual({ name: 'every active non-PIVOT app was read', shouldbe: apps.length, value: first.apps.read });
    assertEqual({ name: 'every app Capability was created or updated', shouldbe: apps.length, value: first.apps.created + first.apps.updated });
    assertEqual({ name: 'no app records were skipped', shouldbe: 0, value: first.apps.skipped });

    var ids = {};
    var allAppsHaveOneCapability = true;
    for (var i = 0; i < apps.length; i++) {
        var cap = new GlideRecord(CAP);
        cap.addQuery('source', 'store_app');
        cap.addQuery('source_id', apps[i].key);
        cap.query();
        var count = 0;
        var capId = '';
        while (cap.next()) {
            count++;
            capId = String(cap.getUniqueValue());
            if ((cap.getValue('installed') != '1' && cap.getValue('installed') != 'true') ||
                (cap.getValue('not_found') != '0' && cap.getValue('not_found') != 'false')) {
                allAppsHaveOneCapability = false;
            }
        }
        if (count !== 1) allAppsHaveOneCapability = false;
        ids[apps[i].key] = capId;
    }
    assertEqual({ name: 'each active app has one installed Capability', shouldbe: true, value: allAppsHaveOneCapability });

    var second = D._fromApps();
    assertEqual({ name: 'second app-only discovery completed without errors', shouldbe: true, value: second.ok });
    assertEqual({ name: 'second run updates all existing app Capabilities', shouldbe: apps.length, value: second.apps.updated });
    assertEqual({ name: 'second run creates no duplicate app Capabilities', shouldbe: 0, value: second.apps.created });

    var sameCapabilitiesReused = true;
    for (var j = 0; j < apps.length; j++) {
        var existing = new GlideRecord(CAP);
        existing.addQuery('source', 'store_app');
        existing.addQuery('source_id', apps[j].key);
        existing.query();
        var matches = 0;
        while (existing.next()) {
            matches++;
            if (String(existing.getUniqueValue()) !== ids[apps[j].key]) sameCapabilitiesReused = false;
        }
        if (matches !== 1 || !ids[apps[j].key]) sameCapabilitiesReused = false;
    }
    assertEqual({ name: 'rerun reused the existing app Capabilities', shouldbe: true, value: sameCapabilitiesReused });

    stepResult.setOutputMessage('All active non-PIVOT Store/custom apps were discovered, and the second run reused their Capabilities.');
    return allAppsHaveOneCapability && sameCapabilitiesReused;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
