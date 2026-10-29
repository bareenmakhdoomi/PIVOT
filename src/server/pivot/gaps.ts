// PIV-028 / 029 / 030 – gap rules: turn one assessment's results into opportunities.
// The decisions are pure functions in rules.ts (evaluateGaps); this module reads and writes the records.
import { gs, GlideRecord } from '@servicenow/glide'
import { SCOPE, PROPERTIES, GAP_TYPES, OPP_ACTIVE, evaluateGaps, gapConfig, fillTemplate, impactFromStatus, GapOutcome } from './rules.ts'

const T = {
    capability: SCOPE + '_capability', result: SCOPE + '_result', opportunity: SCOPE + '_opportunity',
    outcome: SCOPE + '_business_outcome', assessment: SCOPE + '_assessment',
}
const str = (gr: any, f: string): string => { const v = gr.getValue(f); return v === null || v === undefined ? '' : String(v) }
const num = (gr: any, f: string): number | null => { const v = str(gr, f); return v === '' || isNaN(Number(v)) ? null : Number(v) }
const bool = (gr: any, f: string) => str(gr, f) === '1' || str(gr, f) === 'true'
const prop = (name: string) => gs.getProperty(SCOPE + '.' + name, PROPERTIES[name] ? PROPERTIES[name].def : '')
const OPEN = OPP_ACTIVE

export type GapLog = (level: 'info' | 'warn' | 'error', step: number, message: string) => void
export type GapSummary = { created: number; updated: number; resolved: number; kept: number; errors: number }

function note(gr: any, text: string) {
    let list: any[] = []
    try { list = JSON.parse(str(gr, 'activity_log') || '[]') } catch (ex) { list = [] }
    if (!Array.isArray(list)) list = []
    list.push({ ts: new Date().getTime(), user: 'system', text: text, note: true })
    gr.setValue('activity_log', JSON.stringify(list.slice(-200)))
}

