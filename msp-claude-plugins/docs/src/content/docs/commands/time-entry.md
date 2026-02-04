---
title: /time-entry
description: Log billable and non-billable time against tickets and projects
---

The `/time-entry` command creates time entries in your PSA for tracking work performed. It supports both ticket-based and project-based time logging with automatic billing integration.

## Syntax

```
/time-entry <ticket-or-project-id> --hours <amount> [options]
```

## Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ticket-or-project-id` | string | Ticket number (T20260204.0043) or Project ID (P2026.001) |
| `--hours` | decimal | Time spent (supports decimal: 0.25, 1.5, 2.75) |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `--work-type` | string | "Remote Support" | Type of work performed |
| `--notes` | string | none | Description of work performed |
| `--date` | date | today | Date work was performed |
| `--start-time` | time | none | Start time (required for some contracts) |
| `--end-time` | time | none | End time (calculated from start + hours if not provided) |
| `--billable` | boolean | auto | Override automatic billing determination |
| `--internal` | flag | false | Mark as internal/non-billable time |
| `--role` | string | default role | Billing role for rate calculation |
| `--resource` | string | current user | Resource performing work (admin only) |
| `--task` | string | none | Project task (required for project time) |
| `--verbose` | flag | false | Show detailed output with billing info |

## Work Types

Common work types (actual values depend on your PSA configuration):

| Work Type | Description | Typical Billing |
|-----------|-------------|-----------------|
| Remote Support | Remote troubleshooting and assistance | Billable |
| On-Site Support | Physical presence at client location | Billable |
| Phone Support | Telephone-based assistance | Billable |
| Administrative | Internal admin tasks | Non-billable |
| Travel | Travel time to/from client | Varies |
| Project Work | Dedicated project tasks | Per project |
| Training | User or staff training | Varies |
| Maintenance | Scheduled maintenance tasks | Per contract |

## Usage Examples

### Basic Time Entry

```
/time-entry T20260204.0043 --hours 0.5
--notes "Troubleshot email sync issue, cleared cache and reconnected mailbox"
```

**Output:**
```
Time entry created

  Ticket:     T20260204.0043 - User cannot access email
  Company:    Acme Corp
  Hours:      0.50
  Work Type:  Remote Support
  Date:       2026-02-04
  Billable:   Yes
  Rate:       $150.00/hr
  Amount:     $75.00

  Entry ID:   TE20260204.0891
```

### Specifying Work Type

```
/time-entry T20260204.0043 --hours 1.25
--work-type "On-Site Support"
--notes "Replaced failed hard drive, restored from backup, verified data integrity"
```

### Non-Billable/Internal Time

```
/time-entry T20260204.0043 --hours 0.25 --internal
--notes "Internal review of ticket history before customer call"
```

**Output:**
```
Time entry created (Non-Billable)

  Ticket:     T20260204.0043 - User cannot access email
  Company:    Acme Corp
  Hours:      0.25
  Work Type:  Remote Support
  Date:       2026-02-04
  Billable:   No (marked as internal)

  Entry ID:   TE20260204.0892
```

### Backdated Entry

```
/time-entry T20260203.0091 --hours 1.5
--date "2026-02-03"
--work-type "Remote Support"
--notes "Initial troubleshooting of printer connectivity issue"
```

### With Start/End Times

```
/time-entry T20260204.0043 --hours 2.0
--start-time "14:00"
--end-time "16:00"
--work-type "Remote Support"
--notes "Extended troubleshooting session with user"
```

### Project Time Entry

```
/time-entry P2026.001 --hours 4.0
--task "Server Migration"
--work-type "Project Work"
--notes "Migrated file shares to new server, updated DFS namespaces"
```

**Output:**
```
Time entry created (Project)

  Project:    P2026.001 - Infrastructure Upgrade
  Task:       Server Migration
  Company:    Contoso Ltd
  Hours:      4.00
  Work Type:  Project Work
  Date:       2026-02-04
  Billable:   Yes (Fixed Fee Project)

  Budget Status:
    Task Budget:     40.00 hours
    Used (prior):    28.00 hours
    This Entry:       4.00 hours
    Remaining:        8.00 hours

  Entry ID:   TE20260204.0893
```

### Override Billing Role

```
/time-entry T20260204.0043 --hours 1.0
--role "Senior Engineer"
--notes "Escalation assistance for complex network issue"
```

### Verbose Output

```
/time-entry T20260204.0043 --hours 0.5 --verbose
--notes "Password reset and MFA reconfiguration"
```

**Output:**
```
Time entry created

  Ticket:       T20260204.0043 - User cannot access email
  Ticket ID:    29847561
  Company:      Acme Corp (ID: 29683541)

  Time Details:
    Hours:        0.50
    Date:         2026-02-04
    Start Time:   10:30
    End Time:     11:00
    Work Type:    Remote Support (ID: 5)

  Billing Details:
    Billable:     Yes
    Contract:     Managed Services Agreement (ID: 8847)
    Rate Type:    Hourly
    Role:         Support Technician
    Hourly Rate:  $150.00
    Amount:       $75.00

  Resource:
    Name:         Mike Tech
    Email:        mike.tech@msp.com
    Resource ID:  4521

  Notes:
    Password reset and MFA reconfiguration

  API Response:
    Entry ID:     TE20260204.0891
    Request ID:   req_xyz789abc123
    Duration:     189ms
```

## Billing Integration

### Automatic Billing Detection

The command automatically determines billing based on:

1. **Contract Type**: Managed services, block hours, T&M, fixed fee
2. **Work Type**: Some work types are always non-billable
3. **Resource Role**: Different rates for different roles
4. **Ticket/Project Settings**: Override at ticket or project level

