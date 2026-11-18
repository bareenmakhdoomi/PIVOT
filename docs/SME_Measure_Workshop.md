# PIVOT SME measure workshop — decision register

**Story:** STRY0015318  
**Status:** Prepared for workshop; no SME decisions are recorded as approved.  
**Related inventory:** [`Capability_Key_Measures.md`](./Capability_Key_Measures.md)  
**Proposed review due date:** 2026-12-02 (confirm with the workshop facilitator and owners)

This register is a decision-capture artifact, not evidence that a workshop has occurred. Every row is open until the relevant SME confirms the measure and the decision is recorded here. Existing PIVOT seed values are shown only as starting proposals; they are not represented as SME-approved measures.

## Workshop outcomes to record

For each capability, SMEs must agree and record:

- The capability name and measure table, confirming the table exists and is populated on the target instance.
- An encoded filter that represents the intended activity (or explicitly approve no additional filter).
- The date field and look-back period used to define the measurement window.
- A numeric target for that period, including the rationale or evidence supporting it.
- The decision, approver, decision date, and any implementation/access follow-up.

If agreement is not reached, keep the item **Open**, record the unresolved question, name an accountable owner, and set a due date. Do not copy proposed values into production as approved settings until they are accepted.

## Open decision register

All rows below are currently **Open**. Role-based owners and the due date are proposed placeholders because named workshop participants and their availability have not been supplied. Confirm the named owner and date during scheduling; keep the item open until that is done.

