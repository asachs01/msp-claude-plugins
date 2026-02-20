# MSP Claude Plugins

> One command to supercharge Claude Code for MSP workflows.

```
/plugin marketplace add wyre-technology/msp-claude-plugins
```

Then restart Claude Code. That's it.

**Documentation:** [mcp.wyretechnology.com](https://mcp.wyretechnology.com)

---

## What you get

Twelve vendor-specific plugins with domain knowledge for PSA, RMM, documentation, and CRM tools:

| Plugin | Description |
|--------|-------------|
| **Autotask PSA** | Kaseya Autotask PSA - tickets, CRM, projects, contracts, billing |
| **Datto RMM** | Datto remote monitoring - devices, alerts, jobs, patches |
| **IT Glue** | IT documentation - organizations, assets, passwords, flexible assets |
| **Syncro** | All-in-one PSA/RMM - tickets, customers, assets, invoicing |
| **Atera** | RMM/PSA platform - tickets, agents, customers, alerts, SNMP/HTTP monitors |
| **SuperOps.ai** | Modern PSA/RMM with GraphQL - tickets, assets, clients, runbooks |
| **HaloPSA** | Enterprise PSA with OAuth - tickets, clients, assets, contracts |
| **Liongard** | Configuration monitoring - environments, inspections, systems, detections, alerts |
| **ConnectWise PSA** | Industry-leading PSA - tickets, companies, contacts, projects, time |
| **ConnectWise Automate** | Enterprise RMM - computers, clients, scripts, monitors, alerts |
| **NinjaOne** | NinjaOne RMM - devices, organizations, alerts, ticketing |
| **SalesBuildr** | Sales CRM - contacts, companies, opportunities, quotes |

Plus shared skills for MSP terminology and ticket triage best practices.

### Plugin Maturity

| Plugin | Status | MCP Server |
|--------|--------|------------|
| **Autotask PSA** | ✅ Production | [autotask-mcp](https://github.com/wyre-technology/autotask-mcp) |
| **Datto RMM** | 🔨 Beta | [datto-rmm-mcp](https://github.com/wyre-technology/datto-rmm-mcp) |
| **IT Glue** | 🔨 Beta | [itglue-mcp](https://github.com/wyre-technology/itglue-mcp) |
| **Syncro** | 🔨 Beta | [syncro-mcp](https://github.com/wyre-technology/syncro-mcp) |
| **Atera** | 🔨 Beta | [atera-mcp](https://github.com/wyre-technology/atera-mcp) |
| **SuperOps.ai** | 🔨 Beta | [superops-mcp](https://github.com/wyre-technology/superops-mcp) |
| **HaloPSA** | 🔨 Beta | [halopsa-mcp](https://github.com/wyre-technology/halopsa-mcp) |
| **Liongard** | 🔨 Beta | [liongard-mcp](https://github.com/wyre-technology/liongard-mcp) |
| **ConnectWise PSA** | 🔨 Beta | [connectwise-manage-mcp](https://github.com/wyre-technology/connectwise-manage-mcp) |
| **ConnectWise Automate** | 🔨 Beta | [connectwise-automate-mcp](https://github.com/wyre-technology/connectwise-automate-mcp) |
| **NinjaOne** | 🔨 Beta | [ninjaone-mcp](https://github.com/wyre-technology/ninjaone-mcp) |
| **SalesBuildr** | 🚧 Alpha | [salesbuildr-mcp](https://github.com/wyre-technology/salesbuildr-mcp) |

> Maturity levels: ✅ **Production** — used in real MSP environments with comprehensive coverage. 🔨 **Beta** — functional with core features, feedback welcome. 🚧 **Alpha** — early implementation, expect gaps.

---

## Two Ways to Connect

### Hosted Gateway (Recommended)

Use the [MCP Gateway](https://mcp.wyretechnology.com) to connect your MSP tools to Claude Desktop with zero infrastructure. OAuth 2.1 + PKCE authentication, encrypted credential storage, and all 12 vendors available immediately.

[Get Started Free](https://mcp.wyretechnology.com/waitlist)

### Self-Hosted

Run MCP servers yourself for full control. Each server is available as an npm package, Docker image, or MCPB bundle for Claude Desktop.

See the [Getting Started guide](https://mcp.wyretechnology.com/getting-started/) for installation instructions.

---

## How it works

Plugins are just markdown files. They provide:

- **Skills** — Domain knowledge Claude references when helping you (API patterns, field mappings, rate limits)
- **Commands** — Slash commands like `/create-ticket` and `/search-tickets`

When you ask "create a high priority ticket for Acme Corp", Claude knows:
- Which API endpoint to call
- What priority values mean (varies by vendor!)
- How to authenticate
- Rate limit boundaries

---

## Architecture

Each plugin consists of three layers:

1. **Skills** — Markdown files with domain knowledge (API patterns, field mappings,
   vendor terminology). Low maintenance, easy to contribute to.
2. **Commands** — Slash commands for common MSP workflows. Moderate complexity.
3. **MCP Servers** — Full server implementations that connect Claude to vendor APIs.
   These handle authentication, rate limiting, and data transformation.

Most contributions touch skills and commands. MCP server changes are more involved
and benefit from familiarity with the vendor's API.

---

## Individual plugins

Want just one vendor? Install individually:

```
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin autotask
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin syncro
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin halopsa
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin liongard
```

---

## Configuration

Each plugin uses environment variables for authentication. See the plugin's README:

- [Autotask](msp-claude-plugins/kaseya/autotask/README.md) — API key + integration code
- [Datto RMM](msp-claude-plugins/kaseya/datto-rmm/README.md) — API key header
- [IT Glue](msp-claude-plugins/kaseya/it-glue/README.md) — API key header
- [Syncro](msp-claude-plugins/syncro/syncro-msp/README.md) — API key query param
- [Atera](msp-claude-plugins/atera/atera/README.md) — X-API-KEY header
- [SuperOps.ai](msp-claude-plugins/superops/superops-ai/README.md) — Bearer token
- [HaloPSA](msp-claude-plugins/halopsa/halopsa/README.md) — OAuth 2.0 client credentials
- [Liongard](msp-claude-plugins/liongard/liongard/README.md) — Access Key ID + Secret (X-ROAR-API-KEY)
- [ConnectWise PSA](msp-claude-plugins/connectwise/manage/README.md) — Public/private key + client ID
- [ConnectWise Automate](msp-claude-plugins/connectwise/automate/README.md) — Integrator credentials
- [NinjaOne](msp-claude-plugins/ninjaone/ninjaone-rmm/README.md) — OAuth 2.0 client credentials
- [SalesBuildr](msp-claude-plugins/salesbuildr/salesbuildr/README.md) — API key

---

## Contributing

We welcome contributions at every level — from typo fixes to new platform plugins.
See [CONTRIBUTING.md](CONTRIBUTING.md) for our tiered contribution guide.

## Community

This project is maintained by [WYRE Technology](https://wyretechnology.com), a Chattanooga-based
MSP focused on AI enablement.

- **Questions or feedback?** Open a [Discussion](https://github.com/wyre-technology/msp-claude-plugins/discussions)
- **Found a bug?** File an [Issue](https://github.com/wyre-technology/msp-claude-plugins/issues)
- **Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Using this in your MSP?** We'd love to hear about it — drop us a note in Discussions

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

Built by MSPs, for MSPs.
