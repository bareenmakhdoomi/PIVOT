# PIVOT UI tests (PIV-071)

Browser tests for the PIVOT workspace, written with Playwright and axe. They run against a real instance (Dev after each merge, Test before release). Every test that changes data makes its own `[UI TEST]` records through the Table API as the admin and removes them afterwards.

## Run it on your PC

```powershell
cd tests\ui
npm install
npx playwright install chromium
$env:PIVOT_URL = "https://enablenowincdemo1.service-now.com"
$env:PIVOT_ADMIN_USER = "pivot.admin"
$env:PIVOT_ADMIN_PASSWORD = "<type it here, never commit it>"
npx playwright test
npx playwright show-report
```

Set the other pairs the same way: `PIVOT_ANALYST_*`, `PIVOT_OWNER_*`, `PIVOT_VIEWER_*`, `PIVOT_NOROLE_*`. A test whose role has no user set is skipped. Set `PIVOT_SKIP_RUN=1` to leave out the full Run Now test (it takes a few minutes).

In CI the same names are repository secrets. The workflow is in `tests/ui/ci/pivot-ui-tests.yml`: copy it to `.github/workflows/` at the root of the repository (Claude cannot write into `.github`). A failing step leaves a screenshot, a trace and a video in the `pivot-ui-test-results` artifact.

## Test plan per view and role (PIV-071.01)

| View | Admin | Analyst | Business owner | Viewer | No role | Empty state | Paging | Actions tested |
|---|---|---|---|---|---|---|---|---|
| Dashboard | opens, no errors | opens | opens | opens | refused | "No assessment has completed yet" (check by hand on a clean instance) | – | Run Now (admin) |
| Analytics Studio | opens, CSV | opens | opens | opens, CSV | refused | as Dashboard | – | Export CSV row count |
| Element Map | opens | opens | opens | opens | refused | as Dashboard | – | – |
| Capability Library | opens, Needs mapping button | opens, no mapping | opens | opens | refused | empty filter text (by hand) | one record per page | mapping (Sprint 2 tests) |
| Value & Opportunities | opens | accept, reject, scores | new outcome | read-only | refused | no opportunities text (by hand) | stepped through, no duplicates | reject without/with reason, edit scores, new outcome errors |
| Roadmap | opens | move up/down | read-only | read-only | refused | empty column text (by hand) | "show more" per column | move inside a column |
| Assessments | Run Now | no Run Now | no Run Now | no Run Now | refused | no runs text (by hand) | paged | Run Now completes / refused |
| Reports | opens | opens | opens | opens | refused | – | stepped through | – |
| Settings | edit, invalid value refused | not shown | not shown | not shown | refused | – | – | invalid value shows the error |
| Help & Support | opens | opens | opens | opens | refused | – | – | – |

Accessibility (axe, WCAG 2.1 AA, serious and critical fail the test), keyboard reach of every view, three widths (1440, 1024, 768) and the 3-second view time run for the admin. The architect confirms the table before the suite is marked complete.

## Files

| File | Story | What it checks |
|---|---|---|
| `tests/actions.spec.ts` | 071.02 | reject without reason shows "Please enter a rejection reason", reject with reason sets Rejected, edit scores changes priority, roadmap move, Run Now as admin completes, Run Now not offered to a viewer, new outcome with missing fields shows errors, invalid setting shows an error, viewer has no Settings, no-role user, every view opens for every role without a script error |
| `tests/a11y.spec.ts` | 071.03 | axe on every view; keyboard focus ring and Enter on every nav button |
| `tests/responsive.spec.ts` | 071.04 | no page scroll and nothing cut off at 1440, 1024 and 768 px; screenshots of every view |
| `tests/pagination-export.spec.ts` | 071.05 | paged tables add up to the total with no duplicate rows; CSV row count for admin and viewer |
| `tests/performance.spec.ts` | 071.06 | every view usable within 3 s (run on Test after the PIV-048 data load) |
