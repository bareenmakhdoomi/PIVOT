// PIV-018 … PIV-025 – the PIVOT assessment run (design B9), steps 1–6 and 10:
//   1 start · 2 discovery · 3 usage measurement · 4 scoring + Platform Value Score · 5 licence utilization
//   6 business outcome KPIs (baseline captured on the first measurement) · 10 complete.
// Steps 7–9 (gap rules, priority, roadmap) arrive in Sprint 4.
// Every count is a GlideAggregate (never a row-by-row loop). Only PIVOT tables are written.
import { gs, GlideRecord, GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { SCOPE, PROPERTIES, scoreOf, utilizationOf, overallScore, outcomeStatus, periodDays } from './rules.ts'
import { runDiscovery, LogEntry } from './discovery.ts'
import { runGapRules } from './gaps.ts'

const T = {
    capability: SCOPE + '_capability',
    assessment: SCOPE + '_assessment',
    result: SCOPE + '_result',
    outcome: SCOPE + '_business_outcome',
    outcomeResult: SCOPE + '_outcome_result',
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

/** One assessment run. trigger: 'weekly' | 'run_now'. Only one run at a time. */
export function runAssessment(trigger: 'weekly' | 'run_now', runBy: string): RunSummary {
    // ---- one run at a time (a run older than 2 × the time limit is treated as crashed)
    const limitMinutes = Number(prop('max_run_minutes')) || 0
    const busy = new GlideRecord(T.assessment)
    busy.addQuery('status', 'IN', 'queued,running')
    busy.query()
    while (busy.next()) {
        const started = str(busy, 'run_date') || str(busy, 'sys_created_on') // hand-made records have no run date
        const age = started ? (now() - new GlideDateTime(started).getNumericValue()) / 60000 : 0
        if (!limitMinutes || age < Math.max(60, limitMinutes * 2))
            return { ok: false, number: str(busy, 'number'), sysId: busy.getUniqueValue(), overallScore: null, message: 'Assessment ' + str(busy, 'number') + ' is already running. Only one assessment can run at a time.' }
        busy.setValue('status', 'failed')
        busy.update()
    }

    const startMs = now()
    const log: LogEntry[] = []
    const add = (level: LogEntry['level'], step: number, message: string) => log.push({ ts: now(), level, step, message })
    const a = new GlideRecord(T.assessment)
    a.initialize()
    a.setValue('status', 'running')
    a.setValue('trigger', trigger)
    a.setValue('run_date', new GlideDateTime().getValue())
    if (runBy) a.setValue('run_by', runBy)
    const sysId = String(a.insert() || '')
    if (!sysId) return { ok: false, number: '', sysId: '', overallScore: null, message: 'The assessment record could not be created.' }
    a.get(sysId)
    const number = str(a, 'number')
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
    add('info', 1, 'Started by ' + (runBy ? gs.getUserDisplayName() : 'System (weekly job)') + ' (' + (trigger === 'run_now' ? 'Run Now' : 'weekly schedule') + ').' + (limitMinutes ? ' Time limit ' + limitMinutes + ' min.' : ' No time limit set.'))
    save({})

    try {
        // ---- 2 discovery
        const d = runDiscovery()
        d.log.forEach((l) => log.push(l))
        save({})

        // ---- 3 measurement, 4 scoring, 5 utilization
        const slowSeconds = Number(prop('slow_capability_seconds')) || 60
        const timingLog = String(prop('timing_log')) === 'true' // PIV-022.02 – per-capability timing in the run log
        const defaultDays = Number(prop('default_days_back')) || 30
        const deadline = limitMinutes ? startMs + limitMinutes * 60000 : 0
        let measured = 0, notMeasured = 0, inactive = 0, slow = 0, limitHit = false
        const scores: { score: number | null; weight: number | null }[] = []
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
            if (sc.score === null) notMeasured++
            else measured++
            scores.push({ score: sc.score, weight: num(c, 'weight') })
        }
        if (limitHit) add('warn', 3, 'Run time limit of ' + limitMinutes + ' min reached: the remaining capabilities are Not Measured.')
        add('info', 3, 'Measurement: ' + (measured + notMeasured) + ' capabilities, ' + measured + ' scored, ' + notMeasured + ' Not Measured, ' + inactive + ' skipped as inactive' + (slow ? ', ' + slow + ' slow' : '') + '.')
        const pvs = overallScore(scores)
        add('info', 4, pvs === null ? 'Scoring: no capability could be scored, so the Platform Value Score stays empty (Not Measured).' : 'Scoring: Platform Value Score ' + pvs + ' (weighted average of ' + measured + ' scored capabilities; Not Measured are left out).')
        add('info', 5, 'Utilization: calculated for every capability with a purchased count.')
        save({ overall_score: pvs === null ? '' : pvs, scored_count: measured, not_measured_count: notMeasured, inactive_count: inactive, slow_count: slow })

        // ---- 6 business outcomes
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
                            add('warn', 6, 'Outcome "' + str(o, 'kpi') + '": manual value dated ' + dated + ' is older than its period (stale).')
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
                            add('warn', 6, 'Outcome "' + str(o, 'kpi') + '": ' + reason + '.')
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
                if (st.reason === 'Target equals baseline') add('warn', 6, 'Outcome "' + str(o, 'kpi') + '": target equals baseline – improvement cannot be calculated.')
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
                add('error', 6, 'Outcome "' + str(o, 'kpi') + '" could not be measured: ' + ex)
            }
        }
        add('info', 6, 'Outcomes: ' + outMeasured + ' measured, ' + outNot + ' Not Measured' + (baselines ? ', ' + baselines + ' baseline(s) captured' : '') + (outInactive ? ', ' + outInactive + ' inactive skipped' : '') + '.')
        save({})

        // ---- 7 gap rules and priority (PIV-028–031)
        const g = runGapRules(sysId, number, add)
        add(g.errors ? 'warn' : 'info', 7, 'Gap rules: ' + g.created + ' opportunities created, ' + g.updated + ' updated, ' + g.resolved + ' gap(s) no longer detected' + (g.kept ? ', ' + g.kept + ' Rejected/Done kept closed' : '') + (g.errors ? ', ' + g.errors + ' error(s)' : '') + '.')
        save({ opportunities_created: g.created })

        // ---- 10 complete
        const dur = new GlideDateTime('1970-01-01 00:00:00')
        dur.add(now() - startMs)
        add(log.some((l) => l.level === 'error') ? 'warn' : 'info', 10, 'Complete in ' + Math.round((now() - startMs) / 1000) + ' s' + (log.some((l) => l.level !== 'info') ? ' with warnings – see the log.' : '.'))
        save({ status: log.some((l) => l.level === 'error') ? 'complete_with_warnings' : 'complete', duration: dur.getValue() }) // PIV-026.01 AC 3
        return { ok: true, number, sysId, overallScore: pvs, message: number + ' complete. Platform Value Score ' + (pvs === null ? 'Not Measured' : pvs) + '.' }
    } catch (ex) {
        add('error', 10, 'Run failed: ' + ex)
        gs.error('PIVOT assessment ' + number + ' failed: ' + ex)
        save({ status: 'failed' })
        return { ok: false, number, sysId, overallScore: null, message: number + ' failed: ' + ex }
    }
}

/** On-demand scheduled job "PIVOT – Run assessment" (the weekly job and Run Now arrive in Sprint 4). */
export function assessmentJob() {
    const r = runAssessment('run_now', gs.getUserID())
    gs.info('PIVOT assessment: ' + r.message)
}
