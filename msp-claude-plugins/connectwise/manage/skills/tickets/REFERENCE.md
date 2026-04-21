# ConnectWise PSA Ticket — Reference Tables

Status values, priority levels, service boards, SLA configuration, note types, and status transition rules. For quick-start usage see [SKILL.md](./SKILL.md).

---

## Ticket Status Values

Status values are configurable per board. Query `GET /service/boards/{id}/statuses` for board-specific values.

| Status | SLA Clock | Notes |
|--------|-----------|-------|
| `New` | Running | Awaiting triage |
| `In Progress` | Running | Actively being worked |
| `Waiting Customer` | Paused | Awaiting client response |
| `Waiting Vendor` | Paused | Awaiting third-party |
| `Waiting Parts` | Paused | Awaiting hardware/materials |
| `Waiting Scheduling` | Running | Needs to be scheduled |
| `Completed` | Stopped | Issue resolved |
| `Closed` | Stopped | Only after Completed |

### Status Transition Rules

```
New ────────────────────────────────> Completed
 │                                        |
 v                                        |
In Progress ─────────────────────────────>|
 │         │                              |
 │         v                              |
 │    Waiting Customer ──────────────────>|
 │         │                              |
 │         v                              |
 │    Waiting Vendor ────────────────────>┘
 │
 v
Closed (only after Completed)
```

---

## Ticket Priority Levels

Lower number = higher priority. **Priority 1 is the most urgent** (opposite to some other PSA systems).

| ID | Name | Response SLA | Resolution SLA | Use Case |
|----|------|--------------|----------------|----------|
| 1 | Critical | 1 hour | 4 hours | Business down, all users affected |
| 2 | High | 2 hours | 8 hours | Major impact, no workaround |
| 3 | Medium | 4 hours | 24 hours | Single user or workaround exists |
| 4 | Low | 8 hours | 72 hours | Minor issue, enhancement request |

---

## Service Boards

Boards organize tickets by type and workflow. Query available boards: `GET /service/boards`.

| Board | Purpose | Typical Flow |
|-------|---------|--------------|
| Service Desk | General support | New > In Progress > Completed |
| Projects | Project work | Linked to project tickets |
| Managed Services | Monitoring alerts | Alert > Triage > Resolution |
| Sales | Pre-sales engineering | Request > Quote > Won/Lost |

Get board-specific statuses: `GET /service/boards/{boardId}/statuses`

---

## Note Types & Flags

### Note Types

| Type | Visibility |
|------|------------|
| `Discussion` | Internal only |
| `Internal` | Internal only |
| `Resolution` | Can be published to customer |

### Note Flags

| Flag | Purpose |
|------|---------|
| `detailDescriptionFlag` | Appends to ticket description |
| `internalAnalysisFlag` | Internal note (not visible to customer) |
| `resolutionFlag` | Resolution note (visible when ticket closed) |

---

## SLA Configuration

### SLA Defaults by Priority

| Priority | Respond | Plan | Resolve |
|----------|---------|------|---------|
| 1 — Critical | 1 hr | 2 hr | 4 hr |
| 2 — High | 2 hr | 4 hr | 8 hr |
| 3 — Medium | 4 hr | 8 hr | 24 hr |
| 4 — Low | 8 hr | 16 hr | 72 hr |

### SLA Clock Behavior

| Status Category | SLA Clock |
|-----------------|-----------|
| New / In Progress | Running |
| Waiting (Customer/Vendor/Parts) | Paused (configurable per agreement) |
| Completed / Closed | Stopped |

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Board required | Missing `board` field | Include `board: {id: x}` |
| Company required | Missing `company` field | Include `company: {id: x}` |
| Invalid status | Status not on board | Query board statuses first |
| Summary too long | Exceeds 100 chars | Shorten summary; use notes for details |
