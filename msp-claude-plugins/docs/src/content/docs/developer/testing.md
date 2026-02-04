---
title: Testing Guide
description: How to test skills, commands, and MCP integrations for MSP Claude Plugins
---

Testing ensures your contributions work correctly and provide value to the MSP community. This guide covers testing strategies for all plugin components.

## Testing Overview

| Component | Primary Testing Method | Requires API Access |
|-----------|----------------------|---------------------|
| Skills | Trigger validation, content review | No |
| Commands | Argument parsing, workflow execution | Recommended |
| MCP Integration | API connectivity, tool execution | Yes |

## Manual Testing Checklist

### Skills Testing

- [ ] **Trigger activation** - Verify triggers load the skill appropriately
- [ ] **Content accuracy** - Validate information against official API docs
- [ ] **Code examples** - Ensure code snippets are syntactically correct
- [ ] **API examples** - Confirm request/response formats match API spec
- [ ] **Links** - Verify all internal and external links work
- [ ] **Formatting** - Check tables render correctly

### Commands Testing

- [ ] **Argument parsing** - Test all argument combinations
- [ ] **Required arguments** - Verify errors for missing required args
- [ ] **Default values** - Confirm defaults are applied correctly
- [ ] **Input validation** - Test invalid inputs are handled gracefully
- [ ] **Output format** - Verify success/error messages are clear
- [ ] **Workflow steps** - Confirm each step executes as documented

### MCP Testing

- [ ] **Server startup** - MCP server starts without errors
- [ ] **Authentication** - API credentials are accepted
- [ ] **Tool discovery** - All tools are listed correctly
- [ ] **Read operations** - Data retrieval works
- [ ] **Write operations** - Data creation/updates work (use sandbox)
- [ ] **Error handling** - API errors are surfaced appropriately
- [ ] **Rate limiting** - Server handles rate limits gracefully

## Testing Skills

### Verifying Triggers

Test that your skill triggers activate correctly:

1. Open Claude Code in a directory with the plugin
2. Ask questions using different trigger phrases
3. Verify Claude references the skill content

**Test prompts for a tickets skill:**

```
How do I create a ticket in Autotask?
```
Expected: Skill content about ticket creation is used.

```
What are the Autotask ticket status codes?
```
Expected: Status code table from skill is referenced.

```
Explain ticket priority levels
```
Expected: Priority information from skill is used.

### Content Validation

Compare your skill content against official documentation:

1. **Status codes** - Verify IDs and names match API documentation
2. **Field names** - Confirm field names are exact API field names
3. **Data types** - Validate types match API spec (int, string, etc.)
4. **Required fields** - Cross-reference required flags with API docs
5. **Business rules** - Verify validation rules match system behavior

### API Example Validation

Test that API examples work against the real API (if you have access):

```bash
# Example: Test a ticket creation payload
curl -X POST "https://webservices5.autotask.net/atservicesrest/v1.0/Tickets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ${AUTH_TOKEN}" \
  -H "IntegrationCode: ${INTEGRATION_CODE}" \
  -d '{
    "companyID": 12345,
    "title": "Test ticket",
    "status": 1,
    "priority": 2,
    "queueID": 8
  }'
```

## Testing Commands

### Argument Testing Matrix

Create a test matrix for all argument combinations:

| Test Case | company | title | description | priority | Expected Result |
|-----------|---------|-------|-------------|----------|-----------------|
| Minimal | "Acme" | "Test" | - | - | Success with defaults |
| Full | "Acme" | "Test" | "Details" | 2 | Success with all fields |
| Missing required | - | "Test" | - | - | Error: company required |
| Invalid priority | "Acme" | "Test" | - | 5 | Error: priority 1-4 |
| Company ID | 12345 | "Test" | - | - | Success using ID |

### Testing Command Workflow

Walk through each step in the command:

**Example: `/create-ticket` command**

1. **Company resolution**
   ```
   /create-ticket "Acme" "Test ticket"
   ```
   - Does it find "Acme Corporation"?
   - Does it suggest alternatives if not found?

2. **Duplicate detection**
   - Create a ticket, then immediately try to create another
   - Does it warn about potential duplicate?

3. **Contract checking**
   - Test with company that has active contract
   - Test with company without contract
   - Is the T&M warning displayed?

4. **Field resolution**
   - Test with queue name vs queue ID
   - Test with contact name vs contact email

### Testing Error Scenarios

Deliberately cause errors to verify handling:

| Error Scenario | Test Input | Expected Behavior |
|----------------|------------|-------------------|
| Company not found | `/create-ticket "NONEXISTENT" "Test"` | Suggest similar companies |
| Invalid queue | `/create-ticket "Acme" "Test" --queue "Fake"` | List valid queues |
| API authentication failure | Unset credentials | Clear auth error message |
| Network error | Disconnect network | Timeout/retry message |

## Testing MCP Integration

### Environment Setup

1. **Set credentials:**
   ```bash
   export AUTOTASK_USERNAME="your-api-user"
   export AUTOTASK_SECRET="your-secret"
   export AUTOTASK_INTEGRATION_CODE="your-code"
   export AUTOTASK_ZONE="webservices5.autotask.net"
   ```

