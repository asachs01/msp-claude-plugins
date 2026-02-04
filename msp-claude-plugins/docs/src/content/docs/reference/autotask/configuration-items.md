---
title: Configuration Items Reference
description: Complete reference for Autotask configuration item management including asset types, warranties, DNS/SSL tracking, and API examples.
---

Configuration Items (CIs) represent managed assets in Autotask. This reference covers asset types, warranty tracking, DNS/SSL certificate management, and lifecycle workflows.

## Asset Categories

| Category ID | Name | Description |
|-------------|------|-------------|
| `1` | Workstation | Desktop/laptop computers |
| `2` | Server | Physical/virtual servers |
| `3` | Network Device | Routers, switches, firewalls |
| `4` | Printer | Printers and MFPs |
| `5` | Mobile Device | Phones and tablets |
| `6` | Software | Software licenses |
| `7` | Other | Miscellaneous assets |

## CI Status Codes

| Status ID | Name | Description | Active |
|-----------|------|-------------|--------|
| `1` | Active | In production use | Yes |
| `2` | Inactive | Not currently deployed | No |
| `3` | Retired | End of life | No |
| `4` | In Stock | Available for deployment | No |
| `5` | In Repair | Undergoing maintenance | No |

## CI Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `companyID` | Integer | Owner company |
| `productID` | Integer | Product definition |
| `referenceTitle` | String (100) | CI name/hostname |
| `isActive` | Boolean | Active status |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `serialNumber` | String (100) | Manufacturer serial |
| `installDate` | Date | Deployment date |
| `warrantyExpirationDate` | Date | Warranty end date |
| `notes` | String (8000) | General notes |
| `location` | String (100) | Physical location |
| `contactID` | Integer | Primary user |
| `contractID` | Integer | Service contract |
| `parentConfigurationItemID` | Integer | Parent CI (for components) |
| `dattormmID` | String (100) | RMM integration ID |
| `ipAddress` | String (50) | IP address |
| `macAddress` | String (50) | MAC address |

## Asset Types

### Workstations

| Field | Description |
|-------|-------------|
| `referenceTitle` | Hostname |
| `serialNumber` | Service tag |
| `productID` | Model (e.g., Dell OptiPlex 7090) |
| `ipAddress` | Current IP |
| `contactID` | Assigned user |

### Servers

| Field | Description |
|-------|-------------|
| `referenceTitle` | Server name |
| `serialNumber` | Service tag |
| `productID` | Model or VM type |
| `ipAddress` | Management IP |
| `notes` | Role/services |

### Network Devices

| Field | Description |
|-------|-------------|
| `referenceTitle` | Device name |
| `serialNumber` | Serial number |
| `productID` | Model |
| `ipAddress` | Management IP |
| `macAddress` | MAC address |
| `location` | Rack/room location |

## Warranty Tracking

### Warranty Fields

| Field | Type | Description |
|-------|------|-------------|
| `warrantyExpirationDate` | Date | Warranty end |
| `warrantyType` | String | Coverage level |
| `vendorID` | Integer | Manufacturer |

### Warranty Coverage Types

| Type | Description |
|------|-------------|
| Basic | Parts only |
| Standard | Parts and labor |
| ProSupport | 24/7 support |
| Premium | On-site, next business day |
| Extended | Beyond standard term |

### Warranty Alert Thresholds

| Days Before Expiry | Action |
|--------------------|--------|
| 90 days | Notify account manager |
| 60 days | Send renewal quote |
| 30 days | Final reminder |
| Expired | Update asset record |

## DNS Tracking

Track domain registrations as CIs:

### DNS CI Fields

| Field | Use For |
|-------|---------|
| `referenceTitle` | Domain name |
| `serialNumber` | Registrar account ID |
| `warrantyExpirationDate` | Domain expiration |
| `notes` | Registrar details, DNS provider |

### DNS Alert Schedule

| Days Before Expiry | Action |
|--------------------|--------|
| 90 days | Renewal notification |
| 30 days | Urgent renewal reminder |
| 7 days | Critical alert |

## SSL Certificate Tracking

Track SSL certificates as CIs:

### SSL CI Fields

| Field | Use For |
|-------|---------|
| `referenceTitle` | Certificate CN/domain |
| `serialNumber` | Certificate serial |
| `warrantyExpirationDate` | Certificate expiration |
| `notes` | Issuer, type, SANs |
| `location` | Server/service location |

### SSL Certificate Types

| Type | Typical Validity | Use Case |
|------|------------------|----------|
| DV | 1 year | Basic websites |
| OV | 1-2 years | Business sites |
| EV | 1-2 years | E-commerce |
| Wildcard | 1 year | Multiple subdomains |
| Multi-domain | 1 year | Multiple domains |

### SSL Alert Schedule

| Days Before Expiry | Action |
|--------------------|--------|
| 60 days | Begin renewal process |
| 30 days | Order new certificate |
| 14 days | Install new certificate |
| 7 days | Critical alert |

## API Examples

### Search Configuration Items by Company

```json
{
  "filter": {
    "field": "companyID",
    "op": "eq",
    "value": 12345
  },
  "maxRecords": 200
}
```

