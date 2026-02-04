---
title: Creating Commands
description: How to create slash commands for common MSP operations in Claude Code
---

Commands are slash-command shortcuts that users invoke directly in Claude Code. They provide guided workflows with defined parameters for common operations.

## Command File Structure

Commands are stored as individual markdown files:

```
vendor/product/commands/
├── create-ticket.md
├── search-tickets.md
├── time-entry.md
└── update-account.md
```

## Frontmatter Schema

Every command file begins with YAML frontmatter defining the command name, description, and arguments:

```yaml
---
name: create-ticket
description: Create a new service ticket in Autotask PSA
arguments:
  - name: company
    description: Company name or ID
    required: true
  - name: title
    description: Ticket title/summary (max 255 characters)
    required: true
  - name: description
    description: Detailed description of the issue
    required: false
  - name: queue
    description: Queue name or ID (defaults to Service Desk)
    required: false
  - name: priority
    description: Priority level 1-4 (1=Critical, 4=Low, default 3)
    required: false
  - name: contact
    description: Contact name or email
    required: false
---
```

### Name Field

The `name` field defines the slash command:

- Use kebab-case (lowercase with hyphens)
- Keep it short and memorable
- Use action verbs (create, search, update, delete)
- Prefix with entity name if needed

Good examples:
- `create-ticket`
- `search-tickets`
- `time-entry`
- `update-account`

Avoid:
- `create-new-service-ticket` (too long)
- `ticket` (not descriptive)
- `CreateTicket` (wrong case)

### Description Field

The `description` field should:

- Be a single sentence
- Start with an action verb
- Mention the target system
- Be under 80 characters

### Arguments Array

Each argument object contains:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Argument name (camelCase or kebab-case) |
| `description` | string | Yes | Help text for the argument |
| `required` | boolean | Yes | Whether argument is mandatory |
| `default` | any | No | Default value if not provided |

**Argument ordering:**
1. Required positional arguments first
2. Optional arguments with sensible defaults
3. Most commonly used optional arguments before rare ones

## Content Structure

### 1. Title and Introduction

```markdown
# Create Autotask Ticket

Create a new service ticket in Autotask PSA with specified details.
```

### 2. Prerequisites

List requirements before using the command:

```markdown
## Prerequisites

- Valid Autotask API credentials configured
- Company must exist in Autotask
- User must have ticket creation permissions
```

### 3. Steps

Detail the workflow the command executes:

```markdown
## Steps

1. **Validate company exists**
   - If numeric, use as company ID directly
   - If text, search companies by name
   - Suggest similar names if no exact match

2. **Check for duplicate tickets**
   - Search open tickets for same company
   - Warn if similar titles found in last 24 hours

3. **Resolve optional fields**
   - Look up queue ID from name if provided
   - Look up contact ID if contact provided
   - Apply default priority if not specified

4. **Check contract coverage**
   - Query active contracts for company
   - Warn if no active contract (T&M billing)

5. **Create the ticket**
   ```json
   POST /v1.0/Tickets
   {
     "companyID": <resolved_company_id>,
     "title": "<title>",
     "description": "<description>",
     "queueID": <resolved_queue_id>,
     "priority": <priority>,
     "status": 1,
     "contactID": <resolved_contact_id>
   }
   ```

6. **Return ticket details**
   - Ticket number
   - Ticket ID
   - Direct URL to ticket in Autotask
```

### 4. Parameters Table

Provide a complete reference table:

```markdown
## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| company | string/int | Yes | - | Company name or ID |
| title | string | Yes | - | Brief summary (max 255 chars) |
| description | string | No | - | Detailed issue description |
| queue | string/int | No | Service Desk | Target queue |
| priority | int | No | 3 (Medium) | 1=Critical to 4=Low |
| contact | string | No | - | Contact name or email |
```

### 5. Examples

Provide examples for all common use cases:

```markdown
## Examples

### Basic Usage

```
/create-ticket "Acme Corp" "Email not working"
```

### With Full Details

```
/create-ticket "Acme Corp" "Email not working" --description "Multiple users unable to send/receive since 9am" --priority 2 --contact "john.smith@acme.com" --queue "Service Desk"
```

### Using Company ID

```
/create-ticket 12345 "Server offline" --priority 1
```

### With Quoted Descriptions

```
/create-ticket "Acme Corp" "Network slow" --description "Users report intermittent slowness when accessing file shares. Started after maintenance window."
```
```

### 6. Output Examples

Show what success and status messages look like:

```markdown
## Output

### Success

```
Ticket Created Successfully

Ticket Number: T20240215.0042
Ticket ID: 54321
Company: Acme Corporation
Priority: High (2)
Queue: Service Desk
Contract: Managed Services Agreement (Active)

URL: https://ww5.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?ticketId=54321
```

### Warning Output

```
Warning: No active contract found for Acme Corporation

Ticket will be created as Time & Materials.
Proceed? [Y/n]
```
```

### 7. Error Handling

Document all error conditions and their resolutions:

