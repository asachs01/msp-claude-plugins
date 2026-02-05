---
description: >
  Use this skill when working with ConnectWise PSA tickets - creating, updating,
  searching, or managing service desk operations. Covers ticket fields, service
  boards, statuses, priorities, SLAs, ticket notes, and workflow automation.
  Essential for MSP technicians handling service delivery through ConnectWise PSA.
triggers:
  - connectwise ticket
  - connectwise psa ticket
  - service ticket connectwise
  - create ticket connectwise
  - ticket board
  - ticket status connectwise
  - ticket priority
  - connectwise service desk
  - ticket triage
  - escalate ticket
  - resolve ticket
  - ticket notes
  - sla calculation
  - ticket workflow
---

# ConnectWise PSA Ticket Management

## Overview

ConnectWise PSA tickets are the core unit of service delivery. Every client request, incident, problem, and change flows through the ticketing system. This skill covers comprehensive ticket management including service boards, statuses, priorities, SLAs, notes, and workflow automation.

## API Endpoint

```
Base: /service/tickets
```

## Ticket Status Values

Standard ticket statuses in ConnectWise PSA:

| Status ID | Name | Description | SLA Clock |
|-----------|------|-------------|-----------|
| `New` | New | Newly created, awaiting triage | Running |
| `In Progress` | In Progress | Actively being worked | Running |
| `Waiting Customer` | Waiting on Customer | Awaiting client response | Paused |
| `Waiting Vendor` | Waiting on Vendor | Awaiting third-party | Paused |
| `Waiting Parts` | Waiting on Parts | Awaiting hardware/materials | Paused |
| `Waiting Scheduling` | Waiting Scheduling | Needs to be scheduled | Running |
| `Completed` | Completed | Issue resolved | Stopped |
| `Closed` | Closed | Ticket closed after completion | Stopped |

**Note:** Status values are configurable per board. Query `/service/boards/{id}/statuses` for board-specific statuses.

### Status Transition Rules

```
New ────────────────────────────────> Completed
 │                                        ↑
 ↓                                        │
In Progress ─────────────────────────────>┤
 │         │                              │
 │         ↓                              │
 │    Waiting Customer ──────────────────>┤
 │         │                              │
 │         ↓                              │
 │    Waiting Vendor ───────────────────>─┘
 │
 ↓
Closed (only after Completed)
```

## Ticket Priority Levels

Standard ConnectWise PSA priorities (lower number = higher priority):

| Priority ID | Name | Response SLA | Resolution SLA | Use Case |
|-------------|------|--------------|----------------|----------|
| 1 | Priority 1 - Critical | 1 hour | 4 hours | Business down, all users affected |
| 2 | Priority 2 - High | 2 hours | 8 hours | Major impact, workaround unavailable |
| 3 | Priority 3 - Medium | 4 hours | 24 hours | Single user or workaround exists |
| 4 | Priority 4 - Low | 8 hours | 72 hours | Minor issue, enhancement request |

**Important:** Priority 1 is the HIGHEST priority (most urgent). This is opposite to some other PSA systems.

## Service Boards

Service boards organize tickets by type and workflow:

### Common Board Types

| Board | Purpose | Typical Workflow |
|-------|---------|------------------|
| Service Desk | General support tickets | New > In Progress > Completed |
| Projects | Project-related work | Linked to project tickets |
| Managed Services | Proactive/monitoring alerts | Alert > Triage > Resolution |
| Sales | Pre-sales engineering | Request > Quote > Won/Lost |

### Get Available Boards

```http
GET /service/boards
```

### Get Board Statuses

```http
GET /service/boards/{boardId}/statuses
```

## Complete Ticket Field Reference

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Auto-generated unique identifier |
| `summary` | string(100) | Yes | Brief issue description |
| `board` | object | Yes | `{id: boardId}` or `{name: "Board Name"}` |
| `company` | object | Yes | `{id: companyId}` or `{identifier: "CompanyID"}` |
| `status` | object | No | `{id: statusId}` or `{name: "Status Name"}` |
| `contact` | object | No | `{id: contactId}` |
| `site` | object | No | `{id: siteId}` |

### Classification Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `priority` | object | No | `{id: priorityId}` |
| `type` | object | No | `{id: typeId}` - Service/Problem/Incident/etc |
| `subType` | object | No | `{id: subTypeId}` |
| `item` | object | No | `{id: itemId}` - Further categorization |
| `source` | object | No | `{id: sourceId}` - Email, Phone, Portal, etc |
| `severity` | string | No | Low, Medium, High |
| `impact` | string | No | Low, Medium, High |

### Assignment Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | object | No | `{id: memberId}` - Ticket owner |
| `resources` | string | No | Assigned member (single) |
| `team` | object | No | `{id: teamId}` |
| `serviceLocation` | object | No | `{id: locationId}` |

