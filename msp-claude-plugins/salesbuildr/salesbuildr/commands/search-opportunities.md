---
name: search-opportunities
description: Search for opportunities in the Salesbuildr sales pipeline
arguments:
  - name: search
    description: Search term for opportunity name
    required: false
  - name: company
    description: Company name or ID to filter
    required: false
  - name: status
    description: Filter by opportunity status
    required: false
---

# Search Salesbuildr Opportunities

## Prerequisites
- Salesbuildr API key configured

## Steps
1. If company name provided, resolve to ID
2. Call Salesbuildr API: `GET /opportunities?search=$search&company_id=$company&status=$status`
3. Display pipeline with values and stages

## Examples

### Search by name
```
/search-opportunities search="infrastructure"
```

### Filter by company
```
/search-opportunities company="Acme Corp"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| No results | Check filters or broaden search |
