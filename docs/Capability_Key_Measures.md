# PIVOT key capabilities and proposed measure tables

**Status:** SME review draft  
**Purpose:** Identify candidate capabilities that matter for each product family and the ServiceNow table that could be used to measure activity. These are proposals for discussion, not approved targets or production measurement settings.

PIVOT currently scopes the families listed below. Each family has at least three named capability candidates and a proposed measure table. Before configuring a measure, the relevant product SME should confirm that the table is installed and populated on the target instance, represents meaningful usage, and can be safely queried with the required date field and filters.

## IT Service Management (ITSM)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Incident Management | `incident` | Incidents handled in the measurement period |
| Problem Management | `problem` | Problems worked in the measurement period |
| Change Management | `change_request` | Change requests processed in the measurement period |
| Service Catalog Fulfilment | `sc_req_item` | Requested items fulfilled or processed |
| Major Incident Management | `incident` | Incidents identified as major incidents; confirm the instance's major-incident field and qualifying value |
| Change Advisory Board (CAB) | `cab_meeting` | CAB meetings held or recorded |

## IT Operations Management (ITOM)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Event Management | `em_alert` | Alerts processed or resolved |
| Configuration Management Database (CMDB) | `cmdb_ci` | Configuration items actively maintained; confirm a meaningful activity signal rather than counting all rows |
| Discovery | `discovery_status` | Discovery executions completed; confirm the instance's discovery status table and completion criteria |

## IT Asset Management (ITAM)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Hardware Asset Management | `alm_hardware` | Hardware assets managed or updated |
| Asset Management | `alm_asset` | Assets managed or updated |
| Software Asset Management | `cmdb_sam_sw_install` | Software installations inventoried or reconciled |

## HR Service Delivery (HRSD)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| HR Case Management | `sn_hr_core_case` | HR cases handled |
| HR Task Management | `sn_hr_core_task` | HR tasks completed |
| Employee Profile Management | `sn_hr_core_profile` | Employee profiles maintained; confirm what constitutes active usage |

## Customer Service Management (CSM)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Customer Case Management | `sn_customerservice_case` | Customer cases handled |
| Customer Service Tasks | `sn_customerservice_task` | Customer service tasks completed; confirm availability on the instance |
| Customer Conversations | `sys_cs_conversation` | Customer conversations handled |

## Security Operations (SecOps)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Vulnerability Response | `sn_vul_vulnerable_item` | Vulnerable items assessed or remediated |
| Security Incident Response | `sn_si_incident` | Security incidents handled |
| Threat Intelligence | `sn_ti_indicator` | Threat indicators reviewed or managed |

## Strategic Portfolio Management (SPM)

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Project Portfolio Management | `pm_project` | Projects actively managed |
| Resource Management | `resource_plan` | Resource plans created or maintained |
| Time Tracking | `time_card` | Time cards submitted or approved |
| Agile Development | `rm_story` | Agile stories progressed |

## Platform

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Workflow Automation | `sys_flow_context` | Flow executions completed; confirm the execution states that represent successful use |
| Application Development and Configuration | `sys_update_set` | Update sets used to capture development changes; confirm this is a suitable adoption proxy |
| User and Access Administration | `sys_user` | User records actively managed; confirm a meaningful activity signal and avoid counting static records as usage |

## Other

| Key capability candidate | Proposed measure table | Measure idea for SME review |
|---|---|---|
| Custom Workflow Automation | `sys_flow_context` | Flow executions completed; confirm the execution states that represent successful use |
| Custom Application Development | `sys_update_set` | Update sets used to capture development changes; confirm this is a suitable adoption proxy |
| Custom Data Change Activity | `sys_audit` | Audited changes in the measurement period; confirm table access, data sensitivity, and a suitable filter |

## Existing PIVOT starter measurements

PIVOT already seeds starting measurements for a subset of well-known discovered products. Those mappings are implementation references, not SME approval. In particular, existing starter mappings include Incident Management (`incident`), Problem Management (`problem`), Change Management (`change_request`), Service Catalog Fulfilment (`sc_req_item`), Asset Management (`alm_asset`), Customer Service (`sn_customerservice_case`), Project Management (`pm_project`), Resource Management (`resource_plan`), Time Tracking (`time_card`), Agile Development (`rm_story`), and Event Management (`em_alert`).

## SME review checklist

For each candidate, record the SME-approved capability name and measure table, then confirm:

1. The table exists on the target ServiceNow instance and contains the records relevant to this capability.
2. Counting records in that table is a valid measure of adoption, not merely installed capacity or historical inventory.
3. The date field and any encoded filter include the correct business activity and measurement period.
4. PIVOT's scoped access can read the table and required fields without exposing inappropriate data.
5. Any target count and look-back period are agreed separately; this list intentionally does not prescribe them.

The `Other` family is a valid PIVOT category but is not a named product portfolio. Its three entries are generic candidate capabilities; SMEs should replace or refine them for the actual products mapped to `Other` before treating the list as customer-specific.
