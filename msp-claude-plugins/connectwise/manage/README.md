# ConnectWise Manage Plugin

Claude Code plugin for ConnectWise Manage PSA integration.

## Overview

This plugin provides Claude with knowledge of ConnectWise Manage PSA, enabling:

- **Ticket Management** - Create, search, update service tickets
- **Service Board Routing** - Board configuration and routing rules
- **Agreement Management** - Contracts, agreements, billing

## Status

**Planned** - This plugin is in planning phase. See the PRD directory for development plans.

## Prerequisites

### API Credentials

You need ConnectWise Manage API credentials:

- Company ID
- Public Key
- Private Key
- Client ID
- Base URL

### Environment Variables

Set the following environment variables:

```bash
export CW_COMPANY_ID="your-company-id"
export CW_PUBLIC_KEY="your-public-key"
export CW_PRIVATE_KEY="your-private-key"
export CW_CLIENT_ID="your-client-id"
export CW_BASE_URL="https://api-na.myconnectwise.net"
```

## Planned Skills

| Skill | Description | Status |
|-------|-------------|--------|
| `ticket-management` | Service ticket operations | Planned |
| `service-board-routing` | Board configuration | Planned |
| `agreement-management` | Contract management | Planned |

## API Documentation

- [ConnectWise Manage REST API](https://developer.connectwise.com/Products/Manage/REST)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

This plugin needs contributors! If you have ConnectWise Manage API experience, please help build out the skills and commands.
