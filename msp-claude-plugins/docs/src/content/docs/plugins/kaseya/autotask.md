---
title: Autotask PSA Plugin
description: Complete Claude Code plugin for Kaseya Autotask PSA with skills, commands, and MCP integration
---

The Autotask PSA plugin provides comprehensive Claude Code integration for Kaseya Autotask, including domain knowledge skills, slash commands for common workflows, and MCP server connectivity for live API access.

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| Skills | 7 domain knowledge files | Complete |
| Commands | 3 slash commands | Complete |
| MCP Server | Full API integration | Complete |
| API Coverage | Tickets, CRM, Projects, Time | Complete |

## Skills

The Autotask plugin includes seven specialized skills:

| Skill | File | Description |
|-------|------|-------------|
| Tickets | `autotask-tickets.md` | Service desk ticket management, statuses, queues, and workflows |
| CRM | `autotask-crm.md` | Companies, contacts, and account management |
| Projects | `autotask-projects.md` | Project management, phases, tasks, and milestones |
| Contracts | `autotask-contracts.md` | Service contracts, billing rules, and recurring services |
| Time Entries | `autotask-time-entries.md` | Time tracking, billing codes, and labor management |
| Configuration Items | `autotask-configuration-items.md` | Asset management, CI types, and relationships |
| API Patterns | `autotask-api-patterns.md` | REST API conventions, filtering, and pagination |

### Loading Skills

Skills are automatically loaded based on context. You can also explicitly reference them:

```
Claude, using the autotask-tickets skill, help me understand ticket priority levels.
```

## Slash Commands

### /create-ticket

Create a new service ticket with guided prompts.

```
/create-ticket

# Claude will prompt for:
# - Company selection
# - Contact (optional)
# - Title and description
# - Priority and queue
# - Due date (optional)
```

**Example output:**

```json
{
  "id": 12345,
  "ticketNumber": "T20260204.0001",
  "title": "Email not syncing on mobile device",
  "status": "New",
  "priority": "High",
  "queue": "Service Desk"
}
```

### /search-tickets

Search for tickets using natural language queries.

```
/search-tickets open tickets for Acme Corp from last week

# Supported filters:
# - Status: open, closed, in-progress, waiting
# - Company name
# - Date ranges: today, yesterday, this week, last week, this month
# - Priority: critical, high, medium, low
# - Assigned resource
```

**Example output:**

```
Found 3 tickets for Acme Corp (open, last 7 days):

| Ticket # | Title | Priority | Status | Age |
|----------|-------|----------|--------|-----|
| T20260203.0012 | VPN connection dropping | High | In Progress | 1d |
| T20260201.0045 | New user setup request | Medium | Waiting | 3d |
| T20260131.0089 | Printer offline | Low | New | 4d |
```

### /time-entry

Log time against a ticket or project task.

```
/time-entry T20260203.0012 1.5 hours troubleshooting VPN configuration

# Parameters:
# - Ticket number or task ID
# - Duration (hours or minutes)
# - Work description
# - Billing code (optional, defaults based on ticket type)
```

**Example output:**

```
Time entry created:
- Ticket: T20260203.0012 (VPN connection dropping)
- Duration: 1.5 hours
- Description: Troubleshooting VPN configuration
- Billing Code: Remote Support
- Billable: Yes
```

## MCP Server Setup

The Autotask MCP server enables Claude to interact directly with the Autotask API.

### Prerequisites

- Autotask API credentials (API User with appropriate permissions)
- API Integration Code from Autotask Admin
- Zone URL for your Autotask instance

### Configuration

Add the MCP server to your Claude Code configuration:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["-y", "@msp-claude-plugins/autotask-mcp"],
      "env": {
        "AUTOTASK_API_USER": "your-api-user@company.com",
        "AUTOTASK_API_SECRET": "your-api-secret",
        "AUTOTASK_API_INTEGRATION_CODE": "your-integration-code",
        "AUTOTASK_ZONE_URL": "https://webservices1.autotask.net"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTOTASK_API_USER` | Yes | API username (usually email format) |
| `AUTOTASK_API_SECRET` | Yes | API secret/password |
| `AUTOTASK_API_INTEGRATION_CODE` | Yes | Integration code from Admin > API |
| `AUTOTASK_ZONE_URL` | Yes | Your Autotask zone URL |

### Finding Your Zone URL

Your zone URL depends on your Autotask data center:

| Zone | URL |
|------|-----|
| Americas | `https://webservices1.autotask.net` |
| Americas 2 | `https://webservices2.autotask.net` |
| Europe | `https://webservices3.autotask.net` |
| Europe 2 | `https://webservices4.autotask.net` |
| Australia | `https://webservices5.autotask.net` |

## MCP Tools

The Autotask MCP server provides these tools:

| Tool | Description |
|------|-------------|
| `autotask_search_tickets` | Search tickets with filters |
| `autotask_get_ticket_details` | Get full ticket information |
| `autotask_create_ticket` | Create new tickets |
| `autotask_search_companies` | Search company records |
| `autotask_create_company` | Create new companies |
| `autotask_search_contacts` | Search contacts |
| `autotask_create_contact` | Create new contacts |
| `autotask_search_projects` | Search projects |
| `autotask_create_project` | Create new projects |
| `autotask_create_time_entry` | Log time entries |
| `autotask_search_resources` | Search technician resources |
| `autotask_list_queues` | List service queues |
| `autotask_list_ticket_statuses` | List ticket statuses |
| `autotask_list_ticket_priorities` | List priority levels |

## Usage Examples

### Creating a Ticket with MCP

```
Claude, create a new high priority ticket for Acme Corp:
- Title: Server not responding
- Description: Production server DC-PROD-01 is not responding to pings
- Queue: Service Desk
- Contact: John Smith
```

Claude will use the MCP tools to:
1. Search for the company "Acme Corp"
2. Find the contact "John Smith"
3. Get the queue ID for "Service Desk"
4. Create the ticket with all relationships

### Searching and Analyzing Tickets

```
Claude, show me all critical and high priority tickets that have been open
for more than 24 hours. Group them by company and suggest prioritization.
```

### Time Entry Workflow

```
Claude, I just finished working on ticket T20260203.0012. Log 2 hours for
remote troubleshooting. The issue was a misconfigured firewall rule.
```

## Troubleshooting

### Authentication Errors

If you receive 401 errors:
- Verify your API credentials are correct
- Ensure the API user has the necessary permissions
- Check that the integration code is active

### Rate Limiting

Autotask API has rate limits. If you encounter 429 errors:
- Reduce the frequency of API calls
- Use batch operations where available
- Implement exponential backoff

### Missing Fields

Some fields require specific picklist values. Use the `autotask_get_field_info` tool to discover valid values for custom fields.

## Related Resources

- [MSP Terminology](/msp-claude-plugins/plugins/shared/msp-terminology/)
- [Ticket Triage Best Practices](/msp-claude-plugins/plugins/shared/ticket-triage/)
- [Autotask API Documentation](https://ww1.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
