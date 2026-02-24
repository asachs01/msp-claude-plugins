---
description: >
  Use this skill when working with CIPP tenant management - listing tenants,
  viewing tenant details, refreshing the tenant cache, managing tenant
  exclusions, onboarding new tenants, and organizing tenant groups.
triggers:
  - cipp tenant
  - cipp customer
  - cipp client
  - cipp onboard
  - cipp exclude
  - cipp list tenants
  - cipp tenant details
  - cipp cache
  - cipp refresh
---

# CIPP Tenant Management

## Overview

CIPP manages multiple Microsoft 365 tenants through a delegated administration model. The Tenant Management domain provides endpoints for listing tenants, viewing details, controlling which tenants are managed, refreshing cached data, and managing tenant exclusions. Every other CIPP operation requires a valid `TenantFilter` parameter, making tenant management the foundation of all CIPP workflows.

## Key Concepts

### Tenant Identification

Tenants in CIPP are identified by their Microsoft 365 domain:

| Identifier | Example | Usage |
|-----------|---------|-------|
| Default domain | `contoso.onmicrosoft.com` | Most reliable identifier, always present |
| Custom domain | `contoso.com` | May also work as `TenantFilter` |
| Tenant ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Azure AD tenant GUID |
| Display name | `Contoso Ltd` | Human-readable, not used for API calls |

> **Always use the default domain** (`.onmicrosoft.com`) for API calls when possible. Custom domains may not resolve correctly in all endpoints.

### CPV (Control Panel Vendor) Permissions

CIPP uses Microsoft's CPV model for delegated access. Each tenant must have CPV permissions consented to allow CIPP to manage it. If permissions expire or are revoked, CIPP cannot access that tenant's data.

### Tenant Cache

CIPP caches tenant data (licenses, users, groups) to improve performance. The cache can become stale after changes are made outside CIPP (e.g., directly in the M365 admin center). Use cache refresh endpoints to force an update.

## Endpoints

### ListTenants

List all managed tenants.

```bash
curl -s "${CIPP_BASE_URL}/api/ListTenants" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `AllTenantSelector` | bool | No | Include the "All Tenants" meta-entry in results |

**Response:**

```json
[
  {
    "customerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "defaultDomainName": "contoso.onmicrosoft.com",
    "displayName": "Contoso Ltd",
    "domains": ["contoso.com", "contoso.onmicrosoft.com"],
    "initialDomainName": "contoso.onmicrosoft.com"
  },
  {
    "customerId": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
    "defaultDomainName": "fabrikam.onmicrosoft.com",
    "displayName": "Fabrikam Inc",
    "domains": ["fabrikam.com", "fabrikam.onmicrosoft.com"],
    "initialDomainName": "fabrikam.onmicrosoft.com"
  }
]
```

### ListTenant (Single Tenant Details)

Get detailed information for a specific tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListTenant?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain to query |

**Response includes:**
- Tenant display name and domains
- License summary (assigned vs. available)
- User count
- Admin accounts
- Domain verification status
- Partner relationship status

### ExecExcludeTenant

Exclude a tenant from CIPP management. Excluded tenants will not appear in dropdown selectors or be included in multi-tenant operations.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecExcludeTenant" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "ExcludeReason": "Client churned - contract ended 2026-02-01"
  }'
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain to exclude |
| `ExcludeReason` | string | No | Reason for exclusion (for audit trail) |

### ExecIncludeTenant

Re-include a previously excluded tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecIncludeTenant" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com"
  }'
```

### ExecCPVPermissions

Refresh CPV (Control Panel Vendor) permissions for a tenant. Use this when you encounter permission errors accessing a tenant's data.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecCPVPermissions" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com"
  }'
