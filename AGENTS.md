# AGENTS.md — Guidance for AI Agents

This file provides guidance for AI coding agents (Claude Code, Codex, Gemini CLI, etc.) working in this repository.

## What This Repo Is

A collection of Claude Code plugins for MSP vendors — skills, commands, and MCP integrations for tools like Autotask, ConnectWise, NinjaOne, HaloPSA, SentinelOne, Huntress, and others. The intended users are MSP technicians running Claude Code day-to-day.

## Directory Structure

```
msp-claude-plugins/
├── <vendor>/
│   └── <product>/
│       ├── plugin.json          # Plugin manifest
│       ├── skills/
│       │   └── <skill-name>/
│       │       ├── SKILL.md     # The skill itself (loaded by Claude Code)
│       │       └── REFERENCE.md # Optional: full param/field reference
│       └── commands/
│           └── <command>.md     # Slash command definitions
├── _standards/                  # Quality standards — read before writing skills
├── _templates/                  # Templates for skills, commands, plugins
├── shared/                      # Vendor-agnostic skills
└── CONTRIBUTING.md              # Contribution guidelines
```

## Writing Skills

Skills are Markdown files with YAML frontmatter. They are injected into Claude's context when triggered.

**SKILL.md structure:**

```markdown
---
name: kebab-case-skill-name
description: "Use when [specific trigger]. Covers [scope]."
metadata:
  version: "1.0.0"
  openclaw:
    requires:
      bins:
        - npx
---

# Skill Title

## Workflow
1. **Step** — what to do, what to check, what to do on failure

## Tools
### `tool_name`
Brief description. Required params. Common optional params.
**Example:** concrete JSON example

## Field Reference / Error Reference
Point to REFERENCE.md if the tables are long.
```

**Key rules:**
- `name` must be kebab-case
- `description` must start with "Use when..."
- Keep SKILL.md under ~150 lines; move verbose tables to REFERENCE.md
- Include concrete JSON examples, not just param lists
- Include error recovery steps in the workflow

## What Not to Do

- Do not add GitHub Actions or CI workflows unless explicitly asked
- Do not add third-party Actions from external organizations
- Do not modify `plugin.json` manifests without understanding the full plugin structure
- Do not add skills for vendors that already have a skill for the same domain — improve the existing one instead
- Do not commit API keys, even test ones

## Contribution Policy

Agents should not open PRs that:
- Install third-party tooling via GitHub Actions
- Were mass-generated across unrelated repos
- Primarily benefit the agent's vendor/organization rather than the users

See CONTRIBUTING.md for the full policy.
