import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { signIn, goTo, VIEWS, credentials } from './helpers'

// PIV-071.03 – automated accessibility audit of every view (WCAG 2.1 A/AA rules). Serious and critical issues fail
// the test; moderate and minor ones are attached to the report for the manual keyboard and screen-reader check.
test('no serious or critical accessibility issues in any view (admin)', async ({ page }, info) => {
    test.skip(!credentials('admin'), 'admin credentials not set')
    test.setTimeout(10 * 60_000)
    await signIn(page, 'admin')
    const problems: string[] = []
    for (const v of VIEWS) {
        await goTo(page, v)
        await page.waitForTimeout(1000)
        const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
        await info.attach('axe-' + v, { body: JSON.stringify(r.violations, null, 2), contentType: 'application/json' })
        r.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')
            .forEach((x) => problems.push(v + ': ' + x.id + ' (' + x.impact + ', ' + x.nodes.length + ' elements) – ' + x.help))
    }
    expect(problems, problems.join('\n')).toEqual([])
})

test('keyboard: every view can be reached and the focus is visible', async ({ page }) => {
    test.skip(!credentials('admin'), 'admin credentials not set')
    await signIn(page, 'admin')
    for (const v of VIEWS) {
        const b = page.locator(`button[data-view="${v}"]`).first()
        await b.focus()
        const outline = await b.evaluate((e) => { const s = getComputedStyle(e); return s.outlineStyle !== 'none' || s.boxShadow !== 'none' })
        expect(outline, v + ' nav button shows a focus ring').toBeTruthy()
        await page.keyboard.press('Enter')
        await expect(page).toHaveTitle(new RegExp(v.replace(/&/g, '.')))
    }
})
