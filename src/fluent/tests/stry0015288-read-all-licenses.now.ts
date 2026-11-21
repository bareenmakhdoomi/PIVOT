import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

Test({
    $id: Now.ID['atf-stry0015288-read-all-licenses'],
    name: 'PIVOT - Read every licensed subscription',
    description: 'STRY0015288: verifies _fromLicenses reads every source row, creates or updates one subscription Capability for each named product, and logs skipped blank names with their sys_id.',
    active: true,
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['atf-stry0015288-read-all-licenses-check'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var CAP = 'x_enno_pivot_capability';
    var D = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts');
    var emptyCounts = { read: 0, created: 0, updated: 0, skipped: 0 };
    var emptyLog = [];
    var emptySaved = false;
    D.processLicenseRecord('stry0015288-empty-name-sysid', function() { return ''; }, emptyCounts, function(level, message) {
        emptyLog.push({ level: level, message: message });
    }, function() {
        emptySaved = true;
    });
    assertEqual({ name: 'blank product name is skipped', shouldbe: '1:0', value: emptyCounts.skipped + ':' + Number(emptySaved) });
    assertEqual({
        name: 'blank product name warning includes its sys_id',
        shouldbe: true,
        value: emptyLog.length === 1 && emptyLog[0].level === 'warn' &&
            emptyLog[0].message.indexOf('stry0015288-empty-name-sysid') >= 0
    });

    var overview = new GlideRecord('sn_sub_man_st_subscription_overview');
    var sourceTable = 'sn_sub_man_st_subscription_overview';
    var rows = [];
    if (overview.isValid()) {
        overview.query();
        while (overview.next()) rows.push({
            sysId: String(overview.getUniqueValue()),
            sourceId: String(overview.getValue('subscription') || overview.getUniqueValue()),
            name: String(overview.getDisplayValue('subscription') || '')
        });
    }
    if (!rows.length) {
        var fallback = new GlideRecord('license_details');
        sourceTable = 'license_details';
        if (fallback.isValid()) {
            fallback.query();
            while (fallback.next()) rows.push({
                sysId: String(fallback.getUniqueValue()),
                sourceId: String(fallback.getUniqueValue()),
                name: String(fallback.getValue('name') || '')
            });
        }
    }
    if (!rows.length) {
        stepResult.setOutputMessage('No subscription source rows are installed; source-to-Capability assertions could not run.');
        return false;
    }

    var result = D._fromLicenses();
    assertEqual({ name: '_fromLicenses completes without errors', shouldbe: true, value: result.ok });
    assertEqual({ name: 'every row in ' + sourceTable + ' was read', shouldbe: rows.length, value: result.licences.read });
    assertEqual({
        name: 'each source row is created, updated, or skipped exactly once',
        shouldbe: rows.length,
        value: result.licences.created + result.licences.updated + result.licences.skipped
    });

    var namedRows = 0;
    var blanks = [];
    var namedSourceIds = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!row.name) {
            blanks.push(row.sysId);
            continue;
        }
        namedRows++;
        if (namedSourceIds.indexOf(row.sourceId) < 0) namedSourceIds.push(row.sourceId);
        var matches = new GlideRecord(CAP);
        matches.addQuery('source', 'subscription');
        matches.addQuery('source_id', row.sourceId);
        matches.query();
        var count = 0;
        var licensed = true;
        while (matches.next()) {
            count++;
            if (matches.getValue('licensed') != '1' && matches.getValue('licensed') != 'true') licensed = false;
        }
        assertEqual({ name: 'subscription ' + row.sysId + ' has exactly one Capability', shouldbe: 1, value: count });
        assertEqual({ name: 'subscription ' + row.sysId + ' Capability is licensed', shouldbe: true, value: licensed });
    }
    assertEqual({ name: 'every named product row is represented by a Capability', shouldbe: namedRows, value: result.licences.created + result.licences.updated });
    var sourceCapabilities = new GlideRecord(CAP);
    sourceCapabilities.addQuery('source', 'subscription');
    sourceCapabilities.addQuery('source_id', 'IN', namedSourceIds.join(','));
    sourceCapabilities.query();
    var sourceCapabilityCount = 0;
    while (sourceCapabilities.next()) sourceCapabilityCount++;
    assertEqual({ name: 'one Capability exists for every named subscription source row', shouldbe: namedRows, value: sourceCapabilityCount });

    for (var j = 0; j < blanks.length; j++) {
        var hasWarning = false;
        for (var k = 0; k < result.log.length; k++) {
            if (result.log[k].level === 'warn' &&
                result.log[k].message.indexOf('Skipped a subscription without a product name (' + blanks[j] + ')') >= 0) {
                hasWarning = true;
                break;
            }
        }
        assertEqual({ name: 'blank-name subscription warning includes sys_id ' + blanks[j], shouldbe: true, value: hasWarning });
    }

    stepResult.setOutputMessage('_fromLicenses read ' + rows.length + ' records; ' + namedRows + ' named products were represented and ' + blanks.length + ' blank names were skipped.');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
})
