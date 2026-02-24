---
name: cipp-user-offboard
description: Offboard a user from a tenant (disable, revoke sessions, convert mailbox)
arguments:
  - name: tenant
    description: The tenant domain (e.g., contoso.onmicrosoft.com)
    required: true
  - name: user
    description: The user's UPN (e.g., jdoe@contoso.com)
    required: true
---

# CIPP User Offboard

Perform a comprehensive user offboarding for a Microsoft 365 tenant. This command disables the account, revokes all active sessions, resets the password, converts the mailbox to shared, removes licenses, hides from the GAL, and optionally sets email forwarding.

## Prerequisites

- CIPP API connection configured with `CIPP_BASE_URL` and `CIPP_API_KEY`
- API key must have write access to user management endpoints
- The tenant must be actively managed in CIPP (not excluded)
- The user must exist in the specified tenant

## Steps

1. **Verify the tenant**

   Call `ListTenant` with the provided tenant domain to confirm it is accessible.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListTenant?TenantFilter=${tenant}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

2. **Look up the user**

   Call `ListUser` with the tenant and user UPN to retrieve current user details.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ListUser?TenantFilter=${tenant}&UserId=${user}" \
     -H "x-api-key: ${CIPP_API_KEY}"
   ```

3. **Confirm offboarding actions**

   Present the user details and the offboarding actions that will be performed. Request confirmation before proceeding.

   Default offboarding actions:
   - Disable the user account (block sign-in)
   - Revoke all active sessions
   - Reset password to a random value
   - Convert mailbox to shared mailbox
   - Remove all assigned licenses
   - Hide from the Global Address List

4. **Execute the offboard**

   Call `ExecOffboardUser` with the confirmed configuration.

   ```bash
   curl -s "${CIPP_BASE_URL}/api/ExecOffboardUser" \
     -X POST \
     -H "x-api-key: ${CIPP_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{
       "TenantFilter": "${tenant}",
       "UserId": "${user}",
       "DisableUser": true,
       "RevokeSessions": true,
       "ResetPassword": true,
       "ConvertToShared": true,
       "RemoveLicenses": true,
       "HideFromGAL": true
     }'
   ```

5. **Report results**

   Display the offboarding results including each action's success or failure status.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | string | Yes | - | Tenant domain (e.g., `contoso.onmicrosoft.com`) |
| user | string | Yes | - | User UPN to offboard (e.g., `jdoe@contoso.com`) |

## Examples

### Standard Offboard

```
/cipp-user-offboard --tenant contoso.onmicrosoft.com --user jdoe@contoso.com
```

### Offboard with Domain Shorthand

```
/cipp-user-offboard --tenant contoso.com --user jdoe@contoso.com
```

## Output

### Successful Offboard

```
CIPP User Offboard
================================================================
Tenant:  Contoso Ltd (contoso.onmicrosoft.com)
User:    John Doe (jdoe@contoso.com)
Title:   IT Manager | IT Department

Offboarding Actions:
+---+---------------------------+----------+---------------------------+
| # | Action                    | Status   | Details                   |
+---+---------------------------+----------+---------------------------+
| 1 | Disable Account           | Success  | Sign-in blocked           |
| 2 | Revoke Sessions           | Success  | All sessions invalidated  |
| 3 | Reset Password            | Success  | Password randomized       |
| 4 | Convert to Shared Mailbox | Success  | Mailbox converted         |
| 5 | Remove Licenses           | Success  | Office 365 E3 removed     |
| 6 | Hide from GAL             | Success  | Hidden from address book  |
+---+---------------------------+----------+---------------------------+

All offboarding actions completed successfully.

License Savings:
  - Office 365 E3: 1 license freed ($36.00/month)

Next Steps:
  - Verify the offboard: /cipp-tenant-summary
  - Set email forwarding if needed (currently not configured)
  - Document the offboard in your PSA/ticketing system
================================================================
```

### User Not Found

```
Error: User not found: jdoe@contoso.com

The user "jdoe@contoso.com" does not exist in tenant "contoso.onmicrosoft.com".

Suggestions:
  - Verify the UPN is correct (check spelling and domain)
  - The user may already have been deleted
  - Try listing all users:
    curl -s "${CIPP_BASE_URL}/api/ListUsers?TenantFilter=contoso.onmicrosoft.com" \
      -H "x-api-key: ${CIPP_API_KEY}" | jq '.[].userPrincipalName'
```

### Partial Success

```
CIPP User Offboard
================================================================
Tenant:  Contoso Ltd (contoso.onmicrosoft.com)
User:    Jane Smith (jsmith@contoso.com)

Offboarding Actions:
+---+---------------------------+----------+----------------------------------+
| # | Action                    | Status   | Details                          |
+---+---------------------------+----------+----------------------------------+
| 1 | Disable Account           | Success  | Sign-in blocked                  |
| 2 | Revoke Sessions           | Success  | All sessions invalidated         |
| 3 | Reset Password            | Success  | Password randomized              |
| 4 | Convert to Shared Mailbox | FAILED   | Mailbox type not supported       |
| 5 | Remove Licenses           | Success  | Microsoft 365 Business Basic     |
| 6 | Hide from GAL             | Success  | Hidden from address book         |
+---+---------------------------+----------+----------------------------------+

WARNING: 1 action failed.
  - Convert to Shared Mailbox: The mailbox may already be shared,
    or the mailbox type (e.g., room, equipment) does not support conversion.

Manual follow-up required for failed actions.
================================================================
```

## Error Handling

### Tenant Not Found

```
Error: Tenant not found: invalid.onmicrosoft.com

Verify the tenant domain using /cipp-tenant-summary.
```

### Permission Error

```
Error: Failed to offboard user. Permission denied.

Your CIPP API key may lack write permissions, or CPV permissions
for this tenant have expired.

Try refreshing permissions:
  curl -s "${CIPP_BASE_URL}/api/ExecCPVPermissions" \
    -X POST -H "x-api-key: ${CIPP_API_KEY}" \
    -d '{"TenantFilter": "contoso.onmicrosoft.com"}'
```

### Last Global Admin Warning

```
Error: Cannot disable the last Global Administrator.

The user admin@contoso.com is the only Global Admin in this tenant.
Disabling this account would lock out all administrative access.

Resolution:
  1. Assign Global Admin to another user first
  2. Then retry the offboard
```

## CIPP API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `ListTenant` | Verify tenant accessibility |
| `ListUser` | Retrieve user details before offboarding |
| `ExecOffboardUser` | Perform the offboarding actions |

## Related Commands

- `/cipp-tenant-summary` - List all tenants to find the correct domain
- `/cipp-security-posture` - Review security after offboarding
- `/cipp-alert-review` - Check for alerts related to the offboarded user
