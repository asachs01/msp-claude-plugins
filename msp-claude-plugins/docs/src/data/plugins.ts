// Auto-generated — do not edit manually. Run `npm run generate` to update.

export interface Plugin {
  id: string;
  name: string;
  vendor: string;
  description: string;
  category: 'accounting' | 'crm' | 'documentation' | 'email-security' | 'incident-management' | 'marketplace' | 'monitoring' | 'network' | 'productivity' | 'psa' | 'rmm' | 'sales' | 'security';
  maturity: 'production' | 'beta' | 'alpha';
  features: string[];
  skills: Skill[];
  agents: Agent[];
  commands: Command[];
  apiInfo: ApiInfo;
  path: string;
  mcpRepo?: string;
  compatibility: {
    claudeCode: boolean;
    claudeDesktop: boolean | 'coming-soon';
    validated: boolean;
  };
}

export interface Skill {
  name: string;
  description: string;
}

export interface Agent {
  name: string;
  description: string;
}

export interface Command {
  name: string;
  description: string;
}

export interface ApiInfo {
  baseUrl: string;
  auth: string;
  rateLimit: string;
  docsUrl: string;
}

export const plugins: Plugin[] = [
  {
    id: 'abnormal-security',
    name: 'Abnormal Security',
    vendor: 'Abnormal',
    description: 'Abnormal Security - AI-powered email security, phishing detection, account takeover prevention',
    category: 'email-security',
    maturity: 'production',
    features: [
      'Account Takeover',
      'Cases',
      'Messages',
      'Threats',
      'Vendors'
    ],
    skills: [
      { name: 'account-takeover', description: 'Use this skill when working with Abnormal Security account takeover (ATO) detection - suspicious sign-ins, impossible travel, compromised accounts, mailbox rule changes, and lateral movement indicators.' },
      { name: 'cases', description: 'Use this skill when working with Abnormal Security abuse mailbox cases - user-reported emails, case triage, remediation actions, case lifecycle, and phishing simulation management.' },
      { name: 'messages', description: 'Use this skill when working with Abnormal Security message analysis - email headers, attachments, sender reputation, delivery context, authentication results (SPF/DKIM/DMARC), and message metadata.' },
      { name: 'threats', description: 'Use this skill when working with Abnormal Security threat detection and analysis - BEC, phishing, malware, socially-engineered attacks, spam, graymail, and credential theft.' },
      { name: 'vendors', description: 'Use this skill when working with Abnormal Security VendorBase vendor risk assessment - vendor risk scores, compromised vendor detection, vendor domain analysis, and supply chain email threat monitoring.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Abnormal Security REST API - Bearer token authentication, base URLs, rate limiting, pagination, OData filtering, error handling, and common API patterns.' }
    ],
    agents: [],
    commands: [
      { name: '/account-audit', description: 'Audit for account takeover indicators and suspicious sign-ins in Abnormal Security' },
      { name: '/case-review', description: 'Review and triage abuse mailbox cases in Abnormal Security' },
      { name: '/search-threats', description: 'Search for specific threat patterns in Abnormal Security by sender, recipient, attack type, or keywords' },
      { name: '/threat-triage', description: 'Triage recent email threats detected by Abnormal Security by severity and attack type' },
      { name: '/vendor-risk', description: 'Check vendor risk scores and compromised vendor activity in Abnormal Security VendorBase' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'abnormal/abnormal-security',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'atera',
    name: 'Atera',
    vendor: 'Atera',
    description: 'Atera - tickets, agents, customers, alerts, SNMP/HTTP monitors',
    category: 'psa',
    maturity: 'production',
    features: [
      'Agent Monitoring',
      'Alert Handling',
      'Customer Operations',
      'Device Management',
      'Ticket Management'
    ],
    skills: [
      { name: 'agents', description: 'Use this skill when working with Atera RMM agents - listing, searching, monitoring, or executing commands on managed devices.' },
      { name: 'alerts', description: 'Use this skill when working with Atera alerts - viewing, acknowledging, resolving, or managing alerts from monitored devices.' },
      { name: 'customers', description: 'Use this skill when working with Atera customers and contacts - creating, updating, searching, or managing customer records.' },
      { name: 'devices', description: 'Use this skill when working with Atera device monitors - HTTP, SNMP, and TCP monitors for network devices, services, and applications.' },
      { name: 'tickets', description: 'Use this skill when working with Atera tickets - creating, updating, searching, or managing service desk operations.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Atera REST API - authentication, pagination, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'customer-health-scorer', description: 'Use this agent when an MSP account manager, service manager, or owner needs to score and rank client health across the Atera portfolio — not live operations management, but a structured assessment of each client based on device health trends, ticket velocity, recurring issues, patch compliance, and alert frequency.' },
      { name: 'msp-ops-assistant', description: 'Use this agent when an MSP needs combined RMM and PSA operations assistance through Atera — triaging alerts, managing the ticket queue, checking device health, and identifying patterns across the client base.' }
    ],
    commands: [
      { name: '/create-monitor', description: 'Create a threshold-based monitor for an Atera agent' },
      { name: '/create-ticket', description: 'Create a new service ticket in Atera' },
      { name: '/get-kb-articles', description: 'Search the Atera knowledge base for articles' },
      { name: '/list-alerts', description: 'List active RMM alerts from Atera' },
      { name: '/log-time', description: 'Log work hours on an Atera ticket' },
      { name: '/resolve-alert', description: 'Resolve an RMM alert in Atera' },
      { name: '/run-powershell', description: 'Execute a PowerShell script on an Atera agent' },
      { name: '/search-agents', description: 'Search for RMM agents in Atera by customer or machine name' },
      { name: '/search-customers', description: 'Search for Atera customers by name or criteria' },
      { name: '/update-ticket', description: 'Update fields on an existing Atera ticket' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'atera/atera',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'autotask',
    name: 'Autotask PSA',
    vendor: 'Kaseya',
    description: 'Kaseya Autotask PSA - tickets, CRM, projects, contracts, billing',
    category: 'psa',
    maturity: 'production',
    features: [
      'Billing',
      'Configuration Items',
      'Contract Management',
      'CRM Operations',
      'Expense Management',
      'Picklists',
      'Product Catalog',
      'Project Management',
      'Quote Generation',
      'Service Calls',
      'Ticket Notes Attachments',
      'Ticket Management',
      'Time Entry Tracking'
    ],
    skills: [
      { name: 'billing', description: 'Use this skill when working with Autotask billing — retrieving billing items, checking approval levels, and searching invoices.' },
      { name: 'configuration-items', description: 'Use this skill when working with Autotask Configuration Items (CIs) - asset management, inventory tracking, warranty monitoring, lifecycle management, and relationship mapping.' },
      { name: 'contracts', description: 'Use this skill when working with Autotask contracts and service agreements - recurring services, block hours, time & materials, and contract billing.' },
      { name: 'crm', description: 'Use this skill when working with Autotask CRM - companies, contacts, sites/locations, and opportunities.' },
      { name: 'expenses', description: 'Use this skill when working with Autotask expense reports and expense items - creating expense reports, adding line items, searching reports by status or submitter, tracking reimbursable vs billable expenses, and managing expense approval workflows.' },
      { name: 'picklists', description: 'Use this skill when working with Autotask picklist and reference data — listing queues, ticket statuses, ticket priorities, and phases.' },
      { name: 'product-catalog', description: 'Use this skill when working with Autotask product catalog operations - searching products, checking pricing, managing inventory, and understanding the relationship between products, services, bundles, and price lists.' },
      { name: 'projects', description: 'Use this skill when working with Autotask projects - creating projects, managing tasks, phases, milestones, and resource assignments.' },
      { name: 'quotes', description: 'Use this skill when working with Autotask quotes and quote line items - creating quotes for customers, adding products/services/bundles as line items, managing pricing and discounts, linking quotes to opportunities, and building proposals.' },
      { name: 'service-calls', description: 'Use this skill when working with Autotask Service Calls - creating, scheduling, updating, or completing service calls linked to tickets.' },
      { name: 'ticket-notes-attachments', description: 'Use this skill when working with Autotask ticket notes, ticket attachments, and ticket charges — retrieving individual notes, downloading attachments, managing labor charges on tickets.' },
      { name: 'tickets', description: 'Use this skill when working with Autotask tickets - creating, updating, searching, or managing service desk operations.' },
      { name: 'time-entries', description: 'Use this skill when working with Autotask time entries - logging work hours, billing calculations, approval workflows, utilization tracking, and budget validation.' },
      { name: 'tool-discovery', description: 'Use this skill when Autotask MCP tools aren\'t loading, when you can\'t find the right Autotask tool to call, or when working with a lazy-loaded MCP connection where only meta-tools are available.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Autotask REST API - authentication, query building, pagination, includes, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'contract-renewal-tracker', description: 'Use this agent when an MSP account manager, service manager, or operations lead needs to track and manage contract renewals in Autotask PSA — surfacing expiring contracts, identifying auto-renewal gaps, tracking MRR/ARR trends, and flagging clients who are still receiving service on expired contracts.' },
      { name: 'ticket-dispatcher', description: 'Use this agent when an MSP dispatcher or service manager needs to intelligently manage the Autotask PSA ticket queue — reviewing priorities, suggesting technician assignments, monitoring SLA compliance, and driving dispatch decisions.' }
    ],
    commands: [
      { name: '/add-note', description: 'Add a note or comment to an existing Autotask ticket' },
      { name: '/check-contract', description: 'View contract status, entitlements, and remaining hours for a company or specific contract' },
      { name: '/check-pricing', description: 'Check pricing details for an Autotask product or service from price lists' },
      { name: '/create-quote', description: 'Create a new Autotask quote with line items for products, services, and service bundles' },
      { name: '/create-ticket', description: 'Create a new service ticket in Autotask PSA' },
      { name: '/expenses', description: 'Use this skill when working with Autotask expense reports - creating reports, adding expense items, searching by status or submitter, and tracking reimbursable and billable expenses' },
      { name: '/lookup-asset', description: 'Search for Autotask configuration items/assets by name, serial number, or company' },
      { name: '/lookup-company', description: 'Search for Autotask companies by name, ID, or other attributes' },
      { name: '/lookup-contact', description: 'Search for Autotask contacts by name, email, phone, or company' },
      { name: '/my-tickets', description: 'List tickets currently assigned to you with optional filtering' },
      { name: '/reassign-ticket', description: 'Reassign a ticket to a different resource or queue' },
      { name: '/search-products', description: 'Search the Autotask product catalog for products, services, or inventory items' },
      { name: '/search-tickets', description: 'Search for tickets in Autotask PSA by various criteria' },
      { name: '/time-entry', description: 'Log time against tickets or projects in Autotask PSA' },
      { name: '/update-ticket', description: 'Update fields on an existing Autotask ticket (status, priority, queue, due date)' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'kaseya/autotask',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'betterstack',
    name: 'BetterStack',
    vendor: 'BetterStack',
    description: 'Better Stack - uptime monitoring, logging, incident management',
    category: 'monitoring',
    maturity: 'production',
    features: [
      'Incident Management',
      'Logging',
      'Monitor Configuration',
      'On-Call Scheduling',
      'Status Pages'
    ],
    skills: [
      { name: 'incidents', description: 'Use this skill when working with Better Stack incidents -- listing, triaging, acknowledging, and resolving incidents triggered by uptime monitors or manual reports.' },
      { name: 'logging', description: 'Use this skill when working with Better Stack log management (Logtail) -- querying logs, managing log sources, structured log search, log-based alerting, and log analysis workflows.' },
      { name: 'monitors', description: 'Use this skill when working with Better Stack uptime monitors -- listing, creating, updating, pausing, and deleting monitors, heartbeat monitors, monitor groups, and check types.' },
      { name: 'oncall', description: 'Use this skill when working with Better Stack on-call schedules -- on-call calendars, escalation/notification policies, rotation management, understanding who is currently on-call, and responding to active incidents via the on-call flow.' },
      { name: 'status-pages', description: 'Use this skill when working with Better Stack status pages -- managing status pages, adding resources/components, posting maintenance windows, and communicating service status to end users.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Better Stack MCP tools -- available tools, authentication via Bearer token, API structure, cursor-based pagination, rate limiting, error handling, and best practices.' }
    ],
    agents: [
      { name: 'sla-uptime-reporter', description: 'Use this agent when an MSP needs to generate SLA-focused uptime reports for clients, calculate SLA achievement percentages, identify chronic underperforming monitors, or produce client-facing availability summaries.' },
      { name: 'uptime-incident-responder', description: 'Use this agent when an MSP needs to respond to a BetterStack uptime incident, investigate monitor failures, coordinate on-call response, or produce an incident report.' }
    ],
    commands: [
      { name: '/create-monitor', description: 'Create a new Better Stack uptime monitor' },
      { name: '/incident-triage', description: 'Triage current Better Stack incidents' },
      { name: '/monitor-status', description: 'Check all Better Stack monitor statuses and identify downtime' },
      { name: '/search-logs', description: 'Search logs via Better Stack Logtail' },
      { name: '/status-page-update', description: 'Update a Better Stack status page with current status or maintenance' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'betterstack/betterstack',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'blumira',
    name: 'Blumira',
    vendor: 'Blumira',
    description: 'Blumira - SIEM findings management, device inventory, MSP multi-tenant operations, and security posture analysis',
    category: 'security',
    maturity: 'production',
    features: [
      'Agent Monitoring',
      'Findings',
      'Msp',
      'Resolutions',
      'User Management'
    ],
    skills: [
      { name: 'agents', description: 'Use this skill when working with Blumira agents, devices, and agent keys, including listing devices, checking agent health, and managing agent deployment keys.' },
      { name: 'findings', description: 'Use this skill when working with Blumira findings (security alerts/detections), including listing, filtering, investigating, resolving, assigning, and commenting on findings.' },
      { name: 'msp', description: 'Use this skill when working with Blumira MSP (Managed Service Provider) multi-tenant operations, including managing multiple client accounts, cross-account finding queries, and per-account device/user management.' },
      { name: 'resolutions', description: 'Use this skill when resolving Blumira findings, choosing the correct resolution type, or understanding resolution workflows and their impact on security metrics.' },
      { name: 'users', description: 'Use this skill when listing or looking up Blumira users, finding user IDs for finding assignment, or auditing user access.' },
      { name: 'api-patterns', description: 'Use this skill when working with Blumira API authentication, understanding the dual path structure (org vs MSP), constructing filtered queries, handling pagination, or troubleshooting API errors.' }
    ],
    agents: [
      { name: 'compliance-reporter', description: 'Use this agent when generating compliance-oriented security reports from Blumira SIEM data — not for live incident investigation, but for producing evidence packages, coverage gap assessments, and log source health summaries for frameworks like SOC 2, HIPAA, and CIS.' },
      { name: 'siem-investigator', description: 'Use this agent when investigating Blumira SIEM alerts and findings, tracing attack chains across data sources, resolving detections, auditing security posture across MSP client accounts, or producing threat investigation reports.' }
    ],
    commands: [
      { name: '/agent-inventory', description: 'List all devices and agents across the organization with status and health information' },
      { name: '/finding-triage', description: 'Triage open Blumira findings by severity, presenting a prioritized list for review' },
      { name: '/investigate-finding', description: 'Deep investigation of a specific Blumira finding with details, context, and comment history' },
      { name: '/msp-overview', description: 'MSP dashboard showing all managed accounts with open finding counts and severity breakdown' },
      { name: '/resolve-finding', description: 'Resolve a Blumira finding with the appropriate resolution type and notes' },
      { name: '/security-posture', description: 'Overall security posture review including open findings by severity, agent coverage, and trends' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'blumira/blumira',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'checkpoint-avanan',
    name: 'Checkpoint Avanan',
    vendor: 'Email Security',
    description: 'Checkpoint Harmony Email & Collaboration (Avanan) - quarantine, threats, policies, incidents, Smart Banners',
    category: 'email-security',
    maturity: 'production',
    features: [
      'Incident Management',
      'Policies',
      'Quarantine',
      'Threats'
    ],
    skills: [
      { name: 'incidents', description: 'Use this skill when working with Checkpoint Harmony Email security incidents - incident lifecycle, status transitions, investigation workflows, notes and evidence collection, remediation tracking.' },
      { name: 'policies', description: 'Use this skill when working with Checkpoint Harmony Email security policies - DLP policies, anti-phishing rules, anti-malware settings, quarantine policies, allow/block lists, and policy configuration.' },
      { name: 'quarantine', description: 'Use this skill when working with Checkpoint Harmony Email quarantine - listing, searching, releasing, deleting quarantined emails.' },
      { name: 'threats', description: 'Use this skill when working with Checkpoint Harmony Email threat detection and analysis - phishing, malware, BEC, account takeover, IOC extraction, threat timelines, and severity assessment.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Checkpoint Harmony Email API - OAuth2 client credentials authentication, base URLs, rate limiting, pagination, error handling, and common API patterns.' }
    ],
    agents: [],
    commands: [
      { name: '/check-threat', description: 'Get detailed threat analysis including IOCs and timeline from Checkpoint Harmony Email' },
      { name: '/manage-policy', description: 'View or toggle email security policies in Checkpoint Harmony Email' },
      { name: '/release-quarantine', description: 'Release quarantined email(s) back to recipients in Checkpoint Harmony Email' },
      { name: '/search-quarantine', description: 'Search quarantined emails in Checkpoint Harmony Email by various criteria' },
      { name: '/search-threats', description: 'Search detected threats in Checkpoint Harmony Email by type, severity, and date range' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'email-security/checkpoint-avanan',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'cipp',
    name: 'CIPP',
    vendor: 'CIPP',
    description: 'CIPP (CyberDrain Improved Partner Portal) - Microsoft 365 multi-tenant management for MSPs: tenants, users, mailboxes, conditional access, standards, BPA, licensing, GDAP, and alerts',
    category: 'security',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Groups',
      'Licenses',
      'Mailbox & Email',
      'Ops',
      'Security Posture',
      'Standards',
      'Tenants',
      'User Management'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with CIPP alerts and audit logs — reviewing the queued alert backlog across tenants, investigating sign-in or admin activity in audit logs, correlating alerts with tenants.' },
      { name: 'groups', description: 'Use this skill when listing or creating M365 groups in CIPP — security groups, distribution lists, M365 groups, mail-enabled security groups.' },
      { name: 'licenses', description: 'Use this skill when working with M365 license assignments and CSP license inventory through CIPP — listing license usage per tenant, identifying unused licenses, surfacing license SKUs available for assignment, and reviewing CSP-level license commitments.' },
      { name: 'mailboxes', description: 'Use this skill when working with Exchange Online mailboxes through CIPP — listing mailboxes, auditing mailbox permissions, configuring out-of-office auto-replies, and setting email forwarding.' },
      { name: 'ops', description: 'Use this skill when working with CIPP operational tooling — GDAP role and invite management, scheduled tasks, server health checks, version reporting, and CIPP application logs.' },
      { name: 'security', description: 'Use this skill when reviewing M365 conditional access policies and named locations through CIPP — auditing CA coverage, finding policies that exclude critical apps, listing trusted IP ranges, identifying tenants without baseline conditional access.' },
      { name: 'standards', description: 'Use this skill when working with CIPP Standards, Best Practice Analyser (BPA), and domain health checks — listing configured standards per tenant, triggering on-demand compliance checks, retrieving BPA results, checking SPF/DKIM/DMARC.' },
      { name: 'tenants', description: 'Use this skill when working with CIPP tenants — listing managed M365 tenants, checking tenant details, identifying tenant ID/domain, and scoping operations to a specific tenant.' },
      { name: 'users', description: 'Use this skill when working with CIPP-managed M365 users — creating accounts, editing properties, disabling, resetting passwords, resetting MFA, revoking sessions, full offboarding, BEC investigation, MFA status reporting, and listing user devices/groups.' }
    ],
    agents: [
      { name: 'security-posture-reviewer', description: 'Use this agent when an MSP security lead, vCISO, or service manager needs to sweep the M365 portfolio for security posture issues — Secure Score regressions, MFA enrollment gaps, conditional access drift, BPA failures, and broken domain authentication.' },
      { name: 'user-offboarding-runner', description: 'Use this agent when an MSP technician, dispatcher, or HR-facing operator needs to run a complete M365 user offboarding through CIPP.' }
    ],
    commands: [
      { name: '/offboard-user', description: 'Run the complete CIPP M365 offboarding workflow for a departing user — capture audit state, revoke access, handle mailbox, reclaim licenses' },
      { name: '/secure-score-report', description: 'Generate a portfolio-wide M365 security posture report — Secure Score equivalents, MFA enrollment, conditional access coverage, and domain authentication across all managed tenants' },
      { name: '/standards-drift', description: 'Find tenants that have drifted from the MSP\'s configured CIPP standards baseline — missing standards, standards in Report-only mode, recent compliance failures' },
      { name: '/tenant-health', description: 'Quick health snapshot for a single tenant — BPA failures, conditional access enforcement, MFA gaps, domain authentication, standards compliance' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'cipp/cipp',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'connectwise-automate',
    name: 'ConnectWise Automate',
    vendor: 'ConnectWise',
    description: 'ConnectWise Automate - computers, clients, scripts, monitors, alerts',
    category: 'rmm',
    maturity: 'beta',
    features: [
      'Alert Handling',
      'Client Operations',
      'Computer Management',
      'Monitor Configuration',
      'Script Execution'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with ConnectWise Automate alerts - listing active alerts, acknowledging alerts, viewing alert history, and creating tickets from alerts.' },
      { name: 'clients', description: 'Use this skill when working with ConnectWise Automate clients - creating, reading, updating, and deleting client organizations.' },
      { name: 'computers', description: 'Use this skill when working with ConnectWise Automate computers/endpoints - listing, searching, managing, and monitoring devices.' },
      { name: 'monitors', description: 'Use this skill when working with ConnectWise Automate monitors - configuring thresholds, creating templates, and assigning to computers.' },
      { name: 'scripts', description: 'Use this skill when working with ConnectWise Automate scripts - listing, executing, passing parameters, and retrieving results.' },
      { name: 'api-patterns', description: 'Use this skill when working with the ConnectWise Automate REST API - authentication methods, token management, pagination, filtering with OData syntax, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'automation-health-checker', description: 'Use this agent when an MSP technician or engineer needs to audit the health of their ConnectWise Automate RMM environment.' }
    ],
    commands: [
      { name: '/list-computers', description: 'List computers in ConnectWise Automate with optional filters' },
      { name: '/run-script', description: 'Execute a script on an endpoint in ConnectWise Automate' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'connectwise/automate',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'connectwise-psa',
    name: 'ConnectWise PSA',
    vendor: 'ConnectWise',
    description: 'ConnectWise PSA - tickets, companies, contacts, projects, time',
    category: 'psa',
    maturity: 'production',
    features: [
      'Company Management',
      'Contact Management',
      'Product Catalog',
      'Project Management',
      'Ticket Management',
      'Time Entry Tracking'
    ],
    skills: [
      { name: 'companies', description: 'Use this skill when working with ConnectWise PSA companies - creating, updating, searching, or managing company/account records.' },
      { name: 'contacts', description: 'Use this skill when working with ConnectWise PSA contacts - creating, updating, searching, or managing contact records.' },
      { name: 'product-catalog', description: 'Use this skill when working with the ConnectWise PSA product catalog — searching, creating, or updating catalog items (SKUs), managing categories, subcategories, manufacturers, or using catalog items on quotes, opportunities, agreements, and tickets.' },
      { name: 'projects', description: 'Use this skill when working with ConnectWise PSA projects - creating, updating, managing project phases, templates, and resource allocation.' },
      { name: 'tickets', description: 'Use this skill when working with ConnectWise PSA tickets - creating, updating, searching, or managing service desk operations.' },
      { name: 'time-entries', description: 'Use this skill when working with ConnectWise PSA time entries - creating, updating, searching, or managing time tracking.' },
      { name: 'api-patterns', description: 'Use this skill when working with the ConnectWise PSA REST API - authentication using public/private keys and clientId, pagination with page/pageSize, conditions query syntax, rate limiting (60/min), and error handling.' }
    ],
    agents: [
      { name: 'procurement-specialist', description: 'Use this agent when an MSP procurement lead, sales engineer, service manager, or owner needs to work against the ConnectWise Manage product catalog and the procurement/quoting workflows it feeds.' },
      { name: 'project-tracker', description: 'Use this agent when an MSP project manager, service manager, or operations lead needs a review of all open projects in ConnectWise Manage — checking milestone deadlines, budget vs. actuals, overdue phases, and projects at risk of scope creep or delivery failure.' },
      { name: 'service-desk-ops', description: 'Use this agent when an MSP dispatcher, service manager, or team lead needs to review the current state of the ConnectWise Manage service desk.' }
    ],
    commands: [
      { name: '/add-note', description: 'Add an internal or external note to a ConnectWise PSA ticket' },
      { name: '/check-agreement', description: 'View agreement status and entitlements for a company in ConnectWise PSA' },
      { name: '/close-ticket', description: 'Close a ConnectWise PSA ticket with resolution notes' },
      { name: '/create-ticket', description: 'Create a new service ticket in ConnectWise PSA' },
      { name: '/get-ticket', description: 'Retrieve detailed ticket information from ConnectWise PSA' },
      { name: '/log-time', description: 'Log a time entry against a ConnectWise PSA ticket' },
      { name: '/lookup-config', description: 'Search for configuration items (assets) in ConnectWise PSA' },
      { name: '/schedule-entry', description: 'Create a schedule entry/appointment in ConnectWise PSA' },
      { name: '/search-tickets', description: 'Search for tickets in ConnectWise PSA by various criteria' },
      { name: '/update-ticket', description: 'Update fields on an existing ConnectWise PSA ticket' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'connectwise/manage',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'datto-rmm',
    name: 'Datto RMM',
    vendor: 'Kaseya',
    description: 'Datto RMM - devices, alerts, jobs, patches, monitoring',
    category: 'rmm',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Audit Data',
      'Device Management',
      'Job Execution',
      'Site Management',
      'Variable Management'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with Datto RMM alerts - viewing, resolving, and managing monitoring alerts.' },
      { name: 'audit', description: 'Use this skill when working with Datto RMM audit data - hardware inventory, software inventory, network interfaces, and system information.' },
      { name: 'devices', description: 'Use this skill when working with Datto RMM devices - listing, searching, managing, and monitoring endpoints.' },
      { name: 'jobs', description: 'Use this skill when working with Datto RMM jobs - running quick jobs, scheduling jobs, monitoring job status, and viewing results.' },
      { name: 'sites', description: 'Use this skill when working with Datto RMM sites - listing, managing, and configuring client locations.' },
      { name: 'variables', description: 'Use this skill when working with Datto RMM variables - account-level and site-level variables for storing configuration data.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Datto RMM API - authentication, OAuth 2.0 flow, platform selection, pagination, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'backup-health-monitor', description: 'Use this agent when an MSP needs to audit backup and BC/DR health across their Datto RMM managed client portfolio — not a general fleet health check, but a focused review of backup job success rates, last successful backups per device, retention policy compliance, offsite replication status, and restore test records.' },
      { name: 'rmm-health-auditor', description: 'Use this agent when an MSP needs a comprehensive health audit of their Datto RMM managed device fleet.' }
    ],
    commands: [
      { name: '/device-lookup', description: 'Find a device in Datto RMM by hostname, IP address, or MAC address' },
      { name: '/resolve-alert', description: 'Resolve an open alert in Datto RMM' },
      { name: '/run-job', description: 'Run a quick job on a device in Datto RMM' },
      { name: '/site-devices', description: 'List all devices at a site in Datto RMM' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'kaseya/datto-rmm',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'domotz',
    name: 'Domotz',
    vendor: 'Domotz',
    description: 'Domotz - network monitoring, SNMP discovery, device management',
    category: 'network',
    maturity: 'production',
    features: [
      'Agent Monitoring',
      'Alert Handling',
      'Device Management',
      'Eyes',
      'Network'
    ],
    skills: [
      { name: 'agents', description: 'Use this skill when managing Domotz agents (collectors), sites, and network probes -- listing agents, checking agent health, viewing site details, and monitoring collector connectivity.' },
      { name: 'alerts', description: 'Use this skill when working with Domotz alerts -- viewing active alerts, configuring alert profiles, managing alert triggers, and handling notifications for device and network events.' },
      { name: 'devices', description: 'Use this skill when working with Domotz device inventory -- listing devices, searching by name/IP/MAC, checking device status, viewing device details, and understanding network topology.' },
      { name: 'eyes', description: 'Use this skill when working with Domotz Eyes -- TCP and HTTP sensors, custom monitoring checks, synthetic tests, latency tracking, and service availability monitoring.' },
      { name: 'network', description: 'Use this skill when working with Domotz network operations -- network scanning, SNMP polling, port monitoring, speed tests, and network topology discovery.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Domotz MCP tools -- available tools, authentication via API key, API structure, pagination, rate limiting, region selection, error handling, and best practices.' }
    ],
    agents: [],
    commands: [
      { name: '/alert-status', description: 'Check current Domotz alerts across all agents' },
      { name: '/device-inventory', description: 'List all devices at a Domotz-monitored site' },
      { name: '/device-lookup', description: 'Find a Domotz device by name, IP address, or MAC address' },
      { name: '/network-scan', description: 'Scan a network for devices via a Domotz agent' },
      { name: '/site-overview', description: 'Overview of a Domotz site\'s network health' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'domotz/domotz',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'halopsa',
    name: 'HaloPSA',
    vendor: 'Halo',
    description: 'HaloPSA - tickets, clients, assets, contracts (OAuth 2.0)',
    category: 'psa',
    maturity: 'production',
    features: [
      'Agent Monitoring',
      'Asset Management',
      'Client Operations',
      'Contract Management',
      'Invoice Management',
      'Ticket Management'
    ],
    skills: [
      { name: 'agents', description: 'Use this skill when working with HaloPSA agents (technicians) and teams — listing technicians, retrieving agent details, and listing team structures.' },
      { name: 'assets', description: 'Use this skill when working with HaloPSA assets - tracking devices, managing configuration items, hardware lifecycle, and asset relationships.' },
      { name: 'clients', description: 'Use this skill when working with HaloPSA clients - creating, updating, searching, or managing customer relationships.' },
      { name: 'contracts', description: 'Use this skill when working with HaloPSA contracts - managing service agreements, recurring billing, prepaid hours, and contract renewals.' },
      { name: 'invoices', description: 'Use this skill when working with HaloPSA invoices — listing invoices by client or date range, filtering by payment and send status, and retrieving individual invoice details.' },
      { name: 'tickets', description: 'Use this skill when working with HaloPSA tickets - creating, updating, searching, or managing service desk operations.' },
      { name: 'api-patterns', description: 'Use this skill when working with the HaloPSA REST API - OAuth 2.0 Client Credentials authentication, tenant-aware URLs, query building, pagination, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'service-desk-ops', description: 'Use this agent when an MSP dispatcher, team lead, or service manager needs to triage and manage the HaloPSA ticket queue.' },
      { name: 'sla-performance-reporter', description: 'Use this agent when an MSP service manager, operations lead, or account manager needs SLA compliance reporting and trend analysis in HaloPSA — not live ticket triage, but retrospective reporting on how well the team has met SLA commitments by client, by technician, and by ticket category.' }
    ],
    commands: [
      { name: '/add-action', description: 'Add an action (note, update, or response) to an existing HaloPSA ticket' },
      { name: '/contract-status', description: 'Check contract status, service entitlements, and billing information for a client' },
      { name: '/create-ticket', description: 'Create a new service ticket in HaloPSA' },
      { name: '/kb-search', description: 'Search the HaloPSA knowledge base for articles and solutions' },
      { name: '/search-assets', description: 'Search for configuration items/assets by name, serial number, type, or client' },
      { name: '/search-clients', description: 'Search for HaloPSA clients by name, domain, or other attributes' },
      { name: '/search-tickets', description: 'Search for tickets in HaloPSA by various criteria' },
      { name: '/show-ticket', description: 'Display comprehensive ticket information including history, actions, and related entities' },
      { name: '/sla-dashboard', description: 'View SLA status across tickets, including approaching breaches and at-risk tickets' },
      { name: '/update-ticket', description: 'Update fields on an existing HaloPSA ticket including status, priority, and assignment' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'halopsa/halopsa',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'hudu',
    name: 'Hudu',
    vendor: 'Hudu',
    description: 'Hudu IT documentation - companies, assets, articles, passwords, websites',
    category: 'documentation',
    maturity: 'production',
    features: [
      'Knowledge Base Articles',
      'Asset Management',
      'Company Management',
      'Password Management',
      'Website Monitoring'
    ],
    skills: [
      { name: 'articles', description: 'Use this skill when working with Hudu articles (knowledge base) - creating, searching, updating, and managing documentation articles.' },
      { name: 'assets', description: 'Use this skill when working with Hudu assets and asset layouts - servers, workstations, network devices, and other documented items.' },
      { name: 'companies', description: 'Use this skill when working with Hudu companies (clients/organizations) - creating, searching, updating, archiving, and managing client documentation.' },
      { name: 'passwords', description: 'Use this skill when working with Hudu passwords (asset passwords) - secure credential storage, retrieval, folders, and access patterns.' },
      { name: 'websites', description: 'Use this skill when working with Hudu website records - website monitoring, SSL/TLS tracking, email security (DMARC, DKIM, SPF), DNS records, and linking websites to companies.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Hudu API - authentication, REST structure, filtering, pagination, rate limiting, error handling, and best practices.' }
    ],
    agents: [
      { name: 'documentation-auditor', description: 'Use this agent when an MSP technician or vCIO needs to find and fix documentation debt in Hudu.' },
      { name: 'runbook-freshness-auditor', description: 'Use this agent when an MSP needs to audit the currency and coverage of runbooks and SOPs in Hudu.' }
    ],
    commands: [
      { name: '/find-company', description: 'Find a company in Hudu by name' },
      { name: '/get-password', description: 'Retrieve a password from Hudu (with security logging)' },
      { name: '/lookup-asset', description: 'Find an asset in Hudu by name, hostname, serial number, or IP address' },
      { name: '/search-articles', description: 'Search Hudu knowledge base articles by keyword or phrase' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'hudu/hudu',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'huntress',
    name: 'Huntress',
    vendor: 'Huntress',
    description: 'Huntress - managed threat detection, incident response, endpoint agent management, escalations, and billing reports',
    category: 'security',
    maturity: 'production',
    features: [
      'Agent Monitoring',
      'Billing',
      'Escalations',
      'Incident Management',
      'Organization Management',
      'Signals'
    ],
    skills: [
      { name: 'agents', description: 'Use this skill when managing Huntress endpoint agents — listing agents, filtering by organization or platform, checking agent health and status, and investigating specific agent details.' },
      { name: 'billing', description: 'Use this skill when generating Huntress billing and summary reports — listing available reports, retrieving billing details, and creating client-facing summaries for MSP invoicing.' },
      { name: 'escalations', description: 'Use this skill when working with Huntress escalations — listing, reviewing, and resolving escalations from the Huntress SOC team.' },
      { name: 'incidents', description: 'Use this skill when working with Huntress incidents - querying incidents by organization and status, reviewing SOC-recommended remediation details, approving or rejecting remediations individually or in bulk, checking remediation execution status, and resolving incidents after all remediations are processed.' },
      { name: 'organizations', description: 'Use this skill when managing Huntress organizations — creating, listing, updating, deleting organizations, and managing client org structure for MSP multi-tenancy.' },
      { name: 'signals', description: 'Use this skill when working with Huntress security signals — monitoring, listing, filtering, and investigating signals across managed endpoints.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Huntress MCP tools — available tools, authentication via HTTP Basic Auth, API structure, pagination with page tokens, rate limiting (60 req/min), error handling, and best practices.' }
    ],
    agents: [
      { name: 'client-onboarding-validator', description: 'Use this agent when validating a newly onboarded client in Huntress — checking that agents are deployed and reporting, confirming SOC coverage is active, identifying any endpoints missing agents, and surfacing initial detections that fired during or after deployment.' },
      { name: 'incident-responder', description: 'Use this agent when triaging Huntress incidents, reviewing SOC escalations, approving or rejecting endpoint remediations, investigating security signals, or managing the Huntress agent fleet across MSP client organizations.' }
    ],
    commands: [
      { name: '/agent-inventory', description: 'List and filter Huntress agents across organizations' },
      { name: '/billing-report', description: 'Generate a Huntress billing summary for a period' },
      { name: '/incident-triage', description: 'Triage open Huntress incidents by severity' },
      { name: '/investigate-incident', description: 'Deep dive investigation into a specific Huntress incident with remediations' },
      { name: '/org-health', description: 'Organization health check covering agents, incidents, and escalations' },
      { name: '/resolve-escalation', description: 'Review and resolve a Huntress escalation' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'huntress/huntress',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'it-glue',
    name: 'IT Glue',
    vendor: 'Kaseya',
    description: 'IT Glue - organizations, assets, passwords, flexible assets',
    category: 'documentation',
    maturity: 'production',
    features: [
      'Configuration Items',
      'Contact Management',
      'Documentation',
      'Flexible Assets',
      'Organization Management',
      'Password Management'
    ],
    skills: [
      { name: 'configurations', description: 'Use this skill when working with IT Glue configurations (assets) - servers, workstations, network devices, and other infrastructure.' },
      { name: 'contacts', description: 'Use this skill when working with IT Glue contacts - managing client contacts, contact types, locations, and communication details.' },
      { name: 'documents', description: 'Use this skill when working with IT Glue documents - creating, organizing, and managing documentation.' },
      { name: 'flexible-assets', description: 'Use this skill when working with IT Glue flexible assets - custom asset types for structured documentation.' },
      { name: 'organizations', description: 'Use this skill when working with IT Glue organizations (companies/clients) - creating, searching, updating, and managing client documentation.' },
      { name: 'passwords', description: 'Use this skill when working with IT Glue passwords - secure credential storage, password categories, folders, embedded passwords, and access patterns.' },
      { name: 'api-patterns', description: 'Use this skill when working with the IT Glue API - authentication, JSON:API structure, filtering, sorting, pagination, rate limiting, sideloading with includes, and error handling.' }
    ],
    agents: [
      { name: 'asset-documentation-linker', description: 'Use this agent when an MSP needs to find and fix broken or missing linkages between IT Glue objects — configurations without passwords, devices without runbooks, organizations without network diagrams, contacts unlinked from assets.' },
      { name: 'documentation-auditor', description: 'Use this agent when an MSP needs to audit documentation completeness and freshness across their IT Glue client portfolio.' }
    ],
    commands: [
      { name: '/edit-doc-sections', description: 'Read, edit, and restructure sections of an IT Glue document' },
      { name: '/find-organization', description: 'Find an organization in IT Glue by name' },
      { name: '/get-password', description: 'Retrieve a password from IT Glue (with security logging)' },
      { name: '/lookup-asset', description: 'Find a configuration item (asset) in IT Glue by name, hostname, serial number, or IP address' },
      { name: '/search-docs', description: 'Search IT Glue documentation by keyword or phrase' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'kaseya/it-glue',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'knowbe4',
    name: 'Knowbe4',
    vendor: 'Email Security',
    description: 'KnowBe4 - phishing simulation, security awareness training, user risk management',
    category: 'email-security',
    maturity: 'production',
    features: [
      'Phishing',
      'Reporting',
      'Training',
      'User Management'
    ],
    skills: [
      { name: 'phishing', description: 'Use this skill when working with KnowBe4 phishing simulations - creating campaigns, managing security tests, tracking recipient interactions (sent, opened, clicked, reported), calculating phish-prone percentages, and analyzing phishing simulation results.' },
      { name: 'reporting', description: 'Use this skill when generating KnowBe4 security awareness reports - phishing summary statistics, training completion rates, risk score overviews, trend analysis, organizational benchmarks, and executive dashboards.' },
      { name: 'training', description: 'Use this skill when working with KnowBe4 training campaigns - creating and managing training assignments, tracking enrollment and completion, browsing training modules and content library, managing store purchases, and monitoring compliance deadlines.' },
      { name: 'users', description: 'Use this skill when working with KnowBe4 users and groups - user lifecycle management, group creation and membership, risk scores, risk score history, user event tracking, and user status management.' },
      { name: 'api-patterns', description: 'Use this skill when working with the KnowBe4 REST API - Bearer token authentication, multi-region base URLs, pagination, rate limiting, error handling, and common request patterns.' }
    ],
    agents: [],
    commands: [
      { name: '/campaign-summary', description: 'Get summary of recent phishing and training campaigns from KnowBe4' },
      { name: '/group-report', description: 'Get security awareness metrics for a KnowBe4 group' },
      { name: '/phishing-results', description: 'View phishing campaign results and click rates from KnowBe4' },
      { name: '/training-status', description: 'Check training completion status for users or groups in KnowBe4' },
      { name: '/user-risk', description: 'Get risk score and risk history for a KnowBe4 user' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'email-security/knowbe4',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'liongard',
    name: 'Liongard',
    vendor: 'Liongard',
    description: 'Liongard - environments, inspections, systems, detections, alerts, configuration monitoring',
    category: 'rmm',
    maturity: 'beta',
    features: [
      'Detection & Alerting',
      'Environment Management',
      'Inspection Monitoring',
      'System Configuration'
    ],
    skills: [
      { name: 'detections', description: 'Use this skill when working with Liongard detections, change monitoring, alerts, metrics, or timeline events.' },
      { name: 'environments', description: 'Use this skill when working with Liongard environments (customer organizations), environment groups, or related entities.' },
      { name: 'inspections', description: 'Use this skill when working with Liongard inspectors, launchpoints, inspection scheduling, or triggering inspections on demand.' },
      { name: 'overview', description: 'Use this skill when Claude needs context about the Liongard platform, terminology, capabilities, authentication patterns, or API structure.' },
      { name: 'systems', description: 'Use this skill when working with Liongard systems, system details, dataprints for JMESPath evaluation, or asset inventory.' }
    ],
    agents: [
      { name: 'change-detective', description: 'Use this agent when an MSP needs to detect unauthorized or unexpected configuration changes, audit compliance drift, or surface undocumented systems across their client environments.' },
      { name: 'compliance-drift-reporter', description: 'Use this agent when an MSP needs to generate compliance baseline drift reports, produce evidence for compliance frameworks, or identify coverage gaps where inspectors have not checked in.' }
    ],
    commands: [
      { name: '/liongard-environment-summary', description: 'Generate a detailed summary of a Liongard environment' },
      { name: '/liongard-health-check', description: 'Check Liongard connectivity and return system health summary' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'liongard/liongard',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'm365',
    name: 'Microsoft 365',
    vendor: 'Microsoft',
    description: 'Microsoft 365 - users, mailboxes, Teams, OneDrive, licensing, and security posture',
    category: 'productivity',
    maturity: 'production',
    features: [
      'Calendar Management',
      'File Management',
      'License Auditing',
      'Mailbox & Email',
      'Security Posture',
      'Teams Administration',
      'User Management'
    ],
    skills: [
      { name: 'calendar', description: 'Use this skill when working with Microsoft 365 calendars - viewing events, finding free/busy times, creating meetings, managing room bookings, or checking a user\'s schedule.' },
      { name: 'files', description: 'Use this skill when working with Microsoft 365 files - OneDrive personal storage, SharePoint document libraries, file sharing permissions, storage quotas, or searching across a user\'s files.' },
      { name: 'licensing', description: 'Use this skill when managing Microsoft 365 licenses - checking available seats, assigning or removing licenses, auditing license usage, finding unused licenses, or planning license optimization for a customer tenant.' },
      { name: 'mailboxes', description: 'Use this skill when working with Microsoft 365 mailboxes - reading email, searching messages, managing shared mailboxes, setting out-of-office replies, checking mailbox size, or diagnosing mail flow issues.' },
      { name: 'security', description: 'Use this skill for Microsoft 365 security posture checks - MFA enrollment status, conditional access policies, risky sign-ins, suspicious inbox rules, compromised account indicators, and security audit tasks.' },
      { name: 'teams', description: 'Use this skill when working with Microsoft Teams - listing teams and channels, managing team membership, finding meetings, checking Teams usage, or troubleshooting Teams access issues.' },
      { name: 'users', description: 'Use this skill when working with Microsoft 365 users - listing, searching, creating, disabling, or checking user properties.' },
      { name: 'api-patterns', description: 'Use this skill for Microsoft Graph API fundamentals - authentication patterns, OData query operators, pagination, throttling/retry, batch requests, and delta queries.' }
    ],
    agents: [
      { name: 'identity-auditor', description: 'Use this agent when an MSP needs to perform a comprehensive Microsoft 365 tenant security audit.' },
      { name: 'license-auditor', description: 'Use this agent when an MSP needs to audit Microsoft 365 license costs and find savings opportunities across a client tenant.' }
    ],
    commands: [
      { name: '/check-mfa-status', description: 'Audit MFA enrollment across all M365 users, highlighting accounts with no MFA' },
      { name: '/get-user', description: 'Look up a Microsoft 365 user by name or email, showing account status, licenses, MFA, and last sign-in' },
      { name: '/list-licenses', description: 'Show Microsoft 365 license inventory - available SKUs, consumed seats, and optimization opportunities' },
      { name: '/offboard-user', description: 'Run the complete M365 offboarding workflow for a departing user - revoke access, handle mailbox, transfer data' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'm365/m365',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'ninjaone-rmm',
    name: 'NinjaOne (NinjaRMM)',
    vendor: 'NinjaOne',
    description: 'NinjaOne (NinjaRMM) - devices, organizations, alerts, tickets',
    category: 'rmm',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Device Management',
      'Organization Management',
      'Ticket Management'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with NinjaOne alerts - viewing active conditions, dismissing alerts, and understanding alert severity levels.' },
      { name: 'devices', description: 'Use this skill when working with NinjaOne devices - listing, searching, managing services, viewing inventory, scheduling maintenance, and monitoring device health.' },
      { name: 'organizations', description: 'Use this skill when working with NinjaOne organizations - creating, listing, managing locations, and configuring policies.' },
      { name: 'tickets', description: 'Use this skill when working with NinjaOne tickets - creating, updating, searching, and managing ticketing operations.' },
      { name: 'api-patterns', description: 'Use this skill for NinjaOne API authentication, pagination, rate limiting, and error handling patterns.' }
    ],
    agents: [
      { name: 'device-health-auditor', description: 'Use this agent when an MSP needs a comprehensive device health audit across their NinjaOne-managed organization portfolio.' },
      { name: 'patch-compliance-reporter', description: 'Use this agent when an MSP needs dedicated patch compliance reporting across their NinjaOne-managed portfolio — not a general health check, but a focused analysis of OS patch levels, third-party application versions, missing critical patches, devices pending reboot, and patch policy exceptions.' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new ticket in NinjaOne' },
      { name: '/device-info', description: 'Get detailed information about a NinjaOne device' },
      { name: '/list-alerts', description: 'List active alerts across NinjaOne devices' },
      { name: '/search-devices', description: 'Search for devices across NinjaOne organizations' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'ninjaone/ninjaone-rmm',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    vendor: 'PagerDuty',
    description: 'PagerDuty - incident management, on-call scheduling, alerting',
    category: 'incident-management',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Analytics',
      'Incident Management',
      'On-Call Scheduling',
      'Services'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with PagerDuty alerts -- alert management, alert grouping, suppression, event routing, and the Events API v2 for sending trigger, acknowledge, and resolve events.' },
      { name: 'analytics', description: 'Use this skill when working with PagerDuty analytics -- incident analytics, MTTA and MTTR metrics, service-level performance, team workload reporting, and operational maturity assessment.' },
      { name: 'incidents', description: 'Use this skill when working with PagerDuty incidents - listing, triaging, creating, updating, resolving, and investigating incidents.' },
      { name: 'oncall', description: 'Use this skill when working with PagerDuty on-call management - viewing who is currently on-call, managing schedules and rotation layers, configuring escalation policies, creating temporary overrides, and adding or removing team members.' },
      { name: 'services', description: 'Use this skill when working with PagerDuty services -- service catalog, service configuration, integrations, dependencies, maintenance windows, and service health monitoring.' },
      { name: 'api-patterns', description: 'Use this skill when working with PagerDuty MCP tools - authentication setup, complete 66-tool reference, REST API pagination, token format (Token token=), rate limits, error handling, and hosted MCP connection details.' }
    ],
    agents: [
      { name: 'incident-commander', description: 'Use this agent when an MSP engineer, SRE, or incident manager needs to command an active incident or review the state of open PagerDuty incidents.' },
      { name: 'on-call-scheduler', description: 'Use this agent when an MSP operations lead, SRE manager, or engineering manager needs to review and manage PagerDuty on-call schedules — not incident response, but the health of the schedule system itself: coverage gaps, upcoming holidays without coverage, overloaded individuals, escalation policy misconfigurations, and rotation balance.' }
    ],
    commands: [
      { name: '/create-incident', description: 'Create a new PagerDuty incident on a service' },
      { name: '/escalate-incident', description: 'Escalate a PagerDuty incident to the next level in the escalation policy' },
      { name: '/incident-triage', description: 'Triage current open PagerDuty incidents by urgency and priority' },
      { name: '/oncall-schedule', description: 'Show who is currently on call across schedules and escalation policies' },
      { name: '/service-health', description: 'Check PagerDuty service health status and recent incident activity' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'pagerduty/pagerduty',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'pandadoc',
    name: 'PandaDoc',
    vendor: 'PandaDoc',
    description: 'PandaDoc - documents, templates, e-signatures, and proposal management',
    category: 'sales',
    maturity: 'production',
    features: [
      'Documentation',
      'Proposal Tracking',
      'Recipient Management',
      'Template Management'
    ],
    skills: [
      { name: 'documents', description: 'Use this skill when working with PandaDoc documents - creating proposals, quotes, contracts, SOWs, and MSAs from templates, sending documents for signature, checking document status, downloading signed copies, and managing the full document lifecycle.' },
      { name: 'proposals', description: 'Use this skill when working with MSP proposal workflows in PandaDoc - creating managed service agreements (MSAs), statements of work (SOWs), hardware quotes, project proposals, and tracking the MSP sales pipeline.' },
      { name: 'recipients', description: 'Use this skill when working with PandaDoc recipients and signatures - adding recipients to documents, setting signing order, tracking who has signed, managing multi-party agreements, and understanding recipient roles.' },
      { name: 'templates', description: 'Use this skill when working with PandaDoc templates - browsing the template library, finding the right template for a document type, understanding template fields and tokens, and using templates to create new documents.' },
      { name: 'api-patterns', description: 'Use this skill when working with PandaDoc MCP tools - available tools, API key authentication, the hosted MCP server connection, documentation search, code generation assistance, rate limiting, error handling, and best practices for the PandaDoc API.' }
    ],
    agents: [
      { name: 'contract-tracker', description: 'Use this agent when an MSP sales coordinator or account manager needs to track the status of pending proposals and contracts in PandaDoc.' },
      { name: 'template-standardizer', description: 'Use this agent when an MSP needs to audit and standardize their PandaDoc proposal and contract templates — checking for outdated pricing, missing legal clauses, inconsistent formatting, and stale service descriptions.' }
    ],
    commands: [
      { name: '/create-document', description: 'Create a new PandaDoc document from a template with recipients and content' },
      { name: '/document-status', description: 'Check the status of a PandaDoc document and its recipients' },
      { name: '/list-templates', description: 'List all available PandaDoc templates with details' },
      { name: '/proposal-pipeline', description: 'Summarize the PandaDoc proposal pipeline by status, value, and age' },
      { name: '/send-document', description: 'Send a PandaDoc document for e-signature' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'pandadoc/pandadoc',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'pax8',
    name: 'Pax8',
    vendor: 'Pax8',
    description: 'Pax8 cloud marketplace - companies, products, subscriptions, orders, invoices',
    category: 'marketplace',
    maturity: 'production',
    features: [
      'Company Management',
      'Invoice Management',
      'Order Management',
      'Product Catalog',
      'Subscription Lifecycle'
    ],
    skills: [
      { name: 'companies', description: 'Use this skill when working with Pax8 companies (MSP clients) - searching, retrieving, and managing client records in the Pax8 marketplace.' },
      { name: 'invoices', description: 'Use this skill when working with Pax8 invoices and billing - retrieving invoices, analyzing billing data, reconciling costs with client charges, reviewing usage summaries, and understanding the MSP billing cycle.' },
      { name: 'orders', description: 'Use this skill when working with Pax8 orders - viewing orders, tracking provisioning status, understanding order line items, and managing the order-to-subscription workflow.' },
      { name: 'products', description: 'Use this skill when working with the Pax8 product catalog - searching for cloud software, browsing vendors, checking pricing, reviewing provisioning details, and finding the right SKU for a client need.' },
      { name: 'subscriptions', description: 'Use this skill when working with Pax8 subscriptions - checking license status, reviewing seat counts, filtering by company or product, tracking subscription states, reviewing change history, and optimizing license usage across MSP clients.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Pax8 MCP tools - available tools, parameters, pagination, sorting, filtering, rate limiting, error handling, and best practices.' }
    ],
    agents: [
      { name: 'license-optimizer', description: 'Use this agent when an MSP needs to analyze license utilization across their Pax8 marketplace subscriptions, identify unused or over-provisioned seats, optimize costs, or plan renewals.' },
      { name: 'renewal-calendar', description: 'Use this agent when an MSP needs a proactive view of upcoming Pax8 subscription renewals across all clients, wants to flag month-to-month subscriptions that should move to annual, or needs to identify annual renewals that require a seat count review before they lock in.' }
    ],
    commands: [
      { name: '/create-order', description: 'Place an order for a product subscription in Pax8' },
      { name: '/license-summary', description: 'Aggregate license counts and costs across all Pax8 client companies' },
      { name: '/search-products', description: 'Search the Pax8 product catalog by name or vendor' },
      { name: '/subscription-status', description: 'Check subscription status for a company in Pax8' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'pax8/pax8',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'proofpoint',
    name: 'Proofpoint',
    vendor: 'Email Security',
    description: 'Proofpoint Email Protection - TAP, quarantine, threat intel, forensics, URL defense, VAP reports',
    category: 'email-security',
    maturity: 'production',
    features: [
      'Forensics',
      'People',
      'Quarantine',
      'Tap',
      'Threat Intel',
      'Url Defense'
    ],
    skills: [
      { name: 'forensics', description: 'Use this skill when working with Proofpoint forensics and threat response - auto-pull, search and destroy, message trace, evidence collection, and remediation workflows.' },
      { name: 'people', description: 'Use this skill when working with Proofpoint people-centric security - Very Attacked People (VAP) reports, top clickers, user risk scoring, attack index, and user-level threat analytics.' },
      { name: 'quarantine', description: 'Use this skill when working with Proofpoint email quarantine - listing, searching, releasing, and deleting quarantined messages.' },
      { name: 'tap', description: 'Use this skill when working with Proofpoint Targeted Attack Protection (TAP) - retrieving threat events, click tracking, message delivery and blocking data, SIEM integration feeds, and threat type analysis.' },
      { name: 'threat-intel', description: 'Use this skill when working with Proofpoint threat intelligence - campaign tracking, threat families, indicators of compromise (IOCs), forensic evidence, and threat landscape analysis.' },
      { name: 'url-defense', description: 'Use this skill when working with Proofpoint URL Defense - URL rewriting, URL decoding, real-time URL analysis, click-time protection, and URL investigation.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Proofpoint API - authentication using HTTP Basic Auth with service principal and secret, base URLs, rate limits, pagination, error codes, and common integration patterns.' }
    ],
    agents: [],
    commands: [
      { name: '/check-threats', description: 'View recent TAP threat events including blocked messages, delivered threats, and click activity' },
      { name: '/decode-url', description: 'Decode a Proofpoint URL Defense rewritten URL back to the original URL' },
      { name: '/investigate-threat', description: 'Deep-dive threat investigation with forensics, campaign context, and remediation options' },
      { name: '/release-quarantine', description: 'Release one or more quarantined messages to their intended recipients' },
      { name: '/search-quarantine', description: 'Search quarantined messages in Proofpoint by sender, recipient, subject, or reason' },
      { name: '/vap-report', description: 'Get the Very Attacked People (VAP) report showing the most targeted users' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'email-security/proofpoint',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'quickbooks-online',
    name: 'QuickBooks Online',
    vendor: 'Intuit',
    description: 'QuickBooks Online - customers, invoices, expenses, payments, reports',
    category: 'accounting',
    maturity: 'production',
    features: [
      'Customer Operations',
      'Expense Management',
      'Invoice Management',
      'Payment Tracking',
      'Financial Reporting'
    ],
    skills: [
      { name: 'customers', description: 'Use this skill when working with QuickBooks Online customers (clients) - creating, searching, updating, and managing MSP client records.' },
      { name: 'expenses', description: 'Use this skill when working with QuickBooks Online expenses and purchases - creating, searching, and managing expense records, bills, and vendor payments.' },
      { name: 'invoices', description: 'Use this skill when working with QuickBooks Online invoices - creating, sending, voiding, and managing invoices for MSP clients.' },
      { name: 'payments', description: 'Use this skill when working with QuickBooks Online payments - recording customer payments, applying payments to invoices, handling overpayments, refunds, credit memos, and payment reconciliation.' },
      { name: 'reports', description: 'Use this skill when working with QuickBooks Online reports - generating Profit & Loss, Balance Sheet, Accounts Receivable Aging, Accounts Payable Aging, General Ledger, and other financial reports.' },
      { name: 'api-patterns', description: 'Use this skill when working with the QuickBooks Online API - OAuth2 authentication, REST structure, Intuit query language, pagination, rate limiting, error handling, minor version headers, and best practices.' }
    ],
    agents: [
      { name: 'billing-reconciler', description: 'Use this agent when an MSP needs to reconcile billing in QuickBooks Online — matching invoices to contracts, identifying unbilled work, flagging overdue accounts, or auditing revenue recognition.' },
      { name: 'profitability-reporter', description: 'Use this agent when an MSP needs to analyze per-client or per-service-line profitability in QuickBooks Online — calculating gross margin by client, identifying the most and least profitable accounts, tracking profitability trends over time, or surfacing service lines where costs are eroding margin.' }
    ],
    commands: [
      { name: '/create-invoice', description: 'Create an invoice for a client\'s managed services in QuickBooks Online' },
      { name: '/expense-summary', description: 'Summarize expenses by client, vendor, or date range in QuickBooks Online' },
      { name: '/get-balance', description: 'View outstanding balances across all MSP clients in QuickBooks Online' },
      { name: '/search-customers', description: 'Find a customer in QuickBooks Online by name or other criteria' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'quickbooks/quickbooks-online',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'rocketcyber',
    name: 'RocketCyber',
    vendor: 'Kaseya',
    description: 'RocketCyber managed SOC - incidents, agents, events, threat detection',
    category: 'security',
    maturity: 'beta',
    features: [
      'Account Hierarchy',
      'Agent Monitoring',
      'Application Inventory',
      'Incident Management'
    ],
    skills: [
      { name: 'accounts', description: 'Use this skill when working with RocketCyber accounts - provider/customer hierarchy, account management, sub-account navigation, account settings, and security policy configuration.' },
      { name: 'agents', description: 'Use this skill when working with RocketCyber agents (RocketAgent) - deployment, communication status, health monitoring, and troubleshooting.' },
      { name: 'apps', description: 'Use this skill when working with RocketCyber application inventory - detecting, categorizing, and monitoring applications across managed endpoints.' },
      { name: 'incidents', description: 'Use this skill when working with RocketCyber security incidents - searching, triaging, investigating, and resolving incidents.' },
      { name: 'api-patterns', description: 'Use this skill when working with the RocketCyber API - authentication, Bearer token flow, base URL selection, pagination, rate limiting, error handling, and account hierarchy.' }
    ],
    agents: [
      { name: 'soc-alert-investigator', description: 'Use this agent when an MSP needs to investigate and triage RocketCyber SOC alerts and security incidents across their client portfolio.' },
      { name: 'threat-correlation-analyst', description: 'Use this agent when an MSP needs to correlate RocketCyber SOC detections with broader security context from across the Kaseya ecosystem — cross-referencing incidents with Datto RMM device data, IT Glue documentation, and Autotask ticket history to build richer threat narratives and identify whether incidents are isolated or part of a broader pattern.' }
    ],
    commands: [
      { name: '/account-summary', description: 'Get a security posture summary for a RocketCyber customer account' },
      { name: '/search-incidents', description: 'Search RocketCyber security incidents by account, status, severity, verdict, and date range' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'kaseya/rocketcyber',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'rootly',
    name: 'Rootly',
    vendor: 'Rootly',
    description: 'Rootly - incident management, postmortems, SRE automation',
    category: 'incident-management',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Incident Management',
      'On-Call Scheduling',
      'Postmortems',
      'Services',
      'Workflows'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with Rootly alerts -- alert routing, escalation policies, integration with monitoring tools (Datadog, PagerDuty, etc.), alert-to-incident creation, and managing alert rules.' },
      { name: 'incidents', description: 'Use this skill when working with Rootly incidents - creating, searching, triaging, updating, and resolving incidents.' },
      { name: 'oncall', description: 'Use this skill when working with Rootly on-call management - viewing shift metrics, generating handoff summaries, reviewing shift incidents, detecting on-call health risk, and understanding schedule coverage.' },
      { name: 'postmortems', description: 'Use this skill when working with Rootly postmortems -- creating retrospectives, managing action items, applying templates, and conducting blameless reviews after incidents are resolved.' },
      { name: 'services', description: 'Use this skill when working with the Rootly service catalog -- listing services, managing dependencies, ownership, service health, and understanding how services relate to incidents and alerts.' },
      { name: 'workflows', description: 'Use this skill when working with Rootly workflows -- creating automated incident response workflows, configuring triggers, actions, conditions, and managing workflow lifecycle.' },
      { name: 'api-patterns', description: 'Use this skill when working with Rootly MCP tools - authentication setup, complete tool reference, JSON:API pagination, request patterns, rate limits, and error handling.' }
    ],
    agents: [
      { name: 'incident-commander', description: 'Use this agent when an MSP engineer, SRE, or incident manager needs to command an active Rootly incident or review open incidents.' },
      { name: 'post-mortem-writer', description: 'Use this agent when an MSP engineer, SRE, or incident manager needs to generate a structured post-incident review (PIR) for a resolved Rootly incident — not live incident command, but a thorough retrospective document covering what happened, why it happened, the full impact timeline, contributing factors, and the concrete action items the team is committing to fix.' }
    ],
    commands: [
      { name: '/action-items', description: 'List outstanding action items from Rootly postmortems and incidents' },
      { name: '/create-incident', description: 'Create a new incident in Rootly with title, severity, and affected services' },
      { name: '/incident-triage', description: 'Triage active Rootly incidents by severity and status' },
      { name: '/postmortem-summary', description: 'Generate a postmortem summary for a resolved Rootly incident' },
      { name: '/service-status', description: 'Check service health and dependency status across the Rootly service catalog' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'rootly/rootly',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'runzero',
    name: 'Runzero',
    vendor: 'Runzero',
    description: 'runZero - asset discovery, network scanning, inventory management',
    category: 'security',
    maturity: 'production',
    features: [
      'Asset Management',
      'Services',
      'Site Management',
      'Tasks',
      'Wireless'
    ],
    skills: [
      { name: 'assets', description: 'Use this skill when working with RunZero assets — searching and browsing the asset inventory, inspecting asset attributes, OS fingerprinting, hardware details, and network interfaces.' },
      { name: 'services', description: 'Use this skill when working with RunZero services — listing discovered services, filtering by port or protocol, identifying vulnerabilities, and auditing exposed services across sites.' },
      { name: 'sites', description: 'Use this skill when working with RunZero sites — creating and managing organization sites, defining scan scope, deploying explorers, and organizing assets by location or client.' },
      { name: 'tasks', description: 'Use this skill when working with RunZero scan tasks — creating scans, scheduling recurring scans, managing explorers, configuring scan parameters, and reviewing scan results.' },
      { name: 'wireless', description: 'Use this skill when working with RunZero wireless network discovery — listing discovered wireless networks, identifying rogue access points, analyzing wireless security configurations, and auditing SSIDs.' },
      { name: 'api-patterns', description: 'Use this skill when working with the RunZero MCP tools — available tools, authentication via Bearer token, Export API, pagination, rate limiting, error handling, and best practices.' }
    ],
    agents: [],
    commands: [
      { name: '/asset-search', description: 'Search for assets in RunZero by criteria' },
      { name: '/scan-network', description: 'Initiate a network discovery scan in RunZero' },
      { name: '/service-inventory', description: 'List discovered services across RunZero assets' },
      { name: '/site-overview', description: 'Overview of a RunZero site\'s assets, services, and health' },
      { name: '/vuln-report', description: 'Generate a vulnerability summary report from RunZero data' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'runzero/runzero',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'salesbuildr',
    name: 'SalesBuildr',
    vendor: 'SalesBuildr',
    description: 'SalesBuildr CRM - contacts, companies, opportunities, quotes',
    category: 'crm',
    maturity: 'production',
    features: [
      'Companies Contacts',
      'Opportunity Tracking',
      'Product Catalog',
      'Quote Generation'
    ],
    skills: [
      { name: 'companies-contacts', description: 'Use this skill when searching for companies or contacts in Salesbuildr, looking up customer information, or creating new contacts.' },
      { name: 'opportunities', description: 'Use this skill when managing sales opportunities in Salesbuildr - searching the pipeline, creating new opportunities, updating stages, and tracking deal values.' },
      { name: 'products', description: 'Use this skill when searching for products in the Salesbuildr catalog, looking up pricing, or browsing by category.' },
      { name: 'quotes', description: 'Use this skill when creating, searching, or viewing quotes in Salesbuildr.' },
      { name: 'api-patterns', description: 'Use this skill when making API calls to Salesbuildr.' }
    ],
    agents: [
      { name: 'margin-analyzer', description: 'Use this agent when an MSP sales manager or finance lead needs to analyze quote margin health across recent quotes in Salesbuildr.' },
      { name: 'quote-builder', description: 'Use this agent when an MSP sales team member needs to build, review, or standardize quotes in Salesbuildr.' }
    ],
    commands: [
      { name: '/create-contact', description: 'Create a new contact in Salesbuildr' },
      { name: '/create-opportunity', description: 'Create a new opportunity in Salesbuildr' },
      { name: '/create-quote', description: 'Create a new quote with line items in Salesbuildr' },
      { name: '/get-quote', description: 'Get detailed information for a specific Salesbuildr quote' },
      { name: '/search-companies', description: 'Search for companies in Salesbuildr' },
      { name: '/search-contacts', description: 'Search for contacts in Salesbuildr, optionally filtered by company' },
      { name: '/search-opportunities', description: 'Search for opportunities in the Salesbuildr sales pipeline' },
      { name: '/search-products', description: 'Search the Salesbuildr product catalog' },
      { name: '/search-quotes', description: 'Search for quotes in Salesbuildr' },
      { name: '/update-opportunity', description: 'Update an opportunity\'s status, value, or other details' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'salesbuildr/salesbuildr',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'sentinelone',
    name: 'SentinelOne',
    vendor: 'SentinelOne',
    description: 'SentinelOne XDR - threat detection, incident response, and endpoint agent management via the Purple AI MCP server',
    category: 'security',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Asset Inventory',
      'Cloud Security Posture',
      'Purple AI Threat Hunting',
      'PowerQuery Analytics',
      'Vulnerability Management'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with SentinelOne alerts - triaging new alerts, investigating specific alerts, searching by severity or status, reviewing alert timelines, and managing alert workflows across MSP client environments.' },
      { name: 'inventory', description: 'Use this skill when working with SentinelOne unified asset inventory - endpoints, cloud resources, identities, and network-discovered devices.' },
      { name: 'misconfigurations', description: 'Use this skill when working with SentinelOne XSPM misconfigurations - cloud security posture management across AWS, Azure, GCP, Kubernetes, identity, and infrastructure-as-code.' },
      { name: 'purple-ai', description: 'Use this skill when working with SentinelOne Purple AI - natural language cybersecurity investigation, threat hunting, behavioral anomaly analysis, MITRE ATT&CK TTP mapping, and PowerQuery generation.' },
      { name: 'threat-hunting', description: 'Use this skill when working with SentinelOne PowerQuery and the Singularity Data Lake - executing threat hunting queries, understanding PowerQuery pipeline syntax, managing time ranges, and analyzing query results.' },
      { name: 'vulnerabilities', description: 'Use this skill when working with SentinelOne XSPM vulnerabilities - tracking CVEs, reviewing EPSS scores, assessing exploit maturity, managing vulnerability status, prioritizing patches, and generating vulnerability reports across MSP client environments.' },
      { name: 'api-patterns', description: 'Use this skill when working with the SentinelOne Purple MCP tools - available tools, connection setup, uvx-based installation, Service User token authentication, transport modes, dual API architecture (GraphQL and REST), rate limits, error handling, and best practices.' }
    ],
    agents: [
      { name: 'endpoint-hardening-auditor', description: 'Use this agent when an MSP needs to audit and harden SentinelOne endpoint configuration across client sites — not to investigate active threats, but to proactively identify gaps before attackers can exploit them.' },
      { name: 'threat-hunter', description: 'Use this agent when an MSP needs to autonomously hunt for threats across client endpoints using SentinelOne.' }
    ],
    commands: [
      { name: '/alert-triage', description: 'Triage new and unresolved SentinelOne alerts by severity' },
      { name: '/asset-inventory', description: 'Asset inventory summary by surface type across managed environments' },
      { name: '/hunt-threat', description: 'Threat hunting via Purple AI and PowerQuery execution' },
      { name: '/investigate-alert', description: 'Deep investigation of a specific SentinelOne alert with timeline and context' },
      { name: '/posture-review', description: 'Cloud security posture review with compliance gap analysis' },
      { name: '/vuln-report', description: 'Generate a vulnerability summary report with severity breakdown and top CVEs' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'sentinelone/sentinelone',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'sherweb',
    name: 'Sherweb',
    vendor: 'Sherweb',
    description: 'Sherweb Partner API - distributor billing, service provider management, customer subscriptions',
    category: 'marketplace',
    maturity: 'beta',
    features: [
      'Billing',
      'Customer Operations',
      'Subscription Lifecycle'
    ],
    skills: [
      { name: 'billing', description: 'Use this skill when working with Sherweb distributor billing - payable charges, billing periods, charge types, pricing breakdown, deductions, fees, taxes, invoices, and MSP margin calculations.' },
      { name: 'customers', description: 'Use this skill when working with Sherweb customers - listing customers, retrieving customer details, accounts receivable, and understanding the distributor > service provider > customer hierarchy.' },
      { name: 'subscriptions', description: 'Use this skill when working with Sherweb subscriptions - viewing subscriptions, changing quantities, license management, subscription lifecycle, and quantity change workflows.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Sherweb API and MCP tools - OAuth 2.0 client credentials authentication, token management, API endpoints, subscription key header, rate limits, error codes, scopes, Accept-Language support, and best practices.' }
    ],
    agents: [],
    commands: [
      { name: '/billing-summary', description: 'View payable charges for a Sherweb billing period with pricing breakdown' },
      { name: '/change-quantity', description: 'Change subscription seat/license quantity for a Sherweb customer' },
      { name: '/list-customers', description: 'List all customers under the Sherweb service provider account' },
      { name: '/subscription-status', description: 'Check subscription details and quantities for a Sherweb customer' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'sherweb/sherweb',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'superops',
    name: 'SuperOps.ai',
    vendor: 'SuperOps',
    description: 'SuperOps.ai - tickets, assets, clients, runbooks (GraphQL)',
    category: 'psa',
    maturity: 'production',
    features: [
      'Alert Handling',
      'Asset Management',
      'Client Operations',
      'Runbook Execution',
      'Ticket Management'
    ],
    skills: [
      { name: 'alerts', description: 'Use this skill when working with SuperOps.ai alerts - listing, filtering, acknowledging, and resolving alerts from monitored assets.' },
      { name: 'assets', description: 'Use this skill when working with SuperOps.ai assets - querying inventory, viewing asset details, running scripts, monitoring patches, and managing client/site associations.' },
      { name: 'clients', description: 'Use this skill when working with SuperOps.ai clients - creating, updating, searching, and managing client accounts.' },
      { name: 'runbooks', description: 'Use this skill when working with SuperOps.ai runbooks and scripts - listing, executing, monitoring, and managing automated scripts on assets.' },
      { name: 'tickets', description: 'Use this skill when working with SuperOps.ai tickets - creating, updating, searching, or managing service desk operations.' },
      { name: 'api-patterns', description: 'Use this skill when working with the SuperOps.ai GraphQL API - authentication, query building, mutations, pagination, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'automation-opportunity-finder', description: 'Use this agent when an MSP operations lead, service manager, or technician wants to identify repetitive ticket patterns in SuperOps.ai that should be automated — not live operations management, but a retrospective analysis of ticket history to find recurring issues with the same client, same category, and same resolution, calculate the manual time cost, and recommend runbooks or automation scripts to eliminate the pattern.' },
      { name: 'msp-service-ops', description: 'Use this agent when an MSP technician, dispatcher, or manager needs a combined PSA and RMM operations review in SuperOps.ai.' }
    ],
    commands: [
      { name: '/acknowledge-alert', description: 'Acknowledge an RMM alert to indicate investigation is underway' },
      { name: '/add-ticket-note', description: 'Add a note (internal or public) to an existing SuperOps.ai ticket' },
      { name: '/create-ticket', description: 'Create a new service ticket in SuperOps.ai' },
      { name: '/get-asset', description: 'Get detailed asset information including hardware, software, and alerts' },
      { name: '/list-alerts', description: 'List active RMM alerts across all clients or filtered by criteria' },
      { name: '/list-assets', description: 'List and filter assets in SuperOps.ai' },
      { name: '/log-time', description: 'Log a time entry against a SuperOps.ai ticket' },
      { name: '/resolve-alert', description: 'Resolve an RMM alert and optionally create a ticket' },
      { name: '/run-script', description: 'Execute a script on a remote asset via SuperOps RMM' },
      { name: '/update-ticket', description: 'Update fields on an existing SuperOps.ai ticket' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'superops/superops-ai',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  },
  {
    id: 'syncro',
    name: 'Syncro MSP',
    vendor: 'Syncro',
    description: 'Syncro MSP - tickets, customers, assets, invoicing',
    category: 'psa',
    maturity: 'production',
    features: [
      'Asset Management',
      'Customer Operations',
      'Invoice Management',
      'Ticket Management'
    ],
    skills: [
      { name: 'assets', description: 'Use this skill when working with Syncro MSP assets - tracking hardware, software, and devices for customers.' },
      { name: 'customers', description: 'Use this skill when working with Syncro MSP customers - creating, updating, searching, or managing customer records.' },
      { name: 'invoices', description: 'Use this skill when working with Syncro MSP invoices - creating, managing, and tracking invoices and payments.' },
      { name: 'tickets', description: 'Use this skill when working with Syncro MSP tickets - creating, updating, searching, or managing service desk operations.' },
      { name: 'api-patterns', description: 'Use this skill when working with the Syncro MSP API - authentication, pagination, rate limiting, and error handling.' }
    ],
    agents: [
      { name: 'billing-auditor', description: 'Use this agent when an MSP owner, billing coordinator, or service manager needs a billing completeness and accuracy audit in Syncro — finding tickets that haven\'t been billed, identifying recurring billing discrepancies, checking invoice accuracy against contracts, and flagging draft invoices overdue for finalization.' },
      { name: 'msp-service-ops', description: 'Use this agent when an MSP technician, dispatcher, or owner needs an integrated review of tickets, devices, and billing in Syncro.' }
    ],
    commands: [
      { name: '/add-ticket-comment', description: 'Add a comment to an existing Syncro ticket' },
      { name: '/create-appointment', description: 'Create a calendar appointment in Syncro' },
      { name: '/create-ticket', description: 'Create a new service ticket in Syncro MSP' },
      { name: '/get-customer', description: 'Get detailed customer information from Syncro' },
      { name: '/list-alerts', description: 'List active RMM alerts from Syncro' },
      { name: '/log-time', description: 'Log a time entry against a Syncro ticket' },
      { name: '/resolve-alert', description: 'Resolve an RMM alert in Syncro' },
      { name: '/search-assets', description: 'Search for customer assets in Syncro' },
      { name: '/search-tickets', description: 'Search for tickets in Syncro MSP by various criteria' },
      { name: '/update-ticket', description: 'Update fields on an existing Syncro ticket' }
    ],
    apiInfo: {
      baseUrl: '',
      auth: '',
      rateLimit: '',
      docsUrl: ''
    },
    path: 'syncro/syncro-msp',
    compatibility: { claudeCode: true, claudeDesktop: true, validated: false }
  }
];

export function getPluginById(id: string): Plugin | undefined {
  return plugins.find(p => p.id === id);
}

export function getPluginsByCategory(category: Plugin['category']): Plugin[] {
  return plugins.filter(p => p.category === category);
}

export function getPluginsByVendor(vendor: string): Plugin[] {
  return plugins.filter(p => p.vendor.toLowerCase() === vendor.toLowerCase());
}
