---
name: review-events
description: Review recent Avanan security events, filter by type, and show quarantined items requiring attention
arguments:
  - name: event_type
    description: Filter by event type (malware, phishing, spam, dlp, anomaly, impostor)
    required: false
  - name: severity
    description: Filter by severity level (critical, high, medium, low)
    required: false
  - name: hours
    description: Number of hours to look back
    required: false
    default: "24"
  - name: status
    description: Filter by event status (new, quarantined, released, safe, reported)
    required: false
    default: "new"
  - name: tenant_id
    description: Scope to a specific tenant (MSP Smart API — omit for all tenants)
    required: false
---

# Check Point Avanan Security Event Review

Review recent Avanan security events across managed customer tenants. Lists events by severity, highlights items requiring action, and shows quarantined messages awaiting review. This is the primary daily security operations workflow for MSP teams using Avanan.

## Prerequisites

- Avanan MCP server connected with valid API credentials (Standard or Smart API)
- `AVANAN_CLIENT_ID`, `AVANAN_CLIENT_SECRET`, and `AVANAN_REGION` configured
- MCP tools `avanan_search_events`, `avanan_get_event`, and `avanan_perform_event_action` available

## Steps

1. **Fetch security events**

   Call `avanan_search_events` with the specified filters and `startDate` set to `now - {hours}`. If `status` filter is provided, apply it. If `event_type` or `severity` filters are provided, include them. Paginate if total > limit.

2. **Sort and group results**

   Sort events by severity (critical → high → medium → low). Group by tenant if using Smart API with multiple tenants. Count events per type and severity.

3. **Build event summary**

   Present a summary table showing: event ID, tenant, type, severity, sender, recipient(s), subject, detected time, and current status.

4. **Highlight action items**

   Flag events with status `new` and severity `critical` or `high` as requiring immediate action. Flag `quarantined` events that are false-positive candidates (lower confidence scores).

5. **Provide recommended actions**

   For each high-priority event, recommend the appropriate action:
   - Confirmed threats: use `/quarantine` action via `avanan_perform_event_action`
   - Suspected false positives: use `/markSafe` action
   - Novel threats: use `/report` to submit to Check Point ThreatCloud

6. **Summarize findings**

   Provide a concise summary: X total events, Y requiring immediate action, Z already quarantined, W potential false positives.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| event_type | string | No | all | Filter: `malware`, `phishing`, `spam`, `dlp`, `anomaly`, `impostor` |
| severity | string | No | all | Filter: `critical`, `high`, `medium`, `low` |
| hours | integer | No | 24 | Look-back window in hours |
| status | string | No | new | Filter: `new`, `quarantined`, `released`, `safe`, `reported` |
| tenant_id | string | No | all | Scope to a specific tenant (Smart API) |

## Examples

### Daily All-Event Review

```
/review-events
```

### Phishing Events Only (Last 48 Hours)

```
/review-events --event_type phishing --hours 48
```

### Critical Events Across All Tenants

```
/review-events --severity critical
```

### Review Quarantined Items (Potential False Positives)

```
/review-events --status quarantined
```

### Review Events for a Specific Client

```
/review-events --tenant_id tenant-acme-001
```

## Error Handling

- **No events returned:** No new threats in the window — confirm correct region and tenant are configured
- **401 Unauthorized:** Verify Client ID and Secret; check that the Bearer token has not expired
- **Smart API access denied:** Confirm the account has MSP/partner Smart API access enabled

## Related Commands

- `/manage-exceptions` - Add whitelist exceptions for confirmed false positives
