# Wyre MSP Gateway Plugin

Unified Claude Code plugin that provides access to **all** connected MSP vendor tools through a single authenticated gateway.

## Overview

Instead of installing individual vendor plugins and managing separate API keys, the Wyre MSP Gateway aggregates all your connected tools into one MCP connector. Connect each vendor once through the gateway's web UI, and all tools appear under namespaced names like `itglue__search_organizations`, `autotask__create_ticket`, etc.

This plugin provides access to:

- **Asset & Documentation** - IT Glue, Hudu, Liongard
- **PSA / Ticketing** - Autotask, ConnectWise PSA, HaloPSA, SuperOps, Syncro
- **RMM** - Datto RMM, ConnectWise Automate, NinjaOne
- **Security** - SentinelOne, Huntress, Abnormal, Avanan, Blumira, Ironscales, Mimecast, Proofpoint, SpamTitan
- **Monitoring & Incident** - BetterStack, PagerDuty, Rootly
- **Business & Finance** - HubSpot, Salesbuildr, PandaDoc, QuickBooks, Xero, Pax8, KnowBe4
- **Collaboration** - Microsoft 365
- **Atera** - Atera all-in-one RMM + PSA

## Prerequisites

1. A Wyre Technology account at [mcp.wyretechnology.com](https://mcp.wyretechnology.com)
2. At least one vendor connected through the gateway

## Connecting Vendors

Each vendor must be connected individually through the gateway's connect page:

```
https://mcp.wyretechnology.com/connect/{vendor}
```

For example:
- `https://mcp.wyretechnology.com/connect/itglue` - Connect IT Glue
- `https://mcp.wyretechnology.com/connect/autotask` - Connect Autotask
- `https://mcp.wyretechnology.com/connect/datto-rmm` - Connect Datto RMM

Once connected, the vendor's tools are immediately available through the gateway.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WYRE_GATEWAY_URL` | No | `https://mcp.wyretechnology.com/mcp` | Gateway MCP endpoint URL |

## Installation

1. Install this plugin in Claude Code
2. Claude.ai will prompt for OAuth authentication when first connecting
3. Connect your vendors at `https://mcp.wyretechnology.com/connect/{vendor}`
4. All connected vendor tools appear automatically

No API keys or headers are needed — authentication is handled via OAuth Bearer token automatically.

## How It Works

The gateway acts as a single MCP endpoint that:

1. Authenticates your session via OAuth (Claude.ai handles this automatically)
2. Discovers which vendors you (or your team) have connected
3. Exposes all connected vendor tools under namespaced prefixes
4. Routes tool calls to the appropriate vendor MCP server

Tool names are prefixed with the vendor name to avoid collisions:
- `itglue__search_organizations`
- `autotask__create_ticket`
- `datto_rmm__list_devices`
- `sentinelone__get_threats`
- `huntress__list_agents`

## Supported Vendors

| Vendor | Namespace Prefix | Category |
|--------|-----------------|----------|
| Abnormal | `abnormal__` | Security |
| Atera | `atera__` | RMM + PSA |
| Autotask | `autotask__` | PSA |
| Avanan | `avanan__` | Security |
| BetterStack | `betterstack__` | Monitoring |
| Blumira | `blumira__` | Security |
| ConnectWise Automate | `cw_automate__` | RMM |
| ConnectWise PSA | `cw_psa__` | PSA |
| Datto RMM | `datto_rmm__` | RMM |
| HaloPSA | `halopsa__` | PSA |
| HubSpot | `hubspot__` | CRM |
| Hudu | `hudu__` | Documentation |
| Huntress | `huntress__` | Security |
| Ironscales | `ironscales__` | Security |
| IT Glue | `itglue__` | Documentation |
| KnowBe4 | `knowbe4__` | Security Awareness |
| Liongard | `liongard__` | Documentation |
| Microsoft 365 | `m365__` | Collaboration |
| Mimecast | `mimecast__` | Security |
| NinjaOne | `ninjaone__` | RMM |
| PagerDuty | `pagerduty__` | Incident Management |
| PandaDoc | `pandadoc__` | Documents |
| Pax8 | `pax8__` | Marketplace |
| Proofpoint | `proofpoint__` | Security |
| QuickBooks | `quickbooks__` | Finance |
| Rootly | `rootly__` | Incident Management |
| Salesbuildr | `salesbuildr__` | Quoting |
| SentinelOne | `sentinelone__` | Security |
| SpamTitan | `spamtitan__` | Security |
| SuperOps | `superops__` | PSA + RMM |
| Syncro | `syncro__` | PSA + RMM |
| Xero | `xero__` | Finance |

## Team / Organization Access

If your Wyre account belongs to a team or organization, vendor connections are shared across the team. Any team member who connects a vendor makes it available for all team members using the gateway.

## Troubleshooting

### OAuth prompt doesn't appear

1. Ensure `WYRE_GATEWAY_URL` is set correctly (default: `https://mcp.wyretechnology.com/mcp`)
2. Try disconnecting and reconnecting the plugin

### No tools available after connecting

1. Verify you've connected at least one vendor at `https://mcp.wyretechnology.com/connect/{vendor}`
2. Check your connection status at `https://mcp.wyretechnology.com`

### Tool call errors

1. Verify the vendor connection hasn't expired — reconnect if needed
2. Check vendor-specific API limits (each vendor has its own rate limits)

## vs. Individual Vendor Plugins

| Feature | Gateway Plugin | Individual Plugins |
|---------|---------------|-------------------|
| Setup | One plugin, OAuth login | One plugin per vendor, separate API keys |
| Auth | OAuth (automatic) | API keys per vendor |
| Tools | All vendors in one namespace | Per-vendor tools |
| Team sharing | Shared vendor connections | Each user manages own keys |
| Best for | Production use, teams | Development, single-vendor focus |

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Changelog

### 1.0.0 (2026-03-06)

- Initial release
- Unified gateway plugin for aggregated MCP access
- OAuth-based authentication (no API keys needed)
- Support for 32+ MSP vendor integrations
