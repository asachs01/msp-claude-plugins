# Contributing to MSP Claude Plugins

Thank you for your interest in contributing to the MSP Claude Plugins Marketplace! This document provides comprehensive guidelines for contributing plugins, skills, and commands.

## Table of Contents

- [The PRD Mandate](#the-prd-mandate)
- [Getting Started](#getting-started)
- [Step-by-Step Contribution Process](#step-by-step-contribution-process)
- [Using Templates](#using-templates)
- [LLM-Assisted Development](#llm-assisted-development)
- [Quality Standards](#quality-standards)
- [PR Review Process](#pr-review-process)
- [Getting Help](#getting-help)

## The PRD Mandate

**All development begins with a PRD. This is non-negotiable.**

Before any code is written, any skill is created, or any command is defined, a PRD must be:

1. **Created** using the provided template in `_templates/plugin-prd-template.md`
2. **Reviewed** by at least one community member
3. **Approved** via PR review process
4. **Stored** in the plugin's `prd/` directory

### Why PRDs First?

- Ensures clear understanding of the problem being solved
- Enables community input before development effort
- Creates documentation that lives with the code
- Prevents scope creep and feature drift

## Getting Started

### Prerequisites

- GitHub account
- Basic understanding of MSP tools and workflows
- Familiarity with the specific vendor API you're contributing for
- (Optional) Access to vendor API for testing

### Fork and Clone

```bash
# Fork the repository via GitHub UI, then:
git clone https://github.com/YOUR-USERNAME/msp-claude-plugins.git
cd msp-claude-plugins
```

## Step-by-Step Contribution Process

### Phase 1: PRD Creation

1. **Create a feature branch**
   ```bash
   git checkout -b prd/vendor-product-component
   ```

2. **Copy the PRD template**
   ```bash
   mkdir -p vendor/product/prd
   cp _templates/plugin-prd-template.md vendor/product/prd/component-prd.md
   ```

3. **Fill out the PRD** following the template sections

4. **Submit PRD for review**
   ```bash
   git add vendor/product/prd/
   git commit -m "PRD: Add PRD for vendor/product/component"
   git push origin prd/vendor-product-component
   ```

5. **Create a Pull Request** titled `[PRD] vendor/product/component`

6. **Wait for approval** - Address any feedback from reviewers

### Phase 2: Implementation (After PRD Approval)

1. **Create implementation branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/vendor-product-component
   ```

2. **Implement your contribution**
   - Use the skill/command templates
   - Follow the approved PRD scope
   - Test against actual API if possible

3. **Submit for review**
   ```bash
   git add .
   git commit -m "feat: Implement vendor/product/component per approved PRD"
   git push origin feature/vendor-product-component
   ```

4. **Create a Pull Request** linking to the approved PRD

## Repository Structure

```
vendor/product/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest (required)
├── .mcp.json                 # MCP server configuration (optional)
├── README.md                 # Product-specific documentation
├── prd/                      # PRD history for this plugin
│   └── initial-prd.md
├── commands/                 # Slash commands (optional)
│   └── *.md
├── skills/                   # Domain knowledge (optional)
│   └── skill-name/
│       └── SKILL.md
└── agents/                   # Subagent definitions (optional)
    └── *.md
```

## Using Templates

All templates are in the `_templates/` directory:

| Template | Purpose |
|----------|---------|
| `plugin-prd-template.md` | PRD for any plugin contribution |
| `skill-template/SKILL.md` | Skill with proper frontmatter |
| `command-template.md` | Slash command definition |
| `llm-prompts/*.md` | Prompts for LLM-assisted development |

### Creating a Plugin Manifest

Every plugin needs a `plugin.json`:

```json
{
  "name": "vendor-product",
  "version": "1.0.0",
  "description": "Description of the plugin",
  "author": "Your Name",
  "vendor": "vendor-name",
  "product": "product-name",
  "requires_api_key": true
}
```

### Writing Skills

Skills go in `skills/skill-name/SKILL.md`:

```markdown
---
description: >
  Use this skill when [trigger conditions]
triggers:
  - keyword 1
  - keyword 2
---

# Skill Title

## Overview
...

## Key Concepts
...

## API Patterns
...
```

### Writing Commands

Commands go in `commands/command-name.md`:

```markdown
---
name: command-name
description: What this command does
arguments:
  - name: arg1
    description: Argument description
    required: true
---

# Command Title

## Prerequisites
...

## Steps
...
```

## LLM-Assisted Development

We encourage using LLMs (Claude, etc.) to help create PRDs, skills, and commands. However, you must follow these standards:

### Required Workflow

1. **Start with the PRD prompt** - Use `_templates/llm-prompts/prd-generation.md`
2. **Generate PRD** and submit for human review
3. **After PRD approval**, use skill/command generation prompts
4. **Review all LLM output** before committing
5. **Test against actual API** when possible

### LLM Prompts Available

| Prompt | Use Case |
|--------|----------|
| `prd-generation.md` | Generate a complete PRD |
| `skill-generation.md` | Generate a skill from approved PRD |
| `command-generation.md` | Generate a command from approved PRD |

### Important Notes on LLM Usage

- LLM output is a **starting point**, not a final product
- Always validate API examples against actual documentation
- Human review is required before submission
- Do not submit LLM-generated content without verification

## Quality Standards

### Quality Checklist

Before submitting a PR, verify:

- [ ] PRD exists and is approved
- [ ] SKILL.md follows template structure
- [ ] Frontmatter includes accurate triggers
- [ ] API examples are validated against documentation
- [ ] No hardcoded credentials or sensitive data
- [ ] README.md updated with new capabilities
- [ ] Commands tested with actual API (if possible)

### Security Requirements

- **No credentials** - Use environment variable references only
- **No customer data** - Use placeholder data in examples
- **No real IDs** - Use generic IDs like `12345` in examples

### Documentation Standards

See `_standards/` for detailed requirements:

- `prd-requirements.md` - PRD standards
- `skill-quality-checklist.md` - Skill validation
- `api-documentation-guide.md` - API documentation format

## PR Review Process

### PRD Reviews

1. Submit PR with `[PRD]` prefix in title
2. Minimum 1 reviewer approval required
3. Reviewers check for completeness, clarity, and feasibility
4. Address feedback and update PRD
5. Merge when approved

### Implementation Reviews

1. Submit PR linking to approved PRD
2. Minimum 1 reviewer approval required
3. Reviewers verify:
   - Implementation matches PRD scope
   - Quality checklist is satisfied
   - No security issues
4. Address feedback and update
5. Merge when approved

### Responding to Feedback

- Be responsive to reviewer comments
- Ask for clarification if feedback is unclear
- Update your PR based on feedback
- Re-request review after addressing comments

## Getting Help

### Questions About Contributing

- Open a GitHub Issue with the `question` label
- Check existing issues for similar questions

### Vendor-Specific Questions

- Tag issues with the vendor label (e.g., `kaseya`, `connectwise`)
- Reference specific API documentation when asking

### Getting API Access

If you don't have API access for testing:

1. Check if the vendor has a developer/partner program
2. Request sandbox access from the vendor
3. Build from documentation and mark as "untested"
4. Ask the community if anyone can help test

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

We are committed to providing a welcoming and inclusive environment for all contributors.

---

Thank you for contributing to the MSP Claude Plugins Marketplace!
