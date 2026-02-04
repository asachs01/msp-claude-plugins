---
title: Installation
description: Detailed installation guide for MSP Claude Plugins with MCP server configuration
---

This guide provides comprehensive installation instructions for MSP Claude Plugins, including MCP server configuration for direct API connectivity.

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Operating System** | macOS 12+, Linux (Ubuntu 20.04+), Windows 11 | macOS 14+, Ubuntu 22.04+ |
| **Node.js** | v18.0.0 | v20.0.0+ |
| **Claude Code CLI** | Latest version | Latest version |
| **Memory** | 4 GB RAM | 8 GB RAM |
| **Network** | Internet access to PSA/RMM APIs | Low-latency connection |

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/asachs01/msp-claude-plugins.git
cd msp-claude-plugins
```

### 2. Navigate to Your Plugin

For Kaseya Autotask:

```bash
cd kaseya/autotask
```

### 3. Configure MCP Server for Autotask

The MCP (Model Context Protocol) server enables direct API connectivity between Claude and Autotask.

#### MCP Configuration File

Create or verify the `.mcp.json` file in the plugin directory:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["-y", "autotask-mcp"],
      "env": {
        "AUTOTASK_USERNAME": "${AUTOTASK_USERNAME}",
        "AUTOTASK_SECRET": "${AUTOTASK_SECRET}",
        "AUTOTASK_INTEGRATION_CODE": "${AUTOTASK_INTEGRATION_CODE}",
        "AUTOTASK_API_ZONE": "${AUTOTASK_API_ZONE:-webservices5}"
      }
    }
  }
}
```

:::tip[API Zone]
The default API zone is `webservices5`. Check your Autotask instance URL to determine your zone (e.g., `ww5.autotask.net` uses `webservices5`).
:::

### 4. Set Environment Variables

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTOTASK_USERNAME` | API user email | `api-user@company.com` |
| `AUTOTASK_SECRET` | API secret key | `abc123...` |
| `AUTOTASK_INTEGRATION_CODE` | Integration tracking code | `YOUR_INT_CODE` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUTOTASK_API_ZONE` | API zone identifier | `webservices5` |

#### Setting Variables

**Temporary (current session):**

```bash
export AUTOTASK_USERNAME="your-api-user@domain.com"
export AUTOTASK_INTEGRATION_CODE="YOUR_INTEGRATION_CODE"
export AUTOTASK_SECRET="YOUR_SECRET"
```

**Persistent (recommended):**

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):

```bash
# Autotask API Configuration
export AUTOTASK_USERNAME="your-api-user@domain.com"
export AUTOTASK_INTEGRATION_CODE="YOUR_INTEGRATION_CODE"
export AUTOTASK_SECRET="YOUR_SECRET"
export AUTOTASK_API_ZONE="webservices5"
```

Then reload your profile:

```bash
source ~/.zshrc  # or ~/.bashrc
```

:::caution[Security Warning]
Never commit credentials to version control. Use environment variables or a secrets manager. Consider using a tool like [1Password CLI](https://developer.1password.com/docs/cli/) or [direnv](https://direnv.net/) for secure credential management.
:::

### 5. Verify Installation

#### Check Environment Variables

```bash
echo "Username: $AUTOTASK_USERNAME"
echo "Integration Code: $AUTOTASK_INTEGRATION_CODE"
echo "Secret: [set]" # Don't echo the actual secret
```

#### Test MCP Server Connection

```bash
npx -y autotask-mcp --test
```

Expected output:

```
Autotask MCP Server
Connecting to zone: webservices5
Authentication: Success
API Version: v1.0
```

#### Launch Claude Code

```bash
claude --plugin .
```

#### Test a Simple Query

```
You: Can you verify the Autotask connection by searching for any ticket?

Claude: Let me test the Autotask API connection...
[Uses MCP tool to query tickets]

Connection verified. Found X tickets in your Autotask instance.
```

## Troubleshooting

### Authentication Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid credentials | Verify username, secret, and integration code |
| `403 Forbidden` | Insufficient permissions | Check API user security level in Autotask |
| `Zone not found` | Wrong API zone | Verify your Autotask instance URL and update `AUTOTASK_API_ZONE` |

### MCP Server Issues

**Server not starting:**

```bash
# Check if npx can find the package
npx -y autotask-mcp --version

# Clear npx cache if needed
npx clear-npx-cache
```

**Environment variables not loading:**

```bash
# Verify variables are set
env | grep AUTOTASK

# If using direnv, ensure it's hooked
eval "$(direnv hook zsh)"  # or bash
```

### Connection Timeouts

If API requests timeout:

1. Check your network connectivity
2. Verify firewall rules allow outbound HTTPS to `*.autotask.net`
3. Try a different API zone if your primary is experiencing issues

### Plugin Not Loading

```bash
# Verify plugin.json exists
ls -la .claude-plugin/plugin.json

# Check JSON syntax
cat .claude-plugin/plugin.json | python -m json.tool
```

## Getting API Credentials

### Autotask API Setup

1. Log in to Autotask as an administrator
2. Navigate to **Admin > Resources (Users)**
3. Create a new API user or select an existing one
4. Go to **Security > API Tracking Identifier**
5. Generate a new integration code
6. Note your API secret (shown only once)

:::tip[API User Permissions]
Create a dedicated API user with only the permissions needed for your workflows. Avoid using admin accounts for API access.
:::

## Next Steps

- [Quick Start Guide](/msp-claude-plugins/getting-started/quick-start/) - Basic usage examples
- [Autotask Skills](/msp-claude-plugins/plugins/kaseya/autotask/) - Explore available skills
- [Commands Reference](/msp-claude-plugins/commands/overview/) - Full command documentation
- [Contributing](/msp-claude-plugins/contributing/how-to-contribute/) - Help improve the plugins
