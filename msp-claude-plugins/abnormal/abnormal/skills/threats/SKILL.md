---
name: "Abnormal Threats"
description: >
  Use this skill when investigating Abnormal Security threats — BEC, phishing,
  account takeover, threat lifecycle management, message analysis within threat
  cases, and triggering or checking remediation status.
when_to_use: "When investigating Abnormal Security threats — BEC, phishing, account takeover, threat lifecycle management, message analysis within threat cases"
triggers:
  - abnormal threat
  - abnormal case
  - email attack
  - abnormal detection
  - phishing abnormal
  - BEC
  - business email compromise
  - account takeover
  - abnormal remediation
  - abnormal message analysis
---

# Abnormal Security Threats

## Overview

Abnormal Security uses AI behavioral analysis to detect email attacks that bypass traditional security tools. It detects attacks based on behavioral anomalies — unusual patterns in sender behavior, content, context, and communication graph — rather than relying on known signatures. Threats are organized into cases, each containing one or more related malicious messages. This skill covers the full threat lifecycle from detection through remediation.

## Key Concepts

### Threat Types

| Type | Description |
|------|-------------|
| `BEC` | Business Email Compromise — financial fraud, wire transfer scams, payroll diversion |
| `PHISHING` | Credential phishing — fake login pages, malicious links designed to harvest credentials |
| `ACCOUNT_TAKEOVER` | Compromised account — legitimate account used to send attacks from inside the organization |
| `SPAM` | Unsolicited bulk email that bypassed other controls |
| `MALWARE` | Emails delivering malicious attachments or executables |
| `SOCIAL_ENGINEERING` | Non-financial manipulation attacks |

### Threat Lifecycle

1. **Detection** — Abnormal AI identifies an attack based on behavioral signals
2. **Threat Case Created** — A threat case is opened with all affected messages
3. **Automated Remediation** — Abnormal automatically removes messages from mailboxes (if enabled)
4. **Review** — Security team reviews the case for accuracy and additional actions
5. **Closure** — Threat case is closed after remediation is confirmed

### Attack Indicators

Abnormal scores threats based on multiple indicators:

- **Sender anomalies** — First-time sender, unusual sending time, mismatched display name
- **Content signals** — Urgency language, financial request, impersonation of known contacts
- **Link analysis** — Newly registered domains, redirector chains, credential harvesting pages
- **Behavioral baseline** — Deviation from the sender's normal communication patterns

## API Patterns

### List Threats

```
abnormal_list_threats
```

Parameters:
- `filter` — Filter expression (e.g. `receivedTime gte 2026-03-01`, `threatType eq BEC`)
- `pageNumber` — Page number for pagination (default: 1)

**Example — List recent BEC threats:**

```json
{
  "filter": "threatType eq BEC and receivedTime gte 2026-03-01T00:00:00Z"
}
```

**Example response:**

```json
{
  "threats": [
    {
      "threatId": "threat-abc123",
      "threatType": "BEC",
      "subject": "Urgent: Update Payment Information",
      "senderEmail": "billing@legitimate-partner.com",
      "receivedTime": "2026-03-01T09:45:00Z",
      "recipientEmail": "cfo@client.com",
      "isRead": false,
      "remediationStatus": "REMEDIATED",
      "attackType": "Payment Fraud",
      "summary": "Attacker impersonated a trusted vendor requesting urgent wire transfer to a new bank account."
    },
    {
      "threatId": "threat-def456",
      "threatType": "PHISHING",
      "subject": "Your Microsoft 365 password is expiring",
      "senderEmail": "noreply@microsoft-support-alerts.net",
      "receivedTime": "2026-03-01T11:30:00Z",
      "recipientEmail": "user@client.com",
      "isRead": true,
      "remediationStatus": "REMEDIATED",
      "attackType": "Credential Phishing",
      "summary": "Credential phishing email using Microsoft 365 branding to harvest login credentials."
    }
  ],
  "nextPageNumber": null,
  "total": 2
}
```

### Get Threat Details

