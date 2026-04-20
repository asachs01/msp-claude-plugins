---
name: inforcer-secure-score
description: Review Microsoft Secure Score trends
arguments:
  - name: tenant
    description: Tenant name or ID (omit for aggregate across all tenants)
    required: false
  - name: days
    description: Trend period in days
    required: false
---

# Review Microsoft Secure Score Trends

Query Inforcer for Microsoft Secure Score data and trends over time. Displays the current score, historical trend, and top recommendations for improving the score. Can be scoped to a specific tenant or aggregated across all tenants.

## Prerequisites

- Inforcer API key configured (`INFORCER_API_KEY` environment variable)
- Inforcer API base URL configured (`INFORCER_BASE_URL` environment variable)
- Target tenant(s) must be in `active` status with Secure Score data available

## Steps

1. **Resolve tenant** (if specified)

   If `tenant` is a name, resolve to a tenant ID via `GET /v1/tenants?search={tenant}`. If omitted, the report will aggregate across all tenants.

2. **Fetch Secure Score data**

   Call `GET /v1/reports/secure-score` with `tenantId` (if scoped) and `days` parameter for the trend period.

3. **Fetch compliance score** (for context)

   Call `GET /v1/tenants/{tenantId}/status` (or `GET /v1/tenants/summary` for aggregate) to show compliance score alongside Secure Score.

4. **Present Secure Score report**

   Display the current score, trend over the specified period, score history, and top recommendations sorted by potential impact.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | string | No | all | Tenant name or UUID |
| days | integer | No | 30 | Trend period in days (max 365) |

## Examples

### Single Tenant (30-day trend)

```
/inforcer-secure-score --tenant "Contoso Ltd"
```

### Single Tenant (90-day trend)

```
/inforcer-secure-score --tenant "Contoso Ltd" --days 90
```

### Aggregate Across All Tenants

```
/inforcer-secure-score
```

## Output

### Per-Tenant Secure Score

```
Inforcer Secure Score Report
================================================================
Tenant:     Contoso Ltd
Period:     30 days (2026-01-25 to 2026-02-24)
Generated:  2026-02-24T14:00:00Z

Current Secure Score: 72.5 / 100
Compliance Score:     87 / 100 (CIS Level 1)

30-Day Trend: +7.5 points (improving)
  Jan 25:  65.0  ██████████████████████████
  Feb 01:  67.2  ██████████████████████████▊
  Feb 08:  69.0  ███████████████████████████▌
  Feb 15:  71.3  ████████████████████████████▌
  Feb 22:  72.5  █████████████████████████████

Top Recommendations (by score impact):
+---+------------------------------------------+----------+--------+------------+
| # | Recommendation                           | Category | Impact | Difficulty |
+---+------------------------------------------+----------+--------+------------+
| 1 | Turn on sign-in risk policy              | Identity | +4.2   | Moderate   |
| 2 | Enable mailbox auditing for all users    | Data     | +3.1   | Easy       |
| 3 | Enable self-service password reset       | Identity | +2.8   | Easy       |
| 4 | Configure DLP policies for credit cards  | Data     | +2.5   | Moderate   |
| 5 | Enable Azure AD PIM for admin roles      | Identity | +2.2   | Hard       |
+---+------------------------------------------+----------+--------+------------+

Quick Wins (easy + high impact):
  - Enable mailbox auditing: +3.1 points (takes ~5 minutes)
  - Enable self-service password reset: +2.8 points (takes ~15 minutes)

Implementing all top 5 recommendations would bring the score to ~87.3

Recent Score Changes:
  - Feb 20: +2.3 -- Enabled Safe Links for all users
  - Feb 14: +1.5 -- Configured conditional access for risky sign-ins
  - Feb 08: +1.8 -- Deployed device compliance policies
  - Feb 02: +1.9 -- Enabled DKIM for primary domain
================================================================
```

### Aggregate Secure Score

```
Inforcer Secure Score Report -- Portfolio
================================================================
Scope:      All Managed Tenants (134)
Period:     30 days
Generated:  2026-02-24T14:00:00Z

Portfolio Average Secure Score: 68.3 / 100

30-Day Trend: +4.1 points (improving)

Distribution:
  80+:     28 tenants (21%)  ██████████
  70-79:   42 tenants (31%)  ███████████████▌
  60-69:   38 tenants (28%)  ██████████████
  50-59:   18 tenants (13%)  ██████▌
  <50:      8 tenants  (6%)  ███

Top Performers:
  1. Fabrikam Inc        -- 89.2
  2. Northwind Traders   -- 87.5
  3. Contoso Ltd         -- 72.5

Most Improvement (this period):
  1. Datum Corp          -- +12.3 points (42.0 -> 54.3)
  2. Contoso Ltd         -- +7.5 points (65.0 -> 72.5)
  3. Wingtip Toys        -- +6.8 points (58.2 -> 65.0)

Most Common Score Improvement Opportunities:
  1. Enable mailbox auditing (92 tenants not yet implemented)
  2. Turn on sign-in risk policy (78 tenants)
  3. Enable self-service password reset (65 tenants)
  4. Configure DLP policies (61 tenants)
  5. Block legacy authentication (34 tenants)

If all tenants implemented the top 3 recommendations,
the portfolio average would increase to ~76.1 (+7.8 points).
================================================================
```

### No Data Available

```
Inforcer Secure Score Report
================================================================
Tenant:     Alpine Ski House
Generated:  2026-02-24T14:00:00Z

No Secure Score data available for this tenant.

This may be because:
  1. The tenant was recently onboarded and hasn't synced yet
  2. The tenant's M365 subscription doesn't include Secure Score
  3. Inforcer doesn't have the required permissions to read Secure Score

Check the tenant's onboarding status:
  /inforcer-tenant-overview
================================================================
```

## Error Handling

### Tenant Not Found

```
Error: Tenant not found: "Contosso"

Did you mean one of these?
  - Contoso Ltd
  - Contoso Health

Use the exact tenant name or UUID.
```

### Invalid Days Parameter

```
Error: Invalid --days value: 500

The maximum trend period is 365 days.
Use: /inforcer-secure-score --tenant "Contoso Ltd" --days 365
```

### Authentication Error

```
Error: 401 Unauthorized

Your Inforcer API key is missing or invalid.
Generate a new key at: Inforcer Portal > Settings > API Access
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

- `/inforcer-tenant-overview` -- Portfolio health check with compliance scores
- `/inforcer-compliance-report` -- Detailed compliance report alongside Secure Score
- `/inforcer-baseline-compare` -- Compare baseline compliance (distinct from Secure Score)
- `/inforcer-drift-check` -- Check for drift that may be lowering Secure Score
