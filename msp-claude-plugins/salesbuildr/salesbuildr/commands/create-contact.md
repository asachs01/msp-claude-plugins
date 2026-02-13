---
name: create-contact
description: Create a new contact in Salesbuildr
arguments:
  - name: first-name
    description: Contact first name
    required: true
  - name: last-name
    description: Contact last name
    required: true
  - name: email
    description: Contact email address
    required: false
  - name: company
    description: Company name or ID
    required: true
  - name: phone
    description: Contact phone number
    required: false
---

# Create Salesbuildr Contact

## Prerequisites
- Salesbuildr API key configured
- Company must exist in Salesbuildr

## Steps
1. Resolve company name to ID if needed
2. Validate required fields
3. Call Salesbuildr API: `POST /contacts`
4. Display created contact confirmation

## Examples

### Create with company name
```
/create-contact first-name="Jane" last-name="Smith" email="jane@acme.com" company="Acme Corp"
```

## Error Handling
| Error | Resolution |
|-------|------------|
| Company not found | Verify company exists first |
| Missing required fields | Provide first-name, last-name, and company |
