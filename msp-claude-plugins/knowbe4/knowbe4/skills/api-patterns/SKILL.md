---
name: "KnowBe4 API Patterns"
description: >
  Use this skill when working with the KnowBe4 MCP tools —
  available tools, authentication via API key header, region selection (us/eu),
  API structure, pagination, rate limiting, error handling, and best practices.
when_to_use: "When working with available tools, authentication via API key header, region selection (us/eu), API structure, pagination, rate limiting, error handling"
triggers:
  - knowbe4
  - knowbe4 api
  - knowbe4 authentication
  - knowbe4 tools
  - knowbe4 mcp
  - phisher
  - phishing
  - security awareness training
  - KnowBe4 API
  - KnowBe4 tools
  - knowbe4 region
  - knowbe4 rate limit
  - knowbe4 error
---

# KnowBe4 MCP Tools & API Patterns

## Overview

The KnowBe4 MCP server provides AI tool integration with the KnowBe4 PhishER and Security Awareness Training platform. It exposes tools covering PhishER message management, phishing simulation campaigns, training campaigns, and user risk scores. The API uses an API key passed as an HTTP header.

## Connection & Authentication

### API Key Header Auth

KnowBe4 authenticates using an API key passed via HTTP header:

| Header | Description |
|--------|-------------|
| `X-KnowBe4-API-Key` | Your KnowBe4 API key |
| `X-KnowBe4-Region` | Your account region: `us` (default) or `eu` |

Generate credentials at: **KnowBe4 Console > Account Settings > API**

**Environment Variables:**

```bash
export KNOWBE4_API_KEY="your-api-key"
export KNOWBE4_REGION="us"  # or "eu" for EU-hosted accounts
```

> **IMPORTANT:** Never hardcode credentials. Always use environment variables.

### Region Selection

KnowBe4 operates two regional API endpoints:

| Region | Endpoint |
|--------|----------|
| `us` | `https://us.api.knowbe4.com` |
| `eu` | `https://eu.api.knowbe4.com` |

Always match the region to your account's hosting region. Using the wrong region results in authentication failures or empty results.

## Available MCP Tools

### PhishER — Message Management

| Tool | Description |
|------|-------------|
| `knowbe4_phisher_list_messages` | List PhishER messages with filters |
| `knowbe4_phisher_get_message` | Get details for a specific PhishER message |
| `knowbe4_phisher_update_message` | Update message category or severity |
| `knowbe4_phisher_bulk_action` | Perform bulk actions across multiple messages |

### PhishER — Rules & Tags

| Tool | Description |
|------|-------------|
| `knowbe4_phisher_list_rules` | List configured PhishER rules |
| `knowbe4_phisher_get_rule` | Get details for a specific rule |
| `knowbe4_phisher_list_tags` | List available message tags |

### Training — Phishing Simulations

| Tool | Description |
|------|-------------|
| `knowbe4_training_list_campaigns` | List phishing simulation campaigns |
| `knowbe4_training_get_campaign` | Get campaign details and results |
| `knowbe4_training_list_phishing_tests` | List phishing tests within a campaign |
| `knowbe4_training_get_phishing_test` | Get results for a specific phishing test |

### Training — Security Awareness

| Tool | Description |
|------|-------------|
| `knowbe4_training_list_training_campaigns` | List security awareness training campaigns |
| `knowbe4_training_get_training_campaign` | Get training campaign status and enrollment |
| `knowbe4_training_list_enrollments` | List user enrollments in training campaigns |

### Users & Risk

| Tool | Description |
|------|-------------|
| `knowbe4_training_list_users` | List users with risk scores |
| `knowbe4_training_get_user` | Get details and risk score for a specific user |
| `knowbe4_training_list_groups` | List user groups |

## Pagination

The KnowBe4 API uses page/per_page style pagination:

- Pass `page` (1-based) and `per_page` (up to 500) parameters
- Continue fetching pages until the result count is less than `per_page`

**Example workflow:**

1. Call `knowbe4_phisher_list_messages` with `page=1&per_page=100`
2. If 100 results returned, call again with `page=2`
3. Repeat until fewer than `per_page` results are returned

## Rate Limiting

KnowBe4 enforces API rate limits per API key:

- HTTP 429 responses indicate rate limit exceeded
- Wait before retrying — use exponential backoff
- Use filters to reduce result set sizes
- Batch bulk operations into single API calls where possible

## Error Handling

### Common Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| 401 | Unauthorized | Check API key and region setting |
| 403 | Forbidden | Insufficient API key permissions |
| 404 | Not Found | Resource doesn't exist or wrong ID |
| 422 | Unprocessable Entity | Invalid request parameters |
| 429 | Rate Limited | Wait and retry after delay |
| 500 | Server Error | Retry; contact KnowBe4 support if persistent |

### Error Response Format

```json
{
  "error": "Invalid API key or region mismatch",
  "status": 401
}
```

## Best Practices

- Always specify the correct `X-KnowBe4-Region` header — mismatches cause silent failures
- Use filters (`status`, `severity`, `category`) to scope queries to relevant messages
- Paginate through full result sets for complete reporting
- Use bulk actions (`knowbe4_phisher_bulk_action`) instead of individual updates for efficiency
- Cache user and group data to reduce API calls when cross-referencing risk scores
- Handle rate limits gracefully with exponential backoff

## Related Skills

- [phishing-incidents](../phishing-incidents/SKILL.md) - PhishER message triage and remediation
- [training-campaigns](../training-campaigns/SKILL.md) - Simulation campaigns and user risk scores
