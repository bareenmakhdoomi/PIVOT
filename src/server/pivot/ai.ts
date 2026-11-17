// PIVOT AI features (Sprint 6, EP10 – PIV-054 … PIV-060). Design rules:
//  * Facts first: every skill reads the PIVOT records as the user (GlideRecordSecure) and passes only those facts
//    to the LLM (Generative AI Controller through sn_generative_ai.LLMClient – the provider set on the instance).
//  * Numbers are never trusted: every number in an AI answer must appear in the facts. When an answer fails that
//    check, is too long or cannot be read, PIVOT shows its own rule-based text instead and labels it as such.
//  * Suggestions never save themselves. Only a person's click changes a record; priority and horizon are always
//    calculated by the PIVOT rules (rules.ts), never by the AI.
//  * Every AI answer and the user's decision is logged in x_enno_pivot_ai_log (PIV-054.06).
//  * x_enno_pivot.ai_enabled = false switches every AI feature off; PIVOT works fully without them (PIV-054.03).
import { gs, GlideRecord, GlideRecordSecure, GlideDateTime, GlideAggregate } from '@servicenow/glide'
import { SCOPE, PROPERTIES, FAMILIES, OPP_ACTIVE, OPP_STATE_LABEL, roadmapPhase, impactFromStatus, outcomeStatus, gapConfig } from './rules.ts'

declare const sn_generative_ai: any

const T = {
    capability: SCOPE + '_capability',
    assessment: SCOPE + '_assessment',
    result: SCOPE + '_result',
    opportunity: SCOPE + '_opportunity',
    roadmap: SCOPE + '_roadmap_item',
    outcome: SCOPE + '_business_outcome',
    outcomeResult: SCOPE + '_outcome_result',
    log: SCOPE + '_ai_log',
}
export const MSG = {
    off: 'AI features are switched off in Settings.',
    notSetUp: 'AI is not set up on this instance',
    noRole: 'You do not have access to PIVOT. Ask your PIVOT admin for a PIVOT role.',
    suggestRole: 'Only analysts and admins can ask for AI suggestions.',
    explainFailed: 'Explanation not available right now',
    failed: 'Not available right now. Try again in a moment.',
    footer: 'Review before use. AI never changes PIVOT numbers itself.',
}
const TYPE_LABEL: { [k: string]: string } = {
    shelfware: 'Shelfware', idle_licences: 'Idle licences', low_adoption: 'Low adoption', not_measured: 'Not measured',
    weak_outcome: 'Weak outcome', adoption_potential: 'Adoption potential', adoption: 'Adoption', license: 'License',
}
const PHASE_LABEL: { [k: string]: string } = { now: 'Now', next: 'Next', later: 'Later' }
const SKILL_LABEL: { [k: string]: string } = { explain: 'Explain this finding', briefing: 'Assessment briefing', scores: 'Suggest scores', owner: 'Suggest owner',
    owners_bulk: 'Suggest owners (roadmap)', plan: 'Draft action plan', ask: 'Ask PIVOT', chat_action: 'Chat action', test: 'Provider test' }
const STALE_DAYS = 30
const DAY = 86400000

export type AiResult = { ok: boolean; [k: string]: any }

// ---------------------------------------------------------------- small helpers
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
const r1 = (n: number) => Math.round(n * 10) / 10
const nowMs = () => new GlideDateTime().getNumericValue()
const ms = (v: string): number | null => (v ? new GlideDateTime(v).getNumericValue() : null)
const isRole = (r: string) => gs.hasRole(SCOPE + '.' + r)
export const hasPivotRole = () => isRole('viewer') || isRole('analyst') || isRole('business_owner') || isRole('admin')
export const canSuggest = () => isRole('analyst') || isRole('admin')
export const aiEnabled = () => String(prop('ai_enabled')) === 'true'
const familyLabel = (v: string) => {
    for (let i = 0; i < FAMILIES.length; i++) if (FAMILIES[i].value === v) return FAMILIES[i].label
    return v || 'Needs mapping'
}
function dateText(v: string): string {
    if (!v) return ''
    try { return (new GlideDateTime(v) as any).getLocalDate().getByFormat('d MMM yyyy') } catch (e) { return v.slice(0, 10) }
}
function timeText(v: string): string {
    if (!v) return ''
    try { return (new GlideDateTime(v) as any).getLocalTime().getByFormat('HH:mm') } catch (e) { return v.slice(11, 16) }
}
function userName(id: string) {
    if (!id) return ''
    const u = new GlideRecord('sys_user')
    return u.get('sys_id', id) ? str(u, 'name') : ''
}
const wordCount = (s: string) => String(s || '').split(/\s+/).filter((w) => !!w).length
const signed = (n: number) => (n > 0 ? 'up ' + r1(n) : n < 0 ? 'down ' + r1(-n) : 'unchanged')

/** The label every AI text carries (PIV-054.05): "AI-generated · Now Assist · AI-generated from PVA0001042, 11 Oct 2026". */
export function aiLabel(runNumber: string, runDate: string) {
    return 'AI-generated · Now Assist' + (runNumber ? ' · AI-generated from ' + runNumber + (runDate ? ', ' + dateText(runDate) : '') : '')
}
/** Label when the AI answer was refused by the number check and PIVOT's own text is shown instead. */
export function rulesLabel(runNumber: string, runDate: string) {
    return 'PIVOT rules · AI answer not used (it did not match the records)' + (runNumber ? ' · from ' + runNumber + (runDate ? ', ' + dateText(runDate) : '') : '')
}

// ---------------------------------------------------------------- the LLM (PIV-054.02)
/** True when the Generative AI Controller script API is installed. Whether a provider answers is checked by test(). */
export function apiPresent(): boolean {
    try { return typeof sn_generative_ai !== 'undefined' && !!sn_generative_ai && typeof sn_generative_ai.LLMClient === 'function' } catch (e) { return false }
}
type Llm = { ok: boolean; text: string; notSetUp?: boolean; error?: string }
export function llm(prompt: string): Llm {
    if (!apiPresent()) return { ok: false, text: '', notSetUp: true, error: MSG.notSetUp }
    try {
        const r = new sn_generative_ai.LLMClient().call({ prompt: prompt })
        if (r && String(r.status) === 'Success' && r.response) return { ok: true, text: String(r.response) }
        const why = String((r && r.response) || '')
        const notSetUp = /provider|not configured|no model|not enabled|disabled|not approved|entitle/i.test(why)
        gs.warn('PIVOT AI: the LLM did not answer: ' + why)
        return { ok: false, text: '', notSetUp, error: notSetUp ? MSG.notSetUp : MSG.failed }
    } catch (e) {
        gs.warn('PIVOT AI: the LLM call failed: ' + e)
        return { ok: false, text: '', error: MSG.failed }
    }
}
/** First JSON object or array in an LLM answer (models sometimes wrap it in text or code fences). */
export function readJson(text: string): any {
    const t = String(text || '')
    const a = t.indexOf('{'), b = t.lastIndexOf('}'), c = t.indexOf('['), d = t.lastIndexOf(']')
    const tries: string[] = []
    if (c > -1 && d > c && (a < 0 || c < a)) tries.push(t.slice(c, d + 1))
    if (a > -1 && b > a) tries.push(t.slice(a, b + 1))
    if (c > -1 && d > c) tries.push(t.slice(c, d + 1))
    for (let i = 0; i < tries.length; i++) { try { return JSON.parse(tries[i]) } catch (e) { /* next */ } }
    return null
}
/** Every number written in a text ("1,010" → 1010, "6.1", "PVA0001071" → 1071). */
export function numbersIn(text: string): string[] {
    const m = String(text || '').replace(/(\d),(?=\d{3}\b)/g, '$1').match(/\d+(?:\.\d+)?/g) || []
    return m.map((x) => String(Number(x)))
}
/** PIV-055.02 AC 2 / PIV-061.02 – every number in the answer must be a number from the facts (or an extra allowed one). */
export function numbersMatch(answer: string, facts: any, extra?: number[]): { ok: boolean; unknown: string[] } {
    const allowed: { [n: string]: boolean } = {}
    numbersIn(JSON.stringify(facts)).forEach((n) => { allowed[n] = true })
    ;(extra || []).forEach((n) => { allowed[String(n)] = true })
    const unknown = numbersIn(answer).filter((n) => !allowed[n])
    return { ok: unknown.length === 0, unknown }
}

