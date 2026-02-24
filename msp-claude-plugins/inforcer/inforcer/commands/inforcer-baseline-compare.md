---
name: inforcer-baseline-compare
description: Compare a tenant's current config against a baseline
arguments:
  - name: tenant
    description: Tenant name or ID to compare
    required: true
  - name: baseline
    description: Baseline name or ID (defaults to tenant's assigned baseline)
    required: false
---

# Compare Tenant Against Baseline

Compare a tenant's current M365 configuration against its assigned baseline (or a specified baseline) to identify compliance gaps, non-compliant policies, and drift from the desired security posture.

## Prerequisites

- Inforcer API key configured (`INFORCER_API_KEY` environment variable)
- Inforcer API base URL configured (`INFORCER_BASE_URL` environment variable)
- The tenant must be in `active` status with a completed initial sync
- A baseline must be assigned to the tenant (or specified explicitly)

## Steps

1. **Resolve tenant**

   If `tenant` is a name, call `GET /v1/tenants?search={tenant}` to resolve to a tenant ID. If it's already a UUID, use it directly.

2. **Resolve baseline**

   If `baseline` is provided, resolve it similarly. Otherwise, use the tenant's assigned baseline from `GET /v1/tenants/{tenantId}`.

3. **Run comparison**

   Call `GET /v1/baselines/{baselineId}/compare/{tenantId}` to get the full comparison result.

4. **Get baseline policy details**

   Call `GET /v1/baselines/{baselineId}/policies` to get the full list of policies in the baseline for context.

5. **Present comparison report**

   Display the overall compliance score, a breakdown by category, and a detailed list of non-compliant policies with the baseline value, current value, and remediation recommendation.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | string | Yes | - | Tenant name or UUID |
| baseline | string | No | Tenant's assigned baseline | Baseline name or UUID to compare against |

## Examples

### Compare Against Assigned Baseline

```
/inforcer-baseline-compare --tenant "Contoso Ltd"
```

### Compare Against a Specific Baseline

```
/inforcer-baseline-compare --tenant "Contoso Ltd" --baseline "CIS Level 2 Enhanced"
```

### Compare by Tenant ID

```
/inforcer-baseline-compare --tenant "550e8400-e29b-41d4-a716-446655440000"
```

## Output

### Full Comparison Report

```
Inforcer Baseline Comparison
================================================================
Tenant:    Contoso Ltd
Baseline:  CIS Level 1 - Standard (v1.2)
Generated: 2026-02-24T14:00:00Z

Overall Compliance: 87% (57 of 65 policies compliant)
================================================================

Category Breakdown:
+----------------+-------+----------+---------------+-----+
| Category       | Score | Compliant | Non-Compliant | N/A |
+----------------+-------+----------+---------------+-----+
| Entra ID       |   92% |    14/15 |             1 |   0 |
| Intune         |   85% |    17/20 |             3 |   0 |
| Defender       |   90% |     9/10 |             1 |   0 |
| Exchange       |   80% |    10/12 |             1 |   1 |
| SharePoint     |   88% |     7/8  |             0 |   1 |
+----------------+-------+----------+---------------+-----+

Non-Compliant Policies (6):
================================================================

[CRITICAL] CIS 1.1.3 - Require MFA for all users
  Category:  Entra ID (Conditional Access)
  Baseline:  MFA required for all users
  Current:   MFA required for admin roles only
  Gap:       Standard users can sign in without MFA
  Action:    Update conditional access policy to include all users

[HIGH] CIS 5.2.1 - Require device encryption
  Category:  Intune (Compliance)
  Baseline:  BitLocker encryption required on all Windows devices
  Current:   Encryption not required in compliance policy
  Gap:       Devices may have unencrypted drives
  Action:    Add encryption requirement to Windows compliance policy

[HIGH] CIS 5.3.2 - Require minimum OS version
  Category:  Intune (Compliance)
  Baseline:  Minimum Windows 10 21H2 (10.0.19044)
  Current:   No minimum OS version configured
  Gap:       Outdated and vulnerable OS versions allowed
  Action:    Set minimum OS version in compliance policy

[MEDIUM] CIS 5.4.1 - Configure app protection policies
  Category:  Intune (App Protection)
  Baseline:  MAM policies for iOS and Android
  Current:   MAM policies only for iOS
  Gap:       Android devices lack data protection
  Action:    Create Android app protection policy

[MEDIUM] CIS 2.1.2 - Enable DMARC enforcement
  Category:  Exchange (Email Authentication)
  Baseline:  DMARC policy set to reject
  Current:   DMARC policy set to none
  Gap:       Spoofed emails not rejected
  Action:    Update DMARC from p=none to p=reject

[HIGH] CIS 4.1.1 - Enable Safe Attachments
  Category:  Defender (Threat Protection)
  Baseline:  Safe Attachments enabled for all users
  Current:   Safe Attachments in monitor-only mode
  Gap:       Malicious attachments may reach users
  Action:    Switch Safe Attachments from monitor to block mode

Not Applicable (2):
  - CIS 2.3.1: Exchange hybrid connector (tenant is cloud-only)
  - CIS 6.1.2: SharePoint Server integration (not applicable)

Remediation Summary:
  Critical: 1 policy -- immediate action recommended
  High:     3 policies -- address within 24 hours
  Medium:   2 policies -- address within 1 week
================================================================
```

### Fully Compliant

```
Inforcer Baseline Comparison
================================================================
Tenant:    Fabrikam Inc
Baseline:  CIS Level 1 - Standard (v1.2)
Generated: 2026-02-24T14:00:00Z

Overall Compliance: 100% (65 of 65 policies compliant)
================================================================

All policies are compliant with the assigned baseline.
No remediation actions required.

Last verified: 2026-02-24T08:20:00Z
================================================================
```

### Tenant Not Found

```
Error: Tenant not found: "Contosso Ltd"

Did you mean one of these?
  - Contoso Ltd (ID: 550e8400-e29b-41d4-a716-446655440000)
  - Contoso Health (ID: 660e9500-f3ab-52e5-b827-557766550000)

Use the exact name or tenant UUID.
```

## Error Handling

### No Baseline Assigned

```
Error: No baseline assigned to tenant "Woodgrove Bank"

Assign a baseline first:
  1. List available baselines with GET /v1/baselines
  2. Assign via POST /v1/baselines/{id}/deploy with the tenant ID

Or specify a baseline to compare against:
  /inforcer-baseline-compare --tenant "Woodgrove Bank" --baseline "CIS Level 1"
```

### Tenant Still Onboarding

```
Error: Tenant "Alpine Ski House" is still onboarding (status: onboarding)

The initial configuration sync has not completed yet.
Wait for the onboarding process to finish before running a comparison.

Onboarding started: 2026-02-23T10:00:00Z
Expected completion: within 1-2 hours of consent
```

### Authentication Error

```
Error: 401 Unauthorized

Your Inforcer API key is missing or invalid.
Generate a new key at: Inforcer Portal > Settings > API Access
```

## Related Commands

- `/inforcer-tenant-overview` -- See all tenants and their compliance scores
- `/inforcer-drift-check` -- Check for active drift events
- `/inforcer-compliance-report` -- Generate a formal compliance report
- `/inforcer-secure-score` -- Review Secure Score alongside baseline compliance