2. **Verify environment:**
   ```bash
   echo $AUTOTASK_USERNAME  # Should show value
   echo $AUTOTASK_SECRET    # Should show value
   ```

### Connection Testing

Test basic MCP server connectivity:

```bash
# Navigate to plugin directory
cd msp-claude-plugins/kaseya/autotask

# Start Claude with plugin
claude --plugin .
```

Ask Claude:
```
List available MCP tools for Autotask
```

Expected: List of tools like `search_tickets`, `create_ticket`, etc.

### Read Operation Testing

Test data retrieval operations:

```
Search for open tickets for company "Test Company"
```

Expected:
- MCP tool is invoked
- API query is executed
- Results are returned and displayed

### Write Operation Testing

**Warning:** Test write operations in a sandbox/test environment.

```
Create a test ticket for company ID 12345 with title "MCP Test Ticket"
```

Expected:
- Confirmation prompt (if implemented)
- Ticket is created
- Ticket number/ID is returned

### Error Handling Testing

Test how MCP handles various error conditions:

1. **Invalid credentials:**
   - Temporarily set wrong credentials
   - Expected: Clear authentication error

2. **Rate limiting:**
   - Make many rapid requests
   - Expected: Graceful handling, retry logic

3. **Invalid input:**
   - Pass malformed data to a tool
   - Expected: Validation error, not crash

4. **Network issues:**
   - Temporarily block API endpoint
   - Expected: Timeout message, not hang

## Testing Without API Access

If you don't have API access, you can still contribute quality content:

### Documentation-Based Testing

1. **Cross-reference official docs** - Verify all information matches vendor documentation
2. **Check API changelog** - Ensure information isn't outdated
3. **Review community resources** - Forums, Stack Overflow, vendor communities
4. **Mark as untested** - Add note in PR for community testing

### Marking Contributions as Untested

Add a note to your PR description:

```markdown
## Testing Status

- [x] Content validated against official API documentation
- [x] Formatting and links verified
- [ ] API examples tested against live API (no API access)

**Note:** This contribution is documentation-based and has not been tested
against a live API. Community testing with API access would be appreciated.
```

### Requesting Community Testing

In your PR, request help:

```markdown
## Help Wanted

I don't have API access to test these changes. If you have access to
[Vendor] API, please help test:

1. Verify the status codes in the tickets skill match your instance
2. Test the `/create-ticket` command creates tickets correctly
3. Confirm the MCP tools return expected data

Thank you!
```

## Community Testing Process

### For Contributors Without API Access

1. Submit PR with "needs-testing" label
2. Document what needs to be tested
3. Community members with API access volunteer to test
4. Testers report results in PR comments
5. Address any issues found
6. Remove "needs-testing" label when verified

### For Testers

1. Look for PRs labeled "needs-testing"
2. Set up your environment with the PR branch
3. Run through the testing checklist
4. Report results in PR comments:

```markdown
## Testing Results

**Environment:** Autotask API v1.6, Zone webservices5

**Skills:**
- [x] Triggers activate correctly
- [x] Status codes match my instance
- [x] API examples work

**Commands:**
- [x] `/create-ticket` works with company name
- [x] `/create-ticket` works with company ID
- [ ] `/create-ticket --priority 1` - Priority 1 is "Low" not "Critical" in my instance

**Issues Found:**
1. Priority numbering may vary by instance (see above)

**Recommendation:** Ready to merge with minor fix
```

## Automated Testing (Future)

While most testing is currently manual, we plan to add:

- **Markdown linting** - Validate formatting
- **Link checking** - Verify all links work
- **Schema validation** - Check frontmatter structure
- **JSON validation** - Verify API examples are valid JSON
- **Spell checking** - Catch typos

## Testing Best Practices

1. **Test incrementally** - Don't wait until everything is done
2. **Document as you test** - Note any issues immediately
3. **Use realistic data** - But never real customer data
4. **Test edge cases** - Empty inputs, special characters, large values
5. **Verify error messages** - They should help users fix problems
6. **Test in isolation** - One change at a time
7. **Re-test after changes** - Regression testing is important

## Quality Checklist

Final checks before submitting:

### Skills
- [ ] All triggers tested and working
- [ ] Content matches official documentation
- [ ] API examples are valid JSON
- [ ] Code snippets are syntactically correct
- [ ] Tables render correctly
- [ ] Links work

### Commands
- [ ] All argument combinations tested
- [ ] Required argument validation works
- [ ] Default values are applied
- [ ] Error messages are helpful
- [ ] Output format is clear
- [ ] Related commands are accurate

### MCP
- [ ] Server starts without errors
- [ ] Authentication works
- [ ] All tools are discoverable
- [ ] Read operations return data
- [ ] Write operations work (sandbox tested)
- [ ] Errors are handled gracefully

## Next Steps

- [Developer Overview](/msp-claude-plugins/developer/overview/) - Architecture reference
- [Creating Skills](/msp-claude-plugins/developer/creating-skills/) - Build skills to test
- [Creating Commands](/msp-claude-plugins/developer/creating-commands/) - Build commands to test
- [MCP Integration](/msp-claude-plugins/developer/mcp-integration/) - Configure MCP for testing
