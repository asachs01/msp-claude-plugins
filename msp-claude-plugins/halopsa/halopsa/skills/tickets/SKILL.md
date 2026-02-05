---
description: >
  Use this skill when working with HaloPSA tickets - creating, updating,
  searching, or managing service desk operations. Covers ticket fields,
  statuses, priorities, ticket types, actions, attachments, SLAs, and workflows.
  Essential for MSP technicians handling service delivery through HaloPSA.
triggers:
  - halopsa ticket
  - halo ticket
  - service ticket halopsa
  - create ticket halopsa
  - ticket status halo
  - ticket priority halo
  - halopsa service desk
  - halo helpdesk
  - ticket actions
  - ticket notes halopsa
  - halopsa sla
---

# HaloPSA Ticket Management

## Overview

Tickets are the core unit of service delivery in HaloPSA. Every client request, incident, problem, service request, and change flows through the ticketing system. This skill covers comprehensive ticket management including creation, updates, actions (notes), attachments, SLAs, and workflows.

## Ticket Status Codes

HaloPSA uses configurable status IDs. These are common default values:

| Status ID | Name | Description | Behavior |
|-----------|------|-------------|----------|
| **1** | New | Newly created ticket | SLA clock starts |
| **2** | In Progress | Actively being worked | Resource assigned |
| **3** | Pending | Waiting for action | May pause SLA |
| **4** | On Hold | Temporarily paused | SLA clock paused |
| **5** | Waiting on Client | Awaiting customer response | SLA clock paused |
| **6** | Waiting on Third Party | Awaiting vendor response | SLA clock paused |
| **8** | Resolved | Issue fixed, awaiting closure | - |
| **9** | Closed | Ticket complete | SLA clock stopped |

**Note:** Status IDs are configurable per instance. Query `/api/Status` to get your instance's values.

### Status Transition Flow

```
NEW (1) ──────────────────────────────> CLOSED (9)
   │                                        ↑
   ↓                                        │
IN PROGRESS (2) ──────────────────────────>─┤
   │         │                              │
   │         ↓                              │
   │    PENDING (3) ──────────────────────>─┤
   │         │                              │
   │         ↓                              │
   │    WAITING ON CLIENT (5) ────────────>─┤
   │                                        │
   ↓                                        │
RESOLVED (8) ─────────────────────────────>─┘
```

## Ticket Priority Levels

| Priority ID | Name | Response SLA | Resolution SLA | Business Context |
|-------------|------|--------------|----------------|------------------|
| **1** | Critical | 15 min | 1 hour | Complete business outage |
| **2** | High | 1 hour | 4 hours | Major productivity impact |
| **3** | Medium | 4 hours | 8 hours | Single user/workaround exists |
| **4** | Low | 8 hours | 24 hours | Minor issue/enhancement |

**Note:** Priority IDs and SLA times are configurable per instance.

## Complete Ticket Field Reference

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Auto-generated unique identifier |
| `summary` | string(255) | Yes | Brief issue summary/title |
| `details` | text | No | Detailed description (HTML supported) |
| `client_id` | int | Yes | Client/customer reference |
| `site_id` | int | No | Site/location within client |
| `user_id` | int | No | End user/contact for ticket |

### Classification Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status_id` | int | Yes | Current status |
| `priority_id` | int | Yes | Urgency level |
| `tickettype_id` | int | Yes | Ticket type (Incident, Request, etc.) |
| `category_1` | string | No | Primary category |
| `category_2` | string | No | Sub-category |
| `category_3` | string | No | Tertiary category |
| `category_4` | string | No | Fourth-level category |

### Assignment Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_id` | int | No | Assigned technician |
| `team_id` | int | No | Assigned team/group |
| `reportedby` | string | No | Who reported the issue |

### Timeline Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dateoccurred` | datetime | No | When issue occurred |
| `datecreated` | datetime | System | When ticket was created |
| `dateresponded` | datetime | System | First response timestamp |
| `dateresolved` | datetime | System | Resolution timestamp |
| `dateclosed` | datetime | System | Closure timestamp |
| `deadlinedate` | datetime | No | SLA deadline |

