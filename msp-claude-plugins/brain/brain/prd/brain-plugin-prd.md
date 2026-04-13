# Plugin PRD: Brain / Organizational Intelligence

## Summary

The brain plugin provides Claude with skills and commands to use the [brain-mcp](https://github.com/wyre-technology/brain-mcp) server — a Postgres-backed organizational knowledge layer that synthesizes persistent client context from all MSP tool integrations. It turns Claude from a stateless API relay into an agent with durable memory about every client.

## Problem

MSPs that connect Claude to individual tool MCPs (Autotask, ITGlue, Datto RMM, etc.) get a smarter API interface. But every conversation starts cold — Claude has no memory of the last ticket, the client's health trend, or the note the account manager left after last week's call. Context lives in people's heads, not in the AI's reach.

The pattern of "hook up all your tool MCPs and stop there" creates:
- Repeated context-setting work in every conversation
- Inability to answer portfolio-level questions ("which clients don't have MFA?")
- No persistence of human-written context (call notes, tier classifications)
- No synthesis across tools (a client's health is a function of tickets + alerts + contracts, not any one source)

## Solution

The brain-mcp server synthesizes all tool data into a single Postgres instance owned by the MSP. This plugin teaches Claude how to use that brain effectively — when to call which tools, how to interpret the data, and how to write human context back.

## User Stories

- As a service desk technician, I want to say "brain-client Acme" and get a full briefing before picking up the phone
- As an account manager, I want to see all expiring contracts this month without logging into the PSA
- As an MSP owner, I want to know which clients don't have MFA so I can prioritize security conversations
- As a vCIO, I want to add notes after every QBR and have them available in future AI conversations
- As a service manager, I want to see all open P1 tickets across all clients in one command

## Scope

### In Scope

- Skills for all brain-mcp tool categories (org context, cross-client intelligence, sync management, human enrichment)
- Commands: `/brain-client`, `/brain-alerts`, `/brain-p1s`, `/brain-expiring`, `/brain-sync`, `/brain-note`
- Documentation of all 13 brain-mcp tools with parameters and patterns
- Setup guide linking to brain-mcp deployment

### Out of Scope

- The brain-mcp server itself (maintained at [wyre-technology/brain-mcp](https://github.com/wyre-technology/brain-mcp))
- Source-system MCPs (Autotask, ITGlue, etc. — those are separate plugins)
- Data migration or schema management

## Technical Approach

### MCP Tools Used

All tools are provided by the brain-mcp MCP server:

**Read tools:**
- `brain_get_org` — full client profile
- `brain_search_orgs` — search/filter clients
- `brain_get_org_tickets` — paginated tickets
- `brain_get_org_alerts` — unacknowledged alerts by severity
- `brain_get_org_assets` — managed devices
- `brain_get_org_docs` — documentation with summaries
- `brain_get_org_tech_stack` — tech stack by category

**Query tools:**
- `brain_query` — sandboxed SQL SELECT (no mutations, LIMIT enforced)
- `brain_cross_client_query` — 7 predefined portfolio intelligence queries

**Sync tools:**
- `brain_sync_status` — sync health per source
- `brain_sync_source` — trigger one source
- `brain_sync_all` — trigger all sources

**Write tools:**
- `brain_add_org_note` — append timestamped note
- `brain_set_org_tier` — classify client
- `brain_add_doc_summary` — summarize a document

### Authentication

No direct API credentials needed in this plugin. The brain-mcp server handles all source system authentication. The plugin user only needs brain-mcp running and connected via MCP config.

## Success Criteria

- [ ] `/brain-client` returns a useful briefing for any client in under 3 tool calls
- [ ] `/brain-p1s` surfaces all open P1s across the portfolio in one call
- [ ] Skills correctly guide tool call order (brain_get_org first, then supplementary calls)
- [ ] Human enrichment tools are documented with concrete use cases
- [ ] Setup guide enables a new user to have brain running in < 30 minutes

## Open Questions

- Should `/brain-client` also call `brain_get_org_docs` by default, or only on request? (lean: only on request — too much output)
- Should there be a `/brain-health` command for portfolio health dashboard? (lean: yes, future iteration)
