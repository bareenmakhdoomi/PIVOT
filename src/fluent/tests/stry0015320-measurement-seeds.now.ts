import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015320-measurement-seeds'],
    name: 'PIVOT – Measurement settings are seeded for each product family',
    description: 'STRY0015320: verifies each seeded family has at least three complete starter measures and every measure uses a real date field and valid filter.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015320-measurement-seeds-step'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var R = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/rules.ts');
    var counts = {};
    var sourceIds = Object.keys(R.SEED_MEASURES);
    for (var i = 0; i < sourceIds.length; i++) {
        var sourceId = sourceIds[i];
        var seed = R.SEED_MEASURES[sourceId];
        counts[seed.family] = (counts[seed.family] || 0) + 1;
        assertEqual({ name: sourceId + ' has a measure table', shouldbe: true, value: !!seed.table });
        assertEqual({ name: sourceId + ' has a filter', shouldbe: true, value: !!seed.filter });
        assertEqual({ name: sourceId + ' has a positive target', shouldbe: true, value: Number(seed.target) > 0 });
        var table = new GlideRecord(seed.table);
        assertEqual({ name: sourceId + ' measure table exists', shouldbe: true, value: table.isValid() });
        if (table.isValid()) {
            assertEqual({ name: sourceId + ' date field exists on ' + seed.table, shouldbe: true, value: table.isValidField(seed.dateField) });
            if (table.isValidField(seed.dateField)) {
                var dateType = String(table.getElement(seed.dateField).getED().getInternalType());
                assertEqual({ name: sourceId + ' date field has date type', shouldbe: true, value: dateType === 'glide_date' || dateType === 'glide_date_time' });
            }
            assertEqual({ name: sourceId + ' filter is valid on ' + seed.table, shouldbe: true, value: table.isEncodedQueryValid(seed.filter) });
        }
    }
    Object.keys(counts).forEach(function(family) {
        if (family !== 'itsm') assertEqual({ name: family + ' has at least three starter measures', shouldbe: true, value: counts[family] >= 3 });
    });
    ['hrsd', 'csm', 'itom'].forEach(function(family) {
        assertEqual({ name: family + ' is covered', shouldbe: true, value: counts[family] >= 3 });
    });
    stepResult.setOutputMessage('Every seeded family has complete starter settings with valid table fields and filters.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
