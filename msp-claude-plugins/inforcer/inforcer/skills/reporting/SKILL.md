---
description: >
  Use this skill when working with Inforcer reporting - compliance reports,
  Microsoft Secure Score tracking, Copilot readiness assessments, executive
  summaries, report export formats (PDF, CSV), scheduling, and per-tenant
  vs aggregate reporting.
triggers:
  - inforcer report
  - inforcer compliance report
  - inforcer secure score
  - inforcer copilot
  - inforcer executive
  - inforcer summary
  - inforcer export
  - inforcer dashboard
---

# Inforcer Reporting

## Overview

Inforcer provides comprehensive reporting across compliance, Secure Score, Copilot readiness, and executive summaries. Reports can be generated for individual tenants, groups, or the entire portfolio. They can be viewed in the API response, exported as PDF or CSV, and scheduled for automatic generation.

Reports serve two primary audiences:
1. **MSP internal** -- NOC/SOC teams monitoring compliance and drift
2. **Client-facing** -- Executive summaries and compliance reports for customer QBRs

## Report Types

### Compliance Reports

Compliance reports show how well a tenant or group meets its assigned baseline:

```bash
GET /v1/reports/compliance?tenantId={tenantId}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenantId` | string | Specific tenant (omit for aggregate) |
| `groupId` | string | Specific group (omit for aggregate) |
| `framework` | string | Filter by framework (`cis`, `nist`, `iso27001`) |
| `category` | string | Filter by category (`entraId`, `intune`, `defender`, `exchange`, `sharepoint`) |

**Response:**

```json
{
  "reportType": "compliance",
  "generatedAt": "2026-02-24T14:00:00Z",
  "scope": {
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "tenantName": "Contoso Ltd"
  },
  "summary": {
    "overallScore": 87,
    "totalPolicies": 65,
    "compliant": 57,
    "nonCompliant": 6,
    "notApplicable": 2,
    "trend": "+3 from last month"
  },
  "byCategory": {
    "entraId": { "score": 92, "compliant": 14, "total": 15 },
    "intune": { "score": 85, "compliant": 17, "total": 20 },
    "defender": { "score": 90, "compliant": 9, "total": 10 },
    "exchange": { "score": 80, "compliant": 10, "total": 12 },
    "sharepoint": { "score": 88, "compliant": 7, "total": 8 }
  },
  "nonCompliantPolicies": [
    {
      "policyName": "Require MFA for all users",
      "category": "entraId",
      "severity": "critical",
      "frameworkControl": "CIS 1.1.3",
      "status": "non-compliant",
      "recommendation": "Enable MFA for all users via conditional access policy"
    }
  ],
  "frameworkMapping": {
    "cis": {
      "totalControls": 65,
      "implemented": 57,
      "percentage": 87.7
    }
  }
}
```

### Aggregate Compliance (All Tenants)

```bash
GET /v1/reports/compliance
```

Returns aggregate compliance across all managed tenants:

```json
{
  "reportType": "compliance-aggregate",
  "generatedAt": "2026-02-24T14:00:00Z",
  "scope": { "type": "all", "tenantCount": 134 },
  "summary": {
    "averageScore": 84,
    "highestScore": { "tenantName": "Fabrikam Inc", "score": 98 },
    "lowestScore": { "tenantName": "Tailspin Toys", "score": 52 },
    "tenantsAbove80": 98,
    "tenantsBelow70": 12
  },
  "distribution": [
    { "range": "90-100", "count": 45 },
    { "range": "80-89", "count": 53 },
    { "range": "70-79", "count": 24 },
    { "range": "60-69", "count": 8 },
    { "range": "0-59", "count": 4 }
  ]
}
```

### Secure Score Reports

Track Microsoft Secure Score trends over time:

```bash
GET /v1/reports/secure-score?tenantId={tenantId}&days=30
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenantId` | string | Specific tenant (omit for aggregate) |
| `days` | integer | Trend period in days (default 30, max 365) |

