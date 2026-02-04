---
title: Tickets Reference
description: Complete reference for Autotask ticket management including status codes, priorities, SLA rules, and API examples.
---

Tickets are the core work unit in Autotask PSA. This reference covers status codes, priority levels, SLA management, and API patterns for ticket operations.

## Status Codes

| Status ID | Name | Description | Billable |
|-----------|------|-------------|----------|
| `1` | New | Ticket created, not yet assigned | No |
| `5` | In Progress | Work actively being performed | Yes |
| `7` | Waiting Customer | Blocked pending customer response | No |
| `8` | Escalated | Elevated to higher tier support | Yes |
| `10` | Complete | Work finished, pending closure | No |

### Status Transitions

```
New (1) --> In Progress (5) --> Complete (10)
              |       ^
              v       |
        Waiting Customer (7)
              |
              v
        Escalated (8) --> In Progress (5)
```

### Status Rules

- **New to In Progress**: Requires resource assignment
- **In Progress to Waiting Customer**: SLA clock pauses
- **Waiting Customer to In Progress**: SLA clock resumes
- **Escalated**: Does not pause SLA unless configured
- **Complete**: Ticket can be reopened within 7 days (configurable)

## Priority Levels

| Priority ID | Name | Target Response | Target Resolution | Color |
|-------------|------|-----------------|-------------------|-------|
| `1` | Critical | 15 minutes | 4 hours | Red |
| `2` | High | 1 hour | 8 hours | Orange |
| `3` | Medium | 4 hours | 24 hours | Yellow |
| `4` | Low | 8 hours | 72 hours | Green |

### Priority Selection Guide

| Scenario | Priority | Rationale |
|----------|----------|-----------|
| Server down, all users affected | Critical (1) | Business-critical outage |
| Email not working for department | High (2) | Multiple users, core service |
| Single user printer issue | Medium (3) | Single user, workaround exists |
| Feature request or enhancement | Low (4) | No immediate impact |

## SLA Rules

### Clock Behavior

| Event | SLA Impact |
|-------|------------|
| Ticket created | Clock starts |
| Status = Waiting Customer | Clock pauses |
| Status = In Progress (from Waiting) | Clock resumes |
| First response logged | Response SLA met |
| Status = Complete | Resolution SLA evaluated |

### SLA Calculation

```
Total SLA Time = Active Time (excluding paused periods)

Example:
- Created: 9:00 AM
- Set to Waiting Customer: 10:00 AM (1 hour elapsed)
- Customer responds: 2:00 PM
- Set to In Progress: 2:00 PM (clock resumes)
- Completed: 4:00 PM (2 more hours)
- Total SLA Time: 3 hours
```

## Field Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `companyID` | Integer | Parent company ID |
| `title` | String (255) | Ticket subject line |
| `status` | Integer | Status code (see above) |
| `priority` | Integer | Priority level (see above) |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | String (8000) | Detailed description |
| `assignedResourceID` | Integer | Assigned technician |
| `queueID` | Integer | Service queue |
| `issueType` | Integer | Category/type |
| `subIssueType` | Integer | Sub-category |
| `dueDateTime` | DateTime | Due date |
| `estimatedHours` | Decimal | Estimated work hours |
| `contractID` | Integer | Associated contract |
| `contactID` | Integer | Customer contact |

## API Examples

### Search Tickets

```json
{
  "filter": {
    "field": "status",
    "op": "ne",
    "value": 10
  },
  "maxRecords": 50
}
```

### Search by Company

```json
{
  "filter": {
    "field": "companyID",
    "op": "eq",
    "value": 12345
  }
}
```

### Search High Priority Open Tickets

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "priority", "op": "in", "value": [1, 2] },
      { "field": "status", "op": "ne", "value": 10 }
    ]
  }
}
```

### Create Ticket

```json
{
  "companyID": 12345,
  "title": "Email not working for sales team",
  "description": "Multiple users reporting Outlook connection errors since 9am",
  "priority": 2,
  "status": 1,
  "queueID": 29682834,
  "issueType": 15,
  "contactID": 67890
}
```

### Update Ticket Status

```json
{
  "id": 98765,
  "status": 5,
  "assignedResourceID": 11111
}
```

## Queue Reference

Tickets are organized into queues for routing and reporting:

| Queue Type | Purpose |
|------------|---------|
| Triage | New tickets awaiting assignment |
| Tier 1 | Help desk / first response |
| Tier 2 | Advanced technical support |
| Tier 3 | Engineering / escalation |
| Projects | Project-related work |
| Alerts | Automated monitoring alerts |

## Common Workflows

### Ticket Triage

1. Search for New (status=1) tickets in Triage queue
2. Review priority based on impact/urgency
3. Assign to appropriate queue and resource
4. Update status to In Progress (5)

### Escalation

1. Update ticket priority if needed
2. Set status to Escalated (8)
3. Add internal note with escalation reason
4. Assign to escalation queue/resource

### Resolution

1. Perform work and log time entries
2. Add resolution notes
3. Set status to Complete (10)
4. Notify customer if configured

## Related Resources

- [Time Entries Reference](/msp-claude-plugins/reference/autotask/time-entries/) - Logging work on tickets
- [CRM Reference](/msp-claude-plugins/reference/autotask/crm/) - Company and contact lookups
- [API Patterns](/msp-claude-plugins/reference/autotask/api-patterns/) - Query operators and authentication