| Family | Key capability | Proposed table | Proposed filter / date / period / target (unapproved) | Status | Proposed owner | Due date |
|---|---|---|---|---|---|---|
| ITSM | Incident Management | `incident` | Filter: none; date: `sys_created_on`; 30 days; target: 500 | Open | ITSM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITSM | Problem Management | `problem` | Filter: none; date: `sys_created_on`; 30 days; target: 20 | Open | ITSM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITSM | Change Management | `change_request` | Filter: none; date: `sys_created_on`; 30 days; target: 50 | Open | ITSM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITSM | Service Catalog Fulfilment | `sc_req_item` | Filter: none; date: `sys_created_on`; 30 days; target: 300 | Open | ITSM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITSM | Major Incident Management | `incident` | Filter: `major_incident_state=accepted`; date: `sys_created_on`; 90 days; target: 3 | Open | ITSM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITSM | Change Advisory Board (CAB) | `cab_meeting` | Filter: none; date: `sys_created_on`; 90 days; target: 12 | Open | ITSM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITOM | Event Management | `em_alert` | Filter: none; date: `sys_created_on`; 30 days; target: 500 | Open | ITOM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITOM | Configuration Management Database (CMDB) | `cmdb_ci` | Filter, date field, period, and target: TBD in workshop | Open | ITOM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITOM | Discovery | `discovery_status` | Filter, date field, period, and target: TBD in workshop | Open | ITOM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITAM | Hardware Asset Management | `alm_hardware` | Filter, date field, period, and target: TBD in workshop | Open | ITAM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITAM | Asset Management | `alm_asset` | Filter: none; date: `sys_created_on`; 30 days; target: 50 | Open | ITAM product SME (name to confirm) | 2026-12-02 (proposed) |
| ITAM | Software Asset Management | `cmdb_sam_sw_install` | Filter, date field, period, and target: TBD in workshop | Open | ITAM product SME (name to confirm) | 2026-12-02 (proposed) |
| HRSD | HR Case Management | `sn_hr_core_case` | Filter, date field, period, and target: TBD in workshop | Open | HRSD product SME (name to confirm) | 2026-12-02 (proposed) |
| HRSD | HR Task Management | `sn_hr_core_task` | Filter, date field, period, and target: TBD in workshop | Open | HRSD product SME (name to confirm) | 2026-12-02 (proposed) |
| HRSD | Employee Profile Management | `sn_hr_core_profile` | Filter, date field, period, and target: TBD in workshop | Open | HRSD product SME (name to confirm) | 2026-12-02 (proposed) |
| CSM | Customer Case Management | `sn_customerservice_case` | Filter: none; date: `sys_created_on`; 30 days; target: 200 | Open | CSM product SME (name to confirm) | 2026-12-02 (proposed) |
| CSM | Customer Service Tasks | `sn_customerservice_task` | Filter, date field, period, and target: TBD in workshop | Open | CSM product SME (name to confirm) | 2026-12-02 (proposed) |
| CSM | Customer Conversations | `sys_cs_conversation` | Filter: none; date: `sys_created_on`; 30 days; target: 300 | Open | CSM product SME (name to confirm) | 2026-12-02 (proposed) |
| SecOps | Vulnerability Response | `sn_vul_vulnerable_item` | Filter, date field, period, and target: TBD in workshop | Open | SecOps product SME (name to confirm) | 2026-12-02 (proposed) |
| SecOps | Security Incident Response | `sn_si_incident` | Filter, date field, period, and target: TBD in workshop | Open | SecOps product SME (name to confirm) | 2026-12-02 (proposed) |
| SecOps | Threat Intelligence | `sn_ti_indicator` | Filter, date field, period, and target: TBD in workshop | Open | SecOps product SME (name to confirm) | 2026-12-02 (proposed) |
| SPM | Project Portfolio Management | `pm_project` | Filter: none; date: `sys_created_on`; 90 days; target: 10 | Open | SPM product SME (name to confirm) | 2026-12-02 (proposed) |
| SPM | Resource Management | `resource_plan` | Filter: none; date: `sys_created_on`; 90 days; target: 20 | Open | SPM product SME (name to confirm) | 2026-12-02 (proposed) |
| SPM | Time Tracking | `time_card` | Filter: none; date: `sys_created_on`; 30 days; target: 100 | Open | SPM product SME (name to confirm) | 2026-12-02 (proposed) |
| SPM | Agile Development | `rm_story` | Filter: none; date: `sys_created_on`; 30 days; target: 50 | Open | SPM product SME (name to confirm) | 2026-12-02 (proposed) |
| Platform | Workflow Automation | `sys_flow_context` | Filter, date field, period, and target: TBD in workshop | Open | Platform product SME (name to confirm) | 2026-12-02 (proposed) |
| Platform | Application Development and Configuration | `sys_update_set` | Filter, date field, period, and target: TBD in workshop | Open | Platform product SME (name to confirm) | 2026-12-02 (proposed) |
| Platform | User and Access Administration | `sys_user` | Filter, date field, period, and target: TBD in workshop | Open | Platform product SME (name to confirm) | 2026-12-02 (proposed) |
| Other | Custom Workflow Automation | `sys_flow_context` | Filter, date field, period, and target: TBD in workshop | Open | PIVOT product owner / relevant SME (name to confirm) | 2026-12-02 (proposed) |
| Other | Custom Application Development | `sys_update_set` | Filter, date field, period, and target: TBD in workshop | Open | PIVOT product owner / relevant SME (name to confirm) | 2026-12-02 (proposed) |
| Other | Custom Data Change Activity | `sys_audit` | Filter, date field, period, and target: TBD in workshop | Open | PIVOT product owner / relevant SME (name to confirm) | 2026-12-02 (proposed) |

## Decision log

Copy this entry for each decision made. Update the corresponding row above and retain the evidence or rationale.

| Capability | Decision (approved / open) | Agreed table | Agreed filter | Date field / period | Target | SME approver and date | Rationale / evidence | Follow-up owner and due date |
|---|---|---|---|---|---:|---|---|---|
| _Complete during workshop_ | Open | — | — | — | — | — | No decision recorded yet | Confirm owner and date |

## Workshop completion and publication checklist

- [ ] Confirm attendees and named owner for every product family; agree the proposed due date or replace it with an approved date.
- [ ] Validate each proposed table, date field, filter, and target against the target instance and the intended business activity.
- [ ] Record an SME approver and decision date for every approved measure.
- [ ] For every unresolved measure, retain Open status and fill in a named owner and a calendar due date.
- [ ] Update PIVOT starter settings only for measures that have been explicitly approved; keep unsupported or disputed measures Not Measured.
- [ ] Publish this register with the workshop date, attendees, decisions, open items, and follow-up assignments.

**Completion status:** Not complete until the workshop is held, the decisions are recorded, and every remaining open item has a confirmed owner and due date.
