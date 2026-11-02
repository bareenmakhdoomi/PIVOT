# PIVOT workspace API – contract (PIV-063.01)

Base URL: `/api/x_enno_pivot/v1/workspace` (Scripted REST API "PIVOT Workspace", version 1).
Authentication: the user's ServiceNow session. Browser calls send the header `X-UserToken: <g_ck>`.
Every response is wrapped by ServiceNow in `{ "result": … }`. The examples below show the content of `result`.

## Rules for every resource

| Rule | Detail |
|---|---|
| Who may call | Users with a PIVOT role. The REST ACL `x_enno_pivot_workspace_api` requires `x_enno_pivot.viewer`, which every PIVOT role contains. Without it the platform answers **403** and no PIVOT code runs (PIV-063.02 AC 1). |
| What is returned | Records are read with `GlideRecordSecure`, so table and field ACLs decide what each user gets. Exports use the same reads, so a file never holds a record the user cannot read (PIV-063.06 AC 2). |
| Lists (PIV-063.03) | Query parameters `page` (1-based, default 1), `size` (default 5, at most **50**), `sort` (field name; prefix `-` for descending) and the filters listed per resource. The answer is `{ items, total, page, size, start, end }`. `start` and `end` are 1-based positions (page 2, size 5 gives 6–10); both are 0 when the page is empty. |
| Not found | **404** `{ "ok": false, "error": "Not found, or you cannot read it." }` |
| Server error | **500** `{ "ok": false, "error": "PIVOT could not load its data. …" }`. The details go to the system log. |
| Figures | Dashboard and Reports use one server function (`summary()`), with GlideAggregate counts, so both always show the same numbers (PIV-063.05). |

## Read resources

| Method and path | Parameters | Returns |
|---|---|---|
| GET `/dashboard` | – | Latest finished run (score, change, counts), headline sentence, opportunity counts by state and phase, outcome counts by status, top 3 Now items, running run. |
| GET `/analytics` | `run` (PVA number or sys_id; default latest finished), `family`, `band` (high, medium, low, not_measured), `page`, `size` | Bands, per-family averages, last 8 runs, capability scores for the run (paged, highest score first). |
| GET `/capabilities` | `page`, `size`, `sort` (name, number, family, discovered), `q`, `family` (`none` = needs mapping), `active` (true, false, all; default true), `licensed`, `installed` | Capabilities with the latest score, band and utilization. |
| GET `/capabilities/{id}` | id = sys_id or PVC number | One capability with its last 8 results, its outcomes and opportunities, and `editable` (admins). |
| GET `/opportunities` | `page`, `size`, `sort` (priority, number, updated, value; default -priority), `state` (active = New + Accepted + In progress; default active; or one state, or all), `type`, `phase` (now, next, later), `family`, `capability`, `assigned` (me, none, a user sys_id), `q` | Opportunities with state, phase, priority and reason, owner, and `editable`. |
| GET `/opportunities/{id}` | id = PVO number or sys_id | One opportunity with its activity and measured value. |
| GET `/roadmap` | – | Now, Next and Later columns (label, rule from the priority properties, items in roadmap order, count) and the Closed as done count. |
| GET `/outcomes` | `page`, `size`, `sort` (kpi, status, updated), `status`, `capability`, `owner=me`, `active=all`, `q` | Outcomes. `editable` is true for admins and for the owner (PIV-063.02 AC 2). |
| GET `/outcomes/{id}` | id = sys_id | One outcome with its last 8 outcome results. |
| GET `/assessments` | `page`, `size`, `status`, `trigger` | Runs, newest first, with step and last log message. |
| GET `/assessments/{id}` | id = PVA number or sys_id | One run with its full log. |
| GET `/assessments/running` | – | Live progress: `{ number, status, step, of: 10, stepName, last_message, run_date }`, or `{}` when no run is Queued or Running (PIV-063.07). |
| GET `/reports` | – | Same figures as `/dashboard`, plus the last 8 runs and the list of CSV exports. |
| GET `/properties` | – | Each PIVOT property with its value, default, type and `editable` (admins). |
| GET `/search` | `q` (at least 2 characters) | Up to 8 capabilities, opportunities, outcomes and assessments matching the text. |
| GET `/notifications` | – | A running or failed run, the latest run, up to 5 outcomes below target, and (admins only) capabilities that need a product family. |
| GET `/export/{name}` | name = executive_summary, capabilities, outcomes, opportunities, assessments, roadmap, decision_log | UTF-8 CSV with a header row, downloaded as `pivot_<name>.csv` (PIV-063.06). |
| GET `/bootstrap` | – | Everything the workspace shows in one answer (used by the workspace page today). |

