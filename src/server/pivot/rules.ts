// PIVOT business rules shared by the workspace REST API and the table business rules (design B6).
// Pure functions only – no Glide APIs – so the same checks run everywhere.

export const SCOPE = 'x_enno_pivot'

export const FAMILIES = [
    { value: 'itsm', label: 'ITSM' },
    { value: 'itom', label: 'ITOM' },
    { value: 'itam', label: 'ITAM' },
    { value: 'hrsd', label: 'HRSD' },
    { value: 'csm', label: 'CSM' },
    { value: 'secops', label: 'SecOps' },
    { value: 'spm', label: 'SPM' },
    { value: 'platform', label: 'Platform' },
    { value: 'other', label: 'Other' },
]

export type Errors = { [field: string]: string }

const isBlank = (v: unknown) => v === undefined || v === null || String(v).trim() === ''
const isWhole = (n: number) => Math.floor(n) === n

export function round2(n: number) {
    return Math.round(n * 100) / 100
}

/** Priority = (value + business impact) ÷ effort, two decimals (B6). */
export function priorityOf(value: number, impact: number, effort: number) {
    return round2((value + impact) / effort)
}

/** Plain-language reason stored with the priority, e.g. "(3 + 2) ÷ 2 = 2.5 – low effort". */
export function priorityReason(value: number, impact: number, effort: number, priority: number) {
    const words: string[] = []
    if (value >= 4) words.push('high value')
    else if (value <= 2) words.push('low value')
    if (effort <= 2) words.push('low effort')
    else if (effort >= 4) words.push('high effort')
    if (impact === 0) words.push('no outcome data yet, so no business impact counted')
    return '(' + value + ' + ' + impact + ') ÷ ' + effort + ' = ' + String(round2(priority)) + (words.length ? ' – ' + words.join(', ') : '')
}

export function validateScores(value: unknown, impact: unknown, effort: unknown): Errors {
    const e: Errors = {}
    const v = Number(value), i = Number(impact), ef = Number(effort)
    if (isBlank(value) || !(v >= 1 && v <= 5 && isWhole(v))) e.value = 'Value is a whole number from 1 to 5.'
    if (isBlank(impact) || !(i >= 0 && i <= 5 && isWhole(i))) e.business_impact = 'Business impact is a whole number from 0 to 5.'
    if (isBlank(effort) || !(ef >= 1 && ef <= 5 && isWhole(ef))) e.effort = 'Effort is a whole number from 1 to 5.'
    return e
}

export function validateRejection(reason: unknown): Errors {
    return !reason || String(reason).trim().length < 10
        ? { rejection_reason: 'Enter a reason of at least 10 characters. It is required to reject (UI policy).' }
        : {}
}

export const TABLE_NAME = /^[a-z0-9_]+$/

export function validateCapability(f: { [k: string]: unknown }): Errors {
    const e: Errors = {}
    if (!isBlank(f.measure_table) && !TABLE_NAME.test(String(f.measure_table))) e.measure_table = 'Use a table name such as incident or sc_req_item.'
    if (!isBlank(f.date_field) && !TABLE_NAME.test(String(f.date_field))) e.date_field = 'Use a field name such as sys_created_on.'
    if (f.days_back !== undefined) {
        const d = Number(f.days_back)
        if (isBlank(f.days_back) || !(d >= 1 && d <= 365 && isWhole(d))) e.days_back = 'Enter 1 to 365 days.'
    }
    if (!isBlank(f.target) && !(Number(f.target) > 0)) e.target = 'Enter a number above 0, or leave empty for Not Measured.'
    if (f.weight !== undefined) {
        const w = Number(f.weight)
        if (isBlank(f.weight) || !(w >= 1 && w <= 5 && isWhole(w))) e.weight = 'Enter a weight from 1 to 5.'
    }
    if (!isBlank(f.family) && !FAMILIES.some((x) => x.value === f.family)) e.family = 'Choose a product family.'
    return e
}

export function validateOutcome(f: { [k: string]: unknown }): Errors {
    const e: Errors = {}
    if (isBlank(f.capability)) e.capability = 'Choose the capability this outcome measures.'
    if (isBlank(f.objective) || String(f.objective).trim().length < 5) e.objective = 'Describe what the business wants (at least 5 characters).'
    if (isBlank(f.kpi)) e.kpi = 'Name the KPI, for example "Average days to resolve".'
    if (isBlank(f.target) || isNaN(Number(f.target))) e.target = 'Enter a numeric target.'
    if (f.measurement_type === 'calculated' && (isBlank(f.kpi_table) || !TABLE_NAME.test(String(f.kpi_table))))
        e.kpi_table = 'Calculated KPIs need a table name, e.g. incident.'
    if (!isBlank(f.baseline) && isNaN(Number(f.baseline))) e.baseline = 'Enter a number.'
    if (!isBlank(f.direction) && f.direction !== 'higher_better' && f.direction !== 'lower_better') e.direction = 'Choose a direction.'
    if (!isBlank(f.measurement_type) && f.measurement_type !== 'calculated' && f.measurement_type !== 'manual') e.measurement_type = 'Choose a measurement type.'
    if (!isBlank(f.kpi_aggregate) && ['count', 'sum', 'avg'].indexOf(String(f.kpi_aggregate)) < 0) e.kpi_aggregate = 'Choose count, sum or average.'
    if (!isBlank(f.period) && ['monthly', 'quarterly', 'yearly'].indexOf(String(f.period)) < 0) e.period = 'Choose a period.'
    return e
}

