import { test, expect } from '@playwright/test'
import { signIn, VIEWS, credentials } from './helpers'

// PIV-071.06 – each view is usable within 3 seconds. Run it on an instance with at least 500 capabilities,
// 200 opportunities and 50 runs (the Test instance after the PIV-048 data load). Timings go to the report.
test('every view is usable within 3 seconds', async ({ page }, info) => {
    test.skip(!credentials('admin'), 'admin credentials not set')
    test.setTimeout(5 * 60_000)
    await signIn(page, 'admin')
    const times: string[] = []
    const slow: string[] = []
    for (const v of VIEWS) {
        const t0 = Date.now()
        await page.locator(`button[data-view="${v}"]`).first().click()
        await expect(page).toHaveTitle(new RegExp(v.replace(/&/g, '.')))
        await page.locator('main h1, h1').first().waitFor()
        const ms = Date.now() - t0
        times.push(v + ': ' + ms + ' ms')
        if (ms > 3000) slow.push(v + ' ' + ms + ' ms')
    }
    const t0 = Date.now()
    await page.reload()
    await page.locator('button[data-view="Dashboard"]').first().waitFor()
    times.push('Full reload to Dashboard: ' + (Date.now() - t0) + ' ms')
    await info.attach('view timings', { body: times.join('\n') })
    expect(slow, 'views slower than 3 s').toEqual([])
})
