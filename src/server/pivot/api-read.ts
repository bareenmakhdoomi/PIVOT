// PIV-063 – PIVOT REST resources (read side, summaries, CSV exports, run progress).
// Base: /api/x_enno_pivot/v1/workspace. Contract: docs/PIVOT_API_contract.md.
// Every record read goes through GlideRecordSecure, so table and field ACLs decide what a user sees
// (PIV-063.02). Users without a PIVOT role never get here: the REST ACL returns 403.
// Lists take page (1-based), size (default 5, capped at 50), sort and filters (PIV-063.03) and return
// { items, total, page, size, start, end }. Summaries use GlideAggregate (PIV-063.05).
import { gs, GlideRecordSecure, GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { SCOPE, FAMILIES, PROPERTIES, OPP_ACTIVE, OPP_STATE_LABEL, roadmapPhase } from './rules.ts'
import { STEPS } from './assessment.ts'

const T = {
    capability: SCOPE + '_capability', assessment: SCOPE + '_assessment', result: SCOPE + '_result', opportunity: SCOPE + '_opportunity',
    roadmap: SCOPE + '_roadmap_item', outcome: SCOPE + '_business_outcome', outcomeResult: SCOPE + '_outcome_result',
}
export const MAX_SIZE = 50
export const DEFAULT_SIZE = 5
const DONE = ['complete', 'complete_with_warnings']
const TYPE_LABEL: { [k: string]: string } = { shelfware: 'Shelfware', idle_licences: 'Idle licences', low_adoption: 'Low adoption', not_measured: 'Not measured', weak_outcome: 'Weak outcome', adoption_potential: 'Adoption potential' }
const OUT_LABEL: { [k: string]: string } = { on_target: 'On target', improved: 'Improved', below_target: 'Below target', not_measured: 'Not measured' }
const FAMILY_LABEL: { [k: string]: string } = {}
FAMILIES.forEach((f: any) => (FAMILY_LABEL[f.value] = f.label))

// ---------------------------------------------------------------- helpers
const str = (gr: any, f: string): string => { const v = gr.getValue(f); return v === null || v === undefined ? '' : String(v) }
const num = (gr: any, f: string): number | null => { const v = str(gr, f); return v === '' || isNaN(Number(v)) ? null : Number(v) }
const bool = (gr: any, f: string) => str(gr, f) === '1' || str(gr, f) === 'true'
const prop = (n: string) => gs.getProperty(SCOPE + '.' + n, PROPERTIES[n] ? PROPERTIES[n].def : '')
const isRole = (r: string) => gs.hasRole(SCOPE + '.' + r)
const when = (ms: number) => { const d = new GlideDateTime(); d.setNumericValue(ms); return d.getDisplayValue() }
const parseJson = (s: string, fb: any) => { if (!s) return fb; try { return JSON.parse(s) } catch (e) { return fb } }

/** Query parameter as a string ('' when missing). ServiceNow passes each parameter as an array. */
export function param(request: any, name: string): string {
    const q = request && request.queryParams ? request.queryParams[name] : undefined
    const v = Array.isArray(q) ? q[0] : q
    return v === undefined || v === null ? '' : String(v)
}
export function pathParam(request: any, name: string): string {
    const v = request && request.pathParams ? request.pathParams[name] : ''
    return v === undefined || v === null ? '' : String(v)
}
/** PIV-063.03 – page and size: page ≥ 1, size 1–50 (default 5). */
export function paging(pageRaw: string, sizeRaw: string) {
    const page = Math.max(1, Math.floor(Number(pageRaw) || 1))
    const size = Math.min(MAX_SIZE, Math.max(1, Math.floor(Number(sizeRaw) || DEFAULT_SIZE)))
    return { page, size, from: (page - 1) * size }
}
/** Encoded-query safe text (no ^ or newlines). */
const safe = (s: string) => String(s || '').replace(/[\^\r\n]/g, ' ').trim().slice(0, 100)

/** Runs a secure query twice: once for the total, once for the page window. */
function pageOf(table: string, query: string, sort: string, page: { page: number; size: number; from: number }, row: (gr: any) => any) {
    const count = new GlideRecordSecure(table)
    if (query) count.addEncodedQuery(query)
    count.query()
    const total = count.getRowCount()
    const gr = new GlideRecordSecure(table)
    if (query) gr.addEncodedQuery(query)
    sort.split(',').filter((x) => !!x).forEach((s) => (s.charAt(0) === '-' ? gr.orderByDesc(s.slice(1)) : gr.orderBy(s)))
    gr.chooseWindow(page.from, page.from + page.size, false)
    gr.query()
    const items: any[] = []
    while (gr.next()) items.push(row(gr))
    return { items, total, page: page.page, size: page.size, start: items.length ? page.from + 1 : 0, end: page.from + items.length }
}
function pickSort(raw: string, allowed: { [k: string]: string }, def: string) {
    const key = raw.replace(/^-/, '')
    if (!allowed[key]) return def
    return (raw.charAt(0) === '-' ? '-' : '') + allowed[key]
}

// ---------------------------------------------------------------- rows
function latestRun(): any {
    const a = new GlideRecordSecure(T.assessment)
    a.addQuery('status', 'IN', DONE.join(','))
    a.orderByDesc('run_date')
    a.setLimit(2)
    a.query()
    const runs: any[] = []
    while (a.next()) runs.push(asmRow(a))
    return { latest: runs[0] || null, previous: runs[1] || null }
}
function asmRow(a: any) {
    const log = parseJson(str(a, 'log'), [])
    const last = Array.isArray(log) && log.length ? log[log.length - 1] : null
    return {
        id: a.getUniqueValue(), number: str(a, 'number'), status: str(a, 'status'), statusLabel: a.getDisplayValue('status'),
        trigger: str(a, 'trigger'), triggerLabel: a.getDisplayValue('trigger'), run_date: str(a, 'run_date'), run_by: a.getDisplayValue('run_by'),
        duration: a.getDisplayValue('duration'), overall_score: num(a, 'overall_score'), scored: num(a, 'scored_count'),
        not_measured: num(a, 'not_measured_count'), inactive: num(a, 'inactive_count'), slow: num(a, 'slow_count'),
        opportunities_created: num(a, 'opportunities_created'), step: last ? Number(last.step) || 0 : 0, last_message: last ? String(last.message || '') : '',
    }
}
function scoresOf(runId: string, capIds?: string[]) {
    const out: { [cap: string]: any } = {}
    if (!runId) return out
    const r = new GlideRecordSecure(T.result)
    r.addQuery('assessment', runId)
    if (capIds) r.addQuery('capability', 'IN', capIds.join(','))
    r.query()
    while (r.next()) out[str(r, 'capability')] = { score: num(r, 'score'), utilization: num(r, 'utilization'), actual: num(r, 'actual_value'), target: num(r, 'target_value'), status: str(r, 'measurement_status'), reason: str(r, 'reason') }
    return out
}
export function bandOf(score: number | null, low: number, high: number): string {
    if (score === null || score === undefined) return 'not_measured'
    return score >= high ? 'high' : score < low ? 'low' : 'medium'
}
function capRow(c: any, sc?: any) {
    const low = Number(prop('low_score_threshold')), high = Number(prop('high_usage_threshold'))
    const s = sc || {}
    return {
        id: c.getUniqueValue(), number: str(c, 'number'), name: str(c, 'name'), family: str(c, 'product_family'), familyLabel: FAMILY_LABEL[str(c, 'product_family')] || '',
        source: str(c, 'source'), licensed: bool(c, 'licensed'), installed: bool(c, 'installed'), entitled: num(c, 'entitled_count'), allocated: num(c, 'allocated_count'),
        scope: str(c, 'app_scope'), active: bool(c, 'active'), measure_table: str(c, 'measure_table'), target: num(c, 'target_value'), weight: num(c, 'weight'),
        score: s.score === undefined ? null : s.score, utilization: s.utilization === undefined ? null : s.utilization, band: bandOf(s.score === undefined ? null : s.score, low, high),
        last_discovered: str(c, 'last_discovered'),
    }
}
function oppRow(o: any) {
    const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
    return {
        id: o.getUniqueValue(), number: str(o, 'number'), capability: str(o, 'capability'), capabilityName: o.getDisplayValue('capability'),
        type: str(o, 'type'), typeLabel: TYPE_LABEL[str(o, 'type')] || str(o, 'type'), short_description: str(o, 'short_description'), description: str(o, 'description'),
        state: str(o, 'state'), stateLabel: OPP_STATE_LABEL[str(o, 'state')] || str(o, 'state'), value: num(o, 'value'), business_impact: num(o, 'business_impact'),
        effort: num(o, 'effort'), priority: num(o, 'priority'), priority_reason: str(o, 'priority_reason'),
        phase: OPP_ACTIVE.indexOf(str(o, 'state')) > -1 ? roadmapPhase(num(o, 'priority'), nowAt, nextAt) : '',
        assigned_to: str(o, 'assigned_to'), assignedName: o.getDisplayValue('assigned_to'), assignment_group: str(o, 'assignment_group'), groupName: o.getDisplayValue('assignment_group'),
        outcome: str(o, 'outcome'), gap_resolved: bool(o, 'gap_resolved'), rejection_reason: str(o, 'rejection_reason'), assessment: o.getDisplayValue('assessment'),
        updated: str(o, 'sys_updated_on'), editable: o.canWrite(),
    }
}
function outcomeRow(o: any) {
    const me = gs.getUserID()
    return {
        id: o.getUniqueValue(), capability: str(o, 'capability'), capabilityName: o.getDisplayValue('capability'), objective: str(o, 'objective'), kpi: str(o, 'kpi'),
        direction: str(o, 'direction'), measurement_type: str(o, 'measurement_type'), baseline: num(o, 'baseline'), current_value: num(o, 'current_value'),
        target: num(o, 'target'), status: str(o, 'status') || 'not_measured', statusLabel: OUT_LABEL[str(o, 'status')] || 'Not measured',
        owner: str(o, 'owner'), ownerName: o.getDisplayValue('owner'), important_objective: bool(o, 'important_objective'), active: str(o, 'active') !== '0' && str(o, 'active') !== 'false',
        // PIV-063.02 AC 2 – admins may edit every outcome, business owners only their own
        editable: isRole('admin') || (isRole('business_owner') && str(o, 'owner') === me && o.canWrite()),
    }
}

// ---------------------------------------------------------------- resources
export function capabilities(request: any) {
    const p = paging(param(request, 'page'), param(request, 'size'))
    const q: string[] = []
    const active = param(request, 'active') || 'true'
    if (active !== 'all') q.push('active=' + (active === 'false' ? 'false' : 'true'))
    if (param(request, 'family')) q.push(param(request, 'family') === 'none' ? 'product_familyISEMPTY' : 'product_family=' + safe(param(request, 'family')))
    if (param(request, 'licensed')) q.push('licensed=' + (param(request, 'licensed') === 'true'))
    if (param(request, 'installed')) q.push('installed=' + (param(request, 'installed') === 'true'))
    const text = safe(param(request, 'q'))
    if (text) q.push('nameLIKE' + text + '^ORnumberLIKE' + text + '^ORapp_scopeLIKE' + text + '^ORmeasure_tableLIKE' + text)
    const sort = pickSort(param(request, 'sort') || 'name', { name: 'name', number: 'number', family: 'product_family', discovered: 'last_discovered' }, 'name')
    const run = latestRun().latest
    const res = pageOf(T.capability, q.join('^'), sort, p, (c) => capRow(c))
    const sc = scoresOf(run ? run.id : '', res.items.map((c: any) => c.id))
    const low = Number(prop('low_score_threshold')), high = Number(prop('high_usage_threshold'))
    res.items.forEach((c: any) => {
        const x = sc[c.id] || {}
        c.score = x.score === undefined ? null : x.score
        c.utilization = x.utilization === undefined ? null : x.utilization
        c.band = bandOf(c.score, low, high)
    })
    return Object.assign(res, { run: run ? run.number : '' })
}
export function capability(request: any) {
    const id = pathParam(request, 'id')
    const c = new GlideRecordSecure(T.capability)
    if (!(c.get(id) || c.get('number', id))) return null
    const capId = c.getUniqueValue()
    const history: any[] = []
    const r = new GlideRecordSecure(T.result)
    r.addQuery('capability', capId)
    r.orderByDesc('sys_created_on')
    r.setLimit(8)
    r.query()
    while (r.next()) history.push({ assessment: r.getDisplayValue('assessment'), date: str(r, 'sys_created_on'), score: num(r, 'score'), actual: num(r, 'actual_value'), target: num(r, 'target_value'), utilization: num(r, 'utilization'), status: str(r, 'measurement_status'), reason: str(r, 'reason') })
    const outcomes: any[] = []
    const o = new GlideRecordSecure(T.outcome)
    o.addQuery('capability', capId)
    o.query()
    while (o.next()) outcomes.push(outcomeRow(o))
    const opps: any[] = []
    const op = new GlideRecordSecure(T.opportunity)
    op.addQuery('capability', capId)
    op.orderByDesc('priority')
    op.query()
    while (op.next()) opps.push(oppRow(op))
    const latest = history.length ? { score: history[0].score, utilization: history[0].utilization } : undefined
    return Object.assign(capRow(c, latest), { measure_filter: str(c, 'measure_filter'), date_field: str(c, 'date_field'), days_back: num(c, 'days_back'), editable: isRole('admin') && c.canWrite(), results: history, outcomes, opportunities: opps })
}
export function opportunities(request: any) {
    const p = paging(param(request, 'page'), param(request, 'size'))
    const q: string[] = []
    const state = param(request, 'state') || 'active'
    if (state === 'active') q.push('stateIN' + OPP_ACTIVE.join(','))
    else if (state !== 'all') q.push('state=' + safe(state))
    if (param(request, 'type')) q.push('type=' + safe(param(request, 'type')))
    if (param(request, 'capability')) q.push('capability=' + safe(param(request, 'capability')))
    if (param(request, 'family')) q.push('capability.product_family=' + safe(param(request, 'family')))
    const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
    const phase = param(request, 'phase')
    if (phase === 'now') q.push('priority>=' + nowAt)
    else if (phase === 'next') q.push('priority>=' + nextAt + '^priority<' + nowAt)
    else if (phase === 'later') q.push('priority<' + nextAt + '^ORpriorityISEMPTY')
    const who = param(request, 'assigned')
    if (who === 'me') q.push('assigned_to=' + gs.getUserID())
    else if (who === 'none') q.push('assigned_toISEMPTY')
    else if (who) q.push('assigned_to=' + safe(who))
    const text = safe(param(request, 'q'))
    if (text) q.push('numberLIKE' + text + '^ORshort_descriptionLIKE' + text + '^ORcapability.nameLIKE' + text)
    const sort = pickSort(param(request, 'sort') || '-priority', { priority: 'priority', number: 'number', updated: 'sys_updated_on', value: 'value' }, '-priority')
    return pageOf(T.opportunity, q.join('^'), sort + (sort.indexOf('number') < 0 ? ',number' : ''), p, oppRow)
}
export function opportunity(request: any) {
    const id = pathParam(request, 'id')
    const o = new GlideRecordSecure(T.opportunity)
    if (!(o.get('number', id) || o.get(id))) return null
    return Object.assign(oppRow(o), { activity: parseJson(str(o, 'activity_log'), []), measured_value: str(o, 'measured_value') })
}
export function roadmap() {
    const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
    const cols: any = {
        now: { label: 'Now', rule: 'priority ≥ ' + nowAt, items: [] as any[] },
        next: { label: 'Next', rule: nextAt + ' to below ' + nowAt, items: [] as any[] },
        later: { label: 'Later', rule: 'below ' + nextAt, items: [] as any[] },
    }
    const it = new GlideRecordSecure(T.roadmap)
    it.addQuery('opportunity.state', 'IN', OPP_ACTIVE.join(','))
    it.orderBy('sequence')
    it.query()
    while (it.next()) {
        const o = new GlideRecordSecure(T.opportunity)
        if (!o.get(str(it, 'opportunity'))) continue
        const row = oppRow(o)
        const col = cols[str(it, 'phase')] || cols[row.phase] || cols.later
        col.items.push(Object.assign(row, { sequence: num(it, 'sequence'), roadmapAssessment: it.getDisplayValue('assessment') }))
    }
    const done = new GlideAggregate(T.opportunity)
    done.addQuery('state', '=', 'done')
    ;(done as any).addAggregate('COUNT')
    done.query()
    const doneCount = done.next() ? Number((done as any).getAggregate('COUNT')) : 0
    Object.keys(cols).forEach((k) => (cols[k].count = cols[k].items.length))
    return { columns: cols, done: { label: 'Closed as done', rule: 'not on the roadmap', count: doneCount } }
}
export function outcomes(request: any) {
    const p = paging(param(request, 'page'), param(request, 'size'))
    const q: string[] = []
    if (param(request, 'status')) q.push('status=' + safe(param(request, 'status')))
    if (param(request, 'capability')) q.push('capability=' + safe(param(request, 'capability')))
    if (param(request, 'owner') === 'me') q.push('owner=' + gs.getUserID())
    if (param(request, 'active') !== 'all') q.push('active=true^ORactiveISEMPTY')
    const text = safe(param(request, 'q'))
    if (text) q.push('kpiLIKE' + text + '^ORobjectiveLIKE' + text)
    const sort = pickSort(param(request, 'sort') || 'kpi', { kpi: 'kpi', status: 'status', updated: 'sys_updated_on' }, 'kpi')
    return pageOf(T.outcome, q.join('^'), sort, p, outcomeRow)
}
export function outcome(request: any) {
    const o = new GlideRecordSecure(T.outcome)
    if (!o.get(pathParam(request, 'id'))) return null
    const results: any[] = []
    const r = new GlideRecordSecure(T.outcomeResult)
    r.addQuery('outcome', o.getUniqueValue())
    r.orderByDesc('sys_created_on')
    r.setLimit(8)
    r.query()
    while (r.next()) results.push({ assessment: r.getDisplayValue('assessment'), date: str(r, 'sys_created_on'), baseline: num(r, 'baseline'), actual: num(r, 'actual'), target: num(r, 'target'), improvement_pct: num(r, 'improvement_pct'), status: str(r, 'outcome_status'), reason: str(r, 'reason') })
    return Object.assign(outcomeRow(o), { period: str(o, 'period'), kpi_table: str(o, 'kpi_table'), kpi_filter: str(o, 'kpi_filter'), expected_benefit: str(o, 'expected_benefit'), results })
}
export function assessments(request: any) {
    const p = paging(param(request, 'page'), param(request, 'size'))
    const q: string[] = []
    if (param(request, 'status')) q.push('status=' + safe(param(request, 'status')))
    if (param(request, 'trigger')) q.push('trigger=' + safe(param(request, 'trigger')))
    return pageOf(T.assessment, q.join('^'), '-run_date', p, asmRow)
}
/** PIV-063.07 – the running assessment: number, step n of 10, last log message; {} when none. */
export function running() {
    const a = new GlideRecordSecure(T.assessment)
    a.addQuery('status', 'IN', 'queued,running')
    a.orderByDesc('sys_created_on')
    a.setLimit(1)
    a.query()
    if (!a.next()) return {}
    const r = asmRow(a)
    return { number: r.number, status: r.status, step: r.step, of: 10, stepName: r.step >= 2 && r.step <= 9 ? STEPS[r.step - 2] : r.step === 1 ? 'start' : r.step === 10 ? 'complete' : 'queued', last_message: r.last_message, run_date: r.run_date }
}
export function assessment(request: any) {
    const id = pathParam(request, 'id')
    if (id === 'running') return running()
    const a = new GlideRecordSecure(T.assessment)
    if (!(a.get('number', id) || a.get(id))) return null
    return Object.assign(asmRow(a), { log: parseJson(str(a, 'log'), []) })
}

/** PIV-063.05 – the figures the Dashboard and Reports both show (one function, so they are always identical). */
export function summary() {
    const runs = latestRun()
    const run = runs.latest, prev = runs.previous
    const count = (table: string, q: string, group?: string) => {
        const g = new GlideAggregate(table)
        if (q) g.addEncodedQuery(q)
        ;(g as any).addAggregate('COUNT')
        if (group) g.groupBy(group)
        g.query()
        const out: { [k: string]: number } = {}
        while (g.next()) out[group ? g.getValue(group) || '' : 'all'] = Number((g as any).getAggregate('COUNT'))
        return out
    }
    const oppByState = count(T.opportunity, '', 'state')
    const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
    const act = 'stateIN' + OPP_ACTIVE.join(',')
    const phases = {
        now: (count(T.opportunity, act + '^priority>=' + nowAt).all || 0),
        next: (count(T.opportunity, act + '^priority>=' + nextAt + '^priority<' + nowAt).all || 0),
        later: (count(T.opportunity, act + '^priority<' + nextAt + '^ORpriorityISEMPTY').all || 0),
    }
    const outByStatus = count(T.outcome, 'active=true^ORactiveISEMPTY', 'status')
    const lni = run ? count(T.result, 'assessment=' + run.id + '^licensed=true^installed=false').all || 0 : 0
    const checked = run ? count(T.result, 'assessment=' + run.id).all || 0 : 0
    const top: any[] = []
    const o = new GlideRecordSecure(T.opportunity)
    o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
    o.addQuery('priority', '>=', nowAt)
    o.orderByDesc('priority')
    o.setLimit(3)
    o.query()
    while (o.next()) top.push(oppRow(o))
    const change = run && prev && run.overall_score !== null && prev.overall_score !== null ? Math.round((run.overall_score - prev.overall_score) * 10) / 10 : null
    return {
        run: run ? { number: run.number, date: run.run_date, trigger: run.triggerLabel, status: run.statusLabel, score: run.overall_score, previousScore: prev ? prev.overall_score : null, change, checked, scored: run.scored, notMeasured: run.not_measured, licensedNotInstalled: lni } : null,
        headline: !run ? 'No assessment has completed yet.' : run.overall_score === null ? 'Platform Value Score not measured in ' + run.number + '.'
            : 'Platform Value Score ' + run.overall_score + (change === null ? '.' : change === 0 ? ', unchanged since the previous run.' : ', ' + (change > 0 ? 'up ' : 'down ') + Math.abs(change) + ' since the previous run.'),
        opportunities: { byState: oppByState, active: OPP_ACTIVE.reduce((t, s) => t + (oppByState[s] || 0), 0), phases },
        outcomes: { byStatus: outByStatus, total: Object.keys(outByStatus).reduce((t, k) => t + outByStatus[k], 0) },
        topNow: top,
        running: running(),
    }
}
export function dashboard() {
    return summary()
}
export function analytics(request: any) {
    const runId = param(request, 'run')
    let run: any = null
    const a = new GlideRecordSecure(T.assessment)
    if (runId && (a.get('number', runId) || a.get(runId))) run = asmRow(a)
    else run = latestRun().latest
    const low = Number(prop('low_score_threshold')), high = Number(prop('high_usage_threshold'))
    const family = param(request, 'family'), band = param(request, 'band')
    const bands: { [k: string]: number } = { high: 0, medium: 0, low: 0, not_measured: 0 }
    const fam: { [k: string]: { label: string; count: number; scored: number; sum: number } } = {}
    const items: any[] = []
    if (run) {
        const r = new GlideRecordSecure(T.result)
        r.addQuery('assessment', run.id)
        if (family) r.addQuery('capability.product_family', family)
        r.query()
        while (r.next()) {
            const sc = num(r, 'score'), b = bandOf(sc, low, high)
            if (band && b !== band) continue
            bands[b]++
            const f = String((r as any).getElement('capability.product_family') || '') || 'none'
            if (!fam[f]) fam[f] = { label: FAMILY_LABEL[f] || 'Needs mapping', count: 0, scored: 0, sum: 0 }
            fam[f].count++
            if (sc !== null) { fam[f].scored++; fam[f].sum += sc }
            items.push({ capability: str(r, 'capability'), name: r.getDisplayValue('capability'), family: f, score: sc, band: b, utilization: num(r, 'utilization') })
        }
    }
    const runsList: any[] = []
    const h = new GlideRecordSecure(T.assessment)
    h.addQuery('status', 'IN', DONE.join(','))
    h.orderByDesc('run_date')
    h.setLimit(8)
    h.query()
    while (h.next()) runsList.push({ number: str(h, 'number'), date: str(h, 'run_date'), score: num(h, 'overall_score') })
    const p = paging(param(request, 'page'), param(request, 'size'))
    items.sort((x, y) => (y.score === null ? -1 : y.score) - (x.score === null ? -1 : x.score) || (x.name < y.name ? -1 : 1))
    const slice = items.slice(p.from, p.from + p.size)
    return {
        run: run ? run.number : '', runs: runsList, bands,
        families: Object.keys(fam).map((k) => ({ family: k, label: fam[k].label, count: fam[k].count, scored: fam[k].scored, average: fam[k].scored ? Math.round((fam[k].sum / fam[k].scored) * 10) / 10 : null })),
        items: slice, total: items.length, page: p.page, size: p.size, start: slice.length ? p.from + 1 : 0, end: p.from + slice.length,
    }
}
export function reports() {
    const s = summary()
    const history: any[] = []
    const h = new GlideRecordSecure(T.assessment)
    h.orderByDesc('run_date')
    h.setLimit(8)
    h.query()
    while (h.next()) history.push(asmRow(h))
    return Object.assign(s, {
        history,
        exports: EXPORTS.map((e) => ({ name: e, file: 'pivot_' + e + '.csv', url: '/api/x_enno_pivot/v1/workspace/export/' + e })),
    })
}
export function properties() {
    const admin = isRole('admin')
    return Object.keys(PROPERTIES).map((k) => ({ name: SCOPE + '.' + k, short: k, type: PROPERTIES[k].type, value: String(prop(k)), default: PROPERTIES[k].def, editable: admin }))
}
/** PIV-065.01 – search: up to 8 per group (capabilities, opportunities, outcomes, assessments). */
export function search(request: any) {
    const text = safe(param(request, 'q'))
    if (text.length < 2) return { q: text, capabilities: [], opportunities: [], outcomes: [], assessments: [] }
    const find = (table: string, query: string, row: (g: any) => any) => {
        const g = new GlideRecordSecure(table)
        g.addEncodedQuery(query)
        g.setLimit(8)
        g.query()
        const out: any[] = []
        while (g.next()) out.push(row(g))
        return out
    }
    return {
        q: text,
        capabilities: find(T.capability, 'nameLIKE' + text + '^ORnumberLIKE' + text + '^ORapp_scopeLIKE' + text + '^ORmeasure_tableLIKE' + text, (g) => ({ id: g.getUniqueValue(), number: str(g, 'number'), name: str(g, 'name') })),
        opportunities: find(T.opportunity, 'numberLIKE' + text + '^ORshort_descriptionLIKE' + text, (g) => ({ id: g.getUniqueValue(), number: str(g, 'number'), title: str(g, 'short_description'), state: str(g, 'state') })),
        outcomes: find(T.outcome, 'kpiLIKE' + text + '^ORobjectiveLIKE' + text, (g) => ({ id: g.getUniqueValue(), kpi: str(g, 'kpi'), objective: str(g, 'objective') })),
        assessments: find(T.assessment, 'numberLIKE' + text, (g) => ({ id: g.getUniqueValue(), number: str(g, 'number'), status: str(g, 'status') })),
    }
}
/** PIV-065.02 – notifications from PIVOT data. */
export function notifications() {
    const items: any[] = []
    const run = running()
    if ((run as any).number) items.push({ kind: 'running', title: (run as any).number + ' is running', text: 'Step ' + (run as any).step + ' of 10 · ' + (run as any).last_message })
    const s = summary()
    if (s.run) items.push({ kind: 'run', title: 'PIVOT run ' + (s.run.status || '').toLowerCase() + ' · ' + s.run.number, text: s.headline })
    const failed = new GlideRecordSecure(T.assessment)
    failed.orderByDesc('sys_created_on')
    failed.setLimit(1)
    failed.query()
    if (failed.next() && str(failed, 'status') === 'failed') items.push({ kind: 'failed', title: 'PIVOT run failed · ' + str(failed, 'number'), text: asmRow(failed).last_message })
    const below = new GlideRecordSecure(T.outcome)
    below.addQuery('status', 'below_target')
    below.addEncodedQuery('active=true^ORactiveISEMPTY')
    below.setLimit(5)
    below.query()
    while (below.next()) items.push({ kind: 'outcome', title: 'Below target · ' + str(below, 'kpi'), text: 'Current ' + (num(below, 'current_value') === null ? '—' : num(below, 'current_value')) + ', target ' + (num(below, 'target') === null ? '—' : num(below, 'target')) })
    if (isRole('admin')) {
        const nm = new GlideAggregate(T.capability)
        nm.addQuery('active', '=', true)
        nm.addNullQuery('product_family')
        ;(nm as any).addAggregate('COUNT')
        nm.query()
        const n = nm.next() ? Number((nm as any).getAggregate('COUNT')) : 0
        if (n) items.push({ kind: 'mapping', title: n + ' capabilities need a product family', text: 'Map them in the Capability Library (Needs mapping).' })
    }
    return { items }
}

// ---------------------------------------------------------------- CSV exports (PIV-063.06)
export const EXPORTS = ['executive_summary', 'capabilities', 'outcomes', 'opportunities', 'assessments', 'roadmap', 'decision_log']
export function csvText(rows: unknown[][]): string {
    return rows.map((r) => r.map((v) => {
        const s = v === null || v === undefined ? '' : String(v)
        return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
    }).join(',')).join('\r\n')
}
function all(table: string, query: string, sort: string, row: (g: any) => unknown[]) {
    const out: unknown[][] = []
    const g = new GlideRecordSecure(table)
    if (query) g.addEncodedQuery(query)
    sort.split(',').filter((x) => !!x).forEach((s) => (s.charAt(0) === '-' ? g.orderByDesc(s.slice(1)) : g.orderBy(s)))
    g.setLimit(10000)
    g.query()
    while (g.next()) out.push(row(g))
    return out
}
export function exportRows(name: string): unknown[][] | null {
    switch (name) {
        case 'executive_summary': {
            const s = summary()
            const r = s.run
            return [['Measure', 'Value'], ['Latest run', r ? r.number : ''], ['Run date', r ? r.date : ''], ['Platform Value Score', r ? r.score : ''], ['Change since previous run', r ? r.change : ''],
                ['Capabilities checked', r ? r.checked : ''], ['Scored', r ? r.scored : ''], ['Not Measured', r ? r.notMeasured : ''], ['Licensed, not installed', r ? r.licensedNotInstalled : ''],
                ['Active opportunities', s.opportunities.active], ['Now', s.opportunities.phases.now], ['Next', s.opportunities.phases.next], ['Later', s.opportunities.phases.later],
                ['Outcomes', s.outcomes.total], ['On target', s.outcomes.byStatus.on_target || 0], ['Improved', s.outcomes.byStatus.improved || 0], ['Below target', s.outcomes.byStatus.below_target || 0], ['Not measured', s.outcomes.byStatus.not_measured || 0]]
        }
        case 'capabilities': {
            const run = latestRun().latest
            const sc = scoresOf(run ? run.id : '')
            return ([['Number', 'Name', 'Product family', 'Source', 'Licensed', 'Installed', 'Active', 'Score', 'Band', 'Utilization %', 'Measure table', 'Target']] as unknown[][]).concat(
                all(T.capability, '', 'name', (g) => { const c = capRow(g, sc[g.getUniqueValue()]); return [c.number, c.name, c.familyLabel, c.source, c.licensed, c.installed, c.active, c.score, c.band, c.utilization, c.measure_table, c.target] }))
        }
        case 'outcomes':
            return ([['KPI', 'Objective', 'Capability', 'Owner', 'Baseline', 'Current', 'Target', 'Status', 'Important objective']] as unknown[][]).concat(
                all(T.outcome, '', 'kpi', (g) => { const o = outcomeRow(g); return [o.kpi, o.objective, o.capabilityName, o.ownerName, o.baseline, o.current_value, o.target, o.statusLabel, o.important_objective] }))
        case 'opportunities':
            return ([['Number', 'Capability', 'Type', 'Title', 'Value', 'Business impact', 'Effort', 'Priority', 'Reason', 'Roadmap', 'State', 'Assignment group', 'Assigned to', 'Rejection reason']] as unknown[][]).concat(
                all(T.opportunity, '', '-priority,number', (g) => { const o = oppRow(g); return [o.number, o.capabilityName, o.typeLabel, o.short_description, o.value, o.business_impact, o.effort, o.priority, o.priority_reason, o.phase, o.stateLabel, o.groupName, o.assignedName, o.rejection_reason] }))
        case 'assessments':
            return ([['Number', 'Status', 'Trigger', 'Run date', 'Run by', 'Duration', 'Platform Value Score', 'Scored', 'Not Measured', 'Opportunities created']] as unknown[][]).concat(
                all(T.assessment, '', '-run_date', (g) => { const a = asmRow(g); return [a.number, a.statusLabel, a.triggerLabel, a.run_date, a.run_by, a.duration, a.overall_score, a.scored, a.not_measured, a.opportunities_created] }))
        case 'roadmap': {
            const rm = roadmap()
            const rows: unknown[][] = [['Column', 'Order', 'Number', 'Capability', 'Type', 'Priority', 'Reason', 'State', 'Owner']]
            Object.keys(rm.columns).forEach((k) => rm.columns[k].items.forEach((o: any) => rows.push([rm.columns[k].label, o.sequence, o.number, o.capabilityName, o.typeLabel, o.priority, o.priority_reason, o.stateLabel, o.assignedName])))
            return rows
        }
        case 'decision_log': {
            const rows: unknown[][] = [['Number', 'Capability', 'Time', 'User', 'Entry']]
            all(T.opportunity, '', 'number', (g) => {
                const list = parseJson(str(g, 'activity_log'), [])
                if (Array.isArray(list)) list.forEach((e: any) => rows.push([str(g, 'number'), g.getDisplayValue('capability'), e && e.ts ? when(Number(e.ts)) : '', e && e.user ? e.user : '', e && e.text ? e.text : '']))
                return []
            })
            return rows
        }
    }
    return null
}

// ---------------------------------------------------------------- REST handlers
function send(response: any, fn: () => any) {
    try {
        const body = fn()
        if (body === null) {
            response.setStatus(404)
            response.setBody({ ok: false, error: 'Not found, or you cannot read it.' })
            return
        }
        response.setStatus(200)
        response.setBody(body)
    } catch (ex) {
        gs.error('PIVOT API failed: ' + ex)
        response.setStatus(500)
        response.setBody({ ok: false, error: 'PIVOT could not load its data. Ask your PIVOT admin to check the system log.' })
    }
}
export const getDashboard = (request: any, response: any) => send(response, () => dashboard())
export const getAnalytics = (request: any, response: any) => send(response, () => analytics(request))
export const getCapabilities = (request: any, response: any) => send(response, () => capabilities(request))
export const getCapability = (request: any, response: any) => send(response, () => capability(request))
export const getOpportunities = (request: any, response: any) => send(response, () => opportunities(request))
export const getOpportunity = (request: any, response: any) => send(response, () => opportunity(request))
export const getRoadmap = (request: any, response: any) => send(response, () => roadmap())
export const getOutcomes = (request: any, response: any) => send(response, () => outcomes(request))
export const getOutcome = (request: any, response: any) => send(response, () => outcome(request))
export const getAssessments = (request: any, response: any) => send(response, () => assessments(request))
export const getAssessment = (request: any, response: any) => send(response, () => assessment(request))
export const getReports = (request: any, response: any) => send(response, () => reports())
export const getProperties = (request: any, response: any) => send(response, () => ({ items: properties() }))
export const getSearch = (request: any, response: any) => send(response, () => search(request))
export const getNotifications = (request: any, response: any) => send(response, () => notifications())
export function getExport(request: any, response: any) {
    try {
        const name = pathParam(request, 'name')
        const rows = exportRows(name)
        if (!rows) {
            response.setStatus(404)
            response.setBody({ ok: false, error: 'Unknown export. Use one of: ' + EXPORTS.join(', ') + '.' })
            return
        }
        response.setStatus(200)
        response.setContentType('text/csv; charset=utf-8')
        response.setHeader('Content-Disposition', 'attachment; filename="pivot_' + name + '.csv"')
        response.getStreamWriter().writeString('﻿' + csvText(rows))
    } catch (ex) {
        gs.error('PIVOT export failed: ' + ex)
        response.setStatus(500)
        response.setBody({ ok: false, error: 'PIVOT could not create the export.' })
    }
}