## Action resource (PIV-063.04)

POST `/action` with body `{ "action": "<name>", … }`.

| Answer | Shape |
|---|---|
| Success | `{ "ok": true, "note": "Accepted. It stays on the roadmap until it is closed as done." }`. Some actions add fields, such as `number` for runNow. |
| Refused (role, state, not found) | `{ "ok": false, "error": "Only analysts and admins can work opportunities." }` |
| Validation | `{ "ok": false, "errors": { "rejection_reason": "Please enter a rejection reason" } }` |

Validation is decided on the server, using the same rules as the table business rules; the UI only shows the answer. Nothing is saved when the answer is not `ok`.

| action | Body | Who |
|---|---|---|
| accept, start, done, reopen | `number` | analyst, admin |
| reject | `number`, `reason` (10+ characters) | analyst, admin |
| assign | `number`, `user` (empty = unassign; must be in the assignment group if one is set) | analyst, admin |
| note | `number`, `text` | analyst, admin |
| scores | `number`, `value` 1–5, `business_impact` 0–5 or empty, `effort` 1–5 | analyst, admin |
| reorder (move) | `phase`, `numbers` (new order) | analyst, admin |
| resetRoadmap | – | analyst, admin |
| saveOutcome | `fields` { id?, capability, objective, kpi, … } | business owner (own), admin |
| updateCapability | `id`, `fields` (measure_table, measure_filter, date_field, days_back, target, weight) | admin |
| mapFamily | `ids`, `family` | admin |
| runNow | – | admin. Answers "Assessment started. Refresh this list to see progress." or "An assessment is already running. Try again when it completes." |
| setProp | `name`, `value` | admin |

## Example responses

These were produced by the PIVOT test harness from sample data, with long lists shortened.

### GET /opportunities?state=active&page=2&size=5
```json
{
  "items": [
    {
      "id": "s34",
      "number": "PVO0001006",
      "capability": "s10",
      "capabilityName": "Cap 07",
      "type": "low_adoption",
      "typeLabel": "Low adoption",
      "short_description": "Opp 6",
      "description": "",
      "state": "open",
      "stateLabel": "New",
      "value": 3,
      "business_impact": null,
      "effort": null,
      "priority": 2.2,
      "priority_reason": "",
      "phase": "now",
      "assigned_to": "",
      "assignedName": "",
      "assignment_group": "",
      "groupName": "",
      "outcome": "",
      "gap_resolved": false,
      "rejection_reason": "",
      "assessment": "",
      "updated": "2026-10-20 10:00:00",
      "editable": false
    }
  ],
  "total": 10,
  "page": 2,
  "size": 5,
  "start": 6,
  "end": 10
}
```

### GET /assessments/running
```json
{
  "number": "PVA0001043",
  "status": "running",
  "step": 6,
  "of": 10,
  "stepName": "gaps",
  "last_message": "gaps: 0 opportunities in 0.4 s",
  "run_date": "2026-10-30 10:00:00"
}
```

