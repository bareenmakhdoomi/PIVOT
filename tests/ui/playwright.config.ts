import { defineConfig } from '@playwright/test'

// PIV-071 – PIVOT workspace browser tests. Set PIVOT_URL (e.g. https://<instance>.service-now.com) and the
// user/password pairs in the environment or CI secrets. Nothing secret is stored in this folder.
export default defineConfig({
    testDir: './tests',
    timeout: 120_000,
    expect: { timeout: 15_000 },
    fullyParallel: false, // the action tests share one instance; run them one at a time
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'results/junit.xml' }]],
    use: {
        baseURL: process.env.PIVOT_URL,
        screenshot: 'only-on-failure', // PIV-071.02 AC 2 – a failing step leaves a screenshot
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        viewport: { width: 1440, height: 900 },
    },
    outputDir: 'results/artifacts',
})
