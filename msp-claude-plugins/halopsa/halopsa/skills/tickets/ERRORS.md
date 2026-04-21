# HaloPSA Ticket Error Reference

## Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Invalid field value | Verify picklist IDs for your instance |
| 400 | Client ID required | All tickets need a client |
| 401 | Unauthorized | Refresh OAuth token |
| 403 | Insufficient permissions | Check API application permissions |
| 404 | Ticket not found | Confirm ticket ID exists |
| 429 | Rate limited | Implement exponential backoff |

## Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| client_id required | Missing client | All tickets need a client |
| tickettype_id invalid | Unknown type | Query `/api/TicketType` for valid IDs |
| status_id invalid | Unknown status | Query `/api/Status` for valid IDs |
| priority_id invalid | Unknown priority | Query `/api/Priority` for valid IDs |
