---
name: threat-investigation
description: Investigate a specific Abnormal Security threat case — messages, attack indicators, and remediation status
arguments:
  - name: threat_id
    description: The Abnormal threat case ID to investigate
    required: true
---

# Abnormal Security Threat Investigation

Perform a deep investigation of a specific Abnormal Security threat case. Retrieves the full threat details, all messages within the case, per-message analysis, and current remediation status. Use this command when a client reports a suspicious email, when an alert fires, or as follow-up to the daily threat review.

## Prerequisites

- Abnormal Security MCP server connected with valid API token
- MCP tools `abnormal_get_threat`, `abnormal_list_messages`, `abnormal_get_message`, and `abnormal_manage_remediation` available

## Steps

1. **Retrieve threat case details**

   Call `abnormal_get_threat` with the provided `threat_id`. Extract:
   - Threat type (BEC, PHISHING, ACCOUNT_TAKEOVER, etc.)
   - Attack type (Payment Fraud, Credential Phishing, etc.)
   - Affected recipient(s)
   - Current remediation status
   - AI-detected indicators

2. **List messages in the case**

   Call `abnormal_list_messages` with the `threat_id`. For each message, note:
   - Subject, sender, recipient, and received time
   - `remediationStatus` per message
   - Whether the message has attachments or malicious links

3. **Deep dive into each message**

   For each message, call `abnormal_get_message` with the `messageId`. Examine:
   - `returnPath` and `replyTo` — look for mismatches from the sender domain (BEC indicator)
   - `links` — list malicious or suspicious URLs and their verdicts
   - `attachments` — list attachment names and types
   - `authenticationResults` — SPF/DKIM/DMARC results
   - `autoRemediated` — whether Abnormal already removed the message

4. **Assess remediation status**

   For the overall case and each message:
   - `REMEDIATED` — Message has been removed from mailbox(es)
   - `NOT_REMEDIATED` — Action required; trigger remediation
   - `REMEDIATION_IN_PROGRESS` — Currently being processed

5. **Trigger remediation if needed**

   For any messages with `remediationStatus=NOT_REMEDIATED`, call `abnormal_manage_remediation` with `action=REMEDIATE`.

6. **Present investigation summary**

   Report:
   - Threat type and attack description
   - List of affected users
   - Key attack indicators (reply-to mismatch, financial language, malicious links, etc.)
   - Authentication results (note: BEC often passes SPF/DKIM/DMARC)
   - Remediation status for all messages
   - Recommended next steps based on threat type

7. **Provide threat-type-specific recommendations**

   - **BEC:** Alert client finance team; confirm no wire transfers or payroll changes were made
   - **PHISHING:** Advise affected users to change passwords; check for MFA bypass
   - **ACCOUNT_TAKEOVER:** Immediately lock the compromised account; reset password and revoke sessions

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| threat_id | string | Yes | The Abnormal threat case ID (e.g. `threat-abc123`) |

## Examples

### Investigate a Specific Threat

```
/threat-investigation --threat_id "threat-abc123"
```

## Error Handling

- **Threat not found:** Verify the threat ID; use the Abnormal Security Portal to confirm the case exists
- **Remediation fails:** The Abnormal M365/Exchange integration may need attention; check the portal
- **Empty indicators list:** Some early-stage detections may have limited indicator data — rely on the `summary` field

## Related Commands

- `/abuse-report-review` - Review user-reported phishing emails