// ---------------------------------------------------------------- AI log (PIV-054.06)
export function logAi(skill: string, record: string, suggestion: string, decision: string, channel?: string, source?: string): string {
    try {
        const l = new GlideRecord(T.log)
        l.newRecord()
        l.setValue('skill', skill)
        l.setValue('record', String(record || '').slice(0, 40))
        l.setValue('suggestion', String(suggestion || '').slice(0, 4000))
        l.setValue('decision', decision)
        l.setValue('user', gs.getUserID())
        l.setValue('channel', channel || 'workspace')
        l.setValue('source', source || 'now_assist')
        return String(l.insert() || '')
    } catch (e) {
        gs.warn('PIVOT AI: could not write the AI log: ' + e)
        return ''
    }
}
const DECISIONS = ['accepted', 'edited', 'rejected', 'skipped', 'cancelled']
/** The user's decision on a suggestion: accepted, edited, rejected, skipped or cancelled. Only the user who got it can decide. */
export function decide(logId: string, decision: string, detail?: string): AiResult {
    if (DECISIONS.indexOf(decision) < 0) return { ok: false, error: 'Unknown decision.' }
    const l = new GlideRecord(T.log)
    if (!/^[0-9a-f]{32}$/i.test(String(logId || '')) || !l.get(String(logId))) return { ok: false, error: 'The AI suggestion was not found.' }
    if (str(l, 'user') !== gs.getUserID()) return { ok: false, error: 'Only the person who asked for this suggestion can decide on it.' }
    l.setValue('decision', decision)
    if (detail) l.setValue('decision_detail', String(detail).slice(0, 1000))
    l.update()
    return { ok: true }
}
/** PIV-054.06 AC 2 – counts by skill and the accept rate for the last `days` days (admins only). */
export function usage(days?: number): AiResult {
    if (!isRole('admin')) return { ok: false, error: 'Only PIVOT admins can see AI usage.' }
    const d = days && days > 0 ? days : 30
    const since = new GlideDateTime()
    since.addDaysUTC(-d)
    const rows: { [skill: string]: any } = {}
    const ga: any = new GlideAggregate(T.log)
    ga.addQuery('sys_created_on', '>=', since.getValue())
    ga.addAggregate('COUNT')
    ga.groupBy('skill')
    ga.groupBy('decision')
    ga.query()
    while (ga.next()) {
        const s = str(ga, 'skill'), dcs = str(ga, 'decision'), n = Number(ga.getAggregate('COUNT')) || 0
        const r = rows[s] = rows[s] || { skill: s, label: SKILL_LABEL[s] || s, total: 0, accepted: 0, edited: 0, rejected: 0, failed: 0, other: 0 }
        r.total += n
        if (dcs === 'accepted' || dcs === 'edited' || dcs === 'rejected' || dcs === 'failed') r[dcs] += n
        else r.other += n
    }
    const list = Object.keys(rows).map((k) => {
        const r = rows[k], decided = r.accepted + r.edited + r.rejected
        r.acceptRate = decided ? Math.round(((r.accepted + r.edited) / decided) * 100) : null
        return r
    }).sort((a, b) => b.total - a.total)
    return { ok: true, days: d, skills: list }
}

// ---------------------------------------------------------------- access (PIV-054.03 / .04)
function gate(kind: 'use' | 'suggest'): AiResult | null {
    if (!hasPivotRole()) return { ok: false, error: MSG.noRole, noAccess: true }
    if (!aiEnabled()) return { ok: false, error: MSG.off, off: true }
    if (kind === 'suggest' && !canSuggest()) return { ok: false, error: MSG.suggestRole }
    if (!apiPresent()) return { ok: false, error: MSG.notSetUp, notSetUp: true }
    return null
}

// ---------------------------------------------------------------- tools: facts from the records
function latestCompleted(trusted?: boolean): any {
    const a = trusted ? new GlideRecord(T.assessment) : new GlideRecordSecure(T.assessment)
    a.addQuery('status', 'IN', 'complete,complete_with_warnings')
    a.orderByDesc('run_date')
    a.setLimit(1)
    a.query()
    return a.next() ? a : null
}
function findOpp(number: string, trusted?: boolean): any {
    const gr = trusted ? new GlideRecord(T.opportunity) : new GlideRecordSecure(T.opportunity)
    gr.addQuery('number', String(number || ''))
    gr.setLimit(1)
    gr.query()
    return gr.next() ? gr : null
}

/** PIV-055.01 – the facts of one opportunity as JSON. Returns null when the user cannot read it (the skill stops). */
export function findingFacts(number: string, trusted?: boolean): any {
    const o = findOpp(number, trusted)
    if (!o || (!trusted && !o.canRead())) return null
    const capId = str(o, 'capability')
    const c = trusted ? new GlideRecord(T.capability) : new GlideRecordSecure(T.capability)
    const hasCap = capId ? c.get(capId) : false
    const runId = str(o, 'assessment')
    const a = new GlideRecord(T.assessment)
    const hasRun = runId ? a.get(runId) : false
    // the result of that run for the capability: the counts behind the finding
    let res: any = null
    if (hasRun && capId) {
        const r = new GlideRecord(T.result)
        r.addQuery('assessment', runId)
        r.addQuery('capability', capId)
        r.setLimit(1)
        r.query()
        if (r.next()) res = r
    }
    const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
    const priority = num(o, 'priority')
    const entitled = res ? num(res, 'entitled_count') : hasCap ? num(c, 'entitled_count') : null
    const allocated = res ? num(res, 'allocated_count') : hasCap ? num(c, 'allocated_count') : null
    const runDate = hasRun ? str(a, 'run_date') : ''
    const discovered = hasCap ? str(c, 'last_discovered') : ''
    const sourceMs = ms(runDate) || ms(discovered)
    const ageDays = sourceMs ? Math.floor((nowMs() - sourceMs) / DAY) : null
    let outcome: any = null
    const outId = str(o, 'outcome')
    if (outId) {
        const bo = trusted ? new GlideRecord(T.outcome) : new GlideRecordSecure(T.outcome)
        if (bo.get(outId)) outcome = { kpi: str(bo, 'kpi'), status: str(bo, 'status'), statusLabel: bo.getDisplayValue('status'), current: num(bo, 'current_value'), target: num(bo, 'target'), baseline: num(bo, 'baseline') }
    }
    const owner = str(o, 'assigned_to')
    const phase = OPP_ACTIVE.indexOf(str(o, 'state')) > -1 ? roadmapPhase(priority, nowAt, nextAt) : ''
    return {
        number: str(o, 'number'),
        sysId: o.getUniqueValue(),
        capability: hasCap ? str(c, 'name') : '',
        capabilityId: capId,
        product: hasCap ? familyLabel(str(c, 'product_family')) : '',
        findingType: TYPE_LABEL[str(o, 'type')] || str(o, 'type'),
        type: str(o, 'type'),
        title: str(o, 'short_description'),
        finding: str(o, 'description'),
        measured: str(o, 'measured_value'),
        counts: {
            licencesPurchased: entitled, licencesAllocated: allocated,
            licencesUnused: entitled !== null && allocated !== null ? Math.max(0, entitled - allocated) : null,
            utilizationPct: res ? num(res, 'utilization') : null,
            usageActual: res ? num(res, 'actual_value') : null, usageTarget: res ? num(res, 'target_value') : null,
            daysBack: res ? num(res, 'days_back') : hasCap ? num(c, 'days_back') : null,
            score: res ? num(res, 'score') : null,
        },
        value: num(o, 'value'), impact: num(o, 'business_impact'), effort: num(o, 'effort'),
        priority, priorityReason: str(o, 'priority_reason'),
        horizon: phase ? PHASE_LABEL[phase] : '', state: OPP_STATE_LABEL[str(o, 'state')] || str(o, 'state'), stateValue: str(o, 'state'),
        owner: owner ? userName(owner) : '', ownerId: owner,
        assignmentGroup: str(o, 'assignment_group') ? o.getDisplayValue('assignment_group') : '', assignmentGroupId: str(o, 'assignment_group'),
        sourceTable: res ? str(res, 'measure_table') : hasCap ? str(c, 'measure_table') : '',
        outcome,
        run: hasRun ? str(a, 'number') : '', runDate: runDate, runDateText: dateText(runDate),
        dataAgeDays: ageDays, stale: ageDays !== null && ageDays > STALE_DAYS,
        thresholds: { utilization: Number(prop('utilization_threshold')), lowScore: Number(prop('low_score_threshold')), now: nowAt, next: nextAt },
    }
}

