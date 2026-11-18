// Run in Scripts - Background in the PIVOT application scope on the development instance only.
// Uses the same subscription table selection as discovery: subscription overview, then license_details.
(function () {
    var CAP = 'x_enno_pivot_capability';
    var OVERVIEW = 'sn_sub_man_st_subscription_overview';
    var FALLBACK = 'license_details';
    var failures = 0;

    function report(label, passed, detail) {
        gs.info((passed ? 'PASS ' : 'FAIL ') + label + (detail ? ': ' + detail : ''));
        if (!passed) failures++;
    }

    function inspectSource(tableName) {
        var records = new GlideRecord(tableName);
        if (!records.isValid()) return { valid: false, count: 0 };
        records.query();
        var count = 0;
        while (records.next()) count++;
        return { valid: true, count: count };
    }

    function isTrue(value) {
        return value === '1' || value === 'true';
    }

    try {
        var overview = inspectSource(OVERVIEW);
        var sourceTable = overview.valid && overview.count ? OVERVIEW : FALLBACK;
        var source = sourceTable === OVERVIEW ? overview : inspectSource(FALLBACK);
        if (!source.valid || !source.count) {
            report('known subscription source is available', false, sourceTable + ' has no records');
        } else {
            report('known subscription source is available', true, source.count + ' records in ' + sourceTable);

            var discovery = require('x_enno_pivot/pivot/0.0.1/src/server/pivot/discovery.ts')._fromLicenses();
            report('license discovery completes without errors', discovery.ok, 'read ' + discovery.licences.read + ', created ' + discovery.licences.created + ', updated ' + discovery.licences.updated + ', skipped ' + discovery.licences.skipped);

            var sourceRows = new GlideRecord(sourceTable);
            sourceRows.query();
            var matched = 0;
            var flagsCorrect = true;
            while (sourceRows.next()) {
                var sourceId = sourceTable === OVERVIEW
                    ? (sourceRows.getValue('subscription') || sourceRows.getUniqueValue())
                    : sourceRows.getUniqueValue();
                var capability = new GlideRecord(CAP);
                capability.addQuery('source', 'subscription');
                capability.addQuery('source_id', sourceId);
                capability.setLimit(1);
                capability.query();
                if (!capability.next()) {
                    flagsCorrect = false;
                    continue;
                }
                matched++;
                if (!isTrue(capability.getValue('licensed')) || isTrue(capability.getValue('not_found'))) {
                    flagsCorrect = false;
                }
            }

            var licenseCapabilities = new GlideRecord(CAP);
            licenseCapabilities.addQuery('source', 'subscription');
            licenseCapabilities.addNotNullQuery('source_id');
            licenseCapabilities.query();
            var capabilityCount = 0;
            while (licenseCapabilities.next()) capabilityCount++;

            var writesSucceeded = discovery.licences.created + discovery.licences.updated === source.count &&
                discovery.licences.skipped === 0 && matched === source.count;
            report('license Capabilities were created or updated for every subscription', writesSucceeded, matched + ' matched for ' + source.count + ' subscriptions');
            report('license Capability flags are correct', flagsCorrect, 'licensed=true and not_found=false for matched subscriptions');
            report('License Capability count matches subscription count', capabilityCount === source.count, capabilityCount + ' Capabilities for ' + source.count + ' subscriptions');

            var hasCountSummary = discovery.log.some(function (entry) {
                return entry.message.indexOf('Licenses: read ' + discovery.licences.read + ', created ' +
                    discovery.licences.created + ', updated ' + discovery.licences.updated) === 0;
            });
            report('discovery count summary is present', hasCountSummary);
        }
    } catch (error) {
        report('background test executed', false, String(error));
    }

    gs.info(failures ? 'FAIL STRY0015294: ' + failures + ' check(s) failed.' : 'PASS STRY0015294: all checks passed.');
})();
