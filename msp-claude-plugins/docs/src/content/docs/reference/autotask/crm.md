---
title: CRM Reference
description: Complete reference for Autotask company and contact management including field definitions and API examples.
---

The CRM module manages companies (accounts) and contacts in Autotask. This reference covers field definitions, relationships, and API patterns.

## Companies

### Company Types

| Type ID | Name | Description |
|---------|------|-------------|
| `1` | Customer | Paying client |
| `2` | Lead | Prospective customer |
| `3` | Prospect | Qualified lead |
| `4` | Dead | Inactive/lost |
| `6` | Cancellation | Former customer |
| `7` | Vendor | Supplier/partner |

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `companyName` | String (100) | Legal company name |
| `companyType` | Integer | Type code (see above) |
| `ownerResourceID` | Integer | Account manager |
| `phone` | String (25) | Primary phone |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `address1` | String (128) | Street address |
| `city` | String (30) | City |
| `state` | String (25) | State/province |
| `postalCode` | String (10) | ZIP/postal code |
| `country` | String (100) | Country |
| `webAddress` | String (255) | Website URL |
| `taxID` | String (50) | Tax identification |
| `parentCompanyID` | Integer | Parent company (for subsidiaries) |
| `classification` | Integer | Account classification |
| `territoryID` | Integer | Sales territory |
| `marketSegmentID` | Integer | Market segment |

### Company Classification

| Classification | Description |
|----------------|-------------|
| Strategic | High-value, long-term accounts |
| Enterprise | Large organizations |
| Mid-Market | Medium-sized businesses |
| SMB | Small/medium businesses |
| SOHO | Small office/home office |

## Contacts

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `companyID` | Integer | Parent company |
| `firstName` | String (50) | First name |
| `lastName` | String (50) | Last name |
| `isActive` | Boolean | Active status |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | String (50) | Job title |
| `emailAddress` | String (254) | Primary email |
| `phone` | String (25) | Direct phone |
| `mobilePhone` | String (25) | Mobile number |
| `extension` | String (10) | Phone extension |
| `alternatePhone` | String (25) | Secondary phone |
| `faxNumber` | String (25) | Fax number |
| `addressLine` | String (128) | Street address |
| `city` | String (32) | City |
| `state` | String (40) | State/province |
| `zipCode` | String (16) | ZIP/postal code |
| `isPrimaryContact` | Boolean | Primary contact flag |
| `receivesEmailNotifications` | Boolean | Email notification opt-in |

### Contact Roles

Contacts can be associated with specific roles for ticket notifications:

| Role | Notification Triggers |
|------|----------------------|
| Primary Contact | All ticket updates |
| Technical Contact | Technical issues only |
| Billing Contact | Invoice/billing issues |
| Executive Contact | Escalations and summaries |

## API Examples

### Search Companies

```json
{
  "filter": {
    "field": "companyType",
    "op": "eq",
    "value": 1
  },
  "maxRecords": 100
}
```

### Search by Company Name

```json
{
  "filter": {
    "field": "companyName",
    "op": "contains",
    "value": "Acme"
  }
}
```

### Search Active Customers

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "companyType", "op": "eq", "value": 1 },
      { "field": "isActive", "op": "eq", "value": true }
    ]
  }
}
```

### Create Company

```json
{
  "companyName": "Acme Corporation",
  "companyType": 1,
  "ownerResourceID": 29682934,
  "phone": "555-123-4567",
  "address1": "123 Main Street",
  "city": "Springfield",
  "state": "IL",
  "postalCode": "62701",
  "webAddress": "https://acme.example.com"
}
```

### Search Contacts by Company

```json
{
  "filter": {
    "field": "companyID",
    "op": "eq",
    "value": 12345
  }
}
```

### Search by Email

```json
{
  "filter": {
    "field": "emailAddress",
    "op": "eq",
    "value": "john.doe@acme.com"
  }
}
```

### Create Contact

```json
{
  "companyID": 12345,
  "firstName": "John",
  "lastName": "Doe",
  "title": "IT Manager",
  "emailAddress": "john.doe@acme.com",
  "phone": "555-123-4567",
  "mobilePhone": "555-987-6543",
  "isPrimaryContact": true,
  "isActive": true
}
```

### Update Contact

```json
{
  "id": 67890,
  "title": "Director of IT",
  "phone": "555-111-2222"
}
```

## Relationships

### Company Hierarchy

```
Parent Company
    |
    +-- Subsidiary 1
    |       |
    |       +-- Contact A
    |       +-- Contact B
    |
    +-- Subsidiary 2
            |
            +-- Contact C
```

### Entity Relationships

| From | To | Relationship |
|------|----|--------------|
| Company | Contacts | One-to-many |
| Company | Tickets | One-to-many |
| Company | Contracts | One-to-many |
| Company | Projects | One-to-many |
| Company | Configuration Items | One-to-many |
| Contact | Tickets | Many-to-many |
| Contact | Company | Many-to-one |

## Notes

### Company Notes

| Field | Type | Description |
|-------|------|-------------|
| `companyID` | Integer | Parent company |
| `title` | String (250) | Note title |
| `description` | String (32000) | Note content |
| `noteType` | Integer | Type classification |
| `publish` | Integer | Visibility (internal/external) |

### Note Types

| Type | Purpose |
|------|---------|
| General | Standard notes |
| Technical | Technical details |
| Billing | Financial notes |
| Sales | Sales activity |

## Common Workflows

### New Customer Onboarding

1. Create company with type = Customer (1)
2. Add primary contact with `isPrimaryContact = true`
3. Add technical and billing contacts
4. Link to contract (see Contracts Reference)
5. Create configuration items (see Configuration Items Reference)

### Contact Lookup for Ticket

1. Search contacts by email or phone
2. If not found, search by company name
3. Verify contact is active (`isActive = true`)
4. Use `contactID` when creating ticket

### Account Management

1. Search companies by `ownerResourceID` for your accounts
2. Review active tickets and projects
3. Check contract status and renewal dates
4. Update classification as relationship evolves

## Related Resources

- [Tickets Reference](/msp-claude-plugins/reference/autotask/tickets/) - Creating tickets for companies
- [Contracts Reference](/msp-claude-plugins/reference/autotask/contracts/) - Service agreements
- [Configuration Items Reference](/msp-claude-plugins/reference/autotask/configuration-items/) - Asset management
- [API Patterns](/msp-claude-plugins/reference/autotask/api-patterns/) - Query operators and authentication