```
abnormal_get_threat
```

Parameters:
- `threatId` — The threat case ID

**Example response:**

```json
{
  "threatId": "threat-abc123",
  "threatType": "BEC",
  "attackType": "Payment Fraud",
  "subject": "Urgent: Update Payment Information",
  "senderEmail": "billing@legitimate-partner.com",
  "senderName": "Acme Billing Dept",
  "receivedTime": "2026-03-01T09:45:00Z",
  "recipientEmail": "cfo@client.com",
  "recipientName": "Jane Smith",
  "isRead": false,
  "remediationStatus": "REMEDIATED",
  "summary": "Attacker impersonated a trusted vendor requesting urgent wire transfer to a new bank account.",
  "attackVector": "EMAIL",
  "indicators": [
    {
      "id": "ind-001",
      "description": "Reply-to address differs from sender domain",
      "value": "payments@attacker-controlled.com",
      "type": "REPLY_TO_MISMATCH"
    },
    {
      "id": "ind-002",
      "description": "First time sender from this domain",
      "value": "legitimate-partner.com",
      "type": "FIRST_TIME_SENDER"
    },
    {
      "id": "ind-003",
      "description": "Financial request with urgency language",
      "value": "wire $48,500 by end of day",
      "type": "FINANCIAL_REQUEST"
    }
  ],
  "messageCount": 1
}
```

Key fields:
- `indicators` — AI-detected signals that triggered the detection
- `attackType` — Specific attack subcategory within the threat type
- `remediationStatus` — Current remediation state

### List Messages in a Threat Case

```
abnormal_list_messages
```

Parameters:
- `threatId` — The threat case ID

**Example response:**

```json
{
  "messages": [
    {
      "messageId": "msg-xyz789",
      "subject": "Urgent: Update Payment Information",
      "from": "billing@legitimate-partner.com",
      "to": ["cfo@client.com"],
      "received": "2026-03-01T09:45:00Z",
      "isRead": false,
      "remediationStatus": "REMEDIATED",
      "hasAttachment": false,
      "links": ["https://attacker-controlled.com/fake-invoice"]
    }
  ]
}
```

### Get Message Details

```
abnormal_get_message
```

Parameters:
- `messageId` — The message ID (from `abnormal_list_messages`)

**Example response:**

```json
{
  "messageId": "msg-xyz789",
  "subject": "Urgent: Update Payment Information",
  "from": "billing@legitimate-partner.com",
  "to": ["cfo@client.com"],
  "received": "2026-03-01T09:45:00Z",
  "senderIp": "192.0.2.100",
  "returnPath": "bounce@attacker-controlled.com",
  "replyTo": "payments@attacker-controlled.com",
  "body": "Dear Jane, please update our banking information immediately...",
  "links": [
    {
      "url": "https://attacker-controlled.com/fake-invoice",
      "type": "MALICIOUS",
      "verdict": "PHISHING"
    }
  ],
  "attachments": [],
  "authenticationResults": {
    "spf": "pass",
    "dkim": "pass",
    "dmarc": "pass"
  },
  "remediationStatus": "REMEDIATED",
  "autoRemediated": true,
  "autoRemediatedTime": "2026-03-01T09:47:00Z"
}
```

Note: SPF/DKIM/DMARC can all pass for BEC attacks — the sender domain is legitimate but the attack is social engineering. Authentication results alone are not sufficient to detect BEC.

### Manage Remediation

```
abnormal_manage_remediation
```

Parameters:
- `messageId` — The message ID to remediate
- `action` — Remediation action: `REMEDIATE` or `UNREMEDIATE`
- `comment` — Optional comment for audit trail

**Example — Trigger remediation:**

```json
{
  "messageId": "msg-xyz789",
  "action": "REMEDIATE",
  "comment": "BEC confirmed — removing from CFO mailbox"
}
```

**Example response:**

```json
{
  "status": "REMEDIATION_IN_PROGRESS",
  "jobId": "job-001",
  "estimatedCompletionTime": "2026-03-02T09:50:00Z"
}
```

