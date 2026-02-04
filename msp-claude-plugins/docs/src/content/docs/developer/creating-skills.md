---
title: Creating Skills
description: How to create skill files that teach Claude domain knowledge for MSP workflows
---

Skills are markdown files that provide Claude with domain knowledge about specific topics. When a user's request matches skill triggers, Claude loads that knowledge into its context to provide informed assistance.

## Skill File Structure

Skills are stored in topic-specific directories:

```
vendor/product/skills/
├── tickets/
│   └── SKILL.md
├── crm/
│   └── SKILL.md
├── projects/
│   └── SKILL.md
└── time-entries/
    └── SKILL.md
```

## Frontmatter Schema

Every skill file begins with YAML frontmatter that defines when the skill should be activated:

```yaml
---
description: >
  Use this skill when working with Autotask tickets - creating, updating,
  searching, or managing service desk operations. Covers ticket fields,
  queues, statuses, priorities, SLAs, escalation rules, and workflow automations.
triggers:
  - autotask ticket
  - service ticket
  - create ticket autotask
  - ticket queue
  - ticket status
  - ticket priority
  - autotask service desk
  - ticket triage
  - escalate ticket
  - resolve ticket
---
```

### Description Field

The `description` field should:

- Start with "Use this skill when..."
- List specific scenarios that trigger this skill
- Summarize what knowledge the skill provides
- Be 2-4 sentences

### Triggers Field

The `triggers` array contains keywords and phrases that activate the skill:

- Include the vendor/product name with the entity
- Add common variations and synonyms
- Include action-based triggers (create, search, update)
- Include concept-based triggers (queue, status, SLA)
- Aim for 10-20 relevant triggers

## Content Structure

After frontmatter, structure the skill content with these sections:

### 1. Title and Overview

```markdown
# Autotask Ticket Management

## Overview

Autotask tickets are the core unit of service delivery in the PSA. Every client
request, incident, problem, and change flows through the ticketing system. This
skill covers comprehensive ticket management including business logic, SLA
calculations, escalation rules, and performance metrics.
```

### 2. Reference Data Tables

Provide complete reference tables for status codes, priorities, and other enumerations:

```markdown
## Ticket Status Codes

| Status ID | Name | Description | Business Logic |
|-----------|------|-------------|----------------|
| **1** | NEW | Newly created ticket | Default for new tickets, SLA clock starts |
| **2** | IN_PROGRESS | Actively being worked | Resource should be assigned |
| **5** | COMPLETE | Issue resolved | Requires resolution field, stops SLA |
| **6** | WAITING_CUSTOMER | Awaiting customer response | SLA clock may pause |
```

### 3. Field Reference

Document all relevant fields with types and requirements:

```markdown
## Complete Field Reference

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Auto-generated unique identifier |
| `ticketNumber` | string | System | Human-readable (e.g., T20240215.0001) |
| `title` | string(255) | Yes | Brief issue summary |
| `description` | text | No | Detailed description |
| `companyID` | int | Yes | Company/account reference |
```

### 4. Business Logic

Include workflow diagrams, validation rules, and state transitions:

```markdown
## Status Transition Rules

```
NEW (1) ─────────────────────────────> COMPLETE (5)
   │                                        ↑
   ↓                                        │
IN_PROGRESS (2) ───────────────────────────>─┤
   │         │                              │
   │         ↓                              │
   │    WAITING_CUSTOMER (6) ──────────────>─┤
```

**Validation Rules:**
- Completing directly from NEW generates a warning
- COMPLETE requires resolution field
- ESCALATED requires escalation reason
```

### 5. Code Examples

Provide practical code for common calculations and validations:

```markdown
## SLA Calculation Logic

```javascript
function calculateSLADueDate(ticket, contractSLA) {
  const now = new Date();
  const priority = ticket.priority || 2;

  const responseHours = contractSLA?.responseTimeHours
    || SLA_DEFAULTS[priority].response;
  const resolutionHours = contractSLA?.resolutionTimeHours
    || SLA_DEFAULTS[priority].resolution;

  return {
    responseBy: addHours(now, responseHours),
    resolveBy: addHours(now, resolutionHours),
    businessHoursOnly: true
  };
}
```
```

### 6. API Patterns

Show concrete API request and response examples:

```markdown
## API Patterns

### Creating a Ticket

```http
POST /v1.0/Tickets
Content-Type: application/json
```

```json
{
  "companyID": 12345,
  "title": "Unable to access email - multiple users affected",
  "description": "Sales team (5 users) reporting Outlook disconnected since 9am.",
  "queueID": 8,
  "priority": 3,
  "status": 1,
  "issueType": 5,
  "contactID": 67890
}
```

### Query Builder Pattern

```json
{
  "filter": [
    {"field": "companyID", "op": "eq", "value": 12345},
    {"field": "status", "op": "noteq", "value": 5}
  ],
  "includeFields": ["Company.companyName", "AssignedResource.firstName"]
}
```
```

