import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { admin, viewer } from '../roles/roles.now'

Test({
    $id: Now.ID['atf-capability-mapping-admin-ui'],
    name: 'PIVOT - Admin maps three capabilities from Needs Mapping',
    description: 'Creates three unmapped test capabilities, opens the Needs Mapping dialog as an admin, maps all three to ITSM, then verifies the saved family and that none remain unmapped.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-capability-mapping-admin-setup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var names = ['ATF mapping capability one', 'ATF mapping capability two', 'ATF mapping capability three'];
    for (var i = 0; i < names.length; i++) {
        var old = new GlideRecord('x_enno_pivot_capability');
        old.addQuery('name', names[i]);
        old.query();
        while (old.next()) old.deleteRecord();
        var cap = new GlideRecord('x_enno_pivot_capability');
        cap.initialize();
        cap.setValue('name', names[i]);
        cap.setValue('source', 'subscription');
        cap.setValue('active', true);
        var id = cap.insert();
        assertEqual({ name: names[i] + ' fixture created', shouldbe: true, value: !!id });
    }
    stepResult.setOutputMessage('Created three unmapped Capability records for the admin mapping flow.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({
        $id: Now.ID['atf-capability-mapping-admin-user'],
        firstName: 'ATF',
        lastName: 'Capability Mapping Admin',
        fieldValues: {},
        groups: [],
        roles: [admin],
        impersonate: true,
    })
    atf.uiTestScript.runTest({
        $id: Now.ID['atf-capability-mapping-admin-ui-step'],
        script: Now.include('./capability-mapping-admin.script.js'),
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-capability-mapping-admin-verify'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var names = ['ATF mapping capability one', 'ATF mapping capability two', 'ATF mapping capability three'];
    var found = 0, mapped = 0, stillUnmapped = 0;
    for (var i = 0; i < names.length; i++) {
        var cap = new GlideRecord('x_enno_pivot_capability');
        cap.addQuery('name', names[i]);
        cap.query();
        while (cap.next()) {
            found++;
            if (cap.getValue('product_family') == 'itsm') mapped++;
            if (!cap.getValue('product_family')) stillUnmapped++;
            cap.deleteRecord();
        }
    }
    assertEqual({ name: 'all three test capabilities still exist until verification', shouldbe: 3, value: found });
    assertEqual({ name: 'all three capabilities saved with ITSM product family', shouldbe: 3, value: mapped });
    assertEqual({ name: 'no mapped test capability remains in Needs Mapping', shouldbe: 0, value: stillUnmapped });
    stepResult.setOutputMessage('Three capabilities were mapped, verified in storage, and removed from the test data.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})

Test({
    $id: Now.ID['atf-capability-mapping-viewer-ui'],
    name: 'PIVOT - Viewer sees Capability fields as read-only',
    description: 'Opens a linked Capability record in the Library as a viewer and verifies Product family is disabled, Linked app is displayed without an editable control, and Needs Mapping is not offered.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-capability-mapping-viewer-setup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var names = ['00000 ATF viewer readonly capability', '00001 ATF viewer linked installed app'];
    for (var i = 0; i < names.length; i++) {
        var old = new GlideRecord('x_enno_pivot_capability');
        old.addQuery('name', names[i]);
        old.query();
        while (old.next()) old.deleteRecord();
    }
    var app = new GlideRecord('x_enno_pivot_capability');
    app.initialize();
    app.setValue('name', names[1]);
    app.setValue('source', 'store_app');
    app.setValue('installed', true);
    app.setValue('active', true);
    app.setValue('product_family', 'itsm');
    var appId = app.insert();
    var license = new GlideRecord('x_enno_pivot_capability');
    license.initialize();
    license.setValue('name', names[0]);
    license.setValue('source', 'subscription');
    license.setValue('licensed', true);
    license.setValue('active', true);
    license.setValue('product_family', 'itsm');
    license.setValue('linked_app', appId);
    var licenseId = license.insert();
    assertEqual({ name: 'installed app fixture created', shouldbe: true, value: !!appId });
    assertEqual({ name: 'linked licensed Capability fixture created', shouldbe: true, value: !!licenseId });
    stepResult.setOutputMessage('Created a linked licensed Capability and installed app for the viewer UI check.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({
        $id: Now.ID['atf-capability-mapping-viewer-user'],
        firstName: 'ATF',
        lastName: 'Capability Mapping Viewer',
        fieldValues: {},
        groups: [],
        roles: [viewer],
        impersonate: true,
    })
    atf.uiTestScript.runTest({
        $id: Now.ID['atf-capability-mapping-viewer-ui-step'],
        script: Now.include('./capability-mapping-viewer.script.js'),
    })
    atf.server.runServerSideScript({
        $id: Now.ID['atf-capability-mapping-viewer-cleanup'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var names = ['00000 ATF viewer readonly capability', '00001 ATF viewer linked installed app'];
    for (var i = 0; i < names.length; i++) {
        var cap = new GlideRecord('x_enno_pivot_capability');
        cap.addQuery('name', names[i]);
        cap.query();
        while (cap.next()) cap.deleteRecord();
    }
    stepResult.setOutputMessage('Removed viewer UI test capabilities.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
