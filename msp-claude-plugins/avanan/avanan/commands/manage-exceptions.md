---
name: manage-exceptions
description: Add or remove whitelist/blacklist exceptions for senders or domains in Avanan
arguments:
  - name: action
    description: Action to perform (add, remove, list)
    required: true
  - name: type
    description: Exception type (whitelist_sender, whitelist_domain, blacklist_sender, blacklist_domain, whitelist_url, blacklist_url)
    required: false
  - name: value
    description: The sender email address, domain, or URL to add or remove
    required: false
  - name: tenant_id
    description: Scope to a specific tenant (omit for MSP-wide exception)
    required: false
  - name: exception_id
    description: Exception ID to remove (required for remove action)
    required: false
  - name: note
    description: Reason for adding the exception (strongly recommended for audit trail)
    required: false
---

# Check Point Avanan Exception Management

Add or remove whitelist and blacklist exceptions in Avanan to control filtering behavior for specific senders, domains, or URLs. Use this command to resolve false positives, block persistent threat senders, and manage allow/block lists for customer tenants.

## Prerequisites

- Avanan MCP server connected with valid API credentials
- `AVANAN_CLIENT_ID`, `AVANAN_CLIENT_SECRET`, and `AVANAN_REGION` configured
- MCP tools `avanan_list_exceptions`, `avanan_add_exception`, and `avanan_remove_exception` available

## Steps

### For `action: list`

1. Call `avanan_list_exceptions` with optional `tenantId` and `exceptionType` filters
2. Present the current exception list with type, value, scope (tenant or MSP-wide), creation date, and note
3. Highlight exceptions older than 6 months that may need review

### For `action: add`

1. Validate that `type` and `value` are provided
2. If no `note` is provided, warn the user that a note is strongly recommended for audit purposes
3. Check existing exceptions with `avanan_list_exceptions` to avoid duplicates
4. Call `avanan_add_exception` with the provided parameters
5. Confirm success and note that exceptions may take 5–10 minutes to propagate
6. If the exception was added as a result of a false-positive event, remind the user to also mark the original event as safe

### For `action: remove`

1. If `exception_id` is not provided, call `avanan_list_exceptions` to help the user identify the correct exception
2. Confirm the exception details with the user before removing — removals are immediate
3. Call `avanan_remove_exception` with the `exceptionId`
4. Confirm removal and note that previously blocked/allowed emails will now be subject to normal filtering

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| action | string | Yes | — | `add`, `remove`, or `list` |
| type | string | No* | — | Exception type (required for add) |
| value | string | No* | — | Sender email, domain, or URL (required for add) |
| tenant_id | string | No | MSP-wide | Scope to a specific tenant |
| exception_id | string | No** | — | Exception ID to remove (required for remove) |
| note | string | No | — | Reason for the exception (strongly recommended) |

*Required when `action: add`
**Required when `action: remove`

## Examples

### List All Exceptions for a Tenant

```
/manage-exceptions --action list --tenant_id tenant-acme-001
```

### Add Whitelist for a Trusted Vendor

```
/manage-exceptions --action add --type whitelist_sender --value invoicing@trusted-vendor.com --tenant_id tenant-acme-001 --note "Client-confirmed vendor; false positive on PDF invoices"
```

### Add MSP-Wide Whitelist for Shared Infrastructure

```
/manage-exceptions --action add --type whitelist_sender --value alerts@our-rmm.com --note "RMM alert sender for all clients"
```

### Add Blacklist for a Persistent Threat Sender

```
/manage-exceptions --action add --type blacklist_domain --value known-phisher.example.com --tenant_id tenant-acme-001 --note "Persistent phishing attempts — ref ticket 12345"
```

### Remove an Exception

```
/manage-exceptions --action remove --exception_id exc-001 --tenant_id tenant-acme-001
```

## Error Handling

- **Duplicate exception:** Already exists for that type/value/tenant combination — call `list` first to check
- **exception_id not found:** Use `list` action to find the correct ID; do not guess exception IDs
- **Missing required fields:** `type` and `value` are required for `add`; `exception_id` is required for `remove`
- **Propagation delay:** New exceptions take 5–10 minutes to take effect across all Avanan nodes

## Related Commands

- `/review-events` - Review security events to identify false positives that need exception management
