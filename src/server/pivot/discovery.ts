// PIV-011 … PIV-014 – PIVOT discovery (design B5/B6).
// Finds every licensed subscription, installed for-fee app and active for-fee plugin and keeps exactly one
// Capability per item (matched on source + source ID, so re-runs never create duplicates).
// Discovery only writes discovery-owned fields; admin fields (product family once set, measurement settings,
// target, weight, linked app) are never overwritten. Items no longer found get not_found = true – never deleted.
// Source tables are only read (cross-scope Read privileges); PIVOT writes only to its own tables.
import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { SCOPE, familyFromLob, PROPERTIES, SEED_MEASURES } from './rules.ts'

export type LogEntry = { ts: number; level: 'info' | 'warn' | 'error'; step: number; message: string }
export type Counts = { read: number; created: number; updated: number; skipped: number }
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

const CAP = SCOPE + '_capability'
const SOURCES = {
    overview: 'sn_sub_man_st_subscription_overview', // licensed subscriptions (purchased / allocated)
    licenseDetails: 'license_details', // fallback when the overview is empty
    family: 'ua_app_family', // product family + for-fee flag per app / plugin
    apps: 'sys_store_app',
    plugins: 'v_plugin',
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
const tableExists = (t: string) => new GlideRecord(t).isValid()

export function runDiscovery(): DiscoverySummary {
    const runStart = new GlideDateTime()
    const startValue = runStart.getValue()
    const log: LogEntry[] = []
    const add = (level: LogEntry['level'], message: string) => log.push({ ts: new GlideDateTime().getNumericValue(), level, step: STEP, message })
    const zero = (): Counts => ({ read: 0, created: 0, updated: 0, skipped: 0 })
    const s: DiscoverySummary = { ok: true, licences: zero(), apps: zero(), plugins: zero(), excluded: [], notFound: 0, unlinkedLicences: 0, needsMapping: 0, log }
    const seeded: string[] = []
    const defaultDaysBack = toInt(gs.getProperty(SCOPE + '.default_days_back', PROPERTIES.default_days_back.def)) || 30

    /** Find the capability for source + key (falls back to source + name for records made before source IDs existed). */
    function upsert(source: string, key: string, name: string, data: { [f: string]: any }, family: string, counts: Counts) {
        const gr = new GlideRecord(CAP)
        gr.addQuery('source', source)
        gr.addQuery('source_id', key)
        gr.setLimit(1)
        gr.query()
        let found = gr.next()
        if (!found) {
            gr.initialize()
            const byName = new GlideRecord(CAP)
            byName.addQuery('source', source)
            byName.addQuery('name', name)
            byName.addNullQuery('source_id')
            byName.setLimit(1)
            byName.query()
            if (byName.next()) {
                found = gr.get(byName.getUniqueValue())
            }
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
        gr.setValue('source_id', key.slice(0, 255))
        Object.keys(data).forEach((f) => gr.setValue(f, data[f]))
        if (family && !str(gr, 'product_family')) gr.setValue('product_family', family) // only fills an empty family
        // PIV-015 – starter measurement settings, applied once and only when nothing is set yet
        const seed = SEED_MEASURES[key]
        if (seed && str(gr, 'seed_applied') !== '1' && str(gr, 'seed_applied') !== 'true' && !str(gr, 'measure_table') && !str(gr, 'target_value') && tableExists(seed.table)) {
            gr.setValue('measure_table', seed.table)
            gr.setValue('measure_filter', seed.filter)
            gr.setValue('date_field', seed.dateField)
            gr.setValue('days_back', seed.days)
            gr.setValue('target_value', seed.target)
            gr.setValue('seed_applied', true)
            seeded.push(name)
        }
        gr.setValue('last_discovered', startValue)
        gr.setValue('not_found', false)
        if (found) {
            if (gr.update()) counts.updated++
            else counts.skipped++
        } else if (gr.insert()) counts.created++
        else counts.skipped++
    }

    // ---- product family + for-fee filter (ua_app_family) -------------------------------------------
    const feeByScope: { [k: string]: string } = {}
    const feeById: { [k: string]: string } = {}
    let familyAvailable = false
    try {
        if (tableExists(SOURCES.family)) {
            familyAvailable = true
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
    const isFee = (map: { [k: string]: string }, key: string) => !familyAvailable || Object.prototype.hasOwnProperty.call(map, key)

    // ---- licensed subscriptions (PIV-011) ----------------------------------------------------------
    try {
        let rows = 0
        if (tableExists(SOURCES.overview)) {
            const o = new GlideRecord(SOURCES.overview)
            o.query()
            while (o.next()) {
                rows++
                s.licences.read++
                const name = o.getDisplayValue('subscription') || ''
                const key = str(o, 'subscription') || o.getUniqueValue()
                if (!name) {
                    s.licences.skipped++
                    add('warn', 'Skipped a subscription without a product name (' + o.getUniqueValue() + ').')
                    continue
                }
                try {
                    if (str(o, 'allocated_count') === '') add('info', 'Subscription "' + name + '" has no allocated count: stored as 0.')
                    upsert('subscription', key, name, { licensed: true, entitled_count: toInt(str(o, 'purchased_count')), allocated_count: toInt(str(o, 'allocated_count')) }, '', s.licences)
                } catch (ex) {
                    s.licences.skipped++
                    add('error', 'Subscription ' + o.getUniqueValue() + ' could not be saved: ' + ex)
                }
            }
        }
        if (!rows && tableExists(SOURCES.licenseDetails)) {
            const l = new GlideRecord(SOURCES.licenseDetails)
            l.query()
            while (l.next()) {
                rows++
                s.licences.read++
                const name = str(l, 'name')
                if (!name) {
                    s.licences.skipped++
                    add('warn', 'Skipped a licence without a name (' + l.getUniqueValue() + ').')
                    continue
                }
                upsert('subscription', l.getUniqueValue(), name, { licensed: true, entitled_count: toInt(str(l, 'count')), allocated_count: toInt(str(l, 'allocated')) }, '', s.licences)
            }
        }
        if (!rows) add('warn', 'No licensed subscriptions found: table is empty.')
        add('info', 'Licences: read ' + s.licences.read + ', created ' + s.licences.created + ', updated ' + s.licences.updated + (s.licences.skipped ? ', skipped ' + s.licences.skipped : '') + '.')
    } catch (ex) {
        add('error', 'Licence discovery failed, apps and plugins still run: ' + ex)
    }

    // ---- installed for-fee apps (PIV-012) -----------------------------------------------------------
    try {
        if (tableExists(SOURCES.apps)) {
            const a = new GlideRecord(SOURCES.apps)
            a.addQuery('active', true)
            a.query()
            while (a.next()) {
                const scope = str(a, 'scope'), name = str(a, 'name') || scope
                if (scope === SCOPE) {
                    s.excluded.push(scope)
                    continue
                }
                if (!scope || !isFee(feeByScope, scope)) continue
                s.apps.read++
                try {
                    upsert('store_app', scope, name, { installed: true, app_scope: scope, version: str(a, 'version').slice(0, 40) }, familyFromLob(feeByScope[scope] || ''), s.apps)
                } catch (ex) {
                    s.apps.skipped++
                    add('error', 'App ' + scope + ' could not be saved: ' + ex)
                }
            }
        }
        add('info', 'Apps: found ' + s.apps.read + ', created ' + s.apps.created + ', updated ' + s.apps.updated + (s.excluded.length ? '. ' + s.excluded.length + ' app excluded: ' + s.excluded.join(', ') : '') + '.')
    } catch (ex) {
        add('error', 'App discovery failed: ' + ex)
    }

    // ---- active for-fee plugins (PIV-012) -----------------------------------------------------------
    try {
        if (tableExists(SOURCES.plugins)) {
            const p = new GlideRecord(SOURCES.plugins)
            p.addQuery('active', 'active')
            p.query()
            while (p.next()) {
                const id = str(p, 'id'), name = str(p, 'name') || id
                if (!id || !isFee(feeById, id)) continue
                s.plugins.read++
                try {
                    upsert('plugin', id, name, { installed: true, app_scope: str(p, 'scope') === 'global' ? '' : str(p, 'scope'), version: str(p, 'version').slice(0, 40) }, familyFromLob(feeById[id] || ''), s.plugins)
                } catch (ex) {
                    s.plugins.skipped++
                    add('error', 'Plugin ' + id + ' could not be saved: ' + ex)
                }
            }
        }
        if (!s.plugins.read) add('warn', 'No active plugins found.')
        add('info', 'Plugins: found ' + s.plugins.read + ', created ' + s.plugins.created + ', updated ' + s.plugins.updated + '.')
    } catch (ex) {
        add('error', 'Plugin discovery failed: ' + ex)
    }

    // ---- no longer found (PIV-013): flag, never delete ---------------------------------------------
    try {
        const gone = new GlideRecord(CAP)
        gone.addNotNullQuery('source_id')
        gone.addQuery('not_found', false)
        gone.addEncodedQuery('last_discovered<' + startValue + '^ORlast_discoveredISEMPTY')
        gone.query()
        const names: string[] = []
        while (gone.next()) {
            const wasInstalled = str(gone, 'installed') === '1' || str(gone, 'installed') === 'true'
            gone.setValue('not_found', true)
            if (str(gone, 'source') !== 'subscription') gone.setValue('installed', false)
            if (gone.update()) {
                s.notFound++
                if (names.length < 10) names.push(str(gone, 'name') + (wasInstalled && str(gone, 'source') !== 'subscription' ? ' (no longer installed)' : ''))
            }
        }
        if (s.notFound) add('warn', 'Not found in this run: ' + s.notFound + ' (' + names.join(', ') + (s.notFound > names.length ? ', …' : '') + '). They are kept and flagged.')
    } catch (ex) {
        add('error', 'Could not flag capabilities that were not found: ' + ex)
    }

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
        const lines = s.log.map((l) => l.level.toUpperCase() + ': ' + l.message)
        lines.push(check('licence capabilities = licences read (' + count('subscription') + ' / ' + (s.licences.read - s.licences.skipped) + ')', count('subscription') === s.licences.read - s.licences.skipped))
        lines.push(check('app capabilities = apps found (' + count('store_app') + ' / ' + (s.apps.read - s.apps.skipped) + ')', count('store_app') === s.apps.read - s.apps.skipped))
        lines.push(check('plugin capabilities = plugins found (' + count('plugin') + ' / ' + (s.plugins.read - s.plugins.skipped) + ')', count('plugin') === s.plugins.read - s.plugins.skipped))
        gs.info('PIVOT discovery\n' + lines.join('\n'))
    } catch (ex) {
        gs.error('PIVOT discovery failed: ' + ex)
    }
}
