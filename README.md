# MSP Claude Plugins

> One command to supercharge Claude Code for MSP workflows.

```
/plugin marketplace add wyre-technology/msp-claude-plugins
```

Then restart Claude Code. That's it.

---

## What you get

Nine vendor-specific plugins with domain knowledge for PSA, RMM, and documentation tools:

| Plugin | Description |
|--------|-------------|
| **Autotask** | Kaseya Autotask PSA - tickets, CRM, projects, contracts, billing |
| **Datto RMM** | Datto remote monitoring - devices, alerts, jobs, patches |
| **IT Glue** | IT documentation - organizations, assets, passwords, flexible assets |
| **Syncro** | All-in-one PSA/RMM - tickets, customers, assets, invoicing |
| **Atera** | RMM/PSA platform - tickets, agents, customers, alerts, SNMP/HTTP monitors |
| **SuperOps.ai** | Modern PSA/RMM with GraphQL - tickets, assets, clients, runbooks |
| **HaloPSA** | Enterprise PSA with OAuth - tickets, clients, assets, contracts |
| **ConnectWise PSA** | Industry-leading PSA - tickets, companies, contacts, projects, time |
| **ConnectWise Automate** | Enterprise RMM - computers, clients, scripts, monitors, alerts |
| **NinjaOne** | NinjaOne RMM - devices, organizations, alerts, ticketing |

Plus shared skills for MSP terminology and ticket triage best practices.

### Plugin Maturity

| Plugin | Status | Notes |
|--------|--------|-------|
| **Autotask PSA** | ✅ Production | Deep coverage, MCP server, actively used |
| **Datto RMM** | 🔨 Beta | Core functionality, MCP server available |
| **IT Glue** | 🔨 Beta | Core functionality, MCP server available |
| **Syncro** | 🔨 Beta | Core functionality, MCP server available |
| **Atera** | 🔨 Beta | Core functionality, MCP server available |
| **SuperOps.ai** | 🔨 Beta | Core functionality, MCP server available |
| **HaloPSA** | 🔨 Beta | Core functionality, MCP server available |
| **ConnectWise PSA** | 🚧 Alpha | Initial implementation |
| **ConnectWise Automate** | 🚧 Alpha | Initial implementation |
| **NinjaOne** | 🚧 Alpha | Initial implementation |

> Maturity levels: ✅ **Production** — used in real MSP environments with comprehensive coverage. 🔨 **Beta** — functional with core features, feedback welcome. 🚧 **Alpha** — early implementation, expect gaps.

> **New here?** The [Autotask PSA plugin](msp-claude-plugins/kaseya/autotask/) is our most
> mature integration with comprehensive ticket management, CRM, project, contract, and billing
> coverage. It's a great place to start and see what's possible. Other plugins are modeled after it.

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
- [ConnectWise PSA](msp-claude-plugins/connectwise/manage/README.md) — Public/private key + client ID
- [ConnectWise Automate](msp-claude-plugins/connectwise/automate/README.md) — Integrator credentials

---

## Contributing

We welcome contributions at every level — from typo fixes to new platform plugins.
See [CONTRIBUTING.md](CONTRIBUTING.md) for our tiered contribution guide.

## Community

This project is maintained by [WYRE Technology](https://wyre.technology), a Chattanooga-based
MSP focused on AI enablement.

- **Questions or feedback?** Open a [Discussion](https://github.com/wyre-technology/msp-claude-plugins/discussions)
- **Found a bug?** File an [Issue](https://github.com/wyre-technology/msp-claude-plugins/issues)
- **Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Using this in your MSP?** We'd love to hear about it — drop us a note in Discussions

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

Built by MSPs, for MSPs.
