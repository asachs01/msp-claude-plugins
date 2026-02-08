export interface McpServer {
  id: string;
  name: string;
  npmPackage: string;
  description: string;
  category: 'psa' | 'rmm' | 'documentation';
  repoUrl: string;
  companionPluginId?: string;
  envVars: EnvVar[];
  domains: Domain[];
  architecture: string;
  installCommand: string;
  dockerAvailable: boolean;
  rateLimit?: string;
}

export interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

export interface Domain {
  name: string;
  description: string;
  tools: Tool[];
}

export interface Tool {
  name: string;
  description: string;
}

export const mcpServers: McpServer[] = [
  {
    id: 'connectwise-automate',
    name: 'ConnectWise Automate MCP',
    npmPackage: '@wyre-technology/connectwise-automate-mcp',
    description: 'MCP server for ConnectWise Automate RMM with decision tree architecture for managing computers, clients, alerts, and scripts.',
    category: 'rmm',
    repoUrl: 'https://github.com/wyre-technology/connectwise-automate-mcp',
    companionPluginId: 'connectwise-automate',
    envVars: [
      { name: 'CW_AUTOMATE_SERVER_URL', required: true, description: 'Your ConnectWise Automate server URL' },
      { name: 'CW_AUTOMATE_CLIENT_ID', required: true, description: 'Integrator Client ID' },
      { name: 'CW_AUTOMATE_USERNAME', required: true, description: 'Integrator username or user credentials' },
      { name: 'CW_AUTOMATE_PASSWORD', required: true, description: 'Integrator password or user password' },
      { name: 'CW_AUTOMATE_2FA_CODE', required: false, description: 'Two-factor authentication code (if required)' }
    ],
    domains: [
      {
        name: 'Computers',
        description: 'Manage endpoints, search by criteria, reboot, and run scripts.',
        tools: [
          { name: 'List computers', description: 'List computers with filtering options' },
          { name: 'Get computer details', description: 'Get detailed computer information' },
          { name: 'Search computers', description: 'Search computers by name or criteria' },
          { name: 'Reboot computer', description: 'Reboot a computer remotely' },
          { name: 'Run script', description: 'Execute scripts on computers' }
        ]
      },
      {
        name: 'Clients',
        description: 'Manage customer/client records.',
        tools: [
          { name: 'List clients', description: 'List all clients' },
          { name: 'Get client details', description: 'Get client information' },
          { name: 'Create client', description: 'Create a new client' },
          { name: 'Update client', description: 'Update existing client' }
        ]
      },
      {
        name: 'Alerts',
        description: 'Monitor and manage alerts from devices.',
        tools: [
          { name: 'List alerts', description: 'List alerts with filtering' },
          { name: 'Get alert details', description: 'Get detailed alert information' },
          { name: 'Acknowledge alert', description: 'Acknowledge an alert' }
        ]
      },
      {
        name: 'Scripts',
        description: 'Manage and execute automation scripts.',
        tools: [
          { name: 'List scripts', description: 'List available scripts' },
          { name: 'Get script details', description: 'Get script information' },
          { name: 'Execute script', description: 'Run a script on a computer' }
        ]
      }
    ],
    architecture: 'Decision tree with lazy-loaded domain handlers. Navigate to a domain first, then use domain-specific tools.',
    installCommand: 'npx @wyre-technology/connectwise-automate-mcp',
    dockerAvailable: false,
    rateLimit: '60 requests per minute'
  },
  {
    id: 'ninjaone',
    name: 'NinjaOne MCP',
    npmPackage: '@wyre-technology/ninjaone-mcp',
    description: 'MCP server for NinjaOne (NinjaRMM) with hierarchical tool loading for managing devices, organizations, alerts, and tickets.',
    category: 'rmm',
    repoUrl: 'https://github.com/wyre-technology/ninjaone-mcp',
    companionPluginId: 'ninjaone-rmm',
    envVars: [
      { name: 'NINJAONE_CLIENT_ID', required: true, description: 'OAuth 2.0 Client ID' },
      { name: 'NINJAONE_CLIENT_SECRET', required: true, description: 'OAuth 2.0 Client Secret' },
      { name: 'NINJAONE_REGION', required: false, description: 'Region: us (default), eu, or oc' }
    ],
    domains: [
      {
        name: 'Devices',
        description: 'Manage endpoints, reboot devices, view services and alerts.',
        tools: [
          { name: 'ninjaone_devices_list', description: 'List devices with filters' },
          { name: 'ninjaone_devices_get', description: 'Get device details' },
          { name: 'ninjaone_devices_reboot', description: 'Schedule a device reboot' },
          { name: 'ninjaone_devices_services', description: 'List Windows services on a device' },
          { name: 'ninjaone_devices_alerts', description: 'Get device-specific alerts' },
          { name: 'ninjaone_devices_activities', description: 'View device activity log' }
        ]
      },
      {
        name: 'Organizations',
        description: 'Manage customer organizations and their resources.',
        tools: [
          { name: 'ninjaone_organizations_list', description: 'List organizations' },
          { name: 'ninjaone_organizations_get', description: 'Get organization details' },
          { name: 'ninjaone_organizations_create', description: 'Create a new organization' },
          { name: 'ninjaone_organizations_locations', description: 'List organization locations' },
          { name: 'ninjaone_organizations_devices', description: 'List devices for an organization' }
        ]
      },
      {
        name: 'Alerts',
        description: 'View and manage alerts across all devices.',
        tools: [
          { name: 'ninjaone_alerts_list', description: 'List alerts with filters' },
          { name: 'ninjaone_alerts_reset', description: 'Reset/dismiss a single alert' },
          { name: 'ninjaone_alerts_reset_all', description: 'Reset all alerts for a device or org' },
          { name: 'ninjaone_alerts_summary', description: 'Get alert count summary' }
        ]
      },
      {
        name: 'Tickets',
        description: 'Manage service tickets.',
        tools: [
          { name: 'ninjaone_tickets_list', description: 'List tickets with filters' },
          { name: 'ninjaone_tickets_get', description: 'Get ticket details' },
          { name: 'ninjaone_tickets_create', description: 'Create a new ticket' },
          { name: 'ninjaone_tickets_update', description: 'Update an existing ticket' },
          { name: 'ninjaone_tickets_add_comment', description: 'Add a comment to a ticket' },
          { name: 'ninjaone_tickets_comments', description: 'Get ticket comments' }
        ]
      }
    ],
    architecture: 'Hierarchical tool loading with navigation-based domain selection and lazy-loaded handlers.',
    installCommand: 'npx @wyre-technology/ninjaone-mcp',
    dockerAvailable: true,
    rateLimit: 'Varies by endpoint'
  },
  {
    id: 'halopsa',
    name: 'HaloPSA MCP',
    npmPackage: '@wyre-technology/halopsa-mcp',
    description: 'MCP server for HaloPSA with decision tree architecture for managing tickets, clients, assets, agents, and invoices.',
    category: 'psa',
    repoUrl: 'https://github.com/wyre-technology/halopsa-mcp',
    companionPluginId: 'halopsa',
    envVars: [
      { name: 'HALOPSA_CLIENT_ID', required: true, description: 'OAuth 2.0 Client ID' },
      { name: 'HALOPSA_CLIENT_SECRET', required: true, description: 'OAuth 2.0 Client Secret' },
      { name: 'HALOPSA_TENANT', required: true, description: 'Tenant name (e.g., yourcompany)' },
      { name: 'HALOPSA_BASE_URL', required: false, description: 'Explicit base URL (alternative to tenant)' }
    ],
    domains: [
      {
        name: 'Tickets',
        description: 'Manage support tickets, create new tickets, update status, add actions/notes.',
        tools: [
          { name: 'halopsa_tickets_list', description: 'List tickets with filters' },
          { name: 'halopsa_tickets_get', description: 'Get ticket details' },
          { name: 'halopsa_tickets_create', description: 'Create a new ticket' },
          { name: 'halopsa_tickets_update', description: 'Update an existing ticket' },
          { name: 'halopsa_tickets_add_action', description: 'Add a note/action to a ticket' }
        ]
      },
      {
        name: 'Clients',
        description: 'Manage companies/clients.',
        tools: [
          { name: 'halopsa_clients_list', description: 'List clients' },
          { name: 'halopsa_clients_get', description: 'Get client details' },
          { name: 'halopsa_clients_create', description: 'Create a new client' },
          { name: 'halopsa_clients_search', description: 'Search clients by name' }
        ]
      },
      {
        name: 'Assets',
        description: 'Manage configuration items/assets.',
        tools: [
          { name: 'halopsa_assets_list', description: 'List assets with filters' },
          { name: 'halopsa_assets_get', description: 'Get asset details' },
          { name: 'halopsa_assets_search', description: 'Search assets' },
          { name: 'halopsa_assets_list_types', description: 'List available asset types' }
        ]
      },
      {
        name: 'Agents',
        description: 'View technicians and teams.',
        tools: [
          { name: 'halopsa_agents_list', description: 'List agents/technicians' },
          { name: 'halopsa_agents_get', description: 'Get agent details' },
          { name: 'halopsa_teams_list', description: 'List teams' }
        ]
      },
      {
        name: 'Invoices',
        description: 'View billing and invoices.',
        tools: [
          { name: 'halopsa_invoices_list', description: 'List invoices with filters' },
          { name: 'halopsa_invoices_get', description: 'Get invoice details' }
        ]
      }
    ],
    architecture: 'Decision tree with lazy-loaded domain handlers. Navigate to a domain first, then use domain-specific tools.',
    installCommand: 'npx @wyre-technology/halopsa-mcp',
    dockerAvailable: true,
    rateLimit: '500 requests per 3 minutes'
  },
  {
    id: 'itglue',
    name: 'IT Glue MCP',
    npmPackage: '@wyre-technology/itglue-mcp',
    description: 'MCP server providing Claude with access to IT Glue documentation, asset management, organizations, passwords, and flexible assets.',
    category: 'documentation',
    repoUrl: 'https://github.com/wyre-technology/itglue-mcp',
    companionPluginId: 'it-glue',
    envVars: [
      { name: 'ITGLUE_API_KEY', required: true, description: 'Your IT Glue API key (format: ITG.xxx)' },
      { name: 'ITGLUE_REGION', required: false, description: 'API region: us (default), eu, or au' }
    ],
    domains: [
      {
        name: 'Organizations',
        description: 'Search and retrieve organization records.',
        tools: [
          { name: 'search_organizations', description: 'Search organizations with filtering' },
          { name: 'get_organization', description: 'Get a specific organization by ID' }
        ]
      },
      {
        name: 'Configurations',
        description: 'Manage devices and configuration items.',
        tools: [
          { name: 'search_configurations', description: 'Search configurations with filtering' },
          { name: 'get_configuration', description: 'Get a specific configuration by ID' }
        ]
      },
      {
        name: 'Passwords',
        description: 'Secure credential storage and retrieval.',
        tools: [
          { name: 'search_passwords', description: 'Search password entries (metadata only)' },
          { name: 'get_password', description: 'Get a specific password including value' }
        ]
      },
      {
        name: 'Documents',
        description: 'Search and manage documentation.',
        tools: [
          { name: 'search_documents', description: 'Search documents with filtering' }
        ]
      },
      {
        name: 'Flexible Assets',
        description: 'Custom structured documentation types.',
        tools: [
          { name: 'search_flexible_assets', description: 'Search flexible assets by type' }
        ]
      }
    ],
    architecture: 'Flat tool exposure — all tools available immediately. Includes a health check utility tool.',
    installCommand: 'npx @wyre-technology/itglue-mcp',
    dockerAvailable: true,
    rateLimit: '3000 requests per 5 minutes'
  },
  {
    id: 'superops',
    name: 'SuperOps.ai MCP',
    npmPackage: '@wyre-technology/superops-mcp',
    description: 'MCP server for SuperOps.ai PSA/RMM platform with GraphQL API support for clients, tickets, assets, and technicians.',
    category: 'psa',
    repoUrl: 'https://github.com/wyre-technology/superops-mcp',
    companionPluginId: 'superops',
    envVars: [
      { name: 'SUPEROPS_API_TOKEN', required: true, description: 'Your SuperOps.ai API token' },
      { name: 'SUPEROPS_SUBDOMAIN', required: true, description: 'Your SuperOps subdomain' },
      { name: 'SUPEROPS_REGION', required: false, description: 'Region: us (default) or eu' }
    ],
    domains: [
      {
        name: 'Clients',
        description: 'Manage client records.',
        tools: [
          { name: 'superops_clients_list', description: 'List clients with filters' },
          { name: 'superops_clients_get', description: 'Get client details' },
          { name: 'superops_clients_search', description: 'Search clients by name/domain' }
        ]
      },
      {
        name: 'Tickets',
        description: 'Manage support tickets.',
        tools: [
          { name: 'superops_tickets_list', description: 'List tickets with filters' },
          { name: 'superops_tickets_get', description: 'Get ticket details' },
          { name: 'superops_tickets_create', description: 'Create a new ticket' },
          { name: 'superops_tickets_update', description: 'Update ticket status/assignment' },
          { name: 'superops_tickets_add_note', description: 'Add note to ticket' },
          { name: 'superops_tickets_log_time', description: 'Log time on ticket' }
        ]
      },
      {
        name: 'Assets',
        description: 'Manage assets and endpoints.',
        tools: [
          { name: 'superops_assets_list', description: 'List assets/endpoints' },
          { name: 'superops_assets_get', description: 'Get asset details' },
          { name: 'superops_assets_software', description: 'Get software inventory' },
          { name: 'superops_assets_patches', description: 'Get patch status' }
        ]
      },
      {
        name: 'Technicians',
        description: 'Manage technician records.',
        tools: [
          { name: 'superops_technicians_list', description: 'List technicians' },
          { name: 'superops_technicians_get', description: 'Get technician details' },
          { name: 'superops_technicians_groups', description: 'List technician groups' }
        ]
      },
      {
        name: 'Custom',
        description: 'Run custom GraphQL queries and mutations.',
        tools: [
          { name: 'superops_custom_query', description: 'Run custom GraphQL query' },
          { name: 'superops_custom_mutation', description: 'Run custom GraphQL mutation' }
        ]
      }
    ],
    architecture: 'Decision tree with lazy-loaded domain handlers and custom GraphQL support.',
    installCommand: 'npx @wyre-technology/superops-mcp',
    dockerAvailable: false,
    rateLimit: '800 requests per minute'
  },
  {
    id: 'atera',
    name: 'Atera MCP',
    npmPackage: '@wyre-technology/atera-mcp',
    description: 'MCP server for Atera RMM with decision tree navigation for managing customers, agents, tickets, alerts, and contacts.',
    category: 'psa',
    repoUrl: 'https://github.com/wyre-technology/atera-mcp',
    companionPluginId: 'atera',
    envVars: [
      { name: 'ATERA_API_KEY', required: true, description: 'Your Atera API key from Admin > API' }
    ],
    domains: [
      {
        name: 'Customers',
        description: 'Manage customer (company) records.',
        tools: [
          { name: 'atera_customers_list', description: 'List customers with pagination' },
          { name: 'atera_customers_get', description: 'Get customer by ID' },
          { name: 'atera_customers_create', description: 'Create new customer' }
        ]
      },
      {
        name: 'Agents',
        description: 'Manage devices/endpoints with the Atera agent.',
        tools: [
          { name: 'atera_agents_list', description: 'List agents with optional customer filter' },
          { name: 'atera_agents_get', description: 'Get agent by ID' },
          { name: 'atera_agents_get_by_machine', description: 'Get agent by machine name' }
        ]
      },
      {
        name: 'Tickets',
        description: 'Manage service tickets.',
        tools: [
          { name: 'atera_tickets_list', description: 'List tickets with filters' },
          { name: 'atera_tickets_get', description: 'Get ticket by ID' },
          { name: 'atera_tickets_create', description: 'Create new ticket' },
          { name: 'atera_tickets_update', description: 'Update existing ticket' }
        ]
      },
      {
        name: 'Alerts',
        description: 'Monitor alerts from devices and agents.',
        tools: [
          { name: 'atera_alerts_list', description: 'List alerts with filters' },
          { name: 'atera_alerts_get', description: 'Get alert by ID' },
          { name: 'atera_alerts_by_agent', description: 'List alerts for an agent' },
          { name: 'atera_alerts_by_device', description: 'List alerts for a device' }
        ]
      },
      {
        name: 'Contacts',
        description: 'Manage customer contacts.',
        tools: [
          { name: 'atera_contacts_list', description: 'List all contacts' },
          { name: 'atera_contacts_get', description: 'Get contact by ID' },
          { name: 'atera_contacts_by_customer', description: 'List contacts for a customer' }
        ]
      }
    ],
    architecture: 'Decision tree with lazy-loaded domain handlers. Navigate to a domain first, then use domain-specific tools.',
    installCommand: 'npx @wyre-technology/atera-mcp',
    dockerAvailable: true,
    rateLimit: '700 requests per minute'
  },
  {
    id: 'syncro',
    name: 'Syncro MCP',
    npmPackage: '@wyre-technology/syncro-mcp',
    description: 'MCP server for Syncro MSP with decision tree architecture for managing customers, tickets, assets, contacts, and invoices.',
    category: 'psa',
    repoUrl: 'https://github.com/wyre-technology/syncro-mcp',
    companionPluginId: 'syncro',
    envVars: [
      { name: 'SYNCRO_API_KEY', required: true, description: 'Your Syncro API key' },
      { name: 'SYNCRO_SUBDOMAIN', required: false, description: 'Your Syncro subdomain (if applicable)' }
    ],
    domains: [
      {
        name: 'Customers',
        description: 'Manage customer accounts.',
        tools: [
          { name: 'syncro_customers_list', description: 'List customers with filters' },
          { name: 'syncro_customers_get', description: 'Get customer by ID' },
          { name: 'syncro_customers_create', description: 'Create new customer' },
          { name: 'syncro_customers_search', description: 'Search customers by query' }
        ]
      },
      {
        name: 'Tickets',
        description: 'Manage support tickets.',
        tools: [
          { name: 'syncro_tickets_list', description: 'List tickets with filters' },
          { name: 'syncro_tickets_get', description: 'Get ticket by ID' },
          { name: 'syncro_tickets_create', description: 'Create new ticket' },
          { name: 'syncro_tickets_update', description: 'Update existing ticket' },
          { name: 'syncro_tickets_add_comment', description: 'Add comment to ticket' }
        ]
      },
      {
        name: 'Assets',
        description: 'Manage configuration items.',
        tools: [
          { name: 'syncro_assets_list', description: 'List assets with filters' },
          { name: 'syncro_assets_get', description: 'Get asset by ID' },
          { name: 'syncro_assets_search', description: 'Search assets' }
        ]
      },
      {
        name: 'Contacts',
        description: 'Manage customer contacts.',
        tools: [
          { name: 'syncro_contacts_list', description: 'List contacts' },
          { name: 'syncro_contacts_get', description: 'Get contact by ID' },
          { name: 'syncro_contacts_create', description: 'Create new contact' }
        ]
      },
      {
        name: 'Invoices',
        description: 'View and manage billing.',
        tools: [
          { name: 'syncro_invoices_list', description: 'List invoices with filters' },
          { name: 'syncro_invoices_get', description: 'Get invoice by ID' },
          { name: 'syncro_invoices_create', description: 'Create new invoice' },
          { name: 'syncro_invoices_email', description: 'Email an invoice' }
        ]
      }
    ],
    architecture: 'Decision tree with lazy-loaded domain handlers. Navigate to a domain first, then use domain-specific tools.',
    installCommand: 'npx @wyre-technology/syncro-mcp',
    dockerAvailable: true,
    rateLimit: '180 requests per minute'
  }
];

export function getMcpServerById(id: string): McpServer | undefined {
  return mcpServers.find(s => s.id === id);
}

export function getMcpServersByCategory(category: 'psa' | 'rmm' | 'documentation'): McpServer[] {
  return mcpServers.filter(s => s.category === category);
}

export function getMcpServerByPluginId(pluginId: string): McpServer | undefined {
  return mcpServers.find(s => s.companionPluginId === pluginId);
}
