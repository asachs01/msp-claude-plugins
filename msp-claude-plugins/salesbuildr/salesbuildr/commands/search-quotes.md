---
name: search-quotes
description: Search for quotes in Salesbuildr
arguments:
  - name: search
    description: Search term for quote name/number
    required: false
  - name: company
    description: Company name or ID to filter
    required: false
  - name: opportunity
    description: Opportunity ID to filter
    required: false
---

# Search Salesbuildr Quotes

## Prerequisites
- Salesbuildr API key configured

## Steps
1. Resolve company name to ID if needed
2. Call Salesbuildr API: `GET /quotes?search=$search&company_id=$company&opportunity_id=$opportunity`
3. Display quotes with totals and status

## Examples

### Search by company
```
/search-quotes company="Acme Corp"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| No results | Check filters |
