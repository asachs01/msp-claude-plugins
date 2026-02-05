# SuperOps.ai Plugin

Claude Code plugin for SuperOps.ai PSA/RMM integration.

## Overview

This plugin provides Claude with deep knowledge of SuperOps.ai, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Asset Management** - Query assets, run scripts, monitor patches
- **Client Operations** - Client and site management
- **Alert Handling** - Monitor, acknowledge, and resolve alerts
- **Runbook Execution** - Execute automation scripts on assets

## Prerequisites

### API Credentials

You need a SuperOps.ai API token with the following:

- API Token (generated from profile settings)
- Customer Subdomain
- Region (US or EU)

### Environment Variables

Set the following environment variables:

```bash
export SUPEROPS_API_KEY="your-api-token"
export SUPEROPS_SUBDOMAIN="your-subdomain"
export SUPEROPS_REGION="us"  # or "eu"
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management and workflows |
| `assets` | Asset inventory and management |
| `clients` | Client and site management |
| `alerts` | Alert monitoring and resolution |
| `runbooks` | Script and runbook execution |
| `api-patterns` | Common SuperOps.ai GraphQL patterns |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/list-assets` | List and filter assets |

## API Endpoints

SuperOps.ai provides region-specific endpoints:

**MSP Platform:**
- US: `https://api.superops.ai/msp`
- EU: `https://euapi.superops.ai/msp`

**IT Platform:**
- US: `https://api.superops.ai/it`
- EU: `https://euapi.superops.ai/it`

## API Documentation

- [SuperOps.ai API Documentation](https://developer.superops.ai/)
- [SuperOps.ai Help Center](https://support.superops.com/en/collections/3666305-api-documentation)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
