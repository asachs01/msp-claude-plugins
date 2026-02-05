---
name: ninjaone-create-ticket
description: Create a new ticket in NinjaOne
arguments:
  - name: subject
    description: Ticket subject/title
    required: true
  - name: organization
    description: Organization name or ID
    required: true
  - name: description
    description: Detailed description of the issue
    required: false
  - name: priority
    description: Priority level (critical, high, medium, low)
    required: false
  - name: device_id
    description: Link to a specific device
    required: false
---

Create a new ticket in NinjaOne for "$ARGUMENTS.organization".

## Ticket Details
- **Subject:** $ARGUMENTS.subject
- **Priority:** $ARGUMENTS.priority (default: MEDIUM)
- **Description:** $ARGUMENTS.description
- **Device:** $ARGUMENTS.device_id (if specified)

## Instructions

1. Resolve organization name to ID if needed
2. Validate the device belongs to the organization (if device_id provided)
3. Create the ticket via API
4. Return the ticket ID and confirmation

## API Endpoint

```http
POST /api/v2/ticketing/ticket
Content-Type: application/json

{
  "clientId": {org_id},
  "subject": "{subject}",
  "description": "{description}",
  "priority": "{PRIORITY}",
  "status": "OPEN",
  "deviceId": {device_id}
}
```

## Output Format

### Ticket Created

**Ticket ID:** {ticket_id}
**Subject:** {subject}
**Organization:** {org_name}
**Priority:** {priority}
**Status:** Open

{if device linked}
**Linked Device:** {device_name}
{/if}

### Next Steps
- Assign to technician
- Add additional details
- Link related alerts
