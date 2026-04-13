---
name: brain-client
description: Full client profile from the organizational brain — identity, health score, open tickets, active alerts, and tech stack
arguments:
  - name: client
    description: Client name (partial match works)
    required: true
---

# Brain: Client Profile

Retrieve the full synthesized profile for a client from the organizational brain.

## Steps

1. **Call brain_get_org** with the provided client name
   - Returns: identity, health score, contacts, contracts, tech stack

2. **If health_score < 70 or open_p1_count > 0**, also call:
   - `brain_get_org_alerts` — surface unacknowledged issues
   - `brain_get_org_tickets` (limit: 5) — show most recent tickets

3. **Present the profile** in this structure:
   - **Identity**: name, tier, account manager, technical lead
   - **Health**: score (with interpretation), P1/P2 counts, critical/high alert counts, contract renewal in X days
   - **Open Issues**: any P1 tickets and critical alerts (if present)
   - **Tech Stack Highlights**: firewall, EDR, backup, MFA (from tech_stack categories)
   - **Notes**: any human-written notes from the brain

## Notes

- Data is synced on a schedule (alerts every 15m, tickets every 30m). For live data, use the source MCP directly.
- If the client is not found, try a shorter or alternate name. The brain fuzzy-matches on name and short_name.
