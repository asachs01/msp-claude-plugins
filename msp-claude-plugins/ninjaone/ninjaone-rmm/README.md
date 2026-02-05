# NinjaOne (NinjaRMM) Plugin

Claude Code plugin for NinjaOne Remote Monitoring and Management.

## Installation

```
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin ninjaone-rmm
```

## Configuration

Set these environment variables:

| Variable | Description |
|----------|-------------|
| `NINJAONE_CLIENT_ID` | OAuth 2.0 Client ID |
| `NINJAONE_CLIENT_SECRET` | OAuth 2.0 Client Secret |
| `NINJAONE_REGION` | Region: `us`, `eu`, or `oc` |

Get credentials from **Administration > Apps > API** in NinjaOne.

## Skills

| Skill | Description |
|-------|-------------|
| `ninjaone-rmm:devices` | Device management, services, inventory, maintenance |
| `ninjaone-rmm:organizations` | Organization and location management |
| `ninjaone-rmm:alerts` | Alert monitoring and management |
| `ninjaone-rmm:tickets` | Ticketing operations |
| `ninjaone-rmm:api-patterns` | Authentication and API patterns |

## Commands

| Command | Description |
|---------|-------------|
| `/ninjaone-search-devices` | Search devices across organizations |
| `/ninjaone-device-info` | Get detailed device information |
| `/ninjaone-list-alerts` | List active alerts |
| `/ninjaone-create-ticket` | Create a new ticket |

## API Reference

- **Base URLs**: `app.ninjarmm.com` (US), `eu.ninjarmm.com` (EU), `oc.ninjarmm.com` (OC)
- **Authentication**: OAuth 2.0 with Bearer token
- **Rate Limits**: Varies by endpoint
- **Documentation**: [NinjaOne Public API](https://app.ninjarmm.com/apidocs/)

## Examples

### Search for offline devices
```
/ninjaone-search-devices "offline servers"
```

### Get device details
```
/ninjaone-device-info 12345
```

### List critical alerts
```
/ninjaone-list-alerts --priority critical
```

## Related

- [MCP Server](https://github.com/wyre-technology/ninjaone-mcp) - Full API access via MCP
- [Node Library](https://github.com/asachs01/node-ninjaone) - TypeScript client library
