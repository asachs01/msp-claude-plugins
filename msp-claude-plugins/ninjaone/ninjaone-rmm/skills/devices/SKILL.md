---
description: >
  Use this skill when working with NinjaOne devices - listing, searching, managing
  services, viewing inventory, scheduling maintenance, and monitoring device health.
  Covers Windows, Mac, and Linux endpoints managed by NinjaRMM agents.
triggers:
  - ninjaone device
  - ninjarmm device
  - ninja device list
  - device inventory ninja
  - ninja services
  - ninja maintenance
  - device reboot ninja
  - ninja endpoint
---

# NinjaOne Device Management

## Overview

Devices in NinjaOne represent endpoints with installed RMM agents. Each device belongs to an organization and can have policies, custom fields, and maintenance windows configured.

## API Base URLs

| Region | Base URL |
|--------|----------|
| US | `https://app.ninjarmm.com` |
| EU | `https://eu.ninjarmm.com` |
| Oceania | `https://oc.ninjarmm.com` |

## Device Endpoints

### Get Device Details

```http
GET /api/v2/device/{id}
Authorization: Bearer {token}
```

Returns comprehensive device information including:
- System info (hostname, OS, IP addresses)
- Hardware specs (CPU, RAM, storage)
- Agent status and version
- Applied policies
- Custom field values

### Update Device

```http
PATCH /api/v2/device/{id}
Content-Type: application/json
```

```json
{
  "displayName": "Updated Display Name",
  "nodeRoleId": 2,
  "policyId": 123,
  "userData": {
    "customField1": "value1"
  }
}
```

### Reboot Device

```http
POST /api/v2/device/{id}/reboot/{mode}
```

Modes:
- `NORMAL` - Graceful reboot with user notification
- `FORCED` - Immediate reboot without warning

### Get Device Alerts

```http
GET /api/v2/device/{id}/alerts
```

Returns active alerts and conditions for the device.

### Get Device Activities

```http
GET /api/v2/device/{id}/activities
```

Returns recent activity log entries.

## Windows Services Management

### List Windows Services

```http
GET /api/v2/device/{id}/windows-services
```

Returns all Windows services on the device.

### Control Windows Service

```http
POST /api/v2/device/{id}/windows-service/{serviceId}/control
Content-Type: application/json
```

```json
{
  "action": "START"
}
```

Actions: `START`, `STOP`, `RESTART`

## Hardware Inventory

### Get Disks

```http
GET /api/v2/device/{id}/disks
```

### Get Volumes

```http
GET /api/v2/device/{id}/volumes
```

### Get Processors

```http
GET /api/v2/device/{id}/processors
```

### Get Installed Software

```http
GET /api/v2/device/{id}/software
```

## Maintenance Windows

### Schedule Maintenance

```http
PUT /api/v2/device/{id}/maintenance
Content-Type: application/json
```

```json
{
  "start": "2024-02-15T02:00:00Z",
  "end": "2024-02-15T06:00:00Z"
}
```

### Cancel Maintenance

```http
DELETE /api/v2/device/{id}/maintenance
```

## Device Roles

| Role ID | Name | Description |
|---------|------|-------------|
| 1 | Windows Workstation | Standard Windows endpoint |
| 2 | Windows Server | Windows Server OS |
| 3 | Mac | macOS device |
| 4 | Linux Workstation | Linux desktop |
| 5 | Linux Server | Linux server |

## Device Approval

For new devices pending approval:

```http
POST /api/v2/devices/approval/{mode}
Content-Type: application/json
```

Modes: `APPROVE`, `REJECT`

```json
{
  "devices": [123, 456, 789]
}
```

## Common Workflows

### Find Offline Devices

1. List all devices
2. Filter by `offline: true` status
3. Check last contact time
4. Review device alerts

### Check Server Health

1. Get device details
2. Review disk space via volumes endpoint
3. Check service status
4. Review active alerts

### Schedule Patch Window

1. Identify target devices
2. Schedule maintenance window
3. Configure reboot policy
4. Monitor patch results

## Error Handling

| Code | Description | Resolution |
|------|-------------|------------|
| 404 | Device not found | Verify device ID |
| 403 | Access denied | Check permissions for organization |
| 409 | Conflict | Device may be offline or unreachable |

## Related Skills

- [Organizations](../organizations/SKILL.md) - Organization management
- [Alerts](../alerts/SKILL.md) - Alert monitoring
- [API Patterns](../api-patterns/SKILL.md) - Authentication
