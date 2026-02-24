---
name: cipp-security-posture
description: Review Secure Score and MFA status across tenants
arguments:
  - name: tenant
    description: Specific tenant domain (optional, reviews all tenants if omitted)
    required: false
---

# CIPP Security Posture Review

Review the security posture of managed tenants by combining Microsoft Secure Score, MFA enrollment status, conditional access policy coverage, and inactive account detection into a unified security assessment.

## Prerequisites

- CIPP API connection configured with `CIPP_BASE_URL` and `CIPP_API_KEY`
- API key must have read access to security endpoints
- Target tenants must have Azure AD Premium P1+ for Secure Score and sign-in data

## Steps

1. **Get Secure Score**

   Call `ListSecureScore` for each tenant to retrieve the overall security score and control breakdown.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListSecureScore?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

2. **Get MFA status**

   Call `ListMFAUsers` to get per-user MFA enrollment and enforcement status.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListMFAUsers?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

3. **Review conditional access policies**

   Call `ListConditionalAccessPolicies` to audit the access control posture.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListConditionalAccessPolicies?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

4. **Check for inactive accounts**

   Call `ListInactiveAccounts` to identify dormant accounts that are potential security risks.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListInactiveAccounts?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

5. **Compile security posture report**

   Combine all data into a unified security posture report with scores, gaps, and prioritized recommendations.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | string | No | All tenants | Specific tenant domain to review |

## Examples

### Review All Tenants

```
/cipp-security-posture
```

### Review Specific Tenant

```
/cipp-security-posture --tenant contoso.onmicrosoft.com
```

## Output

### Cross-Tenant Security Dashboard

```
CIPP Security Posture Report
================================================================
Date: 2026-02-24
Scope: All Tenants (12)

Portfolio Security Overview:
  Average Secure Score: 68%
  Tenants above 80%:   5 (42%)
  Tenants below 50%:   2 (17%)
  Overall MFA Adoption: 87%

Security Dashboard:
+---+-------------------+-------+------+------+-----------+----------+
| # | Tenant            | Score | MFA% | CAs  | Inactive  | Rating   |
+---+-------------------+-------+------+------+-----------+----------+
| 1 | Contoso Ltd       |   85% |  98% |    6 |     2     | Excellent|
| 2 | Woodgrove Bank    |   82% |  95% |    5 |     1     | Excellent|
| 3 | Tailspin Toys     |   80% | 100% |    4 |     0     | Excellent|
| 4 | Fabrikam Inc      |   72% |  90% |    4 |     3     | Good     |
| 5 | Litware Inc       |   68% |  85% |    3 |     5     | Good     |
| 6 | Proseware         |   65% |  82% |    3 |     2     | Good     |
| 7 | Trey Research     |   62% |  88% |    2 |     4     | Good     |
| 8 | VanArsdel Ltd     |   58% |  78% |    2 |     6     | Fair     |
| 9 | Datum Corp        |   55% |  75% |    2 |     3     | Fair     |
| 10| GDI               |   52% |  72% |    1 |     8     | Fair     |
| 11| Adventure Works   |   38% |  45% |    0 |    12     | Poor     |
| 12| Fourth Coffee     |   25% |  30% |    0 |    15     | Poor     |
+---+-------------------+-------+------+------+-----------+----------+

Critical Issues:
  1. Fourth Coffee: 25% Secure Score, 30% MFA, no Conditional Access
  2. Adventure Works: 38% Secure Score, 45% MFA, no Conditional Access
  3. GDI: 8 inactive accounts with active licenses

Priority Recommendations:
  1. Deploy MFA to Fourth Coffee and Adventure Works immediately
  2. Create baseline CA policies for tenants with 0 CA policies
  3. Offboard 35 inactive accounts across all tenants to reduce attack surface
  4. Review and remediate Secure Score improvement actions for tenants < 60%
================================================================
```

### Single Tenant Deep Dive

```
CIPP Security Posture Report
================================================================
Date: 2026-02-24
Tenant: Contoso Ltd (contoso.onmicrosoft.com)

Secure Score: 85/100 (85%)
  Compared to average: +17%
  Compared to similar orgs: +10%

MFA Status:
  Total Users:        50
  MFA Registered:     49 (98%)
  MFA Not Registered:  1 (2%)
  Admin MFA:          100% (all 4 admins enrolled)

  Users Without MFA:
  +----+---------------------------+-----------+
  | #  | User                      | Role      |
  +----+---------------------------+-----------+
  |  1 | scanner@contoso.com       | Service   |
  +----+---------------------------+-----------+

Conditional Access Policies (6):
  +---+------------------------------------+----------+----------+
  | # | Policy Name                        | State    | Scope    |
  +---+------------------------------------+----------+----------+
  | 1 | Require MFA for Admins             | Enabled  | Admins   |
  | 2 | Require MFA for All Users          | Enabled  | All      |
  | 3 | Block Legacy Authentication         | Enabled  | All      |
  | 4 | Require Compliant Device           | Report   | All      |
  | 5 | Block High-Risk Sign-Ins           | Enabled  | All      |
  | 6 | Require MFA from Untrusted Locs    | Enabled  | All      |
  +---+------------------------------------+----------+----------+

Inactive Accounts (2):
  +---+------------------------------+----------------+----------+
  | # | User                         | Last Sign-In   | Licensed |
  +---+------------------------------+----------------+----------+
  | 1 | old.contractor@contoso.com   | 2025-09-15     | Yes (E3) |
  | 2 | test.account@contoso.com     | 2025-11-01     | No       |
  +---+------------------------------+----------------+----------+

Secure Score Controls:
  Top Improvement Actions:
  1. Enable device compliance policy (+3 points)
  2. Enable Conditional Access device compliance requirement (+2 points)
  3. Remove service account from MFA exclusion (+1 point)

Overall Rating: EXCELLENT

Recommendations:
  1. Offboard old.contractor@contoso.com (inactive 162 days, licensed)
  2. Move CA policy #4 (Require Compliant Device) from Report-only to Enabled
  3. Review scanner@contoso.com MFA exclusion - use app password or managed identity
  4. Delete test.account@contoso.com if no longer needed
================================================================
```

## Error Handling

### Secure Score Not Available

```
Warning: Secure Score is not available for some tenants.

Tenants missing Secure Score:
  - Fourth Coffee: Requires Azure AD Premium P1
  - Adventure Works: CPV permissions expired

These tenants are shown without Secure Score data.
```

### Partial Data

```
Warning: Could not retrieve all security data.

MFA data unavailable for:
  - Datum Corp: Graph API error (transient)

Retry in a few minutes or check CPV permissions for affected tenants.
```

### API Connection Error

```
Error: Unable to connect to CIPP API at ${CIPP_BASE_URL}

Verify your CIPP_BASE_URL and CIPP_API_KEY environment variables.
```

## CIPP API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `ListSecureScore` | Retrieve Microsoft Secure Score per tenant |
| `ListMFAUsers` | Get MFA enrollment and enforcement status |
| `ListConditionalAccessPolicies` | Audit conditional access policies |
| `ListInactiveAccounts` | Identify dormant user accounts |
| `ListTenants` | Get tenant list for cross-tenant reporting |

## Related Commands

- `/cipp-tenant-summary` - List all tenants before security review
- `/cipp-standards-check` - Check standards compliance alongside security posture
- `/cipp-user-offboard` - Offboard inactive accounts identified in this report
- `/cipp-alert-review` - Check for security-related alerts
