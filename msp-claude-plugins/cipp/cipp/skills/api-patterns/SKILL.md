---
description: >
  Use this skill when working with the CIPP API - authentication via API key,
  base URL patterns, available endpoints, pagination, error handling, rate
  limits, and best practices. Covers all major CIPP API endpoints organized
  by domain (tenants, users, standards, security, alerts).
triggers:
  - cipp api
  - cipp authentication
  - cipp endpoint
  - cipp rate limit
  - cipp pagination
  - cipp error
  - cipp request
  - cipp key
  - cipp base url
  - cipp connection
---

# CIPP API Patterns

## Overview

CIPP (CyberDrain Improved Partner Portal) is an open-source M365 multi-tenant management platform built on Azure Functions. The API exposes Azure Function endpoints for managing Microsoft 365 tenants, users, security standards, and alerts. All endpoints are RESTful HTTP triggers that accept JSON payloads and return JSON responses.

CIPP is deployed as an Azure Static Web App with an Azure Functions backend. The API base URL depends on your deployment -- it is typically your CIPP instance URL followed by `/api/`.

## Authentication

### API Key Authentication

CIPP uses API key authentication. The key is generated within the CIPP admin interface.

**Obtaining an API Key:**

1. Log into your CIPP instance
2. Navigate to **Settings > Backend > API Authentication**
3. Generate a new API key
4. Copy and store the key securely

**Passing the API Key:**

The API key can be passed in two ways:

| Method | Header/Parameter | Example |
|--------|------------------|---------|
| Header | `x-api-key` | `x-api-key: your-api-key` |
| Query parameter | `key` | `?key=your-api-key` |

```bash
# Using header (recommended)
curl -s "https://your-cipp-instance.app/api/ListTenants" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Using query parameter
curl -s "https://your-cipp-instance.app/api/ListTenants?key=YOUR_API_KEY"
```

> **Best practice:** Always use the header method. Query parameters may appear in server logs and browser history.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `CIPP_BASE_URL` | Your CIPP instance URL (e.g., `https://your-cipp-instance.app`) |
| `CIPP_API_KEY` | API key from CIPP Settings > Backend > API Authentication |

```bash
export CIPP_BASE_URL="https://your-cipp-instance.app"
export CIPP_API_KEY="your-api-key"
```

## Base URL Structure

All CIPP API endpoints follow this pattern:

```
https://{your-cipp-instance}/api/{FunctionName}
```

Examples:
- `https://your-cipp-instance.app/api/ListTenants`
- `https://your-cipp-instance.app/api/ListUsers`
- `https://your-cipp-instance.app/api/ExecOffboardUser`

> **Note:** CIPP uses PascalCase function names (e.g., `ListTenants`, not `list-tenants`).

## Complete Endpoint Reference

### Tenant Management

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `ListTenants` | GET | List all managed tenants | `AllTenantSelector` (bool) |
| `ListTenant` | GET | Get details for a specific tenant | `TenantFilter` (domain) |
| `ExecExcludeTenant` | POST | Exclude a tenant from management | `TenantFilter`, `ExcludeReason` |
| `ExecIncludeTenant` | POST | Re-include an excluded tenant | `TenantFilter` |
| `ExecCPVPermissions` | POST | Refresh CPV permissions for a tenant | `TenantFilter` |
| `ExecClearCache` | GET | Clear the tenant cache | - |

### User Management

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `ListUsers` | GET | List users in a tenant | `TenantFilter` (required) |
| `ListUser` | GET | Get a specific user's details | `TenantFilter`, `UserId` |
| `AddUser` | POST | Create a new user | `TenantFilter`, user details JSON body |
| `EditUser` | POST | Edit an existing user | `TenantFilter`, `UserId`, updates JSON body |
| `ExecOffboardUser` | POST | Offboard a user | `TenantFilter`, `UserId`, offboard options |
| `ExecResetPassword` | POST | Reset a user's password | `TenantFilter`, `UserId` |
| `ExecRevokeSessions` | POST | Revoke all user sessions | `TenantFilter`, `UserId` |
| `ExecDisableUser` | POST | Disable a user account | `TenantFilter`, `UserId` |
| `ListUserMailboxRules` | GET | List mailbox rules for a user | `TenantFilter`, `UserId` |
| `ExecSetMailboxPermissions` | POST | Set mailbox permissions | `TenantFilter`, permissions JSON body |
| `ListLicenses` | GET | List available licenses in a tenant | `TenantFilter` |
| `ExecAssignLicense` | POST | Assign a license to a user | `TenantFilter`, `UserId`, `LicenseId` |

### Standards & Compliance

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `ListStandards` | GET | List configured standards | `TenantFilter` (optional) |
| `AddStandardsDeploy` | POST | Deploy standards to a tenant | `TenantFilter`, standards JSON body |
| `BestPracticeAnalyser` | GET | Run best practice analysis | `TenantFilter` (optional, all if omitted) |
| `ListBPATemplates` | GET | List BPA templates | - |

### Security

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `ListSecureScore` | GET | Get Secure Score for a tenant | `TenantFilter` |
| `ListConditionalAccessPolicies` | GET | List CA policies | `TenantFilter` |
| `ListMFAUsers` | GET | List users with MFA status | `TenantFilter` |
| `ListBasicAuth` | GET | List basic auth usage | `TenantFilter` |
| `ListInactiveAccounts` | GET | List inactive user accounts | `TenantFilter` |
| `ListSignIns` | GET | List recent sign-in logs | `TenantFilter`, `Filter` |