/** PIV-058.01 – the finding facts plus its roadmap column and order. */
export function planFacts(number: string): any {
    const f = findingFacts(number)
    if (!f) return null
    const rm = new GlideRecordSecure(T.roadmap)
    rm.addQuery('opportunity', f.sysId)
    rm.orderByDesc('sys_updated_on')
    rm.setLimit(1)
    rm.query()
    f.roadmap = rm.next() ? { column: PHASE_LABEL[str(rm, 'phase')] || f.horizon, order: num(rm, 'sequence') } : { column: f.horizon, order: null }
    return f
}

/** PIV-056.01 – the facts of one run. A failed run returns its status and error only (no briefing is written). */
export function runFacts(runRef: string, trusted?: boolean): any {
    const a = trusted ? new GlideRecord(T.assessment) : new GlideRecordSecure(T.assessment)
    let found = false
    if (/^[0-9a-f]{32}$/i.test(String(runRef || ''))) found = a.get(String(runRef))
    else { a.addQuery('number', String(runRef || '')); a.setLimit(1); a.query(); found = a.next() }
    if (!found) return null
    const sysId = a.getUniqueValue(), number = str(a, 'number'), status = str(a, 'status'), runDate = str(a, 'run_date')
    const log = (() => { try { const x = JSON.parse(str(a, 'log') || '[]'); return Array.isArray(x) ? x : [] } catch (e) { return [] } })()
    if (status === 'failed') {
        const err = log.filter((l: any) => l && l.level === 'error').pop()
        return { run: number, status: 'Failed', failed: true, error: err ? String(err.message) : 'The run failed.' }
    }
    // previous completed run
    const p = new GlideRecord(T.assessment)
    p.addQuery('status', 'IN', 'complete,complete_with_warnings')
    p.addQuery('run_date', '<', a.getValue('run_date'))
    p.addQuery('sys_id', '!=', sysId)
    p.orderByDesc('run_date')
    p.setLimit(1)
    p.query()
    const prev = p.next() ? { run: str(p, 'number'), score: num(p, 'overall_score') } : null
    const score = num(a, 'overall_score')
    const low = Number(prop('low_score_threshold'))
    let below = 0, notMeasured = 0, capabilities = 0
    const r = new GlideRecord(T.result)
    r.addQuery('assessment', sysId)
    r.query()
    while (r.next()) {
        capabilities++
        const s = num(r, 'score')
        if (s === null) notMeasured++
        else if (s < low) below++
    }
    // outcomes below target in this run (same rule as the Dashboard: active outcomes, baseline/target of the outcome)
    let outcomesBelow = 0, outcomesMeasured = 0
    const orr = new GlideRecord(T.outcomeResult)
    orr.addQuery('assessment', sysId)
    orr.query()
    while (orr.next()) {
        const bo = new GlideRecord(T.outcome)
        if (!bo.get(str(orr, 'outcome')) || !bool(bo, 'active')) continue
        const st = outcomeStatus({ baseline: num(bo, 'baseline'), target: num(bo, 'target'), direction: str(bo, 'direction') }, num(orr, 'actual'))
        if (st.status !== 'not_measured') outcomesMeasured++
        if (st.status === 'below_target') outcomesBelow++
    }
    // top 5 Now opportunities (priority high → low, then value)
    const nowAt = Number(prop('priority_now'))
    const top: any[] = []
    const o = trusted ? new GlideRecord(T.opportunity) : new GlideRecordSecure(T.opportunity)
    o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
    o.addQuery('priority', '>=', nowAt)
    o.orderByDesc('priority')
    o.orderByDesc('value')
    o.setLimit(5)
    o.query()
    while (o.next()) top.push({ number: str(o, 'number'), capability: o.getDisplayValue('capability'), finding: TYPE_LABEL[str(o, 'type')] || str(o, 'type'), priority: num(o, 'priority'), measured: str(o, 'measured_value') })
    // stale sources: active installed capabilities not discovered for more than 30 days before the run, and stale-value warnings in the log
    const stale: string[] = []
    const runMs = ms(runDate) || nowMs()
    const c = new GlideRecord(T.capability)
    c.addQuery('active', true)
    c.addQuery('installed', true)
    c.query()
    while (c.next()) {
        const d = ms(str(c, 'last_discovered'))
        if (d && runMs - d > STALE_DAYS * DAY) stale.push(str(c, 'name') + ' (last discovered ' + dateText(str(c, 'last_discovered')) + ')')
    }
    log.forEach((l: any) => { if (l && l.level === 'warn' && /stale/i.test(String(l.message))) stale.push(String(l.message)) })
    const warnings = log.filter((l: any) => l && l.level === 'warn').length
    return {
        run: number, sysId, status: status === 'complete_with_warnings' ? 'Completed with warnings' : status === 'complete' ? 'Complete' : status,
        runDate, runDateText: dateText(runDate), runTimeText: timeText(runDate),
        score: score === null ? null : r1(score),
        previousRun: prev ? prev.run : '', previousScore: prev && prev.score !== null ? r1(prev.score) : null,
        change: prev && prev.score !== null && score !== null ? r1(score - prev.score) : null,
        capabilities, belowLowThreshold: below, lowThreshold: low, notMeasured,
        outcomesBelowTarget: outcomesBelow, outcomesMeasured,
        opportunitiesCreated: num(a, 'opportunities_created'),
        topNow: top, staleSources: stale.slice(0, 10), logWarnings: warnings,
    }
}

// ---------------------------------------------------------------- PIV-055 explain this finding
const FACT_RULES = 'Use ONLY the facts in the JSON. Copy numbers exactly as written in the facts; do not calculate, round or invent any number, date, cost or name. Plain English, short sentences.'

function explainTemplate(f: any): { what: string; why: string; next: string } {
    const k = f.counts || {}
    let why = ''
    switch (f.type) {
        case 'idle_licences': why = k.licencesUnused !== null ? k.licencesUnused + ' of ' + k.licencesPurchased + ' purchased licences are not allocated. Unused licences cost money without giving value.' : 'Licence use is below the ' + f.thresholds.utilization + '% threshold, so licences are paid for but not used.'; break
        case 'shelfware': why = 'The product is licensed but not installed, so it is paid for and gives no value yet.'; break
        case 'low_adoption': why = 'Usage is low (score ' + (k.score === null ? '—' : k.score) + ', threshold ' + f.thresholds.lowScore + '), so the product is installed but gives little value.'; break
        case 'not_measured': why = 'PIVOT cannot score it, so it is left out of the Platform Value Score and its value is unknown.'; break
        case 'weak_outcome': why = 'The product is well used but its business outcome' + (f.outcome ? ' "' + f.outcome.kpi + '"' : '') + ' is below target, so usage is not turning into results.'; break
        case 'adoption_potential': why = 'Low usage on a product that supports an important objective' + (f.outcome ? ' ("' + f.outcome.kpi + '")' : '') + '; more use could move that objective.'; break
        default: why = 'It lowers the value the platform gives.'
    }
    const next: { [t: string]: string } = {
        idle_licences: 'Check who holds the unused licences, reclaim them or plan to reduce them at renewal.',
        shelfware: 'Decide whether to install and adopt it, or drop it at the next renewal.',
        low_adoption: 'Find the teams that should use it and plan training or process changes.',
        not_measured: 'Set a measure table and target for the capability so PIVOT can score it.',
        weak_outcome: 'Review the process behind the outcome with its owner and agree one change.',
        adoption_potential: 'Plan a small adoption push with the owner of the objective.',
    }
    return {
        what: f.finding || (f.findingType + ' on ' + f.capability + (f.measured ? ': ' + f.measured : '') + '.'),
        why: why + (f.stale ? ' The data is ' + f.dataAgeDays + ' days old and may be out of date.' : ''),
        next: next[f.type] || 'Review the finding with the owner and agree the next step.',
    }
}

