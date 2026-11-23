import { test, expect } from '@playwright/test'
import { signIn, goTo, VIEWS, credentials, hasHorizontalScroll, clippedElements } from './helpers'

// PIV-071.04 – every view at three widths: no horizontal page scroll and nothing cut off or overlapping.
// Wide tables may scroll inside their own box; that is allowed.
for (const width of [1440, 1024, 768]) {
    test(`views at ${width}px`, async ({ page }, info) => {
        test.skip(!credentials('admin'), 'admin credentials not set')
        test.setTimeout(5 * 60_000)
        await page.setViewportSize({ width, height: 900 })
        await signIn(page, 'admin')
        const problems: string[] = []
        for (const v of VIEWS) {
            await goTo(page, v)
            await page.waitForTimeout(800)
            if (await hasHorizontalScroll(page)) problems.push(v + ': horizontal page scroll')
            const cut = await clippedElements(page)
            if (cut.length) problems.push(v + ': ' + cut.length + ' element(s) cut off, e.g. ' + cut.slice(0, 3).join(', '))
            await page.screenshot({ path: `results/responsive/${width}-${v.replace(/[^a-z]+/gi, '-')}.png`, fullPage: true })
        }
        await info.attach('problems', { body: problems.join('\n') || 'none' })
        expect(problems, problems.join('\n')).toEqual([])
    })
}