### Alerts & Logging

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `ListAlerts` | GET | List alerts | `TenantFilter` (optional) |
| `ListAuditLogs` | GET | Query audit logs | `TenantFilter`, `StartDate`, `EndDate`, `Type` |
| `ListMailboxStatistics` | GET | Get mailbox statistics | `TenantFilter` |
| `ListServiceHealth` | GET | Check M365 service health | `TenantFilter` |

### Groups & Teams

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `ListGroups` | GET | List groups in a tenant | `TenantFilter` |
| `ListTeams` | GET | List Teams in a tenant | `TenantFilter` |
| `AddGroup` | POST | Create a new group | `TenantFilter`, group details JSON body |

## Request Patterns

### GET Requests

Most read operations use GET with query parameters:

```bash
# List all users in a tenant
curl -s "${CIPP_BASE_URL}/api/ListUsers?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"

# Get a specific user
curl -s "${CIPP_BASE_URL}/api/ListUser?TenantFilter=contoso.onmicrosoft.com&UserId=user@contoso.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

### POST Requests

Write operations use POST with a JSON body:

```bash
# Offboard a user
curl -s "${CIPP_BASE_URL}/api/ExecOffboardUser" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserId": "jdoe@contoso.com",
    "ConvertToShared": true,
    "RevokeSessions": true,
    "DisableUser": true,
    "RemoveLicenses": true
  }'
```

### Tenant Filter

Nearly every endpoint requires a `TenantFilter` parameter to specify which M365 tenant to operate on. This is the tenant's default domain (e.g., `contoso.onmicrosoft.com`) or custom domain.

```bash
# Correct - using the onmicrosoft.com domain
?TenantFilter=contoso.onmicrosoft.com

# Also correct - using a custom domain
?TenantFilter=contoso.com
```

> **IMPORTANT:** Always obtain the correct tenant domain from the `ListTenants` endpoint first. Using an incorrect domain will result in errors or operating on the wrong tenant.

## Pagination

CIPP endpoints generally return all results in a single response. For endpoints that support pagination:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `$top` | Maximum results to return | Varies by endpoint |
| `$skip` | Number of results to skip | 0 |
| `$filter` | OData-style filter expression | - |

Most list endpoints return all results without pagination. For large datasets (e.g., `ListUsers` on a large tenant), expect the full result set in one response.

## Error Handling

### Common HTTP Status Codes

| Status | Meaning | Resolution |
|--------|---------|------------|
| 200 | Success | Request completed |
| 400 | Bad Request | Check required parameters |
| 401 | Unauthorized | Verify API key is correct |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | Check endpoint name (PascalCase) or tenant domain |
| 429 | Too Many Requests | Wait and retry (rate limited) |
| 500 | Internal Server Error | CIPP backend error -- check logs |
| 502 | Bad Gateway | Azure Function cold start or timeout |
| 504 | Gateway Timeout | Request took too long, narrow the scope |

### Common Error Patterns

**Invalid Tenant:**
```json
{
  "Results": "Error: Could not find tenant contoso.onmicrosoft.com"
}
```
Resolution: Verify the tenant domain using `ListTenants`.

**Missing Required Parameter:**
```json
{
  "Results": "Error: TenantFilter is required"
}
```
Resolution: Add the required `TenantFilter` query parameter.

**Graph API Error (pass-through):**
```json
{
  "Results": "Error: Request_BadRequest - Property 'userPrincipalName' is invalid."
}
```
Resolution: CIPP passes through Microsoft Graph errors. Check the Graph API documentation for the specific error.

**Token Expired / Permission Error:**
```json
{
  "Results": "Error: Failed to get token for tenant. Ensure CPV permissions are refreshed."
}
```
Resolution: Use `ExecCPVPermissions` to refresh the token for the affected tenant.

## Rate Limiting

CIPP rate limits depend on your deployment:

- **Azure Functions Consumption Plan**: Scales automatically but may hit Azure-level throttling
- **Azure Functions Premium Plan**: Higher throughput, dedicated instances
- **Microsoft Graph API**: CIPP proxies calls to Graph, which has its own rate limits (typically 10,000 requests per 10 minutes per app per tenant)

**Best practices:**
1. Space out requests when iterating over many tenants
2. Use specific tenant filters rather than querying all tenants
3. If you receive 429 errors, implement exponential backoff (start at 5 seconds)
4. Cache tenant list results -- they change infrequently
5. For bulk operations, use CIPP's built-in batch endpoints when available

## Best Practices

1. **Always verify the tenant domain first** -- Call `ListTenants` to get correct domain names before other operations
2. **Use the header for API keys** -- Avoid passing keys in query parameters
3. **Check CPV permissions** -- If a tenant returns permission errors, refresh with `ExecCPVPermissions`
4. **Monitor cold starts** -- Azure Functions may take 5-10 seconds on first call after inactivity
5. **Handle Graph errors** -- CIPP passes through Microsoft Graph API errors; check Graph documentation for resolution
6. **Cache where appropriate** -- Tenant lists, license catalogs, and standards templates change infrequently
7. **Use offboarding carefully** -- `ExecOffboardUser` performs destructive operations; always confirm before executing
8. **Scope operations to specific tenants** -- Avoid calling endpoints without `TenantFilter` unless you need cross-tenant data
9. **Check CIPP version** -- API endpoints vary between CIPP versions; ensure your skills match your deployment version
10. **Log all write operations** -- Keep an audit trail of user modifications, offboarding, and standards deployments

## Related Skills

- [Tenants](../tenants/SKILL.md) - Tenant listing, details, cache refresh, and onboarding
- [Users](../users/SKILL.md) - User management, offboarding, and license operations
- [Standards](../standards/SKILL.md) - Standards deployment and compliance monitoring
- [Security](../security/SKILL.md) - Secure Score, conditional access, and MFA status
- [Alerts](../alerts/SKILL.md) - Alert management and audit log queries
