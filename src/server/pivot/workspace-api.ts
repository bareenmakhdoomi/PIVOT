// PIVOT workspace REST API (design PIV-063): GET /bootstrap returns everything the workspace shows,
// POST /action performs one user action. All PIVOT table access uses GlideRecordSecure, so the
// table and field ACLs of the user decide what is read and written. Validation runs here (field
// messages for the UI) and again in the table business rules.
import { gs, GlideRecord, GlideRecordSecure, GlideDateTime } from '@servicenow/glide'
import {
    SCOPE, FAMILIES, PROPERTIES, Errors, initialsOf, priorityOf, priorityReason, validateScores, validateRejection, OPP_ACTIVE,
    validateCapability, validateOutcome, validateProperty,
} from './rules.ts'
import { startRunNow } from './assessment.ts'

const T = {
    capability: SCOPE + '_capability',
    assessment: SCOPE + '_assessment',
    result: SCOPE + '_result',
    opportunity: SCOPE + '_opportunity',
    roadmap: SCOPE + '_roadmap_item',
    outcome: SCOPE + '_business_outcome',
    outcomeResult: SCOPE + '_outcome_result',
}
const ROLE_ORDER = ['admin', 'analyst', 'business_owner', 'viewer']
const PHASE_LABEL: { [k: string]: string } = { now: 'Now', next: 'Next', later: 'Later' }
const MAX_ACTIVITY = 200
const HISTORY_RUNS = 8

type Result = { ok: boolean; [k: string]: any }

// ---------------------------------------------------------------- helpers
const str = (gr: any, f: string): string => {
    const v = gr.getValue(f)
    return v === null || v === undefined ? '' : String(v)
}
const num = (gr: any, f: string): number | null => {
    const v = str(gr, f)
    return v === '' || isNaN(Number(v)) ? null : Number(v)
}
const bool = (gr: any, f: string) => {
    const v = str(gr, f)
    return v === '1' || v === 'true'
}
const ms = (v: string): number | null => (v ? new GlideDateTime(v).getNumericValue() : null)
const nowMs = () => new GlideDateTime().getNumericValue()
const parseJson = (s: string, fallback: any) => {
    if (!s) return fallback
    try {
        return JSON.parse(s)
    } catch (e) {
        return fallback
    }
}
const deny = (msg?: string): Result => ({ ok: false, error: msg || 'Your PIVOT role cannot do this.' })
const invalid = (errors: Errors): Result => ({ ok: false, errors })
const hasErrors = (e: Errors) => Object.keys(e).length > 0

function rolesOfMe(): string[] {
    return ROLE_ORDER.filter((r) => gs.hasRole(SCOPE + '.' + r))
}
const isRole = (r: string) => gs.hasRole(SCOPE + '.' + r)
const canWork = () => isRole('analyst') || isRole('admin')

function props(): { [k: string]: string } {
    const out: { [k: string]: string } = {}
    Object.keys(PROPERTIES).forEach((k) => {
        out[k] = gs.getProperty(SCOPE + '.' + k, PROPERTIES[k].def)
    })
    return out
}
function phaseOf(priority: number | null, p: { [k: string]: string }) {
    if (priority === null) return 'later'
    return priority >= Number(p.priority_now) ? 'now' : priority >= Number(p.priority_next) ? 'next' : 'later'
}

/** Users for names, avatars and the assignee list. Only active users, only display fields. */
function loadUsers(extraIds: string[]) {
    const users: { [id: string]: any } = {}
    const roleOf: { [id: string]: string } = {}
    const hr = new GlideRecord('sys_user_has_role')
    hr.addQuery('role.name', 'STARTSWITH', SCOPE + '.')
    hr.addQuery('user.active', true)
    hr.setLimit(2000)
    hr.query()
    while (hr.next()) {
        const id = str(hr, 'user'), role = hr.getDisplayValue('role').replace(SCOPE + '.', '')
        if (!roleOf[id] || ROLE_ORDER.indexOf(role) < ROLE_ORDER.indexOf(roleOf[id])) roleOf[id] = role
    }
    const ids = Object.keys(roleOf).concat(extraIds.filter((x) => x && x !== 'system'))
    if (!ids.length) return users
    const u = new GlideRecord('sys_user')
    u.addQuery('sys_id', 'IN', ids.join(','))
    u.setLimit(5000)
    u.query()
    while (u.next()) {
        const id = u.getUniqueValue(), name = str(u, 'name') || str(u, 'user_name')
        users[id] = { id, name, title: str(u, 'title'), initials: initialsOf(name), role: roleOf[id] || '' }
    }
    return users
}