```

> **Note:** CPV refresh may require the tenant admin to re-consent. Check the response for consent URLs if applicable.

### ExecClearCache

Clear the CIPP tenant cache to force fresh data retrieval.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecClearCache" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

This clears cached data for all tenants. After clearing, the next API call for each tenant will fetch fresh data from Microsoft Graph, which may be slower than cached responses.

## Multi-Tenant Workflows

### Iterating Over All Tenants

When you need to perform an operation across all tenants:

1. Call `ListTenants` to get the full tenant list
2. Filter out any tenants that should be skipped
3. Iterate through each tenant, passing its `defaultDomainName` as the `TenantFilter`
4. Collect and aggregate results

```bash
# Step 1: Get all tenants
tenants=$(curl -s "${CIPP_BASE_URL}/api/ListTenants" \
  -H "x-api-key: ${CIPP_API_KEY}")

# Step 2: For each tenant, get user count
echo "$tenants" | jq -r '.[].defaultDomainName' | while read domain; do
  users=$(curl -s "${CIPP_BASE_URL}/api/ListUsers?TenantFilter=${domain}" \
    -H "x-api-key: ${CIPP_API_KEY}")
  count=$(echo "$users" | jq length)
  echo "${domain}: ${count} users"
  sleep 1  # Rate limit courtesy
done
```

> **IMPORTANT:** Add delays between tenant iterations to avoid hitting Microsoft Graph rate limits. A 1-second delay between calls is a reasonable starting point.

### Onboarding a New Tenant

The onboarding flow for a new M365 tenant in CIPP:

1. **Establish partner relationship** - The tenant admin must accept the partner relationship invite in the M365 admin center
2. **Refresh CPV permissions** - Call `ExecCPVPermissions` for the new tenant
3. **Verify access** - Call `ListTenant` with the new tenant's domain to confirm CIPP can access it
4. **Clear cache** - Call `ExecClearCache` to ensure the new tenant appears in cached lists
5. **Deploy standards** - Use `AddStandardsDeploy` to apply your baseline security configuration
6. **Verify standards** - Run `BestPracticeAnalyser` to check initial compliance

### Offboarding a Tenant

When a client churns:

1. **Document the offboarding** - Record the reason and date
2. **Remove deployed standards** - If applicable, remove any CIPP-managed policies
3. **Exclude the tenant** - Call `ExecExcludeTenant` with a clear reason
4. **Clear cache** - Call `ExecClearCache` to update the tenant list

## Error Handling

### Common Tenant Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `Could not find tenant` | Incorrect domain or tenant not in partner relationship | Verify domain via M365 admin center |
| `Failed to get token for tenant` | CPV permissions expired or revoked | Call `ExecCPVPermissions` |
| `Tenant is excluded` | Tenant was previously excluded | Call `ExecIncludeTenant` to re-enable |
| `Unable to resolve tenant` | Cache is stale or tenant domain changed | Call `ExecClearCache` then retry |
| `Access denied` | Insufficient delegated permissions | Check DAP/GDAP relationships in Partner Center |

### CPV Permission Refresh Failures

If `ExecCPVPermissions` fails:

1. Verify the partner relationship exists in Microsoft Partner Center
2. Check if GDAP (Granular Delegated Admin Privileges) is configured correctly
3. The tenant admin may need to re-consent via a consent URL provided in the error response
4. For DAP (Delegated Admin Privileges), ensure the relationship is still active

## Best Practices

1. **Cache the tenant list** - `ListTenants` results change infrequently; cache locally and refresh periodically
2. **Use default domains** - Always use `.onmicrosoft.com` domains for `TenantFilter` to avoid resolution issues
3. **Monitor CPV status** - Regularly check that CPV permissions are valid for all tenants
4. **Document exclusions** - Always provide an `ExcludeReason` when excluding tenants for audit purposes
5. **Batch operations carefully** - When iterating over tenants, add delays to respect rate limits
6. **Verify before acting** - Before any write operation, call `ListTenant` to confirm you have the right tenant
7. **Clear cache after external changes** - If changes are made in the M365 admin center directly, clear the CIPP cache

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication, base URL, and error handling
- [Users](../users/SKILL.md) - User management within tenants
- [Standards](../standards/SKILL.md) - Deploy security standards to tenants
- [Security](../security/SKILL.md) - Security posture per tenant
- [Alerts](../alerts/SKILL.md) - Alerts across tenants
