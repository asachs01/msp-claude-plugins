---
description: >
  Use this skill when working with the Inforcer API - authentication via API
  key, base URL structure, available endpoints, pagination patterns, error
  codes, rate limiting, and best practices for M365 security policy
  management automation.
triggers:
  - inforcer api
  - inforcer authentication
  - inforcer endpoint
  - inforcer rate limit
  - inforcer pagination
  - inforcer error
  - inforcer request
  - inforcer key
  - inforcer connection
---

# Inforcer API Patterns

## Overview

Inforcer provides a REST API for managing Microsoft 365 security policies across multiple tenants. The API covers tenant management, security baselines, policy deployment, drift detection, and compliance reporting. All operations are scoped to the MSP's managed tenant portfolio.

The API follows standard REST conventions with JSON request/response bodies, Bearer token authentication, cursor-based pagination, and conventional HTTP status codes.

## Authentication

### API Key

All requests require an API key passed as a Bearer token in the `Authorization` header:

```bash
curl -s "https://api.inforcer.com/v1/tenants" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Obtaining an API Key:**

1. Log into the Inforcer Portal at `https://portal.inforcer.com`
2. Navigate to **Settings > API Access**
3. Click **Generate API Key**
4. Copy the key immediately -- it is shown only once

> **IMPORTANT:** Store the API key securely. If lost, you must revoke it and generate a new one. API keys inherit the permissions of the user who created them.

**Environment Variables:**

| Variable | Description |
|----------|-------------|
| `INFORCER_BASE_URL` | API base URL (default: `https://api.inforcer.com`) |
| `INFORCER_API_KEY` | API key from Inforcer Portal > Settings > API Access |

```bash
export INFORCER_BASE_URL="https://api.inforcer.com"
export INFORCER_API_KEY="your-api-key"
```

### Scoping

API keys are scoped to the MSP partner account. All tenants managed by the partner are accessible through a single API key. There is no per-tenant authentication -- the API key grants access to all tenants in the partner's portfolio.

## Base URL & Versioning

The API base URL is:

```
https://api.inforcer.com/v1
```

All endpoints are prefixed with `/v1`. The API version is included in the URL path to support future versioning without breaking changes.

## Core Endpoints

### Tenant Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/tenants` | List all managed tenants |
| `GET` | `/v1/tenants/{id}` | Get tenant details |
| `GET` | `/v1/tenants/{id}/status` | Get tenant compliance status |
| `POST` | `/v1/tenants/{id}/tags` | Add tags to a tenant |
| `DELETE` | `/v1/tenants/{id}/tags/{tag}` | Remove a tag from a tenant |
| `GET` | `/v1/tenant-groups` | List tenant groups |
| `GET` | `/v1/tenant-groups/{id}/tenants` | List tenants in a group |

### Baselines

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/baselines` | List all baselines |
| `GET` | `/v1/baselines/{id}` | Get baseline details |
| `POST` | `/v1/baselines` | Create a new baseline |
| `PUT` | `/v1/baselines/{id}` | Update a baseline |
| `GET` | `/v1/baselines/{id}/policies` | List policies in a baseline |
| `POST` | `/v1/baselines/{id}/deploy` | Deploy baseline to tenants |
| `GET` | `/v1/baselines/{id}/compare/{tenantId}` | Compare baseline to tenant config |

### Policies

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/policies` | List all policies |
| `GET` | `/v1/policies/{id}` | Get policy details |
| `POST` | `/v1/policies/deploy` | Deploy policies to tenants |
| `GET` | `/v1/policies/{id}/status` | Get policy deployment status |
| `GET` | `/v1/tenants/{id}/policies` | List policies applied to a tenant |

### Drift Detection

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/drift` | List drift events |
| `GET` | `/v1/drift/{id}` | Get drift event details |
| `GET` | `/v1/tenants/{id}/drift` | List drift events for a tenant |
| `POST` | `/v1/drift/{id}/remediate` | Remediate a drift event |
| `GET` | `/v1/drift/summary` | Get drift summary across tenants |

### Reporting

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/reports/compliance` | Generate compliance report |
| `GET` | `/v1/reports/secure-score` | Get Secure Score data |
| `GET` | `/v1/reports/copilot-readiness` | Get Copilot readiness assessment |
| `GET` | `/v1/reports/executive-summary` | Generate executive summary |
| `GET` | `/v1/reports/export` | Export report in PDF/CSV format |

## Pagination

The API uses cursor-based pagination for list endpoints. Each response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true,
    "limit": 50,
    "total": 234
  }
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Results per page (max 200) |
| `cursor` | string | null | Cursor from previous response for next page |

**Iterating through pages:**

