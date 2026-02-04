---
title: Roadmap
description: Development roadmap and planned features for MSP Claude Plugins
sidebar:
  order: 2
---

This roadmap outlines our development plans for MSP Claude Plugins. Items are subject to change based on community feedback and priorities.

---

## Current Release

### v1.0.0 - Autotask Foundation

**Status**: Released
**Date**: February 2024

The initial release establishes the foundation with comprehensive Autotask PSA support.

| Feature | Status |
|---------|--------|
| Autotask Company Management | Complete |
| Autotask Contact Management | Complete |
| Autotask Ticket Management | Complete |
| Autotask Time Entry | Complete |
| Autotask Project Management | Complete |
| Autotask Task Management | Complete |
| Autotask Configuration Items | Complete |
| Autotask Contracts | Complete |
| Autotask Invoices | Complete |
| Autotask Expense Reports | Complete |
| Autotask Quotes | Complete |
| Documentation Site | Complete |
| Contribution Framework | Complete |

---

## Planned Releases

### v1.1.0 - ConnectWise Manage

**Status**: In Development
**Target**: Q1 2024

ConnectWise Manage integration brings support for one of the most popular PSA platforms.

| Feature | Status | Priority |
|---------|--------|----------|
| CW Company Management | Planned | High |
| CW Contact Management | Planned | High |
| CW Ticket Management | Planned | High |
| CW Time Entry | Planned | High |
| CW Project Management | Planned | Medium |
| CW Agreement Management | Planned | Medium |
| CW Configuration Management | Planned | Medium |
| CW Invoice Management | Planned | Low |

**PRD**: [connectwise-manage-plugin.md](https://github.com/wyre-engineering/msp-claude-plugins/blob/main/prds/in-review/connectwise-manage-plugin.md)

---

### v1.2.0 - Documentation Platforms

**Status**: Planning
**Target**: Q2 2024

Integration with IT documentation platforms for knowledge management.

#### IT Glue

| Feature | Status | Priority |
|---------|--------|----------|
| Organization Search | Planned | High |
| Password Retrieval | Planned | High |
| Document Search | Planned | High |
| Configuration Search | Planned | Medium |
| Flexible Asset Management | Planned | Medium |

#### Hudu

| Feature | Status | Priority |
|---------|--------|----------|
| Company Search | Planned | High |
| Password Management | Planned | High |
| Article Search | Planned | Medium |
| Asset Management | Planned | Medium |

---

### v1.3.0 - RMM Integration

**Status**: Research
**Target**: Q3 2024

Remote Monitoring and Management (RMM) platform support.

#### Datto RMM

| Feature | Status | Priority |
|---------|--------|----------|
| Device Search | Research | High |
| Alert Management | Research | High |
| Quick Jobs | Research | Medium |
| Component Monitors | Research | Medium |

#### NinjaOne (formerly NinjaRMM)

| Feature | Status | Priority |
|---------|--------|----------|
| Device Management | Research | High |
| Alert Management | Research | High |
| Scripting | Research | Medium |
| Patching Status | Research | Medium |

---

## Future Considerations

These items are under consideration for future releases. Priority will be determined by community interest.

### PSA Platforms

| Platform | Interest Level | Notes |
|----------|---------------|-------|
| HaloPSA | High | Growing MSP adoption |
| Syncro | Medium | All-in-one platform |
| Kaseya BMS | Medium | Enterprise focused |
| ServiceNow | Low | Enterprise IT focus |

### RMM Platforms

| Platform | Interest Level | Notes |
|----------|---------------|-------|
| Kaseya VSA | Medium | Large install base |
| Atera | Medium | All-in-one approach |
| N-able N-central | Medium | Enterprise MSPs |
| ConnectWise Automate | High | ScreenConnect integration |

### Documentation Platforms

| Platform | Interest Level | Notes |
|----------|---------------|-------|
| Passportal | Medium | SolarWinds ecosystem |
| ITBoost | Low | ConnectWise ecosystem |

### Other Integrations

| Platform | Category | Interest Level |
|----------|----------|---------------|
| Microsoft 365 Admin | Cloud | High |
| Microsoft Graph API | Cloud | High |
| Azure AD | Identity | Medium |
| Duo Security | Security | Medium |
| Acronis | Backup | Low |
| Veeam | Backup | Low |
| Pax8 | Marketplace | Medium |

---

## How to Influence the Roadmap

### Vote on Features

Visit our [GitHub Discussions](https://github.com/wyre-engineering/msp-claude-plugins/discussions/categories/feature-requests) to vote on features you want to see prioritized.

### Submit a PRD

Have a specific integration in mind? Submit a PRD:

1. Review the [PRD Requirements](/contributing/prd-requirements/)
2. Create your PRD using the template
3. Submit a PR to `prds/in-review/`
4. Engage in the review process

### Contribute Code

Want to implement a feature yourself?

1. Review [How to Contribute](/contributing/how-to-contribute/)
2. Ensure a PRD exists and is approved
3. Fork the repository and implement
4. Submit a PR for review

---

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fixes | Patch | 1.0.0 -> 1.0.1 |
| New features (backward compatible) | Minor | 1.0.0 -> 1.1.0 |
| Breaking changes | Major | 1.0.0 -> 2.0.0 |

### Release Cadence

| Release Type | Frequency |
|--------------|-----------|
| Patch releases | As needed for critical fixes |
| Minor releases | Monthly |
| Major releases | Quarterly (or as needed) |

### Release Checklist

Each release goes through:

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Security review complete
- [ ] Performance benchmarks acceptable
- [ ] Migration guide (if breaking changes)

---

## Feedback

Have thoughts on the roadmap? We want to hear from you:

- [GitHub Discussions](https://github.com/wyre-engineering/msp-claude-plugins/discussions)
- [Discord Community](https://discord.gg/msp-claude-plugins)
- [Email](mailto:feedback@msp-claude-plugins.dev)
