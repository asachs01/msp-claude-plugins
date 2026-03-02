# SpamTitan Plugin

Claude Code plugin for SpamTitan email security by TitanHQ.

## Overview

This plugin provides Claude with deep knowledge of SpamTitan, enabling:

- **Quarantine Management** - Review and act on held emails in the quarantine queue
- **Email Statistics** - Monitor inbound/outbound email flow, spam rates, and trends
- **Allowlist Management** - Add and remove trusted senders to prevent false positives
- **Blocklist Management** - Add and remove blocked senders to stop unwanted mail
- **Mass Release** - Bulk release or delete quarantined messages

## Prerequisites

### API Credentials

SpamTitan authenticates via API key:

1. Log into your SpamTitan admin interface
2. Navigate to **Settings > API**
3. Generate an API key

### Environment Variables

```bash
export SPAMTITAN_API_KEY="your-api-key"
export SPAMTITAN_BASE_URL="https://your-spamtitan-instance.com"  # for self-hosted
```

## Installation

### Via MCP Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyretechnology.com) to connect — paste your API key and you're done.

### Self-Hosted (Docker)

Run the SpamTitan MCP server via Docker with the MCP Gateway self-hosted option. See the [MCP Gateway documentation](https://mcp.wyretechnology.com) for setup instructions.

### Claude Code CLI

Add the `.mcp.json` from this plugin to your project and set the environment variables:

```bash
export SPAMTITAN_API_KEY="your-api-key"
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Authentication, API structure, pagination, rate limiting, error handling |
| `quarantine` | Quarantine queue management — listing, releasing, and deleting held messages |
| `lists` | Sender allowlist and blocklist management |

## Available Commands

| Command | Description |
|---------|-------------|
| `/review-quarantine` | Review quarantine queue, show stats summary, list recent held messages |
| `/manage-lists` | Add or remove entries from sender allowlists and blocklists |

## Quick Start

### Review Quarantine Queue

```
/review-quarantine
```

### Add a Sender to Allowlist

```
/manage-lists --action allow --sender "trusted@example.com"
```

### Block a Sender Domain

```
/manage-lists --action block --sender "@spammer.com"
```

## Security Considerations

### Credential Handling

- Never commit API keys to version control
- Use environment variables for all credentials
- Rotate API credentials periodically via the SpamTitan admin panel
- Use the minimum scope necessary for your use case

### HTTP Transport Security

If using the MCP server over HTTP transport, ensure:
- TLS termination via a reverse proxy
- Restrict access to trusted networks
- Use authentication at the proxy layer

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `SPAMTITAN_API_KEY` is set correctly
2. Regenerate credentials via the SpamTitan admin interface

### Connection Issues

If the MCP server fails to connect:
1. Verify network connectivity to `https://mcp.wyretechnology.com`
2. Check that your API credentials are valid
3. Ensure the MCP Gateway service is running

### Rate Limits

If you encounter HTTP 429 responses:
1. Reduce the frequency of requests
2. Use pagination and filters to limit result sizes
3. Apply exponential backoff before retrying

## API Documentation

- [SpamTitan API Documentation](https://www.titanhq.com/spamtitan/api/)
- [TitanHQ Knowledge Base](https://support.titanhq.com)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-03-02)

- Initial release
- 3 skills: api-patterns, quarantine, lists
- 2 commands: review-quarantine, manage-lists