```bash
# First page
curl -s "https://api.inforcer.com/v1/tenants?limit=50" \
  -H "Authorization: Bearer ${INFORCER_API_KEY}"

# Next page (use cursor from previous response)
curl -s "https://api.inforcer.com/v1/tenants?limit=50&cursor=eyJpZCI6MTAwfQ==" \
  -H "Authorization: Bearer ${INFORCER_API_KEY}"
```

Continue fetching pages until `pagination.hasMore` is `false`.

## Filtering & Sorting

Most list endpoints support filtering via query parameters:

```bash
# Filter tenants by tag
GET /v1/tenants?tag=gold-tier

# Filter drift events by severity
GET /v1/drift?severity=high

# Filter policies by type
GET /v1/policies?type=conditional-access

# Sort tenants by compliance score (ascending)
GET /v1/tenants?sort=complianceScore&order=asc
```

**Common Filter Parameters:**

| Parameter | Endpoints | Description |
|-----------|-----------|-------------|
| `tag` | tenants | Filter by tag name |
| `group` | tenants | Filter by group ID |
| `severity` | drift | Filter by severity (low, medium, high, critical) |
| `type` | policies | Filter by policy type |
| `status` | policies, drift | Filter by status |
| `tenantId` | drift, policies | Scope to a specific tenant |
| `framework` | baselines | Filter by framework (cis, nist, iso27001) |

**Sorting:**

| Parameter | Values |
|-----------|--------|
| `sort` | Field name (e.g., `name`, `complianceScore`, `lastSync`, `createdAt`) |
| `order` | `asc` or `desc` (default: `desc`) |

## Error Handling

### HTTP Status Codes

| Status | Meaning | Common Cause |
|--------|---------|--------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid parameters or request body |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | API key lacks permission for this operation |
| 404 | Not Found | Resource does not exist or tenant not managed |
| 409 | Conflict | Resource already exists or concurrent modification |
| 422 | Unprocessable Entity | Valid JSON but semantically invalid (e.g., invalid policy config) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error -- retry after a moment |
| 503 | Service Unavailable | Maintenance or temporary outage |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The 'tenantId' parameter must be a valid UUID",
    "details": {
      "parameter": "tenantId",
      "value": "not-a-uuid"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | API key is missing, expired, or revoked |
| `INSUFFICIENT_PERMISSIONS` | API key does not have access to this resource |
| `INVALID_PARAMETER` | A query or body parameter is invalid |
| `RESOURCE_NOT_FOUND` | The requested resource does not exist |
| `TENANT_NOT_MANAGED` | The tenant is not in the partner's managed portfolio |
| `BASELINE_CONFLICT` | A baseline with this name already exists |
| `DEPLOYMENT_IN_PROGRESS` | A deployment is already running for this tenant |
| `DRIFT_ALREADY_REMEDIATED` | The drift event has already been remediated |
| `RATE_LIMIT_EXCEEDED` | Too many requests -- retry after the `Retry-After` header value |

## Rate Limiting

Inforcer enforces rate limits to protect API stability:

- Rate limit details are returned in response headers
- When rate limited (HTTP 429), the `Retry-After` header indicates seconds to wait

**Rate Limit Headers:**

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | Seconds to wait before retrying (only on 429) |

**Best Practices:**

1. Check `X-RateLimit-Remaining` before making batch requests
2. If you receive a 429, wait for the duration specified in `Retry-After`
3. Space out bulk operations (e.g., deploying to many tenants)
4. Use filtering to reduce the number of API calls needed
5. Cache tenant lists and baseline definitions that change infrequently

## Best Practices

1. **Always filter server-side** -- Use query parameters to narrow results rather than fetching all data and filtering client-side
2. **Use cursor pagination** -- Always paginate through large result sets; do not assume all results fit in one response
3. **Handle rate limits gracefully** -- Check rate limit headers and implement exponential backoff on 429 responses
4. **Scope operations by tenant or group** -- When working with a specific client, filter by `tenantId` or `group` to reduce noise
5. **Check deployment status** -- After deploying baselines or policies, poll the status endpoint to confirm completion
6. **Use tags for organization** -- Tag tenants by tier, region, or contract type for easier filtering and reporting
7. **Monitor drift proactively** -- Query the drift summary endpoint regularly to catch configuration changes early
8. **Export reports for clients** -- Use the export endpoint for PDF/CSV reports suitable for client-facing deliverables
9. **Test in a staging tenant first** -- Before deploying baselines broadly, test against a single non-production tenant
10. **Store API keys securely** -- Use environment variables or secret managers; never commit keys to version control

## Related Skills

- [Tenants](../tenants/SKILL.md) - Tenant listing, tags, grouping, and onboarding
- [Baselines](../baselines/SKILL.md) - Baseline creation, deployment, and framework alignment
- [Policies](../policies/SKILL.md) - Policy deployment and management
- [Drift Detection](../drift-detection/SKILL.md) - Drift monitoring and remediation
- [Reporting](../reporting/SKILL.md) - Compliance reports and Secure Score tracking
