# ConnectWise Automate Plugin PRD

## Overview

Claude Code plugin for ConnectWise Automate - enterprise RMM platform for endpoint monitoring and automation.

## Product Details

| Attribute | Value |
|-----------|-------|
| Vendor | ConnectWise |
| Product | Automate (LabTech) |
| API Type | REST |
| Auth Method | Integrator Credentials or User + 2FA |
| Rate Limit | ~60 requests/minute |
| Node.js Library | `connectwise-rest` (existing, TypeScript) |

## API Endpoints

Base URL: `https://{automate-server}/cwa/api/v1/`

## Skills to Implement

### 1. computers
Endpoint/device management:
- Computer listing and details
- Computer status (online/offline)
- Hardware/software inventory
- Patch status
- Antivirus status

### 2. clients
Client organization management:
- Client CRUD
- Client locations
- Client-level settings
- Client groups

### 3. scripts
Automation script management:
- Script listing
- Script execution on endpoints
- Script parameters
- Execution history/results

### 4. monitors
Monitoring configuration:
- Monitor types
- Alert thresholds
- Monitor templates
- Monitor assignments

### 5. alerts
Alert management:
- Active alerts listing
- Alert acknowledgment
- Alert history
- Alert-to-ticket creation

### 6. api-patterns
Common API patterns:
- Authentication methods
- Pagination
- Filtering
- Error handling

## Commands to Implement

### /list-computers
List computers with filters:
- Client
- Location
- Online status
- OS type

### /run-script
Execute script on endpoint:
- Computer selection
- Script selection
- Parameter passing
- Result waiting

## Environment Variables

```bash
CONNECTWISE_AUTOMATE_SERVER="your-automate-server.com"
CONNECTWISE_AUTOMATE_USERNAME="integrator-username"
CONNECTWISE_AUTOMATE_PASSWORD="integrator-password"
# OR for user auth:
CONNECTWISE_AUTOMATE_USER="username"
CONNECTWISE_AUTOMATE_PASS="password"
CONNECTWISE_AUTOMATE_2FA="optional-2fa-key"
```

## Directory Structure

```
connectwise/automate/
├── .claude-plugin/
│   └── plugin.json
├── README.md
├── prd/
│   └── connectwise-automate-plugin-prd.md
├── skills/
│   ├── computers/SKILL.md
│   ├── clients/SKILL.md
│   ├── scripts/SKILL.md
│   ├── monitors/SKILL.md
│   ├── alerts/SKILL.md
│   └── api-patterns/SKILL.md
├── commands/
│   ├── list-computers.md
│   └── run-script.md
└── agents/
```

## References

- [ConnectWise Developer Portal](https://developer.connectwise.com/)
- [connectwise-rest npm](https://www.npmjs.com/package/connectwise-rest)
- [ConnectWise Automate API](https://developer.connectwise.com/Products/ConnectWise_Automate)
