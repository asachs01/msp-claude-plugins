# Compliance Drift Reporter — CIPP expansion: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Compliance Drift Reporter Advanced Workflow docs page and live routine so its weekly report covers CIPP baseline/posture drift alongside Liongard config-change detections.

**Architecture:** A docs-content change in `msp-claude-plugins` (two `.astro` pages + CHANGELOG) plus an operational update to the live Claude-managed routine `trig_01KdNPXeYMep1SFEDEzCrPQV`. The routine gains two CIPP gateway tools and a rewritten two-phase prompt. No application code.

**Tech Stack:** Astro docs site (`msp-claude-plugins/docs`), WYRE MCP Gateway connectors, Claude-managed scheduled routines.

**Reference:** Spec at `msp-claude-plugins/docs/superpowers/specs/2026-05-19-compliance-drift-reporter-cipp-design.md`.

---

### Task 1: Rewrite the build prompt and routine prompt consts

**Files:**
- Modify: `msp-claude-plugins/docs/src/pages/advanced-workflows/compliance-drift-reporter.astro` (frontmatter `const buildPrompt` and `const routinePrompt`)

- [ ] **Step 1: Replace `buildPrompt`** with this exact string content:

```
Build me the expanded Compliance Drift Reporter — a scheduled agent that combines Liongard configuration-change detections with CIPP baseline and posture data. Do all of this end to end:

1. Confirm the WYRE MCP Gateway works:
   - Liongard: call liongard_detections_list with a recent 7-day startDate/endDate and pageSize 5; confirm a Data.Detections array plus a Data.Pagination envelope.
   - CIPP tenants: call cipp_list_tenants; confirm a flat array of tenant objects, each with customerId, displayName, defaultDomainName, GraphErrorCount and Excluded.
   - CIPP standards: call cipp_list_standards with tenantFilter "allTenants"; note whether it returns assigned baselines or an empty array. An empty array is expected until baselines are assigned in CIPP - it is not an error.
   Do NOT call cipp_list_bpa: the Best Practice Analyser is deprecated and returns HTTP 503.
2. Note the shapes. Each Liongard detection carries a very large ChangeDetection field (5KB-44KB); the routine reads only ID, SystemName, Name, Date, SystemType and never ChangeDetection. cipp_list_tenants returns roughly 34 tenants; the routine reads only customerId, displayName, defaultDomainName, GraphErrorCount and Excluded, and never echoes LastGraphError.
3. Confirm a Slack connector is connected and note the destination channel name and ID (e.g. #sw-dev, C0931CKJ75X). If Slack does not show in the /schedule connector list, read its connector_uuid and url from an existing routine that already uses Slack.
4. Update the existing scheduled routine named "Compliance Drift Reporter" (trigger trig_01KdNPXeYMep1SFEDEzCrPQV):
   - Keep the schedule: weekly, cron "0 12 * * 1" (Monday 08:00 America/New_York = 12:00 UTC).
   - On the WYRE MCP Gateway connector set permitted_tools to: liongard_detections_list, cipp_list_tenants, cipp_list_standards.
   - On the Slack connector set permitted_tools to: slack_create_canvas, slack_send_message.
   - An empty permitted_tools list = the routine runs with no tools.
   - Install the exact routine prompt below.
5. Trigger a manual run and verify: a canvas titled "Compliance Drift - <date>" was created with a posture scorecard and two sections (Liongard, CIPP), a one-line summary landed in the destination channel, the Liongard count matches Data.Pagination.TotalRows, and the CIPP counts (tenants with a baseline + unmanaged) sum to the non-excluded tenant total.
```

- [ ] **Step 2: Replace `routinePrompt`** with this exact string content:

