---
name: "KnowBe4 Training Campaigns"
description: >
  Use this skill when working with KnowBe4 phishing simulation campaigns,
  security awareness training enrollment, user risk scores, and campaign
  reporting for MSP client security posture assessment.
when_to_use: "When working with KnowBe4 phishing simulation campaigns, security awareness training enrollment, user risk scores, and campaign reporting for MSP client security posture assessment"
triggers:
  - security awareness
  - phishing simulation
  - training campaign
  - user enrollment
  - knowbe4 training
  - knowbe4 campaign
  - user risk score
  - phishing test
  - security training
  - KnowBe4 simulation
  - phishing failure rate
---

# KnowBe4 Training Campaigns

## Overview

KnowBe4's Security Awareness Training platform provides two complementary training mechanisms: phishing simulation campaigns that test users with simulated attacks, and training campaigns that deliver security awareness content. Together they create a continuous security culture improvement cycle. MSPs use KnowBe4 campaign data to demonstrate security posture improvements to clients, identify high-risk users requiring additional coaching, and meet compliance reporting requirements.

## Key Concepts

### Phishing Simulation Campaigns

Phishing simulation campaigns send realistic simulated phishing emails to users to test their click behavior. Key metrics:

- **Phish-prone Percentage (PPP)** — Percentage of users who clicked, opened an attachment, or submitted data in a simulated phishing test. Lower is better.
- **Click Rate** — Percentage of recipients who clicked a link in the simulated email
- **Data Entry Rate** — Percentage of users who submitted credentials or data into a simulated page
- **Reported Rate** — Percentage of users who correctly reported the simulated phish

### Training Campaigns

Training campaigns assign security awareness courses to users. Key metrics:

- **Enrollment** — Users assigned to complete the training
- **Completion Rate** — Percentage of enrolled users who have completed the assigned content
- **Overdue Users** — Users who have not completed training within the deadline

### User Risk Scores

KnowBe4 calculates a risk score for each user based on phishing simulation performance, training completion, and past behavior. Risk scores run from 0 (lowest risk) to 100 (highest risk):

- **0-33 (Low Risk)** — User consistently identifies phishing and completes training
- **34-66 (Medium Risk)** — Mixed performance; some phishing clicks or incomplete training
- **67-100 (High Risk)** — Frequent phishing failures and/or consistently incomplete training; priority for remediation

### Groups

Users are organized into groups (by department, location, or risk tier) that can be targeted for specific campaigns. Groups allow tailored training programs and focused reporting.

## API Patterns

### List Phishing Simulation Campaigns

```
knowbe4_training_list_campaigns
```

Parameters:
- `status` — Filter by status (`active`, `closed`, `draft`)
- `page` — Page number (1-based)
- `per_page` — Results per page (max 500)

**Example response:**

```json
{
  "campaigns": [
    {
      "campaign_id": 1042,
      "name": "Q1 2026 Phishing Simulation",
      "status": "active",
      "start_date": "2026-01-06",
      "end_date": "2026-03-31",
      "groups": ["All Users"],
      "phish_prone_percentage": 18.4,
      "total_recipients": 87,
      "tests_count": 3,
      "frequency": "monthly"
    }
  ]
}
```

### Get Phishing Campaign Details

```
knowbe4_training_get_campaign
```

Parameters:
- `campaign_id` — The phishing campaign ID

**Example response:**

```json
{
  "campaign_id": 1042,
  "name": "Q1 2026 Phishing Simulation",
  "status": "active",
  "start_date": "2026-01-06",
  "end_date": "2026-03-31",
  "groups": ["All Users"],
  "phish_prone_percentage": 18.4,
  "phish_prone_percentage_previous": 24.1,
  "total_recipients": 87,
  "tests": [
    {
      "pst_id": "pst-3301",
      "name": "January Simulation - Business Email Compromise",
      "scheduled_at": "2026-01-15",
      "status": "closed",
      "recipients": 87,
      "clicked": 14,
      "click_rate": 16.1,
      "data_entry_rate": 8.0,
      "reported_rate": 22.9
    },
    {
      "pst_id": "pst-3302",
      "name": "February Simulation - Credential Harvest",
      "scheduled_at": "2026-02-12",
      "status": "closed",
      "recipients": 87,
      "clicked": 17,
      "click_rate": 19.5,
      "data_entry_rate": 11.5,
      "reported_rate": 31.0
    }
  ]
}
```

### List Phishing Test Results

```
knowbe4_training_list_phishing_tests
```

Parameters:
- `campaign_id` — Filter by campaign

**Example response:**

```json
{
  "phishing_tests": [
    {
      "pst_id": "pst-3301",
      "campaign_id": 1042,
      "name": "January Simulation - Business Email Compromise",
      "scheduled_at": "2026-01-15",
      "status": "closed",
      "recipients": 87,
      "clicked": 14,
      "click_rate": 16.1,
      "data_entry_rate": 8.0,
      "reported_rate": 22.9,
      "template": "CFO Wire Transfer Request"
    }
  ]
}
```

### List Training Campaigns

```
knowbe4_training_list_training_campaigns
```

Parameters:
- `status` — Filter by status (`active`, `closed`, `draft`)
- `page` — Page number
- `per_page` — Results per page

**Example response:**

```json
{
  "training_campaigns": [
    {
      "campaign_id": 205,
      "name": "New Employee Security Onboarding",
      "status": "active",
      "start_date": "2026-01-01",
      "end_date": "2026-12-31",
      "completion_rate": 91.3,
      "enrolled_users": 23,
      "completed_users": 21,
      "overdue_users": 2
    }
  ]
}
```