// ---------------------------------------------------------------- bootstrap
function buildSnapshot() {
    const me = gs.getUserID()
    const myRoles = rolesOfMe()
    const p = props()
    const userIds: string[] = [me]

    // Capabilities
    const capabilities: any[] = []
    const c = new GlideRecordSecure(T.capability)
    c.orderBy('name')
    c.query()
    while (c.next()) {
        capabilities.push({
            id: c.getUniqueValue(), number: str(c, 'number'), name: str(c, 'name'), family: str(c, 'product_family'), source: str(c, 'source'),
            licensed: bool(c, 'licensed'), installed: bool(c, 'installed'), entitled: num(c, 'entitled_count'), allocated: num(c, 'allocated_count'),
            scope: str(c, 'app_scope'), linked_app: str(c, 'linked_app'), measure_table: str(c, 'measure_table'), measure_filter: str(c, 'measure_filter'),
            date_field: str(c, 'date_field'), days_back: num(c, 'days_back') || 30, target: num(c, 'target_value'), weight: num(c, 'weight') || 1,
            active: bool(c, 'active'), not_found: bool(c, 'not_found'), last_discovered: ms(str(c, 'last_discovered')), stale: false, staleNote: '',
        })
    }

    // Assessments (newest 52, returned oldest → newest like the design)
    const assessments: any[] = []
    const logs: { [num: string]: any[] } = {}
    const numberOf: { [sysId: string]: string } = {}
    const a = new GlideRecordSecure(T.assessment)
    a.orderByDesc('run_date')
    a.setLimit(52)
    a.query()
    while (a.next()) {
        const n = str(a, 'number') || a.getUniqueValue().slice(0, 8)
        const log = parseJson(str(a, 'log'), null)
        const entries = Array.isArray(log) ? log : str(a, 'log') ? [{ ts: ms(str(a, 'run_date')), level: 'info', step: 1, message: str(a, 'log') }] : []
        const errEntry = entries.filter((x: any) => x && x.level === 'error').pop()
        const runBy = str(a, 'run_by')
        if (runBy) userIds.push(runBy)
        numberOf[a.getUniqueValue()] = n
        logs[n] = entries
        assessments.unshift({
            id: a.getUniqueValue(), number: n, run_date: ms(str(a, 'run_date')), run_by: runBy || 'system',
            trigger: str(a, 'trigger') === 'run_now' ? 'Run Now' : 'Weekly schedule', status: str(a, 'status') === 'complete_with_warnings' ? 'complete' : str(a, 'status') || 'queued', withWarnings: str(a, 'status') === 'complete_with_warnings',
            duration: str(a, 'duration') ? ms(str(a, 'duration')) : null, overall_score: num(a, 'overall_score'), error: errEntry ? errEntry.message : '',
        })
    }

    // Results for the last completed runs (+ a running one) – used for scores and trends
    const wanted = assessments.filter((x) => x.status === 'complete').slice(-HISTORY_RUNS).concat(assessments.filter((x) => x.status === 'running'))
    const results: { [num: string]: any } = {}
    const outcomeResults: { [num: string]: any } = {}
    wanted.forEach((x) => {
        results[x.number] = {}
        outcomeResults[x.number] = {}
    })
    if (wanted.length) {
        const ids = wanted.map((x) => x.id).join(',')
        const r = new GlideRecordSecure(T.result)
        r.addQuery('assessment', 'IN', ids)
        r.query()
        while (r.next()) {
            const n = numberOf[str(r, 'assessment')]
            if (n) results[n][str(r, 'capability')] = { score: num(r, 'score'), actual: num(r, 'actual_value'), utilization: num(r, 'utilization'), target: num(r, 'target_value') }
        }
        const o = new GlideRecordSecure(T.outcomeResult)
        o.addQuery('assessment', 'IN', ids)
        o.query()
        while (o.next()) {
            const n = numberOf[str(o, 'assessment')]
            if (n) outcomeResults[n][str(o, 'outcome')] = { actual: num(o, 'actual'), improvement: num(o, 'improvement_pct'), status: str(o, 'outcome_status') || 'not_measured' }
        }
    }

    // Opportunities with their activity
    const opportunities: any[] = []
    const op = new GlideRecordSecure(T.opportunity)
    op.orderByDesc('priority')
    op.query()
    while (op.next()) {
        const activity = parseJson(str(op, 'activity_log'), [])
        activity.forEach((x: any) => x && x.user && userIds.push(x.user))
        if (str(op, 'assigned_to')) userIds.push(str(op, 'assigned_to'))
        opportunities.push({
            id: op.getUniqueValue(), number: str(op, 'number'), capability: str(op, 'capability'), outcome: str(op, 'outcome'), type: str(op, 'type'),
            description: str(op, 'description'), value: num(op, 'value'), effort: num(op, 'effort'), business_impact: num(op, 'business_impact'),
            priority: num(op, 'priority'), priority_reason: str(op, 'priority_reason'), state: str(op, 'state') || 'open', assigned_to: str(op, 'assigned_to'),
            assignment_group: str(op, 'assignment_group'), groupName: op.getDisplayValue('assignment_group') || '', gap_resolved: str(op, 'gap_resolved') === '1' || str(op, 'gap_resolved') === 'true',
            rejection_reason: str(op, 'rejection_reason'), assessment: numberOf[str(op, 'assessment')] || op.getDisplayValue('assessment') || '',
            created: ms(str(op, 'sys_created_on')), updated: ms(str(op, 'sys_updated_on')), activity: Array.isArray(activity) ? activity : [],
        })
    }

    // Roadmap order (rebuilt by each assessment run; analysts may reorder within a phase)
    const roadmap: { [oppId: string]: number } = {}
    const rm = new GlideRecordSecure(T.roadmap)
    rm.query()
    while (rm.next()) {
        const s = num(rm, 'sequence')
        if (s !== null) roadmap[str(rm, 'opportunity')] = s
    }

    // Business outcomes
    const outcomes: any[] = []
    const bo = new GlideRecordSecure(T.outcome)
    bo.orderBy('kpi')
    bo.query()
    while (bo.next()) {
        if (str(bo, 'owner')) userIds.push(str(bo, 'owner'))
        if (str(bo, 'manual_value_by')) userIds.push(str(bo, 'manual_value_by'))
        outcomes.push({
            id: bo.getUniqueValue(), capability: str(bo, 'capability'), objective: str(bo, 'objective'), kpi: str(bo, 'kpi'), direction: str(bo, 'direction') || 'higher_better',
            measurement_type: str(bo, 'measurement_type') || 'calculated', kpi_table: str(bo, 'kpi_table'), kpi_filter: str(bo, 'kpi_filter'),
            kpi_aggregate: str(bo, 'kpi_aggregate') || 'count', kpi_field: str(bo, 'kpi_field'), baseline: num(bo, 'baseline'),
            baseline_date: str(bo, 'baseline_date') ? ms(str(bo, 'baseline_date') + ' 12:00:00') : null, baseline_change_reason: str(bo, 'baseline_change_reason'),
            target: num(bo, 'target'), period: str(bo, 'period') || 'monthly', owner: str(bo, 'owner'), expected_benefit: str(bo, 'expected_benefit'),
            important_objective: bool(bo, 'important_objective'), low_volume_expected: bool(bo, 'low_volume_expected'),
            manual_value: num(bo, 'manual_value'), manual_value_date: str(bo, 'manual_value_date'), manual_value_by: str(bo, 'manual_value_by'),
        })
    }

    const users = loadUsers(userIds)
    const meUser = users[me] || { id: me, name: gs.getUserDisplayName(), title: '', initials: initialsOf(gs.getUserDisplayName()), role: '' }
    meUser.role = myRoles[0] || 'viewer'
    users[me] = meUser

    return {
        now: nowMs(),
        instance: { name: gs.getProperty('instance_name', ''), company: gs.getProperty('glide.product.description', '') },
        me: { id: me, role: myRoles[0] || 'viewer', roles: myRoles.length ? myRoles : ['viewer'] },
        users, families: FAMILIES, properties: p,
        capabilities, assessments, logs, results, outcomeResults, opportunities, roadmap, outcomes,
        engineAvailable: true, // PIV-034 – the assessment engine (weekly job and Run Now) aiAvailable: false,
    }
}

