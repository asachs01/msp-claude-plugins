---
title: Plugin Catalog
description: Overview of all available MSP Claude Plugins for PSA and RMM integrations
---

MSP Claude Plugins provides vendor-specific Claude Code extensions that enable AI-powered workflows for Managed Service Providers. Each plugin includes skills, slash commands, and MCP server integrations tailored to specific PSA and RMM platforms.

## Available Plugins

| Vendor | Platform | Status | Skills | Commands | MCP Support |
|--------|----------|--------|--------|----------|-------------|
| [Kaseya](/msp-claude-plugins/plugins/kaseya/autotask/) | Autotask PSA | **Complete** | 7 | 3 | Yes |
| [ConnectWise](/msp-claude-plugins/plugins/connectwise/manage/) | Manage | Planned | - | - | Planned |
| ConnectWise | Automate | Roadmap | - | - | - |
| Datto | Autotask | Roadmap | - | - | - |
| NinjaRMM | NinjaOne | Roadmap | - | - | - |

## Plugin Components

Each MSP Claude Plugin can include three types of components:

### Skills

Skills are markdown files that provide Claude with domain knowledge about specific topics. They are loaded into Claude's context when relevant to help it understand terminology, best practices, and workflows.

```
.claude/skills/
├── vendor-platform-topic.md
└── shared-msp-terminology.md
```

### Slash Commands

Slash commands provide quick access to common workflows. They are invoked directly in Claude Code using the `/` prefix.

```
.claude/commands/
├── create-ticket.md
├── search-tickets.md
└── time-entry.md
```

### MCP Server Integration

MCP (Model Context Protocol) servers enable Claude to directly interact with PSA and RMM APIs. This allows for real-time data access and the ability to create, update, and manage records.

## Installation

Plugins are installed as dependencies in your Claude Code project:

```bash
# Install the Autotask plugin
npm install @msp-claude-plugins/autotask

# Run the setup script
npx msp-claude-setup autotask
```

See [Getting Started](/msp-claude-plugins/getting-started/) for detailed installation instructions.

## Shared Resources

Some skills are shared across all plugins:

| Skill | Description |
|-------|-------------|
| [MSP Terminology](/msp-claude-plugins/plugins/shared/msp-terminology/) | Common MSP, PSA, and RMM terminology and acronyms |
| [Ticket Triage](/msp-claude-plugins/plugins/shared/ticket-triage/) | Best practices for ticket prioritization and categorization |

## Contributing

We welcome contributions for new vendor plugins. See the [Contributing Guide](/msp-claude-plugins/contributing/) for details on how to add support for additional platforms.

### Plugin Development Checklist

- [ ] Core skills covering platform terminology and workflows
- [ ] Slash commands for common operations
- [ ] MCP server integration with API documentation
- [ ] Test coverage for all components
- [ ] Documentation with usage examples
