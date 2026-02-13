---
name: get-quote
description: Get detailed information for a specific Salesbuildr quote
arguments:
  - name: id
    description: Quote ID
    required: true
---

# Get Salesbuildr Quote Details

## Prerequisites
- Salesbuildr API key configured

## Steps
1. Call Salesbuildr API: `GET /quotes/$id`
2. Display full quote details with line items
3. Show total, status, and associated company/contact

## Examples

### Get quote by ID
```
/get-quote id=12345
```

## Error Handling
| Error | Resolution |
|-------|------------|
| 404 Not Found | Verify quote ID exists |
