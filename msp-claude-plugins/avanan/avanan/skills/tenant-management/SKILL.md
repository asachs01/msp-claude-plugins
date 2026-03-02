---
description: >
  Use this skill when managing Check Point Avanan tenants as an MSP —
  listing and querying customer tenants via the Smart API, scoping operations
  to specific tenants, and managing whitelist and blacklist exceptions for
  senders, domains, and URLs.
triggers:
  - avanan tenant
  - avanan msp
  - check point msp
  - harmony tenant management
  - avanan smart api
  - avanan whitelist
  - avanan blacklist
  - avanan exception
  - avanan allow list
  - avanan block list
  - avanan multi-tenant
---

# Check Point Avanan MSP Tenant Management

## Overview

Check Point Avanan supports MSP and MSSP deployments through the Smart API — a multi-tenant API layer that allows a single MSP credential set to manage multiple customer organizations. Smart API provides centralized visibility and control across all managed tenants without requiring separate logins or credential sets for each customer.

Tenant management covers two primary workflows:

1. **Tenant operations** — Listing managed customers, scoping event and entity queries to specific tenants, and understanding tenant configuration
2. **Exception management** — Managing whitelist (allow) and blacklist (block) exceptions for senders, domains, and URLs across one or all tenants

## Key Concepts

### Smart API vs Standard API

| Aspect | Standard API | Smart API |
|--------|-------------|-----------|
| Credential scope | One tenant | All MSP tenants |
| Tenant selection | Implicit (single org) | Explicit via `tenantId` |
| Event queries | Single tenant | All tenants or scoped |
| Exception management | Single tenant | Per-tenant or MSP-wide |
| API path prefix | `/v1/pub/` | `/v1/smart/` |

To use Smart API, your Avanan account must be provisioned as an MSP/partner account. Contact your Check Point account manager to enable Smart API access.

### Tenant Structure

Each tenant in the Smart API represents one customer organization:

| Field | Description |
|-------|-------------|
| `tenantId` | Unique identifier for the tenant (used in API calls) |
| `name` | Customer organization name |
| `domain` | Primary email domain |
| `plan` | Avanan plan: `essentials`, `advanced`, `complete` |
| `status` | Account status: `active`, `suspended`, `onboarding` |
| `protectedServices` | Email services protected: `m365`, `gworkspace`, `teams`, etc. |
| `userCount` | Number of protected users |
| `createdAt` | Tenant onboarding date |

### Exception Types

Avanan exceptions override the normal filtering decision for specific senders, domains, or URLs:

| Exception Type | Direction | Effect |
|----------------|-----------|--------|
| `whitelist_sender` | Inbound | Allow emails from this sender regardless of verdict |
| `whitelist_domain` | Inbound | Allow emails from this domain regardless of verdict |
| `whitelist_url` | Inbound/Outbound | Allow clicks on this URL |
| `blacklist_sender` | Inbound | Block all emails from this sender |
| `blacklist_domain` | Inbound | Block all emails from this domain |
| `blacklist_url` | Inbound/Outbound | Block clicks on this URL |

> **Warning:** Whitelist exceptions bypass Avanan's threat detection entirely for matched senders/domains. Add only trusted, verified senders. A compromised whitelisted sender will bypass security scanning.

### Exception Scope

Exceptions can be scoped to:
- **Tenant-specific** — Applied to a single customer tenant
- **MSP-wide** — Applied to all managed tenants (Smart API only)

MSP-wide exceptions are useful for shared infrastructure (e.g., your PSA system, monitoring tools) that sends email to all customers.

## API Patterns

### List Tenants

```
avanan_list_tenants
```

Parameters:
- `status` — Filter by status: `active`, `suspended`, `onboarding`
- `search` — Search by tenant name or domain
- `limit` — Results per page (default: 50, max: 200)
- `offset` — Pagination offset

**Example — list all active tenants:**

```json
{
  "tool": "avanan_list_tenants",
  "parameters": {
    "status": "active",
    "limit": 100
  }
}
```

**Example response:**

