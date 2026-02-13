---
name: search-products
description: Search the Salesbuildr product catalog
arguments:
  - name: search
    description: Search term for product name
    required: false
  - name: category
    description: Category ID to filter by
    required: false
---

# Search Salesbuildr Products

## Prerequisites
- Salesbuildr API key configured

## Steps
1. Build search request with filters
2. Call Salesbuildr API: `GET /products?search=$search&category_id=$category`
3. Display results with pricing

## Examples

### Search by name
```
/search-products search="firewall"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| No results | Try broader search terms |