**Response:**

```json
{
  "reportType": "secure-score",
  "generatedAt": "2026-02-24T14:00:00Z",
  "scope": {
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "tenantName": "Contoso Ltd"
  },
  "current": {
    "score": 72.5,
    "maxScore": 100,
    "percentage": 72.5
  },
  "trend": {
    "periodDays": 30,
    "startScore": 65.0,
    "endScore": 72.5,
    "change": "+7.5",
    "direction": "improving"
  },
  "history": [
    { "date": "2026-01-25", "score": 65.0 },
    { "date": "2026-02-01", "score": 67.2 },
    { "date": "2026-02-08", "score": 69.0 },
    { "date": "2026-02-15", "score": 71.3 },
    { "date": "2026-02-22", "score": 72.5 }
  ],
  "topRecommendations": [
    {
      "action": "Turn on sign-in risk policy",
      "category": "Identity",
      "potentialScoreImpact": 4.2,
      "implementationStatus": "notStarted",
      "difficulty": "moderate"
    },
    {
      "action": "Enable mailbox auditing for all users",
      "category": "Data",
      "potentialScoreImpact": 3.1,
      "implementationStatus": "notStarted",
      "difficulty": "easy"
    }
  ]
}
```

### Copilot Readiness Reports

Assess a tenant's readiness for Microsoft 365 Copilot deployment:

```bash
GET /v1/reports/copilot-readiness?tenantId={tenantId}
```

**Response:**

```json
{
  "reportType": "copilot-readiness",
  "generatedAt": "2026-02-24T14:00:00Z",
  "scope": {
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "tenantName": "Contoso Ltd"
  },
  "overallReadiness": "moderate",
  "readinessScore": 68,
  "categories": {
    "identity": {
      "score": 85,
      "status": "ready",
      "findings": [
        "MFA enabled for all users",
        "Conditional access policies configured"
      ]
    },
    "dataGovernance": {
      "score": 55,
      "status": "needs-work",
      "findings": [
        "Sensitivity labels not configured",
        "DLP policies missing for financial data"
      ]
    },
    "sharingControls": {
      "score": 70,
      "status": "moderate",
      "findings": [
        "External sharing restricted to authenticated guests",
        "Anonymous links still enabled for some sites"
      ]
    },
    "licensing": {
      "score": 60,
      "status": "needs-work",
      "findings": [
        "250 M365 E3 licenses",
        "No Copilot licenses assigned yet",
        "E5 Security add-on recommended for DLP"
      ]
    }
  },
  "recommendations": [
    "Configure sensitivity labels before enabling Copilot",
    "Implement DLP policies for sensitive data types",
    "Disable anonymous sharing links on all SharePoint sites",
    "Consider E5 Security upgrade for advanced DLP capabilities"
  ]
}
```

**Readiness Levels:**

| Level | Score Range | Description |
|-------|------------|-------------|
| `ready` | 80-100 | Tenant is prepared for Copilot deployment |
| `moderate` | 60-79 | Some prerequisites missing; address before deployment |
| `needs-work` | 0-59 | Significant gaps; not recommended for deployment yet |

### Executive Summaries

Generate high-level summaries suitable for client QBRs:

```bash
GET /v1/reports/executive-summary?tenantId={tenantId}
```

**Response:**

