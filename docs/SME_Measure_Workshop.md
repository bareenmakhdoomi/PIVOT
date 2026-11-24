# PIVOT SME measure workshop — decision register

**Story:** STRY0015318
**Status:** Workshop inputs received; no SME decisions are recorded as approved.
**Related inventory:** [`Capability_Key_Measures.md`](./Capability_Key_Measures.md)
**Workshop date and attendees:** Planned for 2026-12-01. Bareen Makhdoomi is the proposed facilitator, Numan Shabir the proposed scribe, and Adnan Tariq and Saiba Aslam are invited; attendance and roles must be confirmed at the workshop.
**Follow-up dates:** 2026-12-01 for the 14 complete proposals awaiting SME decisions; 2026-12-02 for the 17 measures needing definition. Confirm both dates with the named owners.

This register is a decision-capture artifact, not evidence that SMEs approved any measure. The requester supplied 14 complete proposals for SME review and 17 open questions with named owners and proposed due dates. Follow-up recommendations have since been provided for the planned workshop. Every row remains **Open** until an SME decision is recorded. Existing PIVOT seed values, the proposals below, and the recommendations are not represented as SME-approved measures.

**Acceptance status:** Partially prepared; neither acceptance criterion is complete. There are 0 recorded SME-approved measures. Fourteen capabilities have a complete proposal awaiting a decision; 17 still need one or more measure details agreed. All 31 register entries remain open, and the key-capability scope itself needs SME confirmation. Named owners and dates below were supplied as proposed assignments; confirm them with the owners.

## Workshop outcomes to record

For each capability, SMEs must agree and record:

- The capability name and measure table, confirming the table exists and is populated on the target instance.
- An encoded filter that represents the intended activity (or explicitly approve no additional filter).
- The date field and look-back period used to define the measurement window.
- A numeric target for that period, including the rationale or evidence supporting it.
- The decision, approver, decision date, and any implementation/access follow-up.

If agreement is not reached, keep the item **Open**, record the unresolved question, name an accountable owner, and set a due date. Do not copy proposed values into production as approved settings until they are accepted. For the 14 complete proposals, the supplied “Pending (1 Dec)” is recorded as a proposed 2026-12-01 decision follow-up date; confirm it with each owner.

## Recommendations for the 2026-12-01 workshop

These are recommendations for SME discussion only. They are not decisions, do not change the Open status of any row, and must not be applied as approved PIVOT settings.

### Confirm the key-capability scope

- Confirm whether the current 31 entries are the complete key-capability list.
- Consider adding **Knowledge usage** as a candidate. The implementation plan gives `kb_use`, no filter, and a target of 1,000 per 90 days as an example; it does not specify the date field, which SMEs must decide.
- Decide whether **Incident self-service** is a separate capability or part of Incident Management.
- Review the three **Other** entries—Custom Workflow Automation, Custom Application Development, and Custom Data Change Activity. They reuse Platform tables and need refinement before being treated as key capabilities; decide whether to retain, replace, or remove them.

These are scope questions, not additional approved register rows. If the SMEs add capabilities, record their agreed measures and follow-ups in the register before treating the scope as final.

### Review the 14 complete proposals

- **Incident Management:** The current proposal (`incident`, `active=true`, `sys_created_on`, 30 days, target 100) measures active workload and can exclude incidents created and resolved within the period. Recommended alternative for discussion: `incident`, no additional filter, `sys_created_on`, 30 days; SMEs should set the target.
- **Incident self-service, if added as a separate capability:** The implementation-plan example is `incident`, `contact_type=self-service`, 90 days, target 500. The date field is not specified in that example and must be agreed. Confirm the filter encoding and target with SMEs.
- **Problem Management, Change Management, and Service Catalog Fulfilment:** Consider removing `active=true` for the same potential exclusion of records created and resolved during the look-back period. The current proposed targets (20, 50, and 300 respectively) remain unapproved and need SME confirmation.
- **Other 10 complete proposals:** Major Incident Management, CAB, Event Management, Asset Management, Customer Case Management, Customer Conversations, Project Portfolio Management, Resource Management, Time Tracking, and Agile Development were considered reasonable to take forward as proposed. SMEs still need to validate the table, filter, date field, window, and target.
- Targets should be justified against expected real-customer volumes, not calibrated solely to the demo-sized dev instance.

The implementation-plan Incident self-service example measures adoption, while the current Incident Management proposal measures active workload; do not treat them as interchangeable or choose between them without SME agreement.

