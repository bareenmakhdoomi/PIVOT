import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015312-capability-linked-app'],
    name: 'PIVOT - Link licensed Capability to installed app',
    description: 'Server-side ATF creates an installed app Capability and a licensed Capability with no link, verifies the licensed record saves without a link, then links it to the installed app and confirms the reference persists.',
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

    var license = new GlideRecord('x_enno_pivot_capability');
    license.initialize();
    license.setValue('name', '[ATF] STRY0015312 license ' + suffix);
    license.setValue('source', 'subscription');
    license.setValue('licensed', true);
    var licenseId = license.insert();

    assertEqual({ name: 'installed app Capability created', shouldbe: true, value: !!installedId });
    assertEqual({ name: 'licensed Capability saves without a link', shouldbe: true, value: !!licenseId });

    if (installedId && licenseId) {
        var savedLicense = new GlideRecord('x_enno_pivot_capability');
        var licenseLoaded = savedLicense.get(licenseId);
        assertEqual({ name: 'licensed Capability remains unlinked initially', shouldbe: '', value: licenseLoaded ? savedLicense.getValue('linked_app') : 'record not found' });
        if (licenseLoaded) {
            savedLicense.setValue('linked_app', installedId);
            var updatedId = savedLicense.update();
            var verified = new GlideRecord('x_enno_pivot_capability');
            var linkSaved = !!updatedId && verified.get(licenseId) && verified.getValue('linked_app') == installedId;
            assertEqual({ name: 'link to installed app persists', shouldbe: true, value: linkSaved });
        }
    }

    if (licenseId) { var delLicense = new GlideRecord('x_enno_pivot_capability'); if (delLicense.get(licenseId)) delLicense.deleteRecord(); }
    if (installedId) { var delInstalled = new GlideRecord('x_enno_pivot_capability'); if (delInstalled.get(installedId)) delInstalled.deleteRecord(); }
    stepResult.setOutputMessage('Licensed Capability can be saved without a link and linked to an installed app.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
