// Table business rules (before insert/update). They are the last line of defence: every write –
// from the workspace, a form, a list edit or an import – passes the same PIVOT rules (design B6).
import { gs, GlideDateTime, GlideRecord } from '@servicenow/glide'
import { priorityOf, priorityReason, validateScores, validateRejection, validateCapability, validateOutcome, SCOPE } from './rules.ts'

function stop(current: any, message: string) {
    gs.addErrorMessage(message)
    current.setAbortAction(true)
}
function firstError(errors: { [k: string]: string }) {
    const keys = Object.keys(errors)
    return keys.length ? errors[keys[0]] : ''
}

/** Opportunity: validate scores, recalculate priority + reason, require a rejection reason. */
export function opportunityBefore(current: any, previous: any) {
    try {
        const v = current.getValue('value'), i = current.getValue('business_impact') || '0', e = current.getValue('effort')
        const hasScores = !!(v || e)
        if (hasScores) {
            const err = firstError(validateScores(v, i, e))
            if (err) return stop(current, err)
            const p = priorityOf(Number(v), Number(i), Number(e))
            current.setValue('priority', p)
            current.setValue('priority_reason', priorityReason(Number(v), Number(i), Number(e), p))
        }
        if (current.getValue('state') === 'rejected') {
            const err = firstError(validateRejection(current.getValue('rejection_reason')))
            if (err) return stop(current, err)
        }
        if (previous && previous.getValue('state') === 'open' && current.getValue('state') === 'done')
            return stop(current, 'Accept the opportunity before closing it as done.')
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
