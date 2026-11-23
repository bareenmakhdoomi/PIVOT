import '@servicenow/sdk/global'
import { TestSuite } from '@servicenow/sdk/core'
import { s7ScoringRules, s7ScoringRun } from './sprint7-scoring-tests.now'
import { s7GapRules, s7GapRecords, s7OutcomeRules, s7OutcomeRun } from './sprint7-gap-outcome-tests.now'
import { s7FullRun, s7SecurityViewer, s7SecurityAnalyst, s7SecurityOwner, s7SecurityAdmin, s7SecurityNoRole } from './sprint7-fullrun-security-tests.now'

// PIV-044.08 / PIV-045.08 / PIV-046.07 – one parent suite with a child suite per area. Run "PIVOT Regression" to run them all.
// Quick rule tests come first in each child suite; the tests with a full assessment run (a few minutes each) come last.

export const pivotRegression = TestSuite({
    $id: Now.ID['atf-suite-pivot-regression'],
    name: 'PIVOT Regression',
    description: 'All PIVOT regression tests: Scoring, Gap Rules, Outcomes, Full run and Security (Sprint 7, PIV-044 to PIV-046). Run before every release and after every upgrade.',
    active: true,
})

export const scoringSuite = TestSuite({
    $id: Now.ID['atf-suite-pivot-scoring'],
    name: 'PIVOT Regression – Scoring',
    description: 'PIV-044: score = actual ÷ target, cap at 100, licensed not installed = 0, Not Measured, Platform Value Score and utilization.',
    parent: pivotRegression,
    tests: [s7ScoringRules, s7ScoringRun],
})

export const gapSuite = TestSuite({
    $id: Now.ID['atf-suite-pivot-gap-rules'],
    name: 'PIVOT Regression – Gap Rules',
    description: 'PIV-045.01–.05: idle licences, shelfware, low adoption, not measured, weak outcome, adoption potential; no duplicates; Rejected and Done stay closed.',
    parent: pivotRegression,
    tests: [s7GapRules, s7GapRecords],
})

export const outcomeSuite = TestSuite({
    $id: Now.ID['atf-suite-pivot-outcomes'],
    name: 'PIVOT Regression – Outcomes',
    description: 'PIV-045.06–.07: improvement %, Improved / On Target / Below Target, missing KPI value or table = Not Measured.',
    parent: pivotRegression,
    tests: [s7OutcomeRules, s7OutcomeRun],
})

export const fullRunSuite = TestSuite({
    $id: Now.ID['atf-suite-pivot-full-run'],
    name: 'PIVOT Regression – Full run',
    description: 'PIV-046.01–.03: Queued → Running → Complete, results, opportunities and roadmap, log order, missing table.',
    parent: pivotRegression,
    tests: [s7FullRun],
})

export const securitySuite = TestSuite({
    $id: Now.ID['atf-suite-pivot-security'],
    name: 'PIVOT Regression – Security',
    description: 'PIV-046.04–.06: viewer, analyst, business owner, admin and a user without a PIVOT role.',
    parent: pivotRegression,
    tests: [s7SecurityViewer, s7SecurityAnalyst, s7SecurityOwner, s7SecurityAdmin, s7SecurityNoRole],
})
