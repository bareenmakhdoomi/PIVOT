# Seed measures and target rationale

PIVOT applies the following starter measurements to matching discovered source IDs when the Capability has no measure table or target. The filter is applied before the date window. Targets are **provisional, editable data**, not approved benchmarks or fixed product limits. No empirical customer baseline or SME approval is recorded for these values; the rationale column explains the initial volume assumption and what to validate.

Admins can adjust a target and other measurement settings in **Capability Library**. Discovery preserves admin-managed settings on later runs. Set Target to empty to leave the Capability **Not Measured**; the field help is **“Empty = Not Measured”**.

| Family | Capability / source ID | Measure table | Filter | Date field / days | Target | Target rationale and validation |
|---|---|---|---|---:|---:|---|
| ITSM | Incident Management (`com.snc.incident`) | `incident` | `active=true` | `sys_created_on` / 30 | 100 | Provisional monthly active-incident volume. Compare with the instance's recent monthly baseline and expected operating scale. |
| ITSM | Problem Management (`com.snc.problem`) | `problem` | `active=true` | `sys_created_on` / 30 | 20 | Lower than incident volume because problem records are expected to be less frequent. Confirm against historical monthly problem volume. |
| ITSM | Change Management (`com.snc.change_management`) | `change_request` | `active=true` | `sys_created_on` / 30 | 50 | Provisional monthly active-change volume. Validate against the organisation's change cadence and historical data. |
| ITSM | Service Catalog (`com.glideapp.servicecatalog`) | `sc_req_item` | `active=true` | `sys_created_on` / 30 | 300 | Higher-volume fulfillment proposal relative to incident and change work. Calibrate to monthly request-item throughput. |
| ITSM | Major Incident Management (`com.snc.incident.mim`) | `incident` | `major_incident_state=accepted` | `sys_created_on` / 90 | 3 | Small, low-frequency 90-day proposal for accepted major incidents. Confirm the qualifying state and expected frequency on the instance. |
| ITSM | Change Advisory Board (`com.snc.change_management.cab`) | `cab_meeting` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 90 | 12 | Approximately one recorded meeting per week over 90 days. Confirm the meeting cadence and that each row represents a meeting. |
| ITAM | Asset Management (`com.snc.asset_management`) | `alm_asset` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 50 | Provisional monthly asset-record volume. This counts recently created records, not total assets or updates; validate that as an adoption proxy. |
| ITAM | Software Asset Management (`com.snc.samp`) | `alm_asset` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 100 | Provisional monthly asset-record volume for this source. Validate the table's relevance to software asset activity before relying on the score. |
| ITAM | Hardware Asset Management (`com.snc.ham`) | `alm_asset` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 100 | Provisional monthly asset-record volume for this source. Confirm the source and table represent hardware activity on the instance. |
| CSM | Customer Service (`sn_customerservice`) | `sn_customerservice_case` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 200 | Provisional monthly case volume. Calibrate to case throughput and confirm the filter includes the intended cases. |
| CSM | Conversation Builder (`com.snc.conversation_builder`) | `sys_cs_conversation` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 300 | Higher-volume interaction proposal relative to cases. Confirm conversation records correspond to customer-service activity. |
| CSM | Customer Service Management (`com.snc.csm`) | `sn_customerservice_case` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 200 | Provisional monthly case volume, aligned with the Customer Service seed. Confirm whether both source IDs should use the same threshold. |
| HRSD | HR Case Management (`sn_hr_core`) | `task` | `sys_class_nameSTARTSWITHsn_hr^sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 200 | Provisional monthly HR-task volume. Confirm the task class prefix selects only intended HR work and calibrate to case throughput. |
| HRSD | Employee Lifecycle Events (`sn_hr_le`) | `task` | `sys_class_nameSTARTSWITHsn_hr^sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 100 | Lower-volume monthly HR-task proposal. Validate source identity, filter scope, and expected lifecycle-event volume. |
| HRSD | HR Service Portal (`sn_hr_sp`) | `task` | `sys_class_nameSTARTSWITHsn_hr^sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 100 | Lower-volume monthly HR-task proposal. Confirm this source's usage is represented by HR task records and calibrate the threshold. |
| SPM | Project Management (`com.snc.project_management_v3`) | `pm_project` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 90 | 10 | Small 90-day project-creation proposal. Validate whether newly created projects are a suitable activity signal. |
| SPM | Resource Management (`com.snc.resource_management`) | `resource_plan` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 90 | 20 | Provisional 90-day resource-plan volume. Confirm each counted record reflects meaningful resource-management activity. |
| SPM | Time Card (`com.snc.time_card`) | `time_card` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 100 | Provisional monthly time-card volume. Calibrate to submission cadence and the number of users expected to submit cards. |
| SPM | Agile Development (`com.snc.sdlc.agile.2.0`) | `rm_story` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 50 | Provisional monthly story volume. Confirm story creation is a useful signal versus story updates or completed work. |
| ITOM | Service Watch (`com.snc.service-watch`) | `em_alert` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 500 | Higher-volume alert proposal. Validate alert noise, deduplication, and whether created alerts represent useful operations activity. |
| ITOM | Discovery (`com.snc.discovery`) | `cmdb_ci` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 1000 | High-volume configuration-item proposal. This counts newly created CIs, not discovery executions; confirm it is a useful proxy. |
| ITOM | Service Mapping (`com.snc.service-mapping`) | `cmdb_ci` | `sys_created_onISNOTEMPTY` | `sys_created_on` / 30 | 100 | Provisional monthly CI volume for this source. Confirm the table and creation date meaningfully reflect service-mapping activity. |

## How to use targets

- Targets are editable values on each Capability, not constants in scoring logic. Discovery applies a starter only when the measure table and target are both empty, and it does not overwrite admin changes.
- The score is actual count divided by target, multiplied by 100 and capped at 100. A target therefore defines the count at which the Capability reaches a full usage score for its configured period.
- Review table, filter, date field, period, and target against the target instance and local operating baseline. The rationales above are starting assumptions, not evidence of SME approval.
- To disable scoring until a suitable measure or target is agreed, clear Target; the Capability will be **Not Measured** rather than scored as zero.
