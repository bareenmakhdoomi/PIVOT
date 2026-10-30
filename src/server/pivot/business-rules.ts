// Table business rules (before insert/update). They are the last line of defence: every write –
// from the workspace, a form, a list edit or an import – passes the same PIVOT rules (design B6).
import { gs, GlideDateTime, GlideRecord } from '@servicenow/glide'
import { priorityOf, priorityReason, validateScores, validateRejection, validateTransition, validateCapability, validateOutcome, SCOPE, OPP_ACTIVE, OPP_STATE_LABEL } from './rules.ts'

function stop(current: any, message: string) {
    gs.addErrorMessage(message)
    current.setAbortAction(true)
}
function firstError(errors: { [k: string]: string }) {
    const keys = Object.keys(errors)
    return keys.length ? errors[keys[0]] : ''
}

/** Opportunity: validate scores, recalculate priority + reason (PIV-031), require a rejection reason,
 *  and allow only one open opportunity per capability and type (PIV-030.06). */
export function opportunityBefore(current: any, previous: any) {
    try {
        const v = current.getValue('value'), i = current.getValue('business_impact'), e = current.getValue('effort')
        const hasScores = !!(v || e)
        if (hasScores) {
            const err = firstError(validateScores(v, i, e))
            if (err) return stop(current, err)
            const impact = i === null || i === '' ? null : Number(i)
            const wv = Number(gs.getProperty(SCOPE + '.priority_weight_value', '1')) || 1
            const wiRaw = gs.getProperty(SCOPE + '.priority_weight_impact', '1'), wi = wiRaw === '' || isNaN(Number(wiRaw)) ? 1 : Number(wiRaw)
            const p = priorityOf(Number(v), impact, Number(e), wv, wi)
            current.setValue('priority', p)
            current.setValue('priority_reason', priorityReason(Number(v), impact, Number(e), p, wv, wi))
        }
        // On insert the platform passes an empty previous record – treat it as no previous state
        const state = current.getValue('state'), before = previous && !current.isNewRecord() ? previous.getValue('state') || '' : ''
        // PIV-032.01 – allowed state changes; Done and Rejected can only be reopened (back to New)
        if (before) {
            const tErr = validateTransition(before, state)
            if (tErr) return stop(current, tErr)
        }
        // PIV-032.03 – rejection reason (form, list edit, import, workspace)
        if (state === 'rejected') {
            const err = firstError(validateRejection(current.getValue('rejection_reason')))
            if (err) return stop(current, err)
        }
        // PIV-032.02 – Assigned to must be a member of the assignment group
        const group = current.getValue('assignment_group'), who = current.getValue('assigned_to')
        if (group && who && (!previous || group !== previous.getValue('assignment_group') || who !== previous.getValue('assigned_to'))) {
            const m = new GlideRecord('sys_user_grmember')
            m.addQuery('group', group)
            m.addQuery('user', who)
            m.setLimit(1)
            m.query()
            if (!m.hasNext()) return stop(current, 'Assigned to must be a member of the assignment group.')
        }
        // PIV-032.01 – a work note records who changed the state
        if (before && before !== state) {
            let text = 'State changed from ' + (OPP_STATE_LABEL[before] || before) + ' to ' + (OPP_STATE_LABEL[state] || state) + ' by ' + gs.getUserDisplayName() + '.'
            if (before === 'rejected') {
                text = 'Reopened by ' + gs.getUserDisplayName() + '. It was rejected because: ' + (previous.getValue('rejection_reason') || '—')
                current.setValue('rejection_reason', '')
            } else if (before === 'done') text = 'Reopened by ' + gs.getUserDisplayName() + ' (was Done).'
            current.work_notes = text
        }
        if (OPP_ACTIVE.indexOf(state) > -1 && (!previous || previous.getValue('state') !== state || previous.getValue('type') !== current.getValue('type') || previous.getValue('capability') !== current.getValue('capability'))) {
            const dup = new GlideRecord(SCOPE + '_opportunity')
            dup.addQuery('capability', current.getValue('capability'))
            dup.addQuery('type', current.getValue('type'))
            dup.addQuery('state', 'IN', OPP_ACTIVE.join(','))
            dup.addQuery('sys_id', '!=', current.getUniqueValue())
            dup.setLimit(1)
            dup.query()
            if (dup.hasNext()) return stop(current, 'An open opportunity of this type already exists for this capability')
        }
    } catch (ex) {
        gs.error('PIVOT opportunity rule failed: ' + ex)
    }
}

/** Capability: measurement settings must be valid. */
export function capabilityBefore(current: any, previous: any) {
    try {
        const err = firstError(validateCapability({
            measure_table: current.getValue('measure_table') || '',
            date_field: current.getValue('date_field') || '',
            days_back: current.getValue('days_back') || '30',
            target: current.getValue('target_value') || '',
            weight: current.getValue('weight') || '1',
            family: current.getValue('product_family') || '',
        }))
        if (err) return stop(current, err)
        // PIV-014.04 – a licence can only be linked to another, installed capability
        const linked = current.getValue('linked_app')
        if (linked && (!previous || linked !== previous.getValue('linked_app'))) {
            if (linked === current.getUniqueValue()) return stop(current, 'A capability cannot be linked to itself.')
            const app = new GlideRecord(SCOPE + '_capability')
            if (!app.get(linked) || !(app.getValue('installed') === '1' || app.getValue('installed') === 'true')) return stop(current, 'Linked app must be an installed capability.')
        }
    } catch (ex) {
        gs.error('PIVOT capability rule failed: ' + ex)
    }
}

