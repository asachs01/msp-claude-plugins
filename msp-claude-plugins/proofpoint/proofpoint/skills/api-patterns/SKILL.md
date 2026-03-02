---
description: >
  Use this skill when working with the Proofpoint MCP tools —
  authentication via HTTP Basic Auth (service principal + secret),
  the distinction between TAP and Essentials APIs, region selection,
  pagination, rate limiting, and error handling.
triggers:
  - proofpoint
  - TAP
  - targeted attack protection
  - proofpoint api
  - proofpoint essentials
  - proofpoint authentication
  - proofpoint region
  - proofpoint rate limit
  - proofpoint pagination
  - proofpoint error
---

# Proofpoint MCP Tools & API Patterns

## Overview

The Proofpoint MCP server provides AI tool integration with two distinct Proofpoint product APIs:

- **TAP (Targeted Attack Protection) API** — Threat intelligence, SIEM events, URL click data, message-level threat data, and campaign forensics. Primarily used for security operations and threat hunting.
- **Essentials API** — Email security management for SMB and MSP customers. Used for message tracing, organization management, and email statistics.

Both APIs authenticate via HTTP Basic Auth with a service principal and secret, but they are separate systems with different base URLs and credential sets.

## Connection & Authentication

### HTTP Basic Auth

Credentials are Base64-encoded as `principal:secret` and sent in the `Authorization` header:

```
Authorization: Basic <base64(principal:secret)>
```

The MCP Gateway injects credentials from the following headers:

| Header | Description |
|--------|-------------|
| `X-Proofpoint-Principal` | Your Proofpoint service principal |
| `X-Proofpoint-Secret` | Your Proofpoint service secret |
| `X-Proofpoint-Region` | Region code (us1, us2, us3, us4, uk1, eu1) |

**Environment Variables (self-hosted):**

```bash
export PROOFPOINT_PRINCIPAL="your-service-principal"
export PROOFPOINT_SECRET="your-service-secret"
export PROOFPOINT_REGION="us1"
```

> **IMPORTANT:** Never hardcode credentials. Always use environment variables.

## TAP API vs Essentials API

### TAP API

- **Purpose:** Threat intelligence and SIEM integration
- **Base URL:** `https://tap-api-v2.proofpoint.com/v2/`
- **Use for:** Threat queries, click events, SIEM message data, campaign forensics
- **Data model:** Threats, campaigns, clicks, SIEM events at the global/account level

### Essentials API

- **Purpose:** Email security management for MSPs
- **Base URL:** Region-specific, e.g., `https://us1.api.proofpoint.com/v1/`
- **Use for:** Message tracing, organization management, email statistics
- **Data model:** Organizations, messages, email stats at the tenant/org level

> **Key distinction:** If you need threat intelligence or URL click data, use TAP tools. If you need to trace a specific email or manage tenant settings, use Essentials tools.

## Region Selection

Proofpoint data is region-partitioned. Always confirm the region with the customer before querying.

| Region Code | Coverage |
|-------------|----------|
| `us1` | United States (East) |
| `us2` | United States (West) |
| `us3` | United States (Central) |
| `us4` | United States (Federal) |
| `uk1` | United Kingdom |
| `eu1` | European Union |

Set `PROOFPOINT_REGION` to the region where the customer's account is provisioned. Using the wrong region returns 404 or empty results — not an error — which can be misleading.

## Available MCP Tools

### TAP Threat Tools

| Tool | Description |
|------|-------------|
| `proofpoint_get_threats` | Query TAP threat data by type, time window, threat status |
| `proofpoint_get_siem_clicks` | URL click events (permitted and blocked) |
| `proofpoint_get_siem_messages` | Message delivery and block events |
| `proofpoint_get_campaign` | Campaign intelligence and forensics |

### Essentials Message Trace Tools

| Tool | Description |
|------|-------------|
| `proofpoint_trace_message` | Trace messages by sender, recipient, subject, date range |

### MSP Management Tools

| Tool | Description |
|------|-------------|
| `proofpoint_list_orgs` | List Essentials organizations under the MSP account |
| `proofpoint_get_email_stats` | Email statistics for a specific organization |

## Pagination

The Proofpoint APIs use cursor- or offset-based pagination depending on the endpoint:

- **TAP SIEM endpoints** use time-window queries rather than pagination. Specify `interval` (ISO 8601 duration, e.g., `PT1H` for 1 hour) or explicit `startTime`/`endTime`.
- **Essentials list endpoints** use `page` and `size` query parameters.

**TAP time-window example:**

Fetch clicks from the last 24 hours:
```
proofpoint_get_siem_clicks
  interval: "PT24H"
```

Fetch clicks for a specific window:
```
proofpoint_get_siem_clicks
  startTime: "2026-03-01T00:00:00Z"
  endTime:   "2026-03-02T00:00:00Z"
```

**Essentials pagination example:**

```
proofpoint_list_orgs
  page: 1
  size: 50
```

Repeat with incrementing `page` until the response returns fewer results than `size`.

## Rate Limiting

Proofpoint enforces rate limits per API and per region:

- **TAP API:** ~100 requests per minute per service principal
- **Essentials API:** Rate limits vary by operation; avoid polling in tight loops

When rate limited:
- HTTP 429 is returned with a `Retry-After` header
- Honor the `Retry-After` value before retrying
- Reduce query frequency or use larger time windows
- Avoid concurrent requests against the same endpoint

## Error Handling

### Common Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| 400 | Bad Request | Check query parameters — invalid date format, missing required field |
| 401 | Unauthorized | Verify principal and secret are correct and not expired |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | Not Found | Resource doesn't exist, or wrong region — verify region setting |
| 429 | Rate Limited | Wait for `Retry-After` interval before retrying |
| 500 | Server Error | Retry with backoff; contact Proofpoint support if persistent |

### Error Response Format (TAP)

```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials or service principal"
}
```

### Error Response Format (Essentials)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid authentication"
}
```

## Best Practices

- Always confirm region before querying — wrong region silently returns empty data
- Use the narrowest time window necessary for TAP SIEM queries to avoid large result sets
- Distinguish between TAP and Essentials credentials — they are separate systems
- Handle `null` threat counts gracefully — a missing key means zero, not an error
- When tracing messages, try multiple search dimensions (sender + date range) if first query returns no results
- Cache org lists to reduce repeated `proofpoint_list_orgs` calls when querying stats for multiple orgs
- Log API errors with the endpoint and time window for easier debugging

## Related Skills

- [threats](../threats/SKILL.md) - TAP threat intelligence and SIEM events
- [message-trace](../message-trace/SKILL.md) - Essentials message tracing
- [msp-management](../msp-management/SKILL.md) - Organization listing and email statistics