/** PIV-055.02 / .03 – What we found, Why it matters, Suggested next step (under 120 words, numbers from the record). */
export function explain(number: string, channel?: string): AiResult {
    const g = gate('use')
    if (g) return g
    const f = findingFacts(number)
    if (!f) return { ok: false, error: 'Opportunity ' + number + ' was not found, or you cannot read it.' }
    const label = aiLabel(f.run, f.runDate)
    const facts = { opportunity: f.number, capability: f.capability, product: f.product, findingType: f.findingType, finding: f.finding, measured: f.measured,
        counts: f.counts, value: f.value, impact: f.impact, effort: f.effort, priority: f.priority, horizon: f.horizon, owner: f.owner || 'Unassigned',
        sourceTable: f.sourceTable, outcome: f.outcome, run: f.run, runDate: f.runDateText, dataAgeDays: f.dataAgeDays, dataOlderThan30Days: f.stale }
    const prompt = 'You explain one ServiceNow platform finding from the PIVOT app to a platform owner. ' + FACT_RULES +
        ' Answer with JSON only: {"what":"what we found","why":"why it matters","next":"suggested next step"}. Each part one or two sentences; together under 110 words.' +
        (f.stale ? ' The data is older than 30 days: say in "why" that the data may be out of date.' : '') +
        '\nFacts: ' + JSON.stringify(facts)
    const r = llm(prompt)
    if (!r.ok) {
        logAi('explain', f.number, r.error || '', 'failed', channel)
        return { ok: false, error: r.notSetUp ? MSG.notSetUp : MSG.explainFailed }
    }
    const j = readJson(r.text)
    let out = j && j.what && j.why && j.next ? { what: String(j.what), why: String(j.why), next: String(j.next) } : null
    let source = 'now_assist', rejected = out ? '' : 'The AI answer was not in the agreed format.', aiText = r.text.slice(0, 1500)
    if (out) { // PIV-061.02 – the reason an AI answer was not used is returned and logged, so testers can raise a defect
        const all = out.what + ' ' + out.why + ' ' + out.next, chk = numbersMatch(all, facts, [30])
        if (!chk.ok) rejected = 'Numbers not in the record: ' + chk.unknown.join(', ') + '.'
        else if (wordCount(all) >= 120) rejected = 'Longer than 120 words (' + wordCount(all) + ').'
        else if (f.stale && !/out of date|old|stale/i.test(all)) rejected = 'The data is older than 30 days but the answer does not say so.'
        if (rejected) out = null
    }
    if (!out) { out = explainTemplate(f); source = 'rules' }
    const text = 'What: ' + out.what + '\nWhy it matters: ' + out.why + '\nSuggested next step: ' + out.next
    const logId = logAi('explain', f.number, text + (rejected ? '\n[AI answer not used: ' + rejected + ' AI answer: ' + aiText + ']' : ''), 'shown', channel, source)
    return { ok: true, label: source === 'rules' ? rulesLabel(f.run, f.runDate) : label, footer: MSG.footer, what: out.what, why: out.why, next: out.next, text, source, rejected, logId,
        facts: channel === 'test' ? facts : undefined, aiText: channel === 'test' ? aiText : undefined, prompt: channel === 'test' ? prompt : undefined }
}

/** Note text with the label kept (PIV-054.05 AC 2 / PIV-055.05 / PIV-058.03). */
export function noteText(label: string, body: string, suffix?: string) {
    return '[' + label + ']' + (suffix ? ' ' + suffix : '') + '\n' + body + '\n' + MSG.footer
}

// ---------------------------------------------------------------- PIV-056 assessment briefing
function briefingTemplate(f: any): any {
    const headline = f.score === null ? f.run + ' (' + f.runDateText + '): the Platform Value Score could not be calculated.'
        : 'Platform Value Score ' + f.score + ' in ' + f.run + ' (' + f.runDateText + ')' + (f.change === null ? '.' : ', ' + signed(f.change) + ' since ' + f.previousRun + ' (' + f.previousScore + ').')
    const changed = [
        f.belowLowThreshold + ' capabilities are below the low score threshold of ' + f.lowThreshold + '.',
        f.notMeasured + ' capabilities are Not Measured.',
        f.outcomesBelowTarget + ' business outcomes are below target.',
    ]
    if (f.opportunitiesCreated !== null) changed.push(f.opportunitiesCreated + ' new opportunities were raised.')
    const now = f.topNow.map((t: any) => t.number + ' ' + t.capability + ' – ' + t.finding + ', priority ' + t.priority + (t.measured ? ' (' + t.measured + ')' : ''))
    const warnings = f.staleSources.length ? f.staleSources.map((s: string) => 'Stale source: ' + s + '.') : ['No stale sources.']
    return { headline, changed, now: now.length ? now : ['Nothing is in Now.'], warnings }
}
export function briefingText(b: any) {
    return b.headline + '\n\nWhat changed:\n' + b.changed.map((t: string) => '- ' + t).join('\n') + '\n\nTop Now items:\n' + b.now.map((t: string) => '- ' + t).join('\n') +
        '\n\nData warnings:\n' + b.warnings.map((t: string) => '- ' + t).join('\n')
}
/** Builds the briefing for one run. trusted = the assessment engine (system context). Returns { ok, briefing } or an error. */
export function buildBriefing(runRef: string, trusted?: boolean, channel?: string): AiResult {
    const f = runFacts(runRef, trusted)
    if (!f) return { ok: false, error: 'The run was not found, or you cannot read it.' }
    if (f.failed) return { ok: false, error: 'No briefing for a failed run: ' + f.error, failed: true }
    const facts = { run: f.run, date: f.runDateText, score: f.score, previousRun: f.previousRun, previousScore: f.previousScore, change: f.change,
        capabilities: f.capabilities, belowLowThreshold: f.belowLowThreshold, lowThreshold: f.lowThreshold, notMeasured: f.notMeasured,
        outcomesBelowTarget: f.outcomesBelowTarget, newOpportunities: f.opportunitiesCreated, topNow: f.topNow, staleSources: f.staleSources }
    const prompt = 'You write the weekly PIVOT assessment briefing for a sponsor. ' + FACT_RULES +
        ' Answer with JSON only: {"headline":"one sentence with the score and the change","changed":["2 to 4 short bullets"],"now":["one bullet per topNow item, with its number"],"warnings":["data warnings, or No stale sources."]}. Under 280 words in total.' +
        '\nFacts: ' + JSON.stringify(facts)
    const r = llm(prompt)
    if (!r.ok) return { ok: false, error: r.notSetUp ? MSG.notSetUp : 'Briefing not created: ' + (r.error || MSG.failed) }
    const j = readJson(r.text)
    let b: any = null, source = 'now_assist'
    if (j && j.headline && Array.isArray(j.changed) && Array.isArray(j.now) && Array.isArray(j.warnings)) {
        b = { headline: String(j.headline), changed: j.changed.map(String).slice(0, 6), now: j.now.map(String).slice(0, 5), warnings: j.warnings.map(String).slice(0, 10) }
        const text = briefingText(b)
        if (!numbersMatch(text, facts).ok || wordCount(text) >= 300) b = null
    }
    if (!b) { b = briefingTemplate(f); source = 'rules' }
    b.label = source === 'rules' ? rulesLabel(f.run, f.runDate) : aiLabel(f.run, f.runDate)
    b.source = source
    b.created = nowMs()
    b.text = briefingText(b)
    return { ok: true, briefing: b, run: f.run, sysId: f.sysId }
}
/** PIV-056.03 – called by the assessment run (step 9) before the completion email. Never fails the run. */
export function briefingForRun(sysId: string): { ok: boolean; message: string } {
    if (!aiEnabled()) return { ok: true, message: 'AI features are off – no briefing.' }
    if (!apiPresent()) return { ok: false, message: 'Briefing not created: ' + MSG.notSetUp + '.' }
    try {
        const r = buildBriefing(sysId, true, 'run')
        if (!r.ok) { logAi('briefing', '', r.error, 'failed', 'run'); return { ok: false, message: r.error.indexOf('Briefing not created') === 0 ? r.error : 'Briefing not created: ' + r.error } }
        const a = new GlideRecord(T.assessment)
        if (!a.get(sysId)) return { ok: false, message: 'Briefing not created: the run was not found.' }
        a.setValue('briefing', JSON.stringify(r.briefing))
        a.update()
        logAi('briefing', r.run, r.briefing.text, 'shown', 'run', r.briefing.source)
        return { ok: true, message: 'Briefing created' + (r.briefing.source === 'rules' ? ' from the PIVOT rules (the AI answer did not match the records).' : ' by Now Assist.') }
    } catch (e) {
        return { ok: false, message: 'Briefing not created: ' + e }
    }
}
/** PIV-056.05 AC 2 – "Generate assessment briefing" in the run dialog: any PIVOT role; saves the briefing on the run. */
export function briefing(runNumber: string, channel?: string): AiResult {
    const g = gate('use')
    if (g) return g
    const r = buildBriefing(runNumber, false, channel)
    if (!r.ok) { logAi('briefing', runNumber, r.error, 'failed', channel); return r }
    const a = new GlideRecord(T.assessment)
    if (a.get(r.sysId)) { a.setValue('briefing', JSON.stringify(r.briefing)); a.update() }
    const logId = logAi('briefing', r.run, r.briefing.text, 'shown', channel, r.briefing.source)
    return { ok: true, briefing: r.briefing, logId }
}

