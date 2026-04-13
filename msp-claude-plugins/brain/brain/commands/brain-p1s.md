---
name: brain-p1s
description: All open P1 tickets across all clients right now
arguments: []
---

# Brain: Open P1 Tickets

Show all open P1 tickets across the entire client portfolio.

## Steps

1. Call `brain_cross_client_query({ query: "open_p1_tickets" })`
2. Present results as a priority triage list

## Presentation Format

```
🔴  [org_name] — [p1_count] open P1s (oldest: [oldest_p1])
    Account Manager: [account_manager]
```

Sort by p1_count descending, then oldest_p1 ascending (most urgent first).

## Follow-up

If the user wants details on a specific client's P1s:
- Call `brain_get_org_tickets(org_name: "...")` and filter to P1 priority
- Or use the Autotask/HaloPSA MCP for live ticket detail
