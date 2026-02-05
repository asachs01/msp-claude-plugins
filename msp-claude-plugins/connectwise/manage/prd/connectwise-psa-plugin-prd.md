# ConnectWise PSA Plugin PRD

## Overview

Claude Code plugin for ConnectWise PSA (formerly Manage) - the industry-leading PSA platform for MSPs.

## Product Details

| Attribute | Value |
|-----------|-------|
| Vendor | ConnectWise |
| Product | PSA (Manage) |
| API Type | REST |
| Auth Method | API Key (Public/Private) + Client ID |
| Rate Limit | 60 requests/minute |
| Node.js Library | `connectwise-rest` (existing, TypeScript) |

## API Endpoints

Base URLs:
- NA Cloud: `https://api-na.myconnectwise.net/{codebase}/apis/3.0/`
- EU Cloud: `https://api-eu.myconnectwise.net/{codebase}/apis/3.0/`
- AU Cloud: `https://api-au.myconnectwise.net/{codebase}/apis/3.0/`

## Skills to Implement

### 1. tickets
Service desk ticket management:
- Ticket CRUD operations
- Status values and workflows
- Priority levels (1-4, lower = higher priority)
- Service boards and queues
- Ticket notes and time entries
- SLA tracking

### 2. companies
Company/account management:
- Company CRUD
- Company types and statuses
- Sites/locations
- Custom fields
- Company notes

### 3. contacts
Contact management:
- Contact CRUD
- Contact types
- Communication items (email, phone)
- Portal access
- Relationship to companies

### 4. projects
Project management:
- Project CRUD
- Project phases and tickets
- Project templates
- Resource allocation
- Budget tracking

### 5. time-entries
Time tracking:
- Time entry CRUD
- Billable vs non-billable
- Work types and work roles
- Approval workflows
- Time sheet management

### 6. api-patterns
Common API patterns:
- Authentication (public/private key + clientId)
- Pagination (page/pageSize, up to 1000)
- Conditions syntax (field operator value)
- Rate limiting (60/min)
- Error handling

## Commands to Implement

### /create-ticket
Create a ConnectWise PSA ticket with:
- Company lookup/validation
- Contact association
- Board/status/priority selection
- Initial description

### /search-tickets
Search tickets with filters:
- Company
- Status
- Priority
- Date range
- Assignee

## Environment Variables

```bash
CONNECTWISE_COMPANY_ID="your-company-id"
CONNECTWISE_PUBLIC_KEY="your-public-key"
CONNECTWISE_PRIVATE_KEY="your-private-key"
CONNECTWISE_CLIENT_ID="your-client-id"
CONNECTWISE_SITE="api-na.myconnectwise.net"  # or api-eu, api-au
```

## Directory Structure

```
connectwise/manage/
├── .claude-plugin/
│   └── plugin.json
├── README.md
├── prd/
│   └── connectwise-psa-plugin-prd.md
├── skills/
│   ├── tickets/SKILL.md
│   ├── companies/SKILL.md
│   ├── contacts/SKILL.md
│   ├── projects/SKILL.md
│   ├── time-entries/SKILL.md
│   └── api-patterns/SKILL.md
├── commands/
│   ├── create-ticket.md
│   └── search-tickets.md
└── agents/
```

## References

- [ConnectWise Developer Portal](https://developer.connectwise.com/)
- [connectwise-rest npm](https://www.npmjs.com/package/connectwise-rest)
- [ConnectWise REST API Docs](https://developer.connectwise.com/Products/ConnectWise_PSA)
