---
title: Projects Reference
description: Complete reference for Autotask project management including phases, tasks, resources, and API examples.
---

Projects in Autotask track larger initiatives with defined scope, timeline, and budget. This reference covers project structure, phases, tasks, and resource management.

## Project Structure

```
Project
    |
    +-- Phase 1: Planning
    |       +-- Task 1.1: Requirements gathering
    |       +-- Task 1.2: Architecture design
    |
    +-- Phase 2: Implementation
    |       +-- Task 2.1: Development
    |       +-- Task 2.2: Testing
    |
    +-- Phase 3: Deployment
            +-- Task 3.1: Migration
            +-- Task 3.2: Training
```

## Project Status Codes

| Status ID | Name | Description |
|-----------|------|-------------|
| `1` | New | Project created, not started |
| `2` | In Progress | Active work underway |
| `3` | Complete | All work finished |
| `4` | On Hold | Temporarily paused |
| `5` | Cancelled | Project terminated |

## Project Types

| Type | Description | Billing |
|------|-------------|---------|
| Fixed Price | Set price regardless of hours | Project total |
| Time & Materials | Bill for actual hours | Per time entry |
| Retainer | Against prepaid hours | Deduct from balance |
| Internal | Non-billable | None |

## Project Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `companyID` | Integer | Client company |
| `projectName` | String (100) | Project name |
| `type` | Integer | Project type |
| `status` | Integer | Status code |
| `startDateTime` | DateTime | Project start |
| `endDateTime` | DateTime | Project end |
| `projectLeadResourceID` | Integer | Project manager |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | String (2000) | Project description |
| `estimatedHours` | Decimal | Total estimated hours |
| `estimatedRevenue` | Decimal | Projected revenue |
| `purchaseOrderNumber` | String (50) | Client PO number |
| `department` | Integer | Department assignment |
| `contractID` | Integer | Associated contract |
| `organizationalLevelAssociationID` | Integer | Business unit |

## Phases

### Phase Fields

| Field | Type | Description |
|-------|------|-------------|
| `projectID` | Integer | Parent project |
| `title` | String (255) | Phase name |
| `description` | String (2000) | Phase description |
| `startDate` | DateTime | Phase start |
| `dueDate` | DateTime | Phase end |
| `estimatedHours` | Decimal | Phase hours |
| `parentPhaseID` | Integer | Parent phase (for sub-phases) |

### Phase Dependencies

Phases can have dependencies to enforce sequencing:

| Dependency Type | Description |
|-----------------|-------------|
| Finish-to-Start | Phase B starts after Phase A ends |
| Start-to-Start | Phase B starts when Phase A starts |
| Finish-to-Finish | Phase B ends when Phase A ends |

## Tasks

### Task Status Codes

| Status ID | Name | Description |
|-----------|------|-------------|
| `1` | New | Not started |
| `2` | In Progress | Work underway |
| `3` | Complete | Finished |
| `4` | Cancelled | Not proceeding |

### Task Fields

| Field | Type | Description |
|-------|------|-------------|
| `projectID` | Integer | Parent project |
| `phaseID` | Integer | Parent phase (optional) |
| `title` | String (255) | Task name |
| `description` | String (8000) | Task details |
| `status` | Integer | Task status |
| `assignedResourceID` | Integer | Assigned technician |
| `estimatedHours` | Decimal | Estimated hours |
| `startDateTime` | DateTime | Task start |
| `endDateTime` | DateTime | Task end |
| `priority` | Integer | Priority level |

### Task Types

| Type | Description |
|------|-------------|
| Standard | Regular task with hours |
| Milestone | Zero-duration checkpoint |
| Meeting | Scheduled meeting |
| Deliverable | Client-facing output |

## Resource Assignments

### Assignment Fields

| Field | Type | Description |
|-------|------|-------------|
| `resourceID` | Integer | Team member |
| `projectID` | Integer | Project |
| `roleID` | Integer | Role on project |
| `allocatedHours` | Decimal | Hours allocated |
| `startDateTime` | DateTime | Assignment start |
| `endDateTime` | DateTime | Assignment end |

### Common Roles

| Role | Description | Typical Rate |
|------|-------------|--------------|
| Project Manager | Overall coordination | Higher |
| Senior Engineer | Technical lead | Higher |
| Engineer | Implementation | Standard |
| Junior Engineer | Support work | Lower |
| QA Specialist | Testing | Standard |

## API Examples

### Search Projects

```json
{
  "filter": {
    "field": "status",
    "op": "eq",
    "value": 2
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

### Search Active Projects for Resource

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "projectLeadResourceID", "op": "eq", "value": 29682934 },
      { "field": "status", "op": "eq", "value": 2 }
    ]
  }
}
```

### Create Project

```json
{
  "companyID": 12345,
  "projectName": "Office 365 Migration",
  "type": 1,
  "status": 1,
  "startDateTime": "2026-02-10T09:00:00Z",
  "endDateTime": "2026-03-15T17:00:00Z",
  "projectLeadResourceID": 29682934,
  "description": "Migrate 50 users from on-premises Exchange to Office 365",
  "estimatedHours": 80,
  "estimatedRevenue": 12000
}
```

### Create Task

```json
{
  "projectID": 98765,
  "phaseID": 11111,
  "title": "Configure Azure AD Connect",
  "description": "Set up directory synchronization between on-prem AD and Azure AD",
  "status": 1,
  "assignedResourceID": 29682934,
  "estimatedHours": 4,
  "startDateTime": "2026-02-12T09:00:00Z",
  "endDateTime": "2026-02-12T13:00:00Z",
  "priority": 2
}
```

### Update Task Status

```json
{
  "id": 55555,
  "status": 3,
  "actualHours": 5
}
```

## Budget Tracking

### Budget Fields

| Field | Type | Description |
|-------|------|-------------|
| `estimatedHours` | Decimal | Planned hours |
| `actualHours` | Decimal | Hours logged |
| `estimatedRevenue` | Decimal | Planned revenue |
| `actualRevenue` | Decimal | Billed amount |

### Budget Calculations

```
Remaining Hours = Estimated Hours - Actual Hours
Budget Variance = Estimated Revenue - Actual Revenue
Burn Rate = Actual Hours / Estimated Hours * 100
```

### Budget Alerts

| Threshold | Action |
|-----------|--------|
| 75% hours consumed | Review remaining scope |
| 90% hours consumed | Escalate to PM |
| 100% hours consumed | Change order required |

## Common Workflows

### Project Kickoff

1. Create project with status = New (1)
2. Define phases with dependencies
3. Create tasks under each phase
4. Assign resources to tasks
5. Set status to In Progress (2)

### Task Completion

1. Log time entries against task
2. Update task progress notes
3. Set task status to Complete (3)
4. Verify phase completion
5. Notify project lead

### Project Closeout

1. Verify all tasks complete
2. Review budget vs actual
3. Generate final report
4. Set status to Complete (3)
5. Archive project documentation

## Project Notes

| Field | Type | Description |
|-------|------|-------------|
| `projectID` | Integer | Parent project |
| `title` | String (250) | Note title |
| `description` | String (32000) | Note content |
| `noteType` | Integer | Type classification |
| `publish` | Integer | Internal/external visibility |

## Related Resources

- [Time Entries Reference](/msp-claude-plugins/reference/autotask/time-entries/) - Logging project hours
- [Contracts Reference](/msp-claude-plugins/reference/autotask/contracts/) - Project billing agreements
- [CRM Reference](/msp-claude-plugins/reference/autotask/crm/) - Client company details
- [API Patterns](/msp-claude-plugins/reference/autotask/api-patterns/) - Query operators and authentication
