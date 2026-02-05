# Kaseya IT Glue Plugin

Claude Code plugin for Kaseya IT Glue documentation platform integration.

## Overview

This plugin provides Claude with deep knowledge of IT Glue, enabling:

- **Organization Management** - Find and manage client organizations
- **Configuration Items** - Track servers, workstations, network devices, and other assets
- **Contact Management** - Access client contacts and communication details
- **Password Management** - Securely retrieve and manage credentials
- **Documentation** - Search and manage documents and runbooks
- **Flexible Assets** - Work with custom documentation templates

## Prerequisites

### API Credentials

You need an IT Glue API key with appropriate permissions:

1. Log into IT Glue as an administrator
2. Navigate to Account > API Keys
3. Create a new API key with required permissions
4. Note your region (US, EU, or AU)

### Environment Variables

Set the following environment variables:

```bash
export IT_GLUE_API_KEY="ITG.your-api-key-here"
export IT_GLUE_REGION="us"  # us, eu, or au
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `organizations` | Organization (company/client) management |
| `configurations` | Configuration item (asset) management |
| `contacts` | Contact management |
| `passwords` | Secure credential storage and retrieval |
| `documents` | Documentation management |
| `flexible-assets` | Custom structured documentation |
| `api-patterns` | IT Glue API patterns and best practices |

## Available Commands

| Command | Description |
|---------|-------------|
| `/lookup-asset` | Find a configuration by name, hostname, serial, or IP |
| `/search-docs` | Search documentation by keyword |
| `/get-password` | Retrieve a password (with security logging) |
| `/find-organization` | Find an organization by name |

## Quick Start

### Find an Organization

```
/find-organization "Acme"
```

### Look Up an Asset

```
/lookup-asset "DC-01" --organization "Acme Corp"
```

### Search Documentation

```
/search-docs "backup procedure" --organization "Acme Corp"
```

### Get a Password

```
/get-password "Domain Admin" --organization "Acme Corp"
```

## Security Considerations

### Password Access

- All password access is logged in IT Glue's audit trail
- Organization parameter is required for password lookups
- Passwords are masked by default; use `--show` to reveal
- Review password access logs regularly

### API Key Security

- Never commit API keys to version control
- Use environment variables for credentials
- Rotate API keys periodically
- Use minimum required permissions

## Regional Endpoints

IT Glue operates in multiple regions:

| Region | Base URL | Environment Variable |
|--------|----------|---------------------|
| US | `https://api.itglue.com` | `IT_GLUE_REGION=us` |
| EU | `https://api.eu.itglue.com` | `IT_GLUE_REGION=eu` |
| AU | `https://api.au.itglue.com` | `IT_GLUE_REGION=au` |

## API Rate Limits

IT Glue enforces rate limits:

- 3000 requests per 5 minutes
- ~100 requests per second burst limit

The plugin automatically handles rate limiting with exponential backoff.

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `IT_GLUE_API_KEY` is set correctly
2. Check the API key hasn't expired
3. Confirm the key has required permissions

### Wrong Region

If you see "404 Not Found" for valid resources:
1. Verify `IT_GLUE_REGION` matches your IT Glue account
2. Try each region (us, eu, au) if unsure

### Rate Limiting

If you see "429 Too Many Requests":
1. Wait for the rate limit window to reset
2. Reduce the frequency of requests
3. Use pagination for large data sets

## API Documentation

- [IT Glue API Documentation](https://api.itglue.com/developer/)
- [JSON:API Specification](https://jsonapi.org/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 1.0.0 (2026-02-04)

- Initial release
- 7 skills: organizations, configurations, contacts, passwords, documents, flexible-assets, api-patterns
- 4 commands: lookup-asset, search-docs, get-password, find-organization
