# HaloPSA Ticket Reference

## Status Codes

Default status IDs (configurable per instance -- query `/api/Status` for actual values):

| Status ID | Name | SLA Behavior |
|-----------|------|--------------|
| **1** | New | Clock starts |
| **2** | In Progress | Running |
| **3** | Pending | May pause |
| **4** | On Hold | Clock paused |
| **5** | Waiting on Client | Clock paused |
| **6** | Waiting on Third Party | Clock paused |
| **8** | Resolved | -- |
| **9** | Closed | Clock stopped |

### Status Transition Flow

```
NEW (1) ──────────────────────────────> CLOSED (9)
   │                                        ^
   v                                        |
IN PROGRESS (2) ──────────────────────────>─┤
   │         │                              |
   │         v                              |
   │    PENDING (3) ──────────────────────>─┤
   │         │                              |
   │         v                              |
   │    WAITING ON CLIENT (5) ────────────>─┤
   │                                        |
   v                                        |
RESOLVED (8) ─────────────────────────────>─┘
```

## Priority Levels

Default priority IDs (configurable per instance -- query `/api/Priority` for actual values):

| Priority ID | Name | Response SLA | Resolution SLA | Context |
|-------------|------|--------------|----------------|---------|
| **1** | Critical | 15 min | 1 hour | Complete business outage |
| **2** | High | 1 hour | 4 hours | Major productivity impact |
| **3** | Medium | 4 hours | 8 hours | Single user/workaround exists |
| **4** | Low | 8 hours | 24 hours | Minor issue/enhancement |

## Action Types

| Type ID | Name | Description |
|---------|------|-------------|
| 0 | Note | Internal note |
| 1 | Email | Email correspondence |
| 2 | Phone Call | Phone call log |
| 3 | Site Visit | On-site visit |
| 4 | Status Change | Status transition |

## SLA States

| State | Description |
|-------|-------------|
| 0 | Not Started |
| 1 | Running |
| 2 | Paused |
| 3 | Met |
| 4 | Breached |

## SLA Evaluation Logic

- **Closed ticket**: compare `dateresolved` against `deadlinedate` to determine Met vs Breached
- **SLA on hold** (`slahold=true`): Paused
- **Past deadline**: Breached
- **Under 1 hour remaining**: At Risk
- Otherwise: On Track
