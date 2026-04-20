---
name: cipp-alert-review
description: Review recent alerts and audit log events
arguments:
  - name: hours
    description: Lookback window in hours (default 24)
    required: false
---

# CIPP Alert Review

Review recent alerts and notable audit log events across managed tenants. Displays CIPP alerts, Microsoft 365 service health incidents, and high-priority audit log events within the specified time window.

## Prerequisites

- CIPP API connection configured with `CIPP_BASE_URL` and `CIPP_API_KEY`
- API key must have read access to alert and audit log endpoints
- Unified audit logging should be enabled on target tenants

## Steps

1. **Get CIPP alerts**

   Call `ListAlerts` to retrieve all active alerts across tenants.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListAlerts" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

2. **Check service health**

   Call `ListServiceHealth` for each tenant (or use cross-tenant endpoint if available) to get Microsoft 365 service status.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListServiceHealth?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

3. **Query audit logs for high-risk events**

   Call `ListAuditLogs` for notable event types within the lookback window.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListAuditLogs?TenantFilter=${tenant}&StartDate=${start_date}&EndDate=${end_date}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

   Focus on high-risk events:
   - Mailbox forwarding rule changes
   - Admin role assignments
   - Application consent grants
   - Transport rule modifications
   - Bulk file operations

4. **Filter by time window**

   Filter all results to only include events within the specified lookback window (default: last 24 hours).

5. **Present alert summary**

   Display a prioritized alert summary organized by severity, with service health status and notable audit events.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| hours | number | No | 24 | Lookback window in hours |

## Examples

### Review Last 24 Hours (Default)

```
/cipp-alert-review
```

### Review Last 4 Hours

```
/cipp-alert-review --hours 4
```

### Review Last Week

```
/cipp-alert-review --hours 168
```

## Output

### Alert Summary with Events

```
CIPP Alert Review
================================================================
Time Window: Last 24 hours (2026-02-23 08:00 to 2026-02-24 08:00 UTC)
Scope: All Tenants (12)

Alert Summary:
  Critical: 1
  High:     3
  Medium:   5
  Low:      8
  Total:    17

Critical Alerts:
+---+-------------------+---------------------------------------------+------------------+
| # | Tenant            | Alert                                       | Time             |
+---+-------------------+---------------------------------------------+------------------+
| 1 | Adventure Works   | Mailbox forwarding to external address       | 2026-02-24 03:15 |
+---+-------------------+---------------------------------------------+------------------+

  DETAILS: User sales@adventure.com had a forwarding rule set to
  external-drop@protonmail.com. This is a potential compromise indicator.
  RECOMMENDED: Immediately revoke sessions, reset password, and remove
  the forwarding rule.

High Alerts:
+---+-------------------+---------------------------------------------+------------------+
| # | Tenant            | Alert                                       | Time             |
+---+-------------------+---------------------------------------------+------------------+
| 1 | Fabrikam Inc      | MFA disabled for admin account               | 2026-02-24 07:30 |
| 2 | Fourth Coffee     | Standards compliance drift - 3 checks failed | 2026-02-24 06:00 |
| 3 | Datum Corp        | CPV permissions expired                      | 2026-02-23 22:00 |
+---+-------------------+---------------------------------------------+------------------+

Medium Alerts:
+---+-------------------+---------------------------------------------+------------------+
| # | Tenant            | Alert                                       | Time             |
+---+-------------------+---------------------------------------------+------------------+
| 1 | Contoso Ltd       | New Global Admin added                       | 2026-02-24 05:00 |
| 2 | Litware Inc       | 5 inactive accounts detected                 | 2026-02-24 06:00 |
| 3 | Proseware         | DKIM not configured for new domain           | 2026-02-23 14:00 |
| 4 | VanArsdel Ltd     | Basic auth usage detected (SMTP)             | 2026-02-23 12:00 |
| 5 | Trey Research     | License utilization below 50%                | 2026-02-24 06:00 |
+---+-------------------+---------------------------------------------+------------------+

Service Health:
+---+-------------------+-------------------------------+------------------+
| # | Service           | Status                        | Since            |
+---+-------------------+-------------------------------+------------------+
| 1 | Exchange Online   | Service Degradation           | 2026-02-24 05:00 |
|   |                   | Delayed email delivery in NA  |                  |
+---+-------------------+-------------------------------+------------------+
All other services operational.

Notable Audit Events (last 24h):
+---+-------------------+---------------------------+---------------------+
| # | Tenant            | Event                     | Time                |
+---+-------------------+---------------------------+---------------------+
| 1 | Adventure Works   | Set-Mailbox forwarding    | 2026-02-24 03:15    |
| 2 | Contoso Ltd       | Add member to role (GA)   | 2026-02-24 05:00    |
| 3 | Fabrikam Inc      | Disable MFA for user      | 2026-02-24 07:30    |
| 4 | VanArsdel Ltd     | New-InboxRule (delete)    | 2026-02-23 15:30    |
+---+-------------------+---------------------------+---------------------+

Recommended Actions:
  1. CRITICAL: Investigate Adventure Works forwarding rule immediately
     - Revoke sessions for sales@adventure.com
     - Reset password and remove forwarding rule
  2. HIGH: Re-enable MFA for Fabrikam admin account
  3. HIGH: Redeploy standards to Fourth Coffee
  4. HIGH: Refresh CPV permissions for Datum Corp
  5. MEDIUM: Verify the new Global Admin at Contoso was authorized
================================================================
```

### No Alerts Found

```
CIPP Alert Review
================================================================
Time Window: Last 24 hours (2026-02-23 08:00 to 2026-02-24 08:00 UTC)
Scope: All Tenants (12)

No alerts found in the last 24 hours.

Service Health: All services operational.

Notable Audit Events: None detected.

All tenants are operating normally within the review period.
================================================================
```

### Stale Data Warning

```
CIPP Alert Review
================================================================
Time Window: Last 24 hours

Warning: Alert data may be stale for some tenants.

Tenants with data issues:
  - Datum Corp: CPV permissions expired (last data: 2026-02-20)
  - Fourth Coffee: Audit logging not enabled

These tenants may have undetected alerts. Address the underlying
issues to restore monitoring coverage.

[Alert data for remaining 10 tenants shown below...]
================================================================
```

## Error Handling

### API Connection Error

```
Error: Unable to connect to CIPP API at ${CIPP_BASE_URL}

Verify your CIPP_BASE_URL and CIPP_API_KEY environment variables.
```

### Audit Log Not Enabled

```
Warning: Audit logging is not enabled for the following tenants:
  - Fourth Coffee
  - Adventure Works (partially enabled)

Deploy the AuditLog standard to enable full audit coverage:
  Use /cipp-standards-check to review and deploy standards.
```

### Timeout

```
Warning: Alert review timed out after 60 seconds.

For large tenant sets, the alert review may take longer than expected.
Try narrowing the scope:
  /cipp-alert-review --hours 4
Or review a specific tenant's alerts directly via the CIPP API.
```

## CIPP API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `ListAlerts` | Retrieve CIPP-generated alerts across tenants |
| `ListServiceHealth` | Check Microsoft 365 service health |
| `ListAuditLogs` | Query the unified audit log for notable events |
| `ListTenants` | Get tenant list for cross-tenant reporting |

## Related Commands

- `/cipp-tenant-summary` - List all managed tenants
- `/cipp-security-posture` - Deep security analysis alongside alert review
- `/cipp-standards-check` - Check compliance for standards-related alerts
- `/cipp-user-offboard` - Offboard compromised accounts found in alerts
