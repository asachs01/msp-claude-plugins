---
title: /create-ticket
description: Create service tickets in your PSA with intelligent defaults and full customization
---

The `/create-ticket` command creates service tickets in your PSA system. Claude applies MSP best practices to suggest appropriate priority, queue, and categorization based on the issue description.

## Syntax

```
/create-ticket "company" "title" [options]
```

## Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `company` | string | Company name (exact match or partial for lookup) |
| `title` | string | Ticket title/summary (max 255 characters) |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `--priority` | integer | 3 | Priority level: 1 (Critical), 2 (High), 3 (Medium), 4 (Low) |
| `--status` | string | "New" | Initial ticket status |
| `--queue` | string | "Service Desk" | Queue/board for ticket assignment |
| `--assignee` | string | none | Resource to assign (name or email) |
| `--description` | string | none | Detailed description (supports multi-line) |
| `--due-date` | string | SLA-based | Due date (ISO 8601 or relative: "tomorrow", "+2 days") |
| `--issue-type` | string | none | Issue type classification |
| `--sub-issue-type` | string | none | Sub-issue type (requires `--issue-type`) |
| `--source` | string | "API" | Ticket source (Phone, Email, Portal, API, etc.) |
| `--contact` | string | none | Contact name at the company |
| `--contract` | string | auto | Service contract (auto-detected if not specified) |
| `--custom` | JSON | none | Custom field values as JSON object |
| `--verbose` | flag | false | Show detailed output including IDs |

## Priority Levels

| Level | Name | Typical Use Case | Default SLA |
|-------|------|------------------|-------------|
| 1 | Critical | System down, business stopped | 1 hour |
| 2 | High | Major impact, degraded service | 4 hours |
| 3 | Medium | Single user, workaround available | 8 hours |
| 4 | Low | Enhancement, non-urgent request | 24 hours |

## Usage Examples

### Basic Ticket Creation

```
/create-ticket "Acme Corp" "User cannot access email"
```

**Output:**
```
Ticket T20260204.0043 created
  Company:    Acme Corp
  Title:      User cannot access email
  Priority:   Medium (3)
  Queue:      Service Desk
  Status:     New
```

### High Priority with Details

```
/create-ticket "Contoso Ltd" "Server DC01 unresponsive - all users affected"
--priority 1
--queue "Critical Infrastructure"
--description "Primary domain controller not responding to ping.
All users unable to authenticate. VPN users also affected.
Started approximately 9:15 AM."
--contact "John Smith"
```

**Output:**
```
Ticket T20260204.0044 created
  Company:    Contoso Ltd
  Title:      Server DC01 unresponsive - all users affected
  Priority:   Critical (1)
  Queue:      Critical Infrastructure
  Status:     New
  Contact:    John Smith
  Due:        2026-02-04 11:23:00 UTC (1 hour SLA)

  Note: Critical priority ticket created. On-call resources notified.
```

### With Assignment and Classification

```
/create-ticket "Johnson & Associates" "New employee onboarding - Sarah Williams"
--priority 4
--queue "New Hire Setup"
--assignee "mike.tech@msp.com"
--issue-type "Onboarding"
--sub-issue-type "New User Setup"
--due-date "+3 days"
--description "New marketing coordinator starting Monday.
Standard setup: laptop, O365, CRM access, shared drives."
```

### With Custom Fields

```
/create-ticket "Acme Corp" "VPN connection dropping"
--priority 3
--custom '{"Site Location": "Remote", "Device Type": "Laptop", "VPN Client": "GlobalProtect"}'
```

### Using Context from Conversation

```
You: The finance team at Meridian Group is reporting that their
     accounting software keeps crashing when generating month-end reports.
     This is blocking their month-end close.

Claude: This is time-sensitive with business impact. I'll create a
        high-priority ticket:

        /create-ticket "Meridian Group" "Accounting software crashes during month-end reports"
        --priority 2
        --queue "Application Support"
        --issue-type "Application"
        --sub-issue-type "Crash/Freeze"
        --description "Finance team unable to generate month-end reports.
        Software crashes during report generation. Blocking month-end close process.
        Affects: Finance department
        Impact: Business process blocked"
```

## Intelligent Defaults

Claude analyzes ticket content to suggest appropriate values:

| Trigger Words/Patterns | Suggested Priority | Suggested Queue |
|-----------------------|-------------------|-----------------|
| "down", "outage", "all users" | 1 (Critical) | Critical Infrastructure |
| "cannot access", "not working", "urgent" | 2 (High) | Service Desk |
| "slow", "intermittent", "sometimes" | 3 (Medium) | Service Desk |
| "new user", "onboarding", "request" | 4 (Low) | New Hire Setup |
| "printer", "scanner" | 3 (Medium) | Hardware Support |
| "password", "locked out" | 2 (High) | Service Desk |

## Output Format

### Standard Output

```
Ticket T20260204.0043 created
  Company:    Acme Corp
  Title:      User cannot access email
  Priority:   Medium (3)
  Queue:      Service Desk
  Status:     New
  Created:    2026-02-04 10:23:45 UTC
```

### Verbose Output (`--verbose`)

```
Ticket T20260204.0043 created

Details:
  Company:      Acme Corp (ID: 29683541)
  Title:        User cannot access email
  Priority:     Medium (3)
  Queue:        Service Desk (ID: 29683001)
  Status:       New (ID: 1)
  Issue Type:   Email/Messaging (ID: 15)
  Sub-Issue:    Access Problem (ID: 42)
  Assigned:     Unassigned
  Contact:      None specified
  Contract:     Managed Services Agreement (ID: 8847)
  Due Date:     2026-02-04 18:23:45 UTC
  SLA:          8 Business Hours
  Created:      2026-02-04 10:23:45 UTC
  Created By:   API Integration

API Response:
  Request ID:   req_abc123def456
  Duration:     234ms
  Endpoint:     POST /Tickets
```

## Error Handling

### Company Not Found

```
/create-ticket "Acm Corp" "Test ticket"

Error: Company "Acm Corp" not found.

Did you mean:
  - Acme Corp
  - Acme Corporation
  - ACM Industries

Use exact company name or search with:
  /search-tickets --company-search "Acm"
```

### Invalid Queue

```
/create-ticket "Acme Corp" "Test" --queue "Invalid Queue"

Error: Queue "Invalid Queue" not found.

Available queues:
  - Service Desk
  - Critical Infrastructure
  - Hardware Support
  - New Hire Setup
  - Projects

Tip: Queue names are case-sensitive.
```

### Missing Required Contract

```
/create-ticket "Acme Corp" "Server maintenance"

Warning: No active contract found for Acme Corp.

Options:
  1. Specify contract: --contract "Time & Materials"
  2. Create as non-billable: --contract "Internal"
  3. Contact account manager to verify contract status

Proceeding with default "Time & Materials" contract.
```

### Permission Denied

```
/create-ticket "Restricted Client" "Test"

Error: Insufficient permissions to create tickets for "Restricted Client".

Your API user lacks access to this company. Contact your administrator
to update API user permissions in Autotask.
```

## Best Practices

### Title Guidelines

- Keep titles concise but descriptive (under 80 characters ideal)
- Include affected system or service when known
- Avoid vague titles like "Issue" or "Problem"

**Good:** `"Email not syncing on mobile device - John Smith"`
**Bad:** `"Email problem"`

### Description Structure

Include relevant details in descriptions:

```
/create-ticket "Acme Corp" "Outlook crashes when opening attachments"
--description "Issue: Outlook 365 crashes when user attempts to open PDF attachments.

Affected User: Jane Doe (jane.doe@acmecorp.com)
Device: Dell Latitude 5520, Windows 11
Outlook Version: Microsoft 365 (Build 16.0.14326.20404)

Steps to Reproduce:
1. Receive email with PDF attachment
2. Click to open/preview attachment
3. Outlook freezes then crashes

Frequency: Every time
Workaround: User can save attachment first, then open from file explorer

Error Message: None displayed before crash"
```

### Priority Selection

- Let Claude suggest priority based on impact description
- Override only when you have specific knowledge
- Document reasoning for priority overrides in description

## Related Commands

- [/search-tickets](/msp-claude-plugins/commands/search-tickets/) - Find existing tickets before creating duplicates
- [/time-entry](/msp-claude-plugins/commands/time-entry/) - Log time against created tickets

## See Also

- [Ticket Management Skill](/msp-claude-plugins/plugins/kaseya/autotask/#ticket-management) - Underlying skill documentation
- [Commands Overview](/msp-claude-plugins/commands/overview/) - All available commands