export function bootstrap(request: any, response: any) {
    try {
        response.setStatus(200)
        response.setBody(buildSnapshot() as any)
    } catch (ex) {
        gs.error('PIVOT workspace could not load its data: ' + ex)
        response.setStatus(500)
        response.setBody({ ok: false, error: 'PIVOT could not load its data. Ask your PIVOT admin to check the system log.' } as any)
    }
}

// ---------------------------------------------------------------- actions
function findOpp(number: string) {
    const gr = new GlideRecordSecure(T.opportunity)
    gr.addQuery('number', String(number || ''))
    gr.setLimit(1)
    gr.query()
    return gr.next() ? gr : null
}
function addActivity(gr: any, text: string, note?: boolean) {
    const list = parseJson(str(gr, 'activity_log'), [])
    const arr = Array.isArray(list) ? list : []
    arr.push({ ts: nowMs(), user: gs.getUserID(), text: String(text).slice(0, 2000), note: !!note })
    gr.setValue('activity_log', JSON.stringify(arr.slice(-MAX_ACTIVITY)))
}
function save(gr: any): Result {
    return gr.update() ? { ok: true } : { ok: false, error: 'The change was not saved. You may not have access to this record, or a PIVOT rule stopped it.' }
}
function userName(id: string) {
    const u = new GlideRecord('sys_user')
    return u.get(id) ? str(u, 'name') : ''
}
function isWorker(userId: string) {
    const hr = new GlideRecord('sys_user_has_role')
    hr.addQuery('user', userId)
    hr.addQuery('user.active', true)
    hr.addQuery('role.name', 'IN', SCOPE + '.analyst,' + SCOPE + '.admin')
    hr.setLimit(1)
    hr.query()
    return hr.hasNext()
}