```
You are the Compliance Drift Reporter, a weekly routine for WYRE. You report two compliance signals in one digest: Liongard configuration-change detections, and CIPP baseline and posture state. Treat the two sources independently - a failure in one must not block the other.

PHASE 1 - Liongard detections.
Compute a 7-day window: endDate = now (ISO-8601), startDate = 7 days before now. Call liongard_detections_list with that startDate and endDate, pageSize 5, page 1.
- The envelope is Data.Detections (array) and Data.Pagination ({ TotalRows, HasMoreRows, CurrentPage, TotalPages, PageSize }).
- For EACH detection read ONLY: ID, SystemName, Name, Date, SystemType. NEVER read or echo ChangeDetection - it is 5KB-44KB each.
- Paginate by incrementing page until you have collected 25 detections OR HasMoreRows is false. CAP at 25 (5 pages).
- Record Data.Pagination.TotalRows as the true weekly total.
- If liongard_detections_list errors, mark the Liongard source UNAVAILABLE and continue to Phase 2.

PHASE 2 - CIPP baseline and access health.
Call cipp_list_tenants with no arguments. It returns a flat array of tenant objects.
- For each tenant read ONLY: customerId, displayName, defaultDomainName, GraphErrorCount, Excluded. Skip any tenant where Excluded is true.
- Access health: a tenant with GraphErrorCount > 0 has BROKEN delegated access. Record its displayName. Do NOT echo LastGraphError.
Call cipp_list_standards with tenantFilter "allTenants". It returns the assigned compliance baselines and their state, or an empty array.
- A non-excluded tenant absent from the standards result has NO baseline assigned - classify it UNMANAGED.
- A tenant present with a passing state is PASS; with a failing state is FAIL.
- If the standards result is an empty array, EVERY non-excluded tenant is UNMANAGED. This is expected while baselines are still being rolled out - it is NOT an error, and you must NEVER invent per-tenant compliance findings that are not in the data.
- If cipp_list_tenants errors, mark the CIPP source UNAVAILABLE.
Never call cipp_list_bpa (deprecated, HTTP 503) or cipp_run_standards_check (a write operation).

PHASE 3 - Total failure check.
If BOTH the Liongard source and the CIPP source are UNAVAILABLE, call slack_send_message to channel C0931CKJ75X with: 'Compliance Drift Reporter needs a human: neither Liongard nor CIPP could be read this week.' Then stop.

PHASE 4 - Zero findings check.
If every available source succeeded AND there are zero Liongard detections AND zero baseline FAIL tenants AND zero broken-access tenants, call slack_send_message to channel C0931CKJ75X with the single line: 'Compliance drift: no configuration changes, no baseline failures, no access issues this week.' Then stop. Tenants being UNMANAGED is a reportable finding, not zero findings - if any tenant is unmanaged, continue to Phase 5.

PHASE 5 - Build the report.
Compose a markdown report:
- SCORECARD at the top: 'Configuration changes this week: <Liongard TotalRows>. Tenants with a baseline assigned: <X> of <N>. Tenants failing baseline: <F>. Tenants with broken delegated access: <B>.' If a source was UNAVAILABLE, say so on its scorecard line instead of a number.
- SECTION 'Configuration changes (Liongard)': group the collected detections by SystemName, sort each group by Date descending, one line per detection (Name and human-readable Date). If TotalRows exceeds the number collected, note 'Showing the 25 most recent of <TotalRows>.' If the Liongard source was UNAVAILABLE, the section body is the single line 'Liongard data unavailable this run.'
- SECTION 'Baseline compliance (CIPP)':
   * Baseline coverage: if any tenant has a standard assigned, list PASS and FAIL tenants by displayName, then list UNMANAGED tenants. If no standards are assigned at all, write the single line 'No compliance baselines assigned in CIPP yet - <N> tenants unmanaged.'
   * Tenant access health: list the displayName of every tenant with broken delegated access, or 'All tenants have healthy delegated access.' if none.
   If the CIPP source was UNAVAILABLE, the section body is the single line 'CIPP data unavailable this run.'

PHASE 6 - Deliver.
Call slack_create_canvas titled 'Compliance Drift - <today's date YYYY-MM-DD>' with the scorecard and both sections as markdown. Then call slack_send_message to channel C0931CKJ75X with a one-line summary linking the canvas, e.g. 'Compliance drift report ready: <TotalRows> config changes, <F> baseline failures, <B> tenants with access issues. See canvas: <link>.'

Use only these tools: liongard_detections_list, cipp_list_tenants, cipp_list_standards, slack_create_canvas, slack_send_message. Keep every step light - never read Liongard's ChangeDetection field or CIPP's LastGraphError blobs.
```

- [ ] **Step 3: Commit**

```bash
git add msp-claude-plugins/docs/src/pages/advanced-workflows/compliance-drift-reporter.astro
git commit -m "docs(advanced-workflows): rewrite Compliance Drift Reporter prompts for CIPP"
```

---

### Task 2: Rewrite the page body prose

**Files:**
- Modify: `msp-claude-plugins/docs/src/pages/advanced-workflows/compliance-drift-reporter.astro` (the `<DocsLayout>` body)

