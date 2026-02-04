---
title: Contracts Reference
description: Complete reference for Autotask contract management including service agreements, billing configurations, and API examples.
---

Contracts define the service agreements and billing arrangements between your MSP and clients. This reference covers contract types, billing configurations, and service management.

## Contract Types

| Type ID | Name | Description | Billing |
|---------|------|-------------|---------|
| `1` | Time & Materials | Bill for actual hours | Per time entry |
| `2` | Fixed Price | Set recurring fee | Monthly/annual |
| `3` | Block Hours | Prepaid hour bank | Deduct from balance |
| `4` | Retainer | Monthly hour allocation | Use-or-lose |
| `5` | Incident | Per-incident pricing | Per ticket |
| `6` | Per Device | Fee per managed device | Per CI count |

## Contract Status

| Status ID | Name | Description |
|-----------|------|-------------|
| `1` | Active | Current, billable contract |
| `2` | Inactive | Suspended or paused |
| `3` | Cancelled | Terminated contract |

## Contract Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `companyID` | Integer | Client company |
| `contractName` | String (100) | Contract name |
| `contractType` | Integer | Type code |
| `status` | Integer | Status code |
| `startDate` | Date | Contract start |
| `endDate` | Date | Contract end |

### Common Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | String (2000) | Contract description |
| `contractNumber` | String (50) | Reference number |
| `purchaseOrderNumber` | String (50) | Client PO |
| `estimatedRevenue` | Decimal | Projected value |
| `estimatedHours` | Decimal | Projected hours |
| `serviceLevelAgreementID` | Integer | SLA assignment |
| `renewalDate` | Date | Next renewal |
| `autoRenewal` | Boolean | Auto-renew flag |

## Block Hours Configuration

### Block Hours Fields

| Field | Type | Description |
|-------|------|-------------|
| `hoursPerContract` | Decimal | Total prepaid hours |
| `overageRate` | Decimal | Rate for hours over limit |
| `rolloverHours` | Boolean | Unused hours carry forward |
| `rolloverLimit` | Decimal | Max rollover hours |

### Block Hours Tracking

```
Starting Balance: 20 hours
Hours Used This Month: 15 hours
Remaining Balance: 5 hours
Rollover (if enabled): +5 to next month
```

### Overage Handling

| Scenario | Behavior |
|----------|----------|
| Under allocation | Bill at contract rate |
| At allocation | Notify customer |
| Over allocation | Bill at overage rate |

## Retainer Configuration

### Retainer Fields

| Field | Type | Description |
|-------|------|-------------|
| `monthlyHours` | Decimal | Hours per month |
| `unusedHoursBehavior` | Integer | Rollover/forfeit |
| `monthlyFee` | Decimal | Recurring charge |

### Retainer Behavior Options

| Option | Description |
|--------|-------------|
| Forfeit | Unused hours lost at month end |
| Rollover | Unused hours carry to next month |
| Rollover (capped) | Carry forward up to limit |

## Per Device Configuration

### Per Device Fields

| Field | Type | Description |
|-------|------|-------------|
| `deviceRate` | Decimal | Fee per device |
| `deviceType` | Integer | CI type filter |
| `minimumDevices` | Integer | Minimum billable count |

### Device Categories

| Category | Typical Rate Range |
|----------|-------------------|
| Workstations | $15-50/month |
| Servers | $100-300/month |
| Network Devices | $25-75/month |
| Mobile Devices | $10-25/month |

## Service Level Agreements (SLAs)

### SLA Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | String (100) | SLA name |
| `responseTimeCritical` | Integer | Minutes to respond (P1) |
| `responseTimeHigh` | Integer | Minutes to respond (P2) |
| `responseTimeMedium` | Integer | Minutes to respond (P3) |
| `responseTimeLow` | Integer | Minutes to respond (P4) |
| `resolutionTimeCritical` | Integer | Minutes to resolve (P1) |
| `resolutionTimeHigh` | Integer | Minutes to resolve (P2) |
| `resolutionTimeMedium` | Integer | Minutes to resolve (P3) |
| `resolutionTimeLow` | Integer | Minutes to resolve (P4) |

