---
description: >
  Use this skill when working with CIPP alert management - viewing alerts,
  querying audit logs, tracking incidents, filtering events by type and
  time range, configuring alert notifications, and reviewing webhook
  configurations.
triggers:
  - cipp alert
  - cipp audit
  - cipp log
  - cipp incident
  - cipp notification
  - cipp webhook
  - cipp event
  - cipp monitor
---

# CIPP Alert Management

## Overview

CIPP provides alert monitoring and audit log access for managed M365 tenants. This includes CIPP-generated alerts (from standards compliance monitoring, best practice checks, and scheduled tasks), Microsoft 365 service health alerts, and access to the unified audit log for forensic investigation. Alerts can be configured to trigger webhook notifications for integration with PSA/ticketing systems.

## Key Concepts

### Alert Sources

CIPP alerts come from multiple sources:

| Source | Description | Examples |
|--------|-------------|---------|
| **Standards Monitor** | Drift detection from deployed standards | MFA disabled, audit logging turned off |
| **Best Practice Analyser** | Compliance check failures | Global admin count exceeded, DKIM not configured |
| **Service Health** | Microsoft 365 service incidents | Exchange Online degradation, Teams outage |
| **Audit Log** | Suspicious or notable M365 activities | Admin role assigned, mailbox forwarding rule created |
| **Webhook Events** | External events forwarded to CIPP | Custom integrations |

### Audit Log Event Categories

The M365 unified audit log contains events across all workloads:

| Category | Examples |
|----------|---------|
| **Azure AD** | User creation, password reset, role assignment, app consent |
| **Exchange** | Mailbox access, forwarding rule, delegate addition, message deletion |
| **SharePoint** | File sharing, external access, site creation, permission changes |
| **Teams** | Team creation, member addition, channel changes, meeting recordings |
| **Compliance** | DLP policy match, retention label applied, eDiscovery search |
| **Power Platform** | Flow creation, app publication, connector usage |

### Alert Severity Levels

| Severity | Meaning | Response Time |
|----------|---------|---------------|
| Critical | Immediate security risk or service outage | Investigate within 1 hour |
| High | Significant security concern or degraded service | Investigate within 4 hours |
| Medium | Notable event requiring review | Review within 24 hours |
| Low | Informational event | Review during regular audit |

## Endpoints

### ListAlerts

List alerts across one or all tenants.

```bash
# List alerts for all tenants
curl -s "${CIPP_BASE_URL}/api/ListAlerts" \
  -H "x-api-key: ${CIPP_API_KEY}"

# List alerts for a specific tenant
curl -s "${CIPP_BASE_URL}/api/ListAlerts?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | No | Specific tenant (all tenants if omitted) |

**Response:**

```json
[
  {
    "Tenant": "contoso.onmicrosoft.com",
    "TenantDisplayName": "Contoso Ltd",
    "AlertType": "Standards",
    "Severity": "High",
    "Title": "MFA Disabled for Admin Account",
    "Message": "User admin@contoso.com had MFA disabled. This violates the deployed MFA standard.",
    "EventDateTime": "2026-02-24T07:30:00Z",
    "ResolvedDateTime": null,
    "Status": "Active"
  },
  {
    "Tenant": "fabrikam.onmicrosoft.com",
    "TenantDisplayName": "Fabrikam Inc",
    "AlertType": "ServiceHealth",
    "Severity": "Medium",
    "Title": "Exchange Online - Delayed Email Delivery",
    "Message": "Some users may experience delays in email delivery.",
    "EventDateTime": "2026-02-24T06:00:00Z",
    "ResolvedDateTime": "2026-02-24T08:00:00Z",
    "Status": "Resolved"
  }
]
```

### ListAuditLogs

Query the unified audit log for a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListAuditLogs?TenantFilter=contoso.onmicrosoft.com&StartDate=2026-02-23&EndDate=2026-02-24&Type=Exchange" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |
| `StartDate` | string | No | Start date (YYYY-MM-DD), defaults to 24 hours ago |
| `EndDate` | string | No | End date (YYYY-MM-DD), defaults to now |
| `Type` | string | No | Event type filter (see below) |

**Type Filter Values:**

| Type | Description |
|------|-------------|
| `Exchange` | Exchange Online events |
| `AzureActiveDirectory` | Azure AD / Entra ID events |
| `SharePoint` | SharePoint and OneDrive events |
| `DLP` | Data Loss Prevention events |
| `General` | General audit events |

**Response:**

```json
[
  {
    "CreationDate": "2026-02-24T07:25:00Z",
    "UserIds": "admin@contoso.com",
    "Operations": "Set-Mailbox",
    "AuditData": {
      "ObjectId": "jdoe@contoso.com",
      "Parameters": [
        {
          "Name": "ForwardingSmtpAddress",
          "Value": "smtp:external@gmail.com"
        }
      ]
    },
    "ResultStatus": "Succeeded",
    "Workload": "Exchange"
  }
]
```

> **IMPORTANT:** The above example shows a mailbox forwarding rule being set to an external address. This is a common indicator of compromise and should trigger immediate investigation.

### ListServiceHealth

Check Microsoft 365 service health for a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListServiceHealth?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Response:**

```json
[
  {
    "Service": "Exchange Online",
    "Status": "ServiceDegradation",
    "Title": "Users may be unable to send or receive email",
    "StartDateTime": "2026-02-24T05:00:00Z",
    "Classification": "Incident",
    "Feature": "Mail Delivery",
    "ImpactDescription": "Users in North America may experience delays in email delivery."
  },
  {
    "Service": "Microsoft Teams",
    "Status": "ServiceOperational",
    "Title": null,
    "StartDateTime": null,
    "Classification": null,
    "Feature": null,
    "ImpactDescription": null
  }
]
```

**Service Status Values:**

| Status | Meaning |
|--------|---------|
| `ServiceOperational` | Service is functioning normally |
| `ServiceDegradation` | Service is experiencing performance issues |
| `ServiceInterruption` | Service is experiencing a significant outage |
| `RestoringService` | Microsoft is actively working to restore the service |
| `ExtendedRecovery` | Recovery is taking longer than expected |
| `InvestigationSuspended` | Investigation has been paused |
| `ServiceRestored` | Service has been restored |
| `FalsePositive` | Alert was a false positive |
| `PostIncidentReviewPublished` | Post-incident review has been published |

### ListMailboxStatistics

Get mailbox statistics for a tenant (useful for monitoring mailbox sizes and quotas).

```bash
curl -s "${CIPP_BASE_URL}/api/ListMailboxStatistics?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

