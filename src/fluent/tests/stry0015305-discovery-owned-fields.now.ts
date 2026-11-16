import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015305-discovery-owned-fields'],
    name: 'PIVOT - Discovery preserves admin-managed Capability settings',
    description: 'Sets a discovered subscription Capability product family, weight, measure table, and target, reruns discovery, verifies those values are unchanged, then restores the original settings.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015305-discovery-owned-fields-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var initial = D.runDiscovery();
    assertEqual({ name: 'initial discovery completed without errors', shouldbe: true, value: initial.ok });

    var cap = new GlideRecord(CAP);
    cap.addQuery('source', 'subscription');
    cap.addQuery('not_found', false);
    cap.addNotNullQuery('source_id');
    cap.orderBy('name');
    cap.setLimit(1);
    cap.query();
    if (!cap.next()) {
        assertEqual({ name: 'a discovered subscription Capability is available for the test', shouldbe: true, value: false });
        stepResult.setOutputMessage('No discovered subscription Capability is available; preservation assertions could not run.');
        return false;
    }

    var id = String(cap.getUniqueValue());
    var original = {
        product_family: cap.getValue('product_family'),
        weight: cap.getValue('weight'),
        measure_table: cap.getValue('measure_table'),
        target_value: cap.getValue('target_value')
    };
    try {
        cap.setValue('product_family', 'itsm');
        cap.setValue('weight', 3);
        cap.setValue('measure_table', 'incident');
        cap.setValue('target_value', 12345);
        var saved = cap.update();
        assertEqual({ name: 'admin-managed test values saved', shouldbe: true, value: !!saved });
        if (!saved) return false;

        var rerun = D.runDiscovery();
        assertEqual({ name: 'discovery rerun completed without errors', shouldbe: true, value: rerun.ok });
        var verified = new GlideRecord(CAP);
        var found = verified.get(id);
        assertEqual({ name: 'discovered Capability still exists', shouldbe: true, value: found });
        if (!found) return false;
        assertEqual({ name: 'product family remains ITSM', shouldbe: 'itsm', value: verified.getValue('product_family') });
        assertEqual({ name: 'weight remains 3', shouldbe: '3', value: verified.getValue('weight') });
        assertEqual({ name: 'measure table remains unchanged', shouldbe: 'incident', value: verified.getValue('measure_table') });
        assertEqual({ name: 'target remains unchanged', shouldbe: 12345, value: Number(verified.getValue('target_value')) });
        stepResult.setOutputMessage('Discovery preserved the admin-managed product family, weight, measure table, and target.');
        return true;
    } finally {
        var restore = new GlideRecord(CAP);
        if (restore.get(id)) {
            restore.setValue('product_family', original.product_family);
            restore.setValue('weight', original.weight);
            restore.setValue('measure_table', original.measure_table);
            restore.setValue('target_value', original.target_value);
            if (!restore.update()) gs.error('STRY0015305 ATF could not restore Capability settings for ' + id);
        }
    }
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
