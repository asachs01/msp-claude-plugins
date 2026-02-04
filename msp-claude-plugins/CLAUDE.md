# MSP Claude Plugins - Project Configuration

## Project Overview
Community-driven Claude Code plugins for Managed Service Providers (MSPs).

## Learnings - 2026-02-04

### Astro Starlight GitHub Pages Configuration
When deploying Astro/Starlight to GitHub Pages at a subpath (e.g., `user.github.io/repo`), you must set both `site` and `base` in `astro.config.mjs`, and all internal links must include the base path prefix (e.g., `/msp-claude-plugins/getting-started/`).

### GitHub Pages Workflow Enablement via API
To enable GitHub Pages with workflow-based builds: `gh api repos/OWNER/REPO/pages -X POST -f build_type=workflow`. The PUT endpoint returns 404 if pages aren't already configured - use POST first to create.

### Parallel File Creator Agents for Documentation
When creating many documentation files (e.g., 20+ pages for a docs site), use multiple Task agents with `subagent_type=file-creator` in parallel, grouping files by logical section (getting-started, reference, commands, etc.) for efficient generation.
