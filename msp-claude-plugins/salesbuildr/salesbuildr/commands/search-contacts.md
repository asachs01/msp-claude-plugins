---
name: search-contacts
description: Search for contacts in Salesbuildr, optionally filtered by company
arguments:
  - name: search
    description: Search term for contact name or email
    required: false
  - name: company
    description: Company name or ID to filter contacts
    required: false
---

# Search Salesbuildr Contacts

## Prerequisites
- Salesbuildr API key configured

## Steps
1. If company name provided, search companies first to resolve ID
2. Call Salesbuildr API: `GET /contacts?search=$search&company_id=$company`
3. Display results with company association

## Examples

### Search by name
```
/search-contacts search="John"
```

### Search within a company
```
/search-contacts company="Acme Corp"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| Company not found | Verify company name spelling |
| No contacts found | Try broader search or check company |
