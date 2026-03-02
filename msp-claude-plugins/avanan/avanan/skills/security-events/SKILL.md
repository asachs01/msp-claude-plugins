---
description: >
  Use this skill when working with Check Point Avanan security events —
  searching events, getting event details, understanding event types
  (malware, phishing, DLP, spam), performing actions (quarantine, release,
  mark safe), and searching secured email entities.
triggers:
  - avanan event
  - harmony event
  - email security event
  - avanan threat
  - avanan quarantine
  - avanan phishing
  - avanan malware
  - avanan spam
  - avanan DLP
  - release from quarantine avanan
  - avanan mark safe
---

# Check Point Avanan Security Events

## Overview

Security events are the core operational data in Avanan. An event is created whenever Avanan detects a potential threat in a protected email or collaboration message. Events have a type, severity, status, and associated entities (the messages or files involved). MSPs review events, take action on threats (quarantine, release, mark safe), and investigate the scope of security incidents.

Avanan's retroactive remediation capability is a key differentiator — because Avanan connects via API (not MX records), it can quarantine a message that has already been delivered to a user's inbox. This means events may appear for messages the user has already read.

## Key Concepts

### Event Types

| Event Type | Description |
|------------|-------------|
| `malware` | Email or attachment contains detected malware, ransomware, or exploit code |
| `phishing` | Email identified as phishing — credential harvesting or social engineering |
| `spam` | High-confidence spam with policy implications |
| `dlp` | Data Loss Prevention — sensitive data detected in outbound email (PII, financial data) |
| `anomaly` | Behavioral anomaly — unusual sending pattern, account compromise indicator |
| `impostor` | Impostor / BEC — spoofed identity or display name deception |

### Severity Levels

| Severity | Description |
|----------|-------------|
| `critical` | Confirmed high-confidence threat requiring immediate action |
| `high` | Strong threat indicators; action strongly recommended |
| `medium` | Moderate confidence; review recommended |
| `low` | Low confidence; informational |

### Event Status

| Status | Description |
|--------|-------------|
| `new` | Newly detected event, no action taken |
| `quarantined` | Message has been quarantined by Avanan or an administrator |
| `released` | Message was released from quarantine to the user's inbox |
| `safe` | Marked as safe (false positive determination) |
| `reported` | Reported to Check Point threat intelligence |
| `deleted` | Message deleted permanently |

### Event Actions

| Action | Description |
|--------|-------------|
| `quarantine` | Remove the message from the user's inbox and place in quarantine |
| `release` | Return a quarantined message to the user's inbox |
| `markSafe` | Mark the event as a false positive; release message if quarantined |
| `report` | Report to Check Point ThreatCloud for threat intelligence |
| `delete` | Permanently delete the message |

## API Patterns

### Search Security Events

```
avanan_search_events
```

Parameters:
- `eventType` — Filter by type: `malware`, `phishing`, `spam`, `dlp`, `anomaly`, `impostor`
- `severity` — Filter by severity: `critical`, `high`, `medium`, `low`
- `status` — Filter by status: `new`, `quarantined`, `released`, `safe`, `reported`, `deleted`
- `startDate` — ISO 8601 UTC start timestamp
- `endDate` — ISO 8601 UTC end timestamp
- `recipient` — Filter by recipient email address
- `sender` — Filter by sender email address
- `tenantId` — For Smart API (MSP): scope to a specific tenant
- `limit` — Results per page (default: 50, max: 200)
- `offset` — Pagination offset (default: 0)

**Example — search for new phishing events today:**

```json
{
  "tool": "avanan_search_events",
  "parameters": {
    "eventType": "phishing",
    "status": "new",
    "startDate": "2026-03-02T00:00:00Z",
    "endDate": "2026-03-02T23:59:59Z",
    "limit": 50
  }
}
```

**Example response:**

```json
{
  "total": 3,
  "offset": 0,
  "limit": 50,
  "events": [
    {
      "eventId": "evt-abc123",
      "eventType": "phishing",
      "severity": "high",
      "status": "new",
      "detectedAt": "2026-03-02T09:15:22Z",
      "tenant": "acme-corp",
      "recipients": ["user@acmecorp.com"],
      "sender": "fake-support@evil.example.com",
      "subject": "Your Microsoft Account Has Been Suspended",
      "summary": "Credential harvesting phishing email impersonating Microsoft support",
      "indicators": [
        "Suspicious URL: http://login-microsoft-verify.example.com",
        "Display name spoofing: 'Microsoft Support'",
        "Domain mismatch: sent from evil.example.com"
      ],
      "attachmentCount": 0,
      "urlCount": 2,
      "confidence": 0.97
    }
  ]
}
```

