// PIV-011 … PIV-014 – PIVOT discovery (design B5/B6).
// Finds every licensed subscription, active Store/custom app and activated plugin and keeps exactly one
// Capability per source and name, preferring source ID when matching discovered items.
// Discovery only writes discovery-owned fields; admin fields (product family once set, measurement settings,
// target, weight, linked app) are never overwritten. Items no longer found get not_found = true – never deleted.
// Source tables are only read (cross-scope Read privileges); PIVOT writes only to its own tables.
import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { SCOPE, familyFromLob, PROPERTIES, SEED_MEASURES } from './rules.ts'

export type LogEntry = { ts: number; level: 'info' | 'warn' | 'error'; step: number; message: string }
export type Counts = { read: number; created: number; updated: number; skipped: number; setInactive: number }
export type DiscoverySummary = {
    ok: boolean
    licences: Counts
    apps: Counts
    plugins: Counts
    excluded: string[]
    notFound: number
    unlinkedLicences: number
    needsMapping: number
    log: LogEntry[]
}

export function processLicenseRecord(
    sysId: string,
    getName: () => string,
    counts: Counts,
    add: (level: LogEntry['level'], message: string) => void,
    save: (name: string) => void,
) {
    counts.read++
    try {
        const name = getName()
        if (!name) {
            counts.skipped++
            add('warn', 'Skipped a subscription without a product name (' + sysId + ').')
            return
        }
        save(name)
    } catch (ex) {
        counts.skipped++
        add('error', 'Subscription ' + sysId + ' could not be saved: ' + ex)
    }
}

const CAP = SCOPE + '_capability'
const SOURCES = {
    overview: 'sn_sub_man_st_subscription_overview', // licensed subscriptions (purchased / allocated)
    licenseDetails: 'license_details', // fallback when the overview is empty
    family: 'ua_app_family', // product-family mapping per app / plugin
    apps: 'sys_store_app',
    plugins: 'sys_plugins',
    pluginDetails: 'v_plugin',
}
const STEP = 2 // discovery is step 2 of an assessment run (B9)

const str = (gr: any, f: string): string => {
    const v = gr.getValue(f)
    return v === null || v === undefined ? '' : String(v)
}
const toInt = (v: string): number => {
    const n = parseInt(String(v || '').replace(/[^0-9-]/g, ''), 10)
    return isNaN(n) ? 0 : n
}

export function mapSubscriptionCounts(purchasedCount: string, allocatedCount: string): {
    entitled_count: number
    allocated_count: number
    allocatedEmpty: boolean
} {
    const purchased = String(purchasedCount || '').trim()
    const allocated = String(allocatedCount || '').trim()
    return {
        entitled_count: toInt(purchased),
        allocated_count: allocated ? toInt(allocated) : 0,
        allocatedEmpty: allocated === '',
    }
}

export function allocatedCountNote(name: string, allocatedEmpty: boolean): string {
    return allocatedEmpty ? 'Subscription "' + name + '" has no allocated count: stored as 0.' : ''
}

const tableExists = (t: string) => new GlideRecord(t).isValid()

export function _pluginName(name: string, id: string): string {
    return name || id
}

function findOrInitializeCapability(name: string, source: string, sourceId: string, defaultDaysBack: number) {
    const gr = new GlideRecord(CAP)
    let found = false
    if (sourceId) {
        // Source and source ID define identity; inactive records remain reusable.
        gr.addQuery('source', source)
        gr.addQuery('source_id', sourceId)
        gr.setLimit(1)
        gr.query()
        found = gr.next()
    }
    // Plugin names are not unique; a known plugin ID must never fall back to another plugin by name.
    if (!found && !(source === 'plugin' && sourceId)) {
        const byName = new GlideRecord(CAP)
        byName.addQuery('source', source)
        byName.addQuery('name', name.slice(0, 100))
        byName.setLimit(1)
        byName.query()
        if (byName.next()) found = gr.get(byName.getUniqueValue())
    }
    if (!found) {
        gr.initialize()
        gr.setValue('source', source)
        gr.setValue('active', true)
        gr.setValue('weight', 1)
        gr.setValue('days_back', defaultDaysBack)
        gr.setValue('date_field', 'sys_created_on')
    }
    gr.setValue('name', name.slice(0, 100))
    if (sourceId) gr.setValue('source_id', sourceId.slice(0, 255))
    return { record: gr, found }
}

