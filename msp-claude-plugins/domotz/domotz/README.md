# Domotz Plugin

Claude Code plugin for the Domotz network monitoring and management platform.

## Overview

This plugin provides Claude with deep knowledge of Domotz, enabling:

- **Agent & Site Management** - Monitor Domotz agents/collectors, manage sites and network probes
- **Device Inventory** - Discover, list, and inspect devices across monitored networks
- **Alert Management** - Configure alert profiles, review triggers, and manage notifications
- **Network Monitoring** - Network scanning, SNMP polling, port monitoring, speed tests
- **Domotz Eyes** - TCP/HTTP sensors, custom monitoring checks, and synthetic tests
- **API Integration** - Domotz Public API patterns, authentication, and pagination

## Prerequisites

### API Credentials

Domotz authenticates via an API key:

1. Log into the [Domotz Portal](https://portal.domotz.com)
2. Navigate to **User Menu > API Keys**
3. Generate a new API key

### Environment Variables

```bash
export DOMOTZ_API_KEY="your-api-key"
export DOMOTZ_REGION="us-east-1"
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DOMOTZ_API_KEY` | Yes | | API key from User Menu > API Keys |
| `DOMOTZ_REGION` | No | `us-east-1` | API region (`us-east-1` or `eu-central-1`) |
| `DOMOTZ_MCP_URL` | No | `https://mcp.wyretechnology.com/v1/domotz/mcp` | MCP server URL -- override to use a self-hosted gateway |

## Self-Hosted Gateway

If you run the [mcp-gateway](https://github.com/wyre-technology/mcp-gateway), set `DOMOTZ_MCP_URL` to your gateway's endpoint:

```
DOMOTZ_MCP_URL=https://your-gateway-domain/v1/domotz/mcp
```

**Setting env vars in Claude.ai:** Go to your org -> Settings -> Integrations -> Domotz -> Configure and add the variable.

**Setting env vars in Claude Code:** Add to `~/.claude/settings.json`:
```json
{
  "env": {
    "DOMOTZ_MCP_URL": "https://your-gateway-domain/v1/domotz/mcp"
  }
}
```

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyretechnology.com) to connect -- paste your API key and select your region, and you're done.

### Self-Hosted (Docker)

Run the Domotz MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyretechnology.com) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variables:

```bash
export DOMOTZ_API_KEY="your-api-key"
export DOMOTZ_REGION="us-east-1"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Authentication, API structure, pagination, rate limiting, error handling |
| `agents` | Domotz agents/collectors, sites, network probes, and agent health |
| `devices` | Device inventory, discovery, status, and network topology |
| `alerts` | Alert profiles, triggers, notifications, and alert management |
| `network` | Network scanning, SNMP monitoring, port checks, speed tests |
| `eyes` | Domotz Eyes sensors, TCP/HTTP checks, and custom monitoring |

## Available Commands

| Command | Description |
|---------|-------------|
| `/device-lookup` | Find a device by name, IP address, or MAC address |
| `/network-scan` | Scan a network for devices |
| `/alert-status` | Check current alerts across agents |
| `/site-overview` | Overview of a site's network health |
| `/device-inventory` | List all devices at a site |

## Quick Start

### Find a Device

```
/device-lookup --query "192.168.1.1"
```

### Scan a Network

```
/network-scan --agent_id "12345"
```

### Check Alerts

```
/alert-status
```

### Site Health Overview

```
/site-overview --agent_id "12345"
```

### List All Devices at a Site

```
/device-inventory --agent_id "12345"
```

## Security Considerations

### Credential Handling

- Never commit API keys to version control
- Use environment variables for all credentials
- Rotate API keys periodically via the Domotz Portal
- Use the minimum scope necessary for your use case
- Monitor API usage in the Domotz audit log

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `DOMOTZ_API_KEY` is set correctly
2. Check that the API key has not been revoked
3. Verify `DOMOTZ_REGION` matches your account's region
4. Regenerate credentials at Domotz Portal > User Menu > API Keys

### Region Mismatch

If you see unexpected errors or empty responses:
1. Confirm your region -- US accounts use `us-east-1`, EU accounts use `eu-central-1`
2. The API endpoint differs by region (`api-us-east-1-cell-1.domotz.com` vs `api-eu-central-1-cell-1.domotz.com`)

### Rate Limits

Domotz enforces API rate limits:
1. Space out requests when iterating over large device inventories
2. Use pagination to limit result sizes
3. If rate limited (HTTP 429), wait before retrying

### Connection Issues

If the MCP server fails to connect:
1. Verify network connectivity to `https://mcp.wyretechnology.com`
2. Check that your API credentials are valid
3. Ensure the MCP Gateway service is running

## API Documentation

- [Domotz Public API Documentation](https://portal.domotz.com/developers/)
- [Domotz Knowledge Base](https://help.domotz.com/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-27)

- Initial release
- 6 skills: api-patterns, agents, devices, alerts, network, eyes
- 5 commands: device-lookup, network-scan, alert-status, site-overview, device-inventory
