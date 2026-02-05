# Changelog

All notable changes to the MSP Claude Plugin Marketplace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation site using Astro with Starlight theme (in progress)
- GitHub issues for additional PSA/RMM provider plugins (planned)

## [1.1.0] - 2026-02-04

### Added

#### Datto RMM Plugin (`kaseya/datto-rmm/`)
- **Devices Skill** - Device management with identifiers (UID, hostname, MAC, IP), device types (Desktop, Laptop, Server, ESXi Host, Network Device, Printer), status monitoring, user-defined fields (UDF1-30), and device health workflows
- **Alerts Skill** - Comprehensive alert handling with all 25+ alert context types including antivirus_ctx, comp_script_ctx, eventlog_ctx, online_offline_status_ctx, patch_ctx, perf_disk_usage_ctx, perf_resource_usage_ctx, ping_ctx, process_status_ctx, ransomware_ctx, srvc_status_ctx, and more
- **Sites Skill** - Site management with device assignment, site settings, proxy configuration, and site-level operations
- **Jobs Skill** - Quick job execution, component scripts, job variables, status monitoring, and results retrieval
- **Audit Skill** - Hardware inventory (CPU, RAM, disks), software inventory, network interfaces, ESXi host audits, and audit freshness tracking
- **Variables Skill** - Account-level and site-level variables, CRUD operations, variable templates, and inheritance patterns
- **API Patterns Skill** - OAuth 2.0 authentication, 6 regional platforms (Pinotage, Merlot, Concord, Vidal, Zinfandel, Syrah), token lifecycle (100-hour TTL), pagination (nextPageUrl), rate limiting (600 req/min), and Unix millisecond timestamp handling

#### Datto RMM Commands
- **device-lookup** - Find devices by hostname, IP address, or MAC address with site filtering
- **resolve-alert** - Resolve open alerts with context-aware recommendations
- **run-job** - Run quick jobs on devices with variable support and completion waiting
- **site-devices** - List devices at a site with status, type, and alert filtering

#### IT Glue Plugin (`kaseya/it-glue/`)
- **Organizations Skill** - Organization CRUD, relationships, and hierarchies
- **Configuration Types Skill** - Asset types and custom field definitions
- **Passwords Skill** - Secure password management and retrieval
- **Flexible Assets Skill** - Custom documentation templates and fields
- **API Patterns Skill** - X-API-KEY authentication, filtering, embedding related resources

#### Syncro Plugin (`syncro/syncro-msp/`)
- **Tickets Skill** - Ticket CRUD with status (New, In Progress, Resolved), priority levels, timers, comments
- **Customers Skill** - Customer and contact management, onboarding workflows
- **Assets Skill** - Asset tracking with RMM properties, patch management, remote access
- **Invoices Skill** - Invoice creation, line items, payments, email sending
- **API Patterns Skill** - Bearer token auth, page-based pagination (180 req/min)

#### Syncro Commands
- **create-ticket** - Create tickets with customer validation and duplicate detection
- **search-tickets** - Search with filters for customer, status, priority, date range

#### Atera Plugin (`atera/atera/`)
- **Tickets Skill** - Ticket management with SLA tracking, work hours, comments
- **Agents Skill** - RMM agent monitoring, PowerShell execution, lifecycle management
- **Customers Skill** - Customer CRUD with custom values
- **Alerts Skill** - Alert triage with severity levels (Critical, Warning, Information)
- **Devices Skill** - HTTP/SNMP/TCP monitor configuration with common OIDs
- **API Patterns Skill** - X-API-KEY header auth, OData pagination (700 req/min)

#### Atera Commands
- **create-ticket** - Create tickets with customer/contact resolution
- **search-agents** - Search RMM agents by customer or machine name

#### SuperOps.ai Plugin (`superops/superops-ai/`)
- **Tickets Skill** - Ticket CRUD, notes, time entries, status workflows (GraphQL)
- **Assets Skill** - Asset inventory, software, disk details, script execution
- **Clients Skill** - Client CRUD, sites, contacts, custom fields
- **Alerts Skill** - Alert acknowledgment, resolution, ticket creation
- **Runbooks Skill** - Script discovery, execution (single/bulk/scheduled), status monitoring
- **API Patterns Skill** - Bearer token + CustomerSubDomain, cursor pagination (800 req/min)

