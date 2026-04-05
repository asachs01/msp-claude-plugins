---
name: "Abnormal API Patterns"
description: >
  Use this skill when working with Abnormal Security MCP tools — available
  tools, Bearer token authentication, API structure, pagination, rate
  limiting, and error handling.
when_to_use: "When working with available tools, Bearer token authentication, API structure, pagination, rate limiting, and error handling in Abnormal Security MCP tools"
triggers:
  - abnormal security
  - abnormal api
  - abnormal mcp
  - abnormal tools
  - abnormal authentication
  - abnormal pagination
  - abnormal rate limit
  - abnormal error
---

# Abnormal Security MCP Tools & API Patterns

## Overview

The Abnormal Security MCP server provides AI tool integration with the Abnormal Security email threat detection platform. It exposes tools for listing and investigating AI-detected threats, analyzing individual messages within threat cases, managing security cases, reviewing user-reported phishing (abuse reports), and triggering or verifying remediation actions. Authentication is via a Bearer token passed in the `Authorization` header.

## Connection & Authentication

### Bearer Token

Abnormal Security uses a static Bearer token for API authentication. The MCP Gateway injects it via the `Authorization` header:

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <your-api-token>` |

Generate a token at: **Abnormal Security Portal > Settings > API**

**Environment Variable (self-hosted):**

```bash
export ABNORMAL_API_TOKEN="your-api-token"
```

> **IMPORTANT:** Never hardcode tokens. Always use environment variables or the MCP Gateway.

## Available MCP Tools

### Threats

| Tool | Description |
|------|-------------|
| `abnormal_list_threats` | List detected threats with filters |
| `abnormal_get_threat` | Get detailed information for a specific threat case |
| `abnormal_list_messages` | List messages within a threat case |
| `abnormal_get_message` | Get detailed analysis for a specific message |
| `abnormal_manage_remediation` | Trigger remediation or check remediation status |

### Cases

| Tool | Description |
|------|-------------|
| `abnormal_list_cases` | List active security cases |
| `abnormal_get_abuse_reports` | Get user-reported phishing emails (abuse reports) |

## Pagination

The Abnormal Security API uses cursor-based pagination:

- Responses include a `nextPageNumber` field when more results are available
- Pass `pageNumber` on subsequent calls to retrieve the next page
- Default page size is 100 records

**Example paginated response:**

```json
{
  "threats": [...],
  "nextPageNumber": 2,
  "total": 247
}
```

**Pagination workflow:**

1. Call the tool without `pageNumber` (defaults to page 1)
2. Check `nextPageNumber` in the response
3. If present, call again with `pageNumber` set to that value
4. Repeat until `nextPageNumber` is absent or null

## Rate Limiting

Abnormal Security enforces rate limits. Specific limits depend on subscription tier.

- HTTP 429 responses indicate rate limiting
- Use exponential backoff before retrying
- Apply date range, threat type, and status filters to reduce result volumes
- Avoid continuous polling; use targeted queries

## Error Handling

### Common Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| 400 | Bad Request | Check required parameters and filter values |
| 401 | Unauthorized | Verify API token is correct and not revoked |
| 403 | Forbidden | Token lacks permissions for this operation |
| 404 | Not Found | Threat ID or case ID does not exist |
| 429 | Rate Limited | Wait and retry with exponential backoff |
| 500 | Server Error | Retry; contact Abnormal Security support if persistent |

### Error Response Format

```json
{
  "error": "INVALID_TOKEN",
  "message": "The provided API token is invalid or has been revoked.",
  "requestId": "req-abc123"
}
```

Always include the `requestId` when contacting Abnormal Security support.

## Best Practices

- Filter by `receivedTime` date ranges to limit result volumes on large tenants
- Use `threatType` filters when investigating a specific attack vector (BEC, phishing, etc.)
- Retrieve threat details before listing messages within a case — the threat summary helps scope the investigation
- Always check `remediationStatus` before triggering a new remediation to avoid duplicate actions
- Store the `threatId` when creating PSA tickets — it is the primary reference for Abnormal Security support

## Related Skills

- [threats](../threats/SKILL.md) - Threat lifecycle and message analysis
- [cases](../cases/SKILL.md) - Security cases and abuse reports