### GET /dashboard
```json
{
  "run": {
    "number": "PVA0001002",
    "date": "2026-10-27 02:00:00",
    "trigger": "run_now",
    "status": "complete_with_warnings",
    "score": 53,
    "previousScore": 52.6,
    "change": 0.4,
    "checked": 11,
    "scored": 8,
    "notMeasured": 3,
    "licensedNotInstalled": 1
  },
  "headline": "Platform Value Score 53, up 0.4 since the previous run.",
  "opportunities": {
    "byState": {
      "open": 9,
      "rejected": 1,
      "done": 1,
      "accepted": 1
    },
    "active": 10,
    "phases": {
      "now": 6,
      "next": 3,
      "later": 1
    }
  },
  "outcomes": {
    "byStatus": {
      "below_target": 1,
      "on_target": 1
    },
    "total": 2
  },
  "topNow": [
    {
      "id": "s29",
      "number": "PVO0001001",
      "capability": "s5",
      "capabilityName": "Cap 02",
      "type": "low_adoption",
      "typeLabel": "Low adoption",
      "short_description": "Opp 1",
      "description": "",
      "state": "open",
      "stateLabel": "New",
      "value": 3,
      "business_impact": null,
      "effort": null,
      "priority": 3.7,
      "priority_reason": "",
      "phase": "now",
      "assigned_to": "",
      "assignedName": "",
      "assignment_group": "",
      "groupName": "",
      "outcome": "",
      "gap_resolved": false,
      "rejection_reason": "",
      "assessment": "",
      "updated": "2026-10-20 10:00:00",
      "editable": false
    }
  ],
  "running": {
    "number": "PVA0001043",
    "status": "running",
    "step": 6,
    "of": 10,
    "stepName": "gaps",
    "last_message": "gaps: 0 opportunities in 0.4 s",
    "run_date": "2026-10-30 10:00:00"
  }
}
```

### GET /roadmap
```json
{
  "columns": {
    "now": {
      "label": "Now",
      "rule": "priority ≥ 2",
      "items": [
        {
          "id": "s29",
          "number": "PVO0001001",
          "capability": "s5",
          "capabilityName": "Cap 02",
          "type": "low_adoption",
          "typeLabel": "Low adoption",
          "short_description": "Opp 1",
          "description": "",
          "state": "open",
          "stateLabel": "New",
          "value": 3,
          "business_impact": null,
          "effort": null,
          "priority": 3.7,
          "priority_reason": "",
          "phase": "now",
          "assigned_to": "",
          "assignedName": "",
          "assignment_group": "",
          "groupName": "",
          "outcome": "",
          "gap_resolved": false,
          "rejection_reason": "",
          "assessment": "",
          "updated": "2026-10-20 10:00:00",
          "editable": false,
          "sequence": 1,
          "roadmapAssessment": "PVA0001002"
        }
      ],
      "count": 3
    },
    "next": {
      "label": "Next",
      "rule": "1 to below 2",
      "items": [],
      "count": 0
    },
    "later": {
      "label": "Later",
      "rule": "below 1",
      "items": [],
      "count": 0
    }
  },
  "done": {
    "label": "Closed as done",
    "rule": "not on the roadmap",
    "count": 1
  }
}
```

### GET /outcomes?size=2 (as a viewer – editable is false)
```json
{
  "items": [
    {
      "id": "s41",
      "capability": "s4",
      "capabilityName": "Cap 01",
      "objective": "",
      "kpi": "KPI A",
      "direction": "",
      "measurement_type": "",
      "baseline": null,
      "current_value": 5,
      "target": 10,
      "status": "below_target",
      "statusLabel": "Below target",
      "owner": "bo1",
      "ownerName": "Owner One",
      "important_objective": false,
      "active": true,
      "editable": false
    }
  ],
  "total": 2,
  "page": 1,
  "size": 2,
  "start": 1,
  "end": 2
}
```

### GET /capabilities?size=2
```json
{
  "items": [
    {
      "id": "s4",
      "number": "PVC1001",
      "name": "Cap 01",
      "family": "itsm",
      "familyLabel": "ITSM",
      "source": "",
      "licensed": true,
      "installed": false,
      "entitled": null,
      "allocated": null,
      "scope": "sn_cap1",
      "active": true,
      "measure_table": "",
      "target": null,
      "weight": null,
      "score": 20,
      "utilization": null,
      "band": "low",
      "last_discovered": ""
    },
    {
      "id": "s5",
      "number": "PVC1002",
      "name": "Cap 02",
      "family": "hrsd",
      "familyLabel": "HRSD",
      "source": "",
      "licensed": true,
      "installed": true,
      "entitled": null,
      "allocated": null,
      "scope": "sn_cap2",
      "active": true,
      "measure_table": "",
      "target": null,
      "weight": null,
      "score": 30,
      "utilization": null,
      "band": "low",
      "last_discovered": ""
    }
  ],
  "total": 11,
  "page": 1,
  "size": 2,
  "start": 1,
  "end": 2,
  "run": "PVA0001002"
}
```