function opportunityAction(kind: string, b: any): Result {
    if (!canWork()) return deny('Only analysts and admins can work opportunities.')
    const gr = findOpp(b.number)
    if (!gr) return { ok: false, error: 'Opportunity ' + b.number + ' was not found.' }
    if (!gr.canWrite()) return deny('You cannot change this opportunity.')
    const state = str(gr, 'state')
    switch (kind) {
        case 'accept':
            if (state !== 'open') return { ok: false, error: 'Only new opportunities can be accepted.' }
            gr.setValue('state', 'accepted')
            addActivity(gr, 'Accepted.')
            return save(gr)
        case 'start':
            if (state !== 'accepted') return { ok: false, error: 'Accept the opportunity before starting work on it.' }
            gr.setValue('state', 'in_progress')
            addActivity(gr, 'Work started.')
            return save(gr)
        case 'reopen':
            if (state !== 'done' && state !== 'rejected') return { ok: false, error: 'Only done or rejected opportunities can be reopened.' }
            gr.setValue('state', 'open')
            addActivity(gr, 'Reopened (was ' + (state === 'done' ? 'Done' : 'Rejected') + ').')
            return save(gr)
        case 'done':
            if (state !== 'accepted' && state !== 'in_progress') return { ok: false, error: 'Accept the opportunity before closing it as done.' }
            gr.setValue('state', 'done')
            addActivity(gr, 'Closed as done.')
            return save(gr)
        case 'reject': {
            if (OPP_ACTIVE.indexOf(state) < 0) return { ok: false, error: 'Only new, accepted or in-progress opportunities can be rejected.' }
            const e = validateRejection(b.reason)
            if (hasErrors(e)) return invalid(e)
            const reason = String(b.reason).trim().slice(0, 500)
            gr.setValue('state', 'rejected')
            gr.setValue('rejection_reason', reason)
            addActivity(gr, 'Rejected: ' + reason)
            const r = save(gr)
            if (r.ok) r.note = 'Rejected. It will not be reopened automatically by later runs.'
            return r
        }
        case 'assign': {
            const to = String(b.user || '')
            if (to && !isWorker(to)) return { ok: false, error: 'Assign to an active PIVOT analyst or admin.' }
            const group = str(gr, 'assignment_group')
            if (to && group) { // PIV-032.02
                const m = new GlideRecord('sys_user_grmember')
                m.addQuery('group', group)
                m.addQuery('user', to)
                m.setLimit(1)
                m.query()
                if (!m.hasNext()) return { ok: false, error: userName(to) + ' is not a member of the assignment group ' + gr.getDisplayValue('assignment_group') + '.' }
            }
            gr.setValue('assigned_to', to)
            addActivity(gr, to ? 'Assigned to ' + userName(to) + '.' : 'Unassigned.')
            return save(gr)
        }
        case 'note': {
            const text = String(b.text || '').trim()
            if (!text) return { ok: false, error: 'Write a note first.' }
            addActivity(gr, text, true)
            return save(gr)
        }
        case 'scores': {
            const e = validateScores(b.value, b.business_impact, b.effort)
            if (hasErrors(e)) return invalid(e)
            const v = Number(b.value), i = b.business_impact === '' || b.business_impact === null || b.business_impact === undefined ? null : Number(b.business_impact), ef = Number(b.effort)
            const old = str(gr, 'priority_reason').split(' – ')[0] || '—'
            const wv = Number(gs.getProperty(SCOPE + '.priority_weight_value', '1')) || 1, wi = Number(gs.getProperty(SCOPE + '.priority_weight_impact', '1'))
            const p = priorityOf(v, i, ef, wv, isNaN(wi) ? 1 : wi), reason = priorityReason(v, i, ef, p, wv, isNaN(wi) ? 1 : wi)
            gr.setValue('value', v)
            gr.setValue('business_impact', i === null ? '' : i)
            gr.setValue('effort', ef)
            addActivity(gr, 'Scores changed. Priority ' + old + ' → ' + reason.split(' – ')[0] + ' (' + PHASE_LABEL[phaseOf(p, props())] + ').')
            return save(gr)
        }
    }
    return { ok: false, error: 'Unknown action.' }
}

