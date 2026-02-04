---
title: /search-tickets
description: Search and filter service tickets with flexible query options
---

The `/search-tickets` command queries your PSA for tickets matching specified criteria. It supports filtering by company, status, priority, date ranges, assignee, and more.

## Syntax

```
/search-tickets [options]
```

At least one filter option is required to prevent overly broad queries.

## Parameters

### Filter Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `--company` | string | Filter by company name (exact or partial match) |
| `--company-id` | integer | Filter by company ID (exact) |
| `--status` | string | Filter by status (comma-separated for multiple) |
| `--priority` | string | Filter by priority: 1-4 or name (comma-separated) |
| `--queue` | string | Filter by queue/board name |
| `--assignee` | string | Filter by assigned resource (name or email) |
| `--unassigned` | flag | Show only unassigned tickets |
| `--contact` | string | Filter by contact name |
| `--issue-type` | string | Filter by issue type |
| `--ticket-number` | string | Search by ticket number (supports wildcards) |
| `--title` | string | Search in ticket title (partial match) |
| `--keyword` | string | Full-text search across title and description |

### Date Filters

| Parameter | Type | Description |
|-----------|------|-------------|
| `--created-after` | date | Tickets created after this date |
| `--created-before` | date | Tickets created before this date |
| `--created-today` | flag | Tickets created today |
| `--created-week` | flag | Tickets created this week |
| `--modified-after` | date | Tickets modified after this date |
| `--due-before` | date | Tickets due before this date |
| `--overdue` | flag | Show only overdue tickets |

Date formats accepted: `YYYY-MM-DD`, `today`, `yesterday`, `this week`, `last week`, `this month`, `-7 days`, `+3 days`

### Output Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `--limit` | integer | 25 | Maximum results to return (max 500) |
| `--sort` | string | "createDate" | Sort field: createDate, lastActivityDate, dueDate, priority |
| `--order` | string | "desc" | Sort order: asc, desc |
| `--format` | string | "table" | Output format: table, list, json, csv |
| `--fields` | string | default set | Comma-separated fields to include |
| `--verbose` | flag | false | Include all available fields |

### Default Fields

When `--fields` is not specified, these fields are shown:

- Ticket Number
- Company
- Title
- Priority
- Status
- Assignee
- Created Date

## Usage Examples

### Search by Company

```
/search-tickets --company "Acme Corp"
```

**Output:**
```
Found 12 tickets for Acme Corp

| Ticket          | Title                              | Priority | Status      | Assignee    | Created    |
|-----------------|-----------------------------------|----------|-------------|-------------|------------|
| T20260204.0043  | User cannot access email          | Medium   | In Progress | Mike Tech   | 2026-02-04 |
| T20260203.0091  | Printer offline in main office    | Medium   | New         | Unassigned  | 2026-02-03 |
| T20260201.0022  | VPN connection dropping           | High     | Waiting     | Sarah Net   | 2026-02-01 |
| ...             | ...                               | ...      | ...         | ...         | ...        |

Showing 12 of 12 results
```

### Filter by Status

```
/search-tickets --company "Acme Corp" --status "New,In Progress"
```

### Multiple Filters

```
/search-tickets --company "Acme Corp"
--status "Open"
--priority "1,2"
--created-week
--sort "priority" --order "asc"
```

### Find Overdue Tickets

```
/search-tickets --overdue --assignee "mike.tech@msp.com"
```

**Output:**
```
Found 3 overdue tickets assigned to Mike Tech

| Ticket          | Company      | Title                    | Priority | Due Date   | Overdue By |
|-----------------|--------------|--------------------------|----------|------------|------------|
| T20260130.0015  | Contoso Ltd  | Software installation    | Medium   | 2026-02-01 | 3 days     |
| T20260128.0088  | Acme Corp    | New laptop setup         | Low      | 2026-02-02 | 2 days     |
| T20260131.0041  | Meridian     | Printer configuration    | Medium   | 2026-02-03 | 1 day      |

Warning: These tickets have exceeded their SLA due dates.
```

### Search Unassigned Tickets

```
/search-tickets --queue "Service Desk" --unassigned --status "New"
```

### Keyword Search

```
/search-tickets --keyword "outlook crash" --created-week
```

### Date Range Query

```
/search-tickets --company "Contoso Ltd"
--created-after "2026-01-01"
--created-before "2026-01-31"
```

### Export to CSV

```
/search-tickets --company "Acme Corp" --format csv --limit 100
```

**Output:**
```
Exporting 47 tickets to CSV format...

"Ticket Number","Company","Title","Priority","Status","Assignee","Created Date"
"T20260204.0043","Acme Corp","User cannot access email","Medium","In Progress","Mike Tech","2026-02-04"
"T20260203.0091","Acme Corp","Printer offline in main office","Medium","New","","2026-02-03"
...

Tip: Copy this output or use --output file.csv to save directly.
```

### Specific Fields