```json
{
  "reportType": "executive-summary",
  "generatedAt": "2026-02-24T14:00:00Z",
  "period": "2026-02-01 to 2026-02-24",
  "scope": {
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "tenantName": "Contoso Ltd"
  },
  "highlights": {
    "complianceScore": 87,
    "complianceTrend": "+5 from last month",
    "secureScore": 72.5,
    "secureScoreTrend": "+7.5 from last month",
    "driftEventsDetected": 8,
    "driftEventsRemediated": 6,
    "policiesDeployed": 3,
    "baselineVersion": "CIS Level 1 v1.2"
  },
  "keyActions": [
    "Deployed CIS 1.1.3 MFA policy for all users",
    "Remediated 6 drift events (2 critical, 4 medium)",
    "Updated baseline to CIS v1.2 (added 3 new policies)"
  ],
  "openIssues": [
    {
      "issue": "Exchange DMARC policy set to 'none' instead of 'reject'",
      "severity": "high",
      "recommendation": "Update DMARC to 'reject' after monitoring period"
    }
  ],
  "nextSteps": [
    "Complete DMARC enforcement rollout",
    "Begin Copilot readiness assessment",
    "Schedule annual security review"
  ]
}
```

## Export Formats

Export any report as PDF or CSV:

```bash
GET /v1/reports/export?type=compliance&tenantId={tenantId}&format=pdf
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Report type (`compliance`, `secure-score`, `copilot-readiness`, `executive-summary`) |
| `tenantId` | string | Tenant scope (omit for aggregate) |
| `groupId` | string | Group scope (omit for aggregate) |
| `format` | string | Export format (`pdf`, `csv`) |

**Response:**

The response returns a download URL:

```json
{
  "exportId": "export-001",
  "format": "pdf",
  "status": "ready",
  "downloadUrl": "https://api.inforcer.com/v1/exports/export-001/download",
  "expiresAt": "2026-02-25T14:00:00Z"
}
```

**Format Notes:**

| Format | Best For |
|--------|----------|
| PDF | Client-facing reports, QBR presentations, compliance evidence |
| CSV | Data analysis, import into other tools, bulk processing |

## Scheduled Reports

Configure automatic report generation on a schedule:

```bash
POST /v1/reports/schedules
Content-Type: application/json

{
  "reportType": "compliance",
  "scope": { "groupId": "group-001" },
  "format": "pdf",
  "schedule": "monthly",
  "dayOfMonth": 1,
  "recipients": ["reports@acmemsp.com"],
  "enabled": true
}
```

**Schedule Options:**

| Schedule | Description |
|----------|-------------|
| `daily` | Generate every day |
| `weekly` | Generate every Monday |
| `monthly` | Generate on the specified `dayOfMonth` |
| `quarterly` | Generate on the first of Jan, Apr, Jul, Oct |

## Per-Tenant vs Aggregate Reports

| Scope | Use Case |
|-------|----------|
| Single tenant | Client-facing compliance evidence, QBR reports |
| Group | Service tier reporting, regional compliance overview |
| All tenants | MSP internal dashboard, portfolio health check |

## Best Practices

1. **Schedule monthly compliance reports** -- Automate PDF generation for all client groups on the first of each month
2. **Track Secure Score trends** -- Use 30-day trends to demonstrate security posture improvements to clients
3. **Use executive summaries for QBRs** -- The executive summary format is designed for non-technical stakeholders
4. **Run Copilot readiness before selling Copilot** -- Ensure prerequisites are met before licensing
5. **Export CSV for deep analysis** -- Use CSV exports when you need to manipulate data in Excel or other tools
6. **Compare reports across months** -- Track improvement over time to demonstrate MSP value
7. **Share compliance reports proactively** -- Don't wait for QBRs; share improvements as they happen
8. **Use aggregate reports for portfolio management** -- Identify the weakest tenants that need the most attention
9. **Include framework mappings** -- For regulated industries, include CIS/NIST control mappings in reports
10. **Automate report delivery** -- Use scheduled reports with email delivery to ensure clients always receive their monthly reports

## Related Skills

- [API Patterns](../api-patterns/SKILL.md) - Authentication and API conventions
- [Tenants](../tenants/SKILL.md) - Tenant and group scoping for reports
- [Baselines](../baselines/SKILL.md) - Baseline compliance measurement
- [Drift Detection](../drift-detection/SKILL.md) - Drift data included in reports
- [Policies](../policies/SKILL.md) - Policy compliance details in reports