/** Active roadmap items with their opportunity, for reordering. */
function roadmapItems() {
    const items: any[] = []
    const rm = new GlideRecordSecure(T.roadmap)
    rm.addQuery('opportunity.state', 'IN', OPP_ACTIVE.join(','))
    rm.query()
    while (rm.next()) {
        const op = new GlideRecordSecure(T.opportunity)
        if (!op.get(str(rm, 'opportunity'))) continue
        items.push({ id: rm.getUniqueValue(), number: str(op, 'number'), priority: num(op, 'priority') || 0, value: num(op, 'value') || 0 })
    }
    return items
}
function setSequence(id: string, seq: number) {
    const rm = new GlideRecordSecure(T.roadmap)
    if (!rm.get(id) || !rm.canWrite()) return false
    rm.setValue('sequence', seq)
    return !!rm.update()
}

function reorder(b: any): Result {
    if (!canWork()) return deny('Only analysts and admins can change the roadmap order.')
    if (!PHASE_LABEL[b.phase]) return { ok: false, error: 'Unknown roadmap phase.' }
    const numbers: string[] = Array.isArray(b.numbers) ? b.numbers.slice(0, 500).map(String) : []
    const byNumber: { [n: string]: any } = {}
    roadmapItems().forEach((x) => (byNumber[x.number] = x))
    const missing = numbers.filter((n) => !byNumber[n])
    if (missing.length) return { ok: false, error: 'The roadmap order can be changed once an assessment run has built the roadmap (' + missing.length + ' item(s) are not on it yet).' }
    for (let i = 0; i < numbers.length; i++) if (!setSequence(byNumber[numbers[i]].id, i + 1)) return deny('You cannot change the roadmap order.')
    return { ok: true, note: 'Order changed. The next assessment run rebuilds the roadmap by priority.' }
}

