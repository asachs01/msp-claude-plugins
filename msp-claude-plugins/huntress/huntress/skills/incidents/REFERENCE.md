# Huntress Incidents — Reference

Detailed response examples, remediation types, and supplementary information for the [huntress-incidents](./SKILL.md) skill.

## Full Response Examples

### Incident List Response

```json
{
  "incidents": [
    {
      "id": "inc-789",
      "title": "Persistent Footholds: Malicious Scheduled Task",
      "severity": "critical",
      "status": "open",
      "organization_id": "org-456",
      "created_at": "2026-02-26T08:15:00Z",
      "affected_hosts": ["ACME-WS-042"],
      "remediations_count": 2
    },
    {
      "id": "inc-790",
      "title": "Suspicious PowerShell Execution",
      "severity": "high",
      "status": "open",
      "organization_id": "org-456",
      "created_at": "2026-02-26T09:30:00Z",
      "affected_hosts": ["ACME-WS-015", "ACME-WS-018"],
      "remediations_count": 3
    }
  ],
  "next_page_token": null
}
```

### Remediation List Response

```json
{
  "remediations": [
    {
      "id": "rem-001",
      "type": "scheduled_task_removal",
      "description": "Remove malicious scheduled task 'WindowsUpdate'",
      "status": "pending",
      "host": "ACME-WS-042"
    },
    {
      "id": "rem-002",
      "type": "file_quarantine",
      "description": "Quarantine C:\\Windows\\Temp\\payload.exe",
      "status": "pending",
      "host": "ACME-WS-042"
    }
  ]
}
```

### Bulk Approve Response

```json
{
  "results": [
    {"remediation_id": "rem-001", "status": "approved", "success": true},
    {"remediation_id": "rem-002", "status": "failed", "success": false, "error": "Host offline"}
  ]
}
```

## Remediation Types

| Type | Description | Example Action |
|------|-------------|----------------|
| `scheduled_task_removal` | Remove a malicious scheduled task | Delete `WindowsUpdate` task from Task Scheduler |
| `file_quarantine` | Quarantine a suspicious file | Move `payload.exe` to quarantine vault |
| `service_removal` | Remove a malicious Windows service | Stop and delete `SvcUpdate` service |
| `registry_cleanup` | Remove malicious registry entries | Delete persistence key from `HKLM\Software\Microsoft\Windows\CurrentVersion\Run` |
| `process_termination` | Kill a running malicious process | Terminate `svchost_update.exe` (PID 4832) |
| `user_disable` | Disable a compromised user account | Disable local account `backdoor_admin` |

## Incident Lifecycle

1. **Detection** — Huntress SOC identifies and confirms a threat on a managed endpoint
2. **Triage** — MSP reviews incident severity and affected scope
3. **Investigation** — Deep dive into affected hosts, indicators of compromise, and timeline
4. **Remediation** — Approve or reject SOC-recommended remediation actions
5. **Resolution** — Close the incident after all remediations are processed

## Severity Levels

| Severity | Meaning | Expected Response |
|----------|---------|-------------------|
| `critical` | Active threat requiring immediate response (e.g., ransomware, active C2) | Investigate and remediate within hours |
| `high` | Confirmed threat requiring urgent action (e.g., persistent foothold, credential theft) | Investigate and remediate within 24 hours |
| `low` | Suspicious activity requiring review (e.g., PUP, policy violation) | Review within normal triage cycle |

## Remediation Status Values

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting MSP approval or rejection |
| `approved` | MSP approved; queued for execution |
| `rejected` | MSP declined the remediation |
| `executing` | Remediation action in progress on the host |
| `completed` | Remediation successfully executed |
| `failed` | Remediation execution failed (host offline, permission error, etc.) |
