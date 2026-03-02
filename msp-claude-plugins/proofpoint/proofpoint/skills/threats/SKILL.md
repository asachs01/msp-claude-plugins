---
description: >
  Use this skill when working with Proofpoint TAP threat intelligence —
  querying SIEM click events (permitted and blocked URLs), SIEM message events,
  campaign data, threat forensics, and understanding the TAP threat model.
triggers:
  - proofpoint threat
  - TAP threat
  - targeted attack
  - proofpoint click
  - SIEM events
  - threat forensics
  - campaign
  - proofpoint malware
  - proofpoint phishing
  - URL click threat
  - proofpoint blocked
---

# Proofpoint TAP Threat Intelligence

## Overview

Proofpoint TAP (Targeted Attack Protection) provides advanced threat intelligence focused on email-borne attacks. It tracks URL clicks, message delivery decisions, phishing campaigns, and malware distribution at the message level. The SIEM API endpoints allow MSPs and security teams to extract this data for incident response, threat hunting, and compliance reporting.

TAP operates at the account level — it sees all email traffic for a Proofpoint TAP-protected domain, not just individual mailboxes. This makes it ideal for fleet-wide threat analysis.

## Key Concepts

### Threat Types

| Threat Type | Description |
|-------------|-------------|
| `phish` | Phishing attempts — credential harvesting, fake login pages |
| `malware` | Malware delivery — executable attachments, macro documents |
| `spam` | High-confidence spam with malicious indicators |
| `impostor` | Business email compromise (BEC) / impostor emails |

### SIEM Event Types

- **Clicks Permitted** — URLs the user was allowed to visit (TAP decided safe or rewritten but not blocked)
- **Clicks Blocked** — URLs blocked by TAP before the user could reach them (confirmed malicious)
- **Messages Delivered** — Messages TAP allowed into the mailbox
- **Messages Blocked** — Messages TAP quarantined or rejected

### Threat Status

- `active` — Threat is currently classified as malicious
- `cleared` — Threat was reclassified as benign (false positive)
- `falsePositive` — Confirmed false positive

### Campaigns

Campaigns group related threat events that share infrastructure, URLs, or sender patterns. Campaign intelligence helps attribute attacks and understand scope — a single campaign may target dozens of organizations.

## API Patterns

### Query TAP Threat Data

```
proofpoint_get_threats
```

Parameters:
- `threatType` — `url`, `attachment`, `messageText`
- `threatStatus` — `active`, `cleared`, `falsePositive` (default: `active`)
- `interval` — ISO 8601 duration, e.g., `PT24H` (last 24 hours), `PT1H` (last 1 hour)
- `startTime` / `endTime` — Explicit UTC timestamps (alternative to `interval`)

**Example — active URL threats in last 24 hours:**

```json
{
  "tool": "proofpoint_get_threats",
  "parameters": {
    "threatType": "url",
    "threatStatus": "active",
    "interval": "PT24H"
  }
}
```

**Example response:**

```json
{
  "queryEndTime": "2026-03-02T12:00:00Z",
  "threats": [
    {
      "threatID": "abc123def456",
      "threatType": "url",
      "threatStatus": "active",
      "classification": "phish",
      "threatUrl": "https://evil-phish.example.com/login",
      "campaignID": "camp-789xyz",
      "firstSeen": "2026-03-01T08:00:00Z",
      "lastSeen": "2026-03-02T11:30:00Z",
      "affectedUsersCount": 14
    }
  ]
}
```

### Get SIEM Click Events

```
proofpoint_get_siem_clicks
```

Returns URL click events — use `clicksPermitted` for clicks the user made that TAP allowed, and `clicksBlocked` for clicks TAP stopped.

Parameters:
- `interval` — ISO 8601 duration (e.g., `PT1H`, `PT24H`)
- `startTime` / `endTime` — Explicit UTC timestamps
- `format` — `json` (default) or `syslog`
- `sinceSeconds` — Return events from the last N seconds

