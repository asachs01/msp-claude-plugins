---
title: Ticket Triage Skill
description: Shared skill providing best practices for ticket prioritization and categorization in MSP workflows
---

The Ticket Triage skill provides Claude with knowledge about effective ticket prioritization, categorization, and initial assessment workflows. This skill helps ensure consistent handling of support requests across all PSA platforms.

## Purpose

Effective ticket triage is critical for MSP operations. This skill teaches Claude:

- Priority assessment frameworks
- Impact and urgency evaluation
- Categorization best practices
- Escalation criteria
- SLA considerations

## Priority Framework

### Priority Matrix

| Priority | Impact | Urgency | Response Time | Examples |
|----------|--------|---------|---------------|----------|
| **Critical (P1)** | Business down | Immediate | 15-30 min | Server crash, network outage, ransomware |
| **High (P2)** | Major impact | Same day | 1-2 hours | Email down, key app failure, security breach |
| **Medium (P3)** | Limited impact | Next business day | 4-8 hours | Single user issue, non-critical app, slow performance |
| **Low (P4)** | Minimal impact | Scheduled | 24-48 hours | Questions, minor requests, cosmetic issues |

### Impact Assessment

| Level | Description | Criteria |
|-------|-------------|----------|
| **Critical** | Business operations halted | Multiple users unable to work, revenue impact |
| **High** | Significant disruption | Key business function impaired, workaround difficult |
| **Medium** | Partial disruption | Single user or non-critical function affected |
| **Low** | Minimal disruption | Inconvenience only, workaround available |

### Urgency Factors

| Factor | Higher Urgency | Lower Urgency |
|--------|----------------|---------------|
| User count | Many users affected | Single user |
| Business timing | Month-end, payroll, deadline | Normal operations |
| Workaround | No workaround available | Workaround exists |
| Security | Active threat or breach | No security concern |
| Executive | C-level user affected | Standard user |

## Categorization Guidelines

### Service Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Hardware** | Physical equipment issues | PC, printer, server hardware |
| **Software** | Application problems | Crashes, errors, licensing |
| **Network** | Connectivity issues | Internet, WiFi, VPN |
| **Email** | Mail system problems | Outlook, Exchange, spam |
| **Security** | Security-related issues | Virus, phishing, access |
| **Account** | User account management | Password, permissions |
| **Request** | Service requests | New equipment, moves |

### Issue Types

| Type | Definition | Handling |
|------|------------|----------|
| **Incident** | Unplanned interruption | Restore service quickly |
| **Service Request** | Standard request | Follow defined process |
| **Problem** | Root cause investigation | Prevent recurrence |
| **Change** | Planned modification | Follow change process |

## Triage Workflow

### Step 1: Initial Assessment

```
1. Read ticket title and description
2. Identify the reporter and company
3. Determine affected systems/users
4. Check for related open tickets
```

### Step 2: Gather Information

Key questions to consider:
- What is the user trying to accomplish?
- When did the issue start?
- What changed recently?
- How many users are affected?
- Is there a workaround?

### Step 3: Assign Priority

```
IF business_down OR security_breach:
    priority = Critical
ELIF multiple_users OR key_system:
    priority = High
ELIF single_user AND has_workaround:
    priority = Medium
ELSE:
    priority = Low
```

### Step 4: Route Appropriately

| Condition | Action |
|-----------|--------|
| Critical priority | Immediate escalation to senior tech |
| Security-related | Route to security team/queue |
| Hardware issue | Check warranty, dispatch if needed |
| Project work | Route to projects queue |
| Standard request | Route to service desk |

## SLA Considerations

### Response vs Resolution

| Metric | Definition | Typical Targets |
|--------|------------|-----------------|
| **Response Time** | Time to first meaningful contact | P1: 15min, P2: 1hr, P3: 4hr, P4: 24hr |
| **Resolution Time** | Time to close ticket | P1: 4hr, P2: 8hr, P3: 24hr, P4: 72hr |

### SLA Best Practices

1. **Set realistic expectations** - Don't promise what you can't deliver
2. **Communicate proactively** - Update tickets before SLA breach
3. **Document everything** - Record all actions and communications
4. **Escalate early** - Don't wait until SLA is about to breach

## Skill File Location

```
.claude/skills/shared-ticket-triage.md
```

## Usage Examples

### Automatic Prioritization

**User request:**
> Our main server is down and nobody can access files. The whole office is at a standstill.

**Claude assessment:**
- Impact: Critical (entire office affected)
- Urgency: Immediate (business halted)
- Priority: **Critical (P1)**
- Category: Hardware/Server
- Action: Immediate escalation, contact on-call

### Categorization Assistance

**User request:**
> John Smith needs access to the shared accounting folder.

**Claude assessment:**
- Impact: Low (single user)
- Urgency: Standard (can wait)
- Priority: **Low (P4)**
- Category: Account/Permissions
- Type: Service Request

### Escalation Recommendation

**User request:**
> We received a suspicious email and someone clicked the link. Their computer is acting strange now.

**Claude assessment:**
- Impact: High (potential security breach)
- Urgency: Immediate (active threat)
- Priority: **Critical (P1)**
- Category: Security
- Action: Isolate machine, escalate to security team

## Customization

Organizations can extend this skill with their own triage rules:

```markdown
# Custom Triage Rules

## VIP Users
These users always receive High priority minimum:
- CEO, CFO, COO
- External clients

## Critical Systems
Issues with these systems are always Critical:
- Production database
- Payment processing
- Customer portal
```

## Related Skills

- [MSP Terminology](/msp-claude-plugins/plugins/shared/msp-terminology/) - Industry terminology
- [Autotask Tickets](/msp-claude-plugins/plugins/kaseya/autotask/) - Autotask-specific workflows
