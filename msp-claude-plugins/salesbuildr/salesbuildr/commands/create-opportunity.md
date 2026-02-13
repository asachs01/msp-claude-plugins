---
name: create-opportunity
description: Create a new opportunity in Salesbuildr
arguments:
  - name: name
    description: Opportunity name/title
    required: true
  - name: company
    description: Company name or ID
    required: true
  - name: contact
    description: Contact name or ID
    required: false
  - name: value
    description: Deal value in dollars
    required: false
  - name: stage
    description: Pipeline stage
    required: false
  - name: close-date
    description: Expected close date (YYYY-MM-DD)
    required: false
---

# Create Salesbuildr Opportunity

## Prerequisites
- Salesbuildr API key configured
- Company must exist

## Steps
1. Resolve company and contact names to IDs
2. Validate required fields
3. Call Salesbuildr API: `POST /opportunities`
4. Display created opportunity confirmation

## Examples

### Create opportunity
```
/create-opportunity name="Q1 Refresh" company="Acme Corp" value=25000 stage="proposal"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| Company not found | Verify company exists |
| Invalid stage | Check valid stage values |
