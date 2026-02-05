---
name: ninjaone-search-devices
description: Search for devices across NinjaOne organizations
arguments:
  - name: query
    description: Search query (hostname, IP, or organization name)
    required: true
---

Search for devices in NinjaOne matching the query "$ARGUMENTS.query".

## Instructions

1. If the query looks like an organization name, first search organizations to get the org ID
2. Query devices with appropriate filters based on the search criteria
3. Present results in a table showing:
   - Device name/hostname
   - Organization
   - Device type (Workstation/Server)
   - Status (Online/Offline)
   - IP Address
   - Last contact time

## API Endpoints

- List organizations: `GET /api/v2/organizations`
- List devices by org: Filter devices by organizationId
- Get device: `GET /api/v2/device/{id}`

## Example Output

| Device | Organization | Type | Status | IP | Last Contact |
|--------|--------------|------|--------|-----|--------------|
| SERVER-01 | Acme Corp | Windows Server | Online | 192.168.1.10 | 2 min ago |
| WS-JOHN | Acme Corp | Workstation | Online | 192.168.1.25 | 5 min ago |

If no devices match, suggest alternative search terms or confirm the query.
