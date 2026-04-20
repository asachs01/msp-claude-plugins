---
name: inforcer-compliance-report
description: Generate compliance report for a tenant or group
arguments:
  - name: tenant
    description: Tenant name or ID for per-tenant report
    required: false
  - name: group
    description: Group name or ID for group-level report
    required: false
  - name: format
    description: Report format (summary, detailed, export-pdf, export-csv)
    required: false
---

# Generate Compliance Report

Generate a compliance report showing how well a tenant, group, or entire portfolio meets their assigned security baselines. Reports include compliance scores, non-compliant policies, framework control mappings, drift history, and actionable recommendations.

## Prerequisites

- Inforcer API key configured (`INFORCER_API_KEY` environment variable)
- Inforcer API base URL configured (`INFORCER_BASE_URL` environment variable)
- Target tenant(s) must be in `active` status with an assigned baseline

## Steps

1. **Determine scope**

   Resolve the `tenant` or `group` parameter. If neither is provided, generate an aggregate report for all tenants.

2. **Fetch compliance data**

   Call `GET /v1/reports/compliance` with the appropriate scope parameters (`tenantId` or `groupId`).

3. **Fetch drift data**

   Call `GET /v1/drift/summary` scoped to the same tenant or group for context on active drift events.

4. **Fetch Secure Score** (for context)

   Call `GET /v1/reports/secure-score` for the same scope to include Secure Score alongside compliance data.

5. **Generate or export report**

   For `summary` and `detailed` formats, present the data inline. For `export-pdf` or `export-csv`, call `GET /v1/reports/export` and provide the download link.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | string | No | - | Tenant name or UUID (for per-tenant report) |
| group | string | No | - | Group name or ID (for group report) |
| format | string | No | summary | Report format: `summary`, `detailed`, `export-pdf`, `export-csv` |

> **Note:** If both `tenant` and `group` are omitted, an aggregate report across all tenants is generated.

## Examples

### Summary Report for a Tenant

```
/inforcer-compliance-report --tenant "Contoso Ltd"
```

### Detailed Report for a Group

```
/inforcer-compliance-report --group "Gold Tier" --format detailed
```

### Export PDF for Client Delivery

```
/inforcer-compliance-report --tenant "Contoso Ltd" --format export-pdf
```

### Aggregate Report

```
/inforcer-compliance-report
```

## Output

### Summary Report (Per-Tenant)

```
Inforcer Compliance Report -- Summary
================================================================
Tenant:     Contoso Ltd
Baseline:   CIS Level 1 - Standard (v1.2)
Generated:  2026-02-24T14:00:00Z
Period:     2026-02-01 to 2026-02-24

Compliance Score: 87/100 (+3 from last month)
Secure Score:     72.5/100 (+7.5 from last month)
Active Drift:     2 events (0 critical, 1 high, 1 medium)

Category Breakdown:
+----------------+-------+----------+---------------+
| Category       | Score | Compliant | Non-Compliant |
+----------------+-------+----------+---------------+
| Entra ID       |   92% |    14/15 |             1 |
| Intune         |   85% |    17/20 |             3 |
| Defender       |   90% |     9/10 |             1 |
| Exchange       |   83% |    10/12 |             1 |
| SharePoint     |   88% |     7/8  |             0 |
+----------------+-------+----------+---------------+

Top Issues (by severity):
  1. [HIGH] Safe Attachments in monitor-only mode (CIS 4.1.1)
  2. [MEDIUM] DMARC set to none instead of reject (CIS 2.1.2)
  3. [MEDIUM] No Android app protection policy (CIS 5.4.1)

Trend: Improving -- compliance up 3 points from last month.
================================================================
```

### Detailed Report (Per-Tenant)

