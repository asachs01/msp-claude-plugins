# API Documentation Guide

Standards for documenting API integrations in MSP Claude plugins.

## Authentication Patterns

### API Key Authentication
```
Headers:
  Authorization: Bearer {API_KEY}
```

### Username/Secret Authentication (Autotask)
```
Headers:
  ApiIntegrationCode: {INTEGRATION_CODE}
  UserName: {USERNAME}
  Secret: {SECRET}
```

### OAuth 2.0 (NinjaOne, HaloPSA)
```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
```

## Request Documentation

### Format
```markdown
### [Operation Name]

**Endpoint:** `[METHOD] /v1.0/[path]`

**Description:** Brief description of what this operation does.

**Request:**
```json
{
  "requiredField": "value",
  "optionalField": "value"  // Optional
}
```

**Response:**
```json
{
  "id": 12345,
  "field": "value"
}
```

**Notes:**
- Important consideration 1
- Important consideration 2
```

## Field Documentation

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | Yes | Unique identifier |
| name | string | Yes | Display name |
| status | integer | No | Status code (see picklist) |

## Picklist Values

When documenting picklists:

```markdown
### Status Values

| ID | Name | Description |
|----|------|-------------|
| 1 | New | Newly created |
| 5 | In Progress | Being worked on |
| 10 | Complete | Finished |
```

## Error Codes

### Standard Format
```markdown
### Error Codes

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Invalid request | Check required fields |
| 401 | Unauthorized | Verify API credentials |
| 404 | Not found | Verify resource exists |
| 429 | Rate limited | Implement backoff |
```

## Rate Limiting

Document rate limits clearly:

```markdown
## Rate Limits

- **Requests per minute:** 60
- **Requests per day:** 10,000
- **Backoff strategy:** Exponential with jitter
- **Retry-After header:** Respected when present
```

## Environment Variables

Always reference credentials via environment variables:

```markdown
## Configuration

Required environment variables:
- `VENDOR_API_KEY` - API authentication key
- `VENDOR_API_SECRET` - API secret (if applicable)
- `VENDOR_BASE_URL` - API base URL (optional, defaults to production)
```
