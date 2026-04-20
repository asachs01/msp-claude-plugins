---
description: >
  Use this skill when working with CIPP security features - Secure Score
  retrieval, conditional access policy listing, MFA status per-tenant,
  password policy review, basic auth detection, inactive account review,
  sign-in log analysis, and security posture assessment.
triggers:
  - cipp security
  - cipp secure score
  - cipp conditional access
  - cipp mfa status
  - cipp password policy
  - cipp posture
  - cipp assessment
  - cipp risk
---

# CIPP Security Features

## Overview

CIPP provides a consolidated view of security posture across managed M365 tenants. This includes Microsoft Secure Score, conditional access policy management, MFA enrollment status, basic authentication detection, inactive account monitoring, and sign-in log analysis. These capabilities allow MSPs to assess, monitor, and improve security across their entire client base from a single pane of glass.

## Key Concepts

### Microsoft Secure Score

Secure Score is Microsoft's security posture measurement. It assigns points for security configurations and practices:

| Score Range | Assessment |
|-------------|------------|
| 80-100% | Excellent - Well-secured tenant |
| 60-79% | Good - Most basics covered, room for improvement |
| 40-59% | Fair - Significant gaps to address |
| 0-39% | Poor - Critical security improvements needed |

Secure Score is calculated based on controls like MFA adoption, conditional access policies, data loss prevention, and device compliance.

### Conditional Access Policies

Conditional access (CA) policies are Azure AD's primary access control mechanism. They evaluate signals (user, device, location, risk) to make access decisions (allow, block, require MFA). CIPP can list and review CA policies but typically does not create them directly (standards handle common CA scenarios).

### MFA Status Categories

| Status | Meaning |
|--------|---------|
| Enabled | MFA is turned on for the user |
| Enforced | MFA is required on every sign-in |
| Disabled | MFA is not configured |
| Registered | User has registered MFA methods but it may not be enforced |

## Endpoints

### ListSecureScore

Get the Secure Score for a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListSecureScore?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |

**Response:**

```json
{
  "Tenant": "contoso.onmicrosoft.com",
  "CurrentScore": 72,
  "MaxScore": 100,
  "Percentage": "72%",
  "ComparedToAverage": "+15%",
  "ComparedToSimilar": "+8%",
  "ControlScores": [
    {
      "controlName": "MFARegistrationV2",
      "score": 9,
      "maxScore": 10,
      "description": "Require MFA for all users"
    },
    {
      "controlName": "BlockLegacyAuthentication",
      "score": 8,
      "maxScore": 8,
      "description": "Block legacy authentication"
    },
    {
      "controlName": "AdminMFAV2",
      "score": 10,
      "maxScore": 10,
      "description": "Require MFA for admins"
    }
  ],
  "CreatedDateTime": "2026-02-24T06:00:00Z"
}
```

### ListConditionalAccessPolicies

List all conditional access policies in a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListConditionalAccessPolicies?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |

**Response:**

```json
[
  {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "displayName": "Require MFA for Admins",
    "state": "enabled",
    "conditions": {
      "users": {
        "includeRoles": ["62e90394-69f5-4237-9190-012177145e10"]
      },
      "applications": {
        "includeApplications": ["All"]
      }
    },
    "grantControls": {
      "builtInControls": ["mfa"]
    },
    "createdDateTime": "2025-06-15T10:00:00Z",
    "modifiedDateTime": "2026-01-20T14:30:00Z"
  },
  {
    "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
    "displayName": "Block Legacy Authentication",
    "state": "enabled",
    "conditions": {
      "users": {
        "includeUsers": ["All"]
      },
      "clientAppTypes": ["exchangeActiveSync", "other"]
    },
    "grantControls": {
      "builtInControls": ["block"]
    }
  }
]
```

**Policy States:**

| State | Meaning |
|-------|---------|
| `enabled` | Policy is active and enforcing |
| `disabled` | Policy exists but is not enforcing |
| `enabledForReportingButNotEnforced` | Report-only mode (audit without blocking) |

### ListMFAUsers

List all users with their MFA registration and enforcement status.

```bash
curl -s "${CIPP_BASE_URL}/api/ListMFAUsers?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |

**Response:**

```json
[
  {
    "userPrincipalName": "admin@contoso.com",
    "displayName": "Admin User",
    "MFARegistration": true,
    "MFAEnforced": true,
    "MFAMethods": ["microsoftAuthenticator", "phoneAppNotification"],
    "isAdmin": true,
    "accountEnabled": true
  },
  {
    "userPrincipalName": "jdoe@contoso.com",
    "displayName": "John Doe",
    "MFARegistration": false,
    "MFAEnforced": false,
    "MFAMethods": [],
    "isAdmin": false,
    "accountEnabled": true
  }
]
```

### ListBasicAuth

Detect users still using basic authentication protocols.

```bash
curl -s "${CIPP_BASE_URL}/api/ListBasicAuth?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Response:**

```json
[
  {
    "userPrincipalName": "scanner@contoso.com",
    "displayName": "Network Scanner",
    "protocol": "SMTP",
    "lastSignIn": "2026-02-23T22:15:00Z",
    "appDisplayName": "Xerox Scanner"
  }
]
```

> **Security risk:** Basic authentication transmits credentials in plain text and cannot use MFA. Any basic auth usage should be reviewed and migrated to modern auth or app passwords.

