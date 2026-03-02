---
name: trace-message
description: Trace an email message through Proofpoint Essentials by sender, recipient, subject, or date range
arguments:
  - name: sender
    description: Sender email address or domain (e.g. user@example.com or @example.com)
    required: false
  - name: recipient
    description: Recipient email address or domain
    required: false
  - name: subject
    description: Full or partial email subject line
    required: false
  - name: start_date
    description: Start of search window in ISO 8601 UTC (e.g. 2026-03-01T00:00:00Z)
    required: false
  - name: end_date
    description: End of search window in ISO 8601 UTC (e.g. 2026-03-02T23:59:59Z)
    required: false
  - name: disposition
    description: Filter by message disposition (delivered, blocked, quarantined, deferred, bounced)
    required: false
  - name: org_id
    description: Proofpoint Essentials organization ID (required for MSP accounts)
    required: false
  - name: message_id
    description: Exact SMTP Message-ID header value for precise lookup
    required: false
---

# Proofpoint Essentials Message Trace

Trace an email message through Proofpoint Essentials to determine whether it was delivered, blocked, quarantined, or deferred — and why. This command is the primary tool for investigating email delivery issues and "where is my email?" requests from end users and clients.

## Prerequisites

- Proofpoint MCP server connected with valid Essentials API credentials
- `PROOFPOINT_PRINCIPAL`, `PROOFPOINT_SECRET`, and `PROOFPOINT_REGION` configured
- MCP tool `proofpoint_trace_message` available
- For MSP accounts: `org_id` of the target customer organization

## Steps

1. **Validate search parameters**

   At minimum, one of sender, recipient, subject, or message_id must be provided. If no date range is given, default to the last 24 hours (`startDate: now - 24h`, `endDate: now`). Warn the user if no search criteria are provided.

2. **Call message trace**

   Call `proofpoint_trace_message` with the provided parameters. If `org_id` is not provided and this is an MSP account, call `proofpoint_list_orgs` first to prompt the user to select an organization.

3. **Interpret results**

   For each matching message:
   - Report the `disposition` in plain language ("delivered to mailbox", "blocked by Proofpoint", "held in quarantine")
   - Explain the `filteringDecisions` — translate filter names and results into plain English
   - Note the `receivedTime` relative to when the user expected the email

4. **Handle no results**

   If no messages are found:
   - Widen the date range if a narrow window was specified
   - Try relaxing the subject filter (remove it and search by sender + recipient only)
   - Try searching by domain (`@example.com`) instead of full address
   - Remind the user that Essentials logs are retained for 30 days

5. **Provide resolution guidance**

   Based on the disposition, advise the user:
   - **Delivered** — Email arrived; check spam folder in email client, check forwarding rules
   - **Blocked** — Explain why (spam score, URLDefense, DMARC fail); advise sender correction or allow-list addition
   - **Quarantined** — User can release from their quarantine portal; advise safe-sender listing
   - **Deferred** — Email is queued; delivery usually completes within minutes to hours
   - **Bounced** — Recipient address may be incorrect or the destination mail server refused delivery

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| sender | string | No* | — | Sender email or domain |
| recipient | string | No* | — | Recipient email or domain |
| subject | string | No* | — | Full or partial subject |
| start_date | string | No | Last 24 hours | ISO 8601 UTC start timestamp |
| end_date | string | No | Now | ISO 8601 UTC end timestamp |
| disposition | string | No | all | Filter: delivered, blocked, quarantined, deferred, bounced |
| org_id | string | No** | — | Essentials org ID (required for MSP) |
| message_id | string | No* | — | Exact SMTP Message-ID for precise lookup |

*At least one search criterion (sender, recipient, subject, or message_id) required.
**Required for MSP accounts managing multiple tenants.

## Examples

### Trace by Sender and Recipient

```
/trace-message --sender vendor@supplier.com --recipient accounts@client.com
```

### Trace Email Not Received Today

```
/trace-message --recipient user@client.com --start_date 2026-03-02T00:00:00Z --end_date 2026-03-02T23:59:59Z
```

### Find All Blocked Emails from a Domain

```
/trace-message --sender @suspicious-domain.com --disposition blocked --org_id acme-corp-us
```

### Trace by Subject (Wide Search)

```
/trace-message --subject "Invoice March 2026" --start_date 2026-03-01T00:00:00Z
```

## Error Handling

- **No results found:** Widen date range; remove subject filter; search by domain instead of full address
- **401 Unauthorized:** Verify Essentials credentials (not TAP) are configured
- **org_id required:** MSP accounts must specify the target org — call `/org-email-stats` to list available org IDs
- **Date format error:** Ensure dates are ISO 8601 UTC format (`2026-03-02T00:00:00Z`)

## Related Commands

- `/threat-summary` - Review TAP threat data for emails identified as malicious
- `/org-email-stats` - Get org ID list and email volume context