/** PIVOT properties the workspace may read and an admin may change (design B7). */
export const PROPERTIES: { [name: string]: { type: 'number' | 'string' | 'boolean'; def: string } } = {
    utilization_threshold: { type: 'number', def: '60' },
    low_score_threshold: { type: 'number', def: '40' },
    high_usage_threshold: { type: 'number', def: '70' },
    default_days_back: { type: 'number', def: '30' },
    priority_now: { type: 'number', def: '2' },
    priority_next: { type: 'number', def: '1' },
    slow_capability_seconds: { type: 'number', def: '60' },
    admin_group: { type: 'string', def: 'PIVOT Admins' },
    ai_enabled: { type: 'boolean', def: 'true' },
    max_run_minutes: { type: 'number', def: '30' },
    timing_log: { type: 'boolean', def: 'false' },
}

/** Validates one property change. `current` holds the other current values (short names). */
export function validateProperty(short: string, value: unknown, current: { [k: string]: string }): { error?: string; value?: string } {
    const p = PROPERTIES[short]
    if (!p) return { error: 'Unknown property.' }
    if (p.type === 'boolean') return { value: value === true || value === 'true' ? 'true' : 'false' }
    if (p.type === 'string') return isBlank(value) ? { error: 'Enter a value.' } : { value: String(value).trim().slice(0, 100) }
    const n = Number(value)
    if (isBlank(value) || isNaN(n)) return { error: 'Enter a number.' }
    if (/threshold/.test(short) && (n < 0 || n > 100)) return { error: 'Enter a value from 0 to 100.' }
    if ((short === 'default_days_back') && !(n >= 1 && n <= 365 && isWhole(n))) return { error: 'Enter 1 to 365 days.' }
    if ((short === 'slow_capability_seconds') && !(n >= 1 && n <= 3600 && isWhole(n))) return { error: 'Enter 1 to 3600 seconds.' }
    if ((short === 'max_run_minutes') && !(n >= 0 && n <= 1440 && isWhole(n))) return { error: 'Enter 0 to 1440 minutes (0 = no limit).' }
    if (short === 'priority_next' && !(n > 0)) return { error: 'Enter a number above 0.' }
    if (short === 'priority_next' && n >= Number(current.priority_now)) return { error: 'Must be lower than "Priority for Now" (' + current.priority_now + ').' }
    if (short === 'priority_now' && n <= Number(current.priority_next)) return { error: 'Must be higher than "Priority for Next" (' + current.priority_next + ').' }
    return { value: String(n) }
}

/** Initials for the avatar, e.g. "Muslim Altaf Khan" → "MK". */
export function initialsOf(name: string) {
    const w = String(name || '?').trim().split(/\s+/)
    return ((w[0] || '?').charAt(0) + (w.length > 1 ? w[w.length - 1].charAt(0) : '')).toUpperCase()
}

/** Product family from the ServiceNow line of business (ua_app_family.lob_name). Empty = Needs mapping. */
const LOB_FAMILY: { [lob: string]: string } = {
    'IT Service Management': 'itsm',
    'IT Operations Management': 'itom',
    'IT Asset Management': 'itam',
    'Software Asset Management': 'itam',
    'Human Resources': 'hrsd',
    'Customer Service Management': 'csm',
    'Field Service Management': 'csm',
    'Security': 'secops',
    'Security Operations': 'secops',
    'Strategic Portfolio Management': 'spm',
    'Now Platform': 'platform',
    'App Engine': 'platform',
    'Automation Engine': 'platform',
    'Now Intelligence': 'platform',
    'Now Platform Security': 'platform',
}
export function familyFromLob(lob: string): string {
    if (!lob) return ''
    return LOB_FAMILY[lob] || 'other'
}

// ---------------------------------------------------------------- Sprint 3: scoring (design B6)
export type ScoreResult = { status: 'measured' | 'not_measured' | 'not_installed'; score: number | null; reason: string }

/** Score = actual ÷ target × 100, capped at 100 and rounded; licensed-not-installed = 0; missing data = Not Measured (empty, never 0). */
export function scoreOf(c: { licensed: boolean; installed: boolean; target: number | null }, actual: number | null, notMeasuredReason?: string): ScoreResult {
    if (c.licensed && !c.installed) return { status: 'not_installed', score: 0, reason: 'Licensed but not installed' }
    if (notMeasuredReason) return { status: 'not_measured', score: null, reason: notMeasuredReason }
    if (actual === null || actual === undefined || isNaN(actual)) return { status: 'not_measured', score: null, reason: 'No measured value' }
    if (c.target === null || c.target === undefined || !(c.target > 0)) return { status: 'not_measured', score: null, reason: 'No target set' }
    const raw = (actual / c.target) * 100
    return { status: 'measured', score: Math.round(Math.min(100, raw)), reason: raw >= 100 ? 'At or above target (capped at 100)' : 'Actual ÷ target × 100' }
}