// ---------------------------------------------------------------- PIV-057 score and owner suggestions
function scoresTemplate(f: any) {
    const cfg = gapConfig(String(prop('gap_rule_config') || ''))[f.type] || { value: 3, effort: 3 }
    const impact = f.outcome ? impactFromStatus(f.outcome.status) : null
    return {
        value: cfg.value, business_impact: impact, effort: cfg.effort,
        reasons: {
            value: 'Default value for a ' + f.findingType + ' finding in the PIVOT gap rules.',
            business_impact: f.outcome ? 'The linked outcome "' + f.outcome.kpi + '" is ' + (f.outcome.statusLabel || f.outcome.status).toLowerCase() + '.' : 'No linked outcome – leave it empty so it is not counted.',
            effort: 'Default effort for a ' + f.findingType + ' finding in the PIVOT gap rules.',
        },
    }
}
const whole = (v: any, lo: number, hi: number) => { const n = Number(v); return v !== null && v !== '' && !isNaN(n) && Math.floor(n) === n && n >= lo && n <= hi }
/** PIV-057.01 – suggested value (1–5), impact (0–5) and effort (1–5) with a reason each. Changes nothing. */
export function suggestScores(number: string, channel?: string): AiResult {
    const g = gate('suggest')
    if (g) return g
    const f = findingFacts(number)
    if (!f) return { ok: false, error: 'Opportunity ' + number + ' was not found, or you cannot read it.' }
    const def = scoresTemplate(f)
    const facts = { findingType: f.findingType, capability: f.capability, product: f.product, finding: f.finding, measured: f.measured, counts: f.counts,
        currentScores: { value: f.value, impact: f.impact, effort: f.effort }, ruleDefaults: { value: def.value, effort: def.effort, impactFromOutcome: def.business_impact },
        outcome: f.outcome, thresholds: f.thresholds }
    const prompt = 'You suggest PIVOT opportunity scores for an analyst. Value 1–5 (benefit if fixed), business impact 0–5 (from the linked outcome: below target 3, on target 1, improved 0, null when there is no outcome), effort 1–5 (work to fix). ' + FACT_RULES +
        ' Answer with JSON only: {"value":n,"business_impact":n or null,"effort":n,"reasons":{"value":"one sentence","business_impact":"one sentence","effort":"one sentence"}}.\nFacts: ' + JSON.stringify(facts)
    const r = llm(prompt)
    if (!r.ok) { logAi('scores', f.number, r.error || '', 'failed', channel); return { ok: false, error: r.notSetUp ? MSG.notSetUp : MSG.failed } }
    const j = readJson(r.text)
    let s: any = null, source = 'now_assist'
    if (j && whole(j.value, 1, 5) && whole(j.effort, 1, 5) && (j.business_impact === null || whole(j.business_impact, 0, 5)) && j.reasons) {
        s = { value: Number(j.value), business_impact: j.business_impact === null ? null : Number(j.business_impact), effort: Number(j.effort),
            reasons: { value: String(j.reasons.value || ''), business_impact: String(j.reasons.business_impact || ''), effort: String(j.reasons.effort || '') } }
        if (!numbersMatch(s.reasons.value + ' ' + s.reasons.business_impact + ' ' + s.reasons.effort, facts, [0, 1, 2, 3, 4, 5]).ok) s = null
    }
    if (!s) { s = def; source = 'rules' }
    const logId = logAi('scores', f.number, 'Value ' + s.value + ', impact ' + (s.business_impact === null ? 'empty' : s.business_impact) + ', effort ' + s.effort + '. ' + s.reasons.value + ' ' + s.reasons.business_impact + ' ' + s.reasons.effort, 'shown', channel, source)
    return { ok: true, label: source === 'rules' ? rulesLabel(f.run, f.runDate) : aiLabel(f.run, f.runDate), footer: MSG.footer, value: s.value, business_impact: s.business_impact, effort: s.effort, reasons: s.reasons, source, logId }
}

type Candidate = { id: string; user: string; name: string; sameCapability: number; sameFamily: number; openItems: number }
/** Active PIVOT analysts and admins (members of the assignment group when there is one), with their workload. */
function candidates(groupId: string, capabilityId: string, family: string): Candidate[] {
    const ids: string[] = []
    const hr = new GlideRecord('sys_user_has_role')
    hr.addEncodedQuery('user.active=true^role.nameIN' + SCOPE + '.analyst,' + SCOPE + '.admin')
    hr.query()
    while (hr.next()) { const u = str(hr, 'user'); if (u && ids.indexOf(u) < 0) ids.push(u) }
    let list = ids
    if (groupId && /^[0-9a-f]{32}$/i.test(groupId)) {
        const members: string[] = []
        const m = new GlideRecord('sys_user_grmember')
        m.addEncodedQuery('group=' + groupId) // encoded query: the platform types reject a string for a reference field
        m.query()
        while (m.next()) members.push(str(m, 'user'))
        list = ids.filter((u) => members.indexOf(u) > -1)
    }
    const out: Candidate[] = []
    list.slice(0, 40).forEach((u, i) => {
        let sameCap = 0, sameFam = 0, open = 0
        const o = new GlideRecord(T.opportunity)
        o.addQuery('assigned_to', u)
        o.query()
        while (o.next()) {
            const active = OPP_ACTIVE.indexOf(str(o, 'state')) > -1
            if (active) open++
            if (str(o, 'capability') === capabilityId) sameCap++
            const c = new GlideRecord(T.capability)
            if (family && c.get(str(o, 'capability')) && str(c, 'product_family') === family) sameFam++
        }
        out.push({ id: 'c' + (i + 1), user: u, name: userName(u), sameCapability: sameCap, sameFamily: sameFam, openItems: open })
    })
    return out
}
function rankCandidates(cs: Candidate[]): Candidate[] {
    return cs.slice().sort((a, b) => b.sameCapability - a.sameCapability || b.sameFamily - a.sameFamily || a.openItems - b.openItems || (a.name > b.name ? 1 : -1))
}
function ownerReason(c: Candidate, product: string) {
    const parts: string[] = []
    if (c.sameCapability) parts.push('already owns ' + c.sameCapability + ' finding' + (c.sameCapability === 1 ? '' : 's') + ' on this capability')
    else if (c.sameFamily) parts.push('owns ' + c.sameFamily + ' ' + product + ' finding' + (c.sameFamily === 1 ? '' : 's'))
    parts.push(c.openItems + ' open item' + (c.openItems === 1 ? '' : 's') + ' now')
    return parts.join(' · ').replace(/^./, (x) => x.toUpperCase()) + '.'
}
/** PIV-057.03 – up to 3 people with a reason each. Changes nothing until Assign is clicked. */
export function suggestOwners(number: string, channel?: string): AiResult {
    const g = gate('suggest')
    if (g) return g
    const f = findingFacts(number)
    if (!f) return { ok: false, error: 'Opportunity ' + number + ' was not found, or you cannot read it.' }
    const cap = new GlideRecord(T.capability)
    const family = cap.get(f.capabilityId) ? str(cap, 'product_family') : ''
    const cs = candidates(f.assignmentGroupId, f.capabilityId, family).filter((c) => c.user !== f.ownerId)
    if (!cs.length) { const logId = logAi('owner', f.number, 'No suitable owner found.', 'shown', channel, 'rules'); return { ok: true, label: rulesLabel(f.run, f.runDate), footer: MSG.footer, owners: [], logId } }
    const facts = { finding: f.findingType + ' on ' + f.capability, product: f.product, assignmentGroup: f.assignmentGroup, candidates: cs.map((c) => ({ id: c.id, name: c.name, sameCapability: c.sameCapability, sameProduct: c.sameFamily, openItems: c.openItems })) }
    const prompt = 'Suggest up to 3 owners for a PIVOT finding from the candidates. Prefer people who already own findings on the same capability or product and have fewer open items. ' + FACT_RULES +
        ' Answer with JSON only: [{"id":"candidate id","reason":"one short sentence"}].\nFacts: ' + JSON.stringify(facts)
    const r = llm(prompt)
    if (!r.ok) { logAi('owner', f.number, r.error || '', 'failed', channel); return { ok: false, error: r.notSetUp ? MSG.notSetUp : MSG.failed } }
    const j = readJson(r.text)
    let owners: any[] = [], source = 'now_assist'
    if (Array.isArray(j)) {
        j.slice(0, 3).forEach((x: any) => {
            const c = cs.filter((y) => x && y.id === String(x.id))[0]
            if (c && x.reason && numbersMatch(String(x.reason), facts).ok && !owners.some((o) => o.user === c.user)) owners.push({ user: c.user, name: c.name, reason: String(x.reason) })
        })
    }
    if (!owners.length) { owners = rankCandidates(cs).slice(0, 3).map((c) => ({ user: c.user, name: c.name, reason: ownerReason(c, f.product) })); source = 'rules' }
    const logId = logAi('owner', f.number, owners.map((o) => o.name + ': ' + o.reason).join(' | '), 'shown', channel, source)
    return { ok: true, label: source === 'rules' ? rulesLabel(f.run, f.runDate) : aiLabel(f.run, f.runDate), footer: MSG.footer, owners, source, logId }
}
/** PIV-057.04 – one owner suggestion per unassigned active opportunity (up to 25, highest priority first). */
export function suggestOwnersAll(channel?: string): AiResult {
    const g = gate('suggest')
    if (g) return g
    const o = new GlideRecordSecure(T.opportunity)
    o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
    o.addNullQuery('assigned_to')
    o.orderByDesc('priority')
    o.setLimit(25)
    o.query()
    const opps: any[] = []
    while (o.next()) {
        const c = new GlideRecord(T.capability)
        const fam = c.get(str(o, 'capability')) ? str(c, 'product_family') : ''
        opps.push({ number: str(o, 'number'), capability: o.getDisplayValue('capability'), capabilityId: str(o, 'capability'), family: fam, group: str(o, 'assignment_group'), finding: TYPE_LABEL[str(o, 'type')] || str(o, 'type'), priority: num(o, 'priority') })
    }
    const run = latestCompleted()
    const label = rulesLabel(run ? str(run, 'number') : '', run ? str(run, 'run_date') : '')
    if (!opps.length) return { ok: true, label, footer: MSG.footer, items: [] }
    // candidates per family/group are cached; workload grows as suggestions are handed out so the load is spread
    const cache: { [k: string]: Candidate[] } = {}
    const extra: { [user: string]: number } = {}
    const items = opps.map((x) => {
        const key = x.group + '|' + x.capabilityId
        const cs = cache[key] = cache[key] || candidates(x.group, x.capabilityId, x.family)
        const ranked = rankCandidates(cs.map((c) => Object.assign({}, c, { openItems: c.openItems + (extra[c.user] || 0) })))
        const pick = ranked[0]
        if (!pick) return { number: x.number, capability: x.capability, finding: x.finding, priority: x.priority, user: '', name: '', reason: 'No active analyst or admin' + (x.group ? ' in the assignment group' : '') + '.' }
        extra[pick.user] = (extra[pick.user] || 0) + 1
        const logId = logAi('owners_bulk', x.number, pick.name + ': ' + ownerReason(pick, familyLabel(x.family)), 'shown', channel, 'rules')
        return { number: x.number, capability: x.capability, finding: x.finding, priority: x.priority, user: pick.user, name: pick.name, reason: ownerReason(pick, familyLabel(x.family)), logId }
    })
    return { ok: true, label, footer: MSG.footer, items }
}

