---
title: MSP Terminology Skill
description: Shared skill providing common MSP, PSA, and RMM terminology and acronyms for Claude
---

The MSP Terminology skill provides Claude with domain knowledge about Managed Service Provider industry terminology, acronyms, and concepts. This skill is automatically loaded when working with any MSP Claude Plugin.

## Purpose

MSPs use specialized vocabulary that Claude needs to understand for effective assistance. This skill covers:

- Industry-standard acronyms (PSA, RMM, NOC, etc.)
- Vendor-specific terminology
- Common workflow concepts
- Billing and contract terms
- Technical service categories

## Terminology Categories

### Platform Acronyms

| Acronym | Full Term | Description |
|---------|-----------|-------------|
| PSA | Professional Services Automation | Software for managing service delivery, ticketing, and billing |
| RMM | Remote Monitoring and Management | Tools for remote device monitoring and maintenance |
| NOC | Network Operations Center | Centralized facility for network monitoring |
| SOC | Security Operations Center | Centralized security monitoring and response |
| BDR | Backup and Disaster Recovery | Data protection and recovery solutions |
| BCDR | Business Continuity and Disaster Recovery | Comprehensive continuity planning |

### Service Concepts

| Term | Description |
|------|-------------|
| Break/Fix | Reactive service model billing per incident |
| Managed Services | Proactive service model with recurring fees |
| Co-Managed IT | Shared responsibility between MSP and internal IT |
| vCIO | Virtual Chief Information Officer consulting services |
| QBR | Quarterly Business Review meetings |
| SLA | Service Level Agreement defining response times |

### Ticket Management

| Term | Description |
|------|-------------|
| Service Request | User-initiated request for assistance |
| Incident | Unplanned service interruption |
| Problem | Root cause of one or more incidents |
| Change Request | Planned modification to systems |
| Escalation | Moving ticket to higher support tier |
| Triage | Initial assessment and prioritization |

### Billing Terms

| Term | Description |
|------|-------------|
| AYCE | All You Can Eat - unlimited support model |
| Block Hours | Pre-purchased support time blocks |
| T&M | Time and Materials billing |
| MRR | Monthly Recurring Revenue |
| ARR | Annual Recurring Revenue |
| Per-Device | Billing based on managed device count |
| Per-User | Billing based on supported user count |

### Asset Management

| Term | Description |
|------|-------------|
| CI | Configuration Item - any managed asset |
| CMDB | Configuration Management Database |
| EOL | End of Life - vendor support ending |
| EOS | End of Support - active support ending |
| Warranty | Manufacturer support coverage period |

## Skill File Location

```
.claude/skills/shared-msp-terminology.md
```

## Usage

This skill is automatically included when any MSP Claude Plugin is active. Claude will use this terminology knowledge when:

- Interpreting user requests
- Creating tickets and documentation
- Explaining concepts and recommendations
- Generating reports and summaries

### Example Interaction

**User:** Create a ticket for the client's EOL server that needs BCDR planning.

**Claude understands:**
- EOL = End of Life (server no longer supported by vendor)
- BCDR = Business Continuity and Disaster Recovery
- Creates appropriate ticket with correct categorization

## Extending Terminology

To add custom terminology for your organization:

1. Create a local skill file:
   ```
   .claude/skills/custom-terminology.md
   ```

2. Add your organization-specific terms:
   ```markdown
   # Custom MSP Terminology

   ## Internal Terms
   | Term | Description |
   |------|-------------|
   | Gold Client | Premium tier customer |
   | Red Alert | Critical system down |
   ```

3. Reference in your prompts:
   ```
   Claude, using our custom terminology, create a ticket for a Red Alert at a Gold Client.
   ```

## Related Skills

- [Ticket Triage](/msp-claude-plugins/plugins/shared/ticket-triage/) - Prioritization best practices
- [Autotask Plugin](/msp-claude-plugins/plugins/kaseya/autotask/) - Platform-specific terminology
- [ConnectWise Plugin](/msp-claude-plugins/plugins/connectwise/manage/) - Platform-specific terminology