- [ ] **Step 1: Update each section** to cover both signals, keeping the existing page's tone and HTML structure:
  - `title` / `description` / lead paragraph: a weekly agent covering Liongard config-change detections **and** CIPP baseline/posture drift.
  - `what-it-builds`: four phases — Liongard collect, CIPP collect, scorecard, deliver.
  - `prerequisites` table: add a **CIPP enabled in the gateway** row (`cipp_list_tenants`, `cipp_list_standards`). Keep the existing Liongard, Slack, routines, channel rows.
  - `gotchas`: keep the Liongard `ChangeDetection` and pagination gotchas; add the three new CIPP gotchas from the spec ("Known gotchas" section) — BPA deprecated, `cipp_list_standards` empty until rollout (never fabricate), 34-tenant flat array / never echo `LastGraphError`.
  - `how-it-works`: add subsections — "Two sources, reported independently", "CIPP baseline drift and the empty-state rule", "Tenant access health is a day-one signal".
  - `extending`: replace the Liongard-metric-endpoint paragraph; new extensions = PSA ticket for repeat offenders, auto-remediation of broken delegated access. Note BPA is deprecated so is not an extension path.

- [ ] **Step 2: Commit**

```bash
git add msp-claude-plugins/docs/src/pages/advanced-workflows/compliance-drift-reporter.astro
git commit -m "docs(advanced-workflows): rewrite Compliance Drift Reporter body for CIPP"
```

---

### Task 3: Update the agent-routine catalog

**Files:**
- Modify: `msp-claude-plugins/docs/src/pages/advanced-workflows/agent-routine-catalog.astro`

- [ ] **Step 1: Update two table rows.**
  - `compliance-drift-reporter` / `liongard` row: change `Connector(s)` to `liongard, cipp` and the note to `✅ built — batch 1, expanded to CIPP baseline + posture drift.`
  - `security-posture-reviewer` / `cipp` row: append to its note `M365 posture is now partly covered by the Compliance Drift Reporter.`

- [ ] **Step 2: Commit**

```bash
git add msp-claude-plugins/docs/src/pages/advanced-workflows/agent-routine-catalog.astro
git commit -m "docs(advanced-workflows): note CIPP coverage in agent-routine catalog"
```

---

### Task 4: Update the changelog

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add an entry** under the `[Unreleased]` section (create the section/`### Changed` heading if absent), following Keep a Changelog 1.1.0:

```markdown
### Changed
- Advanced Workflows: the Compliance Drift Reporter now also reports CIPP baseline
  drift (assigned Standards) and tenant delegated-access health, alongside the
  existing Liongard configuration-change detections.
```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs(changelog): Compliance Drift Reporter CIPP expansion"
```

---

### Task 5: Build the docs site and open the PR

**Files:** none (verification + PR)

- [ ] **Step 1: Build the docs site**

Run: `cd msp-claude-plugins/docs && npm run build`
Expected: build completes with no errors; `compliance-drift-reporter` and `agent-routine-catalog` pages render.

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin advanced-workflows-cipp-compliance-drift
gh pr create --title "Advanced Workflows: Compliance Drift Reporter CIPP expansion" \
  --body "Expands the Compliance Drift Reporter to report CIPP baseline drift and tenant access health alongside Liongard detections. Spec: docs/superpowers/specs/2026-05-19-compliance-drift-reporter-cipp-design.md"
```

Expected: PR created against `main`.

---

### Task 6: Update the live routine (operational, after PR merges)

**Files:** none (operational — performed in the WYRE Claude account, not git)

- [ ] **Step 1:** Paste the Task 1 `buildPrompt` to Claude in the WYRE account with the WYRE MCP Gateway and Slack connectors attached.
- [ ] **Step 2:** Confirm the routine `trig_01KdNPXeYMep1SFEDEzCrPQV` now has gateway `permitted_tools` = `liongard_detections_list, cipp_list_tenants, cipp_list_standards`.
- [ ] **Step 3:** Trigger a manual run; verify the canvas has the scorecard + both sections and the summary line posts to `C0931CKJ75X`.

---

## Self-review

- **Spec coverage:** Phases 1–6, per-source degradation, empty-state rule, scorecard, both sections, build prompt, catalog + changelog, routine update — all mapped to Tasks 1–6. ✓
- **Placeholder scan:** prompt consts are verbatim; prose tasks reference the spec's enumerated sections rather than leaving "TODO". ✓
- **Consistency:** tool list (`liongard_detections_list`, `cipp_list_tenants`, `cipp_list_standards`, `slack_create_canvas`, `slack_send_message`), channel `C0931CKJ75X`, trigger `trig_01KdNPXeYMep1SFEDEzCrPQV`, cron `0 12 * * 1` consistent across build prompt, routine prompt, and Task 6. ✓