### Example SLA Tiers

| Tier | Response P1 | Resolution P1 | Response P4 | Resolution P4 |
|------|-------------|---------------|-------------|---------------|
| Platinum | 15 min | 4 hours | 4 hours | 72 hours |
| Gold | 30 min | 8 hours | 8 hours | 5 days |
| Silver | 1 hour | 24 hours | 24 hours | 10 days |
| Bronze | 4 hours | 48 hours | 48 hours | 15 days |

## Billing Configurations

### Billing Frequency

| Frequency | Description |
|-----------|-------------|
| Monthly | First of each month |
| Quarterly | Every 3 months |
| Annually | Yearly billing |
| On-demand | Manual invoicing |

### Billing Fields

| Field | Type | Description |
|-------|------|-------------|
| `billingFrequency` | Integer | Frequency code |
| `billingDay` | Integer | Day of month (1-28) |
| `invoiceTerms` | Integer | Payment terms (Net 30, etc.) |
| `taxExempt` | Boolean | Tax exemption flag |

## API Examples

### Search Contracts

```json
{
  "filter": {
    "field": "status",
    "op": "eq",
    "value": 1
  },
  "maxRecords": 100
}
```

### Search by Company

```json
{
  "filter": {
    "field": "companyID",
    "op": "eq",
    "value": 12345
  }
}
```

### Search Expiring Contracts

```json
{
  "filter": {
    "op": "and",
    "items": [
      { "field": "status", "op": "eq", "value": 1 },
      { "field": "endDate", "op": "lt", "value": "2026-03-31" },
      { "field": "endDate", "op": "gt", "value": "2026-02-01" }
    ]
  }
}
```

### Search Block Hour Contracts

```json
{
  "filter": {
    "field": "contractType",
    "op": "eq",
    "value": 3
  }
}
```

### Create Contract

```json
{
  "companyID": 12345,
  "contractName": "Acme Corp Managed Services",
  "contractType": 2,
  "status": 1,
  "startDate": "2026-02-01",
  "endDate": "2027-01-31",
  "description": "24/7 managed services agreement",
  "serviceLevelAgreementID": 1,
  "autoRenewal": true
}
```

## Contract Services

Services define what is included in a contract:

### Service Fields

| Field | Type | Description |
|-------|------|-------------|
| `contractID` | Integer | Parent contract |
| `serviceID` | Integer | Service definition |
| `unitPrice` | Decimal | Price per unit |
| `quantity` | Decimal | Included quantity |

### Common Services

| Service | Description | Unit |
|---------|-------------|------|
| Help Desk | Remote support | Hours or unlimited |
| On-site Support | Physical visits | Hours |
| Monitoring | 24/7 monitoring | Per device |
| Backup | Backup services | Per GB or device |
| Security | AV/EDR | Per endpoint |
| Patching | Update management | Per device |

## Contract Exclusions

Define what is NOT covered:

| Exclusion Type | Example |
|----------------|---------|
| Hardware | Physical repairs/replacement |
| Third-party Software | Vendor support fees |
| After-hours | Weekend/holiday work |
| Projects | Large implementations |
| Training | End-user education |

## Common Workflows

### Contract Creation

1. Verify company exists in CRM
2. Select appropriate contract type
3. Configure billing settings
4. Attach SLA template
5. Add included services
6. Set exclusions
7. Activate contract

### Renewal Management

1. Search contracts expiring in 90 days
2. Review contract utilization
3. Propose renewal terms
4. Create renewal contract
5. Link to original contract
6. Deactivate expired contract

### Block Hours Monitoring

1. Query contract balance
2. Calculate burn rate
3. Alert if >75% consumed
4. Propose additional block purchase
5. Update contract if approved

## Related Resources

- [Tickets Reference](/msp-claude-plugins/reference/autotask/tickets/) - Work against contracts
- [Time Entries Reference](/msp-claude-plugins/reference/autotask/time-entries/) - Billing time entries
- [Configuration Items Reference](/msp-claude-plugins/reference/autotask/configuration-items/) - Per-device billing
- [API Patterns](/msp-claude-plugins/reference/autotask/api-patterns/) - Query operators and authentication