```json
{
  "total": 23,
  "offset": 0,
  "tenants": [
    {
      "tenantId": "tenant-acme-001",
      "name": "Acme Corporation",
      "domain": "acmecorp.com",
      "plan": "advanced",
      "status": "active",
      "protectedServices": ["m365", "teams"],
      "userCount": 85,
      "createdAt": "2024-06-15T00:00:00Z"
    },
    {
      "tenantId": "tenant-globex-002",
      "name": "Globex Ltd",
      "domain": "globex.co.uk",
      "plan": "essentials",
      "status": "active",
      "protectedServices": ["gworkspace"],
      "userCount": 22,
      "createdAt": "2025-01-20T00:00:00Z"
    }
  ]
}
```

### Get Tenant Details

```
avanan_get_tenant
```

Parameters:
- `tenantId` — The tenant ID

**Example:**

```json
{
  "tool": "avanan_get_tenant",
  "parameters": {
    "tenantId": "tenant-acme-001"
  }
}
```

**Example response:**

```json
{
  "tenantId": "tenant-acme-001",
  "name": "Acme Corporation",
  "domain": "acmecorp.com",
  "plan": "advanced",
  "status": "active",
  "protectedServices": ["m365", "teams"],
  "userCount": 85,
  "adminEmail": "it-admin@acmecorp.com",
  "createdAt": "2024-06-15T00:00:00Z",
  "settings": {
    "quarantinePolicy": "auto",
    "digestFrequency": "daily",
    "endUserReporting": true
  }
}
```

### List Exceptions

```
avanan_list_exceptions
```

Parameters:
- `tenantId` — Scope to a specific tenant (omit for MSP-wide exceptions)
- `exceptionType` — Filter by type: `whitelist_sender`, `whitelist_domain`, `blacklist_sender`, `blacklist_domain`, `whitelist_url`, `blacklist_url`
- `limit` / `offset` — Pagination

**Example — list all whitelist exceptions for a tenant:**

```json
{
  "tool": "avanan_list_exceptions",
  "parameters": {
    "tenantId": "tenant-acme-001",
    "exceptionType": "whitelist_sender"
  }
}
```

**Example response:**

```json
{
  "total": 4,
  "exceptions": [
    {
      "exceptionId": "exc-001",
      "type": "whitelist_sender",
      "value": "invoicing@trusted-vendor.com",
      "tenantId": "tenant-acme-001",
      "createdAt": "2025-11-01T00:00:00Z",
      "createdBy": "msp-admin@wyretechnology.com",
      "note": "Verified vendor — false positive on invoice emails"
    },
    {
      "exceptionId": "exc-002",
      "type": "whitelist_domain",
      "value": "approved-newsletter.com",
      "tenantId": "tenant-acme-001",
      "createdAt": "2025-12-15T00:00:00Z",
      "createdBy": "msp-admin@wyretechnology.com",
      "note": "Client approved newsletter service"
    }
  ]
}
```

### Add Exception

```
avanan_add_exception
```

Parameters:
- `type` — Exception type: `whitelist_sender`, `whitelist_domain`, `blacklist_sender`, `blacklist_domain`, `whitelist_url`, `blacklist_url`
- `value` — The sender email, domain, or URL to add
- `tenantId` — Scope to a specific tenant (omit for MSP-wide)
- `note` — Description of why the exception was added (strongly recommended)

**Example — add a whitelist exception for a trusted vendor:**

```json
{
  "tool": "avanan_add_exception",
  "parameters": {
    "type": "whitelist_sender",
    "value": "invoicing@trusted-vendor.com",
    "tenantId": "tenant-acme-001",
    "note": "Client confirmed this vendor; false positives on PDF invoices — 2026-03-02"
  }
}
```

**Example response:**

```json
{
  "exceptionId": "exc-003",
  "type": "whitelist_sender",
  "value": "invoicing@trusted-vendor.com",
  "tenantId": "tenant-acme-001",
  "createdAt": "2026-03-02T10:30:00Z",
  "status": "active"
}
```

**Example — add a blacklist domain for a known malicious sender:**

```json
{
  "tool": "avanan_add_exception",
  "parameters": {
    "type": "blacklist_domain",
    "value": "known-phisher.example.com",
    "tenantId": "tenant-acme-001",
    "note": "Persistent phishing attempts — 2026-03-02"
  }
}
```

**Example — add an MSP-wide whitelist for shared infrastructure:**

```json
{
  "tool": "avanan_add_exception",
  "parameters": {
    "type": "whitelist_sender",
    "value": "alerts@our-rmm-tool.com",
    "note": "RMM alert emails to all clients — MSP-wide whitelist"
  }
}
```

### Remove Exception

