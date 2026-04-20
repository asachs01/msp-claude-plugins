---
description: >
  Use this skill when working with Inforcer policy deployment and management -
  Entra ID conditional access, Intune compliance and configuration profiles,
  Defender threat policies, Exchange transport rules, SharePoint access
  controls, deployment workflow, rollback, and status tracking.
triggers:
  - inforcer policy
  - inforcer entra
  - inforcer intune
  - inforcer defender
  - inforcer exchange
  - inforcer sharepoint
  - inforcer conditional access
  - inforcer deploy
  - inforcer configure
---

# Inforcer Policy Management

## Overview

Inforcer manages security policies across the full Microsoft 365 stack. Policies are the individual configuration settings that make up a baseline. They can be deployed individually or as part of a baseline, monitored for drift, and rolled back if needed.

Each policy targets a specific M365 service (Entra ID, Intune, Defender, Exchange, or SharePoint) and defines the desired configuration state for that service within a tenant.

## Policy Types

### Entra ID Policies

Entra ID (formerly Azure AD) policies cover identity and access management:

| Policy Type | Description | Example |
|-------------|-------------|---------|
| Conditional Access | Access rules based on user, device, location, risk | Require MFA for all users |
| Authentication Methods | Allowed authentication factors | Enable FIDO2 and Microsoft Authenticator |
| Security Defaults | Basic security settings for the tenant | Enable security defaults |
| Password Policies | Password complexity and expiration rules | Require 14-character minimum password |
| Named Locations | Trusted IP ranges and countries | Define corporate office IPs as trusted |
| Session Controls | Token lifetime and sign-in frequency | Require re-authentication every 8 hours |

**Common Entra ID Policy Settings:**

```json
{
  "type": "conditional-access",
  "name": "Require MFA for all users",
  "settings": {
    "conditions": {
      "users": { "includeUsers": ["All"] },
      "applications": { "includeApplications": ["All"] },
      "locations": { "excludeLocations": ["trustedLocations"] }
    },
    "grantControls": {
      "operator": "OR",
      "builtInControls": ["mfa"]
    },
    "sessionControls": {
      "signInFrequency": { "value": 8, "type": "hours" }
    },
    "state": "enabled"
  }
}
```

### Intune Policies

Intune policies cover device management and compliance:

| Policy Type | Description | Example |
|-------------|-------------|---------|
| Compliance Policies | Device compliance rules | Require encryption and up-to-date OS |
| Configuration Profiles | Device configuration settings | Configure Windows Firewall, BitLocker |
| App Protection Policies | Mobile app data protection | Prevent copy/paste to unmanaged apps |
| Endpoint Security | Security-specific device policies | Configure antivirus and firewall settings |
| Update Rings | Windows Update management | Deploy patches within 7 days of release |

**Common Intune Policy Settings:**

```json
{
  "type": "intune-compliance",
  "name": "Windows device compliance",
  "settings": {
    "platform": "windows10",
    "rules": {
      "requireEncryption": true,
      "requireSecureBoot": true,
      "minimumOsVersion": "10.0.19045",
      "requireAntiVirus": true,
      "requireFirewall": true,
      "passwordRequired": true,
      "passwordMinLength": 12
    },
    "nonComplianceAction": "block",
    "gracePeriodHours": 72
  }
}
```

### Defender Policies

Microsoft Defender policies cover threat protection:

| Policy Type | Description | Example |
|-------------|-------------|---------|
| Anti-malware | Malware detection and response | Enable real-time protection |
| Safe Attachments | Email attachment scanning | Block malicious attachments |
| Safe Links | URL scanning and rewriting | Enable time-of-click URL verification |
| Anti-phishing | Phishing detection and impersonation protection | Enable impersonation detection |
| Anti-spam | Spam filtering rules | Configure spam filter thresholds |

### Exchange Policies

Exchange Online policies cover email security:

| Policy Type | Description | Example |
|-------------|-------------|---------|
| Transport Rules | Mail flow rules | Block auto-forwarding to external domains |
| DKIM | DomainKeys Identified Mail signing | Enable DKIM for all accepted domains |
| DMARC | Domain-based Message Authentication | Set DMARC policy to reject |
| Audit Logging | Mailbox audit configuration | Enable unified audit logging |
| Retention | Data retention policies | Retain email for 7 years |

### SharePoint Policies

SharePoint Online policies cover collaboration security:

| Policy Type | Description | Example |
|-------------|-------------|---------|
| Sharing Settings | External sharing controls | Limit sharing to authenticated guests |
| Access Control | Device and network access rules | Block unmanaged device access |
| Site Policies | Default site configuration | Disable anonymous sharing links |
| OneDrive Settings | OneDrive-specific controls | Require managed devices for sync |

## Listing Policies

