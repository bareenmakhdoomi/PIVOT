import { test, expect, Page } from '@playwright/test'
import { signIn, goTo, credentials } from './helpers'
import * as fs from 'fs'

// PIV-071.05 – paged tables: stepping through every page shows each row once and the rows add up to the total.
// CSV exports: the row count matches the view.

async function walkPages(page: Page) {
    const pager = page.locator('.pager').first()
    const info = await pager.locator('.pager-info').textContent()
    const m = /of\s+([\d,]+)/.exec(info || '')
    const total = m ? Number(m[1].replace(/,/g, '')) : 0
    const seen = new Set<string>()
    let dup = 0, guard = 0
    while (guard++ < 500) {
        const keys = await page.locator('tr.rowlink').evaluateAll((rows) => rows.map((r) => r.getAttribute('data-opp') || r.getAttribute('data-cap') || r.textContent?.trim().slice(0, 80) || ''))
        keys.forEach((k) => { if (seen.has(k)) dup++; seen.add(k) })
        const next = pager.locator('[data-step="next"]:not([disabled]), [data-action="nextPage"]:not([disabled])').first()
        if (!(await next.count())) break
        await next.click()
        await page.waitForTimeout(300)
    }
    return { total, rows: seen.size, dup }
}

test('Value & Opportunities: pages add up to the total, no row twice', async ({ page }) => {
    test.skip(!credentials('analyst'), 'analyst credentials not set')
    test.setTimeout(5 * 60_000)
    await signIn(page, 'analyst', 'Value & Opportunities')
    test.skip(!(await page.locator('.pager').count()), 'five rows or fewer – no pager')
    const r = await walkPages(page)
    expect(r.dup, 'rows shown twice').toBe(0)
    expect(r.rows).toBe(r.total)
})

test('Reports: pages add up to the total, no row twice', async ({ page }) => {
    test.skip(!credentials('admin'), 'admin credentials not set')
    await signIn(page, 'admin', 'Reports')
    test.skip(!(await page.locator('.pager').count()), 'five rows or fewer – no pager')
    const r = await walkPages(page)
    expect(r.dup, 'rows shown twice').toBe(0)
    expect(r.rows).toBe(r.total)
})

test('capability CSV row count matches the view and the user access', async ({ page }) => {
    for (const role of ['admin', 'viewer'] as const) {
        if (!credentials(role)) continue
        await page.context().clearCookies()
        await signIn(page, role, 'Analytics Studio')
        const dl = page.waitForEvent('download')
        await page.locator('[data-action="exportCaps"]').first().click()
        const file = await (await dl).path()
        const lines = fs.readFileSync(file!, 'utf8').trim().split(/\r?\n/)
        expect(lines[0]).toContain('Number')
        const shown = await page.evaluate(() => (window as any).PIVOT_STORE?.capabilities?.({ view: 'all' })?.length ?? null)
        if (shown !== null) expect(lines.length - 1, role + ': CSV rows = capabilities in the view').toBe(shown)
        expect(lines.length - 1, role + ': CSV has rows').toBeGreaterThan(0)
    }
})
