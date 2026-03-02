---
description: >
  Use this skill when working with the Check Point Avanan MCP tools —
  client credentials authentication flow, Bearer token management, region
  selection (us/eu/ap), the Smart API for MSP multi-tenant access, and
  general API patterns, pagination, and error handling.
triggers:
  - avanan
  - harmony email
  - check point avanan
  - avanan api
  - harmony collaboration
  - avanan authentication
  - avanan region
  - avanan token
  - avanan smart api
  - check point harmony
---

# Check Point Avanan MCP Tools & API Patterns

## Overview

The Avanan MCP server provides AI tool integration with Check Point Avanan (Harmony Email & Collaboration), a cloud-native email and collaboration security platform that protects Microsoft 365, Google Workspace, and other SaaS collaboration tools.

Avanan operates as an API-based security layer — it does not sit in the mail path via MX records but rather connects directly to cloud mail APIs. This means it has full access to all messages including those already delivered, and can retroactively quarantine or remediate threats.

The Avanan API is divided into two tiers:

- **Standard API** — Access to a single customer tenant's events, entities, and settings
- **Smart API** — MSP/MSSP multi-tenant API that provides access to multiple customer tenants from a single credential set

## Connection & Authentication

### Client Credentials OAuth Flow

Avanan uses OAuth 2.0 client credentials grant. Unlike Basic Auth, this requires exchanging a Client ID and Secret for a Bearer token before making API calls.

The token exchange is:

```
POST https://api.avanan.net/v1/pub/access-token
Content-Type: application/json

{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-03-02T13:00:00Z"
}
```

The Bearer token is then used in subsequent requests:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

The MCP Gateway handles token exchange and refresh automatically. You only configure the Client ID, Secret, and region.

### Gateway-Injected Headers

The MCP Gateway injects credentials from these headers:

| Header | Description |
|--------|-------------|
| `X-Avanan-Client-ID` | Your Avanan Client ID |
| `X-Avanan-Client-Secret` | Your Avanan Client Secret |
| `X-Avanan-Region` | Region code: `us`, `eu`, or `ap` |

**Environment Variables (self-hosted):**

```bash
export AVANAN_CLIENT_ID="your-client-id"
export AVANAN_CLIENT_SECRET="your-client-secret"
export AVANAN_REGION="us"
```

> **IMPORTANT:** Never hardcode credentials. Always use environment variables. Bearer tokens expire — the gateway refreshes them automatically, but self-hosted deployments must implement refresh logic.

## Region Selection

Avanan data is region-partitioned. The region determines the API base URL.

| Region | Base URL | Coverage |
|--------|----------|----------|
| `us` | `https://api.avanan.net/v1/` | United States |
| `eu` | `https://eu.api.avanan.net/v1/` | European Union |
| `ap` | `https://ap.api.avanan.net/v1/` | Asia Pacific |

Using the wrong region returns 404 — Avanan will not redirect cross-region requests. Always confirm the region with the customer before querying.

## Standard API vs Smart API

### Standard API

- **Scope:** Single customer tenant
- **Use for:** Single-client MSPs, direct Avanan customers
- **Authentication:** Client ID/Secret for that specific tenant
- **Endpoints:** `/v1/pub/...` — events, entities, actions, exceptions

### Smart API (MSP Multi-Tenant)

- **Scope:** All customer tenants under the MSP account
- **Use for:** MSPs managing 5+ Avanan customers
- **Authentication:** MSP-level Client ID/Secret (single credential set for all tenants)
- **Tenant selection:** Pass `X-Av-Tenant` header or `tenantId` parameter to scope to a specific tenant
- **Endpoints:** `/v1/smart/...` — tenant listing, cross-tenant event queries

> **Key distinction:** If you are an MSP managing multiple Avanan tenants, use Smart API credentials. If you are managing a single customer, use Standard API credentials.

## Available MCP Tools

### Security Events

| Tool | Description |
|------|-------------|
| `avanan_search_events` | Search security events with filters (type, date, severity, status) |
| `avanan_get_event` | Get full details for a specific event by ID |
| `avanan_perform_event_action` | Perform an action on an event (quarantine, release, mark safe, report) |

### Entities

| Tool | Description |
|------|-------------|
| `avanan_search_entities` | Search secured email entities (messages) across the environment |

### Tenant Management (Smart API)

| Tool | Description |
|------|-------------|
| `avanan_list_tenants` | List all customer tenants under the MSP Smart API account |
| `avanan_get_tenant` | Get details for a specific tenant |

### Exceptions

| Tool | Description |
|------|-------------|
| `avanan_list_exceptions` | List current whitelist and blacklist exceptions |
| `avanan_add_exception` | Add a new whitelist or blacklist exception |
| `avanan_remove_exception` | Remove an existing exception |

## Pagination

Avanan APIs use offset-based pagination:

- `offset` — Number of records to skip (default: 0)
- `limit` — Number of records to return per page (default: 50, max: 200)
- Response includes `total` count to determine if more pages exist

**Pagination loop:**

```json
{
  "tool": "avanan_search_events",
  "parameters": {
    "limit": 100,
    "offset": 0
  }
}
```

If `offset + limit < total`, fetch the next page:

```json
{
  "tool": "avanan_search_events",
  "parameters": {
    "limit": 100,
    "offset": 100
  }
}
```

Continue until `offset >= total`.

## Rate Limiting

Avanan enforces per-tenant rate limits:

- Limits vary by plan and tenant size — typically 100–500 requests per minute
- HTTP 429 is returned when rate limited; a `Retry-After` header indicates wait time
- Avoid polling loops — use event search with date ranges instead of polling for new events
- For MSP Smart API queries, rate limits apply per-tenant even when queried from the MSP account

## Error Handling

### Common Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| 400 | Bad Request | Check query parameters — invalid filter, missing required field |
| 401 | Unauthorized | Verify Client ID and Secret; check token expiry |
| 403 | Forbidden | Insufficient scope — action may require elevated permissions |
| 404 | Not Found | Wrong region, resource doesn't exist, or tenant not found |
| 429 | Rate Limited | Honor `Retry-After` header before retrying |
| 500 | Server Error | Retry with exponential backoff; contact Check Point support if persistent |

### Error Response Format

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired access token"
}
```

### Token Expiry

Bearer tokens from Avanan expire (typically 1 hour). If you receive 401 after initially successful requests, the token has expired. The MCP Gateway handles refresh automatically. Self-hosted deployments must re-run the token exchange.

## Best Practices

- Always set a date range when searching events — unbounded searches are slow and may time out
- Use `offset`/`limit` pagination for large result sets; avoid setting `limit` higher than 200
- Confirm region before querying — the wrong region silently returns 404, not cross-region data
- For MSP Smart API queries, always specify `tenantId` to scope results to a specific customer
- Cache tenant listings during a session — the list changes infrequently
- When performing actions (quarantine, release), confirm the event ID before calling `avanan_perform_event_action` — actions are immediate and not undoable without another action call
- Handle 429 with exponential backoff starting at the `Retry-After` value

## Related Skills

- [security-events](../security-events/SKILL.md) - Security event search, details, and actions
- [tenant-management](../tenant-management/SKILL.md) - MSP Smart API tenant management
