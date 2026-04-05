---
name: "Proofpoint MSP Management"
description: >
  Use this skill when managing Proofpoint Essentials organizations as an MSP —
  listing organizations, retrieving per-org email statistics, and understanding
  the MSP multi-tenant model in Proofpoint Essentials.
when_to_use: "When managing Proofpoint Essentials organizations as an MSP — listing organizations, retrieving per-org email statistics"
triggers:
  - proofpoint msp
  - proofpoint organizations
  - proofpoint essentials admin
  - email stats by org
  - proofpoint tenant
  - proofpoint multi-tenant
  - list proofpoint orgs
  - proofpoint org management
---

# Proofpoint Essentials MSP Management

## Overview

Proofpoint Essentials supports a multi-tenant MSP model where a single MSP administrator account manages multiple customer organizations. Each organization is a separate email security tenant with its own users, policies, and email traffic.

MSP management tools cover two primary workflows:

1. **Organization listing** — Enumerate managed customer tenants to get org IDs for downstream queries
2. **Email statistics** — Retrieve per-org volume and security metrics for reporting and billing

## Key Concepts

### MSP vs Direct Customer Account

- **MSP account** — A Proofpoint Essentials partner account that manages multiple child organizations. Has access to `proofpoint_list_orgs` to enumerate tenants.
- **Direct customer account** — A single-tenant Essentials account. Does not have multi-org listing; queries are implicitly scoped to the one org.

If `proofpoint_list_orgs` returns a single org or an authorization error, the credentials may be for a direct customer account rather than an MSP partner account.

### Organization Structure

Each organization in Essentials has:

| Field | Description |
|-------|-------------|
| `orgId` | Unique identifier used in API calls (e.g., `acme-corp-us`) |
| `name` | Human-readable organization name |
| `domain` | Primary email domain (e.g., `acmecorp.com`) |
| `status` | Account status: `active`, `suspended`, `trial` |
| `plan` | Essentials plan tier: `business`, `advanced`, `professional` |
| `userCount` | Number of licensed users |
| `createdAt` | Account creation timestamp |

### Email Statistics

Per-org email statistics provide a view of email volume and security filtering outcomes over a time window. Statistics are aggregated — they do not include individual message-level data (use message trace for that).

Available statistics categories:

| Category | Description |
|----------|-------------|
| `totalInbound` | Total inbound messages received |
| `totalOutbound` | Total outbound messages sent |
| `delivered` | Messages delivered to mailboxes |
| `blocked` | Messages blocked (spam, malware, policy) |
| `quarantined` | Messages held in quarantine |
| `spamBlocked` | Subset of blocked: classified as spam |
| `malwareBlocked` | Subset of blocked: contained malware |
| `bulkFiltered` | Marketing/bulk email filtered |
| `virusDetected` | Messages with virus/malware attachments |

## API Patterns

### List Organizations

```
proofpoint_list_orgs
```

Parameters:
- `page` — Page number (default: 1)
- `size` — Results per page (default: 50, max: 200)
- `status` — Filter by org status: `active`, `suspended`, `trial`
- `search` — Search by org name or domain

**Example — list all active orgs:**

```json
{
  "tool": "proofpoint_list_orgs",
  "parameters": {
    "status": "active",
    "size": 100
  }
}
```

**Example response:**

```json
{
  "total": 47,
  "page": 1,
  "size": 100,
  "organizations": [
    {
      "orgId": "acme-corp-us",
      "name": "Acme Corporation",
      "domain": "acmecorp.com",
      "status": "active",
      "plan": "advanced",
      "userCount": 85,
      "createdAt": "2024-06-15T00:00:00Z"
    },
    {
      "orgId": "globex-ltd",
      "name": "Globex Ltd",
      "domain": "globex.co.uk",
      "status": "active",
      "plan": "business",
      "userCount": 22,
      "createdAt": "2025-01-20T00:00:00Z"
    }
  ]
}
```

**Pagination loop:**

If `total > size`, retrieve subsequent pages:

```json
{
  "tool": "proofpoint_list_orgs",
  "parameters": {
    "page": 2,
    "size": 100
  }
}
```

Continue until `(page * size) >= total`.

### Get Email Statistics

```
proofpoint_get_email_stats
```

Parameters:
- `orgId` — Organization ID (required)
- `startDate` — Start of statistics window (ISO 8601 UTC)
- `endDate` — End of statistics window (ISO 8601 UTC)
- `interval` — Aggregation granularity: `day`, `week`, `month` (default: `day`)

**Example — 30-day stats for one org:**