### GET /capabilities/PVC1002
```json
{
  "id": "s5",
  "number": "PVC1002",
  "name": "Cap 02",
  "family": "hrsd",
  "familyLabel": "HRSD",
  "source": "",
  "licensed": true,
  "installed": true,
  "entitled": null,
  "allocated": null,
  "scope": "sn_cap2",
  "active": true,
  "measure_table": "",
  "target": null,
  "weight": null,
  "score": 30,
  "utilization": null,
  "band": "low",
  "last_discovered": "",
  "measure_filter": "",
  "date_field": "",
  "days_back": null,
  "editable": false,
  "results": [
    {
      "assessment": "PVA0001002",
      "date": "2026-10-11 10:00:00",
      "score": 30,
      "actual": null,
      "target": null,
      "utilization": null,
      "status": "",
      "reason": ""
    }
  ],
  "outcomes": [
    {
      "id": "s42",
      "capability": "s5",
      "capabilityName": "Cap 02",
      "objective": "",
      "kpi": "KPI B",
      "direction": "",
      "measurement_type": "",
      "baseline": null,
      "current_value": null,
      "target": null,
      "status": "on_target",
      "statusLabel": "On target",
      "owner": "bo2",
      "ownerName": "Owner Two",
      "important_objective": false,
      "active": true,
      "editable": false
    }
  ],
  "opportunities": [
    {
      "id": "s29",
      "number": "PVO0001001",
      "capability": "s5",
      "capabilityName": "Cap 02",
      "type": "low_adoption",
      "typeLabel": "Low adoption",
      "short_description": "Opp 1",
      "description": "",
      "state": "open",
      "stateLabel": "New",
      "value": 3,
      "business_impact": null,
      "effort": null,
      "priority": 3.7,
      "priority_reason": "",
      "phase": "now",
      "assigned_to": "",
      "assignedName": "",
      "assignment_group": "",
      "groupName": "",
      "outcome": "",
      "gap_resolved": false,
      "rejection_reason": "",
      "assessment": "",
      "updated": "2026-10-20 10:00:00",
      "editable": false
    }
  ]
}
```

### GET /opportunities/PVO0001003
```json
{
  "id": "s31",
  "number": "PVO0001003",
  "capability": "s7",
  "capabilityName": "Cap 04",
  "type": "low_adoption",
  "typeLabel": "Low adoption",
  "short_description": "Opp 3",
  "description": "",
  "state": "open",
  "stateLabel": "New",
  "value": 3,
  "business_impact": null,
  "effort": null,
  "priority": 3.1,
  "priority_reason": "",
  "phase": "now",
  "assigned_to": "",
  "assignedName": "",
  "assignment_group": "",
  "groupName": "",
  "outcome": "",
  "gap_resolved": false,
  "rejection_reason": "",
  "assessment": "",
  "updated": "2026-10-20 10:00:00",
  "editable": false,
  "activity": [
    {
      "ts": 1793000000000,
      "user": "u1",
      "text": "Created"
    }
  ],
  "measured_value": ""
}
```

### GET /analytics?size=2
```json
{
  "run": "PVA0001002",
  "runs": [
    {
      "number": "PVA0001002",
      "date": "2026-10-27 02:00:00",
      "score": 53
    }
  ],
  "bands": {
    "high": 3,
    "medium": 3,
    "low": 2,
    "not_measured": 3
  },
  "families": [
    {
      "family": "itsm",
      "label": "ITSM",
      "count": 6,
      "scored": 4,
      "average": 50
    }
  ],
  "items": [
    {
      "capability": "s11",
      "name": "Cap 08",
      "family": "hrsd",
      "score": 90,
      "band": "high",
      "utilization": null
    }
  ],
  "total": 11,
  "page": 1,
  "size": 2,
  "start": 1,
  "end": 2
}
```

### GET /assessments?size=2
```json
{
  "items": [
    {
      "id": "s46",
      "number": "PVA0001043",
      "status": "running",
      "statusLabel": "running",
      "trigger": "",
      "triggerLabel": "",
      "run_date": "2026-10-30 10:00:00",
      "run_by": "",
      "duration": "",
      "overall_score": null,
      "scored": null,
      "not_measured": null,
      "inactive": null,
      "slow": null,
      "opportunities_created": null,
      "step": 6,
      "last_message": "gaps: 0 opportunities in 0.4 s"
    }
  ],
  "total": 3,
  "page": 1,
  "size": 2,
  "start": 1,
  "end": 2
}
```

