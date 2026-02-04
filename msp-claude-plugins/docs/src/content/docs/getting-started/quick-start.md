---
title: Quick Start
description: Get up and running with MSP Claude Plugins in 5 minutes
---

This guide will have you using MSP Claude Plugins in under 5 minutes.

## Prerequisites

Before starting, ensure you have:

- [Claude Code CLI](https://docs.anthropic.com/claude-code) installed
- API credentials for your PSA/RMM tool (Autotask credentials for this example)

:::tip[New to Claude Code?]
Visit the [Claude Code documentation](https://docs.anthropic.com/claude-code) to install and configure the CLI before continuing.
:::

## Step 1: Clone the Repository

```bash
git clone https://github.com/asachs01/msp-claude-plugins.git
cd msp-claude-plugins
```

## Step 2: Navigate to Your Vendor Plugin

```bash
cd kaseya/autotask
```

:::caution[Other Vendors]
Currently, only the Kaseya Autotask plugin is complete. ConnectWise Manage and other vendors are planned. See [Contributing](/msp-claude-plugins/contributing/how-to-contribute/) to help build support for your tools.
:::

## Step 3: Configure API Credentials

Set your Autotask API credentials as environment variables:

```bash
export AUTOTASK_USERNAME="your-api-user@domain.com"
export AUTOTASK_INTEGRATION_CODE="YOUR_INTEGRATION_CODE"
export AUTOTASK_SECRET="YOUR_SECRET"
```

:::tip[Persistent Configuration]
Add these exports to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) to avoid setting them every session.
:::

## Step 4: Launch Claude Code

Start Claude Code with the plugin loaded:

```bash
claude --plugin .
```

## Step 5: Start Using Skills and Commands

### Using Skills

Skills provide domain knowledge that Claude can reference. Simply ask questions:

```
You: How do I create a ticket with a critical priority?

Claude: Based on the Autotask ticket skill, critical priority is value 4
(higher number = higher priority in Autotask). Here's the API call:

POST /v1.0/Tickets
{
  "companyID": 12345,
  "title": "Server down - production outage",
  "priority": 4,
  "status": 1,
  "queueID": 8
}
```

### Using Commands

Commands provide quick slash-command shortcuts:

```
You: /create-ticket "Acme Corp" "Email not working" --priority 2

Claude: Ticket Created Successfully
Ticket Number: T20260204.0042
Company: Acme Corporation
Priority: High (2)
```

## Quick Reference

| Command | Description | Example |
|---------|-------------|---------|
| `/create-ticket` | Create a service ticket | `/create-ticket "Company" "Issue" --priority 2` |
| `/search-tickets` | Search and filter tickets | `/search-tickets --status open --company "Acme"` |
| `/time-entry` | Log time against tickets | `/time-entry T20260204.0042 2.0 "Troubleshooting"` |

## What's Next?

- [Installation Guide](/msp-claude-plugins/getting-started/installation/) - Detailed setup with MCP server configuration
- [Autotask Skills Reference](/msp-claude-plugins/plugins/kaseya/autotask/) - Explore all 7 available skills
- [Commands Reference](/msp-claude-plugins/commands/overview/) - Complete command documentation
