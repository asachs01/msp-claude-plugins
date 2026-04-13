# Brain Plugin

Claude Code plugin for the organizational brain — a Postgres-backed knowledge layer that synthesizes persistent client context from all your MSP tool MCPs.

## Overview

Most MSP AI setups connect Claude to a bunch of tool MCPs and stop there. That makes Claude a smarter API relay, but every conversation starts cold. The brain changes that.

The brain pulls data from your PSA, RMM, documentation, and security tools into a single Postgres instance you own, then exposes it through a unified MCP that Claude can query with rich context about any client — tickets, alerts, assets, tech stack, contracts, health score, and human notes — all in one call.

**Before brain:**
```
Claude → Autotask MCP → tickets (this conversation only)
Claude → ITGlue MCP  → docs (this conversation only)
Claude → Datto MCP   → alerts (this conversation only)
```

**With brain:**
```
Claude → brain MCP → full synthesized client profile (persistent, always fresh)
```

## What This Plugin Provides

### Skills

| Skill | When to use |
|---|---|
| `org-context` | Looking up a client — full profile, tickets, alerts, assets, docs |
| `cross-client-intelligence` | MSP-wide queries — expiring contracts, open P1s, clients without MFA |
| `sync-management` | Triggering syncs, checking sync health, debugging stale data |
| `human-enrichment` | Adding notes, setting client tier, writing doc summaries |

### Commands

| Command | Description |
|---|---|
| `/brain-client` | Full client profile — identity, contacts, health, open issues |
| `/brain-alerts` | Active unacknowledged alerts across all clients or one client |
| `/brain-p1s` | All open P1 tickets right now |
| `/brain-expiring` | Contracts expiring within 30 days |
| `/brain-sync` | Trigger a sync or check sync status |
| `/brain-note` | Add a timestamped note to a client |

## Prerequisites

- [brain-mcp](https://github.com/wyre-technology/brain-mcp) server running and connected
- Postgres instance (your own — Azure, AWS, DO, Supabase, Neon, etc.)
- At least one configured sync source (Autotask, ITGlue, Datto RMM, etc.)

## Setup

### 1. Deploy brain-mcp

Follow the [brain-mcp README](https://github.com/wyre-technology/brain-mcp) to deploy the server and run the initial sync.

### 2. Add to Claude Code MCP config

```json
{
  "mcpServers": {
    "brain": {
      "command": "npx",
      "args": ["-y", "@wyre-technology/brain-mcp"],
      "env": {
        "BRAIN_DATABASE_URL": "postgresql://user:password@host:5432/brain",
        "BRAIN_SYNC_SOURCES": "autotask,itglue,datto_rmm",
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  }
}
```

### 3. Install this plugin

```bash
claude plugin install brain
```

## Architecture

```
┌─────────────────────────────────────────────┐
│              Claude Code                    │
│                                             │
│  brain plugin (this)                        │
│  ├── skills: how to use brain tools         │
│  └── commands: common brain operations      │
└──────────────┬──────────────────────────────┘
               │ MCP
┌──────────────▼──────────────────────────────┐
│           brain-mcp server                  │
│  ├── brain_get_org                          │
│  ├── brain_search_orgs                      │
│  ├── brain_get_org_tickets / alerts / assets│
│  ├── brain_cross_client_query               │
│  ├── brain_query (sandboxed SQL)            │
│  ├── brain_sync_source / sync_all           │
│  └── brain_add_org_note / set_org_tier      │
└──────────────┬──────────────────────────────┘
               │ Postgres
┌──────────────▼──────────────────────────────┐
│    Your Postgres (MSP-owned)                │
│  Synced from: Autotask · ITGlue · Datto RMM │
│               HaloPSA · NinjaOne · Hudu     │
│               Syncro · Liongard             │
└─────────────────────────────────────────────┘
```

## MSP Data Ownership

Your Postgres instance is provisioned and managed by you. WYRE (or whoever operates your MCP gateway) never holds your client data. This is the same pattern as the MCP gateway credential model — you own the data, you define where it lives.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