### SLA Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sla_id` | int | No | Associated SLA |
| `slaresponsestate` | int | System | Response SLA state |
| `slaresolutionstate` | int | System | Resolution SLA state |
| `slahold` | bool | No | Is SLA paused |

### Contract & Billing Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contract_id` | int | No | Associated contract |
| `opportunityid` | int | No | Linked opportunity |
| `chargeabletime` | decimal | System | Total billable time |
| `nonchargeabletime` | decimal | System | Total non-billable time |

## API Patterns

### Creating a Ticket

```http
POST /api/Tickets
Authorization: Bearer {token}
Content-Type: application/json
```

```json
[
  {
    "summary": "Unable to access email - multiple users affected",
    "details": "<p>Sales team (5 users) reporting Outlook showing disconnected since 9am.</p><p>Webmail working fine.</p>",
    "client_id": 123,
    "site_id": 456,
    "user_id": 789,
    "tickettype_id": 1,
    "status_id": 1,
    "priority_id": 2,
    "category_1": "Email",
    "category_2": "Outlook",
    "agent_id": 101,
    "team_id": 5
  }
]
```

**Note:** HaloPSA expects an array, even for single tickets.

### Response

```json
{
  "tickets": [
    {
      "id": 54321,
      "summary": "Unable to access email - multiple users affected",
      "client_id": 123,
      "client_name": "Acme Corporation",
      "status_id": 1,
      "status_name": "New",
      "priority_id": 2,
      "priority_name": "High",
      "datecreated": "2024-02-15T09:23:00Z"
    }
  ]
}
```

### Searching Tickets

**Basic search:**
```http
GET /api/Tickets?client_id=123&status_id=1
```

**Open tickets for client:**
```http
GET /api/Tickets?client_id=123&open_only=true
```

**Search by text:**
```http
GET /api/Tickets?search=email%20not%20working
```

**Date range:**
```http
GET /api/Tickets?dateoccurred_start=2024-02-01&dateoccurred_end=2024-02-29
```

**Paginated results:**
```http
GET /api/Tickets?page_no=1&page_size=50&order=datecreated&orderdesc=true
```

### Getting a Single Ticket

```http
GET /api/Tickets/54321
```

**With related data:**
```http
GET /api/Tickets/54321?includedetails=true&includeactions=true
```

### Updating a Ticket

```http
POST /api/Tickets
Authorization: Bearer {token}
Content-Type: application/json
```

**Update status:**
```json
[
  {
    "id": 54321,
    "status_id": 2,
    "agent_id": 101
  }
]
```

**Resolve ticket:**
```json
[
  {
    "id": 54321,
    "status_id": 8,
    "resolution": "Cleared Outlook cache and repaired Office installation."
  }
]
```

## Actions (Notes/Updates)

Actions are the activity log for a ticket - notes, time entries, emails, and status changes.

### Action Types

| Type ID | Name | Description |
|---------|------|-------------|
| 0 | Note | Internal note |
| 1 | Email | Email correspondence |
| 2 | Phone Call | Phone call log |
| 3 | Site Visit | On-site visit |
| 4 | Status Change | Status transition |

### Adding an Action

```http
POST /api/Actions
Authorization: Bearer {token}
Content-Type: application/json
```

**Internal note:**
```json
[
  {
    "ticket_id": 54321,
    "note": "<p>Initial triage: Issue started after KB5034441 update.</p>",
    "outcome": "Investigation",
    "actiontype_id": 0,
    "hiddenfromuser": true
  }
]
```

**Client-visible note:**
```json
[
  {
    "ticket_id": 54321,
    "note": "<p>We've identified the cause. A technician is working on the fix.</p>",
    "outcome": "Customer Update",
    "actiontype_id": 0,
    "hiddenfromuser": false,
    "emailto": "john.smith@acme.com"
  }
]
```

**Time entry:**
```json
[
  {
    "ticket_id": 54321,
    "note": "<p>Troubleshooting email connectivity issue.</p>",
    "timetaken": 30,
    "charge": true,
    "actiontype_id": 0,
    "agent_id": 101
  }
]
```

### Getting Ticket Actions

```http
GET /api/Actions?ticket_id=54321
```

