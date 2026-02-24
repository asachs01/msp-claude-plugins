---
description: >
  Use this skill when working with CIPP standards and baselines - deploying
  security standards to tenants, monitoring compliance status, checking
  standards across tenants, managing BPA templates, and running remediation
  workflows.
triggers:
  - cipp standard
  - cipp baseline
  - cipp compliance
  - cipp deploy
  - cipp template
  - cipp best practice
  - cipp policy
  - cipp configuration
---

# CIPP Standards & Compliance

## Overview

CIPP Standards are a powerful mechanism for enforcing security baselines and configuration policies across managed M365 tenants. Standards define a desired state (e.g., "MFA must be enabled for all admins") and CIPP continuously monitors and optionally remediates drift. The Best Practice Analyser (BPA) provides a compliance assessment against common security benchmarks.

## Key Concepts

### Standards vs. Best Practice Analyser

| Feature | Standards | Best Practice Analyser (BPA) |
|---------|-----------|------------------------------|
| Purpose | Enforce configuration | Assess compliance |
| Action | Can auto-remediate | Read-only analysis |
| Scope | Per-tenant or all-tenants | Per-tenant or all-tenants |
| Customization | Choose which standards to deploy | Uses predefined templates |
| Frequency | Runs on schedule (typically every 3 hours) | On-demand or scheduled |

### Standard Categories

CIPP standards are organized into categories:

| Category | Examples |
|----------|---------|
| **Identity** | MFA enforcement, password policies, self-service password reset |
| **Email** | Anti-phishing, anti-spam, DKIM, DMARC, safe attachments |
| **SharePoint** | External sharing controls, default sharing link type |
| **Teams** | External access, guest policies, meeting policies |
| **Device** | Intune enrollment, compliance policies |
| **Azure AD** | Security defaults, conditional access, app consent |

### Standards Lifecycle

1. **Define** - Choose which standards to enforce
2. **Deploy** - Push standards to one or more tenants
3. **Monitor** - CIPP checks compliance on a recurring schedule
4. **Alert** - Non-compliant tenants are flagged
5. **Remediate** - CIPP can auto-remediate drift (if enabled)

## Endpoints

### ListStandards

List all configured standards, optionally filtered by tenant.

```bash
# List standards for all tenants
curl -s "${CIPP_BASE_URL}/api/ListStandards" \
  -H "x-api-key: ${CIPP_API_KEY}"

# List standards for a specific tenant
curl -s "${CIPP_BASE_URL}/api/ListStandards?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | No | Specific tenant (all tenants if omitted) |

**Response:**

```json
[
  {
    "tenantName": "contoso.onmicrosoft.com",
    "displayName": "Contoso Ltd",
    "standards": {
      "IntuneTemplate": {
        "enabled": true,
        "remediate": true
      },
      "PWnumberaliasalikealikealikeEnabled": {
        "enabled": true,
        "remediate": false
      },
      "AuditLog": {
        "enabled": true,
        "remediate": true
      },
      "AntiPhishPolicy": {
        "enabled": true,
        "remediate": true
      }
    },
    "appliedAt": "2026-02-20T14:30:00Z",
    "lastRun": "2026-02-24T06:00:00Z",
    "lastRunStatus": "Compliant"
  }
]
```

### AddStandardsDeploy

Deploy standards to one or more tenants.

```bash
curl -s "${CIPP_BASE_URL}/api/AddStandardsDeploy" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "Standards": {
      "AuditLog": {
        "enabled": true,
        "remediate": true
      },
      "AntiPhishPolicy": {
        "enabled": true,
        "remediate": true
      },
      "DKIMConfig": {
        "enabled": true,
        "remediate": true
      },
      "DisableBasicAuthSMTP": {
        "enabled": true,
        "remediate": true
      },
      "PasswordExpireDisabled": {
        "enabled": true,
        "remediate": true
      }
    }
  }'
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Target tenant (or `AllTenants`) |
| `Standards` | object | Yes | Standards configuration object |

Each standard entry has:

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | bool | Whether the standard is active |
| `remediate` | bool | Whether CIPP should auto-fix non-compliance |

### BestPracticeAnalyser

Run a best practice analysis against one or all tenants.

```bash
# Analyze a specific tenant
curl -s "${CIPP_BASE_URL}/api/BestPracticeAnalyser?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"

# Analyze all tenants
curl -s "${CIPP_BASE_URL}/api/BestPracticeAnalyser" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Response:**

```json
[
  {
    "Tenant": "contoso.onmicrosoft.com",
    "DisplayName": "Contoso Ltd",
    "UnifiedAuditLog": "PASS",
    "SecureDefaultsEnabled": "FAIL",
    "GlobalAdminCount": "WARN - 4 Global Admins",
    "MFARegistration": "PASS - 98%",
    "PasswordNeverExpires": "PASS",
    "SelfServicePasswordReset": "FAIL",
    "AntiPhishPolicy": "PASS",
    "DKIMEnabled": "WARN - 2 of 3 domains",
    "MailboxAuditing": "PASS",
    "SharedMailboxSignIn": "PASS - Disabled",
    "LastAnalysis": "2026-02-24T06:15:00Z"
  }
]
```

BPA results use three states:

| State | Meaning |
|-------|---------|
| `PASS` | Compliant with best practice |
| `FAIL` | Non-compliant, action required |
| `WARN` | Partially compliant or advisory |

### ListBPATemplates

List available BPA analysis templates.

```bash
curl -s "${CIPP_BASE_URL}/api/ListBPATemplates" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Response:**

