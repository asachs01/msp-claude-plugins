---
title: Time Entries Reference
description: Complete reference for Autotask time entry management including approval workflows, billing calculations, and API examples.
---

Time entries record work performed against tickets, projects, and tasks. This reference covers approval workflows, billing configurations, and submission best practices.

## Approval Status Codes

| Status | Name | Description | Editable | Billable |
|--------|------|-------------|----------|----------|
| `0` | Draft | Not yet submitted | Yes | No |
| `1` | Submitted | Awaiting approval | No | No |
| `2` | Approved | Ready for billing | No | Yes |
| `3` | Rejected | Returned for correction | Yes | No |

### Approval Workflow

```
Draft (0) --> Submitted (1) --> Approved (2) --> Invoiced
                   |
                   v
              Rejected (3) --> Draft (0) [corrected]
```

## Time Entry Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `resourceID` | Integer | Technician who performed work |
| `ticketID` or `taskID` | Integer | Work item association |
| `dateWorked` | Date | Date of work |
| `startDateTime` | DateTime | Work start time |
| `endDateTime` | DateTime | Work end time |
| `hoursWorked` | Decimal | Duration in hours |
| `summaryNotes` | String (8000) | Work description |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `internalNotes` | String (8000) | Internal notes (not visible to client) |
| `roleID` | Integer | Billing role |
| `billingCodeID` | Integer | Billing code |
| `contractID` | Integer | Contract to bill against |
| `showOnInvoice` | Boolean | Include on client invoice |
| `nonBillable` | Boolean | Mark as non-billable |
| `offsetHours` | Decimal | Hours to deduct (credit) |

## Billing Codes

### Common Billing Codes

| Code | Description | Rate Modifier |
|------|-------------|---------------|
| Regular | Standard work hours | 1.0x |
| After Hours | Evening/night work | 1.5x |
| Weekend | Saturday/Sunday | 1.5x |
| Holiday | Company holidays | 2.0x |
| Emergency | Urgent response | 2.0x |
| Travel | Travel time | 0.5x or 1.0x |
| Training | Client training | 1.0x |
| Project | Project work | Per project rate |

### Role-Based Billing

| Role | Typical Rate | Description |
|------|--------------|-------------|
| Help Desk | $75-100/hr | Tier 1 support |
| Systems Admin | $125-150/hr | Tier 2 support |
| Senior Engineer | $150-200/hr | Tier 3/specialist |
| Project Manager | $150-175/hr | PM activities |
| Consultant | $200-300/hr | Advisory services |

## Billing Calculations

### Standard Calculation

```
Billable Amount = Hours Worked x Billing Rate x Rate Modifier

Example:
3 hours x $150/hr x 1.5 (after hours) = $675
```

### Contract Deduction

```
Block Hours Contract:
- Starting Balance: 20 hours
- Time Entry: 3 hours
- Remaining Balance: 17 hours
- Billable: $0 (covered by contract)
```

### Overage Calculation

```
Block Hours with Overage:
- Balance: 2 hours
- Time Entry: 5 hours
- Covered: 2 hours at $0
- Overage: 3 hours at $200/hr = $600
```

## Rounding Rules

### Common Rounding Options

| Rule | Description | Example |
|------|-------------|---------|
| None | Bill exact time | 0.25 hr = 0.25 hr |
| 15 minutes | Round to nearest quarter | 0.20 hr = 0.25 hr |
| 30 minutes | Round to nearest half | 0.35 hr = 0.5 hr |
| 1 hour minimum | At least 1 hour | 0.25 hr = 1.0 hr |

### Rounding Direction

| Direction | Behavior |
|-----------|----------|
| Up | Always round up |
| Down | Always round down |
| Nearest | Round to closest |

## API Examples

### Search Time Entries by Resource

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "resourceID", "op": "eq", "value": 29682934 },
      { "field": "dateWorked", "op": "gte", "value": "2026-02-01" }
    ]
  }
}
```

### Search Time Entries by Ticket

```json
{
  "filter": {
    "field": "ticketID",
    "op": "eq",
    "value": 98765
  }
}
```

### Search Unapproved Time Entries

```json
{
  "filter": {
    "field": "approvalStatus",
    "op": "in",
    "value": [0, 1, 3]
  }
}
```

### Search This Week's Entries

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "dateWorked", "op": "gte", "value": "2026-02-03" },
      { "field": "dateWorked", "op": "lte", "value": "2026-02-07" }
    ]
  }
}
```

