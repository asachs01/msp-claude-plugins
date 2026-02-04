---
title: API Patterns Reference
description: Complete reference for Autotask API patterns including query operators, authentication, pagination, rate limiting, and error handling.
---

This reference covers the Autotask REST API patterns used across all entity types. Understanding these patterns enables efficient querying and reliable integration.

## Authentication

### API Credentials

Autotask API uses integration credentials (not user credentials):

| Credential | Description |
|------------|-------------|
| API User | Dedicated integration user |
| Username | Format: `username@domain` |
| Secret | API secret key |
| Integration Code | Vendor tracking code |

### Required Headers

```
Authorization: Basic <base64(username:secret)>
ApiIntegrationCode: <your-integration-code>
Content-Type: application/json
```

### Zone Discovery

Autotask uses regional zones. Discover your zone first:

```
GET https://webservices.autotask.net/atservicesrest/v1.0/zoneInformation?user=<username>
```

Response includes your zone URL (e.g., `https://webservices2.autotask.net/`).

## Query Operators

Autotask supports 14 query operators for filtering:

### Comparison Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `eq` | Equals | Exact match | `{"field": "status", "op": "eq", "value": 1}` |
| `ne` | Not Equals | Exclude match | `{"field": "status", "op": "ne", "value": 10}` |
| `gt` | Greater Than | Above value | `{"field": "priority", "op": "gt", "value": 2}` |
| `gte` | Greater Than or Equal | At or above value | `{"field": "createDate", "op": "gte", "value": "2026-01-01"}` |
| `lt` | Less Than | Below value | `{"field": "hoursWorked", "op": "lt", "value": 8}` |
| `lte` | Less Than or Equal | At or below value | `{"field": "dueDateTime", "op": "lte", "value": "2026-02-28"}` |

### String Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `contains` | Contains | Substring match | `{"field": "title", "op": "contains", "value": "email"}` |
| `startsWith` | Starts With | Prefix match | `{"field": "companyName", "op": "startsWith", "value": "Acme"}` |
| `endsWith` | Ends With | Suffix match | `{"field": "emailAddress", "op": "endsWith", "value": "@acme.com"}` |

### Set Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `in` | In | Match any in list | `{"field": "status", "op": "in", "value": [1, 5, 7]}` |
| `notIn` | Not In | Exclude all in list | `{"field": "priority", "op": "notIn", "value": [4]}` |

### Null Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `isNull` | Is Null | Field is empty | `{"field": "assignedResourceID", "op": "isNull"}` |
| `isNotNull` | Is Not Null | Field has value | `{"field": "contractID", "op": "isNotNull"}` |

### Range Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `between` | Between | Within range (inclusive) | `{"field": "createDate", "op": "between", "value": ["2026-01-01", "2026-01-31"]}` |

## Compound Filters

Combine multiple conditions with logical operators:

### AND Condition

All conditions must match:

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "status", "op": "ne", "value": 10 },
      { "field": "priority", "op": "in", "value": [1, 2] },
      { "field": "companyID", "op": "eq", "value": 12345 }
    ]
  }
}
```

### OR Condition

Any condition can match:

```json
{
  "filter": {
    "op": "or",
    "items": [
      { "field": "status", "op": "eq", "value": 1 },
      { "field": "status", "op": "eq", "value": 7 }
    ]
  }
}
```

### Nested Conditions

Combine AND and OR:

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "companyID", "op": "eq", "value": 12345 },
      {
        "op": "or",
        "items": [
          { "field": "status", "op": "eq", "value": 1 },
          { "field": "status", "op": "eq", "value": 5 }
        ]
      }
    ]
  }
}
```

## Pagination

### Request Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `maxRecords` | Integer | Records per page | 500 |
| `pageNumber` | Integer | Page to retrieve | 1 |

### Pagination Example

```json
{
  "filter": {
    "field": "companyType",
    "op": "eq",
    "value": 1
  },
  "maxRecords": 100,
  "pageNumber": 1
}
```

### Response Structure

```json
{
  "items": [...],
  "pageDetails": {
    "count": 100,
    "requestCount": 500,
    "prevPageUrl": null,
    "nextPageUrl": "/v1.0/Companies/query?page=2"
  }
}
```

### Pagination Best Practices

| Practice | Rationale |
|----------|-----------|
| Use reasonable page sizes | 100-500 records optimal |
| Check `nextPageUrl` | Indicates more records |
| Handle empty results | `items` may be empty array |
| Track total retrieved | Sum counts across pages |

## Rate Limiting

### Limits

| Limit Type | Value | Window |
|------------|-------|--------|
| Requests per minute | 60 | Rolling 60 seconds |
| Requests per hour | 1000 | Rolling 60 minutes |
| Concurrent requests | 5 | Simultaneous |