### ListInactiveAccounts

List user accounts that have not signed in recently.

```bash
curl -s "${CIPP_BASE_URL}/api/ListInactiveAccounts?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Response:**

```json
[
  {
    "userPrincipalName": "former.employee@contoso.com",
    "displayName": "Former Employee",
    "lastSignIn": "2025-08-15T10:00:00Z",
    "daysSinceLastSignIn": 193,
    "accountEnabled": true,
    "assignedLicenses": ["ENTERPRISEPACK"]
  }
]
```

> **Action:** Inactive accounts with active licenses are both a security risk (potential attack surface) and a cost waste. Review for offboarding.

### ListSignIns

Query recent sign-in logs for a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListSignIns?TenantFilter=contoso.onmicrosoft.com&Filter=status/errorCode eq 50126" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |
| `Filter` | string | No | OData filter expression |

**Common Filters:**

| Filter | Description |
|--------|-------------|
| `status/errorCode eq 0` | Successful sign-ins |
| `status/errorCode eq 50126` | Failed sign-ins (invalid password) |
| `status/errorCode eq 50076` | MFA required but not completed |
| `riskState eq 'atRisk'` | Risky sign-ins |
| `location/city eq 'Unknown'` | Sign-ins from unknown locations |

## Security Assessment Workflow

### Full Security Posture Review

To perform a comprehensive security assessment for a tenant:

1. **Get Secure Score** - Call `ListSecureScore` for the overall score and control breakdown
2. **Review CA policies** - Call `ListConditionalAccessPolicies` to audit access controls
3. **Check MFA status** - Call `ListMFAUsers` to identify users without MFA
4. **Detect basic auth** - Call `ListBasicAuth` to find legacy protocol usage
5. **Find inactive accounts** - Call `ListInactiveAccounts` to identify dormant accounts
6. **Review sign-ins** - Call `ListSignIns` to check for suspicious activity
7. **Compile report** - Aggregate findings into a security posture report

### Cross-Tenant Security Dashboard

For a portfolio-wide view:

1. Get the tenant list from `ListTenants`
2. For each tenant, call `ListSecureScore`
3. Sort tenants by Secure Score percentage
4. Flag tenants below your threshold (e.g., below 60%)
5. Prioritize remediation for the lowest-scoring tenants

### MFA Gap Analysis

To identify MFA gaps:

1. Call `ListMFAUsers` for the target tenant
2. Filter for `MFARegistration: false` AND `accountEnabled: true`
3. Separate admins from regular users (admins without MFA are critical)
4. Calculate MFA adoption percentage
5. Generate a report with users who need MFA enrollment

### Risky Sign-In Investigation

When investigating suspicious activity:

1. Call `ListSignIns` with `riskState eq 'atRisk'`
2. Review sign-in locations, IP addresses, and client apps
3. For confirmed compromises:
   - Call `ExecRevokeSessions` to force re-authentication
   - Call `ExecResetPassword` to invalidate the current password
   - Call `ExecDisableUser` if the account should be locked
4. Review mailbox rules for auto-forwarding (data exfiltration indicator)

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `Secure Score not available` | Tenant does not have Azure AD Premium | Secure Score requires AAD Premium P1+ |
| `Conditional Access not licensed` | Tenant lacks AAD Premium P1 | CA policies require AAD Premium P1+ |
| `Sign-in logs not available` | Tenant on basic M365 tier | Sign-in logs require AAD Premium P1+ |
| `MFA data incomplete` | Partial Graph API response | Retry; may be a transient error |
| `Permission denied` | Insufficient delegated permissions | Refresh CPV permissions with `ExecCPVPermissions` |

### License Requirements for Security Features

| Feature | Minimum License |
|---------|-----------------|
| Secure Score | Azure AD Premium P1 (included in Microsoft 365 Business Premium) |
| Conditional Access | Azure AD Premium P1 |
| Sign-in Logs (30 days) | Azure AD Premium P1 |
| Risk-based CA policies | Azure AD Premium P2 |
| Identity Protection | Azure AD Premium P2 |

## Best Practices

1. **Target 80%+ Secure Score** - Set a goal of 80%+ for all managed tenants
2. **Require MFA for all admins** - This is non-negotiable; admin MFA should be at 100%
3. **Block legacy auth** - Deploy a CA policy to block basic authentication protocols
4. **Monitor sign-in anomalies** - Regularly review sign-ins from unusual locations or risky states
5. **Audit inactive accounts monthly** - Disable and offboard accounts that have not signed in for 90+ days
6. **Use report-only mode** - Test new CA policies in report-only mode before enforcing
7. **Document security baselines** - Define what "secure" means for each client tier and document the CA policy set
8. **Review CA policy coverage** - Ensure CA policies cover all users, all apps, and all device types
9. **Track Secure Score trends** - Monitor score changes over time to detect security regression
10. **Cross-reference with standards** - Align security findings with CIPP standards for automated remediation

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and error handling
- [Tenants](../tenants/SKILL.md) - Tenant identification and management
- [Users](../users/SKILL.md) - User management and account lifecycle
- [Standards](../standards/SKILL.md) - Standards deployment for security remediation
- [Alerts](../alerts/SKILL.md) - Security alert monitoring
