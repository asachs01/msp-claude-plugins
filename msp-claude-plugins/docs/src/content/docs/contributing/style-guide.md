---
title: Style Guide
description: Code and documentation style guidelines for MSP Claude Plugins
sidebar:
  order: 3
---

This guide establishes consistent standards for code, documentation, and API examples across MSP Claude Plugins.

## Markdown Formatting

### Document Structure

Every documentation file should follow this structure:

```markdown
---
title: Page Title
description: Brief description for SEO and previews
sidebar:
  order: 1  # Optional: controls sidebar ordering
---

Introduction paragraph explaining what this page covers.

## Main Section

Content organized under H2 headings.

### Subsection

More detailed content under H3 headings.
```

### Heading Hierarchy

| Level | Usage |
|-------|-------|
| H1 (`#`) | Never use - title comes from frontmatter |
| H2 (`##`) | Main sections |
| H3 (`###`) | Subsections |
| H4 (`####`) | Rarely needed - consider restructuring |

### Code Blocks

Always specify the language for syntax highlighting:

````markdown
```typescript
// TypeScript code
const result = await searchTickets({ status: 'Open' });
```

```bash
# Shell commands
npm install @msp-plugins/autotask
```

```json
{
  "key": "value"
}
```
````

### Tables

Use tables for structured data:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |
```

### Admonitions

Use Starlight's built-in admonition components:

```markdown
:::note
Helpful information that isn't critical.
:::

:::tip
Best practices or shortcuts.
:::

:::caution
Important warning that could cause issues.
:::

:::danger
Critical warning that could cause data loss or security issues.
:::
```

---

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| Documentation files | `kebab-case.md` | `getting-started.md` |
| Directories | `kebab-case` | `api-reference/` |
| TypeScript files | `camelCase.ts` | `ticketClient.ts` |
| Type definition files | `camelCase.ts` | `ticketTypes.ts` |
| Test files | `*.test.ts` | `ticketClient.test.ts` |

### Code Naming

#### Variables and Functions

```typescript
// camelCase for variables and functions
const ticketCount = 10;
const isActive = true;

function searchTickets() { }
async function createTicketNote() { }
```

#### Types and Interfaces

```typescript
// PascalCase for types and interfaces
interface TicketSearchParams { }
type TicketStatus = 'Open' | 'Closed';
interface AutotaskCompany { }
```

#### Constants

```typescript
// SCREAMING_SNAKE_CASE for constants
const MAX_RESULTS = 500;
const API_TIMEOUT_MS = 30000;
const DEFAULT_PAGE_SIZE = 25;
```

#### MCP Command Names

```typescript
// snake_case prefixed with vendor name
'autotask_search_tickets'
'autotask_create_ticket'
'autotask_get_ticket_details'
'connectwise_search_companies'
```

---

## API Example Standards

### Command Documentation Template

Every MCP command should be documented with:

1. **Description** - What the command does
2. **Parameters** - Table of all parameters
3. **Example Request** - JSON example
4. **Example Response** - JSON example with explanation
5. **Error Handling** - Common errors and solutions

### Parameter Tables

```markdown
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | `number` | Yes | The Autotask company ID |
| `status` | `string` | No | Filter by ticket status |
| `limit` | `number` | No | Max results (default: 25, max: 500) |
```

### Example Requests

Always show realistic, working examples:

```json
{
  "companyId": 12345,
  "status": "Open",
  "limit": 10
}
```

**Do:**
- Use realistic but fake data
- Include all required parameters
- Show optional parameters when helpful

**Don't:**
- Use placeholder values like `<company_id>`
- Use real customer data
- Omit required parameters

### Example Responses

Show the actual structure with sample data:

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": 98765,
        "title": "Email not syncing",
        "status": "Open",
        "priority": "High",
        "company": {
          "id": 12345,
          "name": "Acme Corp"
        },
        "createdDate": "2024-01-15T10:30:00Z"
      }
    ],
    "totalCount": 42,
    "pageInfo": {
      "hasNextPage": true,
      "cursor": "abc123"
    }
  }
}
```

### Error Examples

Document common errors:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_COMPANY_ID",
    "message": "Company with ID 99999 not found",
    "details": {
      "companyId": 99999
    }
  }
}
```

---

## Documentation Language

### Voice and Tone

- **Active voice**: "The command returns tickets" not "Tickets are returned by the command"
- **Direct**: "Run this command" not "You should run this command"
- **Concise**: Avoid unnecessary words

### Word Choices

| Use | Instead of |
|-----|------------|
| Use | Utilize |
| Start | Initialize, Commence |
| End | Terminate |
| Show | Display |
| Get | Retrieve, Fetch |
| Set | Configure, Establish |

### Technical Terms

Be consistent with these terms:

| Term | Usage |
|------|-------|
| MCP | Model Context Protocol (spell out on first use) |
| API | Always uppercase |
| CLI | Always uppercase |
| ID | Always uppercase |

### Formatting Conventions

| Element | Format |
|---------|--------|
| Command names | `backticks` |
| File paths | `backticks` |
| Parameter names | `backticks` |
| UI elements | **bold** |
| Emphasis | *italics* |
| New terms | *italics* on first use |

---

## Code Style

### TypeScript Guidelines

#### Imports

```typescript
// External packages first
import { z } from 'zod';

// Internal modules second
import { AutotaskClient } from './client';
import { TicketSearchParams } from './types';

// Group by type, separate with blank line
```

#### Type Definitions

```typescript
// Prefer interfaces for object shapes
interface TicketSearchParams {
  companyId?: number;
  status?: TicketStatus;
  limit?: number;
}

// Use type for unions and aliases
type TicketStatus = 'Open' | 'Closed' | 'InProgress';
type TicketId = number;
```

#### Function Signatures

```typescript
// Include return types
async function searchTickets(
  params: TicketSearchParams
): Promise<TicketSearchResult> {
  // implementation
}

// Use arrow functions for callbacks
const tickets = results.map((item) => transformTicket(item));
```

#### Error Handling

```typescript
// Always handle errors explicitly
try {
  const result = await client.searchTickets(params);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof AutotaskApiError) {
    return { success: false, error: error.toUserMessage() };
  }
  throw error; // Re-throw unexpected errors
}
```

### JSDoc Comments

```typescript
/**
 * Searches for tickets matching the specified criteria.
 *
 * @param params - Search parameters
 * @param params.companyId - Filter by company ID
 * @param params.status - Filter by ticket status
 * @returns Promise resolving to search results
 *
 * @example
 * const results = await searchTickets({ companyId: 123, status: 'Open' });
 */
async function searchTickets(params: TicketSearchParams): Promise<TicketSearchResult> {
  // implementation
}
```

---

## Checklist

Before submitting documentation:

- [ ] Frontmatter includes title and description
- [ ] Headings follow hierarchy (H2 > H3 > H4)
- [ ] Code blocks specify language
- [ ] All commands show example input and output
- [ ] Parameter tables are complete
- [ ] Links are working
- [ ] Spelling and grammar checked
- [ ] File follows naming conventions
