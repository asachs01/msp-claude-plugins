# TimeZest Plugin

Claude Code plugin for [TimeZest](https://timezest.com) - PSA-coupled customer scheduling for MSP technicians.

## What It Does

- **Book a tech against a PSA ticket** - Create a TimeZest scheduling request that links to a ConnectWise / Autotask / Halo ticket so the customer can self-serve their slot
- **Track scheduling requests** - Sent / clicked / booked / canceled lifecycle visibility
- **Manage agents, teams, appointment types** - Resolve the right tech and the right kind of appointment for a given ticket
- **Cancel pending bookings** - Revoke an outstanding customer link

## Installation

```
/plugin marketplace add wyre-technology/msp-claude-plugins
/plugin install timezest
```

The plugin connects through the [WYRE MCP Gateway](https://mcp.wyretechnology.com) at `https://mcp.wyretechnology.com/v1/timezest/mcp`.

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `TIMEZEST_API_TOKEN` | Yes | TimeZest API token (sent as `Authorization: Bearer ...`) |

## Skills

- `api-patterns` - Auth, navigation, polling, PSA association payload
- `scheduling` - Primary booking workflow against ConnectWise / Autotask / Halo

## Commands

- `/search-scheduling` - List recent scheduling requests grouped by state

## Tools

Provided by the TimeZest MCP server through the WYRE MCP Gateway:

### Navigation
- `timezest_navigate`, `timezest_back`, `timezest_status`

### Agents
- `timezest_agents_list`, `timezest_agents_get`

### Teams
- `timezest_teams_list`, `timezest_teams_get`

### Appointment Types
- `timezest_appointment_types_list`, `timezest_appointment_types_get`

### Resources
- `timezest_resources_list`

### Scheduling
- `timezest_scheduling_list`, `timezest_scheduling_get`
- `timezest_scheduling_create_request`, `timezest_scheduling_cancel`

## License

Apache-2.0
