---
name: review-campaigns
description: Review active phishing simulation and training campaign status, failure rates, and user risk scores
arguments:
  - name: campaign_type
    description: Type of campaign to review (phishing, training, or all)
    required: false
    default: "all"
  - name: status
    description: Filter by campaign status (active, closed, draft)
    required: false
    default: "active"
  - name: include_risk_scores
    description: Include high-risk user list in the report
    required: false
    default: "true"
---

# KnowBe4 Campaign Review

Review the status of active KnowBe4 phishing simulation campaigns and security awareness training campaigns. Summarizes phish-prone percentages, click rates, training completion rates, and identifies high-risk users requiring additional coaching. Used for client security posture reporting and QBR preparation.

## Prerequisites

- KnowBe4 MCP server connected with valid API credentials
- MCP tools `knowbe4_training_list_campaigns`, `knowbe4_training_get_campaign`, `knowbe4_training_list_training_campaigns`, `knowbe4_training_get_training_campaign`, `knowbe4_training_list_enrollments`, and `knowbe4_training_list_users` available

## Steps

1. **List active phishing simulation campaigns**

   If `campaign_type` is `phishing` or `all`, call `knowbe4_training_list_campaigns` with `status` equal to the provided value. For each campaign, retrieve details with `knowbe4_training_get_campaign` to get phish-prone percentage (current and previous period) and individual test results.

2. **Summarize phishing simulation results**

   For each campaign, present:
   - Campaign name, date range, and frequency
   - Current phish-prone percentage vs. previous period (show trend direction)
   - Click rate and data entry rate per completed test
   - Reported rate (users who correctly identified and reported simulated phishing)
   - Number of completed vs. remaining tests in the campaign

3. **List active training campaigns**

   If `campaign_type` is `training` or `all`, call `knowbe4_training_list_training_campaigns` with the specified `status`. For each campaign, call `knowbe4_training_list_enrollments` filtered to `status=overdue` to identify non-compliant users.

4. **Summarize training completion**

   For each training campaign, present:
   - Campaign name and deadline
   - Enrolled users, completed users, and completion percentage
   - Overdue users with their names and enrollment dates

5. **Identify high-risk users (if include_risk_scores is true)**

   Call `knowbe4_training_list_users` with `risk_level=high` to retrieve the high-risk user list. Display users sorted by risk score descending, showing their phish-prone percentage, training completion rate, and last phishing click date.

6. **Provide recommendations**

   Based on the data:
   - If PPP is above 20%, recommend increasing training frequency or using more targeted templates
   - If training completion is below 80%, recommend sending reminder notifications to overdue users
   - If high-risk users have clicked in 3+ consecutive tests, recommend mandatory remedial training or one-on-one coaching
   - If reported rate is below 10%, recommend promoting the Phish Alert Button usage

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| campaign_type | string | No | all | Type of campaign (phishing, training, all) |
| status | string | No | active | Campaign status filter (active, closed, draft) |
| include_risk_scores | boolean | No | true | Include high-risk user list |

## Examples

### Full Campaign Overview

```
/review-campaigns
```

### Phishing Simulations Only

```
/review-campaigns --campaign_type phishing
```

### Training Completion Report Only

```
/review-campaigns --campaign_type training
```

### Review Without Risk Scores

```
/review-campaigns --include_risk_scores false
```

### Review Closed Campaigns for Historical Reporting

```
/review-campaigns --status closed
```

## Error Handling

- **Authentication Error:** Verify `KNOWBE4_API_KEY` and `KNOWBE4_REGION` are set correctly
- **No Active Campaigns:** If no campaigns exist for the selected status, suggest checking other statuses (e.g., draft or closed)
- **Phish-Prone Percentage Missing:** Campaign may not have completed its first phishing test yet — report what data is available
- **Rate Limit (429):** Reduce the number of concurrent requests; fetch one campaign at a time

## Related Commands

- `/triage-phishing` - Triage real phishing reports in the PhishER queue
