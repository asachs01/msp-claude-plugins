# Checkpoint Harmony Email & Collaboration (Avanan) Plugin

Claude Code plugin for Checkpoint Harmony Email & Collaboration (formerly Avanan) integration.

## Overview

This plugin provides Claude with deep knowledge of Checkpoint Harmony Email & Collaboration, enabling:

- **Quarantine Management** - Search, review, release, and delete quarantined emails
- **Threat Detection** - Analyze phishing, malware, BEC, and account takeover threats
- **Policy Management** - View and manage DLP, anti-phishing, and anti-malware policies
- **Incident Investigation** - Investigate security incidents with full lifecycle management

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "CHECKPOINT_CLIENT_ID": "your-client-id",
    "CHECKPOINT_CLIENT_SECRET": "your-client-secret"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "CHECKPOINT_CLIENT_ID": "your-client-id",
    "CHECKPOINT_CLIENT_SECRET": "your-client-secret"
  }
}
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CHECKPOINT_CLIENT_ID` | Yes | | OAuth2 client ID from Infinity Portal |
| `CHECKPOINT_CLIENT_SECRET` | Yes | | OAuth2 client secret |
| `CHECKPOINT_AVANAN_MCP_URL` | No | `https://checkpoint-avanan-mcp.wyre.workers.dev/mcp` | MCP server URL -- override to use a self-hosted gateway |

## Self-Hosted Gateway

If you run the [mcp-gateway](https://github.com/wyre-technology/mcp-gateway), set `CHECKPOINT_AVANAN_MCP_URL` to your gateway's endpoint:

```
CHECKPOINT_AVANAN_MCP_URL=https://your-gateway-domain/v1/checkpoint-avanan/mcp
```

**Setting env vars in Claude.ai:** Go to your org > Settings > Integrations > Checkpoint Avanan > Configure and add the variable.

**Setting env vars in Claude Code:** Add to `~/.claude/settings.json`:
```json
{
  "env": {
    "CHECKPOINT_AVANAN_MCP_URL": "https://your-gateway-domain/v1/checkpoint-avanan/mcp"
  }
}
```

### Obtaining API Credentials

1. **Log into the Checkpoint Infinity Portal**
   - Navigate to [https://portal.checkpoint.com](https://portal.checkpoint.com)
   - Sign in with your administrator account

2. **Create API Keys**
   - Go to **Settings > API Keys**
   - Click **Create New Key**
   - Select the appropriate scope (Email & Collaboration)
   - Copy the Client ID and Client Secret immediately (secret is only shown once)

3. **Configure Permissions**
   - Ensure the API key has read/write access to:
     - Quarantine management
     - Threat detection
     - Policy management
     - Incident investigation

### Testing Your Connection

Once configured in Claude Code settings, test the connection:

```bash
# Test connection (using the Checkpoint Avanan MCP tool)
mcp-cli call checkpoint-avanan/avanan_test_connection '{}'
```

### API Documentation

- [Checkpoint Harmony Email API Documentation](https://sc1.checkpoint.com/documents/Harmony_Email_Collaboration/SmartGuide/Topics-HEC-EG/API/API-Reference.htm)
- [Infinity Portal](https://portal.checkpoint.com)

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `quarantine` | Email quarantine management and workflows |
| `threats` | Threat detection and analysis |
| `policies` | Email security policy management |
| `incidents` | Security incident investigation |
| `api-patterns` | Checkpoint Harmony API patterns and authentication |

## Available Commands

| Command | Description |
|---------|-------------|
| `/search-quarantine` | Search quarantined emails by various criteria |
| `/release-quarantine` | Release quarantined email(s) back to recipients |
| `/search-threats` | Search detected threats by type and severity |
| `/check-threat` | Get detailed threat analysis with IOCs |
| `/manage-policy` | View or toggle email security policies |

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
