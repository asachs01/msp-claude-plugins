# ConnectWise PSA Ticket — Field Reference

Complete field reference for `/service/tickets`. For quick-start usage see [SKILL.md](./SKILL.md).

## Core Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `id` | int | System | Auto-generated |
| `summary` | string(100) | Yes | `"Unable to access email"` |
| `board` | object | Yes | `{id: 1}` or `{name: "Service Desk"}` |
| `company` | object | Yes | `{id: 12345}` or `{identifier: "CompanyID"}` |
| `status` | object | No | `{id: statusId}` or `{name: "New"}` |
| `contact` | object | No | `{id: contactId}` |
| `site` | object | No | `{id: siteId}` |

## Classification Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `priority` | object | No | `{id: 2}` |
| `type` | object | No | `{id: typeId}` — Service, Problem, Incident, etc. |
| `subType` | object | No | `{id: subTypeId}` |
| `item` | object | No | `{id: itemId}` — further categorization |
| `source` | object | No | `{id: sourceId}` — Email, Phone, Portal, etc. |
| `severity` | string | No | `Low`, `Medium`, `High` |
| `impact` | string | No | `Low`, `Medium`, `High` |

## Assignment Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `owner` | object | No | `{id: memberId}` |
| `resources` | string | No | Assigned member identifier |
| `team` | object | No | `{id: teamId}` |
| `serviceLocation` | object | No | `{id: locationId}` |

## SLA & Timeline Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dateEntered` | datetime | System | Creation timestamp |
| `requiredDate` | datetime | No | Customer-requested deadline |
| `budgetHours` | decimal | No | Estimated hours |
| `actualHours` | decimal | System | Hours logged |
| `billTime` | string | No | `Billable`, `DoNotBill`, `NoCharge` |
| `sla` | object | No | SLA configuration reference |
| `_info/sla_respond_by` | datetime | System | Response SLA deadline |
| `_info/sla_plan_by` | datetime | System | Plan SLA deadline |
| `_info/sla_resolve_by` | datetime | System | Resolution SLA deadline |

## Resolution Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `closedDate` | datetime | System | When ticket was closed |
| `closedBy` | string | System | Member who closed |
| `closedFlag` | boolean | No | Whether ticket is closed |
| `resolution` | string | Conditional | **Required** when closing a ticket |
