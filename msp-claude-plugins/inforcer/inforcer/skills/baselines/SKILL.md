---
description: >
  Use this skill when working with Inforcer security baselines - creating
  baselines, deploying baselines to tenants, aligning to CIS/NIST/ISO 27001
  frameworks, comparing baselines to tenant configurations, managing
  baseline templates, and versioning.
triggers:
  - inforcer baseline
  - inforcer template
  - inforcer cis
  - inforcer nist
  - inforcer iso
  - inforcer standard
  - inforcer compare
  - inforcer framework
  - inforcer benchmark
---

# Inforcer Baselines

## Overview

Baselines in Inforcer define the desired security configuration state for an M365 tenant. A baseline is a collection of policies across Entra ID, Intune, Defender, Exchange, and SharePoint that together represent a security posture target. Tenants are assigned baselines, and Inforcer continuously monitors for drift from the baseline configuration.

Baselines can be aligned to industry frameworks (CIS Microsoft 365 Foundations Benchmark, NIST 800-171, ISO 27001) or custom-built by the MSP to match their own security standards.

## Baseline Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Framework-aligned** | Pre-built baselines mapped to CIS, NIST, or ISO 27001 controls | Compliance-driven customers in regulated industries |
| **MSP Standard** | Custom baselines reflecting the MSP's default security posture | Default deployment for all new tenants |
| **Customer-specific** | Tailored baselines for individual customers with unique requirements | Customers with specific security or operational needs |
| **Template** | Reusable baseline templates that can be cloned and customized | Starting point for new baselines |

## Framework Alignment

### CIS Microsoft 365 Foundations Benchmark

The CIS benchmark provides prescriptive security configuration guidance for M365:

```bash
GET /v1/baselines?framework=cis
```

CIS levels:
- **Level 1** -- Essential security settings suitable for all environments
- **Level 2** -- Enhanced security settings for high-security environments (may affect usability)

Inforcer maps each baseline policy to the corresponding CIS control ID (e.g., `CIS 1.1.1 - Ensure multifactor authentication is enabled for all users in administrative roles`).

### NIST 800-171

For organizations handling Controlled Unclassified Information (CUI):

```bash
GET /v1/baselines?framework=nist
```

NIST 800-171 families covered:
- Access Control (AC)
- Identification and Authentication (IA)
- System and Communications Protection (SC)
- Audit and Accountability (AU)
- Configuration Management (CM)

### ISO 27001

For organizations pursuing or maintaining ISO 27001 certification:

```bash
GET /v1/baselines?framework=iso27001
```

ISO 27001 Annex A controls mapped across all policy categories.

## Creating Baselines

### From a Framework Template

```bash
POST /v1/baselines
Content-Type: application/json

{
  "name": "CIS Level 1 - Standard",
  "description": "CIS Microsoft 365 Foundations Benchmark Level 1",
  "framework": "cis",
  "level": "1",
  "policyOverrides": [
    {
      "policyId": "entra-mfa-admins",
      "enabled": true,
      "settings": {
        "requireMfa": true,
        "excludeEmergencyAccounts": true
      }
    }
  ]
}
```

The `policyOverrides` field allows you to customize specific policies from the framework template while inheriting all other defaults.

### Custom Baseline

```bash
POST /v1/baselines
Content-Type: application/json

{
  "name": "Acme MSP Gold Standard",
  "description": "Default security baseline for Gold tier customers",
  "policies": [
    {
      "type": "conditional-access",
      "name": "Require MFA for all users",
      "settings": { "requireMfa": true, "scope": "allUsers" }
    },
    {
      "type": "intune-compliance",
      "name": "Require device encryption",
      "settings": { "requireEncryption": true, "platform": "windows" }
    }
  ]
}
```

### Clone an Existing Baseline

```bash
POST /v1/baselines/{baselineId}/clone
Content-Type: application/json

{
  "name": "CIS Level 1 - Healthcare Variant",
  "description": "CIS L1 with additional HIPAA-aligned policies"
}
```

## Listing Baselines

