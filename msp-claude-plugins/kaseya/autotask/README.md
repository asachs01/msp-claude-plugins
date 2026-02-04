# Kaseya Autotask Plugin

Claude Code plugin for Kaseya Autotask PSA integration.

## Overview

This plugin provides Claude with deep knowledge of Autotask PSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **CRM Operations** - Company and contact management
- **Project Management** - Project creation, task tracking, resource assignment
- **Contract Management** - Service agreements, billing, renewals
- **Time Entry** - Log time against tickets and projects

## Prerequisites

### API Credentials

You need an Autotask API user with the following:

- API Integration Code
- Username (email)
- Secret key
- Zone URL

### Environment Variables

Set the following environment variables:

```bash
export AUTOTASK_USERNAME="your-api-user@company.com"
export AUTOTASK_SECRET="your-api-secret"
export AUTOTASK_INTEGRATION_CODE="your-integration-code"
export AUTOTASK_ZONE="webservices5"  # or your zone
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management and workflows |
| `crm` | Company and contact management |
| `projects` | Project and task management |
| `contracts` | Service agreement and billing |
| `api-patterns` | Common Autotask API patterns |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |
| `/update-account` | Update company information |
| `/create-project` | Create a new project |
| `/time-entry` | Log time against a ticket or project |

## API Documentation

- [Autotask REST API Documentation](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
