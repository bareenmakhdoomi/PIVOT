// Table business rules (before insert/update). They are the last line of defence: every write –
// from the workspace, a form, a list edit or an import – passes the same PIVOT rules (design B6).
import { gs, GlideDateTime } from '@servicenow/glide'
import { priorityOf, priorityReason, validateScores, validateRejection, validateCapability, validateOutcome, SCOPE } from './rules'

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
export function capabilityBefore(current: any) {
    try {
        const err = firstError(validateCapability({
            measure_table: current.getValue('measure_table') || '',
            date_field: current.getValue('date_field') || '',
            days_back: current.getValue('days_back') || '30',
            target: current.getValue('target_value') || '',
            weight: current.getValue('weight') || '1',
            family: current.getValue('product_family') || '',
        }))
        if (err) stop(current, err)
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