```
Inforcer Compliance Report -- Detailed
================================================================
Tenant:     Contoso Ltd
Baseline:   CIS Level 1 - Standard (v1.2)
Generated:  2026-02-24T14:00:00Z
Period:     2026-02-01 to 2026-02-24

Compliance Score: 87/100 (+3 from last month)
================================================================

ENTRA ID -- 92% Compliant (14 of 15 policies)
----------------------------------------------------------------
  [PASS] CIS 1.1.1 - Block legacy authentication
  [PASS] CIS 1.1.2 - Require MFA for admin roles
  [FAIL] CIS 1.1.3 - Require MFA for all users
           Baseline: MFA required for all users
           Current:  MFA required for admin roles only
           Impact:   Standard users vulnerable to credential attacks
           Fix:      Update conditional access to include all users
  [PASS] CIS 1.2.1 - Configure named locations
  [PASS] CIS 1.2.2 - Require compliant devices
  ... (10 more PASS)

INTUNE -- 85% Compliant (17 of 20 policies)
----------------------------------------------------------------
  [PASS] CIS 5.1.1 - Enable device enrollment
  [FAIL] CIS 5.2.1 - Require device encryption
           Baseline: BitLocker required
           Current:  Not configured
           Fix:      Add encryption to compliance policy
  [FAIL] CIS 5.3.2 - Minimum OS version
           Baseline: Windows 10 21H2 minimum
           Current:  No minimum set
           Fix:      Configure minimum OS in compliance policy
  [FAIL] CIS 5.4.1 - App protection policies
           Baseline: iOS and Android MAM policies
           Current:  iOS only
           Fix:      Create Android app protection policy
  ... (16 more PASS)

DEFENDER -- 90% Compliant (9 of 10 policies)
----------------------------------------------------------------
  [FAIL] CIS 4.1.1 - Safe Attachments
           Baseline: Block mode
           Current:  Monitor-only mode
           Fix:      Switch to block mode
  ... (9 more PASS)

EXCHANGE -- 83% Compliant (10 of 12 policies)
----------------------------------------------------------------
  [FAIL] CIS 2.1.2 - DMARC enforcement
           Baseline: p=reject
           Current:  p=none
           Fix:      Update DMARC to reject after monitoring period
  [N/A]  CIS 2.3.1 - Exchange hybrid connector (cloud-only tenant)
  ... (10 more PASS)

SHAREPOINT -- 88% Compliant (7 of 8 policies)
----------------------------------------------------------------
  [N/A]  CIS 6.1.2 - SharePoint Server integration (not applicable)
  ... (7 more PASS)

Drift History (this period):
  - 2026-02-05: Safe Attachments changed to monitor-only (auto-remediated)
  - 2026-02-10: DMARC set to none (acknowledged -- monitoring period)
  - 2026-02-18: MFA policy scope reduced to admin-only (open -- pending remediation)

Recommendations:
  1. [IMMEDIATE] Expand MFA to all users (CIS 1.1.3)
  2. [THIS WEEK] Enable device encryption and minimum OS version
  3. [THIS MONTH] Create Android app protection policy
  4. [SCHEDULED] DMARC enforcement after 30-day monitoring period ends
================================================================
```

### Aggregate Report

```
Inforcer Compliance Report -- Portfolio
================================================================
Scope:      All Managed Tenants (134)
Generated:  2026-02-24T14:00:00Z

Portfolio Average: 84/100

Distribution:
  90-100:  45 tenants (34%)  ████████████████
  80-89:   53 tenants (40%)  ████████████████████
  70-79:   24 tenants (18%)  █████████
  60-69:    8 tenants  (6%)  ███
   0-59:    4 tenants  (3%)  █

Top Performers:
  1. Northwind Traders  -- 98%
  2. Fabrikam Inc       -- 96%
  3. Contoso Ltd        -- 92%

Needs Attention:
  1. Tailspin Toys      -- 52% (8 drift events)
  2. Fourth Coffee      -- 58% (6 drift events)
  3. Woodgrove Bank     -- 63% (5 drift events)

Most Common Non-Compliance:
  1. DMARC enforcement (38 tenants non-compliant)
  2. App protection for Android (31 tenants)
  3. Minimum OS version (24 tenants)
================================================================
```

### Export Response

```
Inforcer Compliance Report -- Export
================================================================
Report generated and ready for download.

Format:    PDF
Scope:     Contoso Ltd
Baseline:  CIS Level 1 - Standard (v1.2)

Download:  https://api.inforcer.com/v1/exports/export-001/download
Expires:   2026-02-25T14:00:00Z

The download link is valid for 24 hours.
================================================================
```

## Error Handling

### Tenant and Group Both Specified

```
Error: Cannot specify both --tenant and --group

Use one of:
  /inforcer-compliance-report --tenant "Contoso Ltd"
  /inforcer-compliance-report --group "Gold Tier"
  /inforcer-compliance-report  (for aggregate)
```

### No Baseline Assigned

```
Error: Tenant "Alpine Ski House" has no assigned baseline

Assign a baseline before generating a compliance report.
Available baselines: GET /v1/baselines
```

### Authentication Error

```
Error: 401 Unauthorized

Your Inforcer API key is missing or invalid.
Generate a new key at: Inforcer Portal > Settings > API Access
```

## Related Commands

- `/inforcer-tenant-overview` -- Quick portfolio health check
- `/inforcer-baseline-compare` -- Detailed per-policy comparison
- `/inforcer-drift-check` -- Active drift event details
- `/inforcer-secure-score` -- Secure Score trends alongside compliance
