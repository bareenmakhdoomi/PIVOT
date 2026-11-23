# STRY0015280 — Subscription field mapping

Verified in **System Definition > Dictionary** on the PIVOT development instance on 2026-11-18.

| Discovery source | Planned field / purpose | Verified field | Dictionary label / notes |
|---|---|---|---|
| `sn_sub_man_st_subscription_overview` | Product name | `subscription` | Reference to `subscription_entitlement`; discovery uses its display value. |
| `sn_sub_man_st_subscription_overview` | Purchased count | `purchased_count` | Label: Purchased. |
| `sn_sub_man_st_subscription_overview` | Allocated count | `allocated_count` | Label: Consumed in this instance. This is the field discovery reads for `allocated_count`. |
| `subscription_entitlement` | Product name behind the overview reference | `name` | Display field for the referenced subscription entitlement. |
| `subscription_entitlement` | Purchased count behind the overview reference | `purchased_count` | Label: Purchased. |
| `subscription_entitlement` | Allocated count | Not present | Use `sn_sub_man_st_subscription_overview.allocated_count` (label: Consumed); no allocated-count field is read from the referenced table. |
| `license_details` (fallback) | Product name | `name` | Used when the subscription overview has no rows. |
| `license_details` (fallback) | Purchased count | `count` | Label: Purchased. |
| `license_details` (fallback) | Allocated count | `allocated` | Label: Allocated. |

The discovery implementation already uses these verified fields: `subscription`, `purchased_count`, and `allocated_count` on the overview; `name`, `count`, and `allocated` on the fallback. No discovery code change is needed for this story.

For a repeatable, read-only recheck on the instance, run [STRY0015280_Subscription_Field_Inspection.js](./STRY0015280_Subscription_Field_Inspection.js) in Scripts - Background in the PIVOT scope.
