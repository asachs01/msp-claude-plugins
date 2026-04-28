# Check Point Avanan Plugin

Claude Code plugin for Check Point Avanan (Harmony Email & Collaboration).

## Overview

This plugin provides Claude with deep knowledge of Avanan, enabling:

- **Security Event Management** - Search, review, and act on email security events (malware, phishing, DLP, spam)
- **Quarantine & Release Workflows** - Quarantine threats, release false positives, mark messages as safe
- **Entity Search** - Search secured email entities across the Avanan-protected environment
- **MSP Tenant Management** - Manage multiple customer tenants via the Smart API multi-tenant interface
- **Exception Management** - Add and remove whitelist and blacklist exceptions for senders and domains

## Prerequisites

### API Credentials

Avanan uses a client credentials OAuth flow — a Client ID and Client Secret are exchanged for a Bearer token:

1. Log into your [Check Point Avanan Smart Dashboard](https://smart.avanan.net)
2. Navigate to **Settings > API**
3. Generate a Client ID and Client Secret pair
4. Note your region: `us`, `eu`, or `ap`

The MCP Gateway handles the token exchange automatically. You only need the Client ID, Secret, and region.

### Environment Variables

```bash
export AVANAN_CLIENT_ID="your-client-id"
export AVANAN_CLIENT_SECRET="your-client-secret"
export AVANAN_REGION="us"  # us, eu, or ap
```

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyre.ai) to connect — paste your Client ID and Secret and select your region. The gateway handles token exchange and refresh automatically.

### Self-Hosted (Docker)

Run the Avanan MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyre.ai) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variables:

```bash
export AVANAN_CLIENT_ID="your-client-id"
export AVANAN_CLIENT_SECRET="your-client-secret"
export AVANAN_REGION="us"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Client credentials auth flow, region selection, Smart API for multi-tenant MSP access |
| `security-events` | Security event lifecycle — event types, actions, quarantine, release, entity search |
| `tenant-management` | MSP Smart API — managing multiple customer tenants, exception management |

## Available Commands

| Command | Description |
|---------|-------------|
| `/review-events` | Review recent Avanan security events, filter by type, show quarantined items |
| `/manage-exceptions` | Add or remove whitelist/blacklist exceptions for senders or domains |

## Quick Start

### Review Recent Security Events

```
/review-events
```

### Review Phishing Events Only

```
/review-events --event_type phishing
```

### Add a Sender Exception

```
/manage-exceptions --action add --type whitelist --value sender@trusted-partner.com
```

## Security Considerations

### Credential Handling

- Never commit Client IDs or Secrets to version control
- Use environment variables for all credentials
- Rotate API credentials periodically via the Avanan Smart Dashboard
- Bearer tokens are short-lived — the gateway handles automatic refresh
- Use the minimum scope necessary for your use case

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `AVANAN_CLIENT_ID` and `AVANAN_CLIENT_SECRET` are set correctly
2. Confirm the region matches where your Avanan account is provisioned
3. Regenerate credentials from the Avanan Smart Dashboard > Settings > API
4. Check that the token has not expired (MCP Gateway handles refresh automatically)

### Region Selection

Avanan data is region-specific. If queries return 404 or empty results:
1. Confirm `AVANAN_REGION` is set to `us`, `eu`, or `ap`
2. The region must match where your Avanan account is provisioned
3. Contact your Avanan account manager if you are unsure which region to use

### Rate Limits

If you receive HTTP 429 responses:
1. Avanan enforces per-tenant rate limits on the API
2. Space out requests — avoid tight polling loops
3. Use date range filters to limit result sizes
4. Contact Avanan support if rate limits are impacting normal operations

## API Documentation

- [Check Point Avanan API Documentation](https://api.avanan.net/v1/docs)
- [Avanan Smart API (MSP)](https://smart.avanan.net/documentation)
- [Check Point Harmony Email Documentation](https://sc1.checkpoint.com/documents/Harmony_Email_and_Collaboration)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-02)

- Initial release
- 3 skills: api-patterns, security-events, tenant-management
- 2 commands: review-events, manage-exceptions
