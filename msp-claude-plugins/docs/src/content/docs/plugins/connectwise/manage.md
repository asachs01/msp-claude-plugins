---
title: ConnectWise Manage Plugin
description: Planned Claude Code plugin for ConnectWise Manage PSA
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Coming Soon">
  The ConnectWise Manage plugin is currently in development. This page outlines planned features and serves as a roadmap for contributors.
</Aside>

## Planned Features

The ConnectWise Manage plugin will provide Claude Code integration comparable to our [Autotask plugin](/msp-claude-plugins/plugins/kaseya/autotask/), including skills, slash commands, and MCP server connectivity.

### Planned Skills

| Skill | Description | Status |
|-------|-------------|--------|
| Service Tickets | Ticket management, boards, and workflows | Planned |
| Companies | Company management and configurations | Planned |
| Contacts | Contact management and communication | Planned |
| Projects | Project management and phases | Planned |
| Agreements | Service agreements and additions | Planned |
| Time Entries | Time tracking and billing | Planned |
| Configurations | Asset/configuration management | Planned |
| API Patterns | REST API conventions and best practices | Planned |

### Planned Commands

| Command | Description | Status |
|---------|-------------|--------|
| `/cw-create-ticket` | Create new service tickets | Planned |
| `/cw-search-tickets` | Search tickets with natural language | Planned |
| `/cw-time-entry` | Log time entries | Planned |
| `/cw-find-company` | Search company records | Planned |

### Planned MCP Tools

| Tool | Description | Status |
|------|-------------|--------|
| `connectwise_search_tickets` | Search service tickets | Planned |
| `connectwise_create_ticket` | Create new tickets | Planned |
| `connectwise_search_companies` | Search companies | Planned |
| `connectwise_create_company` | Create companies | Planned |
| `connectwise_search_contacts` | Search contacts | Planned |
| `connectwise_time_entry` | Create time entries | Planned |
| `connectwise_search_agreements` | Search agreements | Planned |
| `connectwise_search_configurations` | Search configurations | Planned |

## ConnectWise API Requirements

The plugin will require:

- ConnectWise Manage API credentials
- Company ID
- Public and Private API keys
- API member impersonation (recommended)

### Planned Configuration

```json
{
  "mcpServers": {
    "connectwise": {
      "command": "npx",
      "args": ["-y", "@msp-claude-plugins/connectwise-mcp"],
      "env": {
        "CW_COMPANY_ID": "your-company-id",
        "CW_PUBLIC_KEY": "your-public-key",
        "CW_PRIVATE_KEY": "your-private-key",
        "CW_SITE_URL": "https://na.myconnectwise.net"
      }
    }
  }
}
```

## Contributing

We welcome contributions to accelerate development of the ConnectWise Manage plugin.

### How to Contribute

1. **Review the Autotask plugin** as a reference implementation:
   - [Autotask Plugin Documentation](/msp-claude-plugins/plugins/kaseya/autotask/)
   - Source code in `packages/autotask/`

2. **Claim a component** by opening an issue:
   - Skills: Write domain knowledge markdown files
   - Commands: Implement slash command templates
   - MCP Server: Build API integration layer

3. **Follow the contribution guidelines**:
   - See [Contributing Guide](/msp-claude-plugins/contributing/)
   - Use consistent naming conventions
   - Include test coverage
   - Document all features

### Priority Areas

These components would have the highest impact:

1. **Service Ticket Skills** - Core workflow for most MSPs
2. **MCP Server Foundation** - API connectivity layer
3. **Search Commands** - Most frequently used operations

### ConnectWise API Resources

- [ConnectWise Developer Portal](https://developer.connectwise.com/)
- [Manage REST API Documentation](https://developer.connectwise.com/Products/Manage/REST)
- [API Authentication Guide](https://developer.connectwise.com/Products/Manage/Developer_Guide)

## Timeline

| Milestone | Target | Status |
|-----------|--------|--------|
| Skills Development | Q1 2026 | Not Started |
| Command Implementation | Q1 2026 | Not Started |
| MCP Server Alpha | Q2 2026 | Not Started |
| Beta Release | Q2 2026 | Not Started |
| GA Release | Q3 2026 | Not Started |

## Stay Updated

- Watch the [GitHub repository](https://github.com/your-org/msp-claude-plugins) for updates
- Join the discussion in [GitHub Discussions](https://github.com/your-org/msp-claude-plugins/discussions)
- Follow release announcements for beta access
