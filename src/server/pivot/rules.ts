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
