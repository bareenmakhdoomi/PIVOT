import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015319-itsm-measure-seeds'],
    name: 'PIVOT - ITSM starter measurement settings',
    description: 'Runs discovery, verifies at least three discovered ITSM Capabilities have complete measurement settings, and executes the ITSM seed filters.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015319-itsm-measure-seeds-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var discovery = D.runDiscovery();
    assertEqual({ name: 'discovery completed', shouldbe: true, value: discovery.ok });
    var ids = [
        'com.snc.incident',
        'com.snc.problem',
        'com.snc.change_management',
        'com.glideapp.servicecatalog',
        'com.snc.incident.mim',
        'com.snc.change_management.cab'
    ];
    var seeded = 0;
    var filtered = 0;
    for (var i = 0; i < ids.length; i++) {
        var seed = R.SEED_MEASURES[ids[i]];
        if (!seed) continue;
        seeded++;
        assertEqual({ name: ids[i] + ' has table, filter, date field and target', shouldbe: true, value: !!(seed.table && seed.filter !== undefined && seed.dateField && seed.days > 0 && seed.target > 0) });

        var table = new GlideRecord(seed.table);
        if (!table.isValid()) {
            if (i < 3) {
                stepResult.setOutputMessage('Required core ITSM measure table is not installed: ' + seed.table);
                return false;
            }
            continue;
        }
        assertEqual({ name: ids[i] + ' date field exists: ' + seed.dateField, shouldbe: true, value: table.isValidField(seed.dateField) });
        if (seed.filter) {
            var clauses = seed.filter.split('^');
            for (var j = 0; j < clauses.length; j++) {
                var field = clauses[j].match(/^([a-zA-Z0-9_]+)/);
                if (field) assertEqual({ name: ids[i] + ' filter field exists: ' + field[1], shouldbe: true, value: table.isValidField(field[1]) });
            }
            table.addEncodedQuery(seed.filter);
        }
        table.setLimit(1);
        table.query();
        if (i < 3) assertEqual({ name: ids[i] + ' encoded filter returns a row', shouldbe: true, value: table.hasNext() });
    }
    assertEqual({ name: 'at least three ITSM measurement seeds exist', shouldbe: true, value: seeded >= 3 });
    assertEqual({ name: 'Incident seed uses active incidents and target 100', shouldbe: true, value: R.SEED_MEASURES['com.snc.incident'].table === 'incident' && R.SEED_MEASURES['com.snc.incident'].filter === 'active=true' && R.SEED_MEASURES['com.snc.incident'].target === 100 });

    var caps = new GlideRecord('x_enno_pivot_capability');
    caps.addQuery('product_family', 'itsm');
    caps.addQuery('source_id', 'IN', ids.join(','));
    caps.query();
    while (caps.next()) {
        if (caps.getValue('measure_table') && caps.getValue('measure_filter') && caps.getValue('target_value')) filtered++;
    }
    assertEqual({ name: 'at least three discovered ITSM Capabilities have table, filter and target', shouldbe: true, value: filtered >= 3 });
    stepResult.setOutputMessage('Discovery populated ITSM measurements; seed filters were checked against their tables.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
