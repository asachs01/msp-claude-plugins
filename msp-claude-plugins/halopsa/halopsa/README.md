# HaloPSA Plugin

Claude Code plugin for HaloPSA integration.

## Overview

This plugin provides Claude with deep knowledge of HaloPSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets with actions and attachments
- **Client Operations** - Client CRUD, sites, and contacts management
- **Asset Tracking** - Asset management and device tracking
- **Contract Management** - Service agreements, billing, and recurring items
- **API Patterns** - OAuth 2.0 Client Credentials flow, pagination, rate limiting

## Prerequisites

### API Application Setup

You need to create an API application in HaloPSA:

1. Navigate to **Configuration > Integrations > HaloPSA API > View Applications**
2. Create a new application with **Client ID and Secret (Services)** authentication
3. Enable required permissions on the **Permissions** tab (recommend "all" for full access)
4. Note the **Client ID** and **Client Secret**

### Server URLs

Find these in **Configuration > Integrations > HaloPSA API > API Details**:

- **Resource Server URL**: `https://yourcompany.halopsa.com/api`
- **Authorization Server URL**: `https://yourcompany.halopsa.com/auth`
- **Tenant**: Your tenant name (for cloud-hosted instances)

### Environment Variables

Set the following environment variables:

```bash
export HALOPSA_CLIENT_ID="your-client-id"
export HALOPSA_CLIENT_SECRET="your-client-secret"
export HALOPSA_BASE_URL="https://yourcompany.halopsa.com"
export HALOPSA_TENANT="yourcompany"
```

**Note:** For self-hosted HaloPSA instances, the tenant may be left blank.

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Ticket management, actions, and attachments |
| `clients` | Client CRUD, sites, and contacts |
| `assets` | Asset tracking and device management |
| `contracts` | Contract management and billing |
| `api-patterns` | OAuth 2.0 authentication, pagination, rate limiting |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |

## Authentication

HaloPSA uses **OAuth 2.0 Client Credentials** flow for API authentication:

```bash
# Token request
curl -X POST "https://yourcompany.halopsa.com/auth/token?tenant=yourcompany" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=all"
```

The access token is then used in the `Authorization: Bearer <token>` header for all API requests.

## API Documentation

- [HaloPSA API Documentation](https://halopsa.com/apidoc/)
- [HaloPSA Guides](https://halopsa.com/guides/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
