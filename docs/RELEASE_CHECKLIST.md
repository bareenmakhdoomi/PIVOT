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
