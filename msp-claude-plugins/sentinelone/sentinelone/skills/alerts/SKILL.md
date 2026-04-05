---
name: "SentinelOne Alerts"
description: >
  Use this skill when working with SentinelOne alerts - triaging new alerts,
  investigating specific alerts, searching by severity or status, reviewing
  alert timelines, and managing alert workflows across MSP client
  environments. Covers all alert tools, severity levels, status values,
  view types, GraphQL filter syntax, and cursor-based pagination.
when_to_use: "When triaging new alerts, investigating specific alerts, searching by severity or status, reviewing alert timelines, and managing alert workflows across MSP client environments"
triggers:
  - sentinelone alert
  - sentinelone threat
  - sentinelone detection
  - sentinelone incident
  - alert triage
  - alert investigation
  - sentinelone severity
  - sentinelone critical
  - sentinelone high
  - alert management
  - sentinelone notification
  - security alert
---

# SentinelOne Unified Alert Management

## Overview

Alerts in SentinelOne represent detected threats, suspicious behaviors, policy violations, and security events across the Singularity platform. The unified alert system aggregates detections from endpoints, cloud workloads, Kubernetes, identity providers, infrastructure-as-code scanning, and offensive security testing into a single view. For MSPs, alerts are the primary triage surface -- every investigation starts with understanding what was detected, its severity, and which client environment is affected.

All alert tools are **read-only**. You can view, search, and investigate alerts, but you cannot modify alert status, assignments, or take response actions through the MCP tools.

## MCP Tools

### Available Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `get_alert` | Get a single alert by ID | `alertId` (required) |
| `list_alerts` | List alerts with filters | `severity`, `status`, `viewType`, `limit`, `cursor`, `sortBy`, `sortOrder` |
| `search_alerts` | Search alerts with GraphQL filters | `filters` (array of fieldId/filterType/values), `limit`, `cursor` |
| `get_alert_notes` | Get notes/comments on an alert | `alertId` (required) |
| `get_alert_history` | Get timeline of changes for an alert | `alertId` (required) |

### List Alerts

Call `list_alerts` with optional parameters:

