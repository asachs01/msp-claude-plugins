---
name: "Brain: Sync Management"
description: >
  Use this skill when checking sync health, triggering a sync, or debugging stale data.
  Covers brain_sync_status, brain_sync_source, and brain_sync_all.
when_to_use: "When the user asks about sync status, wants to force a sync, or data looks stale"
triggers:
  - brain sync
  - sync status
  - brain_sync_status
  - brain_sync_source
  - brain_sync_all
  - stale data
  - last synced
  - force sync
  - sync failed
---

# Brain: Sync Management

## Overview

The brain syncs automatically on a schedule, but you can also trigger syncs on demand and inspect sync health. Syncs run as background jobs via BullMQ — triggering one adds a high-priority job to the queue; it doesn't block.

## Sync Cadences

| Data type | Default cadence |
|---|---|
| Alerts | Every 15 minutes |
| Tickets | Every 30 minutes |
| Assets | Every 2 hours |
| Organizations, contacts, tech stack, docs | Every 4 hours |

## Tools

### brain_sync_status

No parameters. Returns last sync time, record count, and any errors for each source+entity pair.

```
brain_sync_status()
```

Look for:
- `last_error` — non-null means the last sync failed; the error message is included
- `last_synced_at` — null means it has never synced (check credentials)
- Timestamps older than expected cadence — may mean Redis/worker is down

### brain_sync_source

Trigger an immediate sync for one source.

**Parameters:**
- `source` (string, required) — one of: `autotask`, `itglue`, `datto_rmm`, `halopsa`, `ninjaone`, `hudu`, `syncro`, `liongard`

```
brain_sync_source({ source: "autotask" })
brain_sync_source({ source: "datto_rmm" })
```

Returns a job ID. The sync runs asynchronously — call `brain_sync_status` after a minute to verify completion.

### brain_sync_all

Trigger an immediate sync for all configured sources.

```
brain_sync_all()
```

Adds a job per source. Good for a full refresh after initial setup or credential changes.

## Troubleshooting

### Data looks stale for a specific client

```
1. brain_sync_status() → check last_synced_at and last_error for the relevant source
2. If recent error: review the error message (usually credential or API issue)
3. brain_sync_source({ source: "autotask" }) → trigger a manual sync
4. Wait ~60 seconds, then brain_sync_status() to confirm success
```

### Sync consistently failing

Common causes:
- **Credential rotation** — source API key or secret changed; update env vars and restart brain-mcp
- **API rate limit** — some sources (ITGlue, HaloPSA) have strict rate limits; check error message
- **Redis unavailable** — BullMQ requires Redis; verify `REDIS_URL` and Redis health
- **Network/firewall** — brain-mcp may not have outbound access to the source API

### Never synced (last_synced_at is null)

1. Verify the source is listed in `BRAIN_SYNC_SOURCES` env var
2. Verify credentials for that source are set in env vars
3. Confirm Redis is running and `REDIS_URL` is set
4. `brain_sync_source` to manually trigger and check for errors

## Using brain_cross_client_query for stale sync detection

```
brain_cross_client_query({ query: "stale_syncs" })
```

Returns all sources that haven't synced in over 6 hours — useful for a health check dashboard.
