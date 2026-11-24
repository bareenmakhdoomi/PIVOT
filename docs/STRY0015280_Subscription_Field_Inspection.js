// Run in Scripts - Background in the PIVOT application scope on the dev instance.
// Read-only: reports actual dictionary field names and checks the fields discovery expects.
(function () {
    var tables = [
        {
            name: 'sn_sub_man_st_subscription_overview',
            fields: [
                { planned: 'subscription', purpose: 'Product name', labels: ['subscription', 'product', 'name'] },
                { planned: 'purchased_count', purpose: 'Purchased count', labels: ['purchased', 'entitled', 'quantity'] },
                { planned: 'allocated_count', purpose: 'Allocated count', labels: ['allocated', 'assigned', 'quantity'] }
            ]
        },
        {
            name: 'license_details',
            fields: [
                { planned: 'name', purpose: 'Product name', labels: ['name', 'product', 'license'] },
                { planned: 'count', purpose: 'Purchased count', labels: ['count', 'purchased', 'entitled', 'quantity'] },
                { planned: 'allocated', purpose: 'Allocated count', labels: ['allocated', 'assigned', 'quantity'] }
            ]
        }
    ];

    function log(message) {
        gs.info('STRY0015280 | ' + message);
    }

    function fieldRows(tableName) {
        var dictionary = new GlideRecord('sys_dictionary');
        dictionary.addQuery('name', tableName);
        dictionary.addNotNullQuery('element');
        dictionary.orderBy('element');
        dictionary.query();
        var fields = [];
        while (dictionary.next()) {
            fields.push({
                name: String(dictionary.getValue('element') || ''),
                label: String(dictionary.getValue('column_label') || ''),
                type: String(dictionary.getDisplayValue('internal_type') || ''),
                reference: String(dictionary.getValue('reference') || '')
            });
        }
        return fields;
    }

    function findCandidates(fields, labels) {
        var matches = [];
        for (var i = 0; i < fields.length; i++) {
            var label = fields[i].label.toLowerCase();
            for (var j = 0; j < labels.length; j++) {
                if (label.indexOf(labels[j]) !== -1) {
                    matches.push(fields[i].name + ' [' + fields[i].label + ']');
                    break;
                }
            }
        }
        return matches.length ? matches.join(', ') : 'none found; inspect the field list';
    }

    for (var t = 0; t < tables.length; t++) {
        var table = tables[t];
        var probe = new GlideRecord(table.name);
        if (!probe.isValid()) {
            log('TABLE NOT FOUND: ' + table.name);
            continue;
        }

        log('TABLE: ' + table.name);
        var fields = fieldRows(table.name);
        for (var f = 0; f < fields.length; f++) {
            log('FIELD: ' + table.name + '.' + fields[f].name +
                ' | label=' + fields[f].label +
                ' | type=' + fields[f].type +
                (fields[f].reference ? ' | reference=' + fields[f].reference : ''));
        }

        for (var p = 0; p < table.fields.length; p++) {
            var expected = table.fields[p];
            var found = false;
            for (var e = 0; e < fields.length; e++) {
                if (fields[e].name === expected.planned) {
                    found = true;
                    break;
                }
            }
            if (found) {
                log('PLANNED FIELD FOUND: ' + table.name + '.' + expected.planned + ' (' + expected.purpose + ')');
            } else {
                log('PLANNED FIELD MISSING: ' + table.name + '.' + expected.planned +
                    ' (' + expected.purpose + '); label candidates: ' +
                    findCandidates(fields, expected.labels));
            }
        }
    }
})();