```json
[
  {
    "name": "CIPP Default",
    "description": "Standard CIPP best practice checks",
    "checks": [
      "UnifiedAuditLog",
      "SecureDefaults",
      "GlobalAdminCount",
      "MFARegistration",
      "AntiPhishPolicy",
      "DKIMEnabled"
    ]
  }
]
```

## Common Standards

### Identity & Access

| Standard | Description | Remediation |
|----------|-------------|-------------|
| `AuditLog` | Enable unified audit logging | Enables if disabled |
| `PasswordExpireDisabled` | Disable password expiration (use MFA instead) | Sets password policy |
| `SelfServicePasswordReset` | Enable SSPR for all users | Configures SSPR |
| `DisableSecurityDefaults` | Disable Security Defaults (when using CA policies) | Disables feature |
| `LegacyMFA` | Block legacy MFA in favor of Conditional Access | Updates MFA settings |

### Email Security

| Standard | Description | Remediation |
|----------|-------------|-------------|
| `AntiPhishPolicy` | Configure anti-phishing policies | Creates/updates policy |
| `AntiSpamPolicy` | Configure anti-spam settings | Creates/updates policy |
| `SafeAttachments` | Enable Safe Attachments (Defender for O365) | Creates/updates policy |
| `SafeLinks` | Enable Safe Links (Defender for O365) | Creates/updates policy |
| `DKIMConfig` | Enable DKIM signing for all domains | Enables DKIM |
| `DisableBasicAuthSMTP` | Block SMTP basic authentication | Updates auth policy |

### Collaboration

| Standard | Description | Remediation |
|----------|-------------|-------------|
| `SharePointExternalSharing` | Control external sharing level | Updates sharing settings |
| `TeamsExternalAccess` | Control external user access to Teams | Updates Teams policy |
| `SharePointDefaultSharingLink` | Set default sharing link type | Updates SharePoint settings |

## Compliance Monitoring Workflow

### Initial Baseline Deployment

When onboarding a new client:

1. **Assess current state** - Run `BestPracticeAnalyser` for the tenant
2. **Review findings** - Identify FAIL and WARN items
3. **Plan remediation** - Discuss findings with the client and agree on standards
4. **Deploy standards** - Call `AddStandardsDeploy` with agreed configuration
5. **Verify** - Re-run `BestPracticeAnalyser` to confirm remediation
6. **Document** - Record the deployed baseline in your documentation system

### Ongoing Compliance Monitoring

For regular compliance checks:

1. **Run BPA across all tenants** - Call `BestPracticeAnalyser` without a tenant filter
2. **Identify non-compliant tenants** - Filter results for FAIL/WARN states
3. **Investigate drift** - Determine if changes were intentional or unauthorized
4. **Remediate** - Re-deploy standards or investigate the root cause
5. **Report** - Generate compliance reports for clients

### Cross-Tenant Compliance Matrix

To build a compliance matrix:

1. Run `BestPracticeAnalyser` for all tenants
2. Pivot results by check type to see which tenants pass/fail each check
3. Identify systemic issues (checks that fail across many tenants)
4. Prioritize remediation by impact and severity

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `Standards deployment failed` | Permission error or incompatible tenant configuration | Check CPV permissions and tenant license level |
| `BPA check failed` | Unable to query the required Graph API | Refresh CPV permissions |
| `Remediation blocked` | Conflicting policy or insufficient license | Check for CA policies that conflict with the standard |
| `Template not found` | Invalid BPA template name | List templates with `ListBPATemplates` |

### License Requirements

Some standards require specific M365 license tiers:

| Standard | Required License |
|----------|-----------------|
| Safe Attachments | Microsoft Defender for Office 365 Plan 1+ |
| Safe Links | Microsoft Defender for Office 365 Plan 1+ |
| Conditional Access | Azure AD Premium P1+ |
| Intune enrollment | Enterprise Mobility + Security E3+ |

Deploying standards to tenants without the required licenses will fail silently or produce errors.

## Best Practices

1. **Start with assessment** - Always run BPA before deploying standards to understand the current state
2. **Deploy incrementally** - Do not deploy all standards at once; start with identity, then email, then collaboration
3. **Enable remediation carefully** - Only enable `remediate: true` for standards you are confident should be enforced
4. **Monitor regularly** - Schedule BPA runs weekly or bi-weekly to catch drift
5. **Document exceptions** - If a tenant intentionally deviates from a standard, document the reason
6. **Check license requirements** - Verify tenants have the required licenses before deploying advanced standards
7. **Coordinate with clients** - Some standards (e.g., disabling external sharing) can disrupt workflows; notify clients first
8. **Use templates** - Create standardized BPA templates for different client tiers (basic, standard, premium)

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and error handling
- [Tenants](../tenants/SKILL.md) - Tenant identification and management
- [Security](../security/SKILL.md) - Security posture and Secure Score
- [Alerts](../alerts/SKILL.md) - Alert monitoring for compliance violations