### Create Time Entry for Ticket

```json
{
  "resourceID": 29682934,
  "ticketID": 98765,
  "dateWorked": "2026-02-04",
  "startDateTime": "2026-02-04T09:00:00Z",
  "endDateTime": "2026-02-04T10:30:00Z",
  "hoursWorked": 1.5,
  "summaryNotes": "Diagnosed email connectivity issue. Identified expired SSL certificate on mail server. Renewed certificate and verified connectivity restored.",
  "billingCodeID": 1,
  "roleID": 2,
  "showOnInvoice": true
}
```

### Create Time Entry for Project Task

```json
{
  "resourceID": 29682934,
  "taskID": 55555,
  "dateWorked": "2026-02-04",
  "startDateTime": "2026-02-04T13:00:00Z",
  "endDateTime": "2026-02-04T17:00:00Z",
  "hoursWorked": 4,
  "summaryNotes": "Completed Azure AD Connect configuration. Verified directory sync working correctly.",
  "internalNotes": "Encountered issue with password hash sync, resolved by updating connector account permissions.",
  "roleID": 3,
  "showOnInvoice": true
}
```

### Create Non-Billable Entry

```json
{
  "resourceID": 29682934,
  "ticketID": 98765,
  "dateWorked": "2026-02-04",
  "startDateTime": "2026-02-04T11:00:00Z",
  "endDateTime": "2026-02-04T11:30:00Z",
  "hoursWorked": 0.5,
  "summaryNotes": "Internal review of ticket history",
  "nonBillable": true,
  "internalNotes": "Research for similar past issues"
}
```

## Summary Notes Best Practices

### Good Summary Notes

Include:
- What was done
- What was found/diagnosed
- What was resolved
- Any follow-up needed

```
"Investigated reported slow network performance. Ran diagnostics
and identified switch port operating at 100Mbps instead of 1Gbps.
Replaced cable and confirmed gigabit connection restored.
User confirmed performance improvement."
```

### Poor Summary Notes

Avoid:
- Vague descriptions
- Internal jargon
- Missing outcomes

```
"Worked on network issue"  // Too vague
"Fixed the thing"          // No detail
"Per ticket"               // Not helpful
```

## Approval Workflow

### Submission Checklist

| Check | Description |
|-------|-------------|
| Hours accurate | Matches actual time worked |
| Notes complete | Client-appropriate summary |
| Billing code correct | Matches work type |
| Contract selected | If applicable |
| Date correct | Matches when work performed |

### Manager Approval

| Review Item | Pass Criteria |
|-------------|---------------|
| Hours reasonable | Within expected range for task |
| Description clear | Client would understand |
| Billing appropriate | Correct code and rate |
| Contract valid | Active and has balance |

### Rejection Reasons

| Reason | Resolution |
|--------|------------|
| Insufficient detail | Expand summary notes |
| Incorrect billing | Update billing code/role |
| Wrong contract | Reassign to correct contract |
| Hours questioned | Provide justification |

## Time Entry Reports

### Common Reports

| Report | Purpose |
|--------|---------|
| Timesheet | Weekly hours by resource |
| Utilization | Billable vs non-billable |
| Contract Usage | Hours against block contracts |
| Unbilled Time | Approved but not invoiced |

### Utilization Calculation

```
Utilization % = (Billable Hours / Total Hours) x 100

Target: 70-85% utilization for technicians
```

## Common Workflows

### Daily Time Entry

1. Review completed tickets/tasks
2. Create time entries for each
3. Write clear summary notes
4. Select appropriate billing code
5. Submit for approval

### Weekly Timesheet Review

1. Query all entries for the week
2. Verify total hours reasonable
3. Check for missing entries
4. Submit any draft entries
5. Note any rejected entries

### Month-End Processing

1. Search for all unapproved entries
2. Follow up on pending approvals
3. Review rejected entries
4. Ensure all billable time approved
5. Ready for invoicing

## Related Resources

- [Tickets Reference](/msp-claude-plugins/reference/autotask/tickets/) - Ticket time entries
- [Projects Reference](/msp-claude-plugins/reference/autotask/projects/) - Project task time
- [Contracts Reference](/msp-claude-plugins/reference/autotask/contracts/) - Contract billing
- [API Patterns](/msp-claude-plugins/reference/autotask/api-patterns/) - Query operators and authentication