**Example — blocked clicks in the last hour:**

```json
{
  "tool": "proofpoint_get_siem_clicks",
  "parameters": {
    "interval": "PT1H"
  }
}
```

**Example response:**

```json
{
  "clicksBlocked": [
    {
      "campaignId": "camp-789xyz",
      "classification": "phish",
      "clickIP": "203.0.113.42",
      "clickTime": "2026-03-02T11:45:22Z",
      "GUID": "msg-guid-001",
      "id": "click-001",
      "messageID": "<message@domain.com>",
      "recipient": "user@client.com",
      "sender": "phisher@evil.example.com",
      "senderIP": "198.51.100.10",
      "threatID": "abc123def456",
      "threatTime": "2026-03-02T08:00:00Z",
      "threatURL": "https://evil-phish.example.com/login",
      "url": "https://evil-phish.example.com/login",
      "userAgent": "Mozilla/5.0 ..."
    }
  ],
  "clicksPermitted": []
}
```

### Get SIEM Message Events

```
proofpoint_get_siem_messages
```

Returns message-level SIEM data — delivery decisions, threat classification, sender/recipient, and related threat IDs.

Parameters:
- `interval` — ISO 8601 duration
- `startTime` / `endTime` — Explicit UTC timestamps
- `format` — `json` or `syslog`

**Example — messages blocked in the last 4 hours:**

```json
{
  "tool": "proofpoint_get_siem_messages",
  "parameters": {
    "interval": "PT4H"
  }
}
```

**Example response:**

```json
{
  "messagesBlocked": [
    {
      "GUID": "msg-guid-002",
      "QID": "qid-456",
      "ccAddresses": [],
      "clusterId": "hosted",
      "completelyRewritten": true,
      "fromAddress": ["attacker@malicious.example.com"],
      "headerFrom": "\"Invoice Dept\" <attacker@malicious.example.com>",
      "impostorScore": 0,
      "malwareScore": 100,
      "messageID": "<invoice@malicious.example.com>",
      "messageParts": [
        {
          "contentType": "application/vnd.ms-excel",
          "disposition": "attached",
          "filename": "Invoice_March.xlsm",
          "md5": "d41d8cd98f00b204e9800998ecf8427e",
          "oContentType": "application/vnd.ms-excel",
          "sandboxStatus": "threat",
          "sha256": "abc123..."
        }
      ],
      "messageTime": "2026-03-02T10:22:00Z",
      "modulesRun": ["sandbox", "urldefense", "av"],
      "phishScore": 0,
      "policyRoutes": ["default_inbound"],
      "quarantineFolder": "Phish",
      "quarantineRule": "malware",
      "recipient": ["user@client.com"],
      "replyToAddress": [],
      "sender": "attacker@malicious.example.com",
      "senderIP": "198.51.100.99",
      "spamScore": 0,
      "subject": "Invoice for March 2026",
      "threatsInfoMap": [
        {
          "campaignID": "camp-789xyz",
          "classification": "malware",
          "threat": "Invoice_March.xlsm",
          "threatID": "abc123def456",
          "threatStatus": "active",
          "threatTime": "2026-03-01T15:00:00Z",
          "threatType": "attachment",
          "threatUrl": "https://tap-api-v2.proofpoint.com/v2/threat/summary/abc123def456"
        }
      ]
    }
  ],
  "messagesDelivered": []
}
```

### Get Campaign Intelligence

```
proofpoint_get_campaign
```

Parameters:
- `campaignId` — The campaign ID from a threat or SIEM event

**Example:**

```json
{
  "tool": "proofpoint_get_campaign",
  "parameters": {
    "campaignId": "camp-789xyz"
  }
}
```

**Example response:**

