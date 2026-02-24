# CIPP Plugin

Claude Code plugin for CIPP (CyberDrain Improved Partner Portal) M365 multi-tenant management.

## Overview

This plugin provides Claude with deep knowledge of CIPP, enabling:

- **Tenant Management** - List, view, onboard, and manage M365 customer tenants with cache refresh and exclusion controls
- **User Operations** - Full user lifecycle including creation, offboarding, license management, mailbox permissions, and MFA
- **Standards Compliance** - Deploy and monitor security baselines, check compliance across tenants, manage templates
- **Security Posture** - Secure Score analysis, conditional access policy review, MFA status, and password policy assessment
- **Alert Monitoring** - View alerts, query audit logs, track incidents, and configure webhook notifications

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "CIPP_BASE_URL": "https://your-cipp-instance.app",
    "CIPP_API_KEY": "your-api-key"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "CIPP_BASE_URL": "https://your-cipp-instance.app",
    "CIPP_API_KEY": "your-api-key"
  }
}
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `CIPP_BASE_URL` | Yes | Your CIPP instance URL (e.g., `https://your-cipp-instance.app`) |
| `CIPP_API_KEY` | Yes | API key from CIPP Settings |

### Obtaining API Credentials

1. **Log into CIPP**
   - Navigate to your CIPP instance (e.g., `https://your-cipp-instance.app`)

2. **Generate an API Key**
   - Go to **Settings > Backend > API Authentication**
   - Create a new API key
   - Copy the generated key (store securely)

3. **Find Your Instance URL**
   - Your CIPP base URL is the root URL of your CIPP deployment
   - Example: `https://your-org.app` or your custom domain

### Testing Your Connection

Once configured, test the connection:

```bash
curl -s "${CIPP_BASE_URL}/api/ListTenants" \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" | jq
```

## Installation

```bash
# Clone the repository
git clone https://github.com/wyre-technology/msp-claude-plugins.git

# Navigate to plugin
cd msp-claude-plugins/cipp/cipp

# Use with Claude Code
claude --plugin .
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | API key authentication, base URL patterns, endpoints, pagination, and error handling |
| `tenants` | Tenant listing, details, cache refresh, exclusions, and onboarding |
| `users` | User CRUD, offboarding, license management, and mailbox permissions |
| `standards` | Standards deployment, monitoring, and compliance checking |
| `security` | Secure Score, conditional access, MFA status, and security posture assessment |
| `alerts` | Alert management, audit logs, and incident tracking |

## Available Commands

| Command | Description |
|---------|-------------|
| `/cipp-tenant-summary` | List all managed tenants with status overview |
| `/cipp-user-offboard` | Offboard a user (disable, revoke sessions, convert mailbox) |
| `/cipp-standards-check` | Check standards compliance across tenants |
| `/cipp-security-posture` | Review Secure Score and MFA status across tenants |
| `/cipp-alert-review` | Review recent alerts and audit log events |

## API Reference

- **Base URL**: `https://{instance}/api`
- **Auth**: API key via `x-api-key` header or query parameter
- **Rate Limit**: Standard rate limits (varies by CIPP deployment)
- **Docs**: [CIPP Documentation](https://docs.cipp.app/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Changelog

### 0.1.0 (2026-02-24)

- Initial release
- 6 skills: api-patterns, tenants, users, standards, security, alerts
- 5 commands: cipp-tenant-summary, cipp-user-offboard, cipp-standards-check, cipp-security-posture, cipp-alert-review
