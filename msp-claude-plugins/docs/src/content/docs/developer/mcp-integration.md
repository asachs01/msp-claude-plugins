---
title: MCP Integration
description: How to configure and develop MCP server integrations for MSP Claude Plugins
---

MCP (Model Context Protocol) enables Claude to directly interact with PSA and RMM APIs. This guide covers configuring existing MCP servers and developing new ones.

## What is MCP?

Model Context Protocol is a standard that allows Claude to:

- **Read data** from external APIs (tickets, companies, contacts)
- **Write data** to external systems (create tickets, log time)
- **Execute actions** (send notifications, run reports)

MCP servers act as bridges between Claude and vendor APIs, handling authentication, rate limiting, and data transformation.

## MCP Configuration File

Each plugin that supports MCP has a `.mcp.json` file in its root directory.

### File Location

```
vendor/product/.mcp.json
```

### Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@vendor/mcp-server-name"],
      "env": {
        "API_USERNAME": "${VENDOR_USERNAME}",
        "API_KEY": "${VENDOR_API_KEY}",
        "API_ZONE": "${VENDOR_ZONE}"
      }
    }
  }
}
```

### Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `mcpServers` | object | Container for all MCP server definitions |
| `server-name` | string | Unique identifier for this server |
| `command` | string | Executable to run (usually `npx` or `node`) |
| `args` | array | Command-line arguments |
| `env` | object | Environment variables to pass |

## Autotask MCP Example

The Autotask plugin includes this MCP configuration:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["-y", "@msp-plugins/autotask-mcp-server"],
      "env": {
        "AUTOTASK_USERNAME": "${AUTOTASK_USERNAME}",
        "AUTOTASK_SECRET": "${AUTOTASK_SECRET}",
        "AUTOTASK_INTEGRATION_CODE": "${AUTOTASK_INTEGRATION_CODE}",
        "AUTOTASK_ZONE": "${AUTOTASK_ZONE}"
      }
    }
  }
}
```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTOTASK_USERNAME` | API user email | `api-user@company.com` |
| `AUTOTASK_SECRET` | API secret/password | `abc123...` |
| `AUTOTASK_INTEGRATION_CODE` | Integration tracking code | `MSPCLAUDEPLUGINS` |
| `AUTOTASK_ZONE` | API zone URL | `webservices5.autotask.net` |

## Environment Variable References

### Syntax

Use `${VARIABLE_NAME}` syntax to reference environment variables:

```json
{
  "env": {
    "API_KEY": "${MY_API_KEY}"
  }
}
```

### Setting Environment Variables

**macOS/Linux:**

```bash
# In ~/.bashrc, ~/.zshrc, or ~/.profile
export AUTOTASK_USERNAME="api-user@company.com"
export AUTOTASK_SECRET="your-secret-here"
export AUTOTASK_INTEGRATION_CODE="MSPCLAUDEPLUGINS"
export AUTOTASK_ZONE="webservices5.autotask.net"

# Reload shell
source ~/.bashrc
```

**Windows (PowerShell):**

```powershell
# Set for current session
$env:AUTOTASK_USERNAME = "api-user@company.com"
$env:AUTOTASK_SECRET = "your-secret-here"

# Set permanently (User level)
[Environment]::SetEnvironmentVariable("AUTOTASK_USERNAME", "api-user@company.com", "User")
```

**Windows (Command Prompt):**

```cmd
setx AUTOTASK_USERNAME "api-user@company.com"
setx AUTOTASK_SECRET "your-secret-here"
```

### Security Best Practices

1. **Never commit credentials** - Add `.env` to `.gitignore`
2. **Use environment variables** - Don't hardcode values in `.mcp.json`
3. **Limit API permissions** - Create dedicated API users with minimal access
4. **Rotate secrets regularly** - Update credentials periodically
5. **Use secrets managers** - Consider 1Password, HashiCorp Vault, etc.

## Testing MCP Tools

### Verify Configuration

1. Set environment variables
2. Navigate to plugin directory
3. Start Claude Code with the plugin

```bash
# Set credentials
export AUTOTASK_USERNAME="your-user"
export AUTOTASK_SECRET="your-secret"
export AUTOTASK_INTEGRATION_CODE="your-code"
export AUTOTASK_ZONE="your-zone"

