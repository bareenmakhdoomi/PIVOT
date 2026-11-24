import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { admin } from '../roles/roles.now'

Test({
    $id: Now.ID['atf-stry0015315-capability-link-workspace-api'],
    name: 'PIVOT - Admin maps a license to its installed app',
    description: 'Verifies the admin workspace API saves valid family and installed-app mappings and rejects links to uninstalled or non-app Capabilities.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015315-capability-link-workspace-api-setup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var suffix = gs.generateGUID();
    var create = function(name, source, installed, licensed) {
        var cap = new GlideRecord('x_enno_pivot_capability');
        cap.initialize();
        cap.setValue('name', '[ATF STRY0015315] ' + name + ' ' + suffix);
        cap.setValue('source', source);
        cap.setValue('installed', installed);
        cap.setValue('licensed', licensed);
        cap.setValue('active', true);
        return String(cap.insert() || '');
    };
    outputs.app_id = create('installed app', 'store_app', true, false);
    outputs.uninstalled_id = create('uninstalled app', 'store_app', false, false);
    outputs.other_license_id = create('other license', 'subscription', true, true);
    outputs.license_id = create('license', 'subscription', false, true);
    outputs.suffix = suffix;
    assertEqual({ name: 'all mapping test Capabilities created', shouldbe: true, value: !!outputs.app_id && !!outputs.uninstalled_id && !!outputs.other_license_id && !!outputs.license_id });
    return !!outputs.app_id && !!outputs.uninstalled_id && !!outputs.other_license_id && !!outputs.license_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({
        $id: Now.ID['atf-stry0015315-capability-link-workspace-api-admin'],
        firstName: 'ATF',
        lastName: 'Mapping Admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015315-capability-link-workspace-api-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var W = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/workspace-api.ts');
    var action = function(linkedApp) {
        return W.runActionWithNote({
            action: 'updateCapability',
            id: outputs.license_id,
            fields: { family: 'csm', linked_app: linkedApp }
        });
    };
    var valid = action(outputs.app_id);
    assertEqual({ name: 'admin can save product family and installed-app link', shouldbe: true, value: !!valid.ok });
    var saved = new GlideRecord('x_enno_pivot_capability');
    var found = saved.get(outputs.license_id);
    assertEqual({ name: 'mapped license remains saved', shouldbe: true, value: found });
    if (found) {
        assertEqual({ name: 'product family is saved', shouldbe: 'csm', value: saved.getValue('product_family') });
        assertEqual({ name: 'linked installed app is saved', shouldbe: outputs.app_id, value: saved.getValue('linked_app') });
    }

    var invalidUninstalled = action(outputs.uninstalled_id);
    assertEqual({ name: 'link to uninstalled Capability is rejected', shouldbe: false, value: !!invalidUninstalled.ok });
    var invalidSource = action(outputs.other_license_id);
    assertEqual({ name: 'link to subscription Capability is rejected', shouldbe: false, value: !!invalidSource.ok });
    var afterInvalid = new GlideRecord('x_enno_pivot_capability');
    afterInvalid.get(outputs.license_id);
    assertEqual({ name: 'invalid mapping does not overwrite existing app link', shouldbe: outputs.app_id, value: afterInvalid.getValue('linked_app') });

    var clear = action('');
    assertEqual({ name: 'admin can clear a linked app', shouldbe: true, value: !!clear.ok });
    afterInvalid.get(outputs.license_id);
    assertEqual({ name: 'cleared app reference is empty', shouldbe: '', value: afterInvalid.getValue('linked_app') });

    var ids = [outputs.license_id, outputs.app_id, outputs.uninstalled_id, outputs.other_license_id];
    for (var i = 0; i < ids.length; i++) {
        var cleanup = new GlideRecord('x_enno_pivot_capability');
        if (cleanup.get(ids[i])) cleanup.deleteRecord();
    }
    stepResult.setOutputMessage('The admin workspace API saved valid product-family and installed-app mappings, rejected invalid links, and cleared a link on request.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
