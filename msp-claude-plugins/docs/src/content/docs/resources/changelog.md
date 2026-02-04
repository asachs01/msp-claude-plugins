---
title: Changelog
description: Release history and changes for MSP Claude Plugins
sidebar:
  order: 1
---

All notable changes to MSP Claude Plugins are documented here.

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-02-04

### Initial Release

The first public release of MSP Claude Plugins, featuring comprehensive Autotask PSA integration for Claude Code.

### Added

#### Autotask Plugin

**Company Management**
- `autotask_search_companies` - Search companies by name, type, or custom filters
- `autotask_create_company` - Create new company records
- `autotask_update_company` - Update existing company information
- `autotask_search_company_notes` - Search notes attached to companies
- `autotask_create_company_note` - Add notes to company records
- `autotask_get_company_note` - Retrieve specific company note

**Contact Management**
- `autotask_search_contacts` - Search contacts across companies
- `autotask_create_contact` - Create new contact records

**Ticket Management**
- `autotask_search_tickets` - Search tickets with flexible filters
- `autotask_get_ticket_details` - Retrieve full ticket information
- `autotask_create_ticket` - Create new service tickets
- `autotask_search_ticket_notes` - Search ticket notes and comments
- `autotask_create_ticket_note` - Add notes to tickets
- `autotask_get_ticket_note` - Retrieve specific ticket note
- `autotask_search_ticket_attachments` - List ticket attachments
- `autotask_get_ticket_attachment` - Retrieve attachment metadata

**Time Entry**
- `autotask_create_time_entry` - Log time against tickets

**Project Management**
- `autotask_search_projects` - Search projects by various criteria
- `autotask_create_project` - Create new projects
- `autotask_search_project_notes` - Search project documentation
- `autotask_create_project_note` - Add project notes
- `autotask_get_project_note` - Retrieve specific project note

**Task Management**
- `autotask_search_tasks` - Search project tasks
- `autotask_create_task` - Create new tasks within projects

**Resource Management**
- `autotask_search_resources` - Search internal resources/technicians

**Configuration Items**
- `autotask_search_configuration_items` - Search assets and CIs

**Contract Management**
- `autotask_search_contracts` - Search service contracts

**Financial**
- `autotask_search_invoices` - Search invoice records
- `autotask_search_expense_reports` - Search expense reports
- `autotask_create_expense_report` - Create expense reports
- `autotask_get_expense_report` - Retrieve expense report details

**Quoting**
- `autotask_search_quotes` - Search quotes
- `autotask_create_quote` - Create new quotes
- `autotask_get_quote` - Retrieve quote details

**System & Reference**
- `autotask_test_connection` - Test API connectivity
- `autotask_list_queues` - List available ticket queues
- `autotask_list_ticket_statuses` - List ticket status options
- `autotask_list_ticket_priorities` - List priority levels
- `autotask_get_field_info` - Get field metadata for entities

#### Documentation Site

- Getting Started guides for installation and configuration
- Plugin reference documentation for all Autotask commands
- Developer guides for creating custom plugins
- Contribution framework with PRD requirements

#### Contribution Framework

- PRD (Product Requirements Document) templates
- Contribution workflow documentation
- Code of conduct based on Contributor Covenant
- Style guide for code and documentation

### Technical Details

| Component | Version |
|-----------|---------|
| Node.js | >= 18.0.0 |
| TypeScript | 5.x |
| MCP Protocol | 1.0 |

### Breaking Changes

None - initial release.

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| [1.0.0](#100---2024-02-04) | 2024-02-04 | Initial release with Autotask plugin |

---

## Upgrade Guide

### Upgrading to 1.0.0

This is the initial release. To install:

```bash
# Using npx (recommended)
npx @anthropic/claude-code mcp install autotask-mcp

# Or add to claude_desktop_config.json manually
```

See [Installation Guide](/getting-started/installation/) for detailed setup instructions.

---

## Release Schedule

We follow a regular release cadence:

| Release Type | Frequency | Version Bump |
|--------------|-----------|--------------|
| Patch | As needed | 1.0.x |
| Minor | Monthly | 1.x.0 |
| Major | Quarterly | x.0.0 |

### Upcoming Releases

See the [Roadmap](/resources/roadmap/) for planned features.

---

## Reporting Issues

Found a bug or regression? Please report it:

1. Check [existing issues](https://github.com/wyre-engineering/msp-claude-plugins/issues)
2. Open a [new issue](https://github.com/wyre-engineering/msp-claude-plugins/issues/new) with:
   - Version number
   - Steps to reproduce
   - Expected vs actual behavior
   - Relevant logs
