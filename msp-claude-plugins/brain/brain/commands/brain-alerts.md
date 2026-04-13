---
name: brain-alerts
description: Active unacknowledged alerts — across all clients or for a specific client
arguments:
  - name: client
    description: Client name to filter by (omit for all clients)
    required: false
  - name: severity
    description: Filter by severity — critical, high, medium, low
    required: false
---

# Brain: Active Alerts

Surface unacknowledged alerts from the organizational brain.

## Steps

**If client is provided:**
1. Call `brain_get_org_alerts(org_name: client)`
2. Present alerts grouped by severity, with device name and source

**If no client provided (all clients):**
1. Call `brain_cross_client_query({ query: "unacknowledged_critical_alerts" })`
2. Present as a triage list: client name → alert title → severity → device → age

## Presentation Format

```
⚠️  CRITICAL — [device_name] — [title]
    Client: [org_name] | Source: [source] | Since: [created_at]

🔶  HIGH — [device_name] — [title]
    ...
```

## Notes

- Only unacknowledged alerts are shown. Resolved/acknowledged alerts are filtered out.
- The cross-client query covers critical and high severity only. For medium/low across all clients, use `brain_query` with a custom SQL.
- Alerts sync from RMM (Datto, NinjaOne) and security tools every 15 minutes.
