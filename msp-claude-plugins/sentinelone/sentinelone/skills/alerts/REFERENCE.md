# SentinelOne Alerts — Reference

Detailed field definitions, response examples, severity guidance, and error handling for the alert tools.

## Severity Levels

| Severity | Description | MSP Action |
|----------|-------------|------------|
| `CRITICAL` | Active, confirmed threat requiring immediate response | Immediate escalation; notify client |
| `HIGH` | High-confidence detection likely requiring investigation | Investigate within 1 hour |
| `MEDIUM` | Moderate-confidence detection or policy violation | Investigate within 4 hours |
| `LOW` | Low-confidence detection or informational security event | Review during next triage cycle |
| `INFO` | Informational event, no immediate action needed | Log for trending and reporting |
| `UNKNOWN` | Severity not yet classified | Review and classify |

## Alert Status Values

| Status | Description |
|--------|-------------|
| `NEW` | Alert has been created and not yet reviewed |
| `IN_PROGRESS` | Alert is being investigated by an analyst |
| `RESOLVED` | Alert has been investigated and closed |
| `FALSE_POSITIVE` | Alert was a false detection |

## View Types

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

## GraphQL Filter Syntax

Search tools accept a `filters` array. Each filter object:

```json
{
  "fieldId": "severity",
  "filterType": "EQUALS",
  "values": ["CRITICAL"]
}
```

Add `"isNegated": true` to invert any filter:

```json
{
  "fieldId": "status",
  "filterType": "EQUALS",
  "values": ["RESOLVED"],
  "isNegated": true
}
```

### Filter Types

| Filter Type | Description |
|-------------|-------------|
| `EQUALS` | Exact match on a single value |
| `NOT_EQUALS` | Exclude exact match |
| `CONTAINS` | Substring match |
| `IN` | Match any value in the list |
| `NOT_IN` | Exclude any value in the list |

## Response Examples

### Alert Detail

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

### Alert History

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

| Error | Cause | Resolution |
|-------|-------|------------|
| Alert not found | Invalid alertId or alert was merged/resolved | Verify the alert ID with `list_alerts`; the alert may have been merged into another |
| Invalid severity filter | Wrong severity value | Use CRITICAL, HIGH, MEDIUM, LOW, INFO, or UNKNOWN |
| Invalid status filter | Wrong status value | Use NEW, IN_PROGRESS, RESOLVED, or FALSE_POSITIVE |
| Invalid view type | Wrong viewType value | Use ALL, CLOUD, KUBERNETES, IDENTITY, etc. |
| Empty results | No matching alerts | Widen filters, check time range, or confirm the site/account scope |
| Authentication error | Invalid token | Verify Service User token is Account or Site level |
| Too many results | Broad filters returning excessive data | Add severity, status, or time-range filters to narrow the query; always paginate |