### Contract Types and Behavior

| Contract Type | Billing Behavior |
|---------------|------------------|
| Managed Services | Included in monthly fee (non-billable) |
| Block Hours | Deducts from prepaid hours |
| Time & Materials | Billable at hourly rate |
| Fixed Fee Project | Tracked against project budget |
| Internal | Always non-billable |

### Block Hours Tracking

```
/time-entry T20260204.0043 --hours 0.5
--notes "Quick password reset"
```

**Output (Block Hours Contract):**
```
Time entry created (Block Hours)

  Ticket:     T20260204.0043 - Password reset request
  Company:    Acme Corp
  Hours:      0.50

  Block Hours Status:
    Contract:       20-Hour Support Block
    Period:         February 2026
    Hours Used:     12.50 (including this entry)
    Hours Remaining: 7.50

  Warning: Client has used 62.5% of monthly block hours.

  Entry ID:   TE20260204.0894
```

## Approval Workflow

Some organizations require time entry approval:

### Pending Approval

```
/time-entry T20260204.0043 --hours 3.0
--notes "Extended troubleshooting session"
```

**Output:**
```
Time entry created (Pending Approval)

  Ticket:     T20260204.0043 - Complex network issue
  Company:    Acme Corp
  Hours:      3.00
  Billable:   Yes
  Amount:     $450.00

  Approval Status:
    Status:     Pending Approval
    Reason:     Entry exceeds 2-hour threshold
    Approver:   Service Manager

  Note: This entry requires manager approval before billing.

  Entry ID:   TE20260204.0895
```

### Approval Thresholds (Example)

| Threshold | Requires |
|-----------|----------|
| > 2 hours single entry | Manager approval |
| > $500 single entry | Manager approval |
| Backdated > 7 days | Manager approval |
| Non-standard rate | Finance approval |

## Error Handling

### Invalid Ticket

```
/time-entry T99999999.0000 --hours 0.5

Error: Ticket T99999999.0000 not found.

Suggestions:
  - Verify ticket number format (T followed by date and sequence)
  - Use /search-tickets to find the correct ticket
  - Check if ticket was merged or deleted
```

### Closed Ticket

```
/time-entry T20260101.0001 --hours 0.5

Error: Cannot add time to closed ticket T20260101.0001.

Options:
  1. Reopen the ticket first
  2. Contact administrator to add time to closed tickets
  3. Create a new ticket for continued work
```

### Exceeded Budget

```
/time-entry P2026.001 --hours 8.0 --task "Server Migration"

Warning: This entry would exceed task budget.

  Task Budget:     40.00 hours
  Already Used:    38.00 hours
  This Entry:       8.00 hours
  Over Budget:      6.00 hours

Options:
  1. Proceed anyway (will flag for review): --force
  2. Enter partial time within budget: --hours 2.0
  3. Request budget increase from project manager

Use --force to submit over-budget entry for approval.
```

### Invalid Hours

```
/time-entry T20260204.0043 --hours 25

Error: Invalid hours value "25".

Constraints:
  - Minimum: 0.1 hours (6 minutes)
  - Maximum: 24 hours per entry
  - Precision: 0.25 hour increments (or 0.1 in some configurations)

Tip: For multi-day work, create separate entries per day.
```

### Missing Required Task

```
/time-entry P2026.001 --hours 2.0

Error: Project time entries require a task.

Available tasks for P2026.001:
  - Planning
  - Server Migration
  - Data Migration
  - Testing
  - Documentation

Use: /time-entry P2026.001 --hours 2.0 --task "Server Migration"
```

## Best Practices

### Note Quality

Good notes help with billing disputes and knowledge sharing:

**Good:**
```
"Troubleshot email sync failure on user's iPhone. Removed and re-added Exchange
account. Verified calendar and contacts syncing. User confirmed all working."
```

**Bad:**
```
"Fixed email"
```

### Time Granularity

- Use consistent increments (0.25 hour = 15 min is common)
- Log time promptly to ensure accuracy
- Break large blocks into meaningful chunks

### Daily Logging

```
You: Log 15 minutes for the password reset I just did on the Acme ticket,
     and 45 minutes for the network troubleshooting at Contoso.

Claude: I'll create both time entries:

        /time-entry T20260204.0043 --hours 0.25
        --notes "Password reset and account unlock for J. Smith"

        /time-entry T20260204.0044 --hours 0.75
        --notes "Diagnosed intermittent network drops, identified failing switch port"
```

## Common Patterns

### Quick Entry from Context

```
You: I just spent 20 minutes helping the Acme user with their Outlook issue.

Claude: /time-entry T20260204.0043 --hours 0.33
        --notes "Assisted user with Outlook configuration and calendar sync"

        (Using most recent Acme ticket from conversation)
```

### End of Day Summary

```
You: Log my time for today - 30 min on Acme email, 1 hour Contoso server,
     15 min internal meeting.

Claude: Creating three time entries:

        /time-entry T20260204.0043 --hours 0.5
        --notes "Email troubleshooting and resolution"

        /time-entry T20260204.0044 --hours 1.0
        --notes "Server monitoring review and alert configuration"

        /time-entry INTERNAL --hours 0.25 --internal
        --notes "Team standup meeting"
```

## Related Commands

- [/create-ticket](/msp-claude-plugins/commands/create-ticket/) - Create tickets to log time against
- [/search-tickets](/msp-claude-plugins/commands/search-tickets/) - Find tickets for time entry

## See Also

- [Time Tracking Skill](/msp-claude-plugins/plugins/kaseya/autotask/#time-tracking) - Underlying skill documentation
- [Commands Overview](/msp-claude-plugins/commands/overview/) - All available commands