### SLA & Timeline Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dateEntered` | datetime | System | Creation timestamp |
| `requiredDate` | datetime | No | Customer-requested deadline |
| `budgetHours` | decimal | No | Estimated hours |
| `actualHours` | decimal | System | Hours logged |
| `billTime` | string | No | Billable, DoNotBill, NoCharge |
| `sla` | object | No | SLA configuration reference |

### Resolution Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `closedDate` | datetime | System | When ticket was closed |
| `closedBy` | string | System | Member who closed |
| `closedFlag` | boolean | No | Whether ticket is closed |
| `resolution` | string | Conditional | Required when closing |

## Ticket Notes

### Note Types

| Type | Value | Visibility |
|------|-------|------------|
| Discussion | `Discussion` | Internal only |
| Internal | `Internal` | Internal only |
| Resolution | `Resolution` | Can be published |

### Add a Note

```http
POST /service/tickets/{ticketId}/notes
Content-Type: application/json

{
  "text": "Identified the issue as a DNS configuration problem.",
  "detailDescriptionFlag": false,
  "internalAnalysisFlag": true,
  "resolutionFlag": false
}
```

### Note Flags

| Flag | Purpose |
|------|---------|
| `detailDescriptionFlag` | Adds to ticket description |
| `internalAnalysisFlag` | Internal note (not visible to customer) |
| `resolutionFlag` | Resolution note (visible when ticket closed) |

## SLA Configuration

### SLA Fields on Ticket

| Field | Type | Description |
|-------|------|-------------|
| `sla/id` | int | SLA configuration ID |
| `_info/sla_respond_by` | datetime | Response SLA deadline |
| `_info/sla_plan_by` | datetime | Plan SLA deadline |
| `_info/sla_resolve_by` | datetime | Resolution SLA deadline |

### SLA Calculation Logic

```javascript
// SLA times vary by priority and agreement
const slaDefaults = {
  priority1: { respond: 1, plan: 2, resolve: 4 },   // hours
  priority2: { respond: 2, plan: 4, resolve: 8 },
  priority3: { respond: 4, plan: 8, resolve: 24 },
  priority4: { respond: 8, plan: 16, resolve: 72 }
};

// SLA clock pauses for waiting statuses
// Check agreement settings for specific behavior
```

### SLA Status Behavior

| Status Category | SLA Clock |
|-----------------|-----------|
| New/Open | Running |
| In Progress | Running |
| Waiting (Customer/Vendor/Parts) | Paused (configurable) |
| Completed/Closed | Stopped |

## API Operations

### Create Ticket

```http
POST /service/tickets
Content-Type: application/json

{
  "summary": "Unable to access email - multiple users affected",
  "board": {"id": 1},
  "company": {"id": 12345},
  "contact": {"id": 67890},
  "priority": {"id": 2},
  "status": {"name": "New"},
  "type": {"id": 1},
  "initialDescription": "Sales team (5 users) reporting Outlook disconnected since 9am. Webmail working."
}
```

### Get Ticket

```http
GET /service/tickets/{id}
```

### Update Ticket

```http
PATCH /service/tickets/{id}
Content-Type: application/json

{
  "status": {"name": "In Progress"},
  "owner": {"id": 123}
}
```

### Search Tickets

```http
GET /service/tickets?conditions=company/id=12345 and status/name!="Closed"&orderBy=priority/id asc
```

### Common Query Patterns

**Open tickets for company:**
```
conditions=company/id=12345 and closedFlag=false
```

**High priority open tickets:**
```
conditions=priority/id<=2 and closedFlag=false
```

**Tickets by date range:**
```
conditions=dateEntered>=[2024-01-01] and dateEntered<[2024-02-01]
```

**SLA-breached tickets:**
```
conditions=_info/sla_resolve_by<[2024-02-15T12:00:00Z] and closedFlag=false
```

**My assigned tickets:**
```
conditions=resources contains "jsmith" and closedFlag=false
```

## Best Practices

1. **Always specify board** - Required field that determines workflow
2. **Set accurate priority** - Use impact/urgency matrix, not everything is Priority 1
3. **Include contact** - Enables customer portal visibility and notifications
4. **Use initialDescription** - First note with full details
5. **Log time promptly** - Don't batch at end of day
6. **Update status accurately** - Keeps queues and reports accurate
7. **Add internal notes** - Document troubleshooting for future reference
8. **Check for duplicates** - Search before creating new tickets

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Board required | Missing board field | Include `board: {id: x}` |
| Company required | Missing company field | Include `company: {id: x}` |
| Invalid status | Status not on board | Query board statuses first |
| Summary too long | Exceeds 100 chars | Shorten summary, use notes for details |

## Related Skills

- [ConnectWise Companies](../companies/SKILL.md) - Company management
- [ConnectWise Contacts](../contacts/SKILL.md) - Contact management
- [ConnectWise Time Entries](../time-entries/SKILL.md) - Time tracking
- [ConnectWise API Patterns](../api-patterns/SKILL.md) - Query syntax and auth
