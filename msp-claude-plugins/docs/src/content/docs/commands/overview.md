---
title: Commands Overview
description: Complete reference for slash commands in MSP Claude Plugins
---

Slash commands provide quick, structured actions for common MSP operations. They offer a consistent syntax across all supported PSA/RMM platforms while respecting vendor-specific capabilities.

## Available Commands

| Command | Description | Availability |
|---------|-------------|--------------|
| [`/create-ticket`](/msp-claude-plugins/commands/create-ticket/) | Create service tickets with priority, queue, and assignment | Autotask |
| [`/search-tickets`](/msp-claude-plugins/commands/search-tickets/) | Search and filter tickets by various criteria | Autotask |
| [`/time-entry`](/msp-claude-plugins/commands/time-entry/) | Log billable and non-billable time against tickets or projects | Autotask |

## Command Syntax

All slash commands follow a consistent pattern:

```
/command-name "required_arg" --option value --flag
```

### Argument Types

| Type | Syntax | Example |
|------|--------|---------|
| **Positional** | Quoted strings | `"Acme Corp"` |
| **Named options** | `--option value` | `--priority 2` |
| **Flags** | `--flag` | `--verbose` |
| **Multi-value** | Comma-separated | `--status "New,In Progress"` |

### Quoting Rules

- Use double quotes for values containing spaces: `"Acme Corp"`
- Single words don't require quotes: `--priority 2`
- Escape quotes within values: `"Server \"DC01\" is down"`

## Common Patterns

### Natural Language + Command

Claude interprets context and suggests appropriate commands:

```
You: The printer at Johnson & Associates is jamming again.
     This is the third time this week.

Claude: Based on the recurring nature, I'll create a ticket with
        relevant history noted:

        /create-ticket "Johnson & Associates" "Printer jamming - recurring issue"
        --priority 3 --queue "Hardware Support"
        --description "Third occurrence this week. Review for replacement."
```

### Command Chaining

Execute related operations in sequence:

```
You: Create a ticket for the Contoso server outage and log the
     30 minutes I spent on initial triage.

Claude: I'll create the ticket and then log your time:

        /create-ticket "Contoso" "Server outage - DC01 unresponsive"
        --priority 1 --queue "Critical Infrastructure"

        /time-entry T20260204.0089 --hours 0.5
        --work-type "Remote Support" --notes "Initial triage and assessment"
```

### Bulk Operations

Some commands support processing multiple items:

```
You: Search for all open tickets at Acme Corp and show me the oldest ones first.

Claude: /search-tickets --company "Acme Corp" --status "Open"
        --sort "createDate" --order "asc" --limit 10
```

## Command Output

### Standard Response Format

Successful commands return structured output:

```
/create-ticket "Acme Corp" "Network connectivity issues" --priority 2

Output:
  Ticket T20260204.0043 created
  Company:    Acme Corp
  Title:      Network connectivity issues
  Priority:   High (2)
  Queue:      Service Desk
  Status:     New
  Created:    2026-02-04 10:23:45 UTC
```

### Verbose Mode

Add `--verbose` for additional details:

```
/create-ticket "Acme Corp" "Network issue" --priority 2 --verbose

Output:
  Ticket T20260204.0043 created

  Details:
    Company:      Acme Corp (ID: 29683541)
    Title:        Network connectivity issues
    Priority:     High (2)
    Queue:        Service Desk (ID: 29683001)
    Status:       New (ID: 1)
    Assigned:     Unassigned
    Due Date:     2026-02-05 10:23:45 UTC
    SLA:          8 Business Hours
    Created:      2026-02-04 10:23:45 UTC
    Created By:   API Integration

  API Response:
    Request ID:   req_abc123def456
    Duration:     234ms
```

### Error Responses

When commands fail, Claude provides actionable guidance:

```
/create-ticket "Unknown Company" "Test ticket"

Error:
  Company "Unknown Company" not found in Autotask.

  Did you mean:
    - Unknown Systems LLC
    - Unknown Technologies Inc

  Tip: Use /search-tickets --company-search "Unknown" to find companies.
```

## Context Awareness

Commands leverage conversation context when possible:

```
You: What's the status of the Acme ticket about the printer?

Claude: [Searches and finds ticket T20260203.0091]
        Found ticket T20260203.0091 - "Printer offline in main office"
        Status: In Progress, Priority: Medium

You: Add 15 minutes to that.

Claude: /time-entry T20260203.0091 --hours 0.25
        --work-type "Remote Support" --notes "Status check"

        (Using ticket from previous context)
```

## Platform-Specific Behavior

While commands maintain consistent syntax, some features are platform-specific:

| Feature | Autotask | ConnectWise (Planned) |
|---------|----------|----------------------|
| Priority levels | 1-4 (Critical to Low) | 1-5 |
| Queue assignment | Required | Optional |
| Custom fields | Supported via `--custom` | TBD |
| SLA tracking | Automatic | Automatic |

## Getting Help

### In-Session Help

Ask Claude about any command:

```
You: How do I use the create-ticket command?

Claude: The /create-ticket command creates service tickets...
        [Provides syntax and examples]
```

### Quick Reference

```
You: Show me all available commands.

Claude: Available commands:
        - /create-ticket - Create service tickets
        - /search-tickets - Search and filter tickets
        - /time-entry - Log time entries

        Say "help [command]" for detailed usage.
```

## Next Steps

- [/create-ticket Reference](/msp-claude-plugins/commands/create-ticket/) - Full ticket creation documentation
- [/search-tickets Reference](/msp-claude-plugins/commands/search-tickets/) - Ticket search and filtering
- [/time-entry Reference](/msp-claude-plugins/commands/time-entry/) - Time tracking documentation
- [Autotask Skills](/msp-claude-plugins/plugins/kaseya/autotask/) - Deep-dive into Autotask integration