function resetRoadmap(): Result {
    if (!canWork()) return deny('Only analysts and admins can change the roadmap order.')
    const items = roadmapItems().sort((x, y) => y.priority - x.priority || y.value - x.value || (x.number < y.number ? -1 : 1)) // PIV-033.04: equal priority → higher value first
    for (let i = 0; i < items.length; i++) if (!setSequence(items[i].id, i + 1)) return deny('You cannot change the roadmap order.')
    return { ok: true }
}

function saveOutcome(f: any): Result {
    const me = gs.getUserID(), admin = isRole('admin')
    const isNew = !f.id
    const gr = new GlideRecordSecure(T.outcome)
    if (isNew) {
        if (!(admin || isRole('business_owner'))) return deny('Only business owners and admins can create outcomes.')
        gr.initialize()
        if (!gr.canCreate()) return deny('Only business owners and admins can create outcomes.')
    } else {
        if (!gr.get(String(f.id))) return { ok: false, error: 'This outcome was not found.' }
        if (!(admin || (isRole('business_owner') && str(gr, 'owner') === me)) || !gr.canWrite()) return deny('You can only edit outcomes you own.')
    }
    const e = validateOutcome(f)
    const cap = new GlideRecordSecure(T.capability)
    if (!e.capability && !cap.get(String(f.capability))) e.capability = 'Choose the capability this outcome measures.'
    const locked = !isNew && str(gr, 'baseline') !== ''
    const baselineChange = locked && f.baseline !== undefined && f.baseline !== '' && f.baseline !== null && Number(f.baseline) !== num(gr, 'baseline')
    if (baselineChange && !admin) e.baseline = 'The baseline is locked after the first measurement. Only admins can change it (the change is audited).'
    const changeReason = String(f.baseline_change_reason || '').trim()
    if (baselineChange && admin && changeReason.length < 5) e.baseline_change_reason = 'Give a reason for changing the locked baseline.'
    // PIV-007.04 – the owner (or an admin) may give the starting baseline while it is still empty; after that it is locked
    const firstBaseline = !locked && f.baseline !== undefined && f.baseline !== null && String(f.baseline).trim() !== ''
    if (firstBaseline && isNaN(Number(f.baseline))) e.baseline = 'Enter a number.'
    // PIV-024.02 – a sum or average needs a real field on the KPI table
    const isCalc = f.measurement_type !== 'manual'
    if (isCalc && (f.kpi_aggregate === 'sum' || f.kpi_aggregate === 'avg')) {
        const field = String(f.kpi_field || '').trim()
        if (!field) e.kpi_field = 'Choose a field to sum or average.'
        else if (!e.kpi_table && f.kpi_table && new GlideRecord(String(f.kpi_table)).isValid() && !new GlideRecord(String(f.kpi_table)).isValidField(field)) e.kpi_field = 'Field ' + field + ' does not exist on ' + f.kpi_table + '.'
    }
    if (isCalc && !e.kpi_table && f.kpi_table && !new GlideRecord(String(f.kpi_table)).isValid()) e.kpi_table = 'Table ' + f.kpi_table + ' does not exist on this instance.'
    // PIV-024.06 – manual value and date
    const manualValue = f.manual_value === undefined || f.manual_value === null ? '' : String(f.manual_value).trim()
    const manualDate = String(f.manual_value_date || '').trim()
    if (!isCalc && manualValue !== '' && isNaN(Number(manualValue))) e.manual_value = 'Enter a number.'
    if (!isCalc && manualDate && !/^\d{4}-\d{2}-\d{2}$/.test(manualDate)) e.manual_value_date = 'Enter a date.'
    else if (!isCalc && manualDate && manualDate > new GlideDateTime().getValue().split(' ')[0]) e.manual_value_date = 'Value date cannot be in the future.'
    if (!isCalc && manualValue !== '' && !manualDate) e.manual_value_date = 'Give the date the value applies to.'
    if (hasErrors(e)) return invalid(e)

    const text = (k: string, max: number) => String(f[k] === undefined || f[k] === null ? '' : f[k]).trim().slice(0, max)
    gr.setValue('capability', String(f.capability))
    gr.setValue('objective', text('objective', 500))
    gr.setValue('kpi', text('kpi', 200))
    gr.setValue('direction', f.direction === 'lower_better' ? 'lower_better' : 'higher_better')
    gr.setValue('measurement_type', f.measurement_type === 'manual' ? 'manual' : 'calculated')
    gr.setValue('kpi_table', text('kpi_table', 80))
    gr.setValue('kpi_filter', text('kpi_filter', 4000))
    gr.setValue('kpi_aggregate', ['sum', 'avg'].indexOf(f.kpi_aggregate) > -1 ? f.kpi_aggregate : 'count')
    gr.setValue('period', ['quarterly', 'yearly'].indexOf(f.period) > -1 ? f.period : 'monthly')
    gr.setValue('expected_benefit', text('expected_benefit', 500))
    gr.setValue('important_objective', !!f.important_objective)
    gr.setValue('low_volume_expected', !!f.low_volume_expected)
    gr.setValue('target', Number(f.target))
    gr.setValue('kpi_field', isCalc && f.kpi_aggregate !== 'count' ? text('kpi_field', 80) : '')
    if (!isCalc && f.manual_value !== undefined) {
        if (manualValue !== String(num(gr, 'manual_value') === null ? '' : num(gr, 'manual_value')) || manualDate !== str(gr, 'manual_value_date')) {
            gr.setValue('manual_value', manualValue)
            gr.setValue('manual_value_date', manualDate)
        }
    }
    if (firstBaseline) gr.setValue('baseline', Number(f.baseline)) // baseline date is set by the business rule
    if (baselineChange) {
        const before = str(gr, 'baseline')
        gr.setValue('baseline', Number(f.baseline))
        gr.setValue('baseline_change_reason', ('Baseline changed from ' + before + ' to ' + Number(f.baseline) + ' by ' + gs.getUserDisplayName() + ' on ' + new GlideDateTime().getDisplayValue() + ': ' + changeReason).slice(0, 500))
    }
    // PIV-023.04 – warn (do not block) when the owner is inactive
    const ownerId = isNew ? '' : str(gr, 'owner')
    let ownerNote = ''
    if (ownerId) {
        const u = new GlideRecord('sys_user')
        if (u.get(ownerId) && !bool(u, 'active')) ownerNote = ' Owner is inactive – choose an active owner.'
    }
    if (isNew) {
        let owner = me
        if (admin && f.owner && f.owner !== me) {
            const u = new GlideRecord('sys_user')
            if (u.get(String(f.owner)) && bool(u, 'active')) owner = String(f.owner)
        }
        gr.setValue('owner', owner)
        const id = gr.insert()
        return id
            ? { ok: true, id: String(id), note: 'Outcome created. It will be measured in the next assessment run; until then it shows Not measured.' }
            : { ok: false, error: 'The outcome was not created. You may not have access, or a PIVOT rule stopped it.' }
    }
    const r = save(gr)
    if (r.ok) {
        r.id = gr.getUniqueValue()
        r.note = 'Saved.' + ownerNote
    }
    return r
}

