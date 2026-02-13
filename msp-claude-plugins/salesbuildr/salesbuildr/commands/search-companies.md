---
name: search-companies
description: Search for companies in Salesbuildr
arguments:
  - name: search
    description: Search term for company name
    required: false
---

# Search Salesbuildr Companies

## Prerequisites
- Salesbuildr API key configured

## Steps
1. Build search request with provided filters
2. Call Salesbuildr API: `GET /companies?search=$search`
3. Display results in table format

## Examples

### Search by name
```
/search-companies search="Acme Corp"
```

### List all companies
```
/search-companies
```

## Error Handling
| Error | Resolution |
|-------|------------|
| 401 Unauthorized | Check SALESBUILDR_API_KEY configuration |
| No results | Try broader search terms |