/** Find or create a Capability by its name and source. `License` is the UI label for `subscription`. */
export function _getOrCreate(name: string, source: string) {
    if (!name || !name.trim()) throw new Error('Capability name is required.')
    const sourceValue = source === 'License' ? 'subscription' : source
    if (['subscription', 'store_app', 'plugin', 'manual'].indexOf(sourceValue) < 0) {
        throw new Error('Unsupported Capability source: ' + source)
    }
    const defaultDaysBack = toInt(gs.getProperty(SCOPE + '.default_days_back', PROPERTIES.default_days_back.def)) || 30
    const result = findOrInitializeCapability(name, sourceValue, '', defaultDaysBack)
    if (result.found) return result.record
    const id = result.record.insert()
    if (!id) throw new Error('Could not create Capability "' + name + '" for source "' + sourceValue + '".')
    const created = new GlideRecord(CAP)
    if (!created.get(id)) throw new Error('Created Capability "' + name + '" could not be loaded.')
    return created
}

export function _fromLicenses(runStartedAt?: string): DiscoverySummary {
    return runDiscovery(runStartedAt, true)
}

export function _fromApps(runStartedAt?: string): DiscoverySummary {
    return runDiscovery(runStartedAt, false, true)
}

export function _fromPlugins(runStartedAt?: string): DiscoverySummary {
    return runDiscovery(runStartedAt, false, false, true)
}

