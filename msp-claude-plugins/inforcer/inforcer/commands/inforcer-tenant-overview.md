---
name: inforcer-tenant-overview
description: List all managed tenants with compliance status
---

# Inforcer Tenant Overview

List all managed M365 tenants with their compliance score, drift status, assigned baseline, and last sync time. Provides a quick portfolio health check across all tenants.

## Prerequisites

- Inforcer API key configured (`INFORCER_API_KEY` environment variable)
- Inforcer API base URL configured (`INFORCER_BASE_URL` environment variable)
- API key must have read access to tenant data

## Steps

1. **Get tenant summary**

   Call `GET /v1/tenants/summary` to retrieve aggregate tenant counts and average compliance score.

2. **List all tenants**

   Call `GET /v1/tenants?sort=complianceScore&order=asc&limit=200` to retrieve all tenants sorted by compliance score (worst first). Paginate if more than 200 tenants exist.

3. **Present overview table**

   Display a summary header with aggregate stats, followed by a table of all tenants with key health indicators.

4. **Highlight at-risk tenants**

   Call out tenants with compliance scores below 70, active critical drift, or stale sync timestamps (older than 24 hours).

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| group | string | No | all | Filter to a specific tenant group |
| tag | string | No | - | Filter to tenants with a specific tag |
| status | string | No | active | Filter by onboarding status (`active`, `onboarding`, `suspended`, `disconnected`) |

## Examples

### Full Portfolio Overview

```
/inforcer-tenant-overview
```

### Filter by Group

```
/inforcer-tenant-overview --group "Gold Tier"
```

### Filter by Tag

```
/inforcer-tenant-overview --tag healthcare
```

## Output

### Full Overview

```
Inforcer Tenant Overview
================================================================
Portfolio Summary:
  Total Tenants:    134 (120 active, 8 onboarding, 4 suspended, 2 disconnected)
  Average Score:    84/100
  Tenants w/ Drift: 23
  Total Drift:      47 events (3 critical, 12 high, 22 medium, 10 low)

Tenants (sorted by compliance score, lowest first):
+-----+-----------------------+-------+-------+------------------+---------------------+
| #   | Tenant                | Score | Drift | Baseline         | Last Sync           |
+-----+-----------------------+-------+-------+------------------+---------------------+
|   1 | Tailspin Toys         |    52 |     8 | CIS L1 Standard  | 2026-02-24T08:00:00 |
|   2 | Fourth Coffee         |    58 |     6 | CIS L1 Standard  | 2026-02-24T07:45:00 |
|   3 | Woodgrove Bank        |    63 |     5 | NIST 800-171     | 2026-02-24T08:15:00 |
| ... | ...                   |   ... |   ... | ...              | ...                 |
| 132 | Contoso Ltd           |    92 |     1 | CIS L1 Standard  | 2026-02-24T08:30:00 |
| 133 | Fabrikam Inc          |    96 |     0 | CIS L2 Enhanced  | 2026-02-24T08:20:00 |
| 134 | Northwind Traders     |    98 |     0 | CIS L1 Standard  | 2026-02-24T08:25:00 |
+-----+-----------------------+-------+-------+------------------+---------------------+

Attention Required:
  CRITICAL DRIFT:
    - Tailspin Toys: MFA for all users DISABLED (CIS 1.1.3)
    - Fourth Coffee: Conditional access policy deleted (CIS 1.1.1)
    - Woodgrove Bank: DMARC policy set to none (NIST SC-7)

  LOW COMPLIANCE (below 70):
    - Tailspin Toys (52) -- 8 drift events, needs immediate review
    - Fourth Coffee (58) -- 6 drift events, baseline re-deployment recommended
    - Woodgrove Bank (63) -- 5 drift events, NIST compliance gaps

  STALE SYNC (>24 hours):
    (None -- all tenants synced within the last 24 hours)

  ONBOARDING IN PROGRESS:
    - Alpine Ski House (started 2026-02-23)
    - Datum Corp (started 2026-02-22)
================================================================
```

### Empty Portfolio

```
Inforcer Tenant Overview
================================================================
No managed tenants found.

Get started by onboarding your first tenant in the Inforcer Portal:
  https://portal.inforcer.com/tenants/onboard
================================================================
```

### Filtered by Group

```
Inforcer Tenant Overview -- Gold Tier
================================================================
Group Summary:
  Tenants in Group: 45
  Average Score:    91/100
  Tenants w/ Drift: 5
  Total Drift:      8 events (0 critical, 2 high, 4 medium, 2 low)

Tenants:
+-----+-----------------------+-------+-------+------------------+---------------------+
| #   | Tenant                | Score | Drift | Baseline         | Last Sync           |
+-----+-----------------------+-------+-------+------------------+---------------------+
|   1 | Alpine Ventures       |    82 |     2 | CIS L1 Standard  | 2026-02-24T08:00:00 |
| ... | ...                   |   ... |   ... | ...              | ...                 |
|  45 | Northwind Traders     |    98 |     0 | CIS L1 Standard  | 2026-02-24T08:25:00 |
+-----+-----------------------+-------+-------+------------------+---------------------+
================================================================
```

## Error Handling

### Authentication Error

```
Error: 401 Unauthorized

Your Inforcer API key is missing or invalid.
Generate a new key at: Inforcer Portal > Settings > API Access

Check that INFORCER_API_KEY is set in your environment.
```

### No Tenants Match Filter

```
Inforcer Tenant Overview
================================================================
No tenants found matching filter: group="Premium Tier"

Available groups:
  - Gold Tier (45 tenants)
  - Silver Tier (62 tenants)
  - Basic (27 tenants)

Run without a filter to see all tenants:
  /inforcer-tenant-overview
================================================================
```

### API Connection Error

```
Error: Unable to connect to Inforcer API at https://api.inforcer.com

Check that:
  1. INFORCER_BASE_URL is set correctly
  2. Your network can reach the Inforcer API
  3. The Inforcer service is not experiencing an outage
```

## Related Commands

- `/inforcer-baseline-compare` -- Compare a specific tenant against its baseline
- `/inforcer-drift-check` -- Detailed drift analysis across groups
- `/inforcer-compliance-report` -- Generate a formal compliance report
- `/inforcer-secure-score` -- Review Secure Score trends for specific tenants
