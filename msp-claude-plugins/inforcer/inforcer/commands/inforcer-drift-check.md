---
name: inforcer-drift-check
description: Check for policy drift across tenant groups
arguments:
  - name: group
    description: Tenant group name or ID (omit for all tenants)
    required: false
  - name: severity
    description: Filter by drift severity (critical, high, medium, low)
    required: false
---

# Check for Policy Drift

Query Inforcer for active drift events across your managed tenant portfolio or a specific group. Displays a drift summary with affected policies, severity, and recommended actions.

## Prerequisites

- Inforcer API key configured (`INFORCER_API_KEY` environment variable)
- Inforcer API base URL configured (`INFORCER_BASE_URL` environment variable)
- At least one tenant with an assigned baseline in `active` status

## Steps

1. **Get drift summary**

   Call `GET /v1/drift/summary` to retrieve aggregate drift statistics. If `group` is specified, include `?groupId={groupId}` to scope the summary.

2. **List drift events**

   Call `GET /v1/drift?status=open&sort=severity&order=desc` to get all open drift events. Apply `severity` filter if specified. Apply group filter if specified.

3. **Group by tenant**

   Organize drift events by tenant for easier triage.

4. **Present drift report**

   Display the summary, followed by drift events grouped by tenant, with severity, policy name, what changed, and recommended action.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| group | string | No | all | Tenant group name or ID to scope the check |
| severity | string | No | all | Filter by severity: `critical`, `high`, `medium`, `low` |

## Examples

### Check All Tenants

```
/inforcer-drift-check
```

### Check a Specific Group

```
/inforcer-drift-check --group "Gold Tier"
```

### Check Only Critical Drift

```
/inforcer-drift-check --severity critical
```

### Combined Filters

```
/inforcer-drift-check --group "Gold Tier" --severity high
```

## Output

### Full Drift Report

```
Inforcer Drift Check
================================================================
Scope:       All Tenants (134 active)
Generated:   2026-02-24T14:00:00Z

Drift Summary:
  Total Open Events: 47
  By Severity:  3 critical | 12 high | 22 medium | 10 low
  By Category:  8 Entra ID | 15 Intune | 7 Defender | 10 Exchange | 7 SharePoint
  Affected Tenants: 23 of 134 (17%)

================================================================
CRITICAL DRIFT (3 events -- immediate action required)
================================================================

Tailspin Toys (compliance: 52%)
  [CRITICAL] MFA for all users DISABLED
    Policy:   CIS 1.1.3 - Require MFA for all users
    Baseline: Enabled for all users
    Current:  Policy disabled
    Changed:  2026-02-24T06:15:00Z by admin@tailspintoys.com via Azure Portal
    Action:   Remediate immediately -- POST /v1/drift/drift-001/remediate

Fourth Coffee (compliance: 58%)
  [CRITICAL] Conditional access policy deleted
    Policy:   CIS 1.1.1 - Block legacy authentication
    Baseline: Block legacy auth protocols
    Current:  Policy no longer exists
    Changed:  2026-02-24T03:30:00Z by globaladmin@fourthcoffee.com via PowerShell
    Action:   Re-deploy policy -- POST /v1/baselines/{id}/deploy

Woodgrove Bank (compliance: 63%)
  [CRITICAL] Security defaults disabled
    Policy:   NIST IA-2 - Security defaults
    Baseline: Security defaults enabled
    Current:  Security defaults disabled
    Changed:  2026-02-23T22:00:00Z by admin@woodgrovebank.com via M365 Admin Center
    Action:   Remediate immediately -- re-enable security defaults

================================================================
HIGH DRIFT (12 events)
================================================================

Tailspin Toys (compliance: 52%)
  [HIGH] Safe Attachments set to monitor-only
    Policy:   CIS 4.1.1 - Safe Attachments
    Changed:  2026-02-24T05:00:00Z
    Action:   Switch from monitor to block mode

  [HIGH] DKIM signing disabled for primary domain
    Policy:   CIS 2.2.1 - DKIM Configuration
    Changed:  2026-02-23T18:00:00Z
    Action:   Re-enable DKIM signing

Fourth Coffee (compliance: 58%)
  [HIGH] Device compliance grace period extended to 720 hours
    Policy:   CIS 5.2.3 - Compliance grace period
    Changed:  2026-02-24T02:00:00Z
    Action:   Reduce grace period to 72 hours per baseline

  ... (9 more HIGH events)

================================================================
MEDIUM DRIFT (22 events) -- Summarized
================================================================
  - 8 Intune configuration profile changes
  - 6 Exchange transport rule modifications
  - 5 SharePoint sharing setting changes
  - 3 Defender policy threshold adjustments

  View details: GET /v1/drift?status=open&severity=medium

================================================================
LOW DRIFT (10 events) -- Summarized
================================================================
  - 6 cosmetic/branding changes
  - 4 non-security configuration changes

  View details: GET /v1/drift?status=open&severity=low

Recommended Actions:
  1. Remediate 3 critical drift events immediately
  2. Address 12 high-severity events within 4 hours
  3. Schedule review of 22 medium events this week
  4. Investigate recurring drift on Tailspin Toys (8 total events)
  5. Consider enabling auto-remediation for critical policies
================================================================
```

### No Drift Found

```
Inforcer Drift Check
================================================================
Scope:       All Tenants (134 active)
Generated:   2026-02-24T14:00:00Z

No open drift events found.

All 134 active tenants are compliant with their assigned baselines.
Last full sync: 2026-02-24T08:30:00Z
================================================================
```

### Filtered by Severity

```
Inforcer Drift Check -- Critical Only
================================================================
Scope:       All Tenants (134 active)
Severity:    Critical
Generated:   2026-02-24T14:00:00Z

Critical Drift Events: 3

  1. Tailspin Toys -- MFA for all users DISABLED
     Changed: 2026-02-24T06:15:00Z by admin@tailspintoys.com

  2. Fourth Coffee -- Conditional access policy deleted
     Changed: 2026-02-24T03:30:00Z by globaladmin@fourthcoffee.com

  3. Woodgrove Bank -- Security defaults disabled
     Changed: 2026-02-23T22:00:00Z by admin@woodgrovebank.com

All 3 events require immediate remediation.
================================================================
```

## Error Handling

### Group Not Found

```
Error: Group not found: "Premium Tier"

Available groups:
  - Gold Tier (45 tenants)
  - Silver Tier (62 tenants)
  - Basic (27 tenants)

Use one of the available group names or omit the --group parameter.
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

- `/inforcer-tenant-overview` -- Portfolio-wide tenant health check
- `/inforcer-baseline-compare` -- Deep comparison for a specific tenant
- `/inforcer-compliance-report` -- Formal compliance report with drift data
- `/inforcer-secure-score` -- Secure Score impact of drift events
