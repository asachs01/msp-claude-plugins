---
name: triage-phishing
description: Triage reported phishing emails in the PhishER queue, classify by threat level, and perform bulk actions
arguments:
  - name: severity
    description: Filter by severity level (critical, high, medium, low)
    required: false
  - name: status
    description: Filter by message status (new, in_review)
    required: false
    default: "new"
  - name: limit
    description: Maximum number of messages to triage
    required: false
    default: "100"
---

# PhishER Phishing Triage

Triage reported phishing emails in the KnowBe4 PhishER queue. Lists messages filtered by status, sorted by severity, with a summary of counts by category. This is the primary daily workflow for MSP security operations teams managing reported phishing for client organizations.

## Prerequisites

- KnowBe4 MCP server connected with valid API credentials
- MCP tools `knowbe4_phisher_list_messages`, `knowbe4_phisher_get_message`, `knowbe4_phisher_update_message`, and `knowbe4_phisher_bulk_action` available

## Steps

1. **Fetch messages from the PhishER queue**

   Call `knowbe4_phisher_list_messages` with `status` equal to the provided value (default: `new`). If `severity` is provided, include it as a filter. Paginate through results up to the specified `limit`.

2. **Summarize the queue**

   Count messages by category (`threat`, `clean`, `unknown`) and by severity (`critical`, `high`, `medium`, `low`). Display a summary table before diving into individual messages.

3. **Sort and prioritize**

   Present messages sorted by severity descending: critical first, then high, medium, and low. Within each severity tier, sort by `reported_at` ascending (oldest first).

4. **Highlight critical and high severity messages**

   For critical-severity messages, call `knowbe4_phisher_get_message` to retrieve full details including headers, links, and PhishML confidence. Flag those with PhishML verdict of "threat" and confidence above 0.90 as candidates for immediate bulk action.

5. **Recommend actions**

   For each group of similar messages (same sender domain or similar subject pattern), recommend:
   - **Bulk purge** if confirmed threat with high PhishML confidence
   - **Manual review** if PhishML confidence is low or category is unknown
   - **Mark as clean** if obvious false positive (known legitimate sender, passing SPF/DKIM/DMARC)

6. **Execute bulk actions on confirmed threats**

   For messages confirmed as threats, call `knowbe4_phisher_bulk_action` with `action=purge` to remove from mailboxes. Follow up with `action=resolve` to close out the messages.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| severity | string | No | all | Filter by severity (critical, high, medium, low) |
| status | string | No | new | Filter by message status (new, in_review) |
| limit | integer | No | 100 | Maximum number of messages to triage |

## Examples

### Triage All New Messages

```
/triage-phishing
```

### Triage Critical Messages Only

```
/triage-phishing --severity critical
```

### Triage Messages Currently In Review

```
/triage-phishing --status in_review
```

### Triage with a Smaller Batch

```
/triage-phishing --limit 25
```

## Error Handling

- **Authentication Error:** Verify `KNOWBE4_API_KEY` and `KNOWBE4_REGION` are set correctly
- **Rate Limit (429):** Reduce the limit parameter and retry; use severity filters to reduce result sets
- **No Results:** Confirm the status filter is correct; an empty queue means all reported messages have been processed
- **Bulk Action Partial Failure:** Check the `failed` count in the response; retry failed IDs individually

## Related Commands

- `/review-campaigns` - Review phishing simulation and training campaign performance