```
avanan_remove_exception
```

Parameters:
- `exceptionId` — The exception ID to remove
- `tenantId` — The tenant the exception belongs to (if tenant-scoped)

**Example:**

```json
{
  "tool": "avanan_remove_exception",
  "parameters": {
    "exceptionId": "exc-001",
    "tenantId": "tenant-acme-001"
  }
}
```

**Example response:**

```json
{
  "exceptionId": "exc-001",
  "status": "removed",
  "removedAt": "2026-03-02T11:00:00Z"
}
```

## Common Workflows

### Onboarding a New Tenant

1. After provisioning the customer in the Avanan portal, call `avanan_list_tenants` to confirm the new tenant appears
2. Call `avanan_get_tenant` to verify `status: "active"` and correct `protectedServices`
3. If the client uses known shared infrastructure (RMM alerts, PSA notifications), add MSP-wide whitelist exceptions for those senders
4. Advise the client to report false positives via the Avanan end-user portal so you can add tenant-specific exceptions as needed

### False Positive Exception Workflow

1. Identify a false positive event via `avanan_search_events` or client report
2. Get event details to confirm the sender, domain, and verdict
3. Verify with the client that the sender is legitimate (call or ticket confirmation — do not just take the user's word)
4. Call `avanan_add_exception` with `type: "whitelist_sender"` and a descriptive `note` including the date and ticket reference
5. Mark the original event as safe with `avanan_perform_event_action` (`action: "markSafe"`)
6. Monitor for subsequent events from that sender to confirm the exception is working

### Monthly Exception Review

1. Call `avanan_list_exceptions` for all tenants (or per-tenant in batches)
2. Review all whitelist exceptions — flag any that were added more than 6 months ago for review
3. For aged exceptions: verify with the client that the whitelisted sender is still a trusted business relationship
4. Remove stale exceptions with `avanan_remove_exception`
5. Document the review in the PSA/ticketing system for compliance audit trail

### MSP Security Posture Report

1. Call `avanan_list_tenants` to enumerate all active customers
2. For each tenant, call `avanan_search_events` with the last 30 days, grouped by severity
3. Identify tenants with:
   - Any `critical` events (immediate attention)
   - High `malware` counts (endpoint risk)
   - Zero events (possible misconfiguration or very low email volume)
4. Summarize per-tenant security posture for the monthly MSP security report

### Cross-Tenant Threat Sweep

When a new threat indicator is published (e.g., a phishing domain from a CISA advisory):

1. Search for events containing the indicator across all tenants (omit `tenantId` in Smart API search)
2. Identify which tenants received email from that sender/domain
3. Quarantine affected events per tenant with `avanan_perform_event_action`
4. Add a blacklist exception for the domain across all affected tenants
5. Notify affected clients with a summary of the threat and actions taken

## Error Handling

### tenant_not_found

**Cause:** Invalid `tenantId` — tenant IDs are auto-generated and not guessable
**Solution:** Call `avanan_list_tenants` first to get valid tenant IDs; never guess or manually construct them

### exception_already_exists

**Cause:** Attempting to add a duplicate exception (same type + value + tenant)
**Solution:** Call `avanan_list_exceptions` first to check for existing exceptions before adding

### Insufficient Scope for Smart API

**Cause:** Standard API credentials do not have access to Smart API tenant listing
**Solution:** Confirm the credentials are MSP-level Smart API credentials; contact Check Point to upgrade account type

### Whitelist Not Taking Effect

**Cause:** New exceptions may take 5–10 minutes to propagate to all Avanan filtering nodes
**Solution:** Wait 10 minutes after adding an exception before testing; check `status: "active"` in the exception response

## Best Practices

- Always include a `note` when adding exceptions — include date, ticket reference, and reason
- Whitelist by sender email, not domain, when possible — domain whitelists are broader and riskier
- Never add competitor domains or known free email providers (gmail.com, outlook.com) to domain whitelists
- Review whitelist exceptions quarterly — stale exceptions are a security risk if the whitelisted sender is later compromised
- For MSP-wide exceptions, get sign-off from a technical lead — they affect all customers
- Keep a record in the PSA/ticketing system of all exceptions added, when, by whom, and why
- When removing exceptions, check first if the removal will re-trigger events for messages already delivered

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Smart API authentication and request patterns
- [security-events](../security-events/SKILL.md) - Security event management and remediation actions
