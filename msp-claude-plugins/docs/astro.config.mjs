// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://asachs01.github.io',
	base: '/msp-claude-plugins',
	integrations: [
		starlight({
			title: 'MSP Claude Plugins',
			description: 'Community-driven Claude Code plugins for Managed Service Providers',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/asachs01/msp-claude-plugins' },
			],
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: false,
			},
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/asachs01/msp-claude-plugins/edit/main/docs/',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Installation', slug: 'getting-started/installation' },
					],
				},
				{
					label: 'Plugin Catalog',
					items: [
						{ label: 'Overview', slug: 'plugins/overview' },
						{
							label: 'Kaseya',
							collapsed: false,
							items: [
								{ label: 'Autotask PSA', slug: 'plugins/kaseya/autotask' },
							],
						},
						{
							label: 'ConnectWise',
							collapsed: true,
							items: [
								{ label: 'Manage (Planned)', slug: 'plugins/connectwise/manage' },
							],
						},
						{
							label: 'Shared Skills',
							collapsed: true,
							items: [
								{ label: 'MSP Terminology', slug: 'plugins/shared/msp-terminology' },
								{ label: 'Ticket Triage', slug: 'plugins/shared/ticket-triage' },
							],
						},
					],
				},
				{
					label: 'Autotask Reference',
					collapsed: true,
					items: [
						{ label: 'Tickets', slug: 'reference/autotask/tickets' },
						{ label: 'CRM', slug: 'reference/autotask/crm' },
						{ label: 'Projects', slug: 'reference/autotask/projects' },
						{ label: 'Contracts', slug: 'reference/autotask/contracts' },
						{ label: 'Time Entries', slug: 'reference/autotask/time-entries' },
						{ label: 'Configuration Items', slug: 'reference/autotask/configuration-items' },
						{ label: 'API Patterns', slug: 'reference/autotask/api-patterns' },
					],
				},
				{
					label: 'Commands',
					collapsed: true,
					items: [
						{ label: 'Command Overview', slug: 'commands/overview' },
						{ label: '/create-ticket', slug: 'commands/create-ticket' },
						{ label: '/search-tickets', slug: 'commands/search-tickets' },
						{ label: '/time-entry', slug: 'commands/time-entry' },
					],
				},
				{
					label: 'Developer Guide',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'developer/overview' },
						{ label: 'Creating Skills', slug: 'developer/creating-skills' },
						{ label: 'Creating Commands', slug: 'developer/creating-commands' },
						{ label: 'MCP Integration', slug: 'developer/mcp-integration' },
						{ label: 'Testing Guide', slug: 'developer/testing' },
					],
				},
				{
					label: 'Contributing',
					collapsed: true,
					items: [
						{ label: 'How to Contribute', slug: 'contributing/how-to-contribute' },
						{ label: 'PRD Requirements', slug: 'contributing/prd-requirements' },
						{ label: 'Style Guide', slug: 'contributing/style-guide' },
						{ label: 'Code of Conduct', slug: 'contributing/code-of-conduct' },
					],
				},
				{
					label: 'Resources',
					collapsed: true,
					items: [
						{ label: 'Changelog', slug: 'resources/changelog' },
						{ label: 'Roadmap', slug: 'resources/roadmap' },
						{ label: 'External Links', slug: 'resources/external-links' },
					],
				},
			],
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'keywords',
						content: 'MSP, Claude, AI, Autotask, ConnectWise, PSA, RMM, plugins',
					},
				},
			],
		}),
	],
});