### Search Active Workstations

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "configurationItemCategoryID", "op": "eq", "value": 1 },
      { "field": "isActive", "op": "eq", "value": true }
    ]
  }
}
```

### Search by Serial Number

```json
{
  "filter": {
    "field": "serialNumber",
    "op": "eq",
    "value": "ABC123XYZ"
  }
}
```

### Search Expiring Warranties

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "warrantyExpirationDate", "op": "gte", "value": "2026-02-04" },
      { "field": "warrantyExpirationDate", "op": "lte", "value": "2026-05-04" },
      { "field": "isActive", "op": "eq", "value": true }
    ]
  }
}
```

### Search Expiring SSL Certificates

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "configurationItemCategoryID", "op": "eq", "value": 6 },
      { "field": "warrantyExpirationDate", "op": "lte", "value": "2026-03-15" },
      { "field": "referenceTitle", "op": "contains", "value": "SSL" }
    ]
  }
}
```

### Search by IP Address

```json
{
  "filter": {
    "field": "ipAddress",
    "op": "eq",
    "value": "192.168.1.100"
  }
}
```

### Create Workstation CI

```json
{
  "companyID": 12345,
  "productID": 5001,
  "configurationItemCategoryID": 1,
  "referenceTitle": "ACME-WS-042",
  "serialNumber": "DELL7XK9Z3",
  "isActive": true,
  "installDate": "2026-02-04",
  "warrantyExpirationDate": "2029-02-04",
  "contactID": 67890,
  "ipAddress": "192.168.1.42",
  "notes": "Windows 11 Pro, 16GB RAM, 512GB SSD"
}
```

### Create Server CI

```json
{
  "companyID": 12345,
  "productID": 5010,
  "configurationItemCategoryID": 2,
  "referenceTitle": "ACME-DC01",
  "serialNumber": "VMW-2026-001",
  "isActive": true,
  "installDate": "2026-01-15",
  "ipAddress": "192.168.1.10",
  "notes": "Primary Domain Controller, Windows Server 2022, 32GB RAM, 500GB storage"
}
```

### Create SSL Certificate CI

```json
{
  "companyID": 12345,
  "productID": 6001,
  "configurationItemCategoryID": 6,
  "referenceTitle": "SSL: *.acmecorp.com",
  "serialNumber": "A1B2C3D4E5F6",
  "isActive": true,
  "installDate": "2026-01-15",
  "warrantyExpirationDate": "2027-01-15",
  "notes": "Wildcard certificate, DigiCert, covers all subdomains. Installed on web server ACME-WEB01."
}
```

### Create DNS CI

```json
{
  "companyID": 12345,
  "productID": 6002,
  "configurationItemCategoryID": 6,
  "referenceTitle": "DNS: acmecorp.com",
  "serialNumber": "GD-12345678",
  "isActive": true,
  "warrantyExpirationDate": "2027-06-15",
  "notes": "Registered with GoDaddy. DNS hosted on Cloudflare. Auto-renew enabled."
}
```

### Update CI Status

```json
{
  "id": 99999,
  "isActive": false,
  "statusID": 3,
  "notes": "Retired 2026-02-04. Replaced by ACME-WS-043."
}
```

## CI Relationships

### Parent-Child Structure

```
Server (Parent)
    |
    +-- NIC 1 (Child CI)
    +-- RAID Controller (Child CI)
    +-- UPS (Related CI)
```

### Relationship Types

| Relationship | Use Case |
|--------------|----------|
| Parent-Child | Components of a system |
| Related | Dependencies between CIs |
| Contract Link | Service coverage |
| Contact Link | Primary user assignment |

## Lifecycle Management

### Lifecycle Stages

| Stage | Status | Typical Duration |
|-------|--------|------------------|
| Procurement | In Stock | Days to weeks |
| Deployment | Active | Days |
| Production | Active | 3-5 years |
| End of Life | Active/Inactive | 6-12 months |
| Retirement | Retired | Permanent |

### Lifecycle Workflow

1. **Procurement**: CI created with status "In Stock"
2. **Deployment**: Assigned to user, status "Active"
3. **Production**: Normal operations, track warranties
4. **Refresh Planning**: Evaluate at warranty expiry
5. **Retirement**: Update status, remove from billing

## Common Workflows

### New Asset Onboarding

1. Create CI with basic info (serial, model)
2. Set status to "In Stock"
3. Assign to company when deployed
4. Link to contact (user)
5. Link to contract for billing
6. Update status to "Active"

### Warranty Expiration Review

1. Search CIs with warranty expiring in 90 days
2. Evaluate replacement vs renewal
3. Generate quotes for customer
4. Update warranty dates if renewed
5. Create refresh project if replacing

### SSL Certificate Renewal

1. Search SSL CIs expiring in 60 days
2. Create ticket for renewal
3. Order/generate new certificate
4. Install on servers
5. Update CI with new expiration
6. Close ticket

### Asset Decommission

1. Verify no active tickets
2. Remove from monitoring
3. Update CI status to "Retired"
4. Set isActive to false
5. Document disposal/transfer
6. Update contact assignments

## Related Resources

- [CRM Reference](/msp-claude-plugins/reference/autotask/crm/) - Company asset ownership
- [Contracts Reference](/msp-claude-plugins/reference/autotask/contracts/) - Per-device billing
- [Tickets Reference](/msp-claude-plugins/reference/autotask/tickets/) - Asset-related tickets
- [API Patterns](/msp-claude-plugins/reference/autotask/api-patterns/) - Query operators and authentication
