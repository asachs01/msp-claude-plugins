# Docs IA Restructure — Design

**Date:** 2026-04-27
**Status:** Approved (sidebar-only first pass shipped)
**Scope:** Information architecture only. Branding refresh (Taskmaster #11) and screenshot redo (Taskmaster #12) tracked separately.

## Goal

The current docs IA buries gateway content as a single page inside "Getting Started" alongside other gateway-flavored topics, mixes "Plugins" (MSP product integrations) with peer top-level sections "MCP Servers" and "Reference" (Skills/Commands/Prompts), and has no room to grow as gateway content expands. Reorganize around two product mental models — Gateway and Plugins — with a thin onboarding shelf in front.

## Top-level structure

Three top-level sidebar sections, in order:

1. **Getting Started** — onboarding shelf (3 pages)
2. **Gateway** — everything about running and operating the gateway, lifecycle-grouped
3. **Plugins** — Claude Code plugins as the packaging unit; catalog primary, components secondary

Removes top-level **MCP Servers** and **Reference** sections; their contents fold into Plugins → Components.

## Page mapping

### Getting Started
- Introduction (`getting-started/`)
- Quick Start (`getting-started/quick-start/`)
- Installation (`getting-started/installation/`)

### Gateway (lifecycle grouping)
- **Concepts**
  - Overview (current `getting-started/gateway/`)
  - Architecture (current `getting-started/architecture/`)
  - Security Model (current `getting-started/security/`)
- **Setup**
  - Deployment (current `getting-started/deployment/`)
  - Authentication (current `getting-started/authentication/`)
- **Operations**
  - Teams & Access (current `getting-started/teams/`)
  - Logging & Audit *(placeholder — future page)*
- **Clients**
  - Claude Code *(placeholder — future page)*
  - Copilot (current `getting-started/copilot/`)
  - Custom Integrations *(placeholder — future page)*
- **Reference**
  - Configuration *(placeholder — future page)*
  - Troubleshooting (current `getting-started/troubleshooting/`)

Monitoring deliberately excluded — not planned.

### Plugins (catalog-primary)
- Overview (current `plugins/index`)
- **Catalog by category** (unchanged grouping; per-plugin pages stay at `plugins/[id]`):
  PSA, RMM, IT Documentation, Security, Email Security, Monitoring, Network, Incident Management, CRM, Marketplace, Sales, Accounting, Productivity
- **Components** (cross-cutting indexes)
  - All Agents *(placeholder — future page)*
  - All Skills (current `skills/`)
  - All Commands (current `commands/`)
  - All MCP Servers (current `mcp-servers/`, `mcp-servers/[id]` detail pages preserved)
  - All Prompts (current `prompts/`)

## Implementation approach

**Phase 1 — sidebar-only (this PR).** Rewrite `src/components/Sidebar.astro` to render the new tree. Links continue to point at existing physical page paths. No file moves, no URL changes, no redirects required. Placeholder entries link to `#` and are labeled "(coming soon)". This ships the IA visually with zero risk to existing URLs.

**Phase 2 — page moves and redirects (follow-on).** Move pages to URLs that match the new tree (e.g. `/getting-started/architecture/` → `/gateway/concepts/architecture/`, `/skills/` → `/plugins/components/skills/`). Add Astro `redirects` config so all current URLs continue to resolve. `mcp-servers/[id]` detail pages relocate but keep their slug-based addressing.

**Phase 3 — placeholder pages (follow-on).** Author Logging & Audit, Claude Code client, Custom Integrations, Configuration. Wire real links into the sidebar.

**Phase 4 — per-plugin "bundled components" section (follow-on).** Extend `plugins/[id].astro` to surface a plugin's bundled agents/skills/commands/MCP servers/prompts, linking into the cross-cutting component indexes. Bridges catalog-primary and component-secondary navigation. Requires an optional `components` field on plugin data entries.

## Out of scope

- Content rewrites of any existing page
- Branding/visual refresh (Taskmaster #11)
- Screenshot recapture (Taskmaster #12)
- Marketing-site header navigation (already restructured in commit `68e36e1`)
- Per-plugin bundled-components feature (Phase 4 above; deferred)

## Risk

- **Phase 1 risk: none.** Only the sidebar component changes; page paths and URLs are untouched.
- **Phase 2 risk: link rot in external references.** Mitigated by redirects covering every relocated path. Astro emits 301s; verify after deploy.
- **Sidebar ergonomics:** Gateway now nests three levels deep (section → bucket → page). The existing two-level rendering in `Sidebar.astro` already supports this; verified visually in dev.