```json
{
  "tool": "proofpoint_get_email_stats",
  "parameters": {
    "orgId": "acme-corp-us",
    "startDate": "2026-02-01T00:00:00Z",
    "endDate": "2026-03-01T00:00:00Z",
    "interval": "day"
  }
}
```

**Example response:**

```json
{
  "orgId": "acme-corp-us",
  "period": {
    "start": "2026-02-01T00:00:00Z",
    "end": "2026-03-01T00:00:00Z"
  },
  "summary": {
    "totalInbound": 42580,
    "totalOutbound": 18230,
    "delivered": 38920,
    "blocked": 2840,
    "quarantined": 820,
    "spamBlocked": 2450,
    "malwareBlocked": 390,
    "bulkFiltered": 6120,
    "virusDetected": 12
  },
  "daily": [
    {
      "date": "2026-02-01",
      "totalInbound": 1420,
      "delivered": 1290,
      "blocked": 98,
      "quarantined": 32
    }
  ]
}
```

**Example — all-org statistics for monthly report:**

To generate stats for all organizations, call `proofpoint_list_orgs` first to get all org IDs, then call `proofpoint_get_email_stats` for each. Present as a comparison table.

## Common Workflows

### Monthly MSP Email Security Report

1. Call `proofpoint_list_orgs` with `status: "active"` — paginate to get all orgs
2. For each org, call `proofpoint_get_email_stats` with the prior month window
3. Aggregate across all orgs: total inbound, total blocked, block rate percentage
4. Identify orgs with unusual patterns:
   - Very high block rates (>30%) — possible spam/attack targeting
   - Very low block rates (<1%) — possible misconfiguration or policy gaps
   - Spike in malware detections — warrants deeper investigation
5. Build a per-org table for the monthly report

### Org Health Check

1. Get the org's email stats for the last 7 days
2. Calculate key metrics:
   - **Block rate** = `blocked / totalInbound * 100`
   - **Quarantine rate** = `quarantined / totalInbound * 100`
   - **Malware rate** = `malwareBlocked / totalInbound * 100`
3. Flag orgs where:
   - `malwareBlocked > 0` — any malware detection warrants review
   - Block rate > 40% — high threat targeting
   - `virusDetected > 0` — virus in attachments

### New Customer Onboarding Verification

1. After provisioning a new org, call `proofpoint_list_orgs` and confirm the new org appears
2. Call `proofpoint_get_email_stats` for the last 24 hours to verify email is flowing
3. If `totalInbound = 0`: confirm MX records are pointing to Proofpoint and DNS has propagated
4. If stats show high block rates immediately: review default policy configuration

### Billing Verification

1. Call `proofpoint_list_orgs` to get `userCount` for each org — this drives Essentials licensing costs
2. Cross-reference against PSA/billing system user counts
3. Flag discrepancies where Proofpoint userCount differs significantly from billed count
4. Suspend orgs that are no longer active customers (prevents billing for unused licenses)

## Error Handling

### Authorization Error on list_orgs

**Cause:** The credentials are for a direct customer account, not an MSP partner account
**Solution:** Confirm with Proofpoint support that the account has MSP/partner API access enabled

### org_id Not Found

**Cause:** Incorrect org ID — org IDs are case-sensitive and may differ from the display name
**Solution:** Call `proofpoint_list_orgs` first to get the correct `orgId` values before querying stats

### Empty Statistics (totalInbound: 0)

**Cause:** May indicate MX records not pointing to Proofpoint, or a very new org with no traffic yet
**Solution:** Verify MX records; allow 24-48 hours for a new org to accumulate data

### Statistics Window Too Large

**Cause:** Very large date ranges may time out or return truncated data
**Solution:** Use monthly windows (`interval: "month"`) for long periods; avoid windows longer than 90 days

## Best Practices

- Cache org lists during a session — `proofpoint_list_orgs` results change infrequently
- When building reports for multiple orgs, batch the stats queries and present results as a table rather than individual org summaries
- Always display `orgId` alongside `name` in reports — names are not always unique
- Include `userCount` in reports to provide context for email volumes (e.g., "42,580 emails / 85 users = ~500/user/month")
- Present block rates as percentages with the raw counts for clarity
- Flag orgs with `status: "trial"` separately — they may need conversion or removal
- When sharing stats with clients, use `interval: "month"` for cleaner trend data

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication and Essentials API patterns
- [message-trace](../message-trace/SKILL.md) - Per-org message trace using orgId
- [threats](../threats/SKILL.md) - TAP threat data for deeper security analysis