#### SuperOps.ai Commands
- **create-ticket** - Create tickets via GraphQL mutation
- **list-assets** - Query assets with filtering

#### HaloPSA Plugin (`halopsa/halopsa/`)
- **Tickets Skill** - Ticket management with actions (notes), attachments, SLA calculations
- **Clients Skill** - Client hierarchy, sites, contacts
- **Assets Skill** - Asset tracking, device management, RMM integration
- **Contracts Skill** - Recurring billing, prepaid hours, renewal workflows
- **API Patterns Skill** - OAuth 2.0 client credentials, offset pagination (500 req/3min)

#### HaloPSA Commands
- **create-ticket** - Create tickets with contract validation
- **search-tickets** - Multi-filter search with status/priority/date options

## [1.0.0] - 2026-02-04

### Added

#### Autotask Plugin (`kaseya/autotask/`)
- **Tickets Skill** - Comprehensive ticket management with status codes (NEW, IN_PROGRESS, COMPLETE, WAITING_CUSTOMER, WAITING_MATERIALS, ESCALATED), SLA calculations, escalation rules, and ticket metrics/KPIs
- **CRM Skill** - Company and contact management for client relationship tracking
- **Projects Skill** - Project management with phases, tasks, and resource allocation
- **Contracts Skill** - Service agreements, billing configurations, and contract lifecycle management
- **Time Entries Skill** - Time tracking with approval workflows (DRAFT, SUBMITTED, APPROVED, REJECTED), billing calculations, utilization analytics, and budget validation
- **API Patterns Skill** - Comprehensive REST API documentation covering all 14 query operators (eq, ne, gt, gte, lt, lte, contains, startsWith, endsWith, in, notIn, isNull, isNotNull, between), header-based authentication, automatic zone detection, pagination, rate limiting, and error handling
- **Configuration Items Skill** - Asset management with CI types, categories, DNS records, SSL tracking, related items, warranty tracking, and lifecycle management

#### Autotask Commands
- **create-ticket** - Create new service tickets with company lookup, duplicate detection, contract validation, and queue routing
- **search-tickets** - Search and filter tickets using comprehensive query patterns
- **time-entry** - Log time against tickets or projects with billing calculations and approval submission

#### Shared Skills (`shared/`)
- **MSP Terminology** - Vendor-agnostic MSP vocabulary and acronyms
- **Ticket Triage** - Best practices for ticket prioritization and routing

#### ConnectWise Manage Plugin (`connectwise/manage/`)
- Plugin placeholder structure with manifest and MCP configuration
- README documenting planned features

#### Marketplace Infrastructure
- Vendor-organized directory structure (`vendor/product/` pattern)
- Plugin manifest format (`.claude-plugin/plugin.json`)
- MCP server configuration (`.mcp.json`)
- Skill template with frontmatter schema
- Command template with argument definitions

#### Contribution Framework
- **CONTRIBUTING.md** - Contribution guidelines with PRD requirements
- **CODE_OF_CONDUCT.md** - Contributor Covenant code of conduct
- **LICENSE** - Apache 2.0 license
- **README.md** - Project documentation and quick start guide

#### Quality Standards (`_standards/`)
- PRD requirements checklist
- Skill quality checklist
- API documentation guide

#### Templates (`_templates/`)
- Plugin PRD template
- Skill template with example structure
- Command template
- LLM prompts for skill, command, and PRD generation

### Security
- All Autotask API patterns document secure authentication via header-based credentials (not Basic Auth)
- Rate limiting guidance to prevent API abuse
- Input validation patterns for API operations

---

## Release Notes Format

Each release entry should include:
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

---

[Unreleased]: https://github.com/asachs01/msp-claude-plugins/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/asachs01/msp-claude-plugins/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/asachs01/msp-claude-plugins/releases/tag/v1.0.0