```json
{
  "id": "camp-789xyz",
  "name": "Invoice Malware — March 2026",
  "description": "Campaign distributing Emotet via macro-enabled Excel attachments",
  "startDate": "2026-03-01",
  "actors": ["TA542"],
  "families": ["Emotet"],
  "malware": ["Emotet", "QBot"],
  "techniques": ["T1566.001"],
  "threatCount": 847,
  "affectedOrgs": 62,
  "forensics": [
    {
      "type": "url",
      "display": "C2 URL",
      "malicious": true,
      "platforms": ["Windows"],
      "what": {
        "url": "http://c2.example.com/gate.php"
      }
    }
  ]
}
```

## Common Workflows

### Daily Threat Review

1. Call `proofpoint_get_siem_clicks` with `interval: "PT24H"` to get all click events
2. Separate `clicksBlocked` (stopped threats) from `clicksPermitted` (potential exposure)
3. Call `proofpoint_get_siem_messages` with `interval: "PT24H"` for message-level data
4. Identify recipients who received or clicked on threats — these users need follow-up
5. Extract unique `campaignId` values and query `proofpoint_get_campaign` for context
6. Summarize: X threats blocked, Y permitted clicks (potential exposure), Z campaigns active

### Investigating a Permitted Click (User May Be Compromised)

1. Identify the permitted click from `clicksPermitted` in SIEM data
2. Note the `recipient`, `clickTime`, `threatURL`, and `threatID`
3. Call `proofpoint_get_campaign` with the `campaignId` to understand the threat actor
4. Check threat classification — phish means credential risk, malware means endpoint risk
5. Escalate to the client: advise password reset (phish) or endpoint scan (malware)
6. Document the incident for the client's security record

### Campaign Scope Analysis

1. Get SIEM events for a longer window (e.g., `PT168H` = 7 days)
2. Extract all unique `campaignId` values from `threatsInfoMap`
3. Query each campaign with `proofpoint_get_campaign`
4. Build a summary: campaigns active, families seen, MITRE techniques, affected user count
5. Use this for executive threat briefings or monthly security reports

### Threat Hunting by Indicator

1. Call `proofpoint_get_threats` with `threatType: "url"` for a broad window
2. Filter results by known malicious domain or IP in `threatUrl`
3. Cross-reference with SIEM clicks to find users who interacted with the indicator
4. Use campaign data to understand full attack scope

## Error Handling

### Empty Results (Not an Error)

If `clicksBlocked`, `clicksPermitted`, `messagesBlocked`, or `messagesDelivered` are empty arrays, there were no events in the queried window — this is normal and not an error condition. Adjust the time window or confirm the correct region is configured.

### Invalid Interval Format

**Cause:** `interval` must be ISO 8601 duration format
**Solution:** Use `PT1H` (1 hour), `PT24H` (24 hours), `PT168H` (7 days) — not `1h` or `24hours`

### Campaign Not Found

**Cause:** `campaignId` may be from a different region or the campaign has aged out
**Solution:** Verify the region setting matches the SIEM event source; campaign data may not be available for very old events

### 401 Unauthorized

**Cause:** TAP credentials are separate from Essentials credentials
**Solution:** Confirm `PROOFPOINT_PRINCIPAL` and `PROOFPOINT_SECRET` are TAP-specific credentials, not Essentials credentials

## Best Practices

- Prefer 1-hour windows for real-time monitoring; 24-hour windows for daily reviews; 7-day windows for weekly reports
- Always check `clicksPermitted` — these represent potential user exposure requiring follow-up
- Group events by `recipient` to identify users with multiple threat interactions (high-risk users)
- Use `campaignId` to correlate events across messages and clicks — one campaign may generate dozens of events
- When presenting threat data to clients, translate scores (malwareScore, phishScore 0-100) into plain language
- Include `sha256` hashes from message parts when escalating to endpoint security teams for IOC matching
- Cross-reference `senderIP` across events — repeat sender IPs indicate persistent attackers

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication, region selection, rate limiting
- [message-trace](../message-trace/SKILL.md) - Trace specific emails in Essentials
- [msp-management](../msp-management/SKILL.md) - Organization listing and email stats
