# PIVOT security notes

## Cross-scope access register

PIVOT runs in the `x_enno_pivot` application scope. This register records the cross-scope privileges declared by the project and the separately reported Generative AI Controller execute privilege. The table grants below are `read` operations on `sys_db_object` targets with status `allowed`; they do not grant PIVOT write access to those source tables. PIVOT writes business data only to its own application tables.

Review these entries against the `CrossScopePrivilege` declarations in:

- [`src/fluent/discovery/discovery.now.ts`](../src/fluent/discovery/discovery.now.ts) — discovery and inventory source tables.
- [`src/fluent/discovery/measure-privileges.now.ts`](../src/fluent/discovery/measure-privileges.now.ts) — tables used by proposed starter usage measures.

| Target table / API | Target scope | Operation / status | Reason |
|---|---|---|---|
| `sn_sub_man_st_subscription_overview` | `sn_sub_man` | `read` / `allowed` | Discover subscription names and purchased/allocated counts to populate licensed Capability records. |
| `subscription_entitlement` | `sn_entitlement` | `read` / `allowed` | A read grant is declared for the entitlement table. No direct read of this table was found in the current PIVOT source; confirm its continuing need with the privilege owner before release. |
| `license_details` | `global` | `read` / `allowed` | Fallback source for licensed products and entitlement counts when the subscription overview has no rows. |
| `ua_app_family` | `global` | `read` / `allowed` | Identify for-fee apps/plugins and map discovered products to a ServiceNow product family. |
| `sys_store_app` | `sn_appclient` | `read` / `allowed` | Discover active installed Store applications, including app name, scope, and version. |
| `v_plugin` | `global` | `read` / `allowed` | Discover active plugins eligible for PIVOT capability inventory. |
| `incident` | `global` | `read` / `allowed` | Count incident records for the Incident Management starter measure. |
| `problem` | `global` | `read` / `allowed` | Count problem records for the Problem Management starter measure. |
| `change_request` | `global` | `read` / `allowed` | Count change requests for the Change Management starter measure. |
| `sc_req_item` | `global` | `read` / `allowed` | Count requested items for the Service Catalog starter measure. |
| `cab_meeting` | `sys_id: 18351d53eb32120034d1eeea1206fe79` | `read` / `allowed` | Count CAB meeting records for the CAB starter measure. |
| `alm_asset` | `global` | `read` / `allowed` | Count asset records for the Asset Management starter measure. |
| `sn_customerservice_case` | `sys_id: 51d811fad7223100b7490ee60e61034f` | `read` / `allowed` | Count customer service cases for the Customer Service starter measure. |
| `sys_cs_conversation` | `global` | `read` / `allowed` | Count conversations for the Conversation Builder starter measure. |
| `pm_project` | `sys_id: eabeaf98eb033a10520dfbdffdc0cd51` | `read` / `allowed` | Count project records for the Project Management starter measure. |
| `resource_plan` | `global` | `read` / `allowed` | Count resource plans for the Resource Management starter measure. |
| `time_card` | `global` | `read` / `allowed` | Count time cards for the Time Tracking starter measure. |
| `rm_story` | `global` | `read` / `allowed` | Count Agile story records for the Agile Development starter measure. |
| `em_alert` | `global` | `read` / `allowed` | Count event alerts for the Event Management starter measure. |
| `sn_generative_ai.LLMClient` | `sn_generative_ai` | `execute` / instance-created | Call the Generative AI Controller from PIVOT AI features. The AI setup guide reports this privilege was created automatically on first use; it is not a table read grant declared in the two source files above. |

For table grants whose target scope is shown as a `sys_id`, the value is the `targetScope` reference configured in the project source. Confirm the referenced application name on the instance when reviewing a changed target.

### Measurement scope boundary

The read grants above cover the tables explicitly configured for discovery and the shipped starter measures. PIVOT admins may configure a different Measure table, but that does not automatically add a cross-scope grant. Before measuring a table outside the approved register, confirm the table is appropriate, obtain the required security approval, add only the necessary least-privilege access, and update this register before release. Do not add broad or write privileges as a shortcut.

## Release control

The release checklist in [`RELEASE_CHECKLIST.md`](./RELEASE_CHECKLIST.md) requires comparing privilege declarations with this register. Any added, removed, or changed cross-scope entry must be reflected here and reviewed before a release is approved.
