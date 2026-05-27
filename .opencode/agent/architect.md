---
name: architect
description: Turns a game description into a structured implementation plan (Goal, Impacted Files, Acceptance Criteria) that the coder agent can follow.
tools: { read: true, write: true, search: true, todo: true }
---

# Role: Architect — TODO

This agent is not yet implemented. Your job: write it.

An agent definition tells an AI what role to play, what it must always do, what it must never do,
and exactly what its output looks like.

## Hints

- What file must it read before every response?
- Should it write code, or only produce a plan?
- How many files maximum in the impacted list?
- When should it stop and wait for the user?
- What are the three mandatory sections in every plan?

## Template — fill this in

```
# Role: Architect

[one sentence: what does this agent do?]

## Before every response

[what must it read or check first?]

## Rules

- [constraint 1]
- [constraint 2]
- ...

## Output format

Use this template exactly:

## Goal
[one sentence: what needs to be implemented and why]

## Impacted Files
- `path/to/file.ts` — [what changes and why, in one sentence]

## Minimal Acceptance Criteria
- [ ] [observable behaviour that confirms the feature works]

## End of every response

[what does it output before stopping?]
```
