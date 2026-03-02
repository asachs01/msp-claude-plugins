---
description: >
  Use this skill when tracing email messages through Proofpoint Essentials —
  searching by sender, recipient, subject, date range, and understanding
  message disposition (delivered, blocked, quarantined, deferred).
triggers:
  - proofpoint trace
  - message trace
  - email trace
  - email delivery
  - email tracking
  - proofpoint essentials message
  - did the email arrive
  - where is the email
  - email not received
  - email blocked proofpoint
---

# Proofpoint Essentials Message Trace

## Overview

Proofpoint Essentials message trace allows MSPs and administrators to track the journey of any email through Proofpoint's filtering pipeline. It answers questions like "Did this email arrive?", "Why was this email blocked?", and "Was this email quarantined?". Message trace searches the Essentials log for matching messages and returns disposition, filtering decisions, and timestamps.

Message trace operates at the Essentials tenant level — unlike TAP which is account-wide, Essentials message trace is scoped to a specific organization's email traffic.

## Key Concepts

### Message Dispositions

| Disposition | Meaning |
|-------------|---------|
| `delivered` | Message passed all filters and was delivered to the recipient's mailbox |
| `blocked` | Message was rejected outright — not queued, not quarantined |
| `quarantined` | Message was held in quarantine — recipient may release it |
| `deferred` | Message was accepted but delivery to the downstream mail server is pending |
| `bounced` | Message was returned to sender — recipient address invalid or server refused |

### Filtering Decisions

Proofpoint applies multiple filtering layers in sequence:

1. **Connection filtering** — IP reputation, SPF, DKIM, DMARC
2. **Content filtering** — Spam scoring, keyword rules
3. **Threat filtering** — URL scanning, attachment sandboxing (TAP integration)
4. **Policy rules** — Custom allow/block rules, quarantine policies

The trace log records which filters triggered and why the final disposition was applied.

### Search Dimensions

Message trace supports multiple search dimensions that can be combined:

- **Sender** — Full email address or domain (`@example.com`)
- **Recipient** — Full email address or domain
- **Subject** — Partial or full subject line
- **Date range** — UTC start and end timestamps
- **Message ID** — Exact SMTP Message-ID header value
- **Disposition** — Filter by final delivery status

## API Patterns

### Trace a Message

```
proofpoint_trace_message
```

Parameters:
- `sender` — Sender email address or domain (optional but recommended)
- `recipient` — Recipient email address or domain (optional but recommended)
- `subject` — Full or partial subject line (optional)
- `startDate` — Start of search window (ISO 8601 UTC, e.g., `2026-03-01T00:00:00Z`)
- `endDate` — End of search window (ISO 8601 UTC, e.g., `2026-03-02T00:00:00Z`)
- `messageId` — Exact SMTP Message-ID (optional, most precise)
- `disposition` — Filter by status: `delivered`, `blocked`, `quarantined`, `deferred`, `bounced`
- `orgId` — Essentials organization ID (required for MSP accounts managing multiple tenants)
- `page` — Page number (default: 1)
- `size` — Results per page (default: 25, max: 100)

**Example — trace by sender and recipient:**

```json
{
  "tool": "proofpoint_trace_message",
  "parameters": {
    "sender": "vendor@supplier.com",
    "recipient": "accounts@client.com",
    "startDate": "2026-03-01T00:00:00Z",
    "endDate": "2026-03-02T23:59:59Z",
    "orgId": "acme-corp"
  }
}
```

**Example response:**

```json
{
  "total": 2,
  "page": 1,
  "size": 25,
  "messages": [
    {
      "messageId": "<invoice-march@supplier.com>",
      "sender": "vendor@supplier.com",
      "recipient": "accounts@client.com",
      "subject": "March 2026 Invoice",
      "receivedTime": "2026-03-01T14:32:10Z",
      "disposition": "delivered",
      "spamScore": 2,
      "virusScore": 0,
      "quarantineFolder": null,
      "filteringDecisions": [
        {
          "filter": "SPF",
          "result": "pass"
        },
        {
          "filter": "DKIM",
          "result": "pass"
        },
        {
          "filter": "SpamFilter",
          "result": "allow",
          "score": 2
        }
      ],
      "size": 45231,
      "attachmentCount": 1
    },
    {
      "messageId": "<invoice-feb@supplier.com>",
      "sender": "vendor@supplier.com",
      "recipient": "accounts@client.com",
      "subject": "February 2026 Invoice",
      "receivedTime": "2026-03-01T09:10:05Z",
      "disposition": "delivered",
      "spamScore": 1,
      "virusScore": 0,
      "quarantineFolder": null,
      "filteringDecisions": [],
      "size": 38920,
      "attachmentCount": 1
    }
  ]
}
```

**Example — trace a blocked message:**

