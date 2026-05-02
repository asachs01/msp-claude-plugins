# Datto SaaS Protection Plugin

Claude Code skills for working with Datto SaaS Protection (formerly Backupify) — cloud-to-cloud backup for Microsoft 365 and Google Workspace.

## Status

**Scaffolding** — skill content is in place; the matching MCP server (`datto-saas-protection-mcp`) and SDK (`node-datto-saas-protection`) are in development.

## Capabilities (planned)

- Backup status: per-seat, per-tenant
- Seat management: list, license assignment, archived seats
- Restore operations: file/email/site restore queueing
- Tenant inventory: M365 & Google Workspace organizations
- Activity log: backup runs, errors, restores
- Domain mapping (M365 tenant → SaaS Protection org)

## Authentication

REST API key issued from the SaaS Protection partner portal. Send as `Authorization: Bearer <key>`. See `skills/api-patterns/SKILL.md`.

## Skills

- `api-patterns` — auth, pagination, error handling

## License

Apache-2.0