**Example — all critical events across all tenants (Smart API):**

```json
{
  "tool": "avanan_search_events",
  "parameters": {
    "severity": "critical",
    "status": "new",
    "startDate": "2026-03-02T00:00:00Z",
    "limit": 100
  }
}
```

### Get Event Details

```
avanan_get_event
```

Parameters:
- `eventId` — The event ID from the search results
- `tenantId` — For Smart API: the tenant the event belongs to

**Example:**

```json
{
  "tool": "avanan_get_event",
  "parameters": {
    "eventId": "evt-abc123"
  }
}
```

**Example response:**

```json
{
  "eventId": "evt-abc123",
  "eventType": "phishing",
  "severity": "high",
  "status": "new",
  "detectedAt": "2026-03-02T09:15:22Z",
  "tenant": "acme-corp",
  "recipients": ["user@acmecorp.com"],
  "sender": "fake-support@evil.example.com",
  "headerFrom": "\"Microsoft Support\" <fake-support@evil.example.com>",
  "replyTo": "exfil@different-domain.com",
  "subject": "Your Microsoft Account Has Been Suspended",
  "bodyPreview": "Dear Customer, your Microsoft account has been suspended due to unusual activity...",
  "urls": [
    {
      "url": "http://login-microsoft-verify.example.com/verify",
      "verdict": "malicious",
      "category": "phishing"
    }
  ],
  "attachments": [],
  "headers": {
    "receivedTime": "2026-03-02T09:14:58Z",
    "spf": "fail",
    "dkim": "none",
    "dmarc": "fail"
  },
  "threatIntelligence": {
    "ipReputation": "malicious",
    "domainAge": "2 days",
    "firstSeen": "2026-03-01T00:00:00Z",
    "campaignId": "cp-campaign-xyz"
  },
  "confidence": 0.97,
  "availableActions": ["quarantine", "markSafe", "report", "delete"]
}
```

### Perform Event Action

```
avanan_perform_event_action
```

Parameters:
- `eventId` — The event to act on
- `action` — The action: `quarantine`, `release`, `markSafe`, `report`, `delete`
- `tenantId` — For Smart API: the tenant the event belongs to
- `reason` — Optional: reason for the action (recommended for audit trail)

**Example — quarantine a phishing event:**

```json
{
  "tool": "avanan_perform_event_action",
  "parameters": {
    "eventId": "evt-abc123",
    "action": "quarantine",
    "reason": "Confirmed phishing email impersonating Microsoft"
  }
}
```

**Example response:**

```json
{
  "eventId": "evt-abc123",
  "action": "quarantine",
  "status": "success",
  "newEventStatus": "quarantined",
  "completedAt": "2026-03-02T09:18:45Z",
  "message": "Message successfully removed from user inbox and placed in quarantine"
}
```

**Example — release (false positive):**

```json
{
  "tool": "avanan_perform_event_action",
  "parameters": {
    "eventId": "evt-def456",
    "action": "release",
    "reason": "Verified with user — legitimate email from known vendor"
  }
}
```

**Example — mark safe and add to exceptions:**

```json
{
  "tool": "avanan_perform_event_action",
  "parameters": {
    "eventId": "evt-def456",
    "action": "markSafe",
    "reason": "False positive — legitimate marketing email from trusted partner"
  }
}
```

### Search Secured Entities

```
avanan_search_entities
```

Search the Avanan-protected message corpus for specific entities. Useful for finding all instances of a specific sender, subject, or URL across the environment.

Parameters:
- `query` — Free-text search query
- `sender` — Filter by sender email
- `recipient` — Filter by recipient email
- `subject` — Filter by subject
- `startDate` / `endDate` — Date range
- `tenantId` — For Smart API: scope to a specific tenant
- `limit` / `offset` — Pagination

**Example — find all messages from a suspicious sender:**

