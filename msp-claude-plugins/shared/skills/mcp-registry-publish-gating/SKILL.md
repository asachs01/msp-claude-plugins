---
name: mcp-registry-publish-gating
description: |
  Fix MCP Registry publish failures with "cannot publish duplicate version" or "OCI image
  does not exist" errors. Use when: (1) a `*-mcp` repo's release workflow fails on the
  "Publish to MCP Registry" step with `cannot publish duplicate version X.Y.Z`, (2)
  the publish step fails with `ghcr.io/wyre-technology/<repo>:vX.Y.Z does not exist`,
  (3) semantic-release ran and decided "no release published" but the registry-publish
  job still ran and crashed because version output is empty. Root cause is the
  registry-publish step running unconditionally instead of being gated on
  `new-release-published == 'true'` AND on the docker-push job completing first.
author: Claude Code
version: 1.0.0
date: 2026-05-07
---

# MCP Registry Publish Gating

## Problem

MCP Registry publish jobs fail in two related ways across the wyre-technology fleet:

1. **`cannot publish duplicate version 2.18.0`** — semantic-release decided no release was
   needed (no relevant commits), so the version stays the same as last time. The publish
   job runs anyway and tries to re-publish the same version.

2. **`ghcr.io/wyre-technology/<repo>:vX.Y.Z does not exist`** — the registry-publish job
   ran in parallel with (or before) the docker-push job. The Registry tries to pull the
   referenced OCI image and 404s because GHCR hasn't tagged it yet.

3. **`needs.release.outputs.version is empty`** — same family: when no release publishes,
   `outputs.version` is unset; downstream jobs that depend on it crash with empty
   substitutions.

This pattern affects autotask-mcp, domotz-mcp, syncro-mcp, datto-rmm-mcp, halopsa-mcp,
and any repo using the shared `*-mcp` release workflow template.

## Trigger conditions

- Repo's release workflow has both a `release` job (semantic-release) and a
  `publish-registry` (or similar) job.
- Run failure shows duplicate-version, missing-image, "outputs.version is empty",
  OR ordering-correct-but-still-OCI-image-not-exist (tag-prefix sub-variant — see below).
- Pattern recurs on every scheduled or push-to-main run.

## Diagnosis

```bash
gh run view <runId> --repo <owner>/<repo> --log-failed | tail -40
```

Look for:
- `cannot publish duplicate version`
- `ghcr.io/.../<repo>:v.* does not exist`
- `needs.release.outputs.version is empty`
- `WARN  No commits since last release` (semantic-release)

### Tag-prefix-mismatch sub-variant (added 2026-05-14 per cipp-mcp PR #14)

**If `needs: [release, docker]` is already in place but Publish still fails with
`OCI image ghcr.io/.../<repo>:vX.Y.Z does not exist`,** the failure isn't workflow
ordering — it's **tag-prefix mismatch** between docker job tagging and mcp-registry
stamping.

Two-step check:
```bash
# 1. Check what tags the docker job actually pushed to GHCR
gh api 'orgs/wyre-technology/packages/container/<repo>/versions?per_page=3' \
  --jq '.[] | .metadata.container.tags'

# 2. Check what tag mcp-registry stamps into server.json
gh api repos/wyre-technology/<repo>/contents/.github/workflows/release.yml \
  --jq '.content' | base64 -d | grep -A1 "Stamp version" | grep packages
```

If GHCR shows bare semver (`1.2.2`) but server.json stamps `v`-prefix (`v1.2.2`),
that's the mismatch. **Fleet canonical (halopsa-mcp) uses `v`-prefix.** Fix by
aligning docker metadata-action tag to `v${VERSION}`:

```yaml
# WRONG (drift)
tags: |
  type=raw,value=${{ steps.version.outputs.version }}

# RIGHT (fleet canonical)
tags: |
  type=raw,value=v${{ steps.version.outputs.version }}
```

Three-axis failure model applies here: workflow ordering (axis 1) + outputs
propagation (axis 2) + tag-convention consistency (axis 3) are independent.
N-1 axes can be correct while the N-th still blocks the pipeline.

## Fix

Gate every downstream job on **both**:
1. `needs.release.outputs.new-release-published == 'true'` (semantic-release actually cut)
2. `needs: [release, docker-push]` (so registry-publish waits for the image)

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    outputs:
      new-release-published: ${{ steps.semrel.outputs.new-release-published }}
      version: ${{ steps.semrel.outputs.new-release-version }}
    steps:
      - uses: actions/checkout@<sha>
        with:
          fetch-depth: 0  # semantic-release needs full history
      - id: semrel
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

  docker-push:
    needs: release
    if: needs.release.outputs.new-release-published == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      - uses: docker/login-action@<sha>
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@<sha>
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:v${{ needs.release.outputs.version }}
            ghcr.io/${{ github.repository }}:latest

  publish-registry:
    needs: [release, docker-push]                                  # CRITICAL: needs docker-push
    if: needs.release.outputs.new-release-published == 'true'      # CRITICAL: gate on new release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      - run: |
          npx @modelcontextprotocol/registry publish \
            --image ghcr.io/${{ github.repository }}:v${{ needs.release.outputs.version }}
        env:
          MCP_REGISTRY_TOKEN: ${{ secrets.MCP_REGISTRY_TOKEN }}
```

## Optional: also gate on image existence

Even with `needs: docker-push`, GHCR can lag by a few seconds. Add a retry with
exponential backoff before publishing:

```yaml
- name: Wait for image to be available
  run: |
    for i in 1 2 4 8 16 32; do
      if docker manifest inspect ghcr.io/${{ github.repository }}:v${{ needs.release.outputs.version }} >/dev/null 2>&1; then
        echo "Image available"; exit 0
      fi
      echo "Image not yet available, sleeping ${i}s"; sleep $i
    done
    echo "Image never appeared"; exit 1
```

## Verification

After applying:

1. Push a commit with no `feat:`/`fix:`/`BREAKING` prefix → release should NOT cut, and
   docker-push + publish-registry should both be SKIPPED (not failed).
2. Push a `fix:` commit → release should cut, docker-push should run, publish-registry
   should run AFTER docker-push and succeed with the new tag.

## Centralize

This logic should live in ONE reusable workflow:
`wyre-technology/.github/.github/workflows/mcp-server-release.yml`. Every `*-mcp` repo
should `uses:` it instead of copy-pasting. See the
`mcp-server-fleet-ci-template` skill for the full canonical workflow.