export function runDiscovery(runStartedAt?: string, licensesOnly = false, appsOnly = false, pluginsOnly = false): DiscoverySummary {
    const startValue = runStartedAt || new GlideDateTime().getValue()
    const log: LogEntry[] = []
    const add = (level: LogEntry['level'], message: string) => log.push({ ts: new GlideDateTime().getNumericValue(), level, step: STEP, message })
    const zero = (): Counts => ({ read: 0, created: 0, updated: 0, skipped: 0, setInactive: 0 })
    const s: DiscoverySummary = { ok: true, licences: zero(), apps: zero(), plugins: zero(), excluded: [], notFound: 0, unlinkedLicences: 0, needsMapping: 0, log }
    const seeded: string[] = []
    const defaultDaysBack = toInt(gs.getProperty(SCOPE + '.default_days_back', PROPERTIES.default_days_back.def)) || 30

    /** Reuse the same source + name record when an item's source ID has changed. */
    function upsertDiscoveredCapability(source: string, key: string, name: string, data: { [f: string]: any }, family: string, counts: Counts) {
        const match = findOrInitializeCapability(name, source, key, defaultDaysBack)
        const gr = match.record
        Object.keys(data).forEach((f) => gr.setValue(f, data[f]))
        if (family && !str(gr, 'product_family')) gr.setValue('product_family', family) // only fills an empty family
        // PIV-015 – starter measurement settings, applied once and only when nothing is set yet
        const seed = SEED_MEASURES[key]
        if (seed && str(gr, 'seed_applied') !== '1' && str(gr, 'seed_applied') !== 'true' && !str(gr, 'measure_table') && !str(gr, 'target_value')) {
            const measureTable = new GlideRecord(seed.table)
            const productFamily = str(gr, 'product_family') || family
            const dateElement = measureTable.isValid() && measureTable.isValidField(seed.dateField) ? measureTable.getElement(seed.dateField) : null
            const dateType = dateElement ? String(dateElement.getED().getInternalType()) : ''
            if (productFamily && productFamily !== seed.family) {
                add('warn', 'Starter measurement settings for "' + name + '" were not applied: expected product family ' + seed.family + ', found ' + productFamily + '.')
            } else if (!measureTable.isValid()) {
                add('warn', 'Starter measurement settings for "' + name + '" were not applied: measure table ' + seed.table + ' does not exist.')
            } else if (!measureTable.isValidField(seed.dateField)) {
                add('warn', 'Starter measurement settings for "' + name + '" were not applied: date field ' + seed.dateField + ' does not exist on ' + seed.table + '.')
            } else if (dateType !== 'glide_date' && dateType !== 'glide_date_time') {
                add('warn', 'Starter measurement settings for "' + name + '" were not applied: field ' + seed.dateField + ' on ' + seed.table + ' is not a date or date/time field.')
            } else if (seed.filter && !measureTable.isEncodedQueryValid(seed.filter)) {
                add('warn', 'Starter measurement settings for "' + name + '" were not applied: filter is not valid for ' + seed.table + '.')
            } else {
                if (!productFamily) gr.setValue('product_family', seed.family)
                gr.setValue('measure_table', seed.table)
                gr.setValue('measure_filter', seed.filter)
                gr.setValue('date_field', seed.dateField)
                gr.setValue('days_back', seed.days)
                gr.setValue('target_value', seed.target)
                gr.setValue('seed_applied', true)
                seeded.push(name)
            }
        }
        gr.setValue('last_discovered', startValue)
        gr.setValue('not_found', false)
        const sourceId = key.slice(0, 255)
        gr.setValue('source', source)
        gr.setValue('source_id', sourceId)
        gr.setValue('name', name.slice(0, 100))
        const savedId = match.found ? gr.update() : gr.insert()
        if (!savedId) {
            counts.skipped++
            add('error', 'Capability "' + name + '" was not saved: GlideRecord returned no sys_id.')
            return
        }
        const saved = new GlideRecord(CAP)
        if (!saved.get(String(savedId))) {
            counts.skipped++
            add('error', 'Capability "' + name + '" was not saved: the saved record could not be reloaded.')
            return
        }
        if (str(saved, 'source') !== source || str(saved, 'source_id') !== sourceId) {
            counts.skipped++
            add('error', 'Capability "' + name + '" did not persist its source identity (expected source="' +
                source + '", source_id="' + sourceId + '"; actual source="' + str(saved, 'source') +
                '", source_id="' + str(saved, 'source_id') + '").')
            return
        }
        if (match.found) counts.updated++
        else counts.created++
    }

    // ---- product family + for-fee filter (ua_app_family) -------------------------------------------
    const feeByScope: { [k: string]: string } = {}
    const feeById: { [k: string]: string } = {}
    if (!licensesOnly) {
        try {
            if (tableExists(SOURCES.family)) {
                const f = new GlideRecord(SOURCES.family)
                f.addQuery('for_fee', true)
                f.addQuery('cust_visible', true)
                f.query()
                while (f.next()) {
                    const lob = str(f, 'lob_name'), scope = str(f, 'scope'), id = str(f, 'app_id')
                    if (scope && scope !== 'global' && !feeByScope[scope]) feeByScope[scope] = lob
                    if (id && !feeById[id]) feeById[id] = lob
                }
            } else add('warn', 'Product family table ua_app_family does not exist: every active app and plugin is discovered and families must be mapped by hand.')
        } catch (ex) {
            add('error', 'Could not read ua_app_family: ' + ex)
        }
    }
    // ---- licensed subscriptions (PIV-011) ----------------------------------------------------------
    if (!appsOnly && !pluginsOnly) {
        try {
            let rows = 0
            if (tableExists(SOURCES.overview)) {
                const o = new GlideRecord(SOURCES.overview)
                o.query()
                while (o.next()) {
                    rows++
                    const sysId = o.getUniqueValue()
                    processLicenseRecord(sysId, () => o.getDisplayValue('subscription') || '', s.licences, add, (name) => {
                        const key = str(o, 'subscription') || sysId
                        const counts = mapSubscriptionCounts(str(o, 'purchased_count'), str(o, 'allocated_count'))
                        const note = allocatedCountNote(name, counts.allocatedEmpty)
                        if (note) add('info', note)
                        upsertDiscoveredCapability('subscription', key, name, { licensed: true, entitled_count: counts.entitled_count, allocated_count: counts.allocated_count }, '', s.licences)
                    })
                }
            }
            if (!rows && tableExists(SOURCES.licenseDetails)) {
                const l = new GlideRecord(SOURCES.licenseDetails)
                l.query()
                while (l.next()) {
                    rows++
                    const sysId = l.getUniqueValue()
                    processLicenseRecord(sysId, () => str(l, 'name'), s.licences, add, (name) => {
                        const counts = mapSubscriptionCounts(str(l, 'count'), str(l, 'allocated'))
                        const note = allocatedCountNote(name, counts.allocatedEmpty)
                        if (note) add('info', note)
                        upsertDiscoveredCapability('subscription', sysId, name, { licensed: true, entitled_count: counts.entitled_count, allocated_count: counts.allocated_count }, '', s.licences)
                    })
                }
            }
            if (!rows) add('warn', 'No licensed subscriptions found: table is empty.')
            add('info', 'Licenses: read ' + s.licences.read + ', created ' + s.licences.created + ', updated ' + s.licences.updated + (s.licences.skipped ? ', skipped ' + s.licences.skipped : '') + '.')
        } catch (ex) {
            add('error', 'Licence discovery failed, apps and plugins still run: ' + ex)
        }
    }

    if (licensesOnly) {
        s.ok = !log.some((l) => l.level === 'error')
        add(s.ok ? 'info' : 'warn', 'License discovery ' + (s.ok ? 'complete' : 'finished with errors') + ': ' + s.licences.read + ' subscriptions checked.')
        return s
    }

    // ---- active Store and custom apps (PIV-012) ----------------------------------------------------
    if (!pluginsOnly) {
        try {
            if (tableExists(SOURCES.apps)) {
                const a = new GlideRecord(SOURCES.apps)
                a.addQuery('active', true)
                a.query()
                while (a.next()) {
                    const scope = str(a, 'scope'), key = scope || a.getUniqueValue(), name = str(a, 'name') || key
                    if (scope === SCOPE) {
                        s.excluded.push(scope)
                        continue
                    }
                    s.apps.read++
                    try {
                        upsertDiscoveredCapability('store_app', key, name, { licensed: false, installed: true, app_scope: scope, version: str(a, 'version').slice(0, 40) }, familyFromLob(feeByScope[scope] || ''), s.apps)
                    } catch (ex) {
                        s.apps.skipped++
                        add('error', 'App ' + key + ' could not be saved: ' + ex)
                    }
                }
            }
        } catch (ex) {
            add('error', 'App discovery failed: ' + ex)
        }
    }

    if (appsOnly) {
        add('info', 'Apps: found ' + s.apps.read + ', created ' + s.apps.created + ', updated ' + s.apps.updated + ', set inactive ' + s.apps.setInactive + (s.excluded.length ? '. ' + s.excluded.length + ' app excluded: ' + s.excluded.join(', ') : '') + '.')
        s.ok = !log.some((l) => l.level === 'error')
        add(s.ok ? 'info' : 'warn', 'App discovery ' + (s.ok ? 'complete' : 'finished with errors') + ': ' + s.apps.read + ' active apps checked.')
        return s
    }

    // ---- active plugins (PIV-012) ------------------------------------------------------------------
    try {
        if (tableExists(SOURCES.plugins)) {
            const detailsById: { [id: string]: { scope: string } } = {}
            try {
                if (tableExists(SOURCES.pluginDetails)) {
                    const details = new GlideRecord(SOURCES.pluginDetails)
                    details.query()
                    while (details.next()) {
                        const id = str(details, 'id')
                        if (id && !detailsById[id]) detailsById[id] = { scope: str(details, 'scope') }
                    }
                }
            } catch (ex) {
                add('warn', 'Plugin scope metadata could not be read from ' + SOURCES.pluginDetails + ': ' + ex)
            }
            // Every Store app is also registered as a plugin (com.<scope>). Keep it active once, as a Store app,
            // so the same product is not listed and counted twice (PIV-011.03 / 012.01 / 012.02).
            const appScopes: { [scope: string]: boolean } = {}
            if (tableExists(SOURCES.apps)) {
                const sa = new GlideRecord(SOURCES.apps)
                sa.addQuery('active', true)
                sa.query()
                while (sa.next()) {
                    const sc = str(sa, 'scope')
                    if (sc) appScopes[sc] = true
                }
            }
            let appTwins = 0
            const p = new GlideRecord(SOURCES.plugins)
            p.addQuery('active', true)
            p.query()
            while (p.next()) {
                const id = str(p, 'source') || p.getUniqueValue()
                const name = _pluginName(str(p, 'name'), id)
                s.plugins.read++
                try {
                    const pluginScope = detailsById[id] ? detailsById[id].scope : ''
                    const appTwin = !!pluginScope && pluginScope !== 'global' && !!appScopes[pluginScope]
                    if (appTwin) appTwins++
                    upsertDiscoveredCapability('plugin', id, name, { active: !appTwin, licensed: false, installed: true, app_scope: pluginScope === 'global' ? '' : pluginScope, version: str(p, 'version').slice(0, 40) }, familyFromLob(feeById[id] || ''), s.plugins)
                } catch (ex) {
                    s.plugins.skipped++
                    add('error', 'Plugin ' + id + ' could not be saved: ' + ex)
                }
            }
            if (appTwins) add('info', appTwins + ' plugin(s) belong to a Store app and are kept inactive; the product is listed once, as a Store app.')
        }
        if (!s.plugins.read) add('warn', 'No active plugins found.')
    } catch (ex) {
        add('error', 'Plugin discovery failed: ' + ex)
    }

    if (pluginsOnly) {
        add('info', 'Plugins: found ' + s.plugins.read + ', created ' + s.plugins.created + ', updated ' + s.plugins.updated + ', set inactive ' + s.plugins.setInactive + '.')
        s.ok = !log.some((l) => l.level === 'error')
        add(s.ok ? 'info' : 'warn', 'Plugin discovery ' + (s.ok ? 'complete' : 'finished with errors') + ': ' + s.plugins.read + ' active plugins checked.')
        return s
    }

    // ---- no longer found (PIV-013): flag, never delete ---------------------------------------------
    try {
        const gone = new GlideRecord(CAP)
        gone.addNotNullQuery('source_id')
        gone.addQuery('not_found', false)
        gone.addEncodedQuery('last_discovered<' + startValue + '^ORlast_discoveredISEMPTY')
        gone.query()
        const names: string[] = []
        const noLongerInstalled: string[] = []
        let noLongerInstalledCount = 0
        while (gone.next()) {
            const wasInstalled = str(gone, 'installed') === '1' || str(gone, 'installed') === 'true'
            const name = str(gone, 'name')
            const source = str(gone, 'source')
            gone.setValue('not_found', true)
            gone.setValue('licensed', false)
            if (source !== 'subscription') gone.setValue('installed', false)
            if (gone.update()) {
                s.notFound++
                if (names.length < 10) names.push(name + (wasInstalled && source !== 'subscription' ? ' (no longer installed)' : ''))
                if (wasInstalled && source !== 'subscription') {
                    noLongerInstalledCount++
                    if (noLongerInstalled.length < 10) noLongerInstalled.push(name)
                    if (source === 'store_app') s.apps.setInactive++
                    else if (source === 'plugin') s.plugins.setInactive++
                }
            }
        }
        if (s.notFound) add('warn', 'Not found in this run: ' + s.notFound + ' (' + names.join(', ') + (s.notFound > names.length ? ', …' : '') + '). They are kept and flagged.')
        if (noLongerInstalledCount) add('warn', 'Previously installed capabilities no longer discovered; marked not installed: ' + noLongerInstalledCount + ' (' + noLongerInstalled.join(', ') + (noLongerInstalledCount > noLongerInstalled.length ? ', …' : '') + ').')
    } catch (ex) {
        add('error', 'Could not flag capabilities that were not found: ' + ex)
    }

    add('info', 'Apps: found ' + s.apps.read + ', created ' + s.apps.created + ', updated ' + s.apps.updated + ', set inactive ' + s.apps.setInactive + (s.excluded.length ? '. ' + s.excluded.length + ' app excluded: ' + s.excluded.join(', ') : '') + '.')
    add('info', 'Plugins: found ' + s.plugins.read + ', created ' + s.plugins.created + ', updated ' + s.plugins.updated + ', set inactive ' + s.plugins.setInactive + '.')

    // licensed=true represents a subscription found in this run, not stale or non-subscription records.
    const invalidLicensed = new GlideRecord(CAP)
    invalidLicensed.addQuery('licensed', true)
    invalidLicensed.query()
    let clearedLicensed = 0
    let failedLicensedClears = 0
    while (invalidLicensed.next()) {
        if (str(invalidLicensed, 'source') === 'subscription' &&
            str(invalidLicensed, 'not_found') !== '1' &&
            str(invalidLicensed, 'not_found') !== 'true' &&
            str(invalidLicensed, 'source_id')) continue
        invalidLicensed.setValue('licensed', false)
        if (invalidLicensed.update()) clearedLicensed++
        else failedLicensedClears++
    }
    if (clearedLicensed) add('info', 'Cleared licensed on ' + clearedLicensed + ' stale or non-subscription capabilities.')
    if (failedLicensedClears) add('error', 'Could not clear licensed on ' + failedLicensedClears + ' stale or non-subscription capabilities.')

    // ---- licence → installed app (PIV-014): licences count as installed only through their linked app ----
    try {
        const lic = new GlideRecord(CAP)
        lic.addQuery('source', 'subscription')
        lic.addQuery('not_found', false)
        lic.addNotNullQuery('source_id') // only discovered licences; records made by hand keep their values
        lic.query()
        while (lic.next()) {
            const linked = str(lic, 'linked_app')
            let installed = false
            if (linked) {
                const app = new GlideRecord(CAP)
                installed = app.get(linked) && (str(app, 'installed') === '1' || str(app, 'installed') === 'true')
            } else s.unlinkedLicences++
            lic.setValue('installed', installed)
            lic.update()
        }
        if (s.unlinkedLicences) add('warn', s.unlinkedLicences + ' licence(s) have no linked app. Link each to its installed app so shelfware can be detected.')
    } catch (ex) {
        add('error', 'Could not check linked apps: ' + ex)
    }

    if (seeded.length) add('info', 'Starter measurement settings applied to ' + seeded.length + ' capabilities (' + seeded.join(', ') + '). Review the targets with the product owners.')

    const nm = new GlideRecord(CAP)
    nm.addQuery('active', true)
    nm.addQuery('not_found', '!=', true) // PIV-014.06: only capabilities found on the instance need a family
    nm.addNullQuery('product_family')
    nm.query()
    while (nm.next()) s.needsMapping++
    if (s.needsMapping) add('info', s.needsMapping + ' active capabilities need a product family (Needs mapping).')

    s.ok = !log.some((l) => l.level === 'error')
    add(s.ok ? 'info' : 'warn', 'Discovery ' + (s.ok ? 'complete' : 'finished with errors') + ': ' + (s.licences.read + s.apps.read + s.plugins.read) + ' items checked.')
    return s
}

