# PIVOT 1.0.0-rc – release notes

PIVOT (Platform Investment Value and Opportunity Tracker) is a scoped ServiceNow application (`x_enno_pivot`) that finds the ServiceNow products you have, measures how much they are used, links usage to business outcomes and turns the gaps into a ranked roadmap of opportunities.

## Included

**Discovery.** Licensed subscriptions (purchased and allocated counts), for-fee store apps and plugins become capabilities. Admin settings (product family, weight, measure table, target, linked app) are never overwritten. Items no longer found are flagged Not found and never deleted.

**Measurement and scoring.** Each capability is counted on its measure table, filter and look-back window. Score = actual ÷ target × 100, capped at 100. Licensed but not installed scores 0; missing table or target is Not Measured (left empty, never 0). Platform Value Score is the weighted average of the scored capabilities. Licence utilization = allocated ÷ purchased.

**Business outcomes.** KPIs measured by count, sum or average on a table, or entered by hand. The first value becomes the locked baseline; only admins change it, with a reason, and the change is audited. Improvement % and status (Improved, On Target, Below Target, Not Measured) on every run.

**Gap rules and opportunities.** Six rules: shelfware, idle licences, low adoption, not measured, weak outcome, adoption potential. Thresholds are properties. One opportunity per capability and gap type; Rejected and Done are never reopened by later runs. Priority = (value + business impact) ÷ effort, with the reason in plain words. States New → Accepted → In progress → Done, Rejected with a reason.

**Roadmap.** Now, Next and Later by priority, ordered inside each column, rebuilt by every run; analysts can move items.

**Assessment engine.** One run: discover, measure, score, outcomes, gaps, priority, roadmap, notify. Weekly job (Sunday 02:00) and Run Now for admins, one run at a time, time limit, step log, run emails to PIVOT admins.

**Workspace.** Ten views: Dashboard, Analytics Studio, Element Map, Capability Library, Value & Opportunities, Roadmap, Assessments, Reports, Settings, Help & Support. CSV exports, user and admin guides, REST API `/api/x_enno_pivot/v1/workspace`.

**AI features (Now Assist).** Explain this finding, run briefing, suggested scores and owners, draft action plan, Ask PIVOT inside the workspace. Suggestions only; every decision is logged in the AI log (admins only).

**Security.** Roles viewer, analyst, business owner, admin; 67 ACLs; PIVOT only reads platform tables (cross-scope privileges listed in SECURITY_NOTES.md).

**Testing.** ATF suite PIVOT Regression (Scoring, Gap Rules, Outcomes, Full run, Security) and Playwright browser tests for actions, accessibility, three screen widths, paging and exports.

## Changed in this release candidate

- A missing measure or KPI table is now named in the reason and the run log, for example "Measure table u_does_not_exist does not exist on this instance" (was "Measure table not found").

## Known issues

- At a window width of about 768 px (tablet portrait) the side menu stays beside the page instead of moving to the top, so the Settings panel overlaps its sub-menu and the Reports pager is cut off. Fine at 1024 px and wider. A layout fix needs approval because it changes the approved design.
- The Virtual Agent "Ask PIVOT" topic and the Now Assist panel skill are built in their designers on each instance (see the admin guide); they are not part of the application package.
- On instances with many old store-app records, the Linked app lookup and the outcome capability list show capabilities flagged Not found; clean these up before go-live.
- The "Needs mapping" dialog shows all capabilities without paging (2,199 on Dev) and takes a few seconds to open.
- Toast grammar: "1 capabilities mapped to …".
- Performance at the agreed production volumes is measured on the Test instance (PIV-048) before go-live.
