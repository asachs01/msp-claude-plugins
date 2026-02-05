# Hosted MCP Servers PRD

> Version: 1.0.0
> Created: 2026-02-05
> Status: Draft - Awaiting Review

## Overview

This PRD defines the architecture and implementation plan for hosted MCP servers that enable Claude Desktop (and Claude Code) users to connect to MSP tools via OAuth, matching the experience of Anthropic's first-party integrations (Slack, Atlassian, Notion).

### Current State

- **autotask-mcp**: Local MCP server exists, requires API keys in config
- **Other vendors**: No MCP servers, commands use curl with env vars
- **User experience**: Copy/paste API credentials into settings.json

### Target State

- Hosted MCP servers at `mcp.{vendor}.wyreworkspace.com` (or similar)
- OAuth authentication flow - users click "Connect" and authorize via browser
- No local API key management required
- Works seamlessly with Claude Desktop and Claude Code

---

## Architecture

### High-Level Flow

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Claude Desktop │────▶│  Hosted MCP Server   │────▶│  Vendor API     │
│  or Claude Code │     │  (mcp.autotask.wyre) │     │  (Autotask API) │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
        │                        │
        │                        ▼
        │               ┌──────────────────────┐
        └──────────────▶│  OAuth Provider      │
           (browser)    │  (vendor's OAuth)    │
                        └──────────────────────┘
```

### MCP Server Types by Auth Pattern

| Vendor | Auth Type | OAuth Support | Implementation Complexity |
|--------|-----------|---------------|---------------------------|
| Autotask | API Key + Secret | No native OAuth | Medium - proxy with stored creds |
| Datto RMM | API Key + Secret | No native OAuth | Medium - proxy with stored creds |
| IT Glue | API Key | No native OAuth | Low - proxy with stored creds |
| Syncro | API Key | No native OAuth | Low - proxy with stored creds |
| Atera | API Key | No native OAuth | Low - proxy with stored creds |
| SuperOps | Bearer Token | No native OAuth | Low - proxy with stored creds |
| HaloPSA | OAuth 2.0 | **Yes** | Low - native OAuth passthrough |
| ConnectWise PSA | API Key + Client ID | No native OAuth | Medium - proxy with stored creds |
| ConnectWise Automate | Token-based | No native OAuth | Medium - proxy with stored creds |

### The OAuth Challenge

Most MSP vendors don't support OAuth - they use API keys. Our hosted MCP servers must:

1. **Implement our own OAuth layer** - Users authenticate with our service
2. **Securely store vendor credentials** - Encrypted at rest, per-user
3. **Proxy requests** - MCP server uses stored credentials to call vendor APIs

```
User ──OAuth──▶ Our Auth ──stores──▶ User's API Keys ──▶ Vendor API
```

---

## Implementation Priority

### Phase 1: Kaseya Stack (Validated Vendors)

Priority order based on:
- Autotask MCP already exists (adapt to hosted)
- Datto RMM and IT Glue complete the Kaseya trifecta
- These are "validated" plugins with production testing

| Priority | Vendor | Effort | Notes |
|----------|--------|--------|-------|
| P0 | **Datto RMM** | Medium | Most requested RMM, critical for Kaseya users |
| P0 | **IT Glue** | Low | Documentation platform, simple API key auth |
| P1 | **Autotask** | Low | Adapt existing autotask-mcp to hosted model |

### Phase 2: Community Vendors

| Priority | Vendor | Effort | Notes |
|----------|--------|--------|-------|
| P1 | HaloPSA | Low | Native OAuth - cleanest implementation |
| P2 | Syncro | Low | Simple API key |
| P2 | Atera | Low | Simple API key |
| P2 | SuperOps | Low | Bearer token |
| P2 | ConnectWise PSA | Medium | Multiple auth components |
| P3 | ConnectWise Automate | Medium | Token-based, complex |

---

## Technical Specifications

### Infrastructure Requirements

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloud Infrastructure                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ MCP Server  │  │ MCP Server  │  │ MCP Server  │  ...    │
│  │ (Autotask)  │  │ (Datto RMM) │  │ (IT Glue)   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Shared Auth Service                     │   │
│  │  - OAuth 2.0 provider (our own)                     │   │
│  │  - User session management                          │   │
│  │  - Credential encryption/storage                    │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Secure Credential Store                 │   │
│  │  - Per-user encrypted API keys                      │   │
│  │  - Tenant isolation                                 │   │
│  │  - Audit logging                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack (Recommended)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| MCP Servers | Node.js/TypeScript | MCP SDK is TypeScript-native |
| Auth Service | OAuth 2.0 (self-hosted) | Industry standard |
| Credential Store | AWS Secrets Manager or Vault | Enterprise-grade encryption |
| Hosting | AWS Lambda + API Gateway | Serverless, scales to zero |
| Database | DynamoDB or PostgreSQL | User sessions, audit logs |

### MCP Server Endpoint Format

Following Anthropic's pattern:
```
https://mcp.autotask.wyreworkspace.com/mcp
https://mcp.datto-rmm.wyreworkspace.com/mcp
https://mcp.itglue.wyreworkspace.com/mcp
```

Or consolidated:
```
https://mcp.wyreworkspace.com/autotask/mcp
https://mcp.wyreworkspace.com/datto-rmm/mcp
https://mcp.wyreworkspace.com/itglue/mcp
```

---

## User Experience

### First-Time Connection (Claude Desktop)

1. User installs MSP plugin
2. Plugin's `.mcp.json` references hosted server:
   ```json
   {
     "mcpServers": {
       "datto-rmm": {
         "type": "http",
         "url": "https://mcp.wyreworkspace.com/datto-rmm/mcp"
       }
     }
   }
   ```
3. Claude Desktop detects unauthenticated state
4. User clicks "Connect Datto RMM"
5. Browser opens → Our OAuth login page
6. User enters their Datto RMM API credentials (one time)
7. Credentials stored securely, session established
8. Claude Desktop now has access to Datto RMM tools

### Subsequent Usage

- Session persists (refresh tokens)
- No re-authentication required
- User can revoke access via settings page

### Credential Entry Page (Our OAuth Flow)

Since vendors don't have OAuth, we provide a secure credential entry page:

```
┌─────────────────────────────────────────────┐
│         Connect Datto RMM                   │
├─────────────────────────────────────────────┤
│                                             │
│  API Key:     [____________________]        │
│  API Secret:  [____________________]        │
│  Platform:    [concord-api ▼      ]         │
│                                             │
│  Your credentials are encrypted and stored  │
│  securely. We never see your raw keys.      │
│                                             │
│  [Get API Keys from Datto]  [Connect]       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Security Considerations

### Credential Storage

- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Key derivation**: Per-user encryption keys derived from master key
- **No plaintext**: Credentials never stored unencrypted
- **Audit logging**: All access logged with timestamps

### Tenant Isolation

- Each user's credentials isolated
- No cross-user data access
- Rate limiting per user

### Compliance

- SOC 2 Type II considerations
- GDPR data residency options (EU hosting)
- Right to deletion (user can remove all stored credentials)

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Credential breach | Encryption + HSM key management |
| API key rotation | Users can update credentials anytime |
| Service outage | Fallback to local MCP server mode |
| Vendor API changes | Versioned MCP servers, graceful degradation |

---

## Datto RMM MCP Server Specification

### Tools to Implement

Based on Datto RMM API capabilities:

| Tool | Description | API Endpoint |
|------|-------------|--------------|
| `datto_list_devices` | List devices with filters | GET /api/v2/account/devices |
| `datto_get_device` | Get device details | GET /api/v2/device/{uid} |
| `datto_list_alerts` | List open alerts | GET /api/v2/account/alerts |
| `datto_resolve_alert` | Resolve an alert | POST /api/v2/alert/{uid}/resolve |
| `datto_list_sites` | List all sites | GET /api/v2/account/sites |
| `datto_get_site` | Get site details | GET /api/v2/site/{uid} |
| `datto_run_quickjob` | Execute a quick job | POST /api/v2/device/{uid}/quickjob |
| `datto_get_audit` | Get device audit data | GET /api/v2/device/{uid}/audit/{type} |

### Authentication

```
Base URL: https://{platform}-api.centrastage.net
Headers:
  Authorization: Bearer {api_key}:{api_secret}
```

---

## IT Glue MCP Server Specification

### Tools to Implement

| Tool | Description | API Endpoint |
|------|-------------|--------------|
| `itglue_search_organizations` | Search organizations | GET /organizations |
| `itglue_get_organization` | Get org details | GET /organizations/{id} |
| `itglue_search_configurations` | Search assets | GET /configurations |
| `itglue_get_configuration` | Get asset details | GET /configurations/{id} |
| `itglue_search_passwords` | Search passwords | GET /passwords |
| `itglue_get_password` | Get password (with audit) | GET /passwords/{id} |
| `itglue_search_documents` | Search documents | GET /documents |
| `itglue_search_flexible_assets` | Search flexible assets | GET /flexible_assets |

### Authentication

```
Base URL: https://api.itglue.com
Headers:
  x-api-key: {api_key}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Connection success rate | > 95% |
| Auth flow completion | < 60 seconds |
| API latency overhead | < 100ms added |
| Credential storage security | Zero breaches |
| User adoption | 50% of plugin users connect within 30 days |

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up infrastructure (AWS/hosting)
- [ ] Implement shared auth service
- [ ] Implement secure credential store
- [ ] Create credential entry UI

### Phase 2: Datto RMM (Weeks 3-4)
- [ ] Build datto-rmm-mcp server
- [ ] Implement all Datto RMM tools
- [ ] Integration testing
- [ ] Deploy to production

### Phase 3: IT Glue (Weeks 4-5)
- [ ] Build itglue-mcp server
- [ ] Implement all IT Glue tools
- [ ] Integration testing
- [ ] Deploy to production

### Phase 4: Autotask Migration (Week 5-6)
- [ ] Adapt existing autotask-mcp to hosted model
- [ ] Migration path for existing users
- [ ] Deploy hosted version

### Phase 5: Community Vendors (Weeks 6+)
- [ ] HaloPSA (native OAuth)
- [ ] Syncro, Atera, SuperOps
- [ ] ConnectWise stack

---

## Open Questions

1. **Domain**: `wyreworkspace.com`? `msp-mcp.com`? `mcp.{yourdomain}`?
2. **Pricing**: Free tier? Per-user? Per-organization?
3. **Self-hosting option**: Provide Docker images for on-prem deployment?
4. **Local fallback**: Keep local MCP server option for air-gapped environments?
5. **Multi-tenant**: Support MSP managing multiple client credentials?

---

## Dependencies

- MCP SDK (TypeScript)
- Existing node libraries: node-datto-rmm, node-it-glue (if usable)
- Cloud infrastructure account
- Domain and SSL certificates
- OAuth provider setup

---

## References

- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- [Datto RMM API Docs](https://rmm.datto.com/help/en/Content/2SETUP/APIv2.htm)
- [IT Glue API Docs](https://api.itglue.com/developer/)
- [Autotask REST API Docs](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
