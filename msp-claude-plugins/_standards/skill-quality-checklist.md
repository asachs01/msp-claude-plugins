# Skill Quality Checklist

Use this checklist to validate skills before submission.

## Structure

- [ ] SKILL.md file exists in `skills/skill-name/` directory
- [ ] Frontmatter includes `description` field
- [ ] Frontmatter includes `triggers` array with relevant keywords
- [ ] File follows the skill template structure

## Content Quality

### Overview Section
- [ ] Clearly explains what the skill covers
- [ ] Identifies target audience (MSP role)
- [ ] States when to use this skill

### Key Concepts
- [ ] Defines domain-specific terminology
- [ ] Explains relationships between concepts
- [ ] Uses MSP-appropriate language

### API Patterns
- [ ] Includes real API endpoint examples
- [ ] Shows request/response formats
- [ ] Documents required fields vs optional
- [ ] Notes rate limits or restrictions

### Workflows
- [ ] Describes common MSP workflows
- [ ] Steps are numbered and clear
- [ ] Includes decision points where relevant

### Error Handling
- [ ] Documents common errors
- [ ] Provides causes and solutions
- [ ] Includes error codes where applicable

## Security

- [ ] No hardcoded credentials
- [ ] No real customer data in examples
- [ ] API keys referenced via environment variables
- [ ] Sensitive fields marked appropriately

## Accuracy

- [ ] API examples validated against documentation
- [ ] Tested with actual API (if access available)
- [ ] Version compatibility noted
- [ ] Last review date documented

## Final Review

- [ ] Spell-checked
- [ ] Links verified
- [ ] Consistent formatting
- [ ] Related skills linked
