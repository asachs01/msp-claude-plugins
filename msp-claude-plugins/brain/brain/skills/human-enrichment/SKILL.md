---
name: "Brain: Human Enrichment"
description: >
  Use this skill when adding human-written context to a client — timestamped notes,
  tier classification, or document summaries. These are preserved across syncs and
  never overwritten by automated data. Covers brain_add_org_note, brain_set_org_tier,
  and brain_add_doc_summary.
when_to_use: "When the user wants to record context about a client, classify them, or summarize a document"
triggers:
  - brain note
  - brain add note
  - set client tier
  - brain_add_org_note
  - brain_set_org_tier
  - brain_add_doc_summary
  - document summary
  - annotate client
  - classify client
---

# Brain: Human Enrichment

## Overview

Automated syncs keep data current, but some context only exists in people's heads. The enrichment tools let you write that context into the brain permanently — it persists across syncs and is never overwritten by automated data.

## Why This Matters

When you add a note like "CTO is leaving in 90 days, decision-maker will change" or classify a client as `enterprise`, that context is available in every future conversation without you having to re-explain it. It becomes part of the brain's `brain_get_org` response.

## Tools

### brain_add_org_note

Add a timestamped note to a client. Notes accumulate — each call appends rather than replaces.

**Parameters:**
- `org_name` (string, required)
- `note` (string, required)

```
brain_add_org_note({
  org_name: "Acme Corp",
  note: "CTO (Mike Chen) departing Q3. IT decisions shifting to COO Sarah Lee. Renewal conversation should wait until new stakeholder is in seat."
})
```

Notes are displayed in `brain_get_org` output with timestamps. Use them for:
- Stakeholder changes
- Special handling notes ("always escalate to account manager before responding")
- Context from calls or QBRs
- Known issues or workarounds
- Relationship context

### brain_set_org_tier

Set a client's tier classification.

**Parameters:**
- `org_name` (string, required)
- `tier` (string, required) — one of: `enterprise`, `mid-market`, `smb`, `prospect`

```
brain_set_org_tier({ org_name: "Acme Corp", tier: "enterprise" })
```

Tier is used in health scoring, cross-client queries, and routing decisions. Set it once after onboarding and update as clients grow.

### brain_add_doc_summary

Add or update a human-readable summary for a client's document. Summaries are preserved when the document is re-synced from ITGlue/Hudu.

**Parameters:**
- `org_name` (string, required)
- `doc_title` (string, required) — must match a title in `brain_get_org_docs` output
- `summary` (string, required)

```
brain_add_doc_summary({
  org_name: "Acme Corp",
  doc_title: "VPN Runbook",
  summary: "Palo Alto GlobalProtect. Gateway at vpn.acme.com. Admin creds in 1Password under Acme/Network. Known issue: MFA prompts fail on iOS 17.3 — workaround is to use SMS instead of Authenticator app."
})
```

Summaries appear in `brain_get_org_docs` and give Claude actionable context without having to read the full document.

## Patterns

### After a QBR or account call

```
brain_add_org_note → key outcomes, decisions, commitments
brain_set_org_tier → update if client has grown or contracted
brain_add_doc_summary → summarize any runbooks discussed
```

### Onboarding a new client

```
brain_set_org_tier → classify immediately
brain_add_org_note → key stakeholders, special handling, known context
```

### Building a knowledge base for a runbook

```
1. brain_get_org_docs(org_name: "...") → find the document
2. Review the doc in ITGlue/Hudu (use the url from brain output)
3. brain_add_doc_summary → write a concise, actionable summary
```
