---
name: "KnowBe4 Phishing Incidents"
description: >
  Use this skill when working with PhishER reported phishing messages — listing,
  triaging, classifying, investigating suspicious emails, and performing mass
  remediation with bulk actions across the PhishER queue.
when_to_use: "When listing, triaging, classifying, investigating suspicious emails, and performing mass remediation with bulk actions across the PhishER queue"
triggers:
  - phishing
  - phisher incident
  - phisher message
  - suspicious email
  - email threat
  - phishing report
  - phisher triage
  - phisher classification
  - phisher bulk action
  - phisher remediation
  - knowbe4 phisher
  - reported email
---

# KnowBe4 PhishER — Phishing Incidents

## Overview

PhishER is KnowBe4's phishing incident response platform. When users report suspicious emails via the PhishML button or email forwarding, those messages land in the PhishER queue for security team review. Each message is analyzed for threat indicators, categorized by severity, and acted upon — either cleaned up, marked safe, or escalated. MSPs managing multiple clients can use PhishER to centralize phishing response and perform bulk remediation to protect the entire user base quickly.

## Key Concepts

### Message Lifecycle

1. **New** — User submits a suspicious email via the Phish Alert Button
2. **In Review** — Security analyst is investigating the message
3. **Clean** — Message determined to be safe (false positive)
4. **Threat** — Confirmed malicious email requiring remediation
5. **Unknown** — Cannot be definitively classified; may need escalation
6. **Resolved** — Message has been acted upon and closed

### Severity Classification

- **Critical** — Active threat with malware payload or credential harvesting; requires immediate mass remediation
- **High** — Confirmed phishing or spear-phishing; targeted attack on users
- **Medium** — Suspected phishing with moderate confidence indicators
- **Low** — Suspicious but likely harmless; could be spam or graymail

### Categories

PhishER messages are assigned to one of three categories:

- **Threat** — Malicious email; take action
- **Clean** — Safe email; false positive from user
- **Unknown** — Insufficient evidence; requires manual analysis

### Bulk Actions

PhishER supports the following bulk actions to remediate at scale:

- **Purge from mailboxes** — Remove the email from all affected users' inboxes
- **Block sender** — Add sender to blocklist to prevent future delivery
- **Mark as threat/clean** — Update classification on multiple messages at once
- **Tag messages** — Apply labels for tracking and reporting

## API Patterns

### List PhishER Messages

```
knowbe4_phisher_list_messages
```

Parameters:
- `status` — Filter by status (`new`, `in_review`, `resolved`)
- `category` — Filter by category (`threat`, `clean`, `unknown`)
- `severity` — Filter by severity (`critical`, `high`, `medium`, `low`)
- `page` — Page number (1-based)
- `per_page` — Results per page (max 500)

**Example response:**

```json
{
  "messages": [
    {
      "id": "msg-4821",
      "subject": "Urgent: Your account has been compromised",
      "from": "security@suspicious-domain.net",
      "reported_at": "2026-03-02T09:14:22Z",
      "reporter": "jsmith@acmecorp.com",
      "status": "new",
      "category": "unknown",
      "severity": "high",
      "phishmls_verdict": "threat",
      "tags": []
    },
    {
      "id": "msg-4822",
      "subject": "FW: Invoice #10234 - Payment Required",
      "from": "billing@fake-invoices.com",
      "reported_at": "2026-03-02T08:55:10Z",
      "reporter": "accounting@acmecorp.com",
      "status": "new",
      "category": "unknown",
      "severity": "critical",
      "phishmls_verdict": "threat",
      "tags": []
    }
  ],
  "total": 47,
  "page": 1,
  "per_page": 100
}
```

### Get Message Details

```
knowbe4_phisher_get_message
```

Parameters:
- `message_id` — The PhishER message ID

**Example response:**

```json
{
  "id": "msg-4821",
  "subject": "Urgent: Your account has been compromised",
  "from": "security@suspicious-domain.net",
  "to": ["jsmith@acmecorp.com"],
  "reported_at": "2026-03-02T09:14:22Z",
  "reporter": "jsmith@acmecorp.com",
  "status": "in_review",
  "category": "threat",
  "severity": "high",
  "phishmls_verdict": "threat",
  "phishmls_confidence": 0.97,
  "links": [
    "https://suspicious-domain.net/login-reset",
    "https://bit.ly/3xyzAbc"
  ],
  "attachments": [],
  "headers": {
    "reply_to": "attacker@gmail.com",
    "received_spf": "fail",
    "dmarc": "fail"
  },
  "tags": ["credential-harvest"],
  "raw_email_url": "https://phisher.knowbe4.com/messages/msg-4821/raw"
}
```

### Update Message Classification