```
/search-tickets --company "Acme Corp"
--fields "ticketNumber,title,status,lastActivityDate,assignee"
```

### JSON Output for Integration

```
/search-tickets --company "Acme Corp" --status "New" --format json
```

**Output:**
```json
{
  "count": 3,
  "tickets": [
    {
      "ticketNumber": "T20260204.0043",
      "companyName": "Acme Corp",
      "companyId": 29683541,
      "title": "User cannot access email",
      "priority": 3,
      "priorityName": "Medium",
      "status": "New",
      "statusId": 1,
      "assignee": null,
      "createdDate": "2026-02-04T10:23:45Z",
      "dueDate": "2026-02-04T18:23:45Z"
    }
  ]
}
```

## Query Syntax

### Status Values

| Status | Description |
|--------|-------------|
| New | Newly created, not yet triaged |
| In Progress | Actively being worked |
| Waiting | Waiting on customer or third party |
| On Hold | Paused, not counting against SLA |
| Completed | Work finished, pending closure |
| Closed | Ticket resolved and closed |

Combine multiple: `--status "New,In Progress,Waiting"`

### Priority Values

| Value | Name | Usage |
|-------|------|-------|
| 1 | Critical | `--priority 1` or `--priority "Critical"` |
| 2 | High | `--priority 2` or `--priority "High"` |
| 3 | Medium | `--priority 3` or `--priority "Medium"` |
| 4 | Low | `--priority 4` or `--priority "Low"` |

Combine multiple: `--priority "1,2"` or `--priority "Critical,High"`

### Wildcard Matching

The `--ticket-number` parameter supports wildcards:

```
/search-tickets --ticket-number "T202602*"    # All February 2026 tickets
/search-tickets --ticket-number "*0043"       # Tickets ending in 0043
```

## Output Formats

### Table (Default)

Best for interactive use and readability:

```
| Ticket          | Company   | Title              | Priority | Status      |
|-----------------|-----------|-------------------|----------|-------------|
| T20260204.0043  | Acme Corp | Email issue       | Medium   | In Progress |
```

### List

Detailed view, one ticket per block:

```
Ticket: T20260204.0043
  Company:    Acme Corp
  Title:      Email issue
  Priority:   Medium
  Status:     In Progress
  Assignee:   Mike Tech
  Created:    2026-02-04 10:23:45
  Due:        2026-02-04 18:23:45
---
```

### JSON

Machine-readable format for integrations.

### CSV

Spreadsheet-compatible export format.

## Pagination

For large result sets, use pagination:

```
/search-tickets --company "Acme Corp" --limit 50 --page 1
/search-tickets --company "Acme Corp" --limit 50 --page 2
```

Or retrieve all with warning:

```
/search-tickets --company "Acme Corp" --limit 500

Warning: Large result set (347 tickets). Consider adding filters:
  - Add --status to filter by ticket status
  - Add --created-week to limit to recent tickets
  - Add --priority to focus on specific priorities
```

## Error Handling

### No Results

```
/search-tickets --company "Acme Corp" --status "Escalated"

No tickets found matching criteria:
  Company: Acme Corp
  Status: Escalated

Suggestions:
  - Check status spelling (available: New, In Progress, Waiting, On Hold, Completed, Closed)
  - Broaden search by removing filters
  - Try --keyword for full-text search
```

### Invalid Filter

```
/search-tickets --priority "Urgent"

Error: Invalid priority value "Urgent".

Valid priority values:
  - 1 or "Critical"
  - 2 or "High"
  - 3 or "Medium"
  - 4 or "Low"
```

### Too Broad Query

```
/search-tickets --status "Open"

Error: Query too broad. Please add at least one of:
  - --company: Filter by company
  - --assignee: Filter by assigned resource
  - --queue: Filter by queue
  - --created-after: Limit by date range

This prevents accidentally loading thousands of tickets.
```

## Common Use Cases

### Daily Triage

```
/search-tickets --queue "Service Desk" --status "New" --unassigned
--sort "priority" --order "asc"
```

### My Open Tickets

```
/search-tickets --assignee "me" --status "In Progress,Waiting"
```

### SLA Review

```
/search-tickets --overdue --format list --verbose
```

### Customer History

```
/search-tickets --company "Acme Corp" --created-after "-90 days"
--sort "createDate" --order "desc"
```

### Escalation Candidates

```
/search-tickets --priority "1,2" --status "New,In Progress"
--modified-after "-2 hours" --assignee "unassigned"
```

## Related Commands

- [/create-ticket](/msp-claude-plugins/commands/create-ticket/) - Create new tickets
- [/time-entry](/msp-claude-plugins/commands/time-entry/) - Log time against found tickets

## See Also

- [Ticket Management Skill](/msp-claude-plugins/plugins/kaseya/autotask/#ticket-management) - Underlying skill documentation
- [Commands Overview](/msp-claude-plugins/commands/overview/) - All available commands
