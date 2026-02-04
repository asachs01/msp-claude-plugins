# PRD Generation Prompt

You are helping create a PRD for an MSP Claude plugin.

## Context

- Vendor: [vendor name]
- Product: [product name]
- Component: [what we're building]
- API Documentation: [link if available]

## Requirements

1. Follow the PRD template exactly
2. Be specific about API endpoints and data structures
3. Include realistic user stories from MSP workflows
4. Identify authentication and permission requirements
5. List explicit success criteria that can be tested

## Your Task

Generate a complete PRD for [description of what we're building].
Focus on practical MSP use cases and real-world workflows.

## PRD Template

```markdown
# Plugin PRD: [Vendor]/[Product]/[Component]

## Summary
One paragraph describing what this plugin/skill/command does.

## Problem
What specific MSP workflow problem does this solve?

## User Stories
- As a [role], I want to [action] so that [benefit]

## Scope
### In Scope
- Feature 1
- Feature 2

### Out of Scope
- What this explicitly won't do

## Technical Approach
### API Endpoints Used
- GET /v1.0/endpoint
- POST /v1.0/endpoint

### Authentication Requirements
- API key type
- Required permissions

### Data Flow
Brief description of how data moves

## Success Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Open Questions
- Unresolved decisions needing input
```
