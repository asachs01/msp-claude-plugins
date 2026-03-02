---
name: org-email-stats
description: Get email statistics for one or all MSP organizations in Proofpoint Essentials
arguments:
  - name: org_id
    description: Specific organization ID to query (omit for all organizations)
    required: false
  - name: days
    description: Number of days to include in the statistics window
    required: false
    default: "30"
  - name: interval
    description: Aggregation granularity (day, week, month)
    required: false
    default: "day"
---

# Proofpoint Essentials Org Email Statistics

Retrieve email volume and security filtering statistics for one or all Proofpoint Essentials organizations. Use this command for monthly reporting, billing verification, org health checks, and identifying organizations with unusual email patterns.

## Prerequisites

- Proofpoint MCP server connected with valid Essentials API credentials
- MSP/partner API access enabled on the Proofpoint account
- MCP tools `proofpoint_list_orgs` and `proofpoint_get_email_stats` available

## Steps

1. **Resolve target organizations**

   If `org_id` is provided, query only that organization. If not provided, call `proofpoint_list_orgs` first to get all active org IDs. Paginate through all orgs if total > page size.

2. **Fetch statistics per organization**

   Calculate `startDate` as `now - {days} days` and `endDate` as now. Call `proofpoint_get_email_stats` for each org with the specified interval. For all-org queries with more than 10 orgs, note that this may take a moment.

3. **Compute summary metrics**

   For each org, calculate:
   - **Block rate** = blocked / totalInbound * 100
   - **Quarantine rate** = quarantined / totalInbound * 100
   - **Malware rate** = malwareBlocked / totalInbound * 100
   - **Per-user volume** = totalInbound / userCount (from org listing)

4. **Present results**

   For a single org: detailed stats with daily/weekly breakdown.
   For all orgs: summary table with columns for org name, total inbound, total blocked, block rate, malware count, user count.

5. **Flag anomalies**

   Highlight organizations where:
   - Malware detections > 0 (warrants investigation)
   - Block rate > 40% (high threat targeting)
   - Block rate < 0.5% (possible misconfiguration)
   - Total inbound = 0 (possible MX routing issue)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| org_id | string | No | all | Specific org to query; omit for all orgs |
| days | integer | No | 30 | Statistics window in days (1–90) |
| interval | string | No | day | Aggregation: `day`, `week`, or `month` |

## Examples

### All Organizations — Monthly Stats

```
/org-email-stats
```

### Single Organization — Last 7 Days

```
/org-email-stats --org_id acme-corp-us --days 7 --interval day
```

### Weekly Trend for All Orgs

```
/org-email-stats --days 90 --interval week
```

## Error Handling

- **Authorization error on list_orgs:** Credentials may not have MSP/partner access — confirm account type with Proofpoint
- **org_id not found:** Use the exact `orgId` value from `proofpoint_list_orgs` — names are not IDs
- **Empty stats (totalInbound: 0):** Check MX records; confirm the org is actively receiving email
- **Timeout on all-org query:** Reduce `days` window or query orgs in batches of 10

## Related Commands

- `/trace-message` - Drill into specific messages for an org
- `/threat-summary` - Get TAP threat intelligence for deeper security context
