# KnowBe4 Plugin

Claude Code plugin for the KnowBe4 PhishER and Security Awareness Training platform.

## Overview

This plugin provides Claude with deep knowledge of KnowBe4, enabling:

- **Phishing Incident Triage** - Review, classify, and take bulk action on reported phishing emails in PhishER
- **Threat Analysis** - Investigate suspicious email indicators and determine severity
- **Training Campaign Management** - Review phishing simulation and security awareness training campaigns
- **User Risk Scoring** - Track user risk scores and identify high-risk employees
- **Mass Remediation** - Bulk classify or purge malicious emails across the organization

## Prerequisites

### API Credentials

KnowBe4 authenticates via API key:

1. Log into the [KnowBe4 Console](https://training.knowbe4.com)
2. Navigate to **Account Settings > API**
3. Generate an API key
4. If operating in the EU region, note your region for the `X-KnowBe4-Region` header

### Environment Variables

```bash
export KNOWBE4_API_KEY="your-api-key"
export KNOWBE4_REGION="us"  # or "eu"
```

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyretechnology.com) to connect — paste your API key and select your region and you're done.

### Self-Hosted (Docker)

Run the KnowBe4 MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyretechnology.com) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variables:

```bash
export KNOWBE4_API_KEY="your-api-key"
export KNOWBE4_REGION="us"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Authentication, API structure, region selection, rate limiting, error handling |
| `phishing-incidents` | PhishER incident lifecycle — triage, classification, bulk remediation |
| `training-campaigns` | Phishing simulation campaigns, training enrollment, user risk scores |

## Available Commands

| Command | Description |
|---------|-------------|
| `/triage-phishing` | Triage reported phishing emails in PhishER queue, classify by threat level |
| `/review-campaigns` | Review active phishing simulation and training campaign status |

## Quick Start

### Triage PhishER Queue

```
/triage-phishing
```

### Review Phishing Simulation Campaigns

```
/review-campaigns
```

### Triage Critical Threats Only

```
/triage-phishing --severity critical
```

## Security Considerations

### Credential Handling

- Never commit API keys to version control
- Use environment variables for all credentials
- Rotate API credentials periodically via the KnowBe4 Console
- Use the minimum scope necessary for your use case
- Monitor API usage via the KnowBe4 audit log

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `KNOWBE4_API_KEY` is set correctly
2. Confirm you are using the correct region (`us` or `eu`)
3. Regenerate credentials at Account Settings > API

### Region Errors

If you receive unexpected 404 responses:
1. Check that `KNOWBE4_REGION` matches your account's region
2. EU accounts must use `eu`; US accounts must use `us`

### Rate Limits

KnowBe4 enforces API rate limits:
1. Use pagination to limit result sizes
2. If rate limited (HTTP 429), wait before retrying
3. Use filters to reduce result set sizes

## API Documentation

- [KnowBe4 PhishER API Documentation](https://developer.knowbe4.com/phishing/phisher)
- [KnowBe4 Training API Documentation](https://developer.knowbe4.com/training/v2)
- [KnowBe4 Knowledge Base](https://support.knowbe4.com)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-02)

- Initial release
- 3 skills: api-patterns, phishing-incidents, training-campaigns
- 2 commands: triage-phishing, review-campaigns