// ---------------------------------------------------------------- PIV-058 action plan
function planTemplate(f: any): string[] {
    const k = f.counts || {}, owner = f.owner || 'the opportunity owner'
    const first: { [t: string]: string } = {
        idle_licences: 'Confirm the ' + (k.licencesUnused !== null ? k.licencesUnused + ' unused ' : 'unused ') + f.capability + ' licences with the licence manager',
        shelfware: 'Confirm with the licence manager why ' + f.capability + ' is licensed but not installed',
        low_adoption: 'Find the teams that should use ' + f.capability + ' and why they do not',
        not_measured: 'Choose the measure table and target for ' + f.capability,
        weak_outcome: 'Review the outcome' + (f.outcome ? ' "' + f.outcome.kpi + '"' : '') + ' with its owner',
        adoption_potential: 'Agree the adoption goal with the owner of the objective' + (f.outcome ? ' "' + f.outcome.kpi + '"' : ''),
    }
    const middle: { [t: string]: string[] } = {
        idle_licences: ['Reclaim licences from users who have not used them and reassign them where needed', 'Plan the licence count for the renewal'],
        shelfware: ['Decide: install and adopt, or drop at the renewal', 'Record the decision in PIVOT'],
        low_adoption: ['Plan training or a process change with those teams', 'Check usage again after the next assessment run'],
        not_measured: ['Set the measure table, filter and target on the capability', 'Check the score after the next assessment run'],
        weak_outcome: ['Agree one process change that should move the outcome', 'Check the outcome after the next assessment run'],
        adoption_potential: ['Run a small adoption push with one team', 'Check usage and the objective after the next run'],
    }
    const steps = [(first[f.type] || 'Review the finding with the team') + ' – owner: ' + owner + ' – timing: this week']
    ;(middle[f.type] || ['Agree the change', 'Check the result after the next assessment run']).forEach((s, i) => steps.push(s + ' – owner: ' + owner + ' – timing: ' + (i === 0 ? 'within 2 weeks' : 'before the next renewal or review')))
    steps.push('Close the opportunity in PIVOT when the gap is gone – owner: ' + owner + ' – timing: after the next run')
    return steps
}
/** PIV-058.02 – 3–6 steps with a suggested owner and timing. Nothing is sent, assigned or created. */
export function draftPlan(number: string, channel?: string): AiResult {
    const g = gate('suggest')
    if (g) return g
    const f = planFacts(number)
    if (!f) return { ok: false, error: 'Opportunity ' + number + ' was not found, or you cannot read it.' }
    const facts = { opportunity: f.number, capability: f.capability, product: f.product, findingType: f.findingType, finding: f.finding, measured: f.measured, counts: f.counts,
        owner: f.owner || 'Unassigned', roadmap: f.roadmap, outcome: f.outcome, priority: f.priority, horizon: f.horizon }
    const prompt = 'Draft an action plan of 3 to 6 steps for a PIVOT roadmap item. Each step: what to do, a suggested owner (a role or the named owner) and a timing (this week, within 2 weeks, before the renewal, ...). Mention the key counts from the facts (for licences: the unused number and the renewal). ' + FACT_RULES +
        ' Answer with JSON only: {"steps":[{"text":"...","owner":"...","timing":"..."}]}.\nFacts: ' + JSON.stringify(facts)
    const r = llm(prompt)
    if (!r.ok) { logAi('plan', f.number, r.error || '', 'failed', channel); return { ok: false, error: r.notSetUp ? MSG.notSetUp : MSG.failed } }
    const j = readJson(r.text)
    let steps: string[] = [], source = 'now_assist'
    if (j && Array.isArray(j.steps) && j.steps.length >= 3 && j.steps.length <= 6) {
        steps = j.steps.map((s: any) => String(s && s.text ? s.text : s) + (s && s.owner ? ' – owner: ' + s.owner : '') + (s && s.timing ? ' – timing: ' + s.timing : ''))
        if (!numbersMatch(steps.join(' '), facts, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 30, 60, 90]).ok) steps = []
    }
    if (!steps.length) { steps = planTemplate(f); source = 'rules' }
    const logId = logAi('plan', f.number, steps.map((s, i) => (i + 1) + '. ' + s).join('\n'), 'shown', channel, source)
    return { ok: true, label: source === 'rules' ? rulesLabel(f.run, f.runDate) : aiLabel(f.run, f.runDate), footer: MSG.footer, steps, source, logId }
}

// ---------------------------------------------------------------- PIV-059 / 060 Ask PIVOT (workspace dialog and Virtual Agent)
export const SUGGESTED = ['How are we doing?', 'Which licences are we not using?', 'What is assigned to me?', 'When did PIVOT last run?', 'What is not measured?', 'What should we do first?']
const CAN_ANSWER = 'I can answer: how are we doing (score and change), which licences are not used, what is assigned to you, when PIVOT last ran, what is not measured and what to do first. Analysts can also assign or accept an opportunity, and admins can start a run.'
type Intent = { intent: string; target?: string; person?: string }

