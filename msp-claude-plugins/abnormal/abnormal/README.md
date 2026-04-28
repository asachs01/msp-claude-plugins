# Abnormal Security Plugin

Claude Code plugin for Abnormal Security, an AI-native email security platform.

## Overview

This plugin provides Claude with deep knowledge of Abnormal Security, enabling:

- **Threat Investigation** - Analyze AI-detected email threats including BEC, phishing, and account takeover
- **Case Management** - Review and manage security cases and abuse reports
- **Message Analysis** - Deep dive into individual messages within threat cases
- **Remediation** - Trigger and verify email remediation actions

## Prerequisites

### API Credentials

Abnormal Security authenticates via Bearer token:

| Header | Description |
|--------|-------------|
| `Authorization` | Bearer token (`Bearer <your-token>`) |

To obtain an API token:

1. Log into the [Abnormal Security Portal](https://portal.abnormalsecurity.com)
2. Navigate to **Settings > API**
3. Generate an API token

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyre.ai) to connect — paste your API token and you're done.

### Self-Hosted (Docker)

Run the Abnormal Security MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyre.ai) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variable:

```bash
export ABNORMAL_API_TOKEN="your-api-token"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Bearer token authentication, API structure, pagination, rate limiting, error handling |
| `threats` | Threat types (BEC, phishing, account takeover), threat lifecycle, message analysis |
| `cases` | Security cases, abuse reports, user-reported phishing |

## Available Commands

| Command | Description |
|---------|-------------|
| `/threat-investigation` | Investigate a specific Abnormal threat case — messages, indicators, remediation status |
| `/abuse-report-review` | Review user-reported phishing emails awaiting analysis |

## Quick Start

### Investigate a Threat Case

```
/threat-investigation --threat_id "abc123"
```

### Review Abuse Reports

```
/abuse-report-review
```

## Security Considerations

### Credential Handling

- Never commit API tokens to version control
- Use environment variables for all credentials
- Rotate API tokens periodically via the Abnormal Security Portal
- Use read-only API access unless remediation actions are required
- Monitor API usage in the Abnormal Security audit log

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `ABNORMAL_API_TOKEN` is set correctly
2. Check that the token includes the `Bearer ` prefix if constructing the header manually
3. Verify the token has not been revoked at Abnormal Security Portal > Settings > API

### Rate Limits

Abnormal Security enforces rate limits per API endpoint:
1. Use filters to reduce result set sizes
2. If rate limited (HTTP 429), wait and retry with exponential backoff
3. Avoid continuous polling — use targeted queries

### Empty Threat Results

If threat queries return empty results when threats are expected:
1. Confirm the date range covers the expected period
2. Verify the API token has sufficient permissions
3. Check the Abnormal Security Portal directly to confirm threats exist

## API Documentation

- [Abnormal Security API Documentation](https://app.swaggerhub.com/apis/AbnormalSecurity/abnormal-security_rest_api)
- [Abnormal Security Knowledge Base](https://help.abnormalsecurity.com)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-02)

- Initial release
- 3 skills: api-patterns, threats, cases
- 2 commands: threat-investigation, abuse-report-review
