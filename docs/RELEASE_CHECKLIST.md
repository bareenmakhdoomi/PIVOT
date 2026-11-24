# PIVOT release checklist

Complete this checklist for every release candidate. A release is not ready for approval while any item below is unresolved.

## Security and cross-scope privileges

- [ ] Compare all `CrossScopePrivilege` declarations and instance-created cross-scope access used by this release with the register in [`SECURITY_NOTES.md`](./SECURITY_NOTES.md).
- [ ] Confirm every entry identifies its target table/API, target scope, operation, status, and business reason.
- [ ] For each new, removed, or changed entry, update `SECURITY_NOTES.md` in the same change before requesting release approval.
- [ ] Verify each privilege is least-privilege and has an approved use; investigate entries no longer used (including declared but unused entries) and record the disposition.
- [ ] For any new configurable Measure table, confirm access is explicitly approved and documented; do not assume configuring a table grants cross-scope access.
- [ ] Record the security review outcome in the release/PR record. Do not approve the release until the source declarations and security notes agree.

## Build and deployment

- [ ] Run `npm run build` and confirm it succeeds.
- [ ] Deploy only to the intended instance and scope after approvals.
- [ ] Verify the release behavior and check ServiceNow for unexpected cross-scope access requests or grants.

## Release candidate 1.0.0-rc (PIV-049)

### Before publishing (PIV-049.01)

- [ ] Main branch is up to date and `Remove-Item -Recurse -Force dist`, then `npm run build`, passes.
- [ ] Version is 1.0.0-rc. **Careful:** the server modules are loaded by a path that contains the package version, `x_enno_pivot/pivot/0.0.1/src/server/pivot/...` (33 places in 12 source files, including every ATF test). Changing `version` in `package.json` changes that path. Either set the app version for the store only (publish dialog / `sys_app.version`) and keep `package.json` at 0.0.1, or change `package.json` **and** every `x_enno_pivot/pivot/0.0.1/` path in the same commit, then rebuild and rerun the PIVOT Regression suite on Dev.
- [ ] Every PIVOT table, script, ACL, role, REST API and UI page is in scope `x_enno_pivot`; nothing in Global. On Dev, the PIVOT application's "Customer updates" related list is empty and `now-sdk transform` shows no differences (no record changed outside the SDK project).
- [ ] ATF suite **PIVOT Regression** (children: Scoring, Gap Rules, Outcomes, Full run, Security) last result is Success on Dev.
- [ ] UI tests (`tests/ui`, PIV-071) last CI run is green on Dev.
- [ ] Open defects: none that block the release; known issues are listed in `RELEASE_NOTES_1.0.0-rc.md`.
- [ ] Cross-scope privileges match `SECURITY_NOTES.md` (see the section above). The license_details create/write entries found in Sprint 2 (PIV-016.02/.04) are removed.

### Publish (PIV-049.02)

- [ ] Publish PIVOT 1.0.0-rc to the company application repository with `RELEASE_NOTES_1.0.0-rc.md` as the release notes.
- [ ] On Test, System Applications > My Company Applications shows PIVOT 1.0.0-rc as available to install.

### Install on a clean Test instance (PIV-049.03)

- [ ] Install from the repository; installation log has no errors and no skipped records.
- [ ] No PIVOT update sets and no Dev test data (`[ATF`, `[TEST]`, `[UI TEST]`, `[S2 TEST]` names) on Test.

### Smoke check on Test (PIV-049.04)

- [ ] Roles exist: `x_enno_pivot.viewer`, `x_enno_pivot.analyst`, `x_enno_pivot.business_owner`, `x_enno_pivot.admin`.
- [ ] As an admin, PIVOT > Workspace opens the Dashboard and all 10 views open without an error.
- [ ] Settings hold the defaults: utilization 60, low score 40, high usage 70, priority Now 2, priority Next 1, look-back 30 days, slow capability 60 s; the job "PIVOT weekly assessment" runs Sunday 02:00.

### Regression on Test (PIV-049.05)

- [ ] Run the ATF suite **PIVOT Regression** on Test: all tests pass.
- [ ] A test that passes on Dev but fails on Test gets a defect naming the missing or different file.
- [ ] Test log records version 1.0.0-rc, the Test instance name and the suite result.
