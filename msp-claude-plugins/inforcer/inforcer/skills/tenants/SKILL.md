---
description: >
  Use this skill when working with Inforcer tenant management - listing
  managed M365 tenants, tenant details, tags and grouping, onboarding
  status, tenant health, compliance status, and multi-tenant bulk
  operations.
triggers:
  - inforcer tenant
  - inforcer customer
  - inforcer client
  - inforcer onboard
  - inforcer tag
  - inforcer group
  - inforcer list tenants
  - inforcer tenant details
---

# Inforcer Tenant Management

## Overview

Inforcer manages Microsoft 365 tenants on behalf of MSP partners. Each tenant represents a customer's M365 environment that Inforcer monitors and secures. Tenants are the fundamental unit of organization -- all baselines, policies, drift detection, and reporting are scoped to individual tenants.

Tenants can be organized using tags (arbitrary labels) and groups (named collections) to support tiered service models, regional segmentation, or contract-based grouping.

## Tenant Listing

### List All Tenants

Retrieve all managed tenants with their current status:

```bash
GET /v1/tenants
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tag` | string | Filter by tag name |
| `group` | string | Filter by group ID |
| `status` | string | Filter by onboarding status (`active`, `onboarding`, `suspended`, `disconnected`) |
| `sort` | string | Sort field (`name`, `complianceScore`, `lastSync`, `createdAt`) |
| `order` | string | Sort order (`asc`, `desc`) |
| `limit` | integer | Results per page (default 50, max 200) |
| `cursor` | string | Pagination cursor |

**Example Response:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Contoso Ltd",
      "tenantDomain": "contoso.onmicrosoft.com",
      "primaryDomain": "contoso.com",
      "status": "active",
      "complianceScore": 87,
      "driftCount": 2,
      "lastSync": "2026-02-24T08:00:00Z",
      "tags": ["gold-tier", "healthcare"],
      "groups": [
        { "id": "group-001", "name": "Gold Tier" }
      ],
      "baselineId": "baseline-cis-v1",
      "licenseCount": 250,
      "createdAt": "2025-06-15T10:00:00Z"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true,
    "limit": 50,
    "total": 134
  }
}
```

### Get Tenant Details

Retrieve detailed information for a specific tenant:

```bash
GET /v1/tenants/{tenantId}
```

**Response includes:**

- Tenant metadata (name, domain, license count)
- Assigned baseline and its version
- Current compliance score
- Active drift event count
- Policy deployment summary (total policies, compliant, drifted)
- Last sync timestamp
- Tags and group memberships
- Onboarding history

### Tenant Compliance Status

Get a detailed compliance breakdown for a tenant:

```bash
GET /v1/tenants/{tenantId}/status
```

**Response:**

```json
{
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "tenantName": "Contoso Ltd",
  "overallScore": 87,
  "categories": {
    "entraId": { "score": 92, "totalPolicies": 15, "compliant": 14, "drifted": 1 },
    "intune": { "score": 85, "totalPolicies": 20, "compliant": 17, "drifted": 3 },
    "defender": { "score": 90, "totalPolicies": 10, "compliant": 9, "drifted": 1 },
    "exchange": { "score": 80, "totalPolicies": 12, "compliant": 10, "drifted": 2 },
    "sharepoint": { "score": 88, "totalPolicies": 8, "compliant": 7, "drifted": 1 }
  },
  "lastSync": "2026-02-24T08:00:00Z",
  "baselineVersion": "cis-v1.2"
}
```

## Tags

Tags are arbitrary string labels attached to tenants. They support flexible, ad hoc categorization outside of formal groups.

### Add Tags

```bash
POST /v1/tenants/{tenantId}/tags
Content-Type: application/json

