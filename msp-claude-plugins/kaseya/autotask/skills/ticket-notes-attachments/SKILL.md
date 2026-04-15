---
description: >
  Use this skill when working with Autotask ticket notes, ticket attachments,
  and ticket charges — retrieving individual notes, downloading attachments,
  managing labor charges on tickets. Supplements the core tickets skill with
  the secondary entities attached to tickets.
triggers:
  - autotask ticket note
  - autotask ticket attachment
  - autotask ticket charge
  - get ticket note autotask
  - download ticket attachment
  - ticket charges autotask
  - autotask labor charge
  - autotask ticket charges
  - search ticket notes autotask
  - search ticket attachments autotask
---

# Autotask Ticket Notes, Attachments, and Charges

## Overview

Beyond the core ticket record, Autotask tickets accumulate notes (internal/external communications), file attachments, and charges (labor and expenses billed directly to a ticket). This skill covers retrieval and management of these secondary ticket entities.

## API Patterns

### Ticket Notes

#### Get a Single Ticket Note

Tool: `autotask_get_ticket_note`

Parameters:
- `id` (required) — The ticket note ID

Returns the full note content including author, creation time, note type (internal/external), and HTML/text body.

#### Search Ticket Notes

Tool: `autotask_search_ticket_notes`

Key parameters:
- `ticketId` — Filter notes for a specific ticket
- `noteType` — Filter by note type (internal vs. external/visible to client)
- `createdAfter` / `createdBefore` — Date range
- `page` / `pageSize` — Pagination

### Ticket Attachments

#### Get a Ticket Attachment

Tool: `autotask_get_ticket_attachment`

Parameters:
- `id` (required) — The attachment ID

Returns attachment metadata and base64-encoded file content.

#### Search Ticket Attachments

Tool: `autotask_search_ticket_attachments`

Key parameters:
- `ticketId` — Filter attachments for a specific ticket
- `page` / `pageSize` — Pagination

### Ticket Charges

#### Get a Ticket Charge

Tool: `autotask_get_ticket_charge`

Parameters:
- `id` (required) — The ticket charge ID

Returns charge details including amount, description, billing status, and associated ticket.

#### Create a Ticket Charge

Tool: `autotask_create_ticket_charge`

Key parameters:
- `ticketId` (required) — Ticket to attach the charge to
- `name` (required) — Charge description
- `amount` (required) — Charge amount
- `isBillable` — Whether to bill to the client

#### Update a Ticket Charge

Tool: `autotask_update_ticket_charge`

Parameters:
- `id` (required) — Charge ID to update
- `amount`, `name`, `isBillable` — Fields to modify

#### Delete a Ticket Charge

Tool: `autotask_delete_ticket_charge`

Parameters:
- `id` (required) — Charge ID to delete

Use with care — deleted charges cannot be recovered.

#### Search Ticket Charges

Tool: `autotask_search_ticket_charges`

Key parameters:
- `ticketId` — Filter charges for a specific ticket
- `isBillable` — Filter by billability
- `page` / `pageSize` — Pagination

## Common Workflows

### Review All Activity on a Ticket

1. Use `autotask_get_ticket_details` to get the core ticket
2. Use `autotask_search_ticket_notes` with `ticketId` to retrieve all notes
3. Use `autotask_search_ticket_attachments` with `ticketId` to list files
4. Use `autotask_search_ticket_charges` with `ticketId` to see charges

### Add a Charge to a Ticket

1. Verify the ticket exists with `autotask_get_ticket_details`
2. Call `autotask_create_ticket_charge` with ticket ID, name, amount
3. Confirm charge appears with `autotask_search_ticket_charges`

### Export Ticket Notes for a Client Report

1. Use `autotask_search_ticket_notes` filtered by `ticketId` and `noteType` (external only)
2. Collect and format note bodies for the report

## Notes

- Ticket note types determine client visibility — internal notes are not visible in client portals
- Attachments are returned as base64-encoded content; large files may impact response size
- Ticket charges are separate from time entries; use the `time-entries` skill for time-based billing
- Charges must be approved before appearing on invoices — see the `billing` skill for approval workflows
