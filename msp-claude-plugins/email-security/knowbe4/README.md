# KnowBe4 Security Awareness Plugin

Claude Code plugin for KnowBe4 security awareness training and phishing simulation integration.

## Overview

This plugin provides Claude with deep knowledge of KnowBe4, enabling:

- **Phishing Simulations** - Campaign management, security test tracking, click rate analysis
- **Training Campaigns** - Enrollment workflows, completion tracking, content management
- **User Management** - User lifecycle, group membership, risk score tracking
- **Reporting** - Security awareness metrics, trend analysis, executive dashboards

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "KNOWBE4_API_KEY": "your-api-token",
    "KNOWBE4_REGION": "US"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "KNOWBE4_API_KEY": "your-api-token",
    "KNOWBE4_REGION": "US"
  }
}
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `KNOWBE4_API_KEY` | Yes | | API token from KnowBe4 console |
| `KNOWBE4_REGION` | Yes | `US` | Account region: `US`, `EU`, `CA`, `UK`, `DE` |
| `KNOWBE4_MCP_URL` | No | `https://knowbe4-mcp.wyre.workers.dev/mcp` | MCP server URL -- override to use a self-hosted gateway |

## Self-Hosted Gateway

If you run the [mcp-gateway](https://github.com/wyre-technology/mcp-gateway), set `KNOWBE4_MCP_URL` to your gateway's endpoint:

```
KNOWBE4_MCP_URL=https://your-gateway-domain/v1/knowbe4/mcp
```

**Setting env vars in Claude.ai:** Go to your org > Settings > Integrations > KnowBe4 > Configure and add the variable.

**Setting env vars in Claude Code:** Add to `~/.claude/settings.json`:
```json
{
  "env": {
    "KNOWBE4_MCP_URL": "https://your-gateway-domain/v1/knowbe4/mcp"
  }
}
```

### Obtaining API Credentials

1. **Get Your API Token**
   - Log into the KnowBe4 console as an admin
   - Navigate to **Account Settings > API > API Token**
   - Click **Generate Token** (or copy your existing token)
   - The token provides read access to your account data

2. **Determine Your Region**
   - Check the URL when logged into KnowBe4:
     - `training.knowbe4.com` = **US**
     - `eu.knowbe4.com` = **EU**
     - `ca.knowbe4.com` = **CA**
     - `uk.knowbe4.com` = **UK**
     - `de.knowbe4.com` = **DE**

### Testing Your Connection

Once configured in Claude Code settings, test the connection:

```bash
# Test with curl (env vars must be set)
curl -H "Authorization: Bearer ${KNOWBE4_API_KEY}" \
     "https://${KNOWBE4_REGION,,}.api.knowbe4.com/v1/account"
```

### API Documentation

- [KnowBe4 Reporting API Documentation](https://developer.knowbe4.com/)
- [API Authentication Guide](https://developer.knowbe4.com/rest/reporting#tag/Authentication)

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `phishing` | Phishing simulation campaign management and tracking |
| `training` | Training campaign enrollment and completion workflows |
| `users` | User lifecycle, group management, and risk scores |
| `reporting` | Security awareness metrics and trend analysis |
| `api-patterns` | KnowBe4 API authentication, regions, and rate limits |

## Available Commands

| Command | Description |
|---------|-------------|
| `/phishing-results` | View phishing campaign results and click rates |
| `/training-status` | Check training completion status for users/groups |
| `/user-risk` | Get risk score and history for a user |
| `/campaign-summary` | Get summary of recent phishing and training campaigns |
| `/group-report` | Get security awareness metrics for a group |

## API Documentation

- [KnowBe4 Reporting API](https://developer.knowbe4.com/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