### List User Enrollments

```
knowbe4_training_list_enrollments
```

Parameters:
- `campaign_id` — Filter by training campaign ID
- `status` — Filter by enrollment status (`incomplete`, `completed`, `overdue`)
- `page` — Page number
- `per_page` — Results per page

**Example response:**

```json
{
  "enrollments": [
    {
      "user_id": 10042,
      "email": "jsmith@acmecorp.com",
      "first_name": "John",
      "last_name": "Smith",
      "status": "overdue",
      "enrolled_at": "2026-01-01",
      "due_date": "2026-02-01",
      "completed_at": null,
      "training_time_minutes": 12
    }
  ]
}
```

### List Users with Risk Scores

```
knowbe4_training_list_users
```

Parameters:
- `group_id` — Filter by group
- `status` — Filter by user status (`active`, `archived`)
- `risk_level` — Filter by risk level (`high`, `medium`, `low`)
- `page` — Page number
- `per_page` — Results per page

**Example response:**

```json
{
  "users": [
    {
      "id": 10042,
      "email": "jsmith@acmecorp.com",
      "first_name": "John",
      "last_name": "Smith",
      "department": "Accounting",
      "risk_score": 78,
      "risk_level": "high",
      "phish_prone_percentage": 42.0,
      "training_completion_rate": 60.0,
      "last_phishing_click": "2026-02-12",
      "groups": ["All Users", "High Risk"]
    },
    {
      "id": 10043,
      "email": "alee@acmecorp.com",
      "first_name": "Alex",
      "last_name": "Lee",
      "department": "Engineering",
      "risk_score": 12,
      "risk_level": "low",
      "phish_prone_percentage": 0.0,
      "training_completion_rate": 100.0,
      "last_phishing_click": null,
      "groups": ["All Users"]
    }
  ]
}
```

## Common Workflows

### Quarterly Security Posture Review for a Client

1. List active phishing campaigns with `knowbe4_training_list_campaigns`
2. Get campaign details to retrieve phish-prone percentage (current and previous period) with `knowbe4_training_get_campaign`
3. Calculate PPP trend — compare current to previous period and baseline
4. List users filtered to `risk_level=high` with `knowbe4_training_list_users`
5. Identify departments with the highest concentration of high-risk users
6. List training campaign completion rates with `knowbe4_training_list_training_campaigns`
7. Flag overdue enrollments for follow-up
8. Compile a summary: PPP trend, top risk departments, training completion rates, and recommendations

### Identifying High-Risk Users for Remediation

1. Call `knowbe4_training_list_users` with `risk_level=high`
2. Sort by `risk_score` descending to prioritize the most at-risk employees
3. Review `phish_prone_percentage` — users who repeatedly click simulated phishing need targeted coaching
4. Check `training_completion_rate` — low completion compounded with high phishing failure is the highest-risk profile
5. Export the list and work with the client to schedule one-on-one coaching or mandatory remedial training
6. Consider enrolling high-risk users in a separate phishing campaign with higher-difficulty templates

### Reviewing Phishing Test Failure Patterns

1. List phishing tests for the current campaign with `knowbe4_training_list_phishing_tests`
2. Compare click rates across tests — rising click rates may indicate fatigue with certain template types
3. Review which template categories drive the highest failure rates (BEC, credential harvest, invoice fraud)
4. Use findings to select more targeted templates for the next test cycle
5. Identify users who clicked in multiple consecutive tests — these are priority for intervention

### Tracking Training Completion for Compliance

1. Call `knowbe4_training_list_training_campaigns` for the compliance-relevant campaign
2. Get detailed enrollment data with `knowbe4_training_list_enrollments` filtered to `status=incomplete`
3. Identify overdue users by checking `due_date` vs. today
4. Generate a completion report: enrolled count, completed count, overdue count, completion percentage
5. Escalate overdue users to their managers for follow-up

## Error Handling

### Campaign Not Found

**Cause:** Invalid campaign ID or campaign was deleted
**Solution:** List campaigns to confirm the correct ID; check if the campaign has been archived

### No Users Returned

**Cause:** Group or status filter may be too restrictive, or no users match the risk level
**Solution:** Remove filters to confirm users exist; verify the group ID is correct

### Phish-Prone Percentage Not Available

**Cause:** Campaign may not have completed its first phishing test yet
**Solution:** Check that at least one phishing test has been completed within the campaign

### Enrollment Data Unavailable

**Cause:** Training campaign may be in `draft` status with no enrollments yet
**Solution:** Confirm the campaign status is `active` and that users have been enrolled

## Best Practices

- Report phish-prone percentage trends quarterly — single data points are less meaningful than trends over time
- Compare PPP before and after training campaigns to demonstrate the ROI of security awareness investment
- Identify high-risk departments, not just high-risk individuals — systemic issues need systemic training solutions
- Use phishing template categories that mirror real threats facing the client's industry
- Set mandatory training completion requirements for high-risk users; track completion as a KPI
- Avoid training fatigue — three to four phishing tests per year is typically sufficient; more frequent testing yields diminishing returns
- Correlate PhishER reported emails with users who have high reporting rates in simulations — these are your security champions
- Include security awareness metrics in client QBR decks to reinforce the value of the program

## Related Skills

- [api-patterns](../api-patterns/SKILL.md) - Authentication, pagination, and error handling
- [phishing-incidents](../phishing-incidents/SKILL.md) - Real phishing incident management in PhishER