```bash
GET /v1/baselines
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `framework` | string | Filter by framework (`cis`, `nist`, `iso27001`, `custom`) |
| `sort` | string | Sort field (`name`, `createdAt`, `updatedAt`) |
| `order` | string | Sort order (`asc`, `desc`) |

**Response:**

```json
{
  "data": [
    {
      "id": "baseline-cis-v1",
      "name": "CIS Level 1 - Standard",
      "description": "CIS Microsoft 365 Foundations Benchmark Level 1",
      "framework": "cis",
      "level": "1",
      "version": "1.2",
      "policyCount": 65,
      "assignedTenants": 45,
      "createdAt": "2025-06-01T10:00:00Z",
      "updatedAt": "2026-01-15T14:30:00Z"
    }
  ]
}
```

## Baseline Policies

List all policies within a baseline:

```bash
GET /v1/baselines/{baselineId}/policies
```

**Response:**

```json
{
  "data": [
    {
      "id": "policy-mfa-admins",
      "name": "Require MFA for admin roles",
      "type": "conditional-access",
      "category": "entraId",
      "frameworkControl": "CIS 1.1.1",
      "severity": "critical",
      "settings": {
        "requireMfa": true,
        "scope": "adminRoles",
        "excludeEmergencyAccounts": true
      }
    }
  ]
}
```

**Policy Categories:**

| Category | Policy Types |
|----------|-------------|
| `entraId` | Conditional access, MFA, authentication methods, security defaults |
| `intune` | Device compliance, configuration profiles, app protection |
| `defender` | Threat policies, anti-malware, safe attachments, safe links |
| `exchange` | Transport rules, anti-spam, DKIM/DMARC, audit logging |
| `sharepoint` | Sharing settings, access control, site policies |

## Deploying Baselines

### Deploy to a Single Tenant

```bash
POST /v1/baselines/{baselineId}/deploy
Content-Type: application/json

{
  "tenantIds": ["550e8400-e29b-41d4-a716-446655440000"],
  "mode": "enforce"
}
```

**Deployment Modes:**

| Mode | Description |
|------|-------------|
| `audit` | Compare baseline to tenant config and report differences without making changes |
| `enforce` | Apply baseline policies to the tenant, overwriting conflicting settings |
| `supplement` | Apply only policies that don't exist in the tenant; don't modify existing ones |

### Deploy to a Group

```bash
POST /v1/baselines/{baselineId}/deploy
Content-Type: application/json

{
  "groupId": "group-001",
  "mode": "enforce"
}
```

### Check Deployment Status

Deployments are asynchronous. Check status:

```bash
GET /v1/deployments/{deploymentId}
```

**Deployment Statuses:**

| Status | Description |
|--------|-------------|
| `pending` | Deployment queued |
| `in-progress` | Policies being applied to tenant(s) |
| `completed` | All policies applied successfully |
| `partial` | Some policies applied, some failed |
| `failed` | Deployment failed entirely |

## Comparing Baselines to Tenant Config

Compare a tenant's current configuration against a baseline to identify gaps:

```bash
GET /v1/baselines/{baselineId}/compare/{tenantId}
```

**Response:**

```json
{
  "baselineId": "baseline-cis-v1",
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "tenantName": "Contoso Ltd",
  "overallCompliance": 87,
  "totalPolicies": 65,
  "compliant": 57,
  "nonCompliant": 6,
  "notApplicable": 2,
  "differences": [
    {
      "policyId": "policy-mfa-all-users",
      "policyName": "Require MFA for all users",
      "category": "entraId",
      "frameworkControl": "CIS 1.1.3",
      "severity": "critical",
      "baseline": { "requireMfa": true, "scope": "allUsers" },
      "current": { "requireMfa": true, "scope": "adminRolesOnly" },
      "status": "non-compliant",
      "description": "MFA is only enforced for admin roles; baseline requires all users"
    }
  ]
}
```

## Versioning

Baselines support versioning to track changes over time:

- Each update to a baseline creates a new version
- Version history is preserved for audit purposes
- Tenants can be pinned to a specific version or set to follow the latest
- Framework-aligned baselines are updated when new benchmark versions are released

```bash
# Get baseline version history
GET /v1/baselines/{baselineId}/versions

# Get a specific version
GET /v1/baselines/{baselineId}/versions/{versionId}
```

## Best Practices

1. **Start with framework baselines** -- Use CIS Level 1 as a starting point and customize from there
2. **Test before broad deployment** -- Deploy in `audit` mode first to see what would change, then switch to `enforce`
3. **Use groups for baseline assignment** -- Assign baselines at the group level for consistent management
4. **Version your customizations** -- When modifying a framework baseline, clone it first so you can track your changes
5. **Review framework updates** -- When CIS/NIST releases new versions, compare against your baselines
6. **Document overrides** -- When deviating from a framework, document the business justification in the baseline description
7. **Use severity ratings** -- Prioritize remediation of `critical` and `high` severity non-compliant policies
8. **Separate baselines by tier** -- Gold, Silver, and Basic tiers should have distinct baselines matching their SLA
9. **Monitor deployment status** -- Always check that deployments complete successfully, especially for large groups
10. **Use supplement mode for onboarding** -- When onboarding a new tenant, use `supplement` mode first to avoid disrupting existing policies

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and API conventions
- [Tenants](../tenants/SKILL.md) - Assign baselines to tenants and groups
- [Policies](../policies/SKILL.md) - Individual policy management within baselines
- [Drift Detection](../drift-detection/SKILL.md) - Monitor drift from deployed baselines
- [Reporting](../reporting/SKILL.md) - Compliance reporting against baselines
