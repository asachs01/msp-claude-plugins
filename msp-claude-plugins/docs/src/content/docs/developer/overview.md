---
title: Developer Guide Overview
description: Understanding the MSP Claude Plugins architecture, file structure, and development workflow
---

This guide provides developers with a comprehensive understanding of how MSP Claude Plugins are structured and how to contribute new plugins, skills, and commands.

## Plugin Architecture

MSP Claude Plugins follow a modular architecture organized by vendor and product. Each plugin can contain three types of components:

```
msp-claude-plugins/
├── _standards/              # Quality standards documentation
├── _templates/              # Templates for new contributions
├── kaseya/                  # Vendor: Kaseya
│   ├── autotask/           # Product: Autotask PSA
│   │   ├── .claude-plugin/ # Plugin metadata
│   │   │   └── plugin.json
│   │   ├── .mcp.json       # MCP server configuration
│   │   ├── skills/         # Domain knowledge files
│   │   │   ├── tickets/
│   │   │   │   └── SKILL.md
│   │   │   ├── crm/
│   │   │   │   └── SKILL.md
│   │   │   └── ...
│   │   ├── commands/       # Slash command definitions
│   │   │   ├── create-ticket.md
│   │   │   ├── search-tickets.md
│   │   │   └── time-entry.md
│   │   ├── agents/         # Agent configurations (future)
│   │   ├── prd/            # Product Requirements Documents
│   │   └── README.md
│   ├── datto-rmm/
│   ├── it-glue/
│   └── vsa/
├── connectwise/            # Vendor: ConnectWise
│   └── manage/
├── shared/                 # Vendor-agnostic skills
│   └── skills/
└── docs/                   # Documentation site
```

## Component Types

### Skills

Skills are markdown files that provide Claude with domain knowledge. When a user's request matches skill triggers, Claude loads that knowledge into context.

**Purpose:** Teach Claude about domain concepts, API patterns, business logic, and best practices.

**Location:** `vendor/product/skills/topic-name/SKILL.md`

**Example:** The Autotask tickets skill teaches Claude about:
- Ticket status codes and transitions
- Priority levels and SLA calculations
- API request/response patterns
- Escalation rules and workflows

### Commands

Commands are slash-command shortcuts that users invoke directly. They define structured workflows with specific parameters.

**Purpose:** Provide quick access to common operations with guided parameters.

**Location:** `vendor/product/commands/command-name.md`

**Example:** `/create-ticket "Acme Corp" "Email not working" --priority 2`

### MCP Integration

MCP (Model Context Protocol) enables Claude to directly interact with PSA/RMM APIs. The configuration specifies how to launch the MCP server and what credentials it needs.

**Purpose:** Connect Claude to live API data for reading and writing records.

**Location:** `vendor/product/.mcp.json`

## Plugin Metadata

Each plugin has a `plugin.json` file that describes its components:

```json
{
  "name": "kaseya-autotask",
  "version": "0.1.0",
  "description": "Claude plugins for Kaseya Autotask PSA",
  "author": "MSP Claude Plugins Community",
  "vendor": "kaseya",
  "product": "autotask",
  "api_version": "1.6",
  "requires_api_key": true,
  "documentation_url": "https://ww5.autotask.net/help/...",
  "skills": [
    "tickets",
    "crm",
    "projects",
    "contracts",
    "api-patterns"
  ],
  "commands": [
    "create-ticket",
    "search-tickets",
    "time-entry"
  ]
}
```

## Development Workflow

### 1. Start with a PRD

All development begins with a Product Requirements Document:

```bash
# Create PRD branch
git checkout -b prd/autotask-configuration-items

# Copy template and fill it out
cp _templates/plugin-prd-template.md kaseya/autotask/prd/config-items-prd.md

# Submit PRD for review
git add . && git commit -m "PRD: Add configuration items skill"
git push origin prd/autotask-configuration-items
```

### 2. Get PRD Approved

- Submit PR with `[PRD]` prefix in title
- Address reviewer feedback
- Wait for approval before implementation

### 3. Implement

After PRD approval:

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/autotask-configuration-items

# Create skill file
mkdir -p kaseya/autotask/skills/configuration-items
# Write SKILL.md following template

# Create command file (if applicable)
# Write command-name.md following template

# Update plugin.json
# Update README.md
```

### 4. Test

- Verify skill triggers activate correctly
- Validate API examples against documentation
- Test command argument combinations
- Check MCP connectivity (if applicable)

### 5. Submit PR

```bash
git add .
git commit -m "feat(autotask): Add configuration items skill per PRD #123"
git push origin feature/autotask-configuration-items
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Skill directories | kebab-case | `time-entries/` |
| Skill files | SKILL.md | `SKILL.md` |
| Command files | kebab-case | `create-ticket.md` |
| Plugin directories | kebab-case | `autotask/` |
| Environment variables | SCREAMING_SNAKE_CASE | `AUTOTASK_API_KEY` |

## Quality Standards

All contributions must meet these standards:

### Skills
- Comprehensive frontmatter triggers
- Complete field documentation with types
- Realistic (but fake) API examples
- Business logic and validation rules
- Error handling guidance

### Commands
- Clear parameter documentation
- Usage examples for all argument combinations
- Success and error output examples
- Related command references

### General
- No hardcoded credentials
- Active voice in documentation
- Consistent formatting
- Links to related resources

## Next Steps

- [Creating Skills](/msp-claude-plugins/developer/creating-skills/) - Detailed skill development guide
- [Creating Commands](/msp-claude-plugins/developer/creating-commands/) - Command development guide
- [MCP Integration](/msp-claude-plugins/developer/mcp-integration/) - Setting up API connectivity
- [Testing Guide](/msp-claude-plugins/developer/testing/) - Testing your contributions
