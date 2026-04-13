---
name: brain-sync
description: Check sync status or trigger a sync for one or all data sources
arguments:
  - name: source
    description: Source to sync — autotask, itglue, datto_rmm, halopsa, ninjaone, hudu, syncro, liongard. Omit to show status.
    required: false
  - name: all
    description: Set to "true" to sync all configured sources immediately
    required: false
---

# Brain: Sync Management

Check sync health or trigger an immediate sync.

## Steps

**If no source and all != "true" (status check):**
1. Call `brain_sync_status()`
2. Present a status table: source | entity | last synced | records | error

**If source is provided:**
1. Call `brain_sync_source({ source: source })`
2. Report the job was queued
3. Advise the user to re-run `/brain-sync` in ~60 seconds to confirm completion

**If all == "true":**
1. Call `brain_sync_all()`
2. Report all jobs were queued

## Status Presentation

```
SOURCE         ENTITY         LAST SYNCED          RECORDS  STATUS
autotask       organizations  2026-04-13 11:30 UTC  248      ✅ OK
autotask       tickets        2026-04-13 11:15 UTC  1,842    ✅ OK
datto_rmm      assets         2026-04-13 09:00 UTC  1,204    ✅ OK
itglue         tech_stack     never                 —        ⚠️  Never synced
```

Flag rows where:
- `last_error` is not null (🔴 Failed)
- `last_synced_at` is null (⚠️ Never synced)
- `last_synced_at` is older than 2× the expected cadence (⏰ Overdue)