/** Business outcome: validate, and lock the baseline once it is set – only PIVOT admins may change it, with a reason. */
export function outcomeBefore(current: any, previous: any) {
    try {
        const err = firstError(validateOutcome({
            capability: current.getValue('capability'), objective: current.getValue('objective'), kpi: current.getValue('kpi'),
            target: current.getValue('target'), measurement_type: current.getValue('measurement_type'), kpi_table: current.getValue('kpi_table'),
            baseline: current.getValue('baseline'), direction: current.getValue('direction'), kpi_aggregate: current.getValue('kpi_aggregate'),
            period: current.getValue('period'),
        }))
        if (err) return stop(current, err)
        // PIV-024.02 / .06 – a sum or average needs a field; a manual value cannot be dated in the future
        const aggType = current.getValue('kpi_aggregate')
        if (current.getValue('measurement_type') === 'calculated' && (aggType === 'sum' || aggType === 'avg') && !current.getValue('kpi_field'))
            return stop(current, 'Choose a field to sum or average.')
        const valueDate = current.getValue('manual_value_date')
        if (valueDate && valueDate > new GlideDateTime().getValue().split(' ')[0]) return stop(current, 'Value date cannot be in the future.')
        // PIV-024.08 – remember who entered a manual value
        if (current.getValue('measurement_type') === 'manual' && current.getValue('manual_value') !== null && (!previous || current.getValue('manual_value') !== previous.getValue('manual_value') || current.getValue('manual_value_date') !== previous.getValue('manual_value_date')))
            current.setValue('manual_value_by', gs.getUserID())
        // PIV-023.04 – warn, do not block, when the owner is inactive
        const owner = current.getValue('owner')
        if (owner && (!previous || owner !== previous.getValue('owner'))) {
            const u = new GlideRecord('sys_user')
            if (u.get(owner) && !(u.getValue('active') === '1' || u.getValue('active') === 'true')) gs.addInfoMessage('Owner is inactive.')
        }
        const before = previous ? previous.getValue('baseline') : null, now = current.getValue('baseline')
        if (before !== null && before !== '' && Number(before) !== Number(now)) {
            if (!gs.hasRole(SCOPE + '.admin')) return stop(current, 'The baseline is locked after the first measurement. Only PIVOT admins can change it (the change is audited).')
            if (!current.getValue('baseline_change_reason') || current.getValue('baseline_change_reason') === previous.getValue('baseline_change_reason'))
                return stop(current, 'Give a reason for changing the locked baseline.')
        }
        if (now !== null && now !== '' && !current.getValue('baseline_date')) current.setValue('baseline_date', new GlideDateTime().getValue().split(' ')[0])
    } catch (ex) {
        gs.error('PIVOT outcome rule failed: ' + ex)
    }
}

/** Roadmap item (PIV-004.05): a new item made from the Opportunity form's related list gets the opportunity's assessment.
 *  Runs on display (so the new form shows it) and before insert (so it is saved even if the form did not send it). */
export function roadmapItemDefaults(current: any) {
    try {
        if (current.getValue('assessment') || !current.getValue('opportunity')) return
        const o = new GlideRecord(SCOPE + '_opportunity')
        if (o.get(current.getValue('opportunity')) && o.getValue('assessment')) current.setValue('assessment', o.getValue('assessment'))
    } catch (ex) {
        gs.error('PIVOT roadmap item defaults failed: ' + ex)
    }
}

/** Shared range check: empty is allowed (Not Measured / not set yet). */
function outOfRange(current: any, field: string, min: number, max: number | null) {
    const v = current.getValue(field)
    if (v === null || v === '') return false
    const n = Number(v)
    return isNaN(n) || n < min || (max !== null && n > max)
}

/** Assessment (PIV-003.01): overall score must be 0–100. */
export function assessmentBefore(current: any) {
    try {
        if (outOfRange(current, 'overall_score', 0, 100)) return stop(current, 'Overall score must be between 0 and 100.')
    } catch (ex) {
        gs.error('PIVOT assessment rule failed: ' + ex)
    }
}

/** Result (PIV-003.04): score must be 0–100. */
export function resultBefore(current: any) {
    try {
        if (outOfRange(current, 'score', 0, 100)) return stop(current, 'Score must be between 0 and 100.')
    } catch (ex) {
        gs.error('PIVOT result rule failed: ' + ex)
    }
}

/** Roadmap item (PIV-004.04): sequence must be 0 or greater. */
export function roadmapItemBefore(current: any) {
    try {
        if (outOfRange(current, 'sequence', 0, null)) return stop(current, 'Sequence must be 0 or greater.')
    } catch (ex) {
        gs.error('PIVOT roadmap item rule failed: ' + ex)
    }
}

/** Business outcome form (PIV-026.08 AC 3): explain the empty Outcome Results list before the first run. */
export function outcomeDisplay(current: any) {
    try {
        if (current.isNewRecord()) return
        const r = new GlideRecord(SCOPE + '_outcome_result')
        r.addQuery('outcome', current.getUniqueValue())
        r.setLimit(1)
        r.query()
        if (!r.hasNext()) gs.addInfoMessage('No outcome results yet. Run an assessment to measure this KPI.')
    } catch (ex) {
        gs.error('PIVOT outcome display rule failed: ' + ex)
    }
}