```
knowbe4_phisher_update_message
```

Parameters:
- `message_id` — The PhishER message ID
- `category` — New category (`threat`, `clean`, `unknown`)
- `severity` — New severity (`critical`, `high`, `medium`, `low`)
- `status` — New status (`in_review`, `resolved`)
- `tags` — Array of tags to apply

**Example:**

```json
{
  "message_id": "msg-4821",
  "category": "threat",
  "severity": "high",
  "status": "resolved",
  "tags": ["credential-harvest", "spear-phishing"]
}
```

### Bulk Actions

```
knowbe4_phisher_bulk_action
```

Parameters:
- `message_ids` — Array of message IDs to act on
- `action` — Action to perform:
  - `purge` — Remove from all user mailboxes
  - `block_sender` — Block the sender domain/address
  - `mark_threat` — Classify all as threat
  - `mark_clean` — Classify all as clean
  - `resolve` — Mark all as resolved
- `notes` — Optional notes to attach to the action

**Example:**

```json
{
  "message_ids": ["msg-4821", "msg-4822", "msg-4823"],
  "action": "purge",
  "notes": "Mass credential harvest campaign targeting accounting team — purging from all mailboxes"
}
```

**Example response:**

```json
{
  "success": true,
  "processed": 3,
  "failed": 0,
  "action": "purge",
  "executed_at": "2026-03-02T09:45:00Z"
}
```

## Common Workflows

### Daily PhishER Queue Triage

1. Call `knowbe4_phisher_list_messages` with `status=new`
2. Sort by severity (critical first)
3. Review PhishML verdicts and confidence scores — high-confidence threat verdicts can be actioned quickly
4. For unknown-category messages, review headers (SPF/DKIM/DMARC), links, and attachments
5. Classify each message with `knowbe4_phisher_update_message`
6. Bulk purge confirmed threats with `knowbe4_phisher_bulk_action`

### Investigating a Suspicious Email

1. Get full message details with `knowbe4_phisher_get_message`
2. Check authentication headers: SPF, DKIM, DMARC — all failing is a strong threat indicator
3. Review linked URLs for credential harvesting pages or malware download endpoints
4. Check PhishML verdict and confidence score
5. Cross-reference sender domain against known threat intelligence
6. Classify and act: if threat, purge and block sender; if clean, mark as safe

### Mass Remediation After Confirmed Campaign

1. Search for messages from the same sender or with the same subject pattern
2. Identify all affected reporters (users who received and reported the email)
3. Collect all message IDs for the campaign
4. Execute `knowbe4_phisher_bulk_action` with `action=purge` to remove from mailboxes
5. Execute `knowbe4_phisher_bulk_action` with `action=block_sender` to prevent future delivery
6. Mark all as resolved with classification notes for audit trail
7. Check whether non-reporting users may have also received the email and notify IT

### Processing False Positives

1. Filter `knowbe4_phisher_list_messages` for `category=unknown`
2. Investigate each message — look for legitimate business context
3. For confirmed safe emails, classify with `category=clean` and `status=resolved`
4. If users are consistently reporting emails from a known-good sender, consider adding to the PhishER allowlist

## Error Handling

### Message Not Found

**Cause:** Invalid message ID or message was already deleted
**Solution:** List messages first to verify the correct ID exists in the queue

### Bulk Action Partial Failure

**Cause:** Some message IDs in a bulk request may be invalid or already resolved
**Solution:** Check the `failed` count in the response and retry with the failed IDs individually

### Purge Action Not Completing

**Cause:** PhishER requires Microsoft 365 or Google Workspace integration to purge messages from mailboxes
**Solution:** Verify the email platform integration is configured in KnowBe4 Console > Settings > Email Server Integration

### PhishML Verdict Unavailable

**Cause:** Analysis may still be in progress for newly reported messages
**Solution:** Wait a few minutes and re-fetch the message details; PhishML typically processes within 60 seconds

## Best Practices

- Triage the PhishER queue at least once per business day — prompt response reduces dwell time for active campaigns
- Trust PhishML verdicts with >0.95 confidence for rapid bulk action, but still review critical-severity messages manually
- Always check the `reply_to` header — attackers often set a different reply address to capture credentials
- Document notes when performing bulk actions — these are preserved in the audit log
- When a new phishing campaign is detected, check for matching messages from the previous 24-48 hours that may not have been reported
- Notify affected end users when their mailboxes are purged so they are aware of the threat
- Track false positive rates by user group — high reporters may need phishing awareness coaching
- Use PhishER tags to categorize attack types (credential-harvest, ransomware-lure, BEC, etc.) for trend reporting

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication, pagination, and error handling
- [training-campaigns](../training-campaigns/SKILL.md) - Phishing simulation and training context
