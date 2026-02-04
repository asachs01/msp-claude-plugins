# MSP Claude Plugins Marketplace

A community-driven, open-source repository of Claude Code plugins and skills specifically designed for Managed Service Providers (MSPs).

## Overview

The MSP Claude Plugin Marketplace provides vendor-organized plugins that enable MSP technicians, engineers, and administrators to leverage Claude's capabilities with deep integration into the tools they use daily.

Inspired by Anthropic's [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins), this marketplace follows the same architectural patterns while organizing content by MSP vendor ecosystem.

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/msp-claude-plugins/msp-claude-plugins.git

# Navigate to the vendor plugin you need
cd msp-claude-plugins/kaseya/autotask

# Configure environment variables (see vendor README)
cp .env.example .env
# Edit .env with your API credentials

# Use with Claude Code
claude --plugin .
```

### Using a Plugin

Each vendor plugin contains:
- **Skills** - Domain knowledge Claude can reference
- **Commands** - Slash commands for common operations
- **MCP Integration** - API connectivity (where available)

## Supported Vendors

| Vendor | Products | Status | Maintainer |
|--------|----------|--------|------------|
| **Kaseya** | Autotask PSA | Active | Community |
| | IT Glue | Planned | - |
| | Datto RMM | Planned | - |
| **ConnectWise** | Manage | Planned | - |
| | Automate | Planned | - |
| | Control | Planned | - |
| **HaloPSA** | HaloPSA | Planned | - |
| **NinjaOne** | NinjaOne | Planned | - |
| **Superops** | Superops | Planned | - |
| **Datto** | RMM, BCDR | Planned | - |

## Repository Structure

```
msp-claude-plugins/
├── .claude-plugin/
│   └── marketplace.json       # Marketplace manifest
├── _templates/                # Contributor templates
│   ├── plugin-prd-template.md
│   ├── skill-template/
│   ├── command-template.md
│   └── llm-prompts/
├── _standards/                # Quality standards
├── kaseya/
│   └── autotask/             # Active plugin
├── connectwise/
│   └── manage/               # Planned plugin
├── shared/
│   └── skills/               # Vendor-agnostic skills
│       ├── msp-terminology/
│       └── ticket-triage/
└── [other vendors]/
```

## Available Skills

### Kaseya Autotask

| Skill | Description |
|-------|-------------|
| [Ticket Management](kaseya/autotask/skills/tickets/SKILL.md) | Service ticket workflows |
| [CRM](kaseya/autotask/skills/crm/SKILL.md) | Company and contact management |
| [Projects](kaseya/autotask/skills/projects/SKILL.md) | Project and task management |
| [Contracts](kaseya/autotask/skills/contracts/SKILL.md) | Service agreements and billing |

### Shared Skills

| Skill | Description |
|-------|-------------|
| [MSP Terminology](shared/skills/msp-terminology/SKILL.md) | Common MSP terms and acronyms |
| [Ticket Triage](shared/skills/ticket-triage/SKILL.md) | Vendor-agnostic triage best practices |

## Available Commands

### Kaseya Autotask

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search tickets by criteria |

## Contributing

We welcome contributions! This is a community project and we need help from MSPs using these tools daily.

### The PRD Mandate

**All contributions require a PRD first.** This ensures:
- Clear problem definition
- Community input before development
- Documentation that lives with code

See our [Contributing Guide](CONTRIBUTING.md) for complete instructions.

### Ways to Contribute

1. **Add a new vendor plugin** - Build out a vendor you use daily
2. **Enhance existing plugins** - Add skills or commands
3. **Improve documentation** - Better examples, clearer instructions
4. **Report issues** - Found a problem? Let us know
5. **Review PRDs** - Help evaluate proposed additions

### Getting Started

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/msp-claude-plugins.git

# Create a branch for your PRD
git checkout -b prd/vendor-product-component

# Copy the PRD template
cp _templates/plugin-prd-template.md vendor/product/prd/my-prd.md

# Submit your PRD for review
git add . && git commit -m "PRD: Add PRD for vendor/product"
git push origin prd/vendor-product-component
# Create a Pull Request
```

## Quality Standards

All plugins must meet our quality standards:

- [ ] PRD exists and is approved
- [ ] Skills follow template structure
- [ ] API examples validated against documentation
- [ ] No hardcoded credentials
- [ ] README updated with capabilities

See [Quality Standards](_standards/) for details.

## Security

- **No credentials** in code - Use environment variables
- **No customer data** - Use placeholder examples
- **No real IDs** - Use generic IDs in examples
- **Review before merge** - All PRs require review

## Resources

### Documentation
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Quality Standards](_standards/)
- [Templates](_templates/)

### External Resources
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)

### Vendor API Documentation
- [Autotask REST API](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
- [ConnectWise Manage API](https://developer.connectwise.com/Products/Manage/REST)
- [IT Glue API](https://api.itglue.com/developer/)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Anthropic's knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- Built for the MSP community, by the MSP community
- Special thanks to all contributors

---

**Made with :heart: for MSPs**