### 7. Common Workflows

Describe step-by-step procedures:

```markdown
## Common Workflows

### Ticket Creation Flow

1. **Validate company exists** and has active contract
2. **Check for duplicates** - search open tickets with similar title
3. **Auto-set defaults:**
   - Status -> NEW (1)
   - Priority -> MEDIUM (2) if not specified
4. **Calculate SLA** based on priority and contract
5. **Route to queue** based on issue type
6. **Send acknowledgment** to contact
```

### 8. Error Handling

Document common errors and resolutions:

```markdown
## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Invalid field value | Verify picklist IDs for your instance |
| 400 | Status transition not allowed | Check workflow rules |
| 401 | Unauthorized | Verify API credentials |
| 404 | Entity not found | Confirm ticket/company exists |
| 429 | Rate limited | Implement exponential backoff |
```

### 9. Best Practices

Provide actionable recommendations:

```markdown
## Best Practices

1. **Validate before creating** - Search for duplicates, verify company/contract
2. **Use descriptive titles** - Include who's affected and symptoms
3. **Set accurate priority** - Use impact/urgency matrix
4. **Log time immediately** - Don't batch at end of day
5. **Update status promptly** - Keeps queues accurate for reporting
6. **Document thoroughly** - Future technicians will thank you
```

### 10. Related Skills

Link to other relevant skills:

```markdown
## Related Skills

- [Autotask CRM](../crm/SKILL.md) - Company and contact management
- [Autotask Contracts](../contracts/SKILL.md) - Service agreements and billing
- [Autotask Time Entries](../time-entries/SKILL.md) - Time tracking and billing
```

## Complete Example

Here is a condensed example of a well-structured skill file:

```markdown
---
description: >
  Use this skill when working with Autotask configuration items (assets) -
  tracking hardware, software, and managed devices. Covers CI fields,
  categories, warranties, and relationships to companies and contracts.
triggers:
  - autotask configuration item
  - autotask asset
  - managed device
  - hardware inventory
  - CI management
  - asset tracking
  - warranty lookup
---

# Autotask Configuration Items

## Overview

Configuration Items (CIs) in Autotask represent managed assets including
hardware, software, and network devices. CIs link to companies, contracts,
and tickets to provide complete service context.

## CI Categories

| Category ID | Name | Common Use |
|-------------|------|------------|
| 1 | Workstation | Desktop PCs, laptops |
| 2 | Server | Physical and virtual servers |
| 3 | Network Device | Routers, switches, firewalls |
| 4 | Printer | Network printers, MFPs |

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Unique identifier |
| `companyID` | int | Yes | Owning company |
| `productID` | int | Yes | Product catalog reference |
| `serialNumber` | string | No | Asset serial number |
| `warrantyExpirationDate` | date | No | Warranty end date |

## API Patterns

### Search CIs by Company

```json
POST /v1.0/ConfigurationItems/query
{
  "filter": [
    {"field": "companyID", "op": "eq", "value": 12345},
    {"field": "isActive", "op": "eq", "value": true}
  ]
}
```

## Best Practices

1. **Keep serial numbers accurate** - Essential for warranty claims
2. **Link CIs to contracts** - Enables proper billing
3. **Update status on decommission** - Don't delete, mark inactive

## Related Skills

- [Autotask Tickets](../tickets/SKILL.md) - Linking CIs to service tickets
- [Autotask Contracts](../contracts/SKILL.md) - CI coverage under agreements
```

## Quality Checklist

Before submitting a skill, verify:

- [ ] Frontmatter `description` starts with "Use this skill when..."
- [ ] Triggers include vendor/product name variations
- [ ] Triggers include action words (create, search, update)
- [ ] All status codes and enums have complete tables
- [ ] Field reference includes types and required flags
- [ ] API examples use realistic but fake data
- [ ] No hardcoded credentials or real company names
- [ ] Business logic includes validation rules
- [ ] Error handling section covers common cases
- [ ] Best practices are actionable
- [ ] Related skills are linked correctly

## Next Steps

- [Creating Commands](/msp-claude-plugins/developer/creating-commands/) - Build slash commands
- [MCP Integration](/msp-claude-plugins/developer/mcp-integration/) - Connect to live APIs
- [Testing Guide](/msp-claude-plugins/developer/testing/) - Validate your skill
