// PIV-033 – roadmap: place every active opportunity in Now / Next / Later and number it inside its phase.
// Called as step 8 of each assessment run and by the PivotRoadmap script include (generate(assessmentId)).
import { gs, GlideRecord } from '@servicenow/glide'
import { SCOPE, PROPERTIES, OPP_ACTIVE, planRoadmap, RoadmapEntry } from './rules.ts'

const T = { assessment: SCOPE + '_assessment', opportunity: SCOPE + '_opportunity', roadmap: SCOPE + '_roadmap_item' }
const str = (gr: any, f: string): string => { const v = gr.getValue(f); return v === null || v === undefined ? '' : String(v) }
const num = (gr: any, f: string): number | null => { const v = str(gr, f); return v === '' || isNaN(Number(v)) ? null : Number(v) }
const prop = (name: string) => Number(gs.getProperty(SCOPE + '.' + name, PROPERTIES[name] ? PROPERTIES[name].def : ''))

export type RoadmapSummary = { ok: boolean; created: number; updated: number; removed: number; now: number; next: number; later: number; message: string }

/** Rebuilds the roadmap for one assessment. Items of Rejected and Done opportunities are removed (PIV-033.05);
 *  each active opportunity gets exactly one item, linked to this assessment. */
export function generate(assessmentId: string): RoadmapSummary {
    const sum: RoadmapSummary = { ok: false, created: 0, updated: 0, removed: 0, now: 0, next: 0, later: 0, message: '' }
    const asm = new GlideRecord(T.assessment)
    if (!assessmentId || !asm.get(String(assessmentId))) {
        sum.message = 'Assessment not found'
        gs.warn('PIVOT roadmap: Assessment not found (' + assessmentId + ')')
        return sum
    }

    // 1 – items whose opportunity is no longer active (Rejected, Done) or missing are removed
    const old = new GlideRecord(T.roadmap)
    old.query()
    while (old.next()) {
        const op = new GlideRecord(T.opportunity)
        if (!op.get(str(old, 'opportunity')) || OPP_ACTIVE.indexOf(str(op, 'state')) < 0) {
            if (old.deleteRecord()) sum.removed++
        }
    }

    // 2 – active opportunities, phase and order
    const entries: RoadmapEntry[] = []
    const op = new GlideRecord(T.opportunity)
    op.addQuery('state', 'IN', OPP_ACTIVE.join(','))
    op.query()
    while (op.next()) entries.push({ id: op.getUniqueValue(), number: str(op, 'number'), priority: num(op, 'priority'), value: num(op, 'value') })
    const plan = planRoadmap(entries, prop('priority_now'), prop('priority_next'))

    // 3 – one item per opportunity (extra hand-made items for the same opportunity are removed)
    Object.keys(plan).forEach((phase) => {
        plan[phase].forEach((e, i) => {
            const it = new GlideRecord(T.roadmap)
            it.addQuery('opportunity', e.id)
            it.orderBy('sys_created_on')
            it.query()
            let kept = false
            while (it.next()) {
                if (kept) { if (it.deleteRecord()) sum.removed++; continue }
                kept = true
                it.setValue('assessment', assessmentId)
                it.setValue('phase', phase)
                it.setValue('sequence', i + 1)
                if (it.update()) sum.updated++
            }
            if (!kept) {
                const n = new GlideRecord(T.roadmap)
                n.newRecord()
                n.setValue('assessment', assessmentId)
                n.setValue('opportunity', e.id)
                n.setValue('phase', phase)
                n.setValue('sequence', i + 1)
                if (n.insert()) sum.created++
            }
        })
    })
    sum.now = plan.now.length
    sum.next = plan.next.length
    sum.later = plan.later.length
    const total = sum.now + sum.next + sum.later
    sum.ok = true
    sum.message = total === 0
        ? 'Roadmap: 0 items (no open opportunities)'
        : 'Roadmap: ' + total + ' items (Now ' + sum.now + ', Next ' + sum.next + ', Later ' + sum.later + ')' + (sum.removed ? ', ' + sum.removed + ' old item(s) removed' : '')
    return sum
}
