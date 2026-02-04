---
name: command-name
description: Brief description of what this command does
arguments:
  - name: argument1
    description: Description of the first argument
    required: true
  - name: argument2
    description: Description of the second argument
    required: false
    default: "default value"
---

# [Command Title]

## Prerequisites

- Prerequisite 1 (e.g., valid API credentials configured)
- Prerequisite 2 (e.g., required entity must exist)

## Steps

1. First step the command performs
2. Second step
3. Third step
4. Return result to user

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| argument1 | string | Yes | Description |
| argument2 | string | No | Description |

## Examples

### Basic Usage

```
/command-name argument1
```

### With Optional Parameters

```
/command-name argument1 --argument2 "value"
```

## Error Handling

- **Error condition 1:** How to handle it
- **Error condition 2:** How to handle it

## Related Commands

- `/related-command-1` - Description
- `/related-command-2` - Description