- **Filter by severity:** Set `severity` to `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, or `UNKNOWN`
- **Filter by status:** Set `status` to `NEW`, `IN_PROGRESS`, `RESOLVED`, or `FALSE_POSITIVE`
- **Filter by view type:** Set `viewType` to scope the alert domain (see View Types below)
- **Sort results:** Set `sortBy` (e.g., `severity`, `detectedAt`) and `sortOrder` (`ASC` or `DESC`)
- **Paginate:** Set `limit` and use `cursor` from the response for subsequent pages

**Example: List all new critical alerts:**
- `list_alerts` with `severity=CRITICAL`, `status=NEW`, `sortBy=detectedAt`, `sortOrder=DESC`

**Example: List all cloud alerts:**
- `list_alerts` with `viewType=CLOUD`, `limit=50`

### Search Alerts

Call `search_alerts` with a `filters` array for complex queries:

**Example: Search for alerts on a specific endpoint:**
- `search_alerts` with `filters=[{"fieldId": "endpointName", "filterType": "CONTAINS", "values": ["workstation-01"]}]`

**Example: Search for alerts with a specific threat name:**
- `search_alerts` with `filters=[{"fieldId": "name", "filterType": "CONTAINS", "values": ["ransomware"]}]`

### Get Alert Details

Call `get_alert` with the `alertId` to retrieve full details including threat context, affected assets, and detection metadata.

### Get Alert Notes

Call `get_alert_notes` with the `alertId` to retrieve analyst comments and investigation notes attached to the alert.

### Get Alert History

Call `get_alert_history` with the `alertId` to retrieve the full timeline of status changes, assignments, and updates.

## Key Concepts

### Severity Levels

| Severity | Description | MSP Action |
|----------|-------------|------------|
| `CRITICAL` | Active, confirmed threat requiring immediate response | Immediate escalation; notify client |
| `HIGH` | High-confidence detection likely requiring investigation | Investigate within 1 hour |
| `MEDIUM` | Moderate-confidence detection or policy violation | Investigate within 4 hours |
| `LOW` | Low-confidence detection or informational security event | Review during next triage cycle |
| `INFO` | Informational event, no immediate action needed | Log for trending and reporting |
| `UNKNOWN` | Severity not yet classified | Review and classify |

### Alert Status Values

| Status | Description |
|--------|-------------|
| `NEW` | Alert has been created and not yet reviewed |
| `IN_PROGRESS` | Alert is being investigated by an analyst |
| `RESOLVED` | Alert has been investigated and closed |
| `FALSE_POSITIVE` | Alert was a false detection |

### View Types

View types scope alerts to specific detection domains:

| View Type | Description |
|-----------|-------------|
| `ALL` | All alert types (default) |
| `CLOUD` | Cloud infrastructure alerts (AWS, Azure, GCP) |
| `KUBERNETES` | Kubernetes cluster and workload alerts |
| `IDENTITY` | Identity-based alerts (Active Directory, Entra ID) |
| `INFRASTRUCTURE_AS_CODE` | IaC scanning alerts (Terraform, CloudFormation) |
| `ADMISSION_CONTROLLER` | Kubernetes admission controller alerts |
| `OFFENSIVE_SECURITY` | Penetration testing and red team alerts |
| `SECRET_SCANNING` | Exposed secrets and credential alerts |

### GraphQL Filter Syntax

Search tools use GraphQL filters with the following structure:

```json
{
  "fieldId": "severity",
  "filterType": "EQUALS",
  "values": ["CRITICAL"]
}
```

**Filter Types:**

| Filter Type | Description |
|-------------|-------------|
| `EQUALS` | Exact match on a single value |
| `NOT_EQUALS` | Exclude exact match |
| `CONTAINS` | Substring match |
| `IN` | Match any value in the list |
| `NOT_IN` | Exclude any value in the list |

**Negation:**

Add `"isNegated": true` to any filter to invert it:

```json
{
  "fieldId": "status",
  "filterType": "EQUALS",
  "values": ["RESOLVED"],
  "isNegated": true
}
```

### Cursor-Based Pagination

Alert list and search tools use cursor-based pagination:

1. Call the tool with `limit` (e.g., 50)
2. The response includes a `cursor` value
3. Pass the `cursor` to the next call to fetch the next page
4. Continue until no more results are returned

## Field Reference

### Core Alert Fields

| Field | Type | Description |
|-------|------|-------------|
| `alertId` | string | Unique alert identifier |
| `name` | string | Alert/detection name |
| `severity` | string | CRITICAL/HIGH/MEDIUM/LOW/INFO/UNKNOWN |
| `status` | string | NEW/IN_PROGRESS/RESOLVED/FALSE_POSITIVE |
| `detectedAt` | datetime | When the alert was first detected |
| `viewType` | string | Detection domain (CLOUD, KUBERNETES, etc.) |
| `endpointName` | string | Affected endpoint hostname |
| `siteName` | string | SentinelOne site (typically maps to MSP client) |
| `accountName` | string | SentinelOne account |
| `description` | string | Alert description with threat context |
| `mitreAttackTechniques` | array | MITRE ATT&CK technique IDs |
| `indicators` | array | Indicators of compromise (IOCs) |
| `affectedAssets` | array | Assets involved in the detection |

## Common Workflows

### Triage New Alerts

The most critical MSP workflow -- reviewing new alerts by severity:

1. Call `list_alerts` with `status=NEW`, `sortBy=severity`, `sortOrder=DESC`, `limit=50`
2. Review CRITICAL and HIGH alerts first
3. For each critical alert, call `get_alert` with the `alertId` for full details
4. Optionally call `get_alert_notes` and `get_alert_history` for context
5. Build a triage summary with alert name, severity, client (site), affected endpoint, and detection time

### Investigate a Specific Alert

1. Call `get_alert` with the `alertId` to get full details
2. Call `get_alert_notes` to see any existing investigation notes
3. Call `get_alert_history` to see the timeline of changes
4. Use `purple_ai` to investigate the threat described in the alert
5. Cross-reference with `list_inventory_items` to understand the affected asset

### Search Alerts by Severity Across Clients

1. Call `search_alerts` with `filters=[{"fieldId": "severity", "filterType": "IN", "values": ["CRITICAL", "HIGH"]}]`
2. Group results by `siteName` (client) to see which clients have the most critical alerts
3. Prioritize investigation based on alert count and severity distribution

### Review Alert Timeline

1. Call `get_alert` with the `alertId`
2. Call `get_alert_history` to see all status changes and assignments
3. Build a chronological timeline of detection, triage, and resolution

### Client Security Summary (QBR)

1. Call `list_alerts` filtered by site/account for the client
2. Aggregate by severity: count of CRITICAL, HIGH, MEDIUM, LOW alerts
3. Calculate mean time to resolve for resolved alerts
4. Identify top recurring alert types
5. Present as a security posture summary for the quarterly business review

## Response Examples

**Alert Detail:**

```json
{
  "alertId": "1234567890",
  "name": "Suspicious PowerShell Execution",
  "severity": "HIGH",
  "status": "NEW",
  "detectedAt": "2026-02-24T08:15:00.000Z",
  "viewType": "ALL",
  "endpointName": "ACME-WS-042",
  "siteName": "Acme Corporation",
  "accountName": "MSP Partner Account",
  "description": "PowerShell process executed encoded command that downloads and executes remote payload",
  "mitreAttackTechniques": ["T1059.001", "T1027", "T1105"],
  "indicators": [
    {"type": "IP", "value": "203.0.113.42"},
    {"type": "SHA256", "value": "abc123..."}
  ]
}
```

**Alert History:**

```json
[
  {
    "timestamp": "2026-02-24T08:15:00.000Z",
    "action": "CREATED",
    "details": "Alert created by detection engine"
  },
  {
    "timestamp": "2026-02-24T08:30:00.000Z",
    "action": "STATUS_CHANGED",
    "details": "Status changed from NEW to IN_PROGRESS",
    "actor": "analyst@msp.com"
  }
]
```

## Error Handling

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| Alert not found | Invalid alertId | Verify the alert ID with `list_alerts` |
| Invalid severity filter | Wrong severity value | Use CRITICAL, HIGH, MEDIUM, LOW, INFO, or UNKNOWN |
| Invalid status filter | Wrong status value | Use NEW, IN_PROGRESS, RESOLVED, or FALSE_POSITIVE |
| Invalid view type | Wrong viewType value | Use ALL, CLOUD, KUBERNETES, IDENTITY, etc. |
| Empty results | No matching alerts | Widen filters or check time range |
| Authentication error | Invalid token | Verify Service User token is Account or Site level |

## Best Practices

1. **Triage by severity** - Always start with CRITICAL and HIGH severity alerts
2. **Filter by status** - Focus on NEW alerts during triage; include IN_PROGRESS for follow-up
3. **Scope to client** - Use site/account filters when investigating a specific client
4. **Check notes and history** - Always review existing notes before starting a new investigation
5. **Cross-reference with Purple AI** - Use `purple_ai` to investigate the threat context of any alert
6. **Use view types** - Filter by CLOUD, KUBERNETES, or IDENTITY to focus on specific domains
7. **Paginate large result sets** - Use cursor-based pagination for environments with many alerts
8. **Track resolution metrics** - Monitor mean time to triage and mean time to resolve
9. **Aggregate for reporting** - Build severity-based summaries for client QBRs
10. **Investigate before dismissing** - Never mark an alert as false positive without investigation

## Related Skills

- [Purple AI](../purple-ai/SKILL.md) - Natural language investigation of alert threats
- [Threat Hunting](../threat-hunting/SKILL.md) - PowerQuery execution for deep analysis
- [API Patterns](../api-patterns/SKILL.md) - MCP tools reference and connection info
- [Inventory](../inventory/SKILL.md) - Asset context for affected endpoints
- [Vulnerabilities](../vulnerabilities/SKILL.md) - Vulnerability context for compromised assets
