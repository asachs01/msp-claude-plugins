---
name: abuse-report-review
description: Review user-reported phishing emails in the Abnormal Security Abuse Mailbox
arguments:
  - name: start
    description: Start date/time in ISO 8601 format (e.g. 2026-03-01T00:00:00Z)
    required: false
  - name: verdict
    description: Filter by Abnormal verdict (MALICIOUS, SUSPICIOUS, SAFE, UNKNOWN)
    required: false
  - name: unresolved_only
    description: Show only reports where remediation has not been completed
    required: false
    default: "false"
---

# Abnormal Security Abuse Report Review

Review user-reported phishing emails submitted to the Abnormal Security Abuse Mailbox. Process each report by verdict, trigger remediation for confirmed threats, and communicate outcomes to end users and clients. This is the primary command for processing the end-user phishing report queue.

## Prerequisites

- Abnormal Security MCP server connected with valid API token
- Abnormal Abuse Mailbox feature enabled and configured in the tenant
- MCP tools `abnormal_get_abuse_reports` and `abnormal_manage_remediation` available

## Steps

1. **Retrieve abuse reports**

   Call `abnormal_get_abuse_reports` for the specified time range (default: past 24 hours). Apply `verdict` filter if specified. Paginate through all results.

2. **Categorize reports by verdict**

   Sort reports into groups:
   - **MALICIOUS** — Confirmed attacks
   - **SUSPICIOUS** — Requires investigation
   - **SAFE** — False positive reports
   - **UNKNOWN** — Insufficient data

3. **Process MALICIOUS reports**

   For each MALICIOUS report:
   - Check `remediationStatus` — if `NOT_REMEDIATED`, call `abnormal_manage_remediation`
   - Note `linkedThreatId` — if present, the full threat case is available for deeper investigation
   - Flag for client notification

4. **Process SUSPICIOUS reports**

   For each SUSPICIOUS report:
   - Review `attackDescription` for indicator details
   - If `linkedThreatId` is present, use `/threat-investigation` for full context
   - Escalate unresolved SUSPICIOUS reports to the security team

5. **Process SAFE reports**

   For each SAFE report:
   - Note the reporter's email for user feedback
   - No remediation required

6. **Summarize and report**

   Present:
   - Count breakdown by verdict (MALICIOUS / SUSPICIOUS / SAFE / UNKNOWN)
   - List of confirmed threats with affected users and remediation status
   - List of false positives (SAFE) — users to receive reassurance communication
   - Any SUSPICIOUS reports requiring escalation
   - Recommended next steps

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| start | string | No | -24h | Start datetime for report query (ISO 8601) |
| verdict | string | No | all | Filter by verdict: MALICIOUS, SUSPICIOUS, SAFE, UNKNOWN |
| unresolved_only | boolean | No | false | Show only reports with pending or missing remediation |

## Examples

### Review All Abuse Reports (Last 24 Hours)

```
/abuse-report-review
```

### Review Only Malicious Confirmed Reports

```
/abuse-report-review --verdict MALICIOUS
```

### Review Unresolved Reports from This Week

```
/abuse-report-review --start "2026-02-24T00:00:00Z" --unresolved_only true
```

## Error Handling

- **No reports returned:** Verify the Abnormal Abuse Mailbox is enabled; users may be reporting via other channels
- **SUSPICIOUS verdict with no linked threat:** Investigate manually via the Abnormal Portal — the AI flagged indicators but did not create a full threat case
- **Remediation fails for MALICIOUS report:** Check Abnormal M365 integration health in the portal

## Related Commands

- `/threat-investigation` - Deep investigation of a specific threat case