{
  "tags": ["gold-tier", "healthcare", "east-region"]
}
```

### Remove a Tag

```bash
DELETE /v1/tenants/{tenantId}/tags/healthcare
```

### Filter by Tag

```bash
GET /v1/tenants?tag=gold-tier
```

**Common Tag Patterns for MSPs:**

| Category | Example Tags | Purpose |
|----------|-------------|---------|
| Service tier | `gold-tier`, `silver-tier`, `basic` | Match tenants to SLA levels |
| Industry | `healthcare`, `finance`, `education` | Compliance framework selection |
| Region | `east-region`, `west-region`, `eu` | Geographic grouping |
| Contract | `annual`, `monthly`, `trial` | Billing and contract tracking |
| Risk | `high-risk`, `needs-review` | Flag tenants needing attention |

## Groups

Groups are named collections of tenants with metadata. Unlike tags, groups are first-class objects with their own IDs and can have policies, baselines, and reporting scoped to them.

### List Groups

```bash
GET /v1/tenant-groups
```

**Response:**

```json
{
  "data": [
    {
      "id": "group-001",
      "name": "Gold Tier",
      "description": "Premium service tier with full baseline enforcement",
      "tenantCount": 45,
      "averageComplianceScore": 91,
      "baselineId": "baseline-cis-full",
      "createdAt": "2025-01-10T12:00:00Z"
    }
  ]
}
```

### List Tenants in a Group

```bash
GET /v1/tenant-groups/{groupId}/tenants
```

Returns the same tenant objects as the main tenant listing endpoint, filtered to the group.

## Onboarding

Tenant onboarding status tracks the lifecycle of connecting a customer's M365 tenant to Inforcer.

### Status Values

| Status | Description |
|--------|-------------|
| `onboarding` | Tenant is being connected; initial sync in progress |
| `active` | Tenant is fully connected and actively monitored |
| `suspended` | Monitoring paused (e.g., contract hold, maintenance) |
| `disconnected` | Tenant has been disconnected from Inforcer |

### Onboarding Flow

1. **Partner initiates onboarding** - Provides the customer's tenant domain or M365 tenant ID
2. **Consent flow** - The customer (or partner with delegated admin) completes the M365 consent flow to grant Inforcer read/write access to the tenant
3. **Initial sync** - Inforcer performs a full discovery of the tenant's current M365 configuration (Entra ID, Intune, Defender, Exchange, SharePoint)
4. **Baseline assignment** - Partner assigns a security baseline to the tenant
5. **Active monitoring** - Inforcer begins continuous monitoring for drift from the assigned baseline

### Checking Onboarding Status

```bash
GET /v1/tenants?status=onboarding
```

### Tenant Health Indicators

Each active tenant includes health signals:

| Indicator | Description |
|-----------|-------------|
| `complianceScore` | 0-100 score based on policy compliance against assigned baseline |
| `driftCount` | Number of active (unresolved) drift events |
| `lastSync` | Timestamp of the most recent configuration sync |
| `licenseCount` | Number of M365 licenses in the tenant |

A tenant with `lastSync` older than 24 hours may indicate a connectivity issue. A `complianceScore` below 70 typically warrants investigation.

## Multi-Tenant Operations

### Bulk Tag Assignment

Apply tags to multiple tenants at once:

```bash
POST /v1/tenants/bulk/tags
Content-Type: application/json

{
  "tenantIds": ["id-1", "id-2", "id-3"],
  "tags": ["needs-review"]
}
```

### Bulk Baseline Assignment

Assign a baseline to all tenants in a group:

```bash
POST /v1/tenant-groups/{groupId}/baseline
Content-Type: application/json

{
  "baselineId": "baseline-cis-v1"
}
```

### Cross-Tenant Summary

Get an aggregate view across all tenants:

```bash
GET /v1/tenants/summary
```

**Response:**

```json
{
  "totalTenants": 134,
  "byStatus": {
    "active": 120,
    "onboarding": 8,
    "suspended": 4,
    "disconnected": 2
  },
  "averageComplianceScore": 84,
  "totalDriftEvents": 47,
  "tenantsWithDrift": 23,
  "totalLicenses": 15420
}
```

## Best Practices

1. **Use groups for service tiers** -- Assign baselines at the group level so all tenants in a tier get the same security posture
2. **Tag for ad hoc filtering** -- Use tags for temporary or cross-cutting categorizations that don't warrant a formal group
3. **Monitor onboarding tenants** -- Check `status=onboarding` regularly to ensure new tenants complete the consent flow
4. **Watch lastSync timestamps** -- A tenant that hasn't synced in over 24 hours may have a connectivity issue
5. **Review low compliance scores** -- Tenants below 70% compliance should be investigated and remediated promptly
6. **Use bulk operations** -- For large portfolios, use bulk endpoints to assign tags and baselines efficiently
7. **Scope reports by group** -- When generating client-facing reports, scope to the specific tenant or group

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication, pagination, and error handling
- [Baselines](../baselines/SKILL.md) - Assign baselines to tenants and groups
- [Drift Detection](../drift-detection/SKILL.md) - Monitor drift events per tenant
- [Reporting](../reporting/SKILL.md) - Generate per-tenant and aggregate reports