## Alert Monitoring Workflows

### Daily Alert Review

A standard daily alert review process:

1. **Check CIPP alerts** - Call `ListAlerts` without a tenant filter to see all active alerts
2. **Filter by severity** - Focus on Critical and High severity first
3. **Check service health** - For each affected tenant, call `ListServiceHealth`
4. **Investigate** - For security alerts, query the audit log with `ListAuditLogs`
5. **Resolve** - Take action on each alert (remediate, escalate, or dismiss)
6. **Document** - Log findings in your PSA/ticketing system

### Security Incident Investigation

When a security alert triggers:

1. **Assess the alert** - Review the alert details and severity
2. **Query audit logs** - Call `ListAuditLogs` for the affected tenant and time range
3. **Look for patterns** - Common attack indicators:
   - Mailbox forwarding rules to external addresses
   - Admin role assignments
   - Bulk file downloads from SharePoint
   - App consent grants
   - Sign-ins from unusual locations
4. **Contain** - If compromise is confirmed:
   - Revoke user sessions (`ExecRevokeSessions`)
   - Reset passwords (`ExecResetPassword`)
   - Disable accounts (`ExecDisableUser`)
5. **Investigate further** - Use sign-in logs and audit logs to map the full scope
6. **Remediate** - Remove malicious forwarding rules, revoke app consents, etc.
7. **Report** - Document the incident and communicate to the client

### High-Risk Audit Log Events

Events that should always be monitored:

| Event | Operation | Why It Matters |
|-------|-----------|----------------|
| Mailbox forwarding | `Set-Mailbox` with `ForwardingSmtpAddress` | Data exfiltration indicator |
| Admin role granted | `Add member to role` | Privilege escalation |
| App consent | `Consent to application` | Potential OAuth phishing |
| Transport rule created | `New-TransportRule` | Can redirect or hide email |
| Inbox rule created | `New-InboxRule` | Can hide attacker activity |
| eDiscovery search | `SearchStarted` | Potential data theft |
| Bulk file download | `FileDownloaded` (high volume) | Data exfiltration |
| External sharing | `SharingSet` with external users | Unauthorized data sharing |

## Webhook Configuration

CIPP can send alert notifications to external systems via webhooks:

### Supported Webhook Targets

| Target | Use Case |
|--------|----------|
| PSA/Ticketing | Auto-create tickets for alerts |
| Slack/Teams | Real-time notification channels |
| Custom endpoint | Integration with internal tools |

### Webhook Payload Format

CIPP webhooks send a JSON payload:

```json
{
  "AlertType": "Standards",
  "Tenant": "contoso.onmicrosoft.com",
  "Title": "MFA Disabled for Admin Account",
  "Severity": "High",
  "Message": "User admin@contoso.com had MFA disabled.",
  "Timestamp": "2026-02-24T07:30:00Z"
}
```

Webhook configuration is managed through the CIPP web interface at **Settings > Backend > Alerts**.

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `Audit log not available` | Unified audit logging is not enabled for the tenant | Enable audit logging via `AuditLog` standard or manually |
| `No data for time range` | Audit log data does not exist for the requested period | Expand the date range (logs are retained for 90 days on E3, 365 days on E5) |
| `Service health unavailable` | Permission error or Graph API issue | Refresh CPV permissions |
| `Alert query timeout` | Too many alerts in the result set | Narrow the time range or filter by tenant |

### Audit Log Retention

| License Tier | Retention Period |
|-------------|-----------------|
| Microsoft 365 E3 / Business Premium | 90 days |
| Microsoft 365 E5 / E5 Compliance | 365 days |
| Advanced Audit add-on | 365 days |

## Best Practices

1. **Enable audit logging everywhere** - Deploy the `AuditLog` standard to all tenants
2. **Review alerts daily** - Critical and high-severity alerts should be reviewed within hours
3. **Monitor forwarding rules** - Mailbox forwarding to external addresses is the most common compromise indicator
4. **Set up webhooks** - Integrate CIPP alerts with your PSA for automatic ticket creation
5. **Use time-bounded queries** - Always specify `StartDate` and `EndDate` for audit log queries to avoid timeouts
6. **Filter by type** - Use the `Type` parameter to narrow audit log queries to relevant workloads
7. **Correlate across sources** - Combine audit log events with sign-in logs and alerts for a complete picture
8. **Document investigation steps** - Record what you checked, what you found, and what actions you took
9. **Automate common responses** - Use CIPP webhooks + PSA automation for routine alert handling
10. **Retain evidence** - Export audit log data for incidents before it expires

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and error handling
- [Tenants](../tenants/SKILL.md) - Tenant identification for alert filtering
- [Users](../users/SKILL.md) - User management for incident response
- [Security](../security/SKILL.md) - Security posture assessment
- [Standards](../standards/SKILL.md) - Standards compliance monitoring