### Confirm the 17 open items and validation follow-ups

- Recommendation is to keep all 17 unresolved measures **Open**, retaining their listed questions, proposed owners, and 2026-12-02 due dates unless the owners/SMEs confirm changes.
- HRSD and SecOps are not installed on the dev instance, so the six HRSD and SecOps measures cannot be validated there. Ask SMEs whether their due dates should move to a date tied to access to an instance with those applications. Record any revised owner/date as an explicit follow-up decision.

## Open decision register

All rows below are currently **Open**. “Proposed” values are for SME review only. The approval column is intentionally not populated because no approver or decision date was supplied.

| Family | Key capability | Proposed table | Proposed filter / date field / window / target (unapproved) | Status / unresolved question | Proposed owner | Proposed due date |
|---|---|---|---|---|---|---|
| ITSM | Incident Management | `incident` | Filter: `active=true`; date: `sys_created_on`; 30 days; target: 100 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITSM | Problem Management | `problem` | Filter: `active=true`; date: `sys_created_on`; 30 days; target: 20 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITSM | Change Management | `change_request` | Filter: `active=true`; date: `sys_created_on`; 30 days; target: 50 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITSM | Service Catalog Fulfilment | `sc_req_item` | Filter: `active=true`; date: `sys_created_on`; 30 days; target: 300 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITSM | Major Incident Management | `incident` | Filter: `major_incident_state=accepted`; date: `sys_created_on`; 90 days; target: 3 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITSM | Change Advisory Board (CAB) | `cab_meeting` | Filter: no filter; date: `sys_created_on`; 90 days; target: 12 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITOM | Event Management | `em_alert` | Filter: no filter; date: `sys_created_on`; 30 days; target: 500 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITOM | Configuration Management Database (CMDB) | `cmdb_ci` | Filter, date field, period, and target: TBD | Open — choose an activity signal instead of counting every CI | Adnan Tariq | 2026-12-02 |
| ITOM | Discovery | `discovery_status` | Filter, date field, period, and target: TBD | Open — determine which status means a completed discovery | Adnan Tariq | 2026-12-02 |
| ITAM | Hardware Asset Management | `alm_hardware` | Filter, date field, period, and target: TBD | Open — define what counts as managed or updated | Adnan Tariq | 2026-12-02 |
| ITAM | Asset Management | `alm_asset` | Filter: no filter; date: `sys_created_on`; 30 days; target: 50 | Open — SME decision pending | Adnan Tariq | 2026-12-01 (proposed) |
| ITAM | Software Asset Management | `cmdb_sam_sw_install` | Filter, date field, period, and target: TBD | Open — define what counts as reconciled | Adnan Tariq | 2026-12-02 |
| HRSD | HR Case Management | `sn_hr_core_case` | Filter, date field, period, and target: TBD | Open — define all four values; HRSD is not installed on dev | Saiba Aslam | 2026-12-02 |
| HRSD | HR Task Management | `sn_hr_core_task` | Filter, date field, period, and target: TBD | Open — define all four values; HRSD is not installed on dev | Saiba Aslam | 2026-12-02 |
| HRSD | Employee Profile Management | `sn_hr_core_profile` | Filter, date field, period, and target: TBD | Open — define what constitutes active use | Saiba Aslam | 2026-12-02 |
| CSM | Customer Case Management | `sn_customerservice_case` | Filter: no filter; date: `sys_created_on`; 30 days; target: 200 | Open — SME decision pending | Saiba Aslam | 2026-12-01 (proposed) |
| CSM | Customer Service Tasks | `sn_customerservice_task` | Filter, date field, period, and target: TBD | Open — confirm table availability and define all four values | Saiba Aslam | 2026-12-02 |
| CSM | Customer Conversations | `sys_cs_conversation` | Filter: no filter; date: `sys_created_on`; 30 days; target: 300 | Open — SME decision pending | Saiba Aslam | 2026-12-01 (proposed) |
| SecOps | Vulnerability Response | `sn_vul_vulnerable_item` | Filter, date field, period, and target: TBD | Open — define all four values; SecOps is not installed on dev | Saiba Aslam | 2026-12-02 |
| SecOps | Security Incident Response | `sn_si_incident` | Filter, date field, period, and target: TBD | Open — define all four values; SecOps is not installed on dev | Saiba Aslam | 2026-12-02 |
| SecOps | Threat Intelligence | `sn_ti_indicator` | Filter, date field, period, and target: TBD | Open — define all four values; SecOps is not installed on dev | Saiba Aslam | 2026-12-02 |
| SPM | Project Portfolio Management | `pm_project` | Filter: no filter; date: `sys_created_on`; 90 days; target: 10 | Open — SME decision pending | Numan Shabir | 2026-12-01 (proposed) |
| SPM | Resource Management | `resource_plan` | Filter: no filter; date: `sys_created_on`; 90 days; target: 20 | Open — SME decision pending | Numan Shabir | 2026-12-01 (proposed) |
| SPM | Time Tracking | `time_card` | Filter: no filter; date: `sys_created_on`; 30 days; target: 100 | Open — SME decision pending | Numan Shabir | 2026-12-01 (proposed) |
| SPM | Agile Development | `rm_story` | Filter: no filter; date: `sys_created_on`; 30 days; target: 50 | Open — SME decision pending | Numan Shabir | 2026-12-01 (proposed) |
| Platform | Workflow Automation | `sys_flow_context` | Filter, date field, period, and target: TBD | Open — determine which run states mean successful use | Bareen Makhdoomi | 2026-12-02 |
| Platform | Application Development and Configuration | `sys_update_set` | Filter, date field, period, and target: TBD | Open — decide whether update sets fairly measure use | Bareen Makhdoomi | 2026-12-02 |
| Platform | User and Access Administration | `sys_user` | Filter, date field, period, and target: TBD | Open — define an activity signal, not static user records | Bareen Makhdoomi | 2026-12-02 |
| Other | Custom Workflow Automation | `sys_flow_context` | Filter, date field, period, and target: TBD | Open — determine which run states mean successful use | Bareen Makhdoomi | 2026-12-02 |
| Other | Custom Application Development | `sys_update_set` | Filter, date field, period, and target: TBD | Open — decide whether update sets fairly measure use | Bareen Makhdoomi | 2026-12-02 |
| Other | Custom Data Change Activity | `sys_audit` | Filter, date field, period, and target: TBD | Open — confirm table access, data sensitivity, and filter | Bareen Makhdoomi | 2026-12-02 |

