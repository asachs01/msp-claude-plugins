---
name: create-quote
description: Create a new quote with line items in Salesbuildr
arguments:
  - name: name
    description: Quote title
    required: true
  - name: company
    description: Company name or ID
    required: true
  - name: contact
    description: Contact name or ID
    required: false
  - name: opportunity
    description: Opportunity name or ID to link
    required: false
  - name: products
    description: Comma-separated product names or IDs with quantities (e.g., "FortiGate 60F:2, SonicWall TZ270:1")
    required: false
---

# Create Salesbuildr Quote

## Prerequisites
- Salesbuildr API key configured
- Company and products must exist

## Steps
1. Resolve company, contact, and opportunity to IDs
2. Resolve product names to IDs and build line items
3. Call Salesbuildr API: `POST /quotes`
4. Display created quote with line items and total

## Examples

### Create quote with products
```
/create-quote name="Infrastructure Refresh" company="Acme Corp" products="FortiGate 60F:2, Endpoint License:50"
```

### Create quote linked to opportunity
```
/create-quote name="Proposal" company="Acme Corp" opportunity="Q1 Refresh"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| Product not found | Verify product names with /search-products |
| Company not found | Verify company exists |