**Example — Check remediation status:**

```json
{
  "messageId": "msg-xyz789",
  "action": "STATUS"
}
```

**Example status response:**

```json
{
  "status": "REMEDIATED",
  "remediatedAt": "2026-03-01T09:47:00Z",
  "remediatedBy": "ABNORMAL_AUTO",
  "jobId": "job-001"
}
```

## Common Workflows

### Daily Threat Review

1. Call `abnormal_list_threats` with `filter` for the past 24 hours
2. Sort by threat type — prioritize BEC and Account Takeover (highest impact)
3. For each unread/unreviewed threat, call `abnormal_get_threat` to get full indicators
4. Verify `remediationStatus` — if `NOT_REMEDIATED`, trigger remediation immediately
5. Create PSA tickets for affected clients with threat summary and affected users

### Investigate a Specific BEC Threat

1. Call `abnormal_get_threat` with the threat ID
2. Review `indicators` array — note reply-to mismatches, financial requests, urgency language
3. Call `abnormal_list_messages` to get all messages in the case
4. Call `abnormal_get_message` for each message to review:
   - `returnPath` and `replyTo` — often differ from sender in BEC attacks
   - `links` — check for malicious or spoofed links
   - `authenticationResults` — note that BEC can pass SPF/DKIM/DMARC
5. Confirm `remediationStatus` — if `REMEDIATED`, the email was removed from the mailbox
6. If user already interacted with the message (wire transfer initiated), escalate immediately

### Confirm Auto-Remediation Coverage

1. Call `abnormal_list_threats` for a time period
2. For each threat, check `remediationStatus`:
   - `REMEDIATED` — Automatic remediation succeeded
   - `NOT_REMEDIATED` — Action required
   - `REMEDIATION_IN_PROGRESS` — In flight, check back shortly
3. For `NOT_REMEDIATED` threats, call `abnormal_manage_remediation` with `action=REMEDIATE`
4. Follow up with `action=STATUS` to confirm completion

### Detect Account Takeover

1. Call `abnormal_list_threats` with `filter=threatType eq ACCOUNT_TAKEOVER`
2. For each threat, call `abnormal_get_threat`
3. Identify the compromised account from `senderEmail`
4. Escalate to the client immediately — the account must be locked and the password reset
5. Review `indicators` to understand how the takeover occurred (credential phishing link, password spray, etc.)
6. Check if the compromised account sent attacks to other recipients in the case

## Error Handling

### Threat Not Found

**Cause:** Invalid threat ID or case was closed and purged.
**Solution:** Use `abnormal_list_threats` to search for the correct ID by time range and threat type.

### Remediation Returns FAILED

**Cause:** The target mailbox may be offline, the message may have already been deleted by the user, or the Exchange/O365 integration may have a permission issue.
**Solution:** Verify the Abnormal Security integration with Microsoft 365 is functioning in the Abnormal Portal. Manually remove the message from the user's mailbox as a fallback.

### Authentication Results All Pass for Detected BEC

**Cause:** BEC attacks frequently originate from legitimate, compromised sending domains or use careful spoofing that passes authentication. Abnormal uses behavioral AI, not authentication checks.
**Explanation:** A threat detection with `spf=pass; dkim=pass; dmarc=pass` and BEC type is expected — do not dismiss the threat based on authentication results alone.

## Best Practices

- Review all `NOT_REMEDIATED` threats immediately — these are confirmed attacks still in user mailboxes
- For BEC threats, always check `replyTo` in message details — the reply-to address is usually attacker-controlled even when the sender domain is legitimate
- Notify client CFOs and finance teams directly when BEC is detected — email alone may reach a compromised inbox
- Track mean time to remediation (MTTR) for threats — Abnormal auto-remediation typically acts within 2–3 minutes of detection
- Cross-reference account takeover threats with Mimecast or other controls — a compromised account may have received a phishing email first

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication, pagination, error codes
- [cases](../cases/SKILL.md) - Security cases and user-reported phishing
