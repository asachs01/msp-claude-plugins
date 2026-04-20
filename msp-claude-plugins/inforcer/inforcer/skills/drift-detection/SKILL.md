---
description: >
  Use this skill when working with Inforcer drift detection - policy drift
  monitoring, drift alerts, automated remediation, drift history, tenant
  compliance status tracking, and integration with baselines.
triggers:
  - inforcer drift
  - inforcer change
  - inforcer deviation
  - inforcer remediate
  - inforcer monitor
  - inforcer compliance
  - inforcer alert
  - inforcer restore
---

# Inforcer Drift Detection

## Overview

Drift detection is Inforcer's continuous monitoring capability that identifies when a tenant's actual M365 configuration deviates from its assigned baseline. When a policy setting is changed (either manually in the M365 admin portal, by a script, or by Microsoft itself), Inforcer detects the change and creates a drift event.

Drift events can be handled in three ways:
1. **Alert only** -- Notify the MSP and wait for manual review
2. **Auto-remediate** -- Automatically restore the baseline configuration
3. **Acknowledge** -- Accept the change as intentional and update the baseline

## How Drift Detection Works

1. **Baseline assignment** -- A tenant is assigned a baseline that defines the desired state
2. **Continuous sync** -- Inforcer periodically reads the tenant's actual M365 configuration
3. **Comparison** -- Each sync compares the actual state against the baseline
4. **Drift event creation** -- Any difference creates a drift event with details about what changed
5. **Action** -- The drift event is handled based on the configured response (alert, auto-remediate, or manual review)

### Sync Frequency

Inforcer syncs tenant configurations on a regular schedule. The exact frequency depends on the policy category:

| Category | Typical Sync Interval |
|----------|----------------------|
| Entra ID (Conditional Access) | Every 15 minutes |
| Intune (Compliance, Configuration) | Every 30 minutes |
| Defender (Threat Policies) | Every 30 minutes |
| Exchange (Transport Rules, DKIM) | Every 60 minutes |
| SharePoint (Sharing, Access) | Every 60 minutes |

## Listing Drift Events

### All Drift Events

```bash
GET /v1/drift
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenantId` | string | Filter to a specific tenant |
| `severity` | string | Filter by severity (`critical`, `high`, `medium`, `low`) |
| `status` | string | Filter by status (`open`, `remediated`, `acknowledged`, `auto-remediated`) |
| `category` | string | Filter by category (`entraId`, `intune`, `defender`, `exchange`, `sharepoint`) |
| `since` | string | ISO 8601 timestamp for events after this time |
| `sort` | string | Sort field (`detectedAt`, `severity`, `category`) |
| `order` | string | Sort order (`asc`, `desc`) |

**Response:**

```json
{
  "data": [
    {
      "id": "drift-001",
      "tenantId": "550e8400-e29b-41d4-a716-446655440000",
      "tenantName": "Contoso Ltd",
      "policyId": "policy-mfa-all-users",
      "policyName": "Require MFA for all users",
      "category": "entraId",
      "severity": "critical",
      "status": "open",
      "detectedAt": "2026-02-24T10:30:00Z",
      "baselineValue": { "scope": "allUsers", "state": "enabled" },
      "currentValue": { "scope": "allUsers", "state": "disabled" },
      "changeDescription": "Conditional access policy 'Require MFA for all users' was disabled",
      "changedBy": "admin@contoso.com",
      "changeSource": "Azure Portal"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6MjB9",
    "hasMore": true,
    "limit": 50,
    "total": 47
  }
}
```

### Drift Events for a Tenant

```bash
GET /v1/tenants/{tenantId}/drift
```

### Drift Summary

Get an aggregate view of drift across all tenants:

```bash
GET /v1/drift/summary
```

**Response:**

```json
{
  "totalDriftEvents": 47,
  "bySeverity": {
    "critical": 3,
    "high": 12,
    "medium": 22,
    "low": 10
  },
  "byStatus": {
    "open": 23,
    "remediated": 15,
    "acknowledged": 5,
    "auto-remediated": 4
  },
  "byCategory": {
    "entraId": 8,
    "intune": 15,
    "defender": 7,
    "exchange": 10,
    "sharepoint": 7
  },
  "tenantsWithDrift": 23,
  "tenantsClean": 111,
  "mostAffectedTenants": [
    { "tenantId": "tenant-042", "tenantName": "Fabrikam Inc", "driftCount": 8 },
    { "tenantId": "tenant-017", "tenantName": "Woodgrove Bank", "driftCount": 6 }
  ]
}
```

## Drift Event Details

Get full details for a specific drift event:

```bash
GET /v1/drift/{driftId}
```

The detail response includes:
- The exact baseline value and the current (drifted) value
- Who made the change (if available from the M365 audit log)
- When the change was detected
- The source of the change (Azure Portal, PowerShell, Graph API, Microsoft system change)
- Historical drift events for the same policy on the same tenant

## Drift Severity

Drift severity is determined by the underlying policy severity:

| Severity | Meaning | Typical Response Time |
|----------|---------|----------------------|
| `critical` | Core security control disabled or weakened | Immediate (auto-remediate recommended) |
| `high` | Important security setting changed | Within 4 hours |
| `medium` | Moderate security impact | Within 24 hours |
| `low` | Minimal security impact | Next review cycle |