### Rate Limit Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706968800
```

### Handling Rate Limits

| HTTP Status | Action |
|-------------|--------|
| 429 | Wait and retry (exponential backoff) |
| 503 | Service overloaded, wait longer |

### Backoff Strategy

```
Attempt 1: Wait 1 second
Attempt 2: Wait 2 seconds
Attempt 3: Wait 4 seconds
Attempt 4: Wait 8 seconds
Max wait: 60 seconds
```

## Error Handling

### HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Entity created |
| 400 | Bad Request | Fix request format |
| 401 | Unauthorized | Check credentials |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify entity exists |
| 422 | Validation Error | Fix field values |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Retry with backoff |

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Field 'companyID' is required",
      "code": "VALIDATION_ERROR",
      "field": "companyID"
    }
  ]
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid field | Misspelled or unsupported field | Check API docs |
| Invalid operator | Wrong operator for field type | Use appropriate operator |
| Invalid value | Wrong data type | Match expected type |
| Entity not found | ID doesn't exist | Verify entity ID |
| Permission denied | Insufficient access | Check API user permissions |

## Field Selection

### Include Specific Fields

Limit response to needed fields:

```json
{
  "filter": {
    "field": "companyID",
    "op": "eq",
    "value": 12345
  },
  "includeFields": ["id", "title", "status", "priority"]
}
```

### Exclude Fields

Omit specific fields:

```json
{
  "filter": {
    "field": "companyID",
    "op": "eq",
    "value": 12345
  },
  "excludeFields": ["description", "notes"]
}
```

## Sorting

### Sort Parameters

```json
{
  "filter": {
    "field": "status",
    "op": "ne",
    "value": 10
  },
  "orderBy": [
    { "field": "priority", "direction": "asc" },
    { "field": "createDate", "direction": "desc" }
  ]
}
```

### Sort Direction

| Direction | Description |
|-----------|-------------|
| `asc` | Ascending (A-Z, 1-9, oldest first) |
| `desc` | Descending (Z-A, 9-1, newest first) |

## Date/Time Handling

### Date Formats

| Format | Example | Use Case |
|--------|---------|----------|
| Date only | `2026-02-04` | Date fields |
| DateTime | `2026-02-04T09:00:00Z` | DateTime fields |
| ISO 8601 | `2026-02-04T09:00:00-05:00` | With timezone |

### Timezone Considerations

- Autotask stores times in UTC
- Convert to UTC before sending
- Convert from UTC when displaying

### Date Queries

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "createDate", "op": "gte", "value": "2026-02-01T00:00:00Z" },
      { "field": "createDate", "op": "lt", "value": "2026-03-01T00:00:00Z" }
    ]
  }
}
```

## Batch Operations

### Batch Create

Create multiple entities:

```json
{
  "items": [
    { "companyID": 12345, "title": "Ticket 1", "status": 1, "priority": 3 },
    { "companyID": 12345, "title": "Ticket 2", "status": 1, "priority": 3 }
  ]
}
```

### Batch Update

Update multiple entities:

```json
{
  "items": [
    { "id": 98765, "status": 5 },
    { "id": 98766, "status": 5 }
  ]
}
```

### Batch Limits

| Operation | Max Items |
|-----------|-----------|
| Create | 200 per request |
| Update | 200 per request |
| Delete | 200 per request |

## User Defined Fields (UDFs)

### Query UDFs

```json
{
  "filter": {
    "field": "userDefinedFields/fieldName",
    "op": "eq",
    "value": "fieldValue"
  }
}
```

### Update UDFs

```json
{
  "id": 98765,
  "userDefinedFields": [
    { "name": "CustomField1", "value": "Custom Value" }
  ]
}
```

## API Endpoints Reference

### Entity Endpoints

| Entity | Endpoint |
|--------|----------|
| Tickets | `/v1.0/Tickets` |
| Companies | `/v1.0/Companies` |
| Contacts | `/v1.0/Contacts` |
| Projects | `/v1.0/Projects` |
| Tasks | `/v1.0/Tasks` |
| Time Entries | `/v1.0/TimeEntries` |
| Contracts | `/v1.0/Contracts` |
| Configuration Items | `/v1.0/ConfigurationItems` |

### Operations

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Query | POST | `/{entity}/query` |
| Get by ID | GET | `/{entity}/{id}` |
| Create | POST | `/{entity}` |
| Update | PATCH | `/{entity}` |
| Delete | DELETE | `/{entity}/{id}` |

## Performance Tips

| Tip | Rationale |
|-----|-----------|
| Use specific filters | Reduces data transfer |
| Select only needed fields | Faster responses |
| Paginate large results | Avoid timeouts |
| Cache static data | Reduce API calls |
| Use batch operations | Fewer round trips |
| Implement retries | Handle transient errors |

## Related Resources

- [Tickets Reference](/msp-claude-plugins/reference/autotask/tickets/) - Ticket API examples
- [CRM Reference](/msp-claude-plugins/reference/autotask/crm/) - Company/Contact API examples
- [Projects Reference](/msp-claude-plugins/reference/autotask/projects/) - Project API examples
- [Time Entries Reference](/msp-claude-plugins/reference/autotask/time-entries/) - Time entry API examples
