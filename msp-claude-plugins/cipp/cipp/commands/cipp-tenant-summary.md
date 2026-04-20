---
name: cipp-tenant-summary
description: List all managed tenants with status overview
---

# CIPP Tenant Summary

List all managed Microsoft 365 tenants with a status overview including tenant name, default domain, and management status.

## Prerequisites

- CIPP API connection configured with `CIPP_BASE_URL` and `CIPP_API_KEY`
- API key must have read access to tenant data

## Steps

1. **List all tenants**

   Call the CIPP `ListTenants` endpoint to retrieve the full list of managed tenants.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListTenants" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

2. **Summarize tenant data**

   For each tenant in the response, extract the display name, default domain, and any status information. Count the total number of managed tenants.

3. **Present results**

   Display the tenant list as a formatted table with columns for tenant name, default domain, and status. Include a summary count at the top.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| (none) | - | - | - | This command takes no parameters |

## Examples

### List All Tenants

```
/cipp-tenant-summary
```

## Output

### Tenant Summary Table

```
CIPP Managed Tenants Summary
================================================================
Total Tenants: 12

+----+---------------------+-------------------------------+----------+
| #  | Tenant Name         | Default Domain                | Status   |
+----+---------------------+-------------------------------+----------+
|  1 | Contoso Ltd         | contoso.onmicrosoft.com       | Active   |
|  2 | Fabrikam Inc        | fabrikam.onmicrosoft.com      | Active   |
|  3 | Woodgrove Bank      | woodgrove.onmicrosoft.com     | Active   |
|  4 | Adventure Works     | adventure.onmicrosoft.com     | Active   |
|  5 | Tailspin Toys       | tailspin.onmicrosoft.com      | Active   |
|  6 | Fourth Coffee       | fourthcoffee.onmicrosoft.com  | Active   |
|  7 | Litware Inc         | litware.onmicrosoft.com       | Active   |
|  8 | Proseware           | proseware.onmicrosoft.com     | Active   |
|  9 | Graphic Design Inst. | gdi.onmicrosoft.com          | Active   |
| 10 | VanArsdel Ltd       | vanarsdel.onmicrosoft.com     | Active   |
| 11 | Trey Research       | treyresearch.onmicrosoft.com  | Active   |
| 12 | Datum Corporation   | datum.onmicrosoft.com         | Active   |
+----+---------------------+-------------------------------+----------+

All 12 tenants are active and accessible.
================================================================
```

### No Tenants Found

```
CIPP Managed Tenants Summary
================================================================
Total Tenants: 0

No managed tenants found. This could mean:
  - No partner relationships have been established
  - All tenants have been excluded
  - The CIPP cache needs to be refreshed (try ExecClearCache)

Suggestions:
  - Verify partner relationships in Microsoft Partner Center
  - Check CIPP Settings for excluded tenants
  - Clear the tenant cache and retry
================================================================
```

### Partial Access

```
CIPP Managed Tenants Summary
================================================================
Total Tenants: 8 (2 with permission issues)

+----+---------------------+-------------------------------+----------------+
| #  | Tenant Name         | Default Domain                | Status         |
+----+---------------------+-------------------------------+----------------+
|  1 | Contoso Ltd         | contoso.onmicrosoft.com       | Active         |
|  2 | Fabrikam Inc        | fabrikam.onmicrosoft.com      | Active         |
|  ...                                                                      |
|  7 | Datum Corporation   | datum.onmicrosoft.com         | CPV Expired    |
|  8 | Trey Research       | treyresearch.onmicrosoft.com  | Permission Err |
+----+---------------------+-------------------------------+----------------+

WARNING: 2 tenants have permission issues.
  - Datum Corporation: CPV permissions expired. Run ExecCPVPermissions.
  - Trey Research: Permission error. Check partner relationship status.
================================================================
```

## Error Handling

### API Connection Error

```
Error: Unable to connect to CIPP API at ${CIPP_BASE_URL}

Verify your CIPP_BASE_URL and CIPP_API_KEY environment variables.
  - CIPP_BASE_URL should be your full CIPP instance URL (e.g., https://your-cipp.app)
  - CIPP_API_KEY should be generated at Settings > Backend > API Authentication
```

### Authentication Error

```
Error: 401 Unauthorized

Your CIPP API key is invalid or has been revoked.
Regenerate at: CIPP Settings > Backend > API Authentication
```

### Empty Cache

```
Warning: Tenant list may be cached and stale.

If you recently added or removed tenants, clear the cache:
  curl -s "${CIPP_BASE_URL}/api/ExecClearCache" -H "x-api-key: ${CIPP_API_KEY}"
Then re-run /cipp-tenant-summary.
```

## Related Commands

- `/cipp-user-offboard` - Offboard a user from a specific tenant
- `/cipp-standards-check` - Check compliance across tenants
- `/cipp-security-posture` - Review security posture across tenants
- `/cipp-alert-review` - Review alerts across tenants
