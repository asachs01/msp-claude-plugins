---
name: brain-note
description: Add a timestamped note to a client in the organizational brain
arguments:
  - name: client
    description: Client name
    required: true
  - name: note
    description: The note to add (if omitted, Claude will ask)
    required: false
---

# Brain: Add Client Note

Add a timestamped note to a client. Notes persist across syncs and accumulate over time.

## Steps

1. If `note` is not provided, ask the user what they'd like to record
2. Call `brain_add_org_note({ org_name: client, note: note })`
3. Confirm the note was saved

## Notes

- Notes append — they never replace existing notes.
- Each note is timestamped automatically by the brain.
- Notes are visible in `brain_get_org` output.
- Good uses: stakeholder changes, QBR outcomes, special handling instructions, known issues, relationship context.
