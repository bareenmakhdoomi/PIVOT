import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015323-capability-measurement-seeds'],
    name: 'PIVOT - Capability measurement seeds are application data',
    description: 'Verifies every configured measurement seed is installed as a Capability application record and discovery preserves its settings.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015323-capability-measurement-seeds-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var ids = Object.keys(R.SEED_MEASURES);
    var seeded = [];
    var allSeedRecordsPresent = true;

    for (var i = 0; i < ids.length; i++) {
        var seed = R.SEED_MEASURES[ids[i]];
        var cap = new GlideRecord(CAP);
        cap.addQuery('source_id', ids[i]);
        cap.addQuery('source', 'IN', 'store_app,plugin');
        cap.setLimit(1);
        cap.query();
        if (!cap.next()) {
            allSeedRecordsPresent = false;
            continue;
        }
        var row = {
            id: String(cap.getUniqueValue()),
            source_id: ids[i],
            measure_table: cap.getValue('measure_table'),
            measure_filter: cap.getValue('measure_filter') || '',
            date_field: cap.getValue('date_field'),
            days_back: Number(cap.getValue('days_back')),
            target_value: Number(cap.getValue('target_value')),
            seed_applied: cap.getValue('seed_applied') == '1' || cap.getValue('seed_applied') == 'true'
        };
        if (row.measure_table !== seed.table ||
            row.measure_filter !== seed.filter ||
            row.date_field !== seed.dateField ||
            row.days_back !== seed.days ||
            row.target_value !== seed.target ||
            !row.seed_applied) {
            allSeedRecordsPresent = false;
        }
        seeded.push(row);
    }

    assertEqual({
        name: 'all configured measurement seeds are installed with their settings',
        shouldbe: true,
        value: allSeedRecordsPresent && seeded.length === ids.length
    });
    if (!allSeedRecordsPresent || seeded.length !== ids.length) {
        stepResult.setOutputMessage('One or more seeded Capability application records are missing or do not match SEED_MEASURES.');
        return false;
    }

    var discovery = D.runDiscovery();
    var preserved = 0;
    var found = 0;
    var settingsPreserved = true;
    for (var j = 0; j < seeded.length; j++) {
        var expected = seeded[j];
        var current = new GlideRecord(CAP);
        if (!current.get(expected.id)) {
            settingsPreserved = false;
            continue;
        }
        if (current.getValue('not_found') != '1' && current.getValue('not_found') != 'true') {
            found++;
            var valuesMatch = current.getValue('measure_table') === expected.measure_table &&
                (current.getValue('measure_filter') || '') === expected.measure_filter &&
                current.getValue('date_field') === expected.date_field &&
                Number(current.getValue('days_back')) === expected.days_back &&
                Number(current.getValue('target_value')) === expected.target_value;
            if (valuesMatch) preserved++;
            else settingsPreserved = false;
        }
    }
    assertEqual({ name: 'discovery found at least one seeded Capability', shouldbe: true, value: found > 0 });
    assertEqual({ name: 'discovery preserved measurement settings on found seeds', shouldbe: true, value: settingsPreserved && preserved === found });

    stepResult.setOutputMessage('Seed Capability application records are present; discovery preserved measurements for ' + preserved + ' found seeded Capabilities.');
    return settingsPreserved && found > 0 && discovery.ok;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