```json
{
  "tool": "avanan_search_entities",
  "parameters": {
    "sender": "attacker@evil.example.com",
    "startDate": "2026-03-01T00:00:00Z",
    "limit": 100
  }
}
```

**Example response:**

```json
{
  "total": 7,
  "entities": [
    {
      "entityId": "ent-001",
      "messageId": "<msg@evil.example.com>",
      "sender": "attacker@evil.example.com",
      "recipients": ["ceo@acmecorp.com"],
      "subject": "Wire Transfer Request",
      "receivedAt": "2026-03-01T14:22:00Z",
      "verdict": "malicious",
      "eventId": "evt-bec789",
      "status": "quarantined"
    }
  ]
}
```

## Common Workflows

### Daily Event Review

1. Call `avanan_search_events` with `status: "new"` and `startDate` from start of day
2. Sort by severity — critical and high first
3. For each critical/high event:
   - Get full details with `avanan_get_event`
   - Check `availableActions` to confirm quarantine is possible
   - Quarantine confirmed threats with `avanan_perform_event_action`
4. Review medium/low events — mark as safe those confirmed as false positives
5. Report novel threats to Check Point ThreatCloud with `action: "report"`

### Investigating a Potential Account Compromise

1. If you suspect a user account is compromised, search for `anomaly` events for that recipient
2. Check for unusual sending patterns in entity search (search `sender: compromised@domain.com`)
3. Review events for recipients of outbound emails from the compromised account
4. If compromise confirmed: quarantine any outbound threat emails; advise client to reset password and review MFA

### Retroactive Remediation After Threat Intelligence Update

Avanan can retroactively quarantine messages that were initially delivered but later classified as malicious (e.g., after a URL is added to a threat feed).

1. Call `avanan_search_events` with `status: "new"` for events from the last 7 days
2. Look for events where `detectedAt` is significantly later than `receivedAt` — these are retroactive detections
3. Confirm users have not interacted with the content if possible
4. Quarantine the messages and notify affected users

### False Positive Triage

1. Call `avanan_search_events` with `status: "quarantined"` for the last 24 hours
2. Review events marked with lower confidence scores
3. For suspected false positives:
   - Get full event details
   - Check sender reputation, domain age, email authentication results
   - If legitimate: call `avanan_perform_event_action` with `action: "markSafe"`
4. Consider adding the sender to the whitelist to prevent future false positives

### MSP Cross-Tenant Threat Sweep

1. Call `avanan_search_events` without `tenantId` (Smart API returns events across all tenants)
2. Filter by a specific indicator — e.g., sender domain from a threat report
3. Identify which customer tenants received the malicious email
4. Quarantine across all affected tenants and notify clients

## Error Handling

### Event Not Found (404)

**Cause:** Event ID may be from a different tenant (Smart API) or the event has been deleted
**Solution:** Confirm the `tenantId` matches the tenant where the event originated; use search to re-find the event

### Action Not Available

**Cause:** The requested action is not in `availableActions` for that event — e.g., trying to release an event that was never quarantined
**Solution:** Check `availableActions` from `avanan_get_event` before calling `avanan_perform_event_action`

### Already Actioned

**Cause:** Event status has already changed (another admin actioned it)
**Solution:** Re-fetch the event with `avanan_get_event` to confirm current status before retrying

### Empty Search Results

Not an error — it means no events matched the filters in the queried window. Try:
1. Widening the date range
2. Removing type or severity filters
3. Confirming the correct tenant is being queried (Smart API)

## Best Practices

- Always action on critical events within the same business day — retroactive quarantine is effective but time-sensitive
- Add `reason` to every action call — it creates an audit trail in the Avanan dashboard
- Check `availableActions` before calling `avanan_perform_event_action` — avoid blindly calling quarantine on already-quarantined events
- For BEC/impostor events, notify the targeted user directly — they may have already responded to the fraudulent request
- When releasing false positives, consider adding the sender to whitelist exceptions to reduce future noise
- Use entity search to scope the full blast radius of a campaign — a single event may be one of dozens targeting the same client
- Present confidence scores to clients as percentages and plain language: "Avanan is 97% confident this is a phishing email" not "confidence: 0.97"

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication, region, Smart API vs Standard API
- [tenant-management](../tenant-management/SKILL.md) - MSP tenant scoping and exception management