/** Runs every gap rule for every active capability against the given assessment. */
export function runGapRules(assessmentId: string, assessmentNumber: string, add: GapLog): GapSummary {
    const sum: GapSummary = { created: 0, updated: 0, resolved: 0, kept: 0, errors: 0 }
    const limits = { utilization: Number(prop('utilization_threshold')), lowScore: Number(prop('low_score_threshold')), highUsage: Number(prop('high_usage_threshold')) }
    const cfg = gapConfig(prop('gap_rule_config'))

    // outcomes per capability (inactive outcomes count as retired – PIV-029.02 / .06)
    const outcomes: { [cap: string]: (GapOutcome & { id: string })[] } = {}
    const o = new GlideRecord(T.outcome)
    o.query()
    while (o.next()) {
        const cap = str(o, 'capability')
        if (!cap) continue
        ;(outcomes[cap] = outcomes[cap] || []).push({
            id: o.getUniqueValue(), kpi: str(o, 'kpi'), status: str(o, 'status'), active: str(o, 'active') === '' || bool(o, 'active'),
            important: bool(o, 'important_objective'), lowVolume: bool(o, 'low_volume_expected'), current: num(o, 'current_value'), target: num(o, 'target'),
        })
    }
    // this run's results per capability
    const results: { [cap: string]: { score: number | null; utilization: number | null } } = {}
    const r = new GlideRecord(T.result)
    r.addQuery('assessment', assessmentId)
    r.query()
    while (r.next()) results[str(r, 'capability')] = { score: num(r, 'score'), utilization: num(r, 'utilization') }

    const found: { [key: string]: boolean } = {}
    const c = new GlideRecord(T.capability)
    c.addQuery('active', true)
    c.query()
    while (c.next()) {
        const capId = c.getUniqueValue(), name = str(c, 'name')
        try {
            const res = results[capId] || { score: null, utilization: null }
            const outs = outcomes[capId] || []
            const ev = evaluateGaps({
                name: name, licensed: bool(c, 'licensed'), installed: bool(c, 'installed'), score: res.score, utilization: res.utilization,
                purchased: num(c, 'entitled_count'), allocated: num(c, 'allocated_count'),
            }, outs, limits)
            ev.notes.forEach((n) => add('info', 7, name + ': ' + n + '.'))
            // linked outcome and business impact: the active outcome with the highest impact (PIV-031.03)
            let impact = null as number | null, linked = ''
            outs.filter((x) => x.active).forEach((x) => { const i = impactFromStatus(x.status); if (i !== null && (impact === null || i > impact)) { impact = i; linked = x.id } })
            ev.gaps.forEach((g) => {
                found[capId + '|' + g.type] = true
                const tpl = cfg[g.type]
                const data = { capability: name, measured: g.measured, threshold: g.threshold, kpi: g.kpi, current: g.current, target: g.target,
                    purchased: num(c, 'entitled_count'), allocated: num(c, 'allocated_count'), assessment: assessmentNumber }
                const title = fillTemplate(tpl.title, data).slice(0, 160), text = fillTemplate(tpl.text, data).slice(0, 1000)
                // PIV-030.01 / .03 – one opportunity per capability and type; Rejected and Done are never reopened
                const ex = new GlideRecord(T.opportunity)
                ex.addQuery('capability', capId)
                ex.addQuery('type', g.type)
                ex.orderByDesc('sys_created_on')
                ex.query()
                let open: any = null, closed = ''
                while (ex.next()) {
                    if (OPEN.indexOf(str(ex, 'state')) > -1) { if (!open) { open = new GlideRecord(T.opportunity); open.get(ex.getUniqueValue()) } }
                    else if (!closed) closed = str(ex, 'number') + ' (' + str(ex, 'state') + ')'
                }
                if (open) {
                    const before = str(open, 'measured_value')
                    open.setValue('assessment', assessmentId)
                    open.setValue('measured_value', g.measured)
                    open.setValue('short_description', title)
                    open.setValue('description', text)
                    if (linked) open.setValue('outcome', linked)
                    open.setValue('business_impact', impact === null ? '' : impact)
                    if (bool(open, 'gap_resolved')) open.setValue('gap_resolved', false)
                    note(open, 'Found again in ' + assessmentNumber + ': measured ' + (before || '—') + ' → ' + g.measured + '.')
                    open.update() // value, effort, assignment and state stay as the analyst left them; priority is recalculated by the business rule
                    sum.updated++
                } else if (closed) {
                    sum.kept++
                    add('info', 7, name + ': ' + g.type + ' gap found again – ' + closed + ' is not reopened.')
                } else {
                    const n = new GlideRecord(T.opportunity)
                    n.newRecord()
                    n.setValue('capability', capId)
                    n.setValue('assessment', assessmentId)
                    n.setValue('type', g.type)
                    n.setValue('state', 'open')
                    n.setValue('measured_value', g.measured)
                    n.setValue('short_description', title)
                    n.setValue('description', text)
                    if (linked) n.setValue('outcome', linked)
                    n.setValue('value', tpl.value)
                    n.setValue('effort', tpl.effort)
                    n.setValue('business_impact', impact === null ? '' : impact)
                    note(n, 'Created by ' + assessmentNumber + ': ' + title + '.')
                    if (n.insert()) sum.created++
                    else { sum.errors++; add('error', 7, name + ': the ' + g.type + ' opportunity could not be saved.') }
                }
            })
        } catch (ex) {
            sum.errors++
            add('error', 7, 'Gap rules failed for ' + name + ': ' + ex)
        }
    }

    // PIV-030.04 / .05 – open opportunities whose gap was not found this time
    const op = new GlideRecord(T.opportunity)
    op.addQuery('state', 'IN', OPEN.join(','))
    op.addQuery('type', 'IN', GAP_TYPES.join(','))
    op.query()
    while (op.next()) {
        if (found[str(op, 'capability') + '|' + str(op, 'type')] || bool(op, 'gap_resolved')) continue
        op.setValue('gap_resolved', true)
        note(op, 'Gap no longer detected in ' + assessmentNumber + '.')
        op.update() // the state is not changed – an analyst confirms the closure
        sum.resolved++
    }
    return sum
}
