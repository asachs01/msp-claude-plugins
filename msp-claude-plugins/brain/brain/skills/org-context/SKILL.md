---
name: "Brain: Org Context"
description: >
  Use this skill when looking up a client in the organizational brain. Covers
  brain_get_org (full profile), brain_get_org_tickets, brain_get_org_alerts,
  brain_get_org_assets, brain_get_org_docs, and brain_get_org_tech_stack.
  Call brain_get_org first before any other brain tool when working a specific client.
when_to_use: "When the user asks about a specific client — their health, open tickets, alerts, assets, tech stack, or documentation"
triggers:
  - brain client
  - brain org
  - client profile
  - brain_get_org
  - look up client
  - client context
  - client health
  - client tech stack
---

# Brain: Org Context

## Overview

The brain's client context tools give you a complete, synthesized picture of any client in a single round of tool calls. Data is synthesized from all configured sync sources (Autotask, ITGlue, Datto RMM, etc.) and enriched with any human-written notes.

## Tool Call Order

**Always call `brain_get_org` first.** It returns the full profile — identity, health score, contacts, contracts, and tech stack summary — and is the entry point for all other client work.

```
brain_get_org(org_name: "Acme Corp")
```

Then call additional tools as needed based on what the user is asking:

| User asks about | Tool to call |
|---|---|
| Open tickets, ticket history | `brain_get_org_tickets` |
| Active alerts, unacknowledged issues | `brain_get_org_alerts` |
| Devices, servers, managed endpoints | `brain_get_org_assets` |
| Runbooks, known issues, documentation | `brain_get_org_docs` |
| Firewall, EDR, backup, MFA vendors | `brain_get_org_tech_stack` |

## Tool Reference

### brain_get_org

Returns the full client profile.

**Parameters:**
- `org_name` (string, required) — client name or short name. Fuzzy-matched — partial names work.

**Returns:**
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "short_name": "acme",
  "status": "active",
  "tier": "enterprise",
  "account_manager": "Jane Smith",
  "technical_lead": "Bob Jones",
  "notes": "...",
  "health": {
    "health_score": 72,
    "open_p1_count": 0,
    "open_p2_count": 2,
    "critical_alert_count": 1,
    "high_alert_count": 3,
    "contract_renewal_days": 45,
    "ticket_velocity_7d": 12,
    "last_computed": "2026-04-13T..."
  },
  "contacts": [...],
  "contracts": [...],
  "tech_stack": [...]
}
```

**Health score interpretation:**
- 90–100: Healthy
- 70–89: Minor issues
- 50–69: Needs attention
- 0–49: At risk

### brain_get_org_tickets

**Parameters:**
- `org_name` (string, required)
- `limit` (number, optional, default 20)
- `offset` (number, optional)

Returns tickets ordered newest first. Shows both open and recently closed.

### brain_get_org_alerts

**Parameters:**
- `org_name` (string, required)
- `limit` (number, optional, default 20)

Returns only unacknowledged alerts, sorted by severity (critical → high → medium → low).

### brain_get_org_assets

**Parameters:**
- `org_name` (string, required)
- `limit` (number, optional, default 50)

Returns all managed assets (devices, servers, network gear) from all configured RMM sources.

### brain_get_org_docs

**Parameters:**
- `org_name` (string, required)
- `limit` (number, optional, default 20)

Returns documentation with summaries and links back to ITGlue/Hudu.

### brain_get_org_tech_stack

**Parameters:**
- `org_name` (string, required)
- `category` (string, optional) — filter by: `firewall`, `endpoint`, `backup`, `email_security`, `psa`, `rmm`, `identity`, `cloud`

## Patterns

### Full client briefing

```
Call brain_get_org to get the profile.
If health_score < 70, also call brain_get_org_alerts and brain_get_org_tickets.
Summarize: identity → health → open issues → tech stack highlights.
```

### Pre-call prep

```
Call brain_get_org.
Call brain_get_org_tickets(limit: 5) for recent context.
Call brain_get_org_alerts to surface any unacknowledged issues.
Present as: "Here's what you need to know before talking to [client]."
```

### Checking MFA coverage

```
Call brain_get_org_tech_stack(category: "identity").
If empty: flag as no MFA/identity solution detected.
```

## Data Freshness

The brain syncs on a schedule (alerts every 15m, tickets every 30m, assets every 2h, orgs every 4h). Data may lag by up to the sync cadence. If you need live data, use the source-system MCP directly (Autotask MCP, ITGlue MCP, etc.) and use the brain for context and history.
