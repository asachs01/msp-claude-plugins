# Inforcer Plugin

Claude Code plugin for Inforcer M365 security policy management platform.

## Overview

This plugin provides Claude with deep knowledge of Inforcer, enabling:

- **Tenant Management** - List, tag, group, and monitor onboarding status of managed M365 tenants
- **Baseline Deployment** - Create and deploy security baselines aligned to CIS, NIST, and ISO 27001 frameworks
- **Policy Management** - Deploy and manage Entra ID, Intune, Defender, Exchange, and SharePoint policies across tenants
- **Drift Detection** - Monitor policy drift, receive alerts, and configure automated remediation
- **Compliance Reporting** - Generate compliance reports, track Secure Score trends, assess Copilot readiness, and produce executive summaries

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "INFORCER_BASE_URL": "https://api.inforcer.com",
    "INFORCER_API_KEY": "your-api-key"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "INFORCER_BASE_URL": "https://api.inforcer.com",
    "INFORCER_API_KEY": "your-api-key"
  }
}
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `INFORCER_BASE_URL` | Yes | Inforcer API base URL (default: `https://api.inforcer.com`) |
| `INFORCER_API_KEY` | Yes | API key from Inforcer Portal > Settings > API Access |

### Obtaining API Credentials

1. **Log into the Inforcer Portal**
   - Navigate to `https://portal.inforcer.com`

2. **Generate an API Key**
   - Go to **Settings > API Access**
   - Click **Generate API Key**
   - Copy the generated key (store securely -- it is shown only once)

3. **Note Your Base URL**
   - The default API base URL is `https://api.inforcer.com`
   - If your organization uses a regional or custom deployment, use the URL provided by Inforcer support

### Testing Your Connection

Once configured in Claude Code settings, test the connection:

```bash
curl -s "https://api.inforcer.com/v1/tenants" \
  -H "Authorization: Bearer ${INFORCER_API_KEY}" \
  -H "Content-Type: application/json" | jq '.data | length'
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | API authentication, base URL, endpoints, pagination, error codes, and rate limiting |
| `tenants` | Tenant listing, tags, grouping, onboarding status, and multi-tenant operations |
| `baselines` | Baseline creation, deployment, CIS/NIST/ISO alignment, and template management |
| `policies` | Entra ID, Intune, Defender, Exchange, and SharePoint policy deployment |
| `drift-detection` | Policy drift monitoring, alerts, automated remediation, and drift history |
| `reporting` | Compliance reports, Secure Score tracking, Copilot readiness, and executive summaries |

## Available Commands

| Command | Description |
|---------|-------------|
| `/inforcer-tenant-overview` | List all managed tenants with compliance status |
| `/inforcer-baseline-compare` | Compare a tenant's current config against a baseline |
| `/inforcer-drift-check` | Check for policy drift across tenant groups |
| `/inforcer-compliance-report` | Generate compliance report for a tenant or group |
| `/inforcer-secure-score` | Review Microsoft Secure Score trends |

## Quick Start

### List Managed Tenants

```
/inforcer-tenant-overview
```

### Compare Against Baseline

```
/inforcer-baseline-compare --tenant "Contoso Ltd"
```

### Check for Drift

```
/inforcer-drift-check --group "Gold Tier"
```

### Generate Compliance Report

```
/inforcer-compliance-report --tenant "Contoso Ltd" --format summary
```

## API Reference

- **Base URL**: `https://api.inforcer.com`
- **Auth**: API Key via `Authorization: Bearer <key>` header
- **Rate Limits**: Standard rate limits apply (see Inforcer documentation)
- **Pagination**: Cursor-based with `cursor` and `limit` parameters
- **Docs**: [Inforcer API Documentation](https://docs.inforcer.com/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-02-24)

- Initial release
- 6 skills: api-patterns, tenants, baselines, policies, drift-detection, reporting
- 5 commands: inforcer-tenant-overview, inforcer-baseline-compare, inforcer-drift-check, inforcer-compliance-report, inforcer-secure-score
