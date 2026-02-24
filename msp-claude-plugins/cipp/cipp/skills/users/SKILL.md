---
description: >
  Use this skill when working with CIPP user management - listing users,
  creating new users, offboarding (disable account, revoke sessions, convert
  to shared mailbox, forward email, remove licenses), license management,
  mailbox permissions, password resets, and MFA management.
triggers:
  - cipp user
  - cipp offboard
  - cipp license
  - cipp mailbox
  - cipp password
  - cipp mfa
  - cipp create user
  - cipp disable user
  - cipp permissions
---

# CIPP User Management

## Overview

CIPP provides comprehensive user lifecycle management for M365 tenants. This covers listing users, creating accounts, managing licenses, handling mailbox permissions, resetting passwords, revoking sessions, and the full offboarding workflow. All user operations require a `TenantFilter` parameter to specify which tenant the user belongs to.

## Key Concepts

### User Identification

Users in CIPP are identified by their User Principal Name (UPN):

| Identifier | Example | Usage |
|-----------|---------|-------|
| UPN | `jdoe@contoso.com` | Primary identifier for all API calls |
| Object ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Azure AD object GUID, also accepted |
| Display Name | `John Doe` | Human-readable, not used for API calls |

### Offboarding Model

CIPP's offboarding is a comprehensive, multi-step process that can:
- Disable the user account
- Revoke all active sessions (sign out everywhere)
- Reset the password to a random value
- Convert the mailbox to a shared mailbox
- Set up email forwarding
- Remove all assigned licenses
- Hide the user from the Global Address List (GAL)
- Remove from all groups

Each step is optional and can be configured independently.

## Endpoints

### ListUsers

List all users in a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListUsers?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |

**Response:**

```json
[
  {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "userPrincipalName": "jdoe@contoso.com",
    "displayName": "John Doe",
    "mail": "jdoe@contoso.com",
    "accountEnabled": true,
    "assignedLicenses": [
      {
        "skuId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "skuPartNumber": "ENTERPRISEPACK"
      }
    ],
    "jobTitle": "IT Manager",
    "department": "IT",
    "city": "New York",
    "usageLocation": "US",
    "createdDateTime": "2024-01-15T10:30:00Z",
    "lastSignInDateTime": "2026-02-24T08:15:00Z"
  }
]
```

### ListUser (Single User)

Get detailed information for a specific user.

```bash
curl -s "${CIPP_BASE_URL}/api/ListUser?TenantFilter=contoso.onmicrosoft.com&UserId=jdoe@contoso.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |
| `UserId` | string | Yes | User UPN or Object ID |

**Response includes:**
- Full user profile (name, email, title, department, location)
- Account status (enabled/disabled)
- Assigned licenses with SKU details
- Group memberships
- Last sign-in date
- MFA registration status
- Mailbox details

### AddUser

Create a new user in a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/AddUser" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "DisplayName": "Jane Smith",
    "UserName": "jsmith",
    "Domain": "contoso.com",
    "FirstName": "Jane",
    "LastName": "Smith",
    "JobTitle": "Accountant",
    "Department": "Finance",
    "UsageLocation": "US",
    "Password": "TempP@ssw0rd!",
    "MustChangePass": true,
    "CopyFrom": "existinguser@contoso.com",
    "Licenses": ["ENTERPRISEPACK"]
  }'
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |
| `DisplayName` | string | Yes | Full display name |
| `UserName` | string | Yes | Username part of UPN (before @) |
| `Domain` | string | Yes | Domain part of UPN (after @) |
| `FirstName` | string | No | Given name |
| `LastName` | string | No | Surname |
| `JobTitle` | string | No | Job title |
| `Department` | string | No | Department |
| `UsageLocation` | string | No | ISO country code for license assignment |
| `Password` | string | No | Initial password (auto-generated if omitted) |
| `MustChangePass` | bool | No | Force password change on first login |
| `CopyFrom` | string | No | UPN of user to copy groups/licenses from |
| `Licenses` | array | No | License SKU part numbers to assign |

> **Tip:** Use `CopyFrom` to clone an existing user's group memberships and licenses. This is the fastest way to set up a new user with the correct access.

### ExecOffboardUser

Perform a comprehensive user offboarding. This is one of CIPP's most powerful features.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecOffboardUser" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserId": "jdoe@contoso.com",
    "DisableUser": true,
    "RevokeSessions": true,
    "ResetPassword": true,
    "ConvertToShared": true,
    "RemoveLicenses": true,
    "HideFromGAL": true,
    "RemoveGroups": true,
    "ForwardTo": "manager@contoso.com",
    "KeepCopy": true,
    "AutoReply": "John Doe is no longer with the company. Please contact manager@contoso.com."
  }'
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |
| `UserId` | string | Yes | User UPN to offboard |
| `DisableUser` | bool | No | Disable the account (block sign-in) |
| `RevokeSessions` | bool | No | Revoke all active sessions |
| `ResetPassword` | bool | No | Reset to random password |
| `ConvertToShared` | bool | No | Convert mailbox to shared mailbox |
| `RemoveLicenses` | bool | No | Remove all assigned licenses |
| `HideFromGAL` | bool | No | Hide from Global Address List |
| `RemoveGroups` | bool | No | Remove from all groups |
| `ForwardTo` | string | No | UPN to forward email to |
| `KeepCopy` | bool | No | Keep a copy in original mailbox when forwarding |
| `AutoReply` | string | No | Set automatic reply message |
| `OOO` | string | No | Set Out of Office message (alias for AutoReply) |
| `DeleteUser` | bool | No | Delete the user entirely (use with extreme caution) |

> **WARNING:** Offboarding is a destructive operation. Always confirm the user UPN and tenant before executing. There is no undo for session revocation, password reset, or license removal.

### ExecResetPassword

Reset a user's password.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecResetPassword" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserId": "jdoe@contoso.com",
    "MustChange": true
  }'
```

