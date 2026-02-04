---
title: PRD Requirements
description: Requirements checklist for Product Requirements Documents
sidebar:
  order: 2
---

All new plugins and significant features require a Product Requirements Document (PRD) before implementation. This ensures alignment on scope, approach, and deliverables.

## PRD Checklist

Use this checklist to ensure your PRD is complete:

### Required Sections

- [ ] **Problem Statement** - Clear description of the problem being solved
- [ ] **User Stories** - At least 3 user stories in standard format
- [ ] **Scope Definition** - What's in and out of scope
- [ ] **API Research** - Documentation of vendor API capabilities
- [ ] **Technical Approach** - High-level implementation strategy
- [ ] **Success Criteria** - Measurable outcomes for completion

### Optional Sections

- [ ] Security considerations
- [ ] Performance requirements
- [ ] Migration plan (for breaking changes)
- [ ] Rollout strategy

---

## Section Details

### Problem Statement

Clearly articulate the problem this feature solves for MSP technicians.

**Good Example:**
> MSP technicians need to quickly search and view Autotask tickets from Claude Code without context-switching to the Autotask web interface. Currently, looking up a ticket requires opening a browser, logging in, and navigating to the ticket, which takes 30-60 seconds and breaks flow.

**Bad Example:**
> We need Autotask ticket support.

### User Stories

Write user stories in the standard format:

```
As a [role], I want to [action] so that [benefit].
```

**Minimum Requirements:**
- At least 3 user stories
- Each story must include the benefit/value
- Stories should cover primary use cases

**Example User Stories:**

| # | User Story | Priority |
|---|------------|----------|
| 1 | As a **helpdesk technician**, I want to **search tickets by company name** so that **I can quickly find all open issues for a client**. | High |
| 2 | As a **service manager**, I want to **view ticket details including notes** so that **I can understand the full history without opening Autotask**. | High |
| 3 | As a **technician**, I want to **create tickets from Claude Code** so that **I can log issues while working in the terminal**. | Medium |
| 4 | As a **dispatcher**, I want to **update ticket status** so that **I can manage workflow without switching applications**. | Medium |

### Scope Definition

Clearly define boundaries to prevent scope creep.

#### In Scope

List specific features that will be delivered:

- [ ] Search tickets by company, status, queue
- [ ] View ticket details with notes
- [ ] Create new tickets
- [ ] Update ticket status

#### Out of Scope

Explicitly state what will NOT be included:

- Time entry management (future phase)
- Ticket merging
- SLA calculations
- Custom field management

### API Research

Document your research on the vendor API.

#### API Documentation Links

| Resource | URL |
|----------|-----|
| API Overview | https://vendor.com/api/docs |
| Authentication | https://vendor.com/api/auth |
| Rate Limits | https://vendor.com/api/limits |

#### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/tickets` | GET | Search/list tickets |
| `/tickets/{id}` | GET | Get ticket details |
| `/tickets` | POST | Create ticket |
| `/tickets/{id}` | PATCH | Update ticket |

#### Authentication Method

Describe how authentication works:

```
API Zone: webservices[X].autotask.net
Authentication: API user credentials + Integration Code
Headers:
  - ApiIntegrationCode: <integration_code>
  - UserName: <api_username>
  - Secret: <api_secret>
```

#### Rate Limits

| Limit Type | Value |
|------------|-------|
| Requests per minute | 60 |
| Requests per hour | 3,600 |
| Concurrent connections | 5 |

#### Known Limitations

- Maximum 500 results per query
- Some fields require additional API calls
- Webhook support not available for all events

### Technical Approach

Outline your implementation strategy.

#### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   MCP Command   │────▶│     Skill       │────▶│   API Client    │
│                 │     │                 │     │                 │
│ search_tickets  │     │ searchTickets() │     │ GET /tickets    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

#### Technology Choices

| Component | Choice | Rationale |
|-----------|--------|-----------|
| HTTP Client | `fetch` | Built-in, no dependencies |
| Validation | `zod` | Type-safe schema validation |
| Caching | None | Real-time data required |

#### Key Design Decisions

1. **Pagination Strategy**: Use cursor-based pagination for large result sets
2. **Error Handling**: Map vendor errors to user-friendly messages
3. **Caching**: No caching for ticket data (must be real-time)

### Success Criteria

Define measurable outcomes.

| Criteria | Target | Measurement |
|----------|--------|-------------|
| Commands implemented | 4 | Count of working commands |
| Test coverage | > 80% | Jest coverage report |
| Response time | < 2s | Average API response time |
| Documentation | Complete | All commands documented |

---

## PRD Template

Use this template for your PRD:

```markdown
# PRD: [Feature Name]

## Problem Statement

[Describe the problem being solved]

## User Stories

| # | User Story | Priority |
|---|------------|----------|
| 1 | As a ..., I want to ... so that ... | High/Medium/Low |

## Scope

### In Scope
- [ ] Feature 1
- [ ] Feature 2

### Out of Scope
- Feature X (reason)
- Feature Y (future phase)

## API Research

### Documentation
- [API Docs](url)

### Endpoints Required
| Endpoint | Method | Purpose |
|----------|--------|---------|

### Authentication
[Describe auth method]

### Rate Limits
[Document limits]

### Known Limitations
- Limitation 1
- Limitation 2

## Technical Approach

### Architecture
[Diagram or description]

### Key Decisions
1. Decision 1: Rationale
2. Decision 2: Rationale

## Success Criteria

| Criteria | Target |
|----------|--------|
| Metric 1 | Value |
| Metric 2 | Value |

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 | X weeks | Deliverable |
```

---

## Submission Process

1. Create your PRD using the template above
2. Save to `prds/in-review/your-feature-name.md`
3. Open a PR with title: `prd: [Feature Name]`
4. Request review from maintainers
5. Address feedback and iterate
6. Once approved, PRD moves to `prds/approved/`
7. Begin implementation

## Review Criteria

PRDs are evaluated on:

- **Clarity**: Is the problem and solution clearly explained?
- **Completeness**: Are all required sections filled out?
- **Feasibility**: Is the technical approach realistic?
- **Value**: Does this benefit MSP technicians?
- **Scope**: Is the scope appropriate for a single PR?