/** Keyword routing first (fast, no AI needed); the LLM only classifies questions the keywords do not catch. */
export function classify(q: string, useLlm?: boolean): Intent {
    const s = String(q || '').trim(), t = s.toLowerCase()
    let m = /^\s*assign\s+(?:the\s+)?(.+?)\s+to\s+(.+?)[.?!]*\s*$/i.exec(s)
    if (m) return { intent: 'assign', target: m[1], person: m[2] }
    m = /^\s*accept\s+(?:the\s+)?(.+?)(?:\s+(?:finding|opportunity))?[.?!]*\s*$/i.exec(s)
    if (m) return { intent: 'accept', target: m[1] }
    // PIV-059.07 – costs, prices and forecasts are not in PIVOT ("what will licences cost next year?")
    if (/\b(cost|costs|price|prices|pricing|spend|budget|forecast|next year|money|invoice)\b/.test(t)) return { intent: 'unknown' }
    if (/\b(run|start|refresh)\b.*\b(pivot|assessment|run)\b.*\b(now)?\b/.test(t) && !/\b(when|last|did|status)\b/.test(t)) return { intent: 'runnow' }
    if (/\b(when|last)\b.*\b(run|ran|assessment)\b|\bdid pivot (run|work)\b|\brun status\b/.test(t)) return { intent: 'lastrun' }
    if (/\b(assigned to me|my (opportunit|item|work|finding|task)s?|mine)\b/.test(t)) return { intent: 'mine' }
    if (/\b(licen[cs]e|idle|shelfware|unused|not using|not used)\b/.test(t)) return { intent: 'idle' }
    if (/\bnot measured\b|\bunmeasured\b/.test(t)) return { intent: 'notmeasured' }
    if (/\b(first|top|priorit|do next|focus)\b/.test(t)) return { intent: 'first' }
    if (/\b(how are we doing|score|platform value|how is the platform|headline)\b/.test(t)) return { intent: 'score' }
    if (!useLlm) return { intent: 'unknown' }
    const r = llm('Classify a question for the PIVOT ServiceNow platform-value app. Intents: score (platform value score, how we are doing), idle (unused or idle licences, shelfware), mine (items assigned to the asker), lastrun (when PIVOT last ran, run status), notmeasured, first (what to do first, top priorities), runnow (start a run), assign (assign an opportunity to a person), accept (accept an opportunity), unknown (anything else, e.g. costs, passwords, forecasts). ' +
        'Answer with JSON only: {"intent":"...","target":"opportunity words or number, if any","person":"person name, if any"}.\nQuestion: ' + JSON.stringify(s.slice(0, 500)))
    const j = r.ok ? readJson(r.text) : null
    const ok = ['score', 'idle', 'mine', 'lastrun', 'notmeasured', 'first', 'runnow', 'assign', 'accept', 'unknown']
    return j && ok.indexOf(String(j.intent)) > -1 ? { intent: String(j.intent), target: j.target ? String(j.target) : '', person: j.person ? String(j.person) : '' } : { intent: 'unknown' }
}

function oppItem(o: any) {
    const nowAt = Number(prop('priority_now')), nextAt = Number(prop('priority_next'))
    const st = str(o, 'state'), ph = OPP_ACTIVE.indexOf(st) > -1 ? PHASE_LABEL[roadmapPhase(num(o, 'priority'), nowAt, nextAt)] : ''
    return { ref: str(o, 'number'), label: o.getDisplayValue('capability') + ' · ' + (TYPE_LABEL[str(o, 'type')] || str(o, 'type')) + (str(o, 'measured_value') ? ' (' + str(o, 'measured_value') + ')' : '') + (ph ? ' · ' + ph : '') + ' · ' + (OPP_STATE_LABEL[st] || st) }
}
/** Opportunities matching words or a number ("HRSD fulfiller licences", "PVO0000311"), readable by the user. */
function matchOpps(target: string, activeOnly: boolean): any[] {
    const t = String(target || '').trim()
    const out: any[] = []
    const o = new GlideRecordSecure(T.opportunity)
    if (/^PVO\d+$/i.test(t)) o.addQuery('number', t.toUpperCase())
    else if (activeOnly) o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
    o.orderByDesc('priority')
    o.setLimit(400)
    o.query()
    const words = t.toLowerCase().replace(/\b(the|finding|opportunity|licen[cs]es?)\b/g, ' ').split(/[^a-z0-9]+/).filter((w) => w.length > 1)
    const wantIdle = /licen[cs]e|idle/i.test(t)
    while (o.next()) {
        if (/^PVO\d+$/i.test(t)) { out.push({ number: str(o, 'number'), sysId: o.getUniqueValue(), state: str(o, 'state'), item: oppItem(o) }); continue }
        const hay = (o.getDisplayValue('capability') + ' ' + str(o, 'short_description') + ' ' + str(o, 'type').replace('_', ' ')).toLowerCase()
        if (!words.length || !words.every((w) => hay.indexOf(w) > -1)) continue
        if (wantIdle && ['idle_licences', 'shelfware', 'license'].indexOf(str(o, 'type')) < 0) continue
        out.push({ number: str(o, 'number'), sysId: o.getUniqueValue(), state: str(o, 'state'), item: oppItem(o) })
    }
    return out
}
/** Active PIVOT analysts/admins whose name matches ("R. Mehta", "Rahul Mehta", "mehta"). */
function matchPeople(name: string): { user: string; name: string }[] {
    const parts = String(name || '').toLowerCase().replace(/[.,]/g, ' ').split(/\s+/).filter((w) => w.length > 0)
    const last = parts.filter((w) => w.length > 1).pop() || ''
    if (!last) return []
    const ids: string[] = []
    const hr = new GlideRecord('sys_user_has_role')
    hr.addEncodedQuery('user.active=true^role.nameIN' + SCOPE + '.analyst,' + SCOPE + '.admin')
    hr.query()
    while (hr.next()) { const u = str(hr, 'user'); if (u && ids.indexOf(u) < 0) ids.push(u) }
    const out: { user: string; name: string }[] = []
    ids.forEach((id) => {
        const nm = userName(id), low = nm.toLowerCase()
        if (low.indexOf(last) < 0) return
        const initials = parts.filter((w) => w.length === 1)
        if (initials.length && !initials.every((i) => low.split(/\s+/).some((w) => w.charAt(0) === i))) return
        out.push({ user: id, name: nm })
    })
    return out
}

