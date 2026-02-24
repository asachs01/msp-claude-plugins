---
name: cipp-standards-check
description: Check standards compliance across tenants
arguments:
  - name: tenant
    description: Specific tenant domain (optional, checks all tenants if omitted)
    required: false
---

# CIPP Standards Check

Check security standards compliance across one or all managed tenants. Runs the Best Practice Analyser and reviews deployed standards status to produce a compliance matrix.

## Prerequisites

- CIPP API connection configured with `CIPP_BASE_URL` and `CIPP_API_KEY`
- API key must have read access to standards and BPA endpoints
- Unified audit logging should be enabled on target tenants for full analysis

## Steps

1. **Run Best Practice Analyser**

   Call `BestPracticeAnalyser` to get compliance data. If a specific tenant is provided, filter to that tenant; otherwise, analyze all tenants.

   ```bash
   # All tenants
   curl -s "${CIPP_BASE_URL}/api/BestPracticeAnalyser" \
     -H "x-api-key: ${CIPP_API_KEY}"

   # Specific tenant
   curl -s "${CIPP_BASE_URL}/api/BestPracticeAnalyser?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

2. **Get deployed standards**

   Call `ListStandards` to see which standards are deployed and their current status.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListStandards" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

3. **Build compliance matrix**

   Combine BPA results with deployed standards to create a compliance matrix showing each tenant's status against each check.

4. **Present compliance report**

   Display the compliance matrix as a formatted table with PASS/FAIL/WARN indicators, overall compliance percentage, and prioritized remediation recommendations.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | string | No | All tenants | Specific tenant domain to check |

## Examples

### Check All Tenants

```
/cipp-standards-check
```

### Check Specific Tenant

```
/cipp-standards-check --tenant contoso.onmicrosoft.com
```

## Output

### Cross-Tenant Compliance Matrix

```
CIPP Standards Compliance Report
================================================================
Date: 2026-02-24
Scope: All Tenants (12)

Overall Compliance: 78% (114 of 146 checks passing)

Compliance Matrix:
+-------------------+-------+-----+------+-------+-------+-------+-------+
| Tenant            | Audit | MFA | DKIM | Phish | SSPR  | Basic | Score |
+-------------------+-------+-----+------+-------+-------+-------+-------+
| Contoso Ltd       | PASS  | PASS| PASS | PASS  | PASS  | PASS  | 100%  |
| Fabrikam Inc      | PASS  | PASS| WARN | PASS  | FAIL  | PASS  |  83%  |
| Woodgrove Bank    | PASS  | PASS| PASS | PASS  | PASS  | PASS  | 100%  |
| Adventure Works   | PASS  | FAIL| FAIL | PASS  | FAIL  | WARN  |  50%  |
| Tailspin Toys     | PASS  | PASS| PASS | PASS  | PASS  | PASS  | 100%  |
| Fourth Coffee     | FAIL  | FAIL| FAIL | FAIL  | FAIL  | FAIL  |   0%  |
| ...               |       |     |      |       |       |       |       |
+-------------------+-------+-----+------+-------+-------+-------+-------+

Legend: PASS = Compliant | FAIL = Non-compliant | WARN = Partial

Summary by Check:
  Unified Audit Log:    11/12 PASS (92%)
  MFA Registration:     10/12 PASS (83%)
  DKIM Signing:          9/12 PASS (75%)
  Anti-Phish Policy:    11/12 PASS (92%)
  Self-Service PW Reset: 8/12 PASS (67%)
  Basic Auth Blocked:   10/12 PASS (83%)

Priority Remediation:
  1. Fourth Coffee (0% compliance) - Deploy all baseline standards
  2. Adventure Works (50%) - Enable MFA, configure DKIM
  3. Fabrikam Inc (83%) - Enable SSPR, finish DKIM for all domains
================================================================
```

### Single Tenant Report

```
CIPP Standards Compliance Report
================================================================
Date: 2026-02-24
Tenant: Contoso Ltd (contoso.onmicrosoft.com)

Overall Compliance: 92% (11 of 12 checks passing)

+---+-------------------------------+--------+---------------------------+
| # | Check                         | Status | Details                   |
+---+-------------------------------+--------+---------------------------+
| 1 | Unified Audit Log             | PASS   | Enabled                   |
| 2 | MFA Registration              | PASS   | 98% enrolled              |
| 3 | Global Admin Count            | WARN   | 4 admins (recommend <= 3) |
| 4 | DKIM Signing                  | PASS   | All 3 domains enabled     |
| 5 | Anti-Phishing Policy          | PASS   | Policy active             |
| 6 | Anti-Spam Policy              | PASS   | Policy active             |
| 7 | Self-Service Password Reset   | PASS   | Enabled for all users     |
| 8 | Basic Auth Blocked            | PASS   | Blocked via CA policy     |
| 9 | Password Expiration Disabled  | PASS   | No expiration policy      |
| 10| Shared Mailbox Sign-In        | PASS   | Disabled                  |
| 11| Mailbox Auditing              | PASS   | Enabled                   |
| 12| Security Defaults             | FAIL   | Disabled (using CA)       |
+---+-------------------------------+--------+---------------------------+

Notes:
  - Security Defaults is FAIL because it is disabled, but this tenant
    uses Conditional Access policies instead (which is the recommended
    approach for tenants with AAD Premium P1).
  - Global Admin count of 4 exceeds the recommended maximum of 3.
    Consider reducing to 2-3 Global Admins with break-glass accounts.

Deployed Standards (via CIPP):
  - AuditLog: Enabled, Remediation ON
  - AntiPhishPolicy: Enabled, Remediation ON
  - DKIMConfig: Enabled, Remediation ON
  - PasswordExpireDisabled: Enabled, Remediation ON
  Last applied: 2026-02-20T14:30:00Z
================================================================
```

## Error Handling

### BPA Not Available

```
Warning: Best Practice Analyser data is not available for some tenants.

Tenants with missing BPA data:
  - Fourth Coffee: CPV permissions expired
  - Datum Corp: Audit logging not enabled

Run ExecCPVPermissions for affected tenants, then retry.
```

### API Connection Error

```
Error: Unable to connect to CIPP API at ${CIPP_BASE_URL}

Verify your CIPP_BASE_URL and CIPP_API_KEY environment variables.
```

### Timeout on Large Tenant Set

```
Warning: BPA analysis timed out for some tenants.

The Best Practice Analyser may take several minutes for large tenant sets.
Try running for a specific tenant:
  /cipp-standards-check --tenant contoso.onmicrosoft.com
```

## CIPP API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `BestPracticeAnalyser` | Run compliance checks against tenants |
| `ListStandards` | Review deployed standards and their status |
| `ListBPATemplates` | Get available BPA check definitions |

## Related Commands

- `/cipp-tenant-summary` - List all tenants before checking compliance
- `/cipp-security-posture` - Deeper security analysis with Secure Score
- `/cipp-alert-review` - Check for compliance-related alerts