/** On-demand scheduled job "PIVOT – Run discovery" (until the assessment runner arrives in Sprint 4). */
export function discoveryJob() {
    try {
        const s = runDiscovery()
        const check = (label: string, ok: boolean) => (ok ? 'PASS ' : 'FAIL ') + label
        const count = (source: string) => {
            const gr = new GlideRecord(CAP)
            gr.addQuery('source', source)
            gr.addQuery('not_found', false)
            gr.addNotNullQuery('source_id')
            gr.query()
            let n = 0
            while (gr.next()) n++
            return n
        }
        const licensedCount = () => {
            const gr = new GlideRecord(CAP)
            gr.addQuery('licensed', true)
            gr.query()
            let n = 0
            while (gr.next()) n++
            return n
        }
        const lines = s.log.map((l) => l.level.toUpperCase() + ': ' + l.message)
        const expectedLicences = s.licences.read - s.licences.skipped
        lines.push(check('licence capabilities = licences read (' + count('subscription') + ' / ' + expectedLicences + ')', count('subscription') === expectedLicences))
        lines.push(check('licensed capabilities = licences read (' + licensedCount() + ' / ' + expectedLicences + ')', licensedCount() === expectedLicences))
        lines.push(check('app capabilities = apps found (' + count('store_app') + ' / ' + (s.apps.read - s.apps.skipped) + ')', count('store_app') === s.apps.read - s.apps.skipped))
        lines.push(check('plugin capabilities = plugins found (' + count('plugin') + ' / ' + (s.plugins.read - s.plugins.skipped) + ')', count('plugin') === s.plugins.read - s.plugins.skipped))
        gs.info('PIVOT discovery\n' + lines.join('\n'))
    } catch (ex) {
        gs.error('PIVOT discovery failed: ' + ex)
    }
}
