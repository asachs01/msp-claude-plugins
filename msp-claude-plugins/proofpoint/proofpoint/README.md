# Proofpoint Plugin

Claude Code plugin for the Proofpoint TAP (Targeted Attack Protection) and Essentials APIs.

## Overview

This plugin provides Claude with deep knowledge of Proofpoint, enabling:

- **Threat Intelligence** - Query TAP threat data, SIEM events, and campaign intelligence
- **Click & Message Tracking** - Monitor URL clicks (permitted and blocked) and message delivery/block events
- **Message Tracing** - Trace email messages through Proofpoint Essentials by sender, recipient, subject, or date
- **MSP Organization Management** - List and manage Essentials organizations for multi-tenant MSP deployments
- **Email Statistics** - Retrieve per-organization email volume and security metrics

## Prerequisites

### API Credentials

Proofpoint uses HTTP Basic Auth with a service principal and secret:

**TAP (Targeted Attack Protection) API:**
1. Log into the [Proofpoint TAP Dashboard](https://tap.proofpoint.com)
2. Navigate to **Settings > Connected Applications**
3. Generate a service principal and secret

**Essentials API:**
1. Log into your [Proofpoint Essentials](https://essentials.proofpoint.com) admin console
2. Navigate to **API > Credentials**
3. Create an API user and secret

### Environment Variables

```bash
export PROOFPOINT_PRINCIPAL="your-service-principal"
export PROOFPOINT_SECRET="your-service-secret"
export PROOFPOINT_REGION="us1"  # us1, us2, us3, us4, uk1, eu1
```

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyretechnology.com) to connect — paste your service principal and secret and you're done.

### Self-Hosted (Docker)

Run the Proofpoint MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyretechnology.com) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variables:

```bash
export PROOFPOINT_PRINCIPAL="your-service-principal"
export PROOFPOINT_SECRET="your-service-secret"
export PROOFPOINT_REGION="us1"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Authentication, TAP vs Essentials API distinction, region selection, pagination, error handling |
| `threats` | TAP threat intelligence — SIEM clicks, messages, campaigns, and forensics |
| `message-trace` | Essentials message trace — search by sender, recipient, subject, date range |
| `msp-management` | MSP org listing and per-org email statistics |

## Available Commands

| Command | Description |
|---------|-------------|
| `/threat-summary` | Generate a TAP threat summary with recent clicks, blocked threats, and campaign activity |
| `/trace-message` | Trace an email message through Proofpoint Essentials |
| `/org-email-stats` | Get email statistics for one or all MSP organizations |

## Quick Start

### Get a Threat Summary

```
/threat-summary
```

### Trace a Suspicious Email

```
/trace-message --sender "attacker@example.com" --recipient "user@client.com"
```

### Check Organization Email Stats

```
/org-email-stats --org_id "acme-corp"
```

## Security Considerations

### Credential Handling

- Never commit service principals or secrets to version control
- Use environment variables for all credentials
- Rotate API credentials periodically via the Proofpoint dashboards
- Use the minimum scope necessary for your use case
- Monitor API usage in Proofpoint audit logs

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `PROOFPOINT_PRINCIPAL` and `PROOFPOINT_SECRET` are set correctly
2. Ensure the credentials are for the correct API (TAP vs Essentials)
3. Check that the credentials have not been revoked
4. Regenerate credentials from the appropriate Proofpoint portal

### Region Selection

Proofpoint data is region-specific. If you receive 404 or empty results:
1. Confirm the correct region: `us1`, `us2`, `us3`, `us4`, `uk1`, or `eu1`
2. Set `PROOFPOINT_REGION` to the region matching your Proofpoint account

### Rate Limits

If you receive HTTP 429 responses:
1. Space out requests when iterating over large date ranges
2. Reduce query window sizes (e.g., 1 hour vs 24 hours)
3. Use exponential backoff before retrying

## API Documentation

- [Proofpoint TAP API Documentation](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation)
- [Proofpoint Essentials API Documentation](https://essentials.proofpoint.com/api-docs)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-02)

- Initial release
- 4 skills: api-patterns, threats, message-trace, msp-management
- 3 commands: threat-summary, trace-message, org-email-stats