function updateCapability(b: any): Result {
    if (!isRole('admin')) return deny('Only PIVOT admins can change measurement settings.')
    const gr = new GlideRecordSecure(T.capability)
    if (!gr.get(String(b.id || ''))) return { ok: false, error: 'This capability was not found.' }
    if (!gr.canWrite()) return deny('Only PIVOT admins can change measurement settings.')
    const f = b.fields || {}
    const e = validateCapability(f)
    if (!e.measure_table && f.measure_table && !new GlideRecord(String(f.measure_table)).isValid()) e.measure_table = 'Table ' + f.measure_table + ' does not exist on this instance.'
    if (hasErrors(e)) return invalid(e)
    if (f.family !== undefined) gr.setValue('product_family', String(f.family || ''))
    if (f.measure_table !== undefined) gr.setValue('measure_table', String(f.measure_table || ''))
    if (f.measure_filter !== undefined) gr.setValue('measure_filter', String(f.measure_filter || '').slice(0, 4000))
    if (f.date_field !== undefined) gr.setValue('date_field', String(f.date_field || ''))
    if (f.days_back !== undefined) gr.setValue('days_back', Number(f.days_back))
    if (f.weight !== undefined) gr.setValue('weight', Number(f.weight))
    if (f.target !== undefined) gr.setValue('target_value', f.target === '' || f.target === null ? '' : String(Number(f.target)))
    if (f.active !== undefined) gr.setValue('active', !!f.active)
    const r = save(gr)
    if (r.ok) r.note = 'Saved. New settings are used from the next assessment run.'
    return r
}

