import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015312-capability-linked-app'],
    name: 'PIVOT - Reject invalid linked apps',
    description: 'Server-side ATF verifies a licensed Capability can link to an installed app, but cannot link to itself or an uninstalled Capability.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015312-capability-linked-app-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var suffix = gs.generateGUID();
    var installed = new GlideRecord('x_enno_pivot_capability');
    installed.initialize();
    installed.setValue('name', '[ATF] STRY0015312 installed app ' + suffix);
    installed.setValue('source', 'store_app');
    installed.setValue('installed', true);
    var installedId = installed.insert();

    var uninstalled = new GlideRecord('x_enno_pivot_capability');
    uninstalled.initialize();
    uninstalled.setValue('name', '[ATF] STRY0015313 uninstalled app ' + suffix);
    uninstalled.setValue('source', 'store_app');
    uninstalled.setValue('installed', false);
    var uninstalledId = uninstalled.insert();

    var license = new GlideRecord('x_enno_pivot_capability');
    license.initialize();
    license.setValue('name', '[ATF] STRY0015313 license ' + suffix);
    license.setValue('source', 'subscription');
    license.setValue('licensed', true);
    var licenseId = license.insert();

    assertEqual({ name: 'installed app Capability created', shouldbe: true, value: !!installedId });
    assertEqual({ name: 'uninstalled app Capability created', shouldbe: true, value: !!uninstalledId });
    assertEqual({ name: 'licensed Capability saves without a link', shouldbe: true, value: !!licenseId });

    if (installedId && uninstalledId && licenseId) {
        var savedLicense = new GlideRecord('x_enno_pivot_capability');
        var licenseLoaded = savedLicense.get(licenseId);
        assertEqual({ name: 'licensed Capability remains unlinked initially', shouldbe: '', value: licenseLoaded ? savedLicense.getValue('linked_app') : 'record not found' });
        if (licenseLoaded) {
            savedLicense.setValue('linked_app', installedId);
            var updatedId = savedLicense.update();
            var verified = new GlideRecord('x_enno_pivot_capability');
            var linkSaved = !!updatedId && verified.get(licenseId) && verified.getValue('linked_app') == installedId;
            assertEqual({ name: 'link to installed app persists', shouldbe: true, value: linkSaved });

            savedLicense.setValue('linked_app', licenseId);
            savedLicense.update();
            verified.get(licenseId);
            assertEqual({ name: 'self-link is rejected', shouldbe: installedId, value: verified.getValue('linked_app') });

            savedLicense.setValue('linked_app', uninstalledId);
            savedLicense.update();
            verified.get(licenseId);
            assertEqual({ name: 'link to uninstalled capability is rejected', shouldbe: installedId, value: verified.getValue('linked_app') });

            installed.setValue('installed', false);
            installed.update();
            savedLicense.setValue('name', '[ATF] invalid edit ' + suffix);
            savedLicense.update();
            verified.get(licenseId);
            assertEqual({ name: 'existing link to now-uninstalled Capability blocks save', shouldbe: '[ATF] STRY0015313 license ' + suffix, value: verified.getValue('name') });
            installed.setValue('installed', true);
            installed.update();
        }
    }

    if (licenseId) { var delLicense = new GlideRecord('x_enno_pivot_capability'); if (delLicense.get(licenseId)) delLicense.deleteRecord(); }
    if (installedId) { var delInstalled = new GlideRecord('x_enno_pivot_capability'); if (delInstalled.get(installedId)) delInstalled.deleteRecord(); }
    if (uninstalledId) { var delUninstalled = new GlideRecord('x_enno_pivot_capability'); if (delUninstalled.get(uninstalledId)) delUninstalled.deleteRecord(); }
    stepResult.setOutputMessage('Licensed Capability can be saved without a link and linked to an installed app.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