```bash
GET /v1/policies
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by policy type (e.g., `conditional-access`, `intune-compliance`) |
| `category` | string | Filter by category (`entraId`, `intune`, `defender`, `exchange`, `sharepoint`) |
| `severity` | string | Filter by severity (`critical`, `high`, `medium`, `low`) |
| `tenantId` | string | List policies applied to a specific tenant |

### Policies Applied to a Tenant

```bash
GET /v1/tenants/{tenantId}/policies
```

Returns all policies currently deployed to the tenant, along with their compliance status.

## Deploying Policies

### Deploy Individual Policies

```bash
POST /v1/policies/deploy
Content-Type: application/json

{
  "policyIds": ["policy-mfa-all", "policy-block-forwarding"],
  "tenantIds": ["tenant-001", "tenant-002"],
  "mode": "enforce"
}
```

**Deployment Modes:**

| Mode | Description |
|------|-------------|
| `audit` | Report what would change without applying |
| `enforce` | Apply the policy, overwriting existing configuration |
| `supplement` | Apply only if the policy doesn't already exist in the tenant |

### Check Policy Deployment Status

```bash
GET /v1/policies/{policyId}/status?tenantId={tenantId}
```

**Response:**

```json
{
  "policyId": "policy-mfa-all",
  "tenantId": "tenant-001",
  "status": "deployed",
  "deployedAt": "2026-02-24T09:00:00Z",
  "lastVerified": "2026-02-24T14:00:00Z",
  "compliant": true,
  "driftDetected": false
}
```

**Status Values:**

| Status | Description |
|--------|-------------|
| `pending` | Deployment queued |
| `deploying` | Currently being applied |
| `deployed` | Successfully applied and verified |
| `failed` | Deployment failed (check error details) |
| `rolled-back` | Policy was rolled back to previous state |

## Rollback

If a policy deployment causes issues, roll it back:

```bash
POST /v1/policies/{policyId}/rollback
Content-Type: application/json

{
  "tenantIds": ["tenant-001"],
  "reason": "Policy caused MFA prompt loops for legacy mail clients"
}
```

Rollback restores the tenant's previous configuration for that specific policy. Inforcer stores the pre-deployment state to enable safe rollback.

> **NOTE:** Rollback is only available for policies deployed through Inforcer. Policies created directly in the M365 admin portal cannot be rolled back by Inforcer.

## Policy Severity

Each policy has an assigned severity that indicates its importance to the overall security posture:

| Severity | Description | Example |
|----------|-------------|---------|
| `critical` | Must be enforced; non-compliance creates immediate risk | MFA for admin roles |
| `high` | Strongly recommended; significant security impact | Block legacy authentication |
| `medium` | Important but lower risk if missing | Configure session timeout |
| `low` | Nice to have; minimal security impact | Custom branding on sign-in page |

## Common Policy Deployment Workflows

### New Tenant Onboarding

1. Assign a baseline to the tenant
2. Run baseline comparison in `audit` mode to see current gaps
3. Review the differences and identify any policies that may cause disruption
4. Deploy the baseline in `supplement` mode first (add missing policies without changing existing ones)
5. Review results and then deploy remaining policies in `enforce` mode
6. Verify compliance status after deployment

### Policy Update Rollout

1. Update the policy definition in the baseline
2. Deploy in `audit` mode to a test tenant to see impact
3. Deploy in `enforce` mode to the test tenant
4. Monitor for issues for 24-48 hours
5. Deploy to the full group in `enforce` mode
6. Monitor drift detection for any unexpected changes

### Emergency Rollback

1. Identify the problematic policy from drift alerts or user reports
2. Roll back the specific policy on affected tenants
3. Investigate the root cause
4. Fix the policy definition
5. Re-deploy after testing

## Best Practices

1. **Always audit before enforcing** -- Use `audit` mode to understand the impact before making changes
2. **Deploy to a test tenant first** -- Validate policy changes on a non-production tenant before rolling out broadly
3. **Use supplement mode for onboarding** -- Avoid overwriting customer configurations without review
4. **Monitor after deployment** -- Check drift detection for 24-48 hours after any policy change
5. **Document rollback procedures** -- Know which policies to roll back and in what order if issues arise
6. **Group related policies** -- Deploy related policies together (e.g., all Entra ID conditional access policies)
7. **Stagger large deployments** -- When deploying to many tenants, stagger the rollout over hours or days
8. **Review policy severity** -- Focus remediation efforts on `critical` and `high` severity policies first
9. **Communicate changes to customers** -- Notify customers before deploying policies that affect their user experience (e.g., MFA enforcement)
10. **Keep baselines as source of truth** -- Always deploy from baselines rather than ad hoc policy changes

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and API conventions
- [Baselines](../baselines/SKILL.md) - Baselines that contain policy collections
- [Tenants](../tenants/SKILL.md) - Tenants where policies are deployed
- [Drift Detection](../drift-detection/SKILL.md) - Monitoring deployed policies for drift
- [Reporting](../reporting/SKILL.md) - Policy compliance reporting