## Attachments

### Uploading an Attachment

```http
POST /api/Attachment
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

Form data:
- `file`: The file to upload
- `ticket_id`: Associated ticket ID
- `isimage`: true/false
- `filename`: Original filename

### Listing Attachments

```http
GET /api/Attachment?ticket_id=54321
```

### Response

```json
{
  "attachments": [
    {
      "id": 111,
      "filename": "screenshot.png",
      "contenttype": "image/png",
      "filesize": 145678,
      "datecreated": "2024-02-15T09:30:00Z"
    }
  ]
}
```

## SLA Calculations

### SLA States

| State | Description |
|-------|-------------|
| 0 | Not Started |
| 1 | Running |
| 2 | Paused |
| 3 | Met |
| 4 | Breached |

### SLA Logic

```javascript
function calculateSLAStatus(ticket) {
  const now = new Date();
  const deadline = new Date(ticket.deadlinedate);

  if (ticket.status_id === 9) {
    // Closed - check if met deadline
    const resolved = new Date(ticket.dateresolved);
    return resolved <= deadline ? 'Met' : 'Breached';
  }

  if (ticket.slahold) {
    return 'Paused';
  }

  if (now > deadline) {
    return 'Breached';
  }

  const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
  if (hoursRemaining < 1) {
    return 'At Risk';
  }

  return 'On Track';
}
```

## Common Workflows

### Ticket Creation Flow

1. **Validate client exists** and has active contract
2. **Check for duplicates** - search open tickets with similar summary
3. **Auto-set defaults:**
   - Status -> New (1)
   - Priority -> Medium (3) if not specified
4. **Calculate SLA** based on priority and contract
5. **Route to team** based on category or client settings
6. **Send acknowledgment** to end user

### Status Transition Validation

```javascript
function validateStatusTransition(currentStatus, newStatus, ticket) {
  const errors = [];
  const warnings = [];

  switch (newStatus) {
    case 8: // Resolved
    case 9: // Closed
      if (!ticket.resolution) {
        errors.push('Resolution is required');
      }
      if (currentStatus === 1) {
        warnings.push('Closing without In Progress step');
      }
      break;

    case 2: // In Progress
      if (!ticket.agent_id) {
        warnings.push('No agent assigned');
      }
      break;
  }

  return {
    canTransition: errors.length === 0,
    errors,
    warnings
  };
}
```

### Escalation Workflow

1. **Identify at-risk tickets** - SLA approaching or breached
2. **Reassign to senior tech** or escalation team
3. **Update priority** if needed
4. **Add action** documenting escalation reason
5. **Notify manager** via email action

## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Invalid field value | Verify picklist IDs for your instance |
| 400 | Client ID required | All tickets need a client |
| 401 | Unauthorized | Refresh OAuth token |
| 403 | Insufficient permissions | Check API application permissions |
| 404 | Ticket not found | Confirm ticket ID exists |
| 429 | Rate limited | Implement exponential backoff |

### Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| client_id required | Missing client | All tickets need a client |
| tickettype_id invalid | Unknown type | Query `/api/TicketType` for valid IDs |
| status_id invalid | Unknown status | Query `/api/Status` for valid IDs |
| priority_id invalid | Unknown priority | Query `/api/Priority` for valid IDs |

## Best Practices

1. **Validate before creating** - Search for duplicates, verify client
2. **Use descriptive summaries** - Include who's affected and symptoms
3. **Set accurate priority** - Use impact/urgency matrix
4. **Log time promptly** - Add time entries as work happens
5. **Update status accurately** - Keeps queues accurate for reporting
6. **Document thoroughly** - Future technicians will thank you
7. **Use hidden notes for technical details** - Keep client notes professional
8. **Monitor SLAs** - Address at-risk tickets proactively

## Related Skills

- [HaloPSA Clients](../clients/SKILL.md) - Client and contact management
- [HaloPSA Contracts](../contracts/SKILL.md) - Service agreements and billing
- [HaloPSA Assets](../assets/SKILL.md) - Asset tracking
- [HaloPSA API Patterns](../api-patterns/SKILL.md) - Authentication and queries
