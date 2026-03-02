export type PromptRole = 'account' | 'finance' | 'sales' | 'support' | 'noc';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  role: PromptRole;
  plugins: string[];     // plugin IDs (from plugins.ts); empty = any PSA/RMM
  mcpServers: string[];  // MCP server IDs (from mcp-servers.ts); empty = any
  prompt: string;
}

export const roleLabels: Record<PromptRole, string> = {
  account:  'Account Management',
  finance:  'Finance & Billing',
  sales:    'Sales & Growth',
  support:  'Support & Helpdesk',
  noc:      'NOC & Engineering',
};

export const roleDescriptions: Record<PromptRole, string> = {
  account:  'QBRs, client health reports, executive summaries, and relationship management.',
  finance:  'Billing reconciliation, unbilled work, contract compliance, and aged receivables.',
  sales:    'Growth opportunities, device refresh cycles, at-risk clients, and upsell intelligence.',
  support:  'Ticket triage, SLA tracking, escalation reviews, and shift handoffs.',
  noc:      'Infrastructure health, patch status, alert correlation, and maintenance coordination.',
};

export const roleOrder: PromptRole[] = ['account', 'finance', 'sales', 'support', 'noc'];

export const prompts: Prompt[] = [

  // ── Account Management ────────────────────────────────────────────

  {
    id: 'account-qbr-prep',
    role: 'account',
    title: 'QBR Client Summary',
    description: 'Full quarter recap: ticket volume, SLA performance, recurring issues, and open risks.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'ninjaone', 'atera'],
    prompt: `Pull together a QBR summary for [CLIENT NAME] covering the past 90 days.

Include:
- Total ticket volume, broken down by category (hardware, software, network, user, other)
- SLA compliance rate — how many tickets were resolved within SLA vs breached
- Top 3 recurring issue types with ticket counts
- Any open tickets older than 14 days
- Any open or recent security incidents
- Notable wins or improvements since last QBR

Format as a structured report I can use as talking points in the meeting.`,
  },

  {
    id: 'account-health-scorecard',
    role: 'account',
    title: 'Client Health Scorecard',
    description: 'Snapshot of a client\'s current IT health across tickets, devices, and monitoring.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'ninjaone', 'atera', 'datto-rmm'],
    prompt: `Create a health scorecard for [CLIENT NAME].

Cover:
- Open ticket count by priority (critical, high, medium, low)
- Devices with active alerts or offline status
- Any monitors currently down or in warning state
- Overdue or breached SLA tickets
- Last 7 days of incident activity

Rate the overall health as Green / Amber / Red and explain your reasoning.`,
  },

  {
    id: 'account-exec-summary',
    role: 'account',
    title: 'Monthly Executive Summary',
    description: 'One-page executive summary suitable for sharing with a client\'s leadership team.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Write a one-page executive summary of IT activity for [CLIENT NAME] for [MONTH].

Audience: their CTO/IT director — not technical detail, focus on business impact.

Cover:
- Overall service summary (issues resolved, uptime achieved)
- Any significant incidents and how they were resolved
- Improvements or projects completed this month
- Risks or items requiring client attention
- Recommended next steps or upcoming work

Keep it concise and free of jargon.`,
  },

  {
    id: 'account-risk-report',
    role: 'account',
    title: 'Client Risk Report',
    description: 'Identify top risk areas based on open issues, device age, and recurring problems.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'ninjaone', 'atera', 'datto-rmm', 'itglue', 'hudu'],
    prompt: `Identify the top risk areas for [CLIENT NAME] based on current data.

Look for:
- Recurring ticket categories that suggest a systemic problem
- Devices that are offline, degraded, or overdue for replacement
- Security alerts or incidents in the past 30 days
- SLA breaches or near-breach tickets
- Any expired or expiring warranties, certificates, or licenses if visible

Rank the top 3-5 risks by potential business impact and suggest a mitigation action for each.`,
  },

  // ── Finance & Billing ─────────────────────────────────────────────

  {
    id: 'finance-unbilled-work',
    role: 'finance',
    title: 'Unbilled Work Review',
    description: 'Surface all time entries and tickets that are ready to bill but haven\'t been invoiced yet.',
    plugins: ['autotask', 'halopsa', 'connectwise-psa'],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Show me all unbilled work for [CLIENT NAME] (or all clients if not specified) that is in a billing-ready status.

Include:
- Ticket number, title, and date closed
- Technician who worked the ticket
- Total hours logged and billable hours
- Contract or billing type (time-and-materials, block hours, managed services)

Group by client if running for all accounts. Flag anything over 30 days old that still hasn't been invoiced.`,
  },

  {
    id: 'finance-time-entries',
    role: 'finance',
    title: 'Time Entry Audit',
    description: 'Review time entries for a client or period to verify accuracy before billing.',
    plugins: ['autotask', 'halopsa', 'connectwise-psa'],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Pull all time entries for [CLIENT NAME] for [DATE RANGE, e.g. March 2025].

For each entry show:
- Date, technician, and ticket number
- Work description
- Hours logged (regular vs overtime if applicable)
- Billing status

Flag any entries that look unusual: very short entries (under 5 minutes), entries logged long after the work date, or entries without a description.`,
  },

  {
    id: 'finance-contract-compliance',
    role: 'finance',
    title: 'Managed Services Contract Compliance',
    description: 'Compare actual hours and devices against what\'s in the contract.',
    plugins: ['autotask', 'halopsa', 'connectwise-psa'],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'ninjaone', 'atera', 'datto-rmm'],
    prompt: `Check contract compliance for [CLIENT NAME] for this month.

I need to know:
- How many devices are under their managed services contract vs what's actively monitored
- Total hours consumed this month vs their included hours (if on a block hours or capped plan)
- Any out-of-scope work billed separately
- Whether they're approaching overage thresholds

Highlight any discrepancies between what's contracted and what we're delivering.`,
  },

  {
    id: 'finance-aged-receivables',
    role: 'finance',
    title: 'Aged Receivables Summary',
    description: 'List all outstanding invoices by age and client for follow-up.',
    plugins: ['autotask', 'halopsa', 'connectwise-psa', 'xero', 'quickbooks'],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Give me a summary of all outstanding invoices across all clients, grouped by age.

Show:
- Current (0-30 days)
- Overdue 31-60 days
- Overdue 61-90 days
- Overdue 90+ days

For each bucket, list the client name, invoice number(s), amount outstanding, and invoice date. Flag any clients with invoices over 60 days as a priority for follow-up.`,
  },

  // ── Sales & Growth ────────────────────────────────────────────────

  {
    id: 'sales-device-refresh',
    role: 'sales',
    title: 'Device Refresh Opportunity Report',
    description: 'Find devices 4+ years old across clients — a natural hardware refresh conversation.',
    plugins: ['ninjaone', 'atera', 'datto', 'kaseya'],
    mcpServers: ['ninjaone', 'atera', 'datto-rmm', 'connectwise-automate'],
    prompt: `Scan all managed devices and identify machines that are 4 or more years old and likely due for hardware refresh.

Group results by client. For each device include:
- Device name and type (desktop, laptop, server)
- Operating system and version
- Approximate age if visible (from warranty or first-seen date)
- Any recent hardware-related alerts or failures

Summarize by client: total aging devices and estimated replacement opportunity. This will be used to prioritize refresh conversations.`,
  },

  {
    id: 'sales-at-risk-clients',
    role: 'sales',
    title: 'At-Risk Client Identification',
    description: 'Identify clients with high ticket volume, recurring issues, or SLA breaches — retention risk.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Identify clients who may be at risk of churn based on their recent service experience.

Look for clients with:
- High ticket volume compared to their account size in the last 60 days
- 2 or more SLA breaches in the past 30 days
- Recurring issues of the same type (possible systemic problem we're not resolving)
- Tickets with negative or escalation indicators in the description

Rank the top 5-10 at-risk clients with a brief reason for each. This list will be used for proactive account check-ins.`,
  },

  {
    id: 'sales-upsell-opportunities',
    role: 'sales',
    title: 'Upsell & Expansion Opportunities',
    description: 'Find clients using fewer services than they could benefit from based on their profile.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'ninjaone', 'atera'],
    prompt: `Look across our client base and identify expansion or upsell opportunities.

Flag clients who:
- Have grown their device count significantly in the past 6 months (potential seat expansion)
- Have frequent security-related tickets but no security add-on services (EDR, backup, etc.)
- Are consistently exceeding their included hours but haven't upgraded their contract
- Have aging infrastructure that we haven't had a hardware refresh conversation with

For each opportunity, briefly explain the gap and suggest the relevant service or conversation.`,
  },

  {
    id: 'sales-new-client-intel',
    role: 'sales',
    title: 'New Client Onboarding Intelligence',
    description: 'Pull a complete picture of a newly onboarded client\'s environment.',
    plugins: [],
    mcpServers: ['ninjaone', 'atera', 'datto-rmm', 'connectwise-automate', 'itglue', 'hudu'],
    prompt: `We've just onboarded [CLIENT NAME]. Give me a full picture of their environment based on what we've discovered so far.

Cover:
- Total device count and types (workstations, servers, network gear)
- Operating systems in use and any that are end-of-life
- Any immediate risks or issues flagged during onboarding
- Current monitoring coverage (what's being monitored vs what we found)
- Gaps compared to our standard managed services baseline

This will be used to prioritize the first 30 days of work and identify quick wins.`,
  },

  // ── Support & Helpdesk ────────────────────────────────────────────

  {
    id: 'support-morning-standup',
    role: 'support',
    title: 'Morning Ticket Standup',
    description: 'Daily open ticket review to start the team\'s day.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'superops', 'syncro'],
    prompt: `Give me a morning standup summary of all open tickets for today.

Group by:
1. Critical and High priority — list each with ticket number, client, summary, and assigned tech
2. Tickets breaching SLA within the next 4 hours
3. Tickets unassigned or with no update in the last 24 hours
4. Total open count by priority tier

Keep it brief — this is for a 10-minute team standup.`,
  },

  {
    id: 'support-sla-risk',
    role: 'support',
    title: 'SLA Breach Risk Report',
    description: 'Identify tickets approaching or past SLA so the team can intervene.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Show me all tickets that are at risk of breaching or have already breached their SLA.

Separate into:
- Already breached: ticket number, client, priority, how overdue
- Breaching in the next 2 hours
- Breaching in the next 4 hours

Include the assigned technician for each. Sort by most urgent first. I need this to prioritize the team's next hour.`,
  },

  {
    id: 'support-escalation-review',
    role: 'support',
    title: 'Escalation & Stale Ticket Review',
    description: 'Find tickets stuck in queues too long or waiting on responses.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage', 'superops', 'syncro'],
    prompt: `Find all tickets that are stalled and may need escalation or a nudge.

Look for:
- Open tickets with no technician update in the last 48 hours
- Tickets waiting on client response for more than 5 business days
- Any ticket open for more than 14 days regardless of status
- Escalated tickets that haven't had a senior tech review documented

For each, show ticket number, client, summary, last activity date, and current assignee.`,
  },

  {
    id: 'support-shift-handoff',
    role: 'support',
    title: 'Shift Handoff Brief',
    description: 'End-of-shift summary of open work for the incoming team or on-call engineer.',
    plugins: ['pagerduty', 'betterstack'],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Prepare a shift handoff brief for the incoming team covering everything they need to know right now.

Include:
- All active or acknowledged incidents and their current status
- High and critical priority tickets opened in the last 8 hours
- Any tickets I've been actively working — include where I left off and next steps
- Anything scheduled or expected to fire in the next 4 hours (maintenance windows, monitoring alerts)
- Any client communications that need a follow-up response

Format as a structured handoff document, not a data dump.`,
  },

  {
    id: 'support-client-ticket-history',
    role: 'support',
    title: 'Pre-Call Client Brief',
    description: 'Quick prep brief before calling or meeting with a client.',
    plugins: [],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `I have a call with [CLIENT NAME] in 10 minutes. Give me a quick brief.

Cover:
- Their currently open tickets: count and any critical or high priority ones
- Most recent 3-5 closed tickets and what they were about
- Any patterns or recurring issues I should be aware of
- Any open items they've been waiting on us for
- Anyone at their company I should know about from recent ticket interactions

Keep it to 200 words max — I need this fast.`,
  },

  // ── NOC & Engineering ─────────────────────────────────────────────

  {
    id: 'noc-infrastructure-health',
    role: 'noc',
    title: 'Infrastructure Health Report',
    description: 'Full status sweep of all monitored devices and services.',
    plugins: ['ninjaone', 'atera', 'datto', 'betterstack'],
    mcpServers: ['ninjaone', 'atera', 'datto-rmm', 'connectwise-automate'],
    prompt: `Give me a full infrastructure health report across all monitored clients.

Group by status:
- Down / offline: list device name, client, type, and how long it's been down
- Degraded / warning: devices with active alerts but still responding
- Unknown / no check-in: devices that haven't reported in over 24 hours
- Healthy: summary count only

For any client with 3 or more devices in warning or down state, flag them as needing immediate attention. Total counts at the top.`,
  },

  {
    id: 'noc-patch-status',
    role: 'noc',
    title: 'Patch Compliance Report',
    description: 'Identify devices missing critical security patches across all clients.',
    plugins: ['ninjaone', 'atera', 'datto', 'kaseya'],
    mcpServers: ['ninjaone', 'atera', 'datto-rmm', 'connectwise-automate'],
    prompt: `Generate a patch compliance report across all managed devices.

Show:
- Devices missing critical or security patches (OS and third-party)
- Count of missing patches per device
- Clients with the worst patch compliance (most missing patches)
- Any devices that haven't had a successful patch scan in the last 7 days

Flag any device missing patches that is also exposed to the internet (server or firewall) as high priority. I need this to prioritize this week's patching run.`,
  },

  {
    id: 'noc-alert-correlation',
    role: 'noc',
    title: 'Alert Correlation & Root Cause',
    description: 'When multiple alerts fire at once, group them by likely cause.',
    plugins: ['ninjaone', 'atera', 'datto', 'pagerduty', 'betterstack'],
    mcpServers: ['ninjaone', 'atera', 'datto-rmm', 'connectwise-automate'],
    prompt: `We have multiple alerts firing right now. Help me make sense of them.

List all active alerts and incidents, then:
1. Group alerts that are likely related (same client, same time window, same infrastructure layer)
2. Identify the most likely root cause for each group
3. Suggest which alert to investigate first to have the most impact
4. Flag any alerts that look like noise vs genuine service impact

I'm trying to find the actual problem, not chase symptoms.`,
  },

  {
    id: 'noc-maintenance-prep',
    role: 'noc',
    title: 'Maintenance Window Preparation',
    description: 'Checklist of monitors to pause and on-call to notify before planned work.',
    plugins: ['betterstack', 'pagerduty'],
    mcpServers: [],
    prompt: `I'm planning a maintenance window for [DESCRIPTION, e.g. firewall firmware upgrade] at [CLIENT NAME] on [DATE/TIME].

Help me prepare by:
1. Listing all monitors currently associated with systems that will be affected
2. Identifying the on-call engineer on duty during the window
3. Drafting a status page announcement to notify stakeholders (if applicable)
4. Noting any tickets or incidents that are currently open for this client that might be affected

After the window, remind me to: resume all paused monitors, verify everything returns to 'up', and resolve any stale incidents.`,
  },

  {
    id: 'noc-incident-postmortem',
    role: 'noc',
    title: 'Incident Post-Mortem Summary',
    description: 'Structure a post-mortem for a resolved incident with timeline and action items.',
    plugins: ['pagerduty', 'betterstack', 'rootly'],
    mcpServers: ['autotask', 'halopsa', 'connectwise-manage'],
    prompt: `Help me write a post-mortem for the incident affecting [SERVICE/CLIENT] that occurred on [DATE].

Structure it as:
1. **Summary**: What happened and what was the business impact (1 paragraph)
2. **Timeline**: Key events from first alert to resolution with timestamps
3. **Root Cause**: What actually caused the incident
4. **Contributing Factors**: What made it worse or delayed detection/resolution
5. **What Went Well**: Things that worked during the response
6. **Action Items**: Specific, assigned tasks to prevent recurrence (include owner and due date)

Keep the tone blameless — we're fixing systems, not blaming people.`,
  },

  // ── Email Security ────────────────────────────────────────────────

  {
    id: 'noc-email-threat-briefing',
    role: 'noc',
    title: 'Daily Email Threat Briefing',
    description: 'Morning summary of email threats, blocked attacks, and phishing incidents across all clients.',
    plugins: ['proofpoint', 'avanan', 'abnormal', 'mimecast'],
    mcpServers: ['proofpoint', 'avanan', 'abnormal', 'mimecast'],
    prompt: `Give me a morning email threat briefing covering the last 24 hours across all clients.

Include:
- Total blocked threats by type (phishing, malware, BEC, spam) with counts
- Any threats that were delivered to users (not blocked) — these are highest priority
- New or active campaigns targeting our clients
- Any users who clicked a malicious URL or opened a dangerous attachment
- Clients with unusually high threat volume compared to their baseline

Flag anything that requires immediate action (delivered threats, active BEC attempts, credential phishing). Keep the rest as a summary table.`,
  },

  {
    id: 'noc-phishing-investigation',
    role: 'noc',
    title: 'Phishing Incident Investigation',
    description: 'Investigate a reported phishing email — trace delivery, identify recipients, and assess impact.',
    plugins: ['proofpoint', 'avanan', 'abnormal', 'ironscales', 'knowbe4'],
    mcpServers: ['proofpoint', 'avanan', 'abnormal', 'ironscales', 'knowbe4'],
    prompt: `I need to investigate a phishing email reported by [USER] at [CLIENT NAME].

Known details: [paste subject line, sender, or any other details you have]

Help me:
1. Find the original email and its full headers / metadata
2. Identify all other recipients at this client or across clients who received the same or similar email
3. Check whether any recipients clicked links or opened attachments
4. Determine if any credentials or data may have been compromised
5. Identify the campaign or threat actor if known
6. List every mailbox that still has a copy of the email (for remediation)

End with a recommended remediation: quarantine scope, user notifications needed, and any account lockouts to consider.`,
  },

  {
    id: 'noc-email-quarantine-review',
    role: 'noc',
    title: 'Quarantine Review',
    description: 'Review held and quarantined emails across clients — identify false positives and genuine threats.',
    plugins: ['spamtitan', 'mimecast', 'avanan'],
    mcpServers: ['spamtitan', 'mimecast', 'avanan'],
    prompt: `Review the current email quarantine queue across all clients.

I need to:
1. See all messages held in quarantine in the last 24 hours, grouped by client
2. Identify any that look like false positives (legitimate business email, newsletters the user opted into, known vendors)
3. Confirm which messages are genuine threats that should remain quarantined or be deleted
4. Flag any quarantine entries that have been waiting more than 48 hours without review (user may be waiting on an important email)

For likely false positives, tell me what action to take (release and allowlist sender/domain). For confirmed threats, confirm deletion. Highlight any patterns that suggest an allowlist or blocklist rule update is needed.`,
  },

  {
    id: 'noc-security-awareness-status',
    role: 'noc',
    title: 'Security Awareness Training Status',
    description: 'Review phishing simulation results and training completion rates across clients.',
    plugins: ['knowbe4'],
    mcpServers: ['knowbe4'],
    prompt: `Give me a security awareness training status report across all clients.

Cover:
- Active phishing simulation campaigns: click rates and failure rates per client
- Training completion rates — who is overdue or has outstanding assignments
- Highest-risk users by risk score (frequent clickers, incomplete training)
- Clients with click rates above 10% — these need attention
- Improvement trends: are clients getting better or worse over time?

Flag the top 5 highest-risk users overall so we can have a conversation with their client's IT contact. Include a recommendation for clients with persistently high failure rates (more frequent simulations, mandatory retraining, etc.).`,
  },

  {
    id: 'support-phishing-report-response',
    role: 'support',
    title: 'End User Phishing Report Handler',
    description: 'Triage a user-reported phishing email — assess risk, scope the blast radius, and advise the user.',
    plugins: ['ironscales', 'knowbe4', 'abnormal', 'proofpoint'],
    mcpServers: ['ironscales', 'knowbe4', 'abnormal', 'proofpoint'],
    prompt: `A user at [CLIENT NAME] has reported a suspicious email. I need to triage it quickly.

User report: [paste the user's description or forwarded email headers]

Steps I need help with:
1. Look up the reported message in our email security platform — is it already classified?
2. Check if other users at this client (or other clients) received the same email
3. Classify it: genuine phishing / spam / safe (false positive)
4. If it's a genuine threat: has anyone clicked or interacted with it?
5. Draft a brief response to the reporting user explaining what we found and what they should do

If the email is confirmed phishing and others received it, automatically suggest escalating to the phishing investigation workflow.`,
  },

  {
    id: 'support-quarantine-release-request',
    role: 'support',
    title: 'Quarantine Release Request',
    description: 'Process a user request to release a quarantined email — verify it\'s safe before releasing.',
    plugins: ['spamtitan', 'mimecast', 'avanan'],
    mcpServers: ['spamtitan', 'mimecast', 'avanan'],
    prompt: `A user at [CLIENT NAME] has requested release of a quarantined email.

User details: [sender address, subject, approximate date received]

Before releasing, help me:
1. Find the quarantined message
2. Review the sender, subject, headers, and any link/attachment analysis
3. Assess whether it's genuinely safe to release (expected sender, legitimate content, no suspicious links)
4. Check if the sender domain has a history of spam or phishing in our system

If safe: release the message and recommend whether to add the sender to the allowlist.
If not safe: explain why to the user and suggest they contact the sender through a different channel to re-send.

Always err on the side of caution — if there's any doubt, don't release.`,
  },

  {
    id: 'account-email-security-posture',
    role: 'account',
    title: 'Email Security Posture for QBR',
    description: 'Client-facing email security summary — threats blocked, user risk, and training progress.',
    plugins: ['proofpoint', 'avanan', 'abnormal', 'mimecast', 'knowbe4'],
    mcpServers: ['proofpoint', 'avanan', 'abnormal', 'mimecast', 'knowbe4'],
    prompt: `Prepare an email security posture summary for [CLIENT NAME] to use in our upcoming QBR.

The audience is their leadership team — keep it business-focused, not technical.

Cover:
- Total threats blocked in the past quarter (phishing, malware, BEC, spam) and what that would have meant if unprotected
- Any threats that got through — how they were detected and resolved
- User risk: what percentage of users are clicking phishing simulations, how has it improved?
- Training completion rate — is the team keeping up with security awareness training?
- Top 3 threat types targeting their organization this quarter
- Any recommended improvements or upcoming threats to be aware of

Frame it as value delivered: "we blocked X attacks this quarter that could have cost you Y." Keep the language accessible for non-technical executives.`,
  },

];

export function getPromptsByRole(role: PromptRole): Prompt[] {
  return prompts.filter(p => p.role === role);
}

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find(p => p.id === id);
}
