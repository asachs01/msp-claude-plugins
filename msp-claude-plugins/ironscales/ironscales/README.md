# Ironscales Plugin

Claude Code plugin for Ironscales, an AI-powered anti-phishing platform.

## Overview

This plugin provides Claude with deep knowledge of Ironscales, enabling:

- **Incident Management** - Triage, classify, and remediate phishing incidents reported by users or detected by AI
- **Email Classification** - Classify specific emails as phishing, spam, or legitimate
- **Remediation** - Take remediation actions on confirmed phishing incidents
- **Allowlist Management** - Manage sender allowlists to reduce false positives
- **Dashboard & Reporting** - Access company-wide phishing statistics and trends

## Prerequisites

### API Credentials

Ironscales authenticates via API key and company ID:

| Header | Description |
|--------|-------------|
| `X-Ironscales-API-Key` | Your Ironscales API key |
| `X-Ironscales-Company-ID` | Your Ironscales company ID |

To obtain credentials:

1. Log into the [Ironscales Platform](https://app.ironscales.com)
2. Navigate to **Settings > API**
3. Generate an API key and note your Company ID

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyretechnology.com) to connect — enter your API key and Company ID.

### Self-Hosted (Docker)

Run the Ironscales MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyretechnology.com) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variables:

```bash
export IRONSCALES_API_KEY="your-api-key"
export IRONSCALES_COMPANY_ID="your-company-id"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | API key + company ID authentication, available tools, pagination, error handling |
| `incidents` | Phishing incident lifecycle, classification, remediation, allowlist management |

## Available Commands

| Command | Description |
|---------|-------------|
| `/triage-incidents` | Triage open phishing incidents — list by status, classify, remediate |
| `/classify-email` | Classify a specific email as phishing, spam, or legitimate |

## Quick Start

### Triage Open Incidents

```
/triage-incidents
```

### Classify a Specific Email

```
/classify-email --incident_id "INC-12345" --classification phishing
```

### View Dashboard Statistics

```
Ask Claude: "Show me the Ironscales dashboard statistics for this company"
```

## Security Considerations

### Credential Handling

- Never commit API keys or company IDs to version control
- Use environment variables for all credentials
- Rotate API keys periodically via the Ironscales Platform
- Use the minimum permissions necessary for your use case

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `IRONSCALES_API_KEY` is set correctly
2. Confirm `IRONSCALES_COMPANY_ID` matches your tenant
3. Check that the API key has not been revoked at Ironscales Platform > Settings > API

### Incident Classification Not Taking Effect

If classification does not update:
1. Verify you have the correct `incident_id`
2. Confirm the incident is in an open/pending state — closed incidents cannot be reclassified
3. Check that your API key has write permissions

### Empty Incident List When Incidents Exist

1. Verify the `status` filter is correct — default may be filtering to a specific status
2. Confirm `IRONSCALES_COMPANY_ID` matches the tenant where incidents are located

## API Documentation

- [Ironscales API Documentation](https://ironscales.com/api-docs)
- [Ironscales Knowledge Base](https://support.ironscales.com)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-02)

- Initial release
- 2 skills: api-patterns, incidents
- 2 commands: triage-incidents, classify-email