### GET /reports
```json
{
  "run": {
    "number": "PVA0001002",
    "date": "2026-10-27 02:00:00",
    "trigger": "run_now",
    "status": "complete_with_warnings",
    "score": 53,
    "previousScore": 52.6,
    "change": 0.4,
    "checked": 11,
    "scored": 8,
    "notMeasured": 3,
    "licensedNotInstalled": 1
  },
  "headline": "Platform Value Score 53, up 0.4 since the previous run.",
  "opportunities": {
    "byState": {
      "open": 9,
      "rejected": 1,
      "done": 1,
      "accepted": 1
    },
    "active": 10,
    "phases": {
      "now": 6,
      "next": 3,
      "later": 1
    }
  },
  "outcomes": {
    "byStatus": {
      "below_target": 1,
      "on_target": 1
    },
    "total": 2
  },
  "topNow": [
    {
      "id": "s29",
      "number": "PVO0001001",
      "capability": "s5",
      "capabilityName": "Cap 02",
      "type": "low_adoption",
      "typeLabel": "Low adoption",
      "short_description": "Opp 1",
      "description": "",
      "state": "open",
      "stateLabel": "New",
      "value": 3,
      "business_impact": null,
      "effort": null,
      "priority": 3.7,
      "priority_reason": "",
      "phase": "now",
      "assigned_to": "",
      "assignedName": "",
      "assignment_group": "",
      "groupName": "",
      "outcome": "",
      "gap_resolved": false,
      "rejection_reason": "",
      "assessment": "",
      "updated": "2026-10-20 10:00:00",
      "editable": false
    }
  ],
  "running": {
    "number": "PVA0001043",
    "status": "running",
    "step": 6,
    "of": 10,
    "stepName": "gaps",
    "last_message": "gaps: 0 opportunities in 0.4 s",
    "run_date": "2026-10-30 10:00:00"
  },
  "history": [
    {
      "id": "s46",
      "number": "PVA0001043",
      "status": "running",
      "statusLabel": "running",
      "trigger": "",
      "triggerLabel": "",
      "run_date": "2026-10-30 10:00:00",
      "run_by": "",
      "duration": "",
      "overall_score": null,
      "scored": null,
      "not_measured": null,
      "inactive": null,
      "slow": null,
      "opportunities_created": null,
      "step": 6,
      "last_message": "gaps: 0 opportunities in 0.4 s"
    }
  ],
  "exports": [
    {
      "name": "executive_summary",
      "file": "pivot_executive_summary.csv",
      "url": "/api/x_enno_pivot/v1/workspace/export/executive_summary"
    }
  ]
}
```

### GET /properties
```json
{
  "items": [
    {
      "name": "x_enno_pivot.utilization_threshold",
      "short": "utilization_threshold",
      "type": "number",
      "value": "60",
      "default": "60",
      "editable": false
    },
    {
      "name": "x_enno_pivot.low_score_threshold",
      "short": "low_score_threshold",
      "type": "number",
      "value": "40",
      "default": "40",
      "editable": false
    }
  ]
}
```

### GET /search?q=cap 0
```json
{
  "q": "cap 0",
  "capabilities": [
    {
      "id": "s4",
      "number": "PVC1001",
      "name": "Cap 01"
    }
  ],
  "opportunities": [],
  "outcomes": [],
  "assessments": []
}
```

### GET /notifications
```json
{
  "items": [
    {
      "kind": "running",
      "title": "PVA0001043 is running",
      "text": "Step 6 of 10 · gaps: 0 opportunities in 0.4 s"
    },
    {
      "kind": "run",
      "title": "PIVOT run complete_with_warnings · PVA0001002",
      "text": "Platform Value Score 53, up 0.4 since the previous run."
    }
  ]
}
```

## Sign-off (PIV-063.01 AC 2)

| Role | Name | Date | Decision |
|---|---|---|---|
| UI developer | | | |
| Server developer | | | |
