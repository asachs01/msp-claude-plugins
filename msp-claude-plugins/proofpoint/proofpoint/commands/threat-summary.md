---
name: threat-summary
description: Generate a TAP threat summary showing recent clicks, blocked threats, and campaign activity
arguments:
  - name: hours
    description: Number of hours to look back (e.g. 24, 48, 168 for 7 days)
    required: false
    default: "24"
  - name: threat_type
    description: Filter by threat type (url, attachment, messageText) — omit for all types
    required: false
  - name: include_campaigns
    description: Whether to fetch campaign details for identified campaigns (true/false)
    required: false
    default: "true"
---

# Proofpoint TAP Threat Summary

Generate a comprehensive threat summary from Proofpoint TAP covering recent click events (blocked and permitted), message-level threat data, and active campaign intelligence. This is the primary daily or weekly threat review workflow for MSP security operations.

## Prerequisites

- Proofpoint MCP server connected with valid TAP API credentials
- `PROOFPOINT_PRINCIPAL`, `PROOFPOINT_SECRET`, and `PROOFPOINT_REGION` configured
- MCP tools `proofpoint_get_siem_clicks`, `proofpoint_get_siem_messages`, and `proofpoint_get_campaign` available

## Steps

1. **Fetch SIEM click events**

   Call `proofpoint_get_siem_clicks` with `interval: "PT{hours}H"`. Separate `clicksBlocked` from `clicksPermitted`. Permitted clicks are the higher-priority concern — users may have reached malicious content.

2. **Fetch SIEM message events**

   Call `proofpoint_get_siem_messages` with the same interval. Collect `messagesBlocked` for threat context. Extract unique `campaignId` values from `threatsInfoMap`.

3. **Fetch campaign details (if include_campaigns is true)**

   For each unique `campaignId` found, call `proofpoint_get_campaign`. Limit to a maximum of 10 campaigns to avoid excessive API calls. Summarize threat actor, malware families, and MITRE techniques.

4. **Build threat summary**

   Produce a structured summary with:
   - **Clicks Blocked:** Count + list of blocked URLs with classification and affected recipients
   - **Clicks Permitted (High Priority):** Count + detail on any permitted clicks — these users may be at risk
   - **Messages Blocked:** Count + top threat classifications (phish, malware, spam)
   - **Active Campaigns:** Campaign names, actors, families, and scope
   - **High-Risk Users:** Recipients who had permitted clicks or multiple threat exposures

5. **Provide actionable recommendations**

   For each permitted click, recommend immediate follow-up with the affected user (password reset for phish, endpoint scan for malware). For active campaigns, advise monitoring for additional targeting.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| hours | integer | No | 24 | Look-back window in hours (1–168) |
| threat_type | string | No | all | Filter: `url`, `attachment`, or `messageText` |
| include_campaigns | boolean | No | true | Fetch campaign details for identified campaigns |

## Examples

### Daily Threat Review

```
/threat-summary
```

### Weekly Threat Briefing

```
/threat-summary --hours 168
```

### URL Threat Focus

```
/threat-summary --threat_type url --hours 48
```

## Error Handling

- **No data returned:** Confirm `PROOFPOINT_REGION` matches the account's provisioned region — wrong region returns empty arrays silently
- **401 Unauthorized:** TAP credentials differ from Essentials credentials — verify the correct principal/secret for TAP
- **Rate limit (429):** Reduce the number of campaign detail fetches; fetch top 5 campaigns instead of all

## Related Commands

- `/trace-message` - Trace a specific message flagged in the threat summary
- `/org-email-stats` - Get email volume context for the organizations affected
