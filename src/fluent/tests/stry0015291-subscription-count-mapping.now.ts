import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015291-subscription-count-mapping'],
    name: 'PIVOT - Subscription counts map to Capability fields',
    description: 'Verifies purchased counts map to entitled_count, allocated counts map to allocated_count, and empty allocated counts become zero.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015291-subscription-count-mapping-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var mapped = D.mapSubscriptionCounts('500', '320');
    assertEqual({ name: 'purchased 500 maps to entitled 500', shouldbe: 500, value: mapped.entitled_count });
    assertEqual({ name: 'allocated 320 maps to allocated 320', shouldbe: 320, value: mapped.allocated_count });
    assertEqual({ name: '500/320 allocation is not empty', shouldbe: false, value: mapped.allocatedEmpty });

    var empty = D.mapSubscriptionCounts('500', '');
    assertEqual({ name: 'purchased count remains entitled 500', shouldbe: 500, value: empty.entitled_count });
    assertEqual({ name: 'empty allocated count maps to zero', shouldbe: 0, value: empty.allocated_count });
    assertEqual({ name: 'empty allocated count is detectable', shouldbe: true, value: empty.allocatedEmpty });

    var name = '[ATF] STRY0015291 count mapping ' + gs.generateGUID();
    var cap = new GlideRecord('x_enno_pivot_capability');
    cap.initialize();
    cap.setValue('name', name);
    cap.setValue('source', 'subscription');
    cap.setValue('source_id', gs.generateGUID());
    cap.setValue('entitled_count', mapped.entitled_count);
    cap.setValue('allocated_count', mapped.allocated_count);
    cap.setValue('licensed', true);
    cap.setValue('active', true);
    var id = cap.insert();
    try {
        assertEqual({ name: 'subscription-style Capability with 500/320 saved', shouldbe: true, value: !!id });
        var saved = new GlideRecord('x_enno_pivot_capability');
        if (saved.get(id)) {
            assertEqual({ name: 'saved Capability entitled count is 500', shouldbe: 500, value: Number(saved.getValue('entitled_count')) });
            assertEqual({ name: 'saved Capability allocated count is 320', shouldbe: 320, value: Number(saved.getValue('allocated_count')) });
        }
    } finally {
        if (id) {
            var cleanup = new GlideRecord('x_enno_pivot_capability');
            if (cleanup.get(id)) cleanup.deleteRecord();
        }
    }

    var requiredNote = D.allocatedCountNote(name, true);
    assertEqual({
        name: 'empty allocated count produces the required note',
        shouldbe: true,
        value: requiredNote === 'Subscription "' + name + '" has no allocated count: stored as 0.'
    });

    stepResult.setOutputMessage('Subscription count mapping and empty-allocation behavior passed.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