/** PIV-059 – one answer: { ok, label, answer, items:[{ref,label}], confirm? }. Answers use the user's own access. */
export function ask(question: string, channel?: string): AiResult {
    if (!hasPivotRole()) return { ok: false, answer: MSG.noRole, items: [], noAccess: true } // PIV-059.06 AC 1
    if (!aiEnabled()) return { ok: false, answer: MSG.off, items: [], off: true }
    const q = String(question || '').trim().slice(0, 500)
    if (!q) return { ok: false, answer: 'Type a question first. ' + CAN_ANSWER, items: [] }
    const it = classify(q, apiPresent())
    const run = latestCompleted()
    const runNo = run ? str(run, 'number') : '', runDate = run ? str(run, 'run_date') : ''
    const label = 'Ask PIVOT · Now Assist · answered from PIVOT records' + (runNo ? ' (' + runNo + ', ' + dateText(runDate) + ')' : '')
    const done = (answer: string, items?: any[], extra?: any) => {
        const logId = logAi('ask', '', 'Q: ' + q + '\nA: ' + answer, 'shown', channel, 'rules')
        return Object.assign({ ok: true, label, footer: MSG.footer, intent: it.intent, answer, items: items || [], logId }, extra || {})
    }
    const nowAt = Number(prop('priority_now'))
    switch (it.intent) {
        case 'score': { // PIV-059.02
            if (!run) return done('No assessment has completed yet, so there is no Platform Value Score.')
            const f = runFacts(runNo)
            if (!f) return done('No assessment has completed yet, so there is no Platform Value Score.')
            return done('The Platform Value Score is ' + (f.score === null ? 'Not Measured' : f.score) + ' in ' + f.run + ' (' + f.runDateText + ')' +
                (f.change === null ? '. There is no earlier run to compare with.' : ', ' + signed(f.change) + ' from ' + f.previousScore + ' in ' + f.previousRun + '.') +
                ' ' + f.belowLowThreshold + ' capabilities are below the low threshold and ' + f.notMeasured + ' are Not Measured.')
        }
        case 'idle': { // PIV-059.03
            const o = new GlideRecordSecure(T.opportunity)
            o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
            o.addQuery('type', 'IN', 'idle_licences,shelfware')
            o.orderByDesc('priority')
            o.query()
            const all: any[] = []
            let idle = 0, shelf = 0
            while (o.next()) { if (str(o, 'type') === 'idle_licences') idle++; else shelf++; all.push(oppItem(o)) }
            if (!all.length) return done('There are no open idle-licence or shelfware findings.')
            const items = all.slice(0, 10)
            if (all.length > 10) items.push({ ref: 'view:Value & Opportunities', label: 'Open the full list (' + all.length + ' findings)' })
            return done(idle + ' idle-licence and ' + shelf + ' shelfware findings are open' + (all.length > 10 ? '. The top 10 by priority are listed.' : ':'), items)
        }
        case 'mine': { // PIV-059.04
            const o = new GlideRecordSecure(T.opportunity)
            o.addQuery('assigned_to', gs.getUserID())
            o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
            o.orderByDesc('priority')
            o.query()
            const items: any[] = []
            while (o.next()) items.push(oppItem(o))
            return done(items.length ? 'You own ' + items.length + ' open PIVOT ' + (items.length === 1 ? 'opportunity' : 'opportunities') + ':' : 'You have no PIVOT items assigned to you.', items)
        }
        case 'lastrun': { // PIV-059.05
            const a = new GlideRecordSecure(T.assessment)
            a.orderByDesc('run_date')
            a.setLimit(1)
            a.query()
            if (!a.next()) return done('PIVOT has not run yet.')
            const st = str(a, 'status')
            if (st === 'running' || st === 'queued') return done(str(a, 'number') + ' is ' + a.getDisplayValue('status').toLowerCase() + ' now (started ' + dateText(str(a, 'run_date')) + ' at ' + timeText(str(a, 'run_date')) + ').')
            const f = runFacts(str(a, 'number'))
            const when = dateText(str(a, 'run_date')) + ' at ' + timeText(str(a, 'run_date'))
            if (!f || f.failed) return done('PIVOT last ran ' + str(a, 'number') + ' on ' + when + '. Status: Failed' + (f && f.error ? ' – ' + f.error : '.'))
            return done('PIVOT last ran ' + f.run + ' on ' + when + '. Status: ' + f.status + '. ' + (f.staleSources.length ? 'Stale sources: ' + f.staleSources.join('; ') + '.' : 'No stale sources.'))
        }
        case 'notmeasured': {
            if (!run) return done('No assessment has completed yet.')
            const r = new GlideRecordSecure(T.result)
            r.addQuery('assessment', run.getUniqueValue())
            r.addNullQuery('score')
            r.query()
            const items: any[] = []
            let n = 0
            while (r.next()) { n++; if (items.length < 10) items.push({ ref: str(r, 'capability'), label: r.getDisplayValue('capability') + ' · ' + (str(r, 'reason') || 'no measure or target') }) }
            return done(n ? n + ' capabilities are Not Measured in ' + runNo + (n > 10 ? '. The first 10 are listed.' : ':') : 'Every capability in ' + runNo + ' has a score.', items)
        }
        case 'first': {
            const o = new GlideRecordSecure(T.opportunity)
            o.addQuery('state', 'IN', OPP_ACTIVE.join(','))
            o.addQuery('priority', '>=', nowAt)
            o.orderByDesc('priority')
            o.orderByDesc('value')
            o.setLimit(5)
            o.query()
            const items: any[] = []
            while (o.next()) items.push(oppItem(o))
            return done(items.length ? 'Start with the top ' + items.length + ' Now items, highest priority first:' : 'Nothing is in Now. Look at the Next column of the Roadmap.', items)
        }
        case 'runnow': { // PIV-060.01
            if (!isRole('admin')) return done('Only PIVOT admins can start a run.')
            return done('Start a new PIVOT assessment run now? It runs in the background and emails the PIVOT admins when it ends.', [], { confirm: { kind: 'runNow', text: 'Start a run' } })
        }
        case 'assign': { // PIV-060.02
            if (!canSuggest()) return done('Only analysts and admins can assign opportunities.')
            const opps = matchOpps(it.target || '', true)
            if (!opps.length) return done('No open opportunity matches "' + (it.target || '') + '". Give its number (PVO…) or the capability name.')
            if (opps.length > 1) return done('More than one opportunity matches. Which one do you mean? Ask again with its number, for example "assign ' + opps[0].number + ' to ' + (it.person || 'name') + '".', opps.slice(0, 10).map((x) => x.item))
            const people = matchPeople(it.person || '')
            if (!people.length) return done('No active PIVOT analyst or admin matches "' + (it.person || '') + '".', [opps[0].item])
            if (people.length > 1) return done('More than one person matches "' + it.person + '": ' + people.map((p) => p.name).join(', ') + '. Ask again with the full name.', [opps[0].item])
            return done('Assign ' + opps[0].number + ' (' + opps[0].item.label + ') to ' + people[0].name + '?', [opps[0].item], { confirm: { kind: 'assign', number: opps[0].number, user: people[0].user, text: 'Assign to ' + people[0].name } })
        }
        case 'accept': { // PIV-060.03
            if (!canSuggest()) return done('Only analysts and admins can accept opportunities.')
            const opps = matchOpps(it.target || '', false)
            if (!opps.length) return done('No opportunity matches "' + (it.target || '') + '". Give its number (PVO…) or the capability name.')
            const open = opps.filter((x) => x.state === 'open')
            if (!open.length) return done('Only open opportunities can be accepted.', opps.slice(0, 5).map((x) => x.item))
            if (open.length > 1) return done('More than one open opportunity matches. Which one do you mean? Ask again with its number.', open.slice(0, 10).map((x) => x.item))
            return done('Accept ' + open[0].number + ' (' + open[0].item.label + ')?', [open[0].item], { confirm: { kind: 'accept', number: open[0].number, text: 'Accept ' + open[0].number } })
        }
    }
    return done('PIVOT does not have that information. ' + CAN_ANSWER) // PIV-059.07
}

/** PIV-060 – a confirmed chat action. The change goes through the same checks as the workspace buttons
 *  (performAction = workspace-api runAction) and is written to the record's work notes (PIV-060.04). */
export function confirmChat(c: any, channel: string, performAction: (b: any) => AiResult): AiResult {
    if (!hasPivotRole()) return { ok: false, error: MSG.noRole }
    if (!aiEnabled()) return { ok: false, error: MSG.off }
    const kind = String(c && c.kind), via = channel === 'va' ? 'Virtual Agent' : 'Ask PIVOT'
    const who = gs.getUserDisplayName()
    let r: AiResult
    if (kind === 'runNow') {
        r = performAction({ action: 'runNow' })
        logAi('chat_action', r.number || '', 'Start a run' + (r.ok ? ': ' + r.number : ': ' + (r.error || '')), r.ok ? 'accepted' : 'failed', channel, 'rules')
        if (r.ok) r.note = 'Run ' + r.number + ' started. ' + (r.note || '')
        return r
    }
    if (kind !== 'assign' && kind !== 'accept') return { ok: false, error: 'Unknown action.' }
    const number = String(c.number || '')
    const change = kind === 'assign' ? 'assigned to ' + userName(String(c.user || '')) : 'accepted'
    const workNote = 'Changed from ' + via + ' by ' + who + ': ' + change + '.' // saved in the same update as the change
    r = performAction(kind === 'assign' ? { action: 'assign', number, user: String(c.user || ''), workNote } : { action: 'accept', number, workNote })
    if (r.ok) r.note = number + ' ' + change + '.'
    else if (kind === 'accept' && /Only new opportunities/.test(String(r.error))) r.error = 'Only open opportunities can be accepted.'
    logAi('chat_action', number, kind + ': ' + change + (r.ok ? '' : ' – ' + (r.error || 'failed')), r.ok ? 'accepted' : 'failed', channel, 'rules')
    return r
}

/** PIV-054.02 AC 1 – admin check that the provider answers a test prompt. */
export function test(): AiResult {
    if (!isRole('admin')) return { ok: false, error: 'Only PIVOT admins can test the AI provider.' }
    const t0 = nowMs()
    const r = llm('Reply with exactly the word: ready')
    logAi('test', '', r.ok ? r.text.slice(0, 200) : r.error || '', r.ok ? 'shown' : 'failed', 'workspace')
    return r.ok ? { ok: true, response: r.text.slice(0, 200), ms: nowMs() - t0, note: 'The AI provider answered in ' + Math.round((nowMs() - t0) / 100) / 10 + ' s.' } : { ok: false, error: r.notSetUp ? MSG.notSetUp + '.' : 'The AI provider did not answer: ' + (r.error || MSG.failed) }
}

/** PIV-055.04 – Now Assist panel: explain the opportunity the user is looking at, or ask which one. */
export function explainForPanel(table: string, sysId: string, text?: string): AiResult {
    const m = /PVO\d+/i.exec(String(text || ''))
    let number = m ? m[0].toUpperCase() : ''
    if (!number && table === T.opportunity && /^[0-9a-f]{32}$/i.test(String(sysId || ''))) {
        const o = new GlideRecordSecure(T.opportunity)
        if (o.get(String(sysId))) number = str(o, 'number')
    }
    if (!number) return { ok: false, ask: true, error: 'Which opportunity do you mean? Open it, or give its number (PVO…).' }
    return explain(number, 'panel')
}