```markdown
## Error Handling

### Company Not Found

```
Error: Company not found: "Acme"

Did you mean one of these?
- Acme Corporation (ID: 12345)
- Acme Industries (ID: 12346)
- Acme LLC (ID: 12347)
```

### Duplicate Detection

```
Warning: Potential duplicate ticket detected

Existing ticket T20240215.0038 "Email issues" was created 2 hours ago
for this company.

Create anyway? [Y/n]
View existing ticket? [v]
```

### API Errors

| Error | Resolution |
|-------|------------|
| Invalid queue ID | List available queues and retry |
| Contact not found | Create ticket without contact, note in description |
| Rate limited | Wait and retry automatically |
| Unauthorized | Verify API credentials are configured |
```

### 8. Related Commands

Link to related commands:

```markdown
## Related Commands

- `/search-tickets` - Search existing tickets
- `/update-ticket` - Update ticket details
- `/time-entry` - Log time to a ticket
- `/add-note` - Add a note to a ticket
```

## Complete Example

Here is a condensed example of a well-structured command file:

```markdown
---
name: time-entry
description: Log time to an Autotask ticket or project task
arguments:
  - name: ticket
    description: Ticket number or ID
    required: true
  - name: hours
    description: Hours worked (decimal, e.g., 1.5)
    required: true
  - name: summary
    description: Work summary/description
    required: false
  - name: date
    description: Date worked (YYYY-MM-DD, defaults to today)
    required: false
  - name: role
    description: Billing role (defaults to primary role)
    required: false
---

# Log Time Entry

Log billable or non-billable time to an Autotask ticket.

## Prerequisites

- Valid Autotask API credentials
- Ticket must exist and be in open status
- User must have time entry permissions

## Steps

1. **Resolve ticket**
   - Look up by ticket number or ID
   - Verify ticket is open

2. **Validate hours**
   - Must be positive decimal
   - Warn if over 8 hours

3. **Determine billing**
   - Check contract type
   - Apply appropriate rate

4. **Create time entry**
   ```json
   POST /v1.0/TimeEntries
   {
     "ticketID": 54321,
     "hoursWorked": 1.5,
     "summaryNotes": "Troubleshooting email connectivity",
     "dateWorked": "2024-02-15"
   }
   ```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| ticket | string/int | Yes | - | Ticket number or ID |
| hours | decimal | Yes | - | Hours worked |
| summary | string | No | - | Work description |
| date | date | No | Today | Date worked |
| role | string | No | Primary | Billing role |

## Examples

### Basic Usage

```
/time-entry T20240215.0042 1.5
```

### With Summary

```
/time-entry T20240215.0042 2.0 --summary "Resolved email sync issue by clearing cache"
```

### For Previous Date

```
/time-entry 54321 0.5 --date 2024-02-14 --summary "Follow-up call"
```

## Output

```
Time Entry Logged

Ticket: T20240215.0042 - Email not working
Hours: 1.5
Date: 2024-02-15
Summary: Resolved email sync issue by clearing cache
Billing: Managed Services (Included)

Total time on ticket: 3.5 hours
```

## Error Handling

| Error | Resolution |
|-------|------------|
| Ticket not found | Verify ticket number |
| Ticket closed | Reopen ticket or use different ticket |
| Invalid hours | Use positive decimal value |

## Related Commands

- `/create-ticket` - Create new ticket
- `/search-tickets` - Find tickets to log time against
```

## Best Practices

### Command Design

1. **Keep names short** - Users type these frequently
2. **Order arguments intuitively** - Most important first
3. **Provide sensible defaults** - Reduce required arguments
4. **Support multiple input formats** - Accept IDs or names
5. **Be forgiving** - Handle common mistakes gracefully

### Error Messages

1. **Be specific** - Tell users exactly what went wrong
2. **Suggest fixes** - Don't just report errors, help resolve them
3. **Offer alternatives** - "Did you mean...?"
4. **Include context** - Show related information

### Output Format

1. **Lead with status** - Success/Warning/Error first
2. **Show key details** - ID, name, important fields
3. **Include links** - Direct URLs to the created/updated record
4. **Summarize impact** - What changed, totals, next steps

## Quality Checklist

Before submitting a command, verify:

- [ ] Name is short, memorable, and uses kebab-case
- [ ] Description is a single actionable sentence
- [ ] Required arguments are truly required
- [ ] Optional arguments have sensible defaults
- [ ] Argument descriptions are clear
- [ ] Steps section documents the complete workflow
- [ ] Parameters table matches frontmatter
- [ ] Examples cover basic and advanced usage
- [ ] Success output shows all relevant details
- [ ] Error handling covers common failure cases
- [ ] Related commands are linked

## Next Steps

- [Creating Skills](/msp-claude-plugins/developer/creating-skills/) - Domain knowledge for commands
- [MCP Integration](/msp-claude-plugins/developer/mcp-integration/) - API connectivity
- [Testing Guide](/msp-claude-plugins/developer/testing/) - Validate your command
