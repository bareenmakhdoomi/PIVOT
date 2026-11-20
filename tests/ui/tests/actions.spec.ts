import { test, expect } from '@playwright/test'
import { signIn, openWorkspace, goTo, adminApi, makeTestOpportunity, removeTestRecords, credentials } from './helpers'

// PIV-071.02 – the browser tests CI runs after each merge. The tests make their own [UI TEST] records through the
// Table API as the admin and remove them afterwards, so no real opportunity is changed.

test.describe('Opportunity actions as analyst @smoke', () => {
    let ids: { capId: string; oppId: string; number: string }
    test.beforeEach(async () => { ids = await makeTestOpportunity(await adminApi()) })
    test.afterEach(async () => { await removeTestRecords(await adminApi(), ids) })

    test('reject without a reason shows the error, with a reason sets Rejected', async ({ page }) => {
        test.skip(!credentials('analyst'), 'analyst credentials not set')
        await signIn(page, 'analyst')
        await page.goto('/x_enno_pivot_workspace.do?opp=' + ids.number)
        await page.locator('[data-action="toggleReject"]').first().click()
        await page.locator('#rejectForm button[type="submit"]').click()
        await expect(page.locator('#err-rejection_reason')).toContainText('Please enter a rejection reason')
        await page.locator('#f-rejection_reason').fill('UI test: not relevant for this capability')
        await page.locator('#rejectForm button[type="submit"]').click()
        await expect(page.getByText('Rejected. It will not be reopened automatically by later runs.')).toBeVisible()
        const api = await adminApi()
        const r = await api.get('/api/now/table/x_enno_pivot_opportunity/' + ids.oppId + '?sysparm_fields=state')
        expect((await r.json()).result.state).toBe('rejected')
    })

    test('editing scores changes the priority', async ({ page }) => {
        test.skip(!credentials('analyst'), 'analyst credentials not set')
        await signIn(page, 'analyst')
        await page.goto('/x_enno_pivot_workspace.do?opp=' + ids.number)
        await page.locator('#f-value').fill('5')
        await page.locator('#f-effort').fill('1')
        await expect(page.locator('#scoreForm .preview-line')).toContainText('5 ÷ 1 = 5')
        await page.locator('#scoreForm button[type="submit"]').click()
        const api = await adminApi()
        await expect.poll(async () => (await (await api.get('/api/now/table/x_enno_pivot_opportunity/' + ids.oppId + '?sysparm_fields=priority')).json()).result.priority).toBe('5')
    })

    test('roadmap: an item moves inside its column', async ({ page }) => {
        test.skip(!credentials('analyst'), 'analyst credentials not set')
        await signIn(page, 'analyst', 'Roadmap')
        const down = page.locator('[data-move="down"]:not([disabled])').first()
        test.skip(await down.count() === 0, 'no roadmap column with two items yet – run an assessment first')
        const num = await down.getAttribute('data-num')
        await down.click()
        await expect(page.locator(`[data-move="up"][data-num="${num}"]`)).toBeEnabled()
    })
})

test.describe('Run Now', () => {
    test('is refused for a viewer (no Run Now button)', async ({ page }) => {
        test.skip(!credentials('viewer'), 'viewer credentials not set')
        await signIn(page, 'viewer', 'Assessments')
        await expect(page.locator('[data-action="runNow"]:not([disabled])')).toHaveCount(0)
    })

    test('as admin, the run completes', async ({ page }) => {
        test.skip(!credentials('admin') || process.env.PIVOT_SKIP_RUN === '1', 'admin credentials not set or full run skipped')
        test.setTimeout(20 * 60_000) // a full assessment run takes a few minutes
        await signIn(page, 'admin', 'Assessments')
        await page.locator('[data-action="runNow"]').first().click()
        const start = page.locator('[data-action="startRun"]')
        if (await start.count()) await start.first().click() // confirmation dialog
        const api = await adminApi()
        let last = ''
        await expect.poll(async () => {
            const r = await api.get('/api/now/table/x_enno_pivot_assessment?sysparm_fields=number,status&sysparm_limit=1&sysparm_query=ORDERBYDESCsys_created_on')
            const a = (await r.json()).result[0]
            last = a.number + ' ' + a.status
            return a.status
        }, { timeout: 18 * 60_000, intervals: [10_000] }).toMatch(/^complete/)
        test.info().annotations.push({ type: 'run', description: last })
    })
})

test.describe('Outcome and settings validation', () => {
    test('a new outcome with missing fields shows errors', async ({ page }) => {
        test.skip(!credentials('business_owner'), 'business owner credentials not set')
        await signIn(page, 'business_owner', 'Value & Opportunities')
        await page.locator('[data-out="new"]').first().click()
        await page.locator('form button[type="submit"]').last().click()
        await expect(page.locator('[id^="err-"]').first()).toBeVisible()
        await expect(page.locator('#err-kpi')).toContainText('Name the KPI')
    })

    test('an invalid setting shows an error and is not saved', async ({ page }) => {
        test.skip(!credentials('admin'), 'admin credentials not set')
        await signIn(page, 'admin', 'Settings')
        const field = page.locator('[data-prop="utilization_threshold"]')
        await field.fill('150')
        await page.locator('[data-action="saveSettings"]').first().click()
        await expect(page.getByText(/value(s)? not saved\. See the messages\./)).toBeVisible()
        await page.locator('[data-action="discardSettings"]').first().click()
    })

    test('a viewer has no Settings view', async ({ page }) => {
        test.skip(!credentials('viewer'), 'viewer credentials not set')
        await signIn(page, 'viewer')
        await expect(page.locator('button[data-view="Settings"]')).toHaveCount(0)
    })
})

test('a user without a PIVOT role cannot use the workspace', async ({ page }) => {
    test.skip(!credentials('norole'), 'no-role credentials not set')
    await signIn(page, 'norole').catch(() => undefined)
    await openWorkspace(page).catch(() => undefined)
    await expect(page.locator('[data-action="runNow"], [data-action="saveSettings"]')).toHaveCount(0)
})

test('views open without an error for each role @smoke', async ({ page }) => {
    for (const role of ['admin', 'analyst', 'business_owner', 'viewer'] as const) {
        if (!credentials(role)) continue
        const errors: string[] = []
        page.on('pageerror', (e) => errors.push(role + ': ' + e.message))
        await page.context().clearCookies()
        await signIn(page, role)
        const views = await page.locator('nav button[data-view], .navbtn[data-view]').evaluateAll((b) => [...new Set(b.map((x) => x.getAttribute('data-view')))])
        for (const v of views) await goTo(page, v as string)
        expect(errors, 'script errors while opening the views').toEqual([])
    }
})
