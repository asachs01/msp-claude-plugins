---
title: Introduction
description: Overview of MSP Claude Plugins - community-driven Claude Code plugins for Managed Service Providers
---

MSP Claude Plugins is a community-driven, open-source repository of Claude Code plugins and skills designed specifically for Managed Service Providers (MSPs). It provides vendor-organized plugins that enable technicians, engineers, and administrators to leverage Claude's capabilities with deep integration into PSA, RMM, and documentation tools.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   MSP Claude Plugins                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Kaseya    │  │ ConnectWise │  │   Shared    │         │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │         │
│  │  │Autotask│  │  │  │Manage │  │  │  │ MSP   │  │         │
│  │  │       │  │  │  │       │  │  │  │Termin.│  │         │
│  │  │Skills │  │  │  │Skills │  │  │  └───────┘  │         │
│  │  │Commands│  │  │  │Commands│  │  │  ┌───────┐  │         │
│  │  │MCP    │  │  │  │MCP    │  │  │  │Ticket │  │         │
│  │  └───────┘  │  │  └───────┘  │  │  │Triage │  │         │
│  └─────────────┘  └─────────────┘  │  └───────┘  │         │
│                                     └─────────────┘         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Quality Standards                    │  │
│  │  PRD Requirements │ Skill Checklist │ API Docs Guide │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     Templates                         │  │
│  │   Plugin PRD │ Skill Template │ Command Template     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Vendor-Organized Structure** | Find plugins by the tools you use (Kaseya, ConnectWise, etc.) |
| **Comprehensive Skills** | Domain knowledge for tickets, projects, contracts, and more |
| **Slash Commands** | Quick actions like `/create-ticket` and `/time-entry` |
| **MCP Integration** | Direct API connectivity to your PSA/RMM tools via Model Context Protocol |
| **Community-Driven** | Built by MSPs, for MSPs |

## Current Status

### Kaseya Autotask (Complete)

Full-featured plugin for Autotask PSA with comprehensive API coverage:

| Component | Description | Status |
|-----------|-------------|--------|
| **Skills (7)** | Tickets, CRM, Projects, Contracts, Time Entries, API Patterns, Configuration Items | Complete |
| **Commands (3)** | `/create-ticket`, `/search-tickets`, `/time-entry` | Complete |
| **MCP Config** | Autotask REST API integration | Complete |

### ConnectWise Manage (Planned)

| Component | Description | Status |
|-----------|-------------|--------|
| Plugin Structure | Manifest and MCP config | Ready |
| Skills | Service tickets, companies | Planned |
| Commands | Ticket operations | Planned |

### Shared Skills (Complete)

| Skill | Description |
|-------|-------------|
| MSP Terminology | Common MSP terms, acronyms, concepts |
| Ticket Triage | Best practices for prioritization and routing |

## Inspiration

This project is inspired by Anthropic's [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins), following the same architectural patterns while organizing content by MSP vendor ecosystem.

## Next Steps

- [Quick Start Guide](/msp-claude-plugins/getting-started/quick-start/) - Get running in 5 minutes
- [Installation Guide](/msp-claude-plugins/getting-started/installation/) - Detailed setup instructions
- [Kaseya Autotask Plugin](/msp-claude-plugins/plugins/kaseya/autotask/) - Explore the complete Autotask integration
- [Contributing](/msp-claude-plugins/contributing/how-to-contribute/) - Help build plugins for your favorite tools