## Alignment with current PIVOT behavior

Discovery applies a one-time starter measurement only for source IDs defined in `SEED_MEASURES` and only when a Capability has no measure table or target. These values are implementation defaults, not workshop approvals. Admin-edited values are preserved on later discovery runs.

The 14 complete proposals supplied for this register include existing PIVOT seed values as well as proposed settings for other listed capabilities. They remain unapproved and must not be treated as SME decisions. Seventeen candidates still have open measurement questions; no missing filter, date field, window, or target has been invented.

There is no code or workflow in this repository that convenes SMEs, records their approval, or verifies a meeting occurred. The workshop is planned for 2026-12-01, with a proposed facilitator, scribe, and invitees noted above; actual attendance, roles, approver names, and approval dates remain unconfirmed. The table records supplied proposals and follow-up assignments only. Completing the agreement requires recording each actual SME decision here, then separately implementing only the measures that SMEs approve.

## Decision log

Copy this entry for each decision made. Update the corresponding row above and retain the evidence or rationale.

| Capability | Decision (approved / open) | Agreed table | Agreed filter | Date field / period | Target | SME approver and date | Rationale / evidence | Follow-up owner and due date |
|---|---|---|---|---|---:|---|---|---|
| _Complete during workshop_ | Open | — | — | — | — | — | No decision recorded yet | Confirm owner and date |

## Workshop completion and publication checklist

- [ ] Confirm the workshop date and record attendee names and roles.
- [ ] Resolve the key-capability scope questions, including Knowledge usage, Incident self-service, and the three Other entries.
- [ ] Confirm the named owners and proposed follow-up dates in the register.
- [ ] Validate each proposed table, date field, filter, and target against the target instance and the intended business activity.
- [ ] Record an SME approver and decision date for every approved measure.
- [ ] For every unresolved measure, retain Open status and fill in a named owner and a calendar due date.
- [ ] Update PIVOT starter settings only for measures that have been explicitly approved; keep unsupported or disputed measures Not Measured.
- [ ] Publish this register with the workshop date, attendees, decisions, open items, and follow-up assignments.

**Completion status:** Not complete. The open-item register has named owners and proposed due dates for all 31 entries, including the 17 unresolved questions. The 14 complete proposals still need explicit SME decisions. The workshop is planned for 2026-12-01, but actual attendance, roles, approvers, and decision dates are not yet confirmed. The key-capability scope also needs confirmation. Do not apply proposal values to PIVOT starter settings as approved measures.