## Remediation

### Manual Remediation

Restore a drifted policy to the baseline state:

```bash
POST /v1/drift/{driftId}/remediate
Content-Type: application/json

{
  "action": "restore",
  "note": "Restoring MFA policy - change was unauthorized"
}
```

### Acknowledge (Accept the Change)

If the drift is intentional, acknowledge it to clear the alert:

```bash
POST /v1/drift/{driftId}/remediate
Content-Type: application/json

{
  "action": "acknowledge",
  "note": "Customer requested MFA exclusion for service account",
  "updateBaseline": false
}
```

Set `updateBaseline: true` to also update the baseline to reflect the new desired state.

### Auto-Remediation Configuration

Configure automatic remediation for specific policy categories or severity levels:

```bash
PUT /v1/tenants/{tenantId}/drift-settings
Content-Type: application/json

{
  "autoRemediate": {
    "enabled": true,
    "rules": [
      {
        "category": "entraId",
        "severity": ["critical", "high"],
        "action": "restore",
        "notifyOnRemediation": true
      },
      {
        "category": "intune",
        "severity": ["critical"],
        "action": "restore",
        "notifyOnRemediation": true
      }
    ],
    "excludePolicies": ["policy-custom-branding"]
  }
}
```

**Auto-Remediation Settings:**

| Field | Description |
|-------|-------------|
| `enabled` | Master toggle for auto-remediation on this tenant |
| `rules` | Array of rules specifying which drift events to auto-remediate |
| `category` | Policy category to match |
| `severity` | Array of severity levels to match |
| `action` | Action to take (`restore` to revert to baseline) |
| `notifyOnRemediation` | Send notification when auto-remediation occurs |
| `excludePolicies` | Policy IDs to exclude from auto-remediation |

> **CAUTION:** Auto-remediation is powerful but can cause conflicts if a customer is actively making intentional changes. Start with `critical` severity only and expand as confidence grows.

## Drift Alerts

Drift events generate alerts that can be configured per tenant or globally:

### Alert Channels

| Channel | Description |
|---------|-------------|
| Inforcer Portal | Dashboard notifications (always enabled) |
| Email | Email alerts to configured recipients |
| Webhook | HTTP POST to a custom endpoint (e.g., PSA ticket creation) |
| Microsoft Teams | Teams channel notifications |

### Configuring Alerts

```bash
PUT /v1/tenants/{tenantId}/alert-settings
Content-Type: application/json

{
  "channels": {
    "email": {
      "enabled": true,
      "recipients": ["noc@acmemsp.com"],
      "severityFilter": ["critical", "high"]
    },
    "webhook": {
      "enabled": true,
      "url": "https://acmemsp.example.com/webhooks/inforcer",
      "severityFilter": ["critical", "high", "medium"]
    },
    "teams": {
      "enabled": true,
      "webhookUrl": "https://outlook.office.com/webhook/...",
      "severityFilter": ["critical"]
    }
  }
}
```

## Drift History

View the history of drift events for a specific tenant and policy:

```bash
GET /v1/drift?tenantId={tenantId}&policyId={policyId}&sort=detectedAt&order=desc
```

This is useful for identifying recurring drift patterns -- for example, if a customer keeps disabling a policy that the MSP restores.

### Recurring Drift Patterns

If a policy drifts repeatedly on the same tenant:

1. Check who is making the change (from the `changedBy` field)
2. Determine if the change is intentional (customer needs differ from baseline)
3. Either educate the customer on the security implications or create a customer-specific baseline variant
4. Document the decision in the drift acknowledgment note

## Integration with Baselines

Drift detection is directly tied to baseline assignment:

- Drift is only detected for policies that are part of the tenant's assigned baseline
- Changing a tenant's baseline resets all drift events (the "desired state" changes)
- Updating a baseline policy definition may create new drift events for tenants that don't match the updated definition

## Best Practices

1. **Enable auto-remediation for critical policies** -- MFA, conditional access, and device compliance should auto-remediate to prevent security gaps
2. **Start conservative with auto-remediation** -- Begin with `critical` severity only and expand after gaining confidence
3. **Review drift summaries daily** -- Check the drift summary endpoint as part of your daily NOC routine
4. **Investigate recurring drift** -- Repeated drift on the same tenant/policy indicates a process issue
5. **Use webhooks for PSA integration** -- Send drift alerts to your PSA to create tickets automatically
6. **Filter by severity for triage** -- Start with `critical` and `high` severity events; handle `medium` and `low` in batches
7. **Document acknowledgments** -- When accepting drift, always include a note explaining why
8. **Communicate with customers** -- If a customer is causing drift, work with them to align on the desired security posture
9. **Monitor auto-remediation** -- Even with auto-remediation enabled, review the auto-remediation log to ensure it's working correctly
10. **Track drift trends over time** -- Use reporting to identify tenants with consistently high drift, which may need baseline adjustments

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and API conventions
- [Baselines](../baselines/SKILL.md) - Baselines that define the desired state for drift comparison
- [Policies](../policies/SKILL.md) - Individual policy deployment and rollback
- [Tenants](../tenants/SKILL.md) - Tenant management and compliance status
- [Reporting](../reporting/SKILL.md) - Drift and compliance reporting
