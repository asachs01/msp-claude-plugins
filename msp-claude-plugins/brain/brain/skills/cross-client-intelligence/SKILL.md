---
name: "Brain: Cross-Client Intelligence"
description: >
  Use this skill for MSP-wide queries that span all clients — expiring contracts,
  open P1 tickets, clients without MFA, health rankings, unacknowledged critical alerts,
  and vendor adoption analysis. Uses brain_cross_client_query and brain_query.
when_to_use: "When the user asks about patterns across all clients, not a specific one — risk exposure, portfolio health, contract renewals, vendor coverage"
triggers:
  - brain cross client
  - all clients
  - portfolio health
  - expiring contracts
  - clients without mfa
  - open p1s
  - brain_cross_client_query
  - msp intelligence
  - risk exposure
  - which clients
---

# Brain: Cross-Client Intelligence

## Overview

The brain's cross-client tools let you ask questions that span your entire client portfolio. These are the queries that are impossible to answer without synthesized data — "which clients don't have MFA?", "who has P1s open right now?", "whose contracts are expiring this month?"

## Predefined Queries

Use `brain_cross_client_query` with one of these built-in query names:

| Query name | What it returns |
|---|---|
| `clients_without_mfa` | Active clients with no identity/MFA entry in tech stack |
| `expiring_contracts` | Active contracts expiring within 30 days |
| `open_p1_tickets` | Clients with open P1 tickets, ordered by count |
| `clients_by_health` | All active clients ranked by health score (worst first, top 50) |
| `unacknowledged_critical_alerts` | Critical and high alerts not yet acknowledged |
| `clients_by_vendor` | Clients using a specific vendor (requires `vendor` param) |
| `stale_syncs` | Data sources that haven't synced in over 6 hours |

### Examples

```
brain_cross_client_query({ query: "clients_without_mfa" })
brain_cross_client_query({ query: "expiring_contracts" })
brain_cross_client_query({ query: "open_p1_tickets" })
brain_cross_client_query({ query: "clients_by_health" })
brain_cross_client_query({ query: "clients_by_vendor", vendor: "SentinelOne" })
```

## Ad-hoc SQL Queries

For questions not covered by predefined queries, use `brain_query`:

**Parameters:**
- `sql` (string, required) — a SELECT statement. No UPDATE/DELETE/INSERT/DROP/WITH allowed.
- `limit` (number, optional, default 100, max 1000)

**Available tables:**
- `organizations` — clients (name, tier, account_manager, status, health_score via join)
- `tickets` — source, priority, status, created_at
- `alerts` — source, severity, acknowledged, device_name
- `assets` — type, os, last_seen, rmm_agent
- `tech_stack` — category, vendor, product
- `contracts` — renewal_date, monthly_value, status
- `documentation` — title, summary, url
- `contacts` — name, email, role
- `org_health` — health_score, open_p1_count, critical_alert_count, etc.
- `sync_state` — last_synced_at, record_count, last_error per source

### Example ad-hoc queries

```sql
-- Clients by tier with health scores
SELECT o.name, o.tier, o.account_manager, h.health_score
FROM organizations o
JOIN org_health h ON h.org_id = o.id
WHERE o.status = 'active'
ORDER BY o.tier, h.health_score ASC

-- Clients running a specific OS version
SELECT o.name, a.os, a.os_version, COUNT(*) as device_count
FROM assets a
JOIN organizations o ON a.org_id = o.id
WHERE a.os_version ILIKE '%Windows 10%'
GROUP BY o.name, a.os, a.os_version
ORDER BY device_count DESC

-- Clients with no tickets in 90 days (churn risk signal)
SELECT o.name, o.account_manager, o.tier
FROM organizations o
WHERE o.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tickets t
    WHERE t.org_id = o.id
      AND t.created_at > NOW() - INTERVAL '90 days'
  )
```

## Workflow Patterns

### Weekly account manager briefing

```
1. brain_cross_client_query({ query: "clients_by_health" })
   → Surface the 5 worst-scoring clients
2. brain_cross_client_query({ query: "expiring_contracts" })
   → Flag renewal conversations needed
3. brain_cross_client_query({ query: "open_p1_tickets" })
   → Identify fire-fighting situations
```

### Security posture review

```
1. brain_cross_client_query({ query: "clients_without_mfa" })
   → Identify gaps for upsell/risk conversation
2. brain_cross_client_query({ query: "unacknowledged_critical_alerts" })
   → Triage unaddressed critical issues
3. brain_cross_client_query({ query: "clients_by_vendor", vendor: "CrowdStrike" })
   → Validate EDR coverage
```

### Vendor consolidation analysis

```
brain_cross_client_query({ query: "clients_by_vendor", vendor: "Datto" })
brain_cross_client_query({ query: "clients_by_vendor", vendor: "Veeam" })
→ Compare backup vendor distribution across portfolio
```
