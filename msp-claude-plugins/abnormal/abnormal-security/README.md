# Abnormal Security Plugin

Claude Code plugin for the Abnormal Security AI-powered email security platform.

## Overview

This plugin provides Claude with deep knowledge of Abnormal Security, enabling:

- **Threat Detection** - Investigate BEC, phishing, malware, and socially-engineered email attacks
- **Abuse Mailbox Cases** - Manage user-reported email cases with triage and remediation workflows
- **Message Analysis** - Analyze email headers, attachments, sender reputation, and delivery context
- **Vendor Risk Assessment** - Monitor VendorBase vendor risk scores and compromised vendor activity
- **Account Takeover Protection** - Detect suspicious sign-ins, impossible travel, and compromised accounts

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "ABNORMAL_API_TOKEN": "your-api-token"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "ABNORMAL_API_TOKEN": "your-api-token"
  }
}
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ABNORMAL_API_TOKEN` | Yes | | API token from Settings > Integrations > API |
| `ABNORMAL_MCP_URL` | No | `https://mcp.wyre.ai/v1/abnormal-security/mcp` | MCP server URL -- override to use a self-hosted gateway |

## Self-Hosted Gateway

If you run the [mcp-gateway](https://github.com/wyre-technology/mcp-gateway), set `ABNORMAL_MCP_URL` to your gateway's endpoint:

```
ABNORMAL_MCP_URL=https://your-gateway-domain/v1/abnormal-security/mcp
```

**Setting env vars in Claude.ai:** Go to your org > Settings > Integrations > Abnormal Security > Configure and add the variable.

**Setting env vars in Claude Code:** Add to `~/.claude/settings.json`:
```json
{
  "env": {
    "ABNORMAL_MCP_URL": "https://your-gateway-domain/v1/abnormal-security/mcp"
  }
}
```

### Obtaining API Credentials

1. **Log into the Abnormal Security Portal**
   - Navigate to [https://portal.abnormalsecurity.com](https://portal.abnormalsecurity.com)
   - Sign in with your administrator account

2. **Generate API Token**
   - Go to **Settings > Integrations > API**
   - Click **Generate Token**
   - Copy the API token immediately (it is only shown once)

3. **Configure Permissions**
   - Ensure the API token has read access to:
     - Threats
     - Cases (Abuse Mailbox)
     - Messages
     - Account Takeover
     - Vendor Risk (VendorBase)

### Testing Your Connection

Once configured in Claude Code settings, test the connection:

```bash
# Test connection (using the Abnormal Security MCP tool)
mcp-cli call abnormal-security/abnormal_test_connection '{}'
```

### API Documentation

- [Abnormal Security API Documentation](https://app.swaggerhub.com/apis/abnormal-security/abx)
- [Abnormal Security Portal](https://portal.abnormalsecurity.com)

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `threats` | Threat detection and email threat analysis (BEC, phishing, malware) |
| `cases` | Abuse mailbox case management, triage, and remediation |
| `messages` | Message analysis, headers, attachments, sender reputation |
| `vendors` | VendorBase vendor risk assessment and compromised vendor tracking |
| `account-takeover` | Account takeover detection, suspicious sign-ins, compromised accounts |
| `api-patterns` | Abnormal Security REST API authentication, pagination, and error handling |

## Available Commands

| Command | Description |
|---------|-------------|
| `/threat-triage` | Triage recent email threats by severity and attack type |
| `/search-threats` | Search for specific threat patterns by sender, recipient, or type |
| `/case-review` | Review and triage abuse mailbox cases |
| `/vendor-risk` | Check vendor risk scores and compromised vendor activity |
| `/account-audit` | Audit for account takeover indicators and suspicious sign-ins |

## Quick Start

### Triage Recent Threats

```
/threat-triage
```

### Search for BEC Threats

```
/search-threats --type bec
```

### Review Abuse Mailbox Cases

```
/case-review
```

### Check Vendor Risk

```
/vendor-risk --vendor "example-vendor.com"
```

### Audit Account Takeover

```
/account-audit --user "user@company.com"
```

## Security Considerations

### Credential Handling

- Never commit API tokens to version control
- Use environment variables for all credentials
- Rotate API tokens periodically via the Abnormal Security portal
- Use the minimum scope necessary for your use case
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
2. Check that the API token has not been revoked
3. Regenerate the token at Abnormal Security Portal > Settings > Integrations > API

### Rate Limits

Abnormal Security enforces API rate limits:
1. Space out requests when iterating over large datasets
2. Use pagination with `pageSize` to limit result sizes
3. If rate limited (HTTP 429), wait before retrying

### Connection Issues

If the MCP server fails to connect:
1. Verify network connectivity to `https://mcp.wyre.ai`
2. Check that your API token is valid
3. Ensure the MCP Gateway service is running

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-27)

- Initial release
- 6 skills: threats, cases, messages, vendors, account-takeover, api-patterns
- 5 commands: threat-triage, search-threats, case-review, vendor-risk, account-audit
