---
name: brain-expiring
description: Contracts expiring within 30 days across all clients
arguments: []
---

# Brain: Expiring Contracts

Show active contracts expiring within 30 days.

## Steps

1. Call `brain_cross_client_query({ query: "expiring_contracts" })`
2. Present as a renewal action list

## Presentation Format

```
📋  [org_name] — [contract_name]
    Renews: [renewal_date] ([X days away])
    Value: $[monthly_value]/mo
    Account Manager: [account_manager]
```

Sort by renewal_date ascending (most urgent first).

## Notes

- Only `active` status contracts are included.
- Monthly value may be null if not recorded in the PSA.
- For renewal action, use the Autotask or HaloPSA MCP to update contract terms.