The response includes the new temporary password if auto-generated.

### ExecRevokeSessions

Immediately revoke all active sessions for a user, forcing re-authentication everywhere.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecRevokeSessions" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserId": "jdoe@contoso.com"
  }'
```

> **Note:** Session revocation may take up to 1 hour to propagate across all Microsoft services due to token caching.

### ExecDisableUser

Disable a user account (block sign-in) without performing a full offboard.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecDisableUser" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserId": "jdoe@contoso.com"
  }'
```

### ListLicenses

List available licenses in a tenant.

```bash
curl -s "${CIPP_BASE_URL}/api/ListLicenses?TenantFilter=contoso.onmicrosoft.com" \
  -H "x-api-key: ${CIPP_API_KEY}"
```

**Response:**

```json
[
  {
    "skuId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "skuPartNumber": "ENTERPRISEPACK",
    "displayName": "Office 365 E3",
    "consumedUnits": 45,
    "prepaidUnits": {
      "enabled": 50
    }
  }
]
```

### ExecAssignLicense

Assign or remove licenses for a user.

```bash
curl -s "${CIPP_BASE_URL}/api/ExecAssignLicense" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserId": "jdoe@contoso.com",
    "AddLicenses": ["ENTERPRISEPACK"],
    "RemoveLicenses": ["STANDARDPACK"]
  }'
```

### ExecSetMailboxPermissions

Set mailbox permissions (Full Access, Send As, Send on Behalf).

```bash
curl -s "${CIPP_BASE_URL}/api/ExecSetMailboxPermissions" \
  -X POST \
  -H "x-api-key: ${CIPP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "TenantFilter": "contoso.onmicrosoft.com",
    "UserToGivePermissionsTo": "manager@contoso.com",
    "Userid": "jdoe@contoso.com",
    "FullAccess": true,
    "SendAs": true,
    "SendOnBehalf": false,
    "Automap": true
  }'
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TenantFilter` | string | Yes | Tenant domain |
| `UserToGivePermissionsTo` | string | Yes | UPN of user receiving permissions |
| `Userid` | string | Yes | UPN of mailbox being shared |
| `FullAccess` | bool | No | Grant Full Access permission |
| `SendAs` | bool | No | Grant Send As permission |
| `SendOnBehalf` | bool | No | Grant Send on Behalf permission |
| `Automap` | bool | No | Auto-map the mailbox in Outlook |

## Common Workflows

### Standard Offboarding Procedure

A typical MSP offboarding workflow:

1. **Verify the user** - Call `ListUser` to confirm identity and current state
2. **Notify the client** - Confirm offboarding details with the client
3. **Execute offboard** - Call `ExecOffboardUser` with appropriate options
4. **Set forwarding** - Forward email to the user's manager or a shared mailbox
5. **Verify** - Call `ListUser` again to confirm all changes took effect
6. **Document** - Record the offboarding in your PSA/documentation system

### Emergency Account Lockout

When a compromised account needs immediate lockout:

1. **Revoke sessions** - Call `ExecRevokeSessions` immediately
2. **Reset password** - Call `ExecResetPassword` to prevent re-authentication
3. **Disable account** - Call `ExecDisableUser` as a safety net
4. **Check sign-in logs** - Use `ListSignIns` to review recent activity
5. **Investigate** - Check for mailbox rules, forwarding, and app registrations

### License Optimization

To audit and optimize licenses across a tenant:

1. **List licenses** - Call `ListLicenses` to see available vs. consumed
2. **List users** - Call `ListUsers` to see per-user assignments
3. **Identify waste** - Find users with licenses they do not use (e.g., disabled accounts with licenses)
4. **Reassign** - Use `ExecAssignLicense` to move licenses from inactive to active users

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `User not found` | Invalid UPN or user does not exist | Verify UPN with `ListUsers` |
| `Mailbox not found` | User has no Exchange mailbox | Cannot convert to shared or set forwarding |
| `License not available` | No remaining licenses of that type | Purchase additional licenses or remove from another user |
| `Cannot remove last global admin` | Trying to disable the only Global Admin | Ensure at least one other GA exists |
| `Failed to revoke sessions` | Graph API error | Retry; may be a transient error |
| `Cannot convert to shared mailbox` | Mailbox is already shared or has incompatible features | Check mailbox type first with `ListUser` |

## Best Practices

1. **Always verify before offboarding** - Double-check the UPN and tenant to avoid acting on the wrong user
2. **Convert to shared before removing licenses** - This preserves the mailbox contents without requiring a license
3. **Set forwarding before conversion** - Configure email forwarding as part of the offboard, not after
4. **Revoke sessions for security incidents** - Session revocation is the fastest way to cut off a compromised account
5. **Use CopyFrom for new users** - Clone groups and licenses from a template user for consistency
6. **Set UsageLocation before licensing** - A user must have a UsageLocation set before licenses can be assigned
7. **Document all offboarding** - Record who was offboarded, when, why, and what actions were taken

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and error handling
- [Tenants](../tenants/SKILL.md) - Tenant identification for user operations
- [Security](../security/SKILL.md) - MFA status and sign-in monitoring
- [Alerts](../alerts/SKILL.md) - Alert monitoring for compromised accounts
