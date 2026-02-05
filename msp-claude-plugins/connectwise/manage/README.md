# ConnectWise PSA Plugin

Claude Code plugin for ConnectWise PSA (formerly Manage) - the industry-leading professional services automation platform for MSPs.

## Overview

This plugin provides Claude with deep knowledge of ConnectWise PSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets with full workflow support
- **Company Management** - Company CRUD, sites, types, and custom fields
- **Contact Management** - Contact operations, communication items, and portal access
- **Project Management** - Project creation, phases, templates, and resource allocation
- **Time Entry Tracking** - Log billable and non-billable time with work types

## Prerequisites

### API Credentials

You need ConnectWise PSA API credentials:

- **Company ID** - Your ConnectWise company identifier (codebase)
- **Public Key** - API member public key
- **Private Key** - API member private key
- **Client ID** - Registered application client ID

To obtain credentials:
1. Log into ConnectWise PSA
2. Navigate to System > Members > API Members
3. Create or select an API member
4. Generate public/private key pair
5. Register your application to get a Client ID at the [ConnectWise Developer Portal](https://developer.connectwise.com/)

### Environment Variables

Set the following environment variables:

```bash
export CONNECTWISE_COMPANY_ID="your-company-id"
export CONNECTWISE_PUBLIC_KEY="your-public-key"
export CONNECTWISE_PRIVATE_KEY="your-private-key"
export CONNECTWISE_CLIENT_ID="your-client-id"
export CONNECTWISE_SITE="api-na.myconnectwise.net"  # or api-eu, api-au
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. Skills and commands will be automatically available

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management, statuses, priorities, boards, notes, SLA |
| `companies` | Company CRUD, types, sites, custom fields |
| `contacts` | Contact management, communication items, portal access |
| `projects` | Project CRUD, phases, templates, resource allocation |
| `time-entries` | Time entry CRUD, billable/non-billable, work types |
| `api-patterns` | Authentication, pagination, conditions syntax, rate limiting |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket with company lookup and board selection |
| `/search-tickets` | Search tickets with filters (company, status, priority, date, assignee) |

## API Reference

### Base URLs

| Region | URL |
|--------|-----|
| North America | `https://api-na.myconnectwise.net/{codebase}/apis/3.0/` |
| Europe | `https://api-eu.myconnectwise.net/{codebase}/apis/3.0/` |
| Australia | `https://api-au.myconnectwise.net/{codebase}/apis/3.0/` |

Replace `{codebase}` with your company identifier.

### Authentication

ConnectWise PSA uses Basic Authentication with a combined credential string:

```
Authorization: Basic base64({companyId}+{publicKey}:{privateKey})
clientId: {your-client-id}
```

**Example Header:**
```http
GET /v4_6_release/apis/3.0/service/tickets
Authorization: Basic Y29tcGFueStwdWJsaWNrZXk6cHJpdmF0ZWtleQ==
clientId: your-client-id-here
Content-Type: application/json
```

### Pagination

ConnectWise uses `page` and `pageSize` query parameters:

| Parameter | Description | Default | Max |
|-----------|-------------|---------|-----|
| `page` | Page number (1-based) | 1 | - |
| `pageSize` | Records per page | 25 | 1000 |

**Example:**
```http
GET /service/tickets?page=1&pageSize=100
```

### Conditions Syntax

Filter results using the `conditions` query parameter:

**Syntax:** `conditions=field operator value`

**Operators:**
| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equals | `status/id=1` |
| `!=` | Not equals | `status/id!=5` |
| `<` | Less than | `priority/id<3` |
| `<=` | Less than or equal | `priority/id<=2` |
| `>` | Greater than | `dateEntered>2024-01-01` |
| `>=` | Greater than or equal | `dateEntered>=2024-01-01` |
| `contains` | Contains substring | `summary contains "email"` |
| `like` | Pattern match | `summary like "%email%"` |
| `in` | In list | `status/id in (1,2,3)` |
| `not in` | Not in list | `status/id not in (5)` |

**Combining Conditions:**
```
conditions=company/id=12345 and status/id!=5 and priority/id<=2
```

**URL Encoding:**
```http
GET /service/tickets?conditions=company/id%3D12345%20and%20status/id!%3D5
```

### Rate Limiting

- **Limit:** 60 requests per minute per API member
- **Headers:** Rate limit info returned in response headers
- **429 Response:** Retry after the specified time

**Rate Limit Headers:**
| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per minute |
| `X-RateLimit-Remaining` | Remaining requests in window |
| `X-RateLimit-Reset` | Seconds until limit resets |

### Common Endpoints

| Resource | Endpoint |
|----------|----------|
| Tickets | `/service/tickets` |
| Companies | `/company/companies` |
| Contacts | `/company/contacts` |
| Projects | `/project/projects` |
| Time Entries | `/time/entries` |
| Service Boards | `/service/boards` |
| Members | `/system/members` |

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Entity created |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Verify credentials |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Entity doesn't exist |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Retry with backoff |

### Error Response Format

```json
{
  "code": "InvalidArgument",
  "message": "The value 'invalid' is not valid for field 'status/id'.",
  "errors": [
    {
      "code": "InvalidArgument",
      "message": "status/id must be a valid integer"
    }
  ]
}
```

## API Documentation

- [ConnectWise Developer Portal](https://developer.connectwise.com/)
- [ConnectWise PSA REST API](https://developer.connectwise.com/Products/ConnectWise_PSA)
- [API Schema Browser](https://developer.connectwise.com/Products/ConnectWise_PSA/REST)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