function mapFamily(b: any): Result {
    if (!isRole('admin')) return deny('Only PIVOT admins can map product families.')
    if (!FAMILIES.some((x) => x.value === b.family)) return { ok: false, error: 'Choose a product family.' }
    const ids: string[] = Array.isArray(b.ids) ? b.ids.slice(0, 500).map(String) : []
    let count = 0
    ids.forEach((id) => {
        const gr = new GlideRecordSecure(T.capability)
        if (gr.get(id) && gr.canWrite()) {
            gr.setValue('product_family', b.family)
            if (gr.update()) count++
        }
    })
    return count ? { ok: true, count } : { ok: false, error: 'No capabilities were changed.' }
}

function setProp(b: any): Result {
    if (!isRole('admin')) return deny('Only PIVOT admins can change PIVOT properties.')
    const short = String(b.name || '').replace(SCOPE + '.', '')
    const v = validateProperty(short, b.value, props())
    if (v.error) return { ok: false, error: v.error }
    gs.setProperty(SCOPE + '.' + short, String(v.value))
    return { ok: true, note: /threshold|days_back/.test(short) ? 'Applies from the next assessment run.' : 'Saved.' }
}

function runAction(b: any): Result {
    switch (String(b && b.action)) {
        case 'accept': return opportunityAction('accept', b)
        case 'reject': return opportunityAction('reject', b)
        case 'done': return opportunityAction('done', b)
        case 'start': return opportunityAction('start', b)
        case 'reopen': return opportunityAction('reopen', b)
        case 'assign': return opportunityAction('assign', b)
        case 'note': return opportunityAction('note', b)
        case 'scores': return opportunityAction('scores', b)
        case 'runNow': { // PIV-036 – PIVOT admins only; queued and run in the background by x_enno_pivot.run_assessment
            if (!isRole('admin')) return deny('Only PIVOT admins can start a run.')
            const r = startRunNow(gs.getUserID())
            return r.ok ? { ok: true, number: r.number, note: r.message } : { ok: false, error: r.message }
        }
        case 'reorder': return reorder(b)
        case 'resetRoadmap': return resetRoadmap()
        case 'saveOutcome': return saveOutcome(b.fields || {})
        case 'updateCapability': return updateCapability(b)
        case 'mapFamily': return mapFamily(b)
        case 'setProp': return setProp(b)
    }
    return { ok: false, error: 'Unknown action.' }
}

export function action(request: any, response: any) {
    try {
        const body = request.body ? request.body.data : null
        response.setStatus(200)
        response.setBody(runAction(body || {}) as any)
    } catch (ex) {
        gs.error('PIVOT workspace action failed: ' + ex)
        response.setStatus(500)
        response.setBody({ ok: false, error: 'PIVOT could not save the change. Ask your PIVOT admin to check the system log.' } as any)
    }
}
