import { Page, APIRequestContext, request, expect } from '@playwright/test'

// Shared helpers for the PIVOT UI tests (PIV-071). Credentials are read from the environment only.
export type Role = 'admin' | 'analyst' | 'business_owner' | 'viewer' | 'norole'

export const VIEWS = ['Dashboard', 'Analytics Studio', 'Element Map', 'Capability Library', 'Value & Opportunities',
    'Roadmap', 'Assessments', 'Reports', 'Settings', 'Help & Support'] as const

const ENV: Record<Role, [string, string]> = {
    admin: ['PIVOT_ADMIN_USER', 'PIVOT_ADMIN_PASSWORD'],
    analyst: ['PIVOT_ANALYST_USER', 'PIVOT_ANALYST_PASSWORD'],
    business_owner: ['PIVOT_OWNER_USER', 'PIVOT_OWNER_PASSWORD'],
    viewer: ['PIVOT_VIEWER_USER', 'PIVOT_VIEWER_PASSWORD'],
    norole: ['PIVOT_NOROLE_USER', 'PIVOT_NOROLE_PASSWORD'],
}

export function credentials(role: Role): { user: string; password: string } | null {
    const [u, p] = ENV[role]
    return process.env[u] && process.env[p] ? { user: process.env[u]!, password: process.env[p]! } : null
}

/** Signs in through login.do and opens the workspace. Skips the test when the role has no credentials. */
export async function signIn(page: Page, role: Role, view?: string) {
    const c = credentials(role)
    if (!c) throw new Error('No credentials for role ' + role + ' – set ' + ENV[role].join(' and '))
    await page.goto('/login.do')
    await page.locator('#user_name').fill(c.user)
    await page.locator('#user_password').fill(c.password)
    await page.locator('#sysverb_login').click()
    await page.waitForLoadState('domcontentloaded')
    await openWorkspace(page, view)
}

export async function openWorkspace(page: Page, view?: string) {
    const slug = view ? '?view=' + view.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : ''
    await page.goto('/x_enno_pivot_workspace.do' + slug)
    await expect(page.locator('button[data-view="Dashboard"]').first()).toBeVisible()
}

export async function goTo(page: Page, view: string) {
    await page.locator(`button[data-view="${view}"]`).first().click()
    await expect(page).toHaveTitle(new RegExp(view.replace(/[&]/g, '.')))
}

/** Table API as the admin, to create and remove the test records the action tests work on. */
export async function adminApi(): Promise<APIRequestContext> {
    const c = credentials('admin')
    if (!c) throw new Error('Admin credentials are needed to create test data')
    return request.newContext({
        baseURL: process.env.PIVOT_URL,
        httpCredentials: { username: c.user, password: c.password },
        extraHTTPHeaders: { Accept: 'application/json' },
    })
}

/** Creates a test capability and an open opportunity on it; returns their sys_ids and the opportunity number. */
export async function makeTestOpportunity(api: APIRequestContext, type = 'low_adoption') {
    const tag = '[UI TEST] ' + Date.now()
    const cap = await api.post('/api/now/table/x_enno_pivot_capability', {
        data: { name: tag, source: 'store_app', active: 'true', installed: 'true', target_value: '100' },
    })
    expect(cap.ok()).toBeTruthy()
    const capId = (await cap.json()).result.sys_id
    const opp = await api.post('/api/now/table/x_enno_pivot_opportunity?sysparm_fields=sys_id,number', {
        data: { capability: capId, type, state: 'open', value: '3', effort: '3', short_description: tag + ' opportunity' },
    })
    expect(opp.ok()).toBeTruthy()
    const o = (await opp.json()).result
    return { capId, oppId: o.sys_id as string, number: o.number as string }
}

/** Removes the test records again (the test created them, so the test removes them). */
export async function removeTestRecords(api: APIRequestContext, ids: { capId?: string; oppId?: string }) {
    if (ids.oppId) {
        const items = await api.get('/api/now/table/x_enno_pivot_roadmap_item?sysparm_fields=sys_id&sysparm_query=opportunity=' + ids.oppId)
        for (const r of (await items.json()).result || []) await api.delete('/api/now/table/x_enno_pivot_roadmap_item/' + r.sys_id)
        await api.delete('/api/now/table/x_enno_pivot_opportunity/' + ids.oppId)
    }
    if (ids.capId) await api.delete('/api/now/table/x_enno_pivot_capability/' + ids.capId)
}

/** True when the page has a horizontal page scroll. */
export async function hasHorizontalScroll(page: Page) {
    return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
}

/** Elements that run past the right edge without a scrollable parent (cut off or overlapping). */
export async function clippedElements(page: Page) {
    return page.evaluate(() => {
        const w = document.documentElement.clientWidth
        const out: string[] = []
        document.querySelectorAll('body *').forEach((e) => {
            const el = e as HTMLElement
            if (!el.offsetParent || el.getBoundingClientRect().right <= w + 1) return
            let p = el.parentElement, ok = false
            while (p && p !== document.body) {
                const s = getComputedStyle(p)
                if ((s.overflowX === 'auto' || s.overflowX === 'scroll') && p.getBoundingClientRect().right <= w + 1) { ok = true; break }
                p = p.parentElement
            }
            if (!ok) out.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ' "' + (el.textContent || '').trim().slice(0, 30) + '"')
        })
        return out
    })
}