/** Utilization = allocated ÷ purchased × 100, rounded, not capped; empty without a purchased count. */
export function utilizationOf(entitled: number | null, allocated: number | null): { utilization: number | null; overAllocated: boolean } {
    if (!entitled || !(entitled > 0)) return { utilization: null, overAllocated: false }
    const u = Math.round(((allocated || 0) / entitled) * 100)
    return { utilization: u, overAllocated: u > 100 }
}

/** Platform Value Score = Σ(score × weight) ÷ Σ(weight); Not Measured and weight 0 are left out; empty when nothing is scored. */
export function overallScore(rows: { score: number | null; weight: number | null }[]): number | null {
    let sum = 0, w = 0
    rows.forEach((r) => {
        const weight = r.weight === null || r.weight === undefined || isNaN(r.weight) ? 1 : r.weight
        if (r.score === null || r.score === undefined || !(weight > 0)) return
        sum += r.score * weight
        w += weight
    })
    return w ? Math.round(sum / w) : null
}

/** Outcome status from baseline, target and the measured value (design B6). */
export function outcomeStatus(o: { baseline: number | null; target: number | null; direction: string }, actual: number | null): { status: string; improvement: number | null; reason: string } {
    if (actual === null || actual === undefined || isNaN(actual)) return { status: 'not_measured', improvement: null, reason: 'No measured value' }
    if (o.baseline === null || o.baseline === undefined) return { status: 'not_measured', improvement: null, reason: 'No baseline captured yet' }
    if (o.target === null || o.target === undefined) return { status: 'not_measured', improvement: null, reason: 'No target set' }
    const span = o.target - o.baseline
    const imp = span === 0 ? null : Math.round(((actual - o.baseline) / span) * 1000) / 10
    const reached = o.direction === 'lower_better' ? actual <= o.target : actual >= o.target
    return { status: reached ? 'on_target' : imp !== null && imp > 0 ? 'improved' : 'below_target', improvement: imp, reason: '' }
}

/** Look-back window for a KPI period. */
export function periodDays(period: string): number {
    return period === 'yearly' ? 365 : period === 'quarterly' ? 90 : 30
}

/** PIV-015 – proposed starter measurement settings for well-known capabilities, keyed by source ID (plugin ID or app scope).
 *  Discovery applies them once, only when the capability has no measure table and no target yet; admins can change them.
 *  Targets are proposals per look-back window and must be confirmed with the product SMEs (PIV-015.02 / .08). */
export const SEED_MEASURES: { [sourceId: string]: { table: string; filter: string; dateField: string; days: number; target: number } } = {
    'com.snc.incident': { table: 'incident', filter: '', dateField: 'sys_created_on', days: 30, target: 500 },
    'com.snc.problem': { table: 'problem', filter: '', dateField: 'sys_created_on', days: 30, target: 20 },
    'com.snc.change_management': { table: 'change_request', filter: '', dateField: 'sys_created_on', days: 30, target: 50 },
    'com.glideapp.servicecatalog': { table: 'sc_req_item', filter: '', dateField: 'sys_created_on', days: 30, target: 300 },
    'com.snc.incident.mim': { table: 'incident', filter: 'major_incident_state=accepted', dateField: 'sys_created_on', days: 90, target: 3 },
    'com.snc.change_management.cab': { table: 'cab_meeting', filter: '', dateField: 'sys_created_on', days: 90, target: 12 },
    'com.snc.asset_management': { table: 'alm_asset', filter: '', dateField: 'sys_created_on', days: 30, target: 50 },
    'sn_customerservice': { table: 'sn_customerservice_case', filter: '', dateField: 'sys_created_on', days: 30, target: 200 },
    'com.snc.conversation_builder': { table: 'sys_cs_conversation', filter: '', dateField: 'sys_created_on', days: 30, target: 300 },
    'com.snc.project_management_v3': { table: 'pm_project', filter: '', dateField: 'sys_created_on', days: 90, target: 10 },
    'com.snc.resource_management': { table: 'resource_plan', filter: '', dateField: 'sys_created_on', days: 90, target: 20 },
    'com.snc.time_card': { table: 'time_card', filter: '', dateField: 'sys_created_on', days: 30, target: 100 },
    'com.snc.sdlc.agile.2.0': { table: 'rm_story', filter: '', dateField: 'sys_created_on', days: 30, target: 50 },
    'com.snc.service-watch': { table: 'em_alert', filter: '', dateField: 'sys_created_on', days: 30, target: 500 },
}