# Navigate to plugin
cd msp-claude-plugins/kaseya/autotask

# Start Claude Code
claude --plugin .
```

### Test Basic Connectivity

Ask Claude to perform a simple read operation:

```
List the first 5 companies in Autotask
```

Expected behavior:
- Claude invokes the MCP server
- MCP server authenticates with Autotask API
- Returns list of companies

### Test Write Operations

**Caution:** Test write operations in a sandbox environment first.

```
Create a test ticket for company "Test Company" with title "MCP Integration Test"
```

### Troubleshooting

**MCP server not found:**
```
Error: Package @msp-plugins/autotask-mcp-server not found
```
Solution: Verify the npm package exists and is published.

**Authentication failed:**
```
Error: 401 Unauthorized
```
Solution: Verify environment variables are set correctly.

**Rate limited:**
```
Error: 429 Too Many Requests
```
Solution: MCP server should handle rate limiting; check implementation.

**Connection timeout:**
```
Error: ETIMEDOUT
```
Solution: Check network connectivity and API zone URL.

## Creating New MCP Servers

If an MCP server doesn't exist for your target API, you can create one.

### MCP Server Structure

```
mcp-server-vendorname/
├── package.json
├── src/
│   ├── index.ts          # Entry point
│   ├── server.ts         # MCP server implementation
│   ├── tools/            # Tool implementations
│   │   ├── tickets.ts
│   │   ├── companies.ts
│   │   └── ...
│   ├── api/              # API client
│   │   └── client.ts
│   └── types/            # TypeScript types
│       └── index.ts
├── README.md
└── tsconfig.json
```

### Package.json

```json
{
  "name": "@msp-plugins/vendorname-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Vendor API",
  "main": "dist/index.js",
  "bin": {
    "vendorname-mcp-server": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
```

### Basic Server Implementation

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "vendorname-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "search_tickets",
        description: "Search tickets in VendorName",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            limit: {
              type: "number",
              description: "Maximum results",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "search_tickets":
      return await searchTickets(args.query, args.limit);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### API Client Pattern

```typescript
// src/api/client.ts
export class VendorAPIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.VENDOR_API_URL || "";
    this.apiKey = process.env.VENDOR_API_KEY || "";

    if (!this.apiKey) {
      throw new Error("VENDOR_API_KEY environment variable required");
    }
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }
}
```

### Tool Implementation Example

```typescript
// src/tools/tickets.ts
import { VendorAPIClient } from "../api/client";

const client = new VendorAPIClient();

export async function searchTickets(query: string, limit: number = 10) {
  try {
    const results = await client.get(
      `/tickets?search=${encodeURIComponent(query)}&limit=${limit}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error searching tickets: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

export async function createTicket(data: {
  companyId: number;
  title: string;
  description?: string;
  priority?: number;
}) {
  try {
    const result = await client.post("/tickets", {
      company_id: data.companyId,
      title: data.title,
      description: data.description || "",
      priority: data.priority || 3,
      status: "new",
    });

    return {
      content: [
        {
          type: "text",
          text: `Ticket created: ${result.ticket_number}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error creating ticket: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
```

### Publishing

1. Build the package: `npm run build`
2. Test locally: `npm link` and test with Claude
3. Publish to npm: `npm publish --access public`

### Documentation Requirements

Every MCP server should include:

1. **README.md** with:
   - Installation instructions
   - Required environment variables
   - Available tools and their parameters
   - Usage examples

2. **Tool documentation** for each tool:
   - Description
   - Input schema
   - Output format
   - Error cases

## MCP Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

## Next Steps

- [Creating Skills](/msp-claude-plugins/developer/creating-skills/) - Document MCP tools in skills
- [Creating Commands](/msp-claude-plugins/developer/creating-commands/) - Build commands that use MCP
- [Testing Guide](/msp-claude-plugins/developer/testing/) - Test MCP integrations
