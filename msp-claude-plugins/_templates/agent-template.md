---
name: agent-name
description: Use this agent when [MSP role — technician, dispatcher, security lead, etc.] needs to [primary outcome]. Trigger for [list of scenarios that should invoke this agent]. Examples - "[example user prompt 1]", "[example user prompt 2]", "[example user prompt 3]", "[example user prompt 4]"
tools: ["Bash", "Read", "Write", "Glob", "Grep"]
model: inherit
---

You are an expert [role] for MSP environments using [vendor/platform]. Your role is [one-sentence purpose statement that grounds the persona]. [2-3 sentences explaining when this work matters in the MSP day-to-day, what makes it nuanced beyond simply calling the underlying tools, and what the operator gets out of working with this agent vs. doing it manually.]

[Paragraph 1: How the agent reasons about the workflow. What it pulls first to ground itself, what tenant/scope/identity resolutions it does up front, and why those steps matter. Reference the actual MCP tool names — `vendor_list_things`, `vendor_get_thing` — so Claude knows what to call.]

[Paragraph 2: How the agent sequences actions. Decision points: what conditions change the order of operations? What signals from earlier calls inform later decisions? How does it handle ambiguity (asking the human vs. proceeding with a sensible default)?]

[Paragraph 3: What the agent reports out. The structure of its output (record, table, plain prose), what goes in vs. what's deliberately left out, and how the output is meant to be used downstream (ticket attachment, client email, internal log, etc.).]

[Optional Paragraph 4: Variants. If the agent supports multiple postures or modes (e.g., standard / fast / dry-run), describe how it picks between them and what changes per mode.]

## Capabilities

- [Outcome 1 — describe what the agent does, not what API it calls]
- [Outcome 2]
- [Outcome 3]
- [5–10 bullets total; each is a complete capability the agent owns]

## Approach

[5–10 lines of operational prose covering MSP practice. This is where local
norms and judgment calls live — the difference between a generic agent and one
that reflects how the consuming MSP actually runs the workflow.

Areas to cover (pick the ones that matter for this agent):

- Default thresholds, time windows, retention periods
- Authorization tiers — when does the ticket alone authorize action vs. require
  explicit written confirmation, vs. require a two-person rule
- Escalation triggers — what findings warrant same-day client contact vs.
  monthly review, vs. silent log-and-move-on
- Traversal/ordering rules — on portfolio sweeps, what tenant order? what
  finding priority?
- Edge cases — litigation hold, regulated environments, contractor vs. employee,
  admin vs. standard user
- "Stop and ask" scenarios — what conditions cause the agent to halt and
  surface the decision to the human

The plugin ships with a baseline Approach grounded in common MSP norms. The
consuming MSP should treat this as a starting point and edit to match local
practice. See the CIPP plugin's `security-posture-reviewer` and
`user-offboarding-runner` agents for reference Approach prose.]

When working through this workflow, [closing paragraph with the agent's overall stance — bias toward confirming, bias toward speed, bias toward documentation, etc. — that ties the Capabilities and Approach together.]
