# HaloPSA Ticket Field Reference

## Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Auto-generated unique identifier |
| `summary` | string(255) | Yes | Brief issue summary/title |
| `details` | text | No | Detailed description (HTML supported) |
| `client_id` | int | Yes | Client/customer reference |
| `site_id` | int | No | Site/location within client |
| `user_id` | int | No | End user/contact for ticket |

## Classification Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status_id` | int | Yes | Current status |
| `priority_id` | int | Yes | Urgency level |
| `tickettype_id` | int | Yes | Ticket type (Incident, Request, etc.) |
| `category_1` | string | No | Primary category |
| `category_2` | string | No | Sub-category |
| `category_3` | string | No | Tertiary category |
| `category_4` | string | No | Fourth-level category |

## Assignment Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_id` | int | No | Assigned technician |
| `team_id` | int | No | Assigned team/group |
| `reportedby` | string | No | Who reported the issue |

## Timeline Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dateoccurred` | datetime | No | When issue occurred |
| `datecreated` | datetime | System | When ticket was created |
| `dateresponded` | datetime | System | First response timestamp |
| `dateresolved` | datetime | System | Resolution timestamp |
| `dateclosed` | datetime | System | Closure timestamp |
| `deadlinedate` | datetime | No | SLA deadline |

## SLA Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sla_id` | int | No | Associated SLA |
| `slaresponsestate` | int | System | Response SLA state (0=Not Started, 1=Running, 2=Paused, 3=Met, 4=Breached) |
| `slaresolutionstate` | int | System | Resolution SLA state |
| `slahold` | bool | No | Is SLA paused |

## Contract & Billing Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contract_id` | int | No | Associated contract |
| `opportunityid` | int | No | Linked opportunity |
| `chargeabletime` | decimal | System | Total billable time |
| `nonchargeabletime` | decimal | System | Total non-billable time |
