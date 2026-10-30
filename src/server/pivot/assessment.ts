// PIV-034 – the PIVOT assessment orchestrator (design B9). One entry point, run(assessmentId), used by the weekly
// job (PIV-035), Run Now through the event x_enno_pivot.run_assessment (PIV-036) and the PivotAssessment script include.
// Steps, always in this order (log step numbers in brackets):
//   [1] start · [2] discover · [3] measure (+ utilization) · [4] score · [5] outcomes · [6] gaps · [7] priority
//   [8] roadmap · [9] notify · [10] complete. Each step logs "<step>: <count> <unit> in <seconds> s".
// A step that throws stops the run: status Failed, the step name and error in the log, later steps do not run.
// Every count is a GlideAggregate (never a row-by-row loop). Only PIVOT tables are written.
import { gs, GlideRecord, GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { SCOPE, PROPERTIES, OPP_ACTIVE, scoreOf, utilizationOf, overallScore, outcomeStatus, periodDays, priorityOf, priorityReason, roadmapPhase } from './rules.ts'
import { runDiscovery, LogEntry } from './discovery.ts'
import { runGapRules } from './gaps.ts'
import { generate as generateRoadmap } from './roadmap.ts'

const T = {
    capability: SCOPE + '_capability',
    assessment: SCOPE + '_assessment',
    result: SCOPE + '_result',
    outcome: SCOPE + '_business_outcome',
    outcomeResult: SCOPE + '_outcome_result',
    opportunity: SCOPE + '_opportunity',
}
const MAX_LOG_CHARS = 60000

const str = (gr: any, f: string): string => {
    const v = gr.getValue(f)
    return v === null || v === undefined ? '' : String(v)
}
const num = (gr: any, f: string): number | null => {
    const v = str(gr, f)
    return v === '' || isNaN(Number(v)) ? null : Number(v)
}
const bool = (gr: any, f: string) => str(gr, f) === '1' || str(gr, f) === 'true'
const prop = (name: string) => gs.getProperty(SCOPE + '.' + name, PROPERTIES[name] ? PROPERTIES[name].def : '')
const now = () => new GlideDateTime().getNumericValue()

export type RunSummary = { ok: boolean; number: string; sysId: string; overallScore: number | null; message: string }
export type RunOptions = { failAt?: string } // tests only: make the named step throw (PIV-034.07)
export const STEPS = ['discover', 'measure', 'score', 'outcomes', 'gaps', 'priority', 'roadmap', 'notify']
export const EVENT_RUN = SCOPE + '.run_assessment'
export const EVENT_COMPLETE = SCOPE + '.run_complete'
export const EVENT_FAILED = SCOPE + '.run_failed'
const secs = (ms: number) => String(Math.round(ms / 100) / 10)

/** Value of a GlideAggregate over table + encoded query + date window. Returns { value } or { reason } when it cannot be measured. */
function aggregate(table: string, filter: string, dateField: string, daysBack: number, agg: 'count' | 'sum' | 'avg', field: string): { value?: number; reason?: string } {
    const probe = new GlideRecord(table)
    if (!probe.isValid()) return { reason: 'Measure table not found' }
    if (filter && !probe.isEncodedQueryValid(filter)) return { reason: 'Filter is not valid for ' + table }
    if (dateField && !probe.isValidField(dateField)) return { reason: 'Date field ' + dateField + ' not found on ' + table }
    if (agg !== 'count' && (!field || !probe.isValidField(field))) return { reason: 'Field to ' + (agg === 'sum' ? 'sum' : 'average') + ' not found on ' + table }
    const ga = new GlideAggregate(table)
    if (filter) ga.addEncodedQuery(filter)
    if (dateField && daysBack > 0) {
        const from = new GlideDateTime()
        from.addDaysUTC(-daysBack)
        ga.addQuery(dateField, '>=', from.getValue())
        ga.addQuery(dateField, '<=', new GlideDateTime().getValue()) // PIV-018: only the last N days – future-dated rows are not counted
    }
    const fn = agg === 'count' ? 'COUNT' : agg === 'sum' ? 'SUM' : 'AVG'
    if (agg === 'count') (ga as any).addAggregate('COUNT')
    else ga.addAggregate(fn, field)
    ga.setGroup(false)
    ga.query()
    if (!ga.next()) return { value: 0 }
    const raw = agg === 'count' ? (ga as any).getAggregate('COUNT') : ga.getAggregate(fn, field)
    const value = Number(raw || 0)
    return { value: agg === 'avg' ? Math.round(value * 100) / 100 : value }
}

/** The run that blocks a new one (Queued or Running), or null. A run older than 2 × the time limit
 *  (at least 60 minutes) is treated as crashed and set to Failed so it no longer blocks (PIV-035.03 / PIV-036.06). */
export function busyRun(): { number: string; sysId: string; status: string } | null {
    const limitMinutes = Number(prop('max_run_minutes')) || 0
    const busy = new GlideRecord(T.assessment)
    busy.addQuery('status', 'IN', 'queued,running')
    busy.query()
    while (busy.next()) {
        const started = str(busy, 'run_date') || str(busy, 'sys_created_on') // hand-made records have no run date
        const age = started ? (now() - new GlideDateTime(started).getNumericValue()) / 60000 : 0
        if (age < Math.max(60, limitMinutes * 2)) return { number: str(busy, 'number'), sysId: busy.getUniqueValue(), status: str(busy, 'status') }
        busy.setValue('status', 'failed')
        busy.setValue('log', JSON.stringify([{ ts: now(), level: 'error', step: 10, message: 'Set to Failed: it stayed ' + str(busy, 'status') + ' for ' + Math.round(age) + ' minutes (crashed or created by hand).' }]))
        busy.update()
    }
    return null
}

/** Creates a Queued assessment (PIV-034.03). Refused while another run is Queued or Running. */
export function queueAssessment(trigger: 'weekly' | 'run_now', runBy: string): RunSummary {
    const b = busyRun()
    if (b) return { ok: false, number: b.number, sysId: '', overallScore: null, message: 'An assessment is already running. Try again when it completes.' }
    const a = new GlideRecord(T.assessment)
    a.newRecord()
    a.setValue('status', 'queued')
    a.setValue('trigger', trigger)
    if (runBy) a.setValue('run_by', runBy)
    const sysId = String(a.insert() || '')
    if (!sysId) return { ok: false, number: '', sysId: '', overallScore: null, message: 'The assessment record could not be created.' }
    a.get(sysId)
    return { ok: true, number: str(a, 'number'), sysId, overallScore: null, message: str(a, 'number') + ' queued.' }
}

/** Run Now (PIV-036): queue an assessment and fire the event; the script action runs it in the background. */
export function startRunNow(runBy: string): RunSummary {
    const q = queueAssessment('run_now', runBy)
    if (!q.ok) return q
    const a = new GlideRecord(T.assessment)
    a.get(q.sysId)
    gs.eventQueue(EVENT_RUN, a, q.sysId, runBy)
    return { ok: true, number: q.number, sysId: q.sysId, overallScore: null, message: 'Assessment started. Refresh this list to see progress.' }
}

/** Queue and run straight away in this thread (weekly job, on-demand job, background tests). */
export function runAssessment(trigger: 'weekly' | 'run_now', runBy: string, opts?: RunOptions): RunSummary {
    const q = queueAssessment(trigger, runBy)
    if (!q.ok) return { ok: false, number: q.number, sysId: '', overallScore: null, message: 'Assessment ' + q.number + ' is already running. Only one assessment can run at a time.' }
    return run(q.sysId, opts)
}

/** PIV-034.01 – the orchestrator. Runs one Queued assessment through every step. */
export function run(assessmentId: string, opts?: RunOptions): RunSummary {
    const o0: RunOptions = opts || {}
    const a = new GlideRecord(T.assessment)
    if (!assessmentId || !a.get(String(assessmentId))) {
        gs.warn('PIVOT assessment: Assessment not found (' + assessmentId + ')')
        return { ok: false, number: '', sysId: '', overallScore: null, message: 'Assessment not found' }
    }
    const sysId = a.getUniqueValue(), number = str(a, 'number'), status = str(a, 'status')
    if (status === 'complete' || status === 'complete_with_warnings') {
        gs.info('PIVOT assessment ' + number + ': Assessment already complete')
        return { ok: false, number, sysId, overallScore: num(a, 'overall_score'), message: 'Assessment already complete' }
    }
    if (status && status !== 'queued') {
        gs.info('PIVOT assessment ' + number + ': not started, status is ' + status)
        return { ok: false, number, sysId, overallScore: null, message: 'Assessment ' + number + ' is ' + status + '; only a Queued assessment can run.' }
    }

    const limitMinutes = Number(prop('max_run_minutes')) || 0
    const startMs = now()
    const log: LogEntry[] = []
    const add = (level: LogEntry['level'], step: number, message: string) => log.push({ ts: now(), level, step, message })
    const save = (fields: { [k: string]: any }) => {
        let text = JSON.stringify(log)
        while (text.length > MAX_LOG_CHARS && log.length > 20) {
            log.splice(10, 1)
            text = JSON.stringify(log)
        }
        a.setValue('log', text)
        Object.keys(fields).forEach((k) => a.setValue(k, fields[k]))
        a.update()
    }
    const duration = () => {
        const d = new GlideDateTime('1970-01-01 00:00:00')
        d.add(Math.max(1000, now() - startMs)) // PIV-034.05 – never 0
        return d.getValue()
    }
    // PIV-034.03 / .05 – Running, with run date and run by (the scheduled job's user for weekly runs)
    if (!str(a, 'run_by')) a.setValue('run_by', gs.getUserID())
    const trigger = str(a, 'trigger')
    add('info', 1, 'Started by ' + gs.getUserDisplayName() + ' (' + (trigger === 'run_now' ? 'Run Now' : 'weekly schedule') + ').' + (limitMinutes ? ' Time limit ' + limitMinutes + ' min.' : ' No time limit set.'))
    save({ status: 'running', run_date: new GlideDateTime().getValue() })

    // One step: runs fn, logs "<name>: <count> <unit> (<detail>) in <s> s". A throw carries the step name.
    let current = ''
    const step = (n: number, name: string, fn: () => { count: number; unit: string; detail?: string }) => {
        current = name
        const t0 = now()
        if (o0.failAt === name) throw new Error('Forced failure for the test')
        const r = fn()
        add('info', n, name + ': ' + r.count + ' ' + r.unit + (r.detail ? ' (' + r.detail + ')' : '') + ' in ' + secs(now() - t0) + ' s')
        save({})
    }

    let pvs: number | null = null
    try {
        // ---- [2] discover
        step(2, 'discover', () => {
            const d = runDiscovery()
            d.log.forEach((l) => log.push(l))
            const caps = d.licences.created + d.licences.updated + d.apps.created + d.apps.updated + d.plugins.created + d.plugins.updated
            return { count: caps, unit: 'capabilities created or updated', detail: d.licences.read + ' licences, ' + d.apps.read + ' store apps, ' + d.plugins.read + ' plugins read' }
        })

        // ---- [3] measure (usage and licence utilization) – one Result per active capability
        const slowSeconds = Number(prop('slow_capability_seconds')) || 60
        const timingLog = String(prop('timing_log')) === 'true' // PIV-022.02 – per-capability timing in the run log
        const defaultDays = Number(prop('default_days_back')) || 30
        const deadline = limitMinutes ? startMs + limitMinutes * 60000 : 0
        let inactive = 0, slow = 0, limitHit = false, results = 0
        step(3, 'measure', () => {
            const inact = new GlideAggregate(T.capability)
            inact.addQuery('active', '=', false)
            ;(inact as any).addAggregate('COUNT')
            inact.query()
            if (inact.next()) inactive = Number((inact as any).getAggregate('COUNT')) || 0
            const c = new GlideRecord(T.capability)
            c.addQuery('active', true)
            c.orderBy('name')
            c.query()
            while (c.next()) {
                const t0 = now()
                const cap = { licensed: bool(c, 'licensed'), installed: bool(c, 'installed'), target: num(c, 'target_value') }
                const table = str(c, 'measure_table'), filter = str(c, 'measure_filter'), dateField = str(c, 'date_field') || 'sys_created_on'
                const days = num(c, 'days_back') || defaultDays
                let actual: number | null = null, reason = ''
                try {
                    if (cap.licensed && !cap.installed) reason = ''
                    else if (deadline && now() > deadline) {
                        reason = 'Run time limit reached'
                        limitHit = true
                    } else if (!table) reason = 'No measure table configured'
                    else {
                        const r = aggregate(table, filter, dateField, days, 'count', '')
                        if (r.reason) {
                            reason = r.reason
                            add('warn', 3, 'Not measured: ' + str(c, 'name') + ' – ' + r.reason + '.')
                        } else actual = r.value === undefined ? null : r.value
                    }
                } catch (ex) {
                    reason = 'Measurement error'
                    add('error', 3, 'Measurement failed for ' + str(c, 'name') + ': ' + ex)
                }
                const sc = scoreOf(cap, actual, reason || undefined)
                const util = utilizationOf(num(c, 'entitled_count'), num(c, 'allocated_count'))
                const ms = now() - t0
                if (ms > slowSeconds * 1000) {
                    slow++
                    add('warn', 3, 'Slow capability: ' + str(c, 'name') + ' took ' + Math.round(ms / 1000) + ' s (' + table + ').')
                } else if (timingLog && actual !== null) add('info', 3, 'Timing: ' + str(c, 'name') + ' – ' + ms + ' ms (' + table + ').')
                const r = new GlideRecord(T.result)
                r.initialize()
                r.setValue('assessment', sysId)
                r.setValue('capability', c.getUniqueValue())
                r.setValue('licensed', cap.licensed)
                r.setValue('installed', cap.installed)
                if (actual !== null) r.setValue('actual_value', actual)
                if (cap.target !== null) r.setValue('target_value', cap.target)
                if (sc.score !== null) r.setValue('score', sc.score)
                if (util.utilization !== null) r.setValue('utilization', util.utilization)
                r.setValue('over_allocated', util.overAllocated)
                r.setValue('measurement_status', sc.status)
                r.setValue('reason', sc.reason)
                r.setValue('measure_table', table)
                r.setValue('filter_used', filter.slice(0, 1000))
                r.setValue('days_back', days)
                r.setValue('weight', num(c, 'weight') === null ? 1 : num(c, 'weight'))
                if (num(c, 'entitled_count') !== null) r.setValue('entitled_count', num(c, 'entitled_count'))
                if (num(c, 'allocated_count') !== null) r.setValue('allocated_count', num(c, 'allocated_count'))
                r.setValue('duration_ms', ms)
                r.insert()
                results++
            }
            if (limitHit) add('warn', 3, 'Run time limit of ' + limitMinutes + ' min reached: the remaining capabilities are Not Measured.')
            return { count: results, unit: 'results', detail: inactive + ' inactive skipped' + (slow ? ', ' + slow + ' slow' : '') }
        })

        // ---- [4] score – reads the Results created by this assessment (PIV-034.02 AC 2)
        let measured = 0, notMeasured = 0
        step(4, 'score', () => {
            const scores: { score: number | null; weight: number | null }[] = []
            const r = new GlideRecord(T.result)
            r.addQuery('assessment', sysId)
            r.query()
            while (r.next()) {
                const sc = num(r, 'score')
                if (sc === null) notMeasured++
                else measured++
                scores.push({ score: sc, weight: num(r, 'weight') })
            }
            pvs = overallScore(scores)
            add('info', 4, pvs === null ? 'Platform Value Score stays empty (Not Measured): no capability could be scored.' : 'Platform Value Score ' + pvs + ' (weighted average of ' + measured + ' scored capabilities; Not Measured are left out).')
            a.setValue('overall_score', pvs === null ? '' : pvs)
            a.setValue('scored_count', measured)
            a.setValue('not_measured_count', notMeasured)
            a.setValue('inactive_count', inactive)
            a.setValue('slow_count', slow)
            return { count: measured, unit: 'capabilities scored', detail: notMeasured + ' Not Measured' }
        })

        // ---- [5] outcomes – business outcome KPIs (baseline captured on the first measurement)
        step(5, 'outcomes', () => {
            let outMeasured = 0, outNot = 0, baselines = 0, outInactive = 0
            const inactOut = new GlideAggregate(T.outcome)
            inactOut.addQuery('active', '=', false)
            ;(inactOut as any).addAggregate('COUNT')
            inactOut.query()
            if (inactOut.next()) outInactive = Number((inactOut as any).getAggregate('COUNT')) || 0
            const o = new GlideRecord(T.outcome)
            o.addEncodedQuery('active=true^ORactiveISEMPTY') // PIV-026.01 – inactive outcomes are skipped (empty = rows from before the field existed)
            o.query()
            while (o.next()) {
                let actual: number | null = null, reason = ''
                try {
                    if (str(o, 'measurement_type') === 'manual') {
                        actual = num(o, 'manual_value')
                        if (actual === null) reason = 'No manual value entered'
                        else {
                            // PIV-024.07 – an old manual value is still used, with a stale warning
                            const dated = str(o, 'manual_value_date')
                            const limit = new GlideDateTime()
                            limit.addDaysUTC(-periodDays(str(o, 'period')))
                            if (dated && dated < limit.getValue().split(' ')[0]) {
                                reason = 'Stale: manual value dated ' + dated + ' is older than the KPI period'
                                add('warn', 5, 'Outcome "' + str(o, 'kpi') + '": manual value dated ' + dated + ' is older than its period (stale).')
                            }
                        }
                    } else {
                        const kt = str(o, 'kpi_table')
                        if (!kt) reason = 'KPI table is required for calculated KPIs'
                        else {
                            const agg = (str(o, 'kpi_aggregate') || 'count') as 'count' | 'sum' | 'avg'
                            const r = aggregate(kt, str(o, 'kpi_filter'), 'sys_created_on', periodDays(str(o, 'period')), agg, str(o, 'kpi_field'))
                            if (r.reason) {
                                reason = r.reason === 'Measure table not found' ? 'KPI table not found' : r.reason
                                add('warn', 5, 'Outcome "' + str(o, 'kpi') + '": ' + reason + '.')
                            } else actual = r.value === undefined ? null : r.value
                        }
                    }
                    // PIV-025 – the first measured value becomes the baseline; later runs never change it
                    if (actual !== null && num(o, 'baseline') === null) {
                        o.setValue('baseline', actual)
                        o.setValue('baseline_date', new GlideDateTime().getValue().split(' ')[0])
                        baselines++
                    }
                    const st = outcomeStatus({ baseline: num(o, 'baseline'), target: num(o, 'target'), direction: str(o, 'direction') }, actual)
                    if (st.reason === 'Target equals baseline') add('warn', 5, 'Outcome "' + str(o, 'kpi') + '": target equals baseline – improvement cannot be calculated.')
                    // PIV-026.02 – one Outcome Result per outcome per assessment: update it if the step runs again
                    const or = new GlideRecord(T.outcomeResult)
                    or.addQuery('assessment', sysId)
                    or.addQuery('outcome', o.getUniqueValue())
                    or.setLimit(1)
                    or.query()
                    const exists = or.next()
                    if (!exists) or.initialize()
                    or.setValue('assessment', sysId)
                    or.setValue('outcome', o.getUniqueValue())
                    or.setValue('capability', str(o, 'capability'))
                    or.setValue('baseline', num(o, 'baseline') === null ? '' : num(o, 'baseline'))
                    or.setValue('actual', actual === null ? '' : actual) // PIV-026.06 – no value is made up
                    or.setValue('target', num(o, 'target') === null ? '' : num(o, 'target'))
                    or.setValue('improvement_pct', st.improvement === null ? '' : st.improvement)
                    or.setValue('outcome_status', st.status)
                    or.setValue('reason', reason || st.reason)
                    if (exists) or.update()
                    else or.insert()
                    // PIV-026.07 – a Not Measured run keeps the previous current value and its date
                    if (actual !== null) {
                        o.setValue('current_value', actual)
                        o.setValue('current_value_date', new GlideDateTime().getValue().split(' ')[0])
                    }
                    o.setValue('status', st.status) // PIV-027.06 – latest status on the outcome (audited)
                    o.update()
                    if (st.status === 'not_measured') outNot++
                    else outMeasured++
                } catch (ex) {
                    outNot++
                    add('error', 5, 'Outcome "' + str(o, 'kpi') + '" could not be measured: ' + ex)
                }
            }
            return { count: outMeasured + outNot, unit: 'outcomes', detail: outMeasured + ' measured, ' + outNot + ' Not Measured' + (baselines ? ', ' + baselines + ' baseline(s) captured' : '') + (outInactive ? ', ' + outInactive + ' inactive skipped' : '') }
        })

        // ---- [6] gaps (PIV-028–030)
        step(6, 'gaps', () => {
            const g = runGapRules(sysId, number, (level, _s, message) => add(level, 6, message))
            a.setValue('opportunities_created', g.created)
            if (g.errors) add('warn', 6, g.errors + ' gap rule error(s) – see the lines above.')
            return { count: g.created, unit: 'opportunities', detail: g.updated + ' updated, ' + g.resolved + ' gap(s) no longer detected' + (g.kept ? ', ' + g.kept + ' Rejected/Done kept closed' : '') }
        })

        // ---- [7] priority (PIV-031) – every active opportunity with the current weights
        step(7, 'priority', () => {
            const wv = Number(prop('priority_weight_value')) || 1
            const wiRaw = String(prop('priority_weight_impact')), wi = wiRaw === '' || isNaN(Number(wiRaw)) ? 1 : Number(wiRaw)
            const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
            const ph: { [k: string]: number } = { now: 0, next: 0, later: 0 }
            let n = 0, changed = 0
            const op = new GlideRecord(T.opportunity)
            op.addQuery('state', 'IN', OPP_ACTIVE.join(','))
            op.query()
            while (op.next()) {
                n++
                const v = num(op, 'value'), e = num(op, 'effort'), i = num(op, 'business_impact')
                if (v !== null && e !== null && e > 0) {
                    const p = priorityOf(v, i, e, wv, wi), reason = priorityReason(v, i, e, p, wv, wi)
                    if (num(op, 'priority') !== p || str(op, 'priority_reason') !== reason) {
                        op.setValue('priority', p)
                        op.setValue('priority_reason', reason)
                        op.update()
                        changed++
                    }
                }
                ph[roadmapPhase(num(op, 'priority'), nowAt, nextAt)]++
            }
            return { count: n, unit: 'opportunities ranked', detail: 'Now ' + ph.now + ', Next ' + ph.next + ', Later ' + ph.later + (changed ? ', ' + changed + ' priority updated' : '') }
        })

        // ---- [8] roadmap (PIV-033)
        step(8, 'roadmap', () => {
            const rm = generateRoadmap(sysId)
            if (!rm.ok) throw new Error(rm.message)
            add('info', 8, rm.message)
            return { count: rm.now + rm.next + rm.later, unit: 'items' }
        })

        // ---- [9] notify – the run complete event (emails: PIV-042)
        step(9, 'notify', () => {
            gs.eventQueue(EVENT_COMPLETE, a, sysId, String(prop('admin_group')))
            return { count: 1, unit: 'event', detail: EVENT_COMPLETE }
        })

        // ---- [10] complete
        const warn = log.some((l) => l.level !== 'info'), err = log.some((l) => l.level === 'error')
        add(err ? 'warn' : 'info', 10, 'Complete in ' + secs(now() - startMs) + ' s' + (warn ? ' with warnings – see the log.' : '.'))
        save({ status: err ? 'complete_with_warnings' : 'complete', duration: duration() }) // PIV-026.01 AC 3
        return { ok: true, number, sysId, overallScore: pvs, message: number + ' complete. Platform Value Score ' + (pvs === null ? 'Not Measured' : pvs) + '.' }
    } catch (ex) {
        // PIV-034.04 – Failed, with the step name and the error; later steps do not run
        const msg = ex && (ex as any).message ? (ex as any).message : String(ex)
        add('error', 10, 'Step ' + (current || 'start') + ' failed: ' + msg)
        gs.error('PIVOT assessment ' + number + ' failed in step ' + current + ': ' + msg)
        save({ status: 'failed', duration: duration() })
        try { gs.eventQueue(EVENT_FAILED, a, sysId, String(prop('admin_group'))) } catch (e2) { /* the failure is already logged */ }
        return { ok: false, number, sysId, overallScore: null, message: number + ' failed in step ' + current + ': ' + msg }
    }
}

/** Script action on x_enno_pivot.run_assessment (PIV-036.02): parm1 = assessment sys_id. */
export function onRunEvent(parm1: string) {
    if (!parm1) {
        gs.warn('PIVOT assessment: No assessment id supplied')
        return
    }
    const r = run(parm1)
    gs.info('PIVOT assessment: ' + r.message)
}

/** Weekly job "PIVOT weekly assessment" (PIV-035): skipped while another run is Queued or Running. */
export function weeklyJob() {
    const b = busyRun()
    if (b) {
        gs.info('PIVOT weekly run skipped: assessment already running (' + b.number + ')')
        return
    }
    const r = runAssessment('weekly', gs.getUserID())
    gs.info('PIVOT weekly assessment: ' + r.message)
}

/** On-demand scheduled job "PIVOT – Run assessment" (kept for admins and tests; same orchestrator). */
export function assessmentJob() {
    const r = runAssessment('run_now', gs.getUserID())
    gs.info('PIVOT assessment: ' + r.message)
}