```json
{
  "tool": "proofpoint_trace_message",
  "parameters": {
    "recipient": "user@client.com",
    "startDate": "2026-03-02T08:00:00Z",
    "endDate": "2026-03-02T12:00:00Z",
    "disposition": "blocked",
    "orgId": "acme-corp"
  }
}
```

**Example response (blocked):**

```json
{
  "total": 1,
  "messages": [
    {
      "messageId": "<phish@evil.example.com>",
      "sender": "support@evil.example.com",
      "recipient": "user@client.com",
      "subject": "Urgent: Verify Your Account",
      "receivedTime": "2026-03-02T10:15:33Z",
      "disposition": "blocked",
      "spamScore": 95,
      "virusScore": 0,
      "quarantineFolder": null,
      "filteringDecisions": [
        {
          "filter": "SpamFilter",
          "result": "block",
          "score": 95,
          "reason": "High spam probability"
        },
        {
          "filter": "URLDefense",
          "result": "block",
          "reason": "Malicious URL detected in message body"
        }
      ],
      "size": 8420,
      "attachmentCount": 0
    }
  ]
}
```

## Common Workflows

### "Did My Email Arrive?" Investigation

1. Ask the user for sender address, recipient address, approximate send time, and subject
2. Set `startDate` to 2 hours before the expected arrival time
3. Set `endDate` to current time
4. Call `proofpoint_trace_message` with sender, recipient, and date range
5. If no results: widen the date range and try subject-only search
6. Report the disposition and filtering decisions to the user

### Blocked Email Root Cause Analysis

1. Identify the blocked message via `disposition: "blocked"`
2. Review `filteringDecisions` array — find the filter with `result: "block"`
3. Common causes:
   - **SpamFilter block** — high spam score; sender domain may need reputation repair or Proofpoint allow-list entry
   - **URLDefense block** — message contained a URL classified as malicious; legitimate senders should remove shortened/redirecting URLs
   - **DMARC fail** — sender's domain DMARC policy is reject and the message failed alignment; sender needs to fix their email authentication
   - **Blacklist** — sender IP or domain is on a third-party blocklist
4. Advise the client on the appropriate resolution

### Quarantine Investigation

1. Call `proofpoint_trace_message` with `disposition: "quarantined"`
2. Check `quarantineFolder` — common values: `Spam`, `Phish`, `Bulk`
3. Identify any legitimate emails incorrectly quarantined (false positives)
4. For false positives: advise the user to release from quarantine and add to safe sender list
5. For true positives: confirm no user action needed

### Bulk Sender Analysis (E.g., Newsletter Deliverability)

1. Search by sender domain: `sender: "@newsletter.example.com"`
2. Use a 7-day window
3. Review disposition distribution: how many delivered vs quarantined vs blocked?
4. If high quarantine rate: check spam scores and filtering decisions
5. If legitimate bulk sender: recommend adding to Proofpoint Essentials allow-list

### Date Range Selection Guide

| Scenario | Recommended Window |
|----------|--------------------|
| User reports missing email from today | Last 24 hours |
| User reports missing email from "this week" | Last 7 days |
| Investigating a specific meeting invite | ±2 hours around reported send time |
| Monthly email deliverability audit | 30-day window, run per org |

## Error Handling

### No Results Returned

Not an error — it means no matching messages in the queried window. Try:
1. Widening the date range (Essentials logs are retained for 30 days by default)
2. Removing the subject filter (subject matching is case-sensitive in some regions)
3. Searching by domain instead of full email address (`@example.com` instead of `user@example.com`)
4. Verifying the correct `orgId` — MSP accounts must specify the tenant org

### Wrong orgId

If you query without an `orgId` or with an incorrect `orgId`, results may be empty or return data for a different tenant. Always confirm the org ID when tracing messages for a specific MSP customer.

### Date Format Errors

Dates must be ISO 8601 UTC format: `2026-03-01T00:00:00Z`. Formats like `03/01/2026` or `March 1st` will fail — always convert to ISO 8601 before calling the tool.

### Log Retention Limits

Proofpoint Essentials retains message logs for **30 days** by default. Queries older than 30 days return no results. Advise clients to export logs if longer retention is needed.

## Best Practices

- Always include a date range — unbounded queries are slow and may time out
- Combine sender + recipient + date range for the most precise results
- When investigating "email not received" reports, check quarantined messages first — users often overlook their spam folder
- Use `disposition: "quarantined"` queries during weekly reviews to catch false positives before users complain
- Present filtering decisions in plain language: "Proofpoint blocked this email because the spam score was 95/100" rather than raw JSON
- For deliverability issues, check SPF, DKIM, and DMARC decisions in `filteringDecisions` — misconfigurations are common root causes
- Always confirm the time zone with the user before converting to UTC — "I sent it at 9am" needs a time zone to be actionable

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication, region selection, Essentials vs TAP distinction
- [threats](../threats/SKILL.md) - For emails blocked due to threat detection (TAP)
- [msp-management](../msp-management/SKILL.md) - List org IDs for MSP message trace queries
