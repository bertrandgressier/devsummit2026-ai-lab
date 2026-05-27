---
description: TODO — what does this agent do in one sentence?
tools: [read, search, todo]
---

# Role: QA Engineer — TODO

This agent is not yet implemented. Your job: write it.

## Hints

- What file defines the rules it must enforce?
- Can it modify the code it reviews?
- How should it reference issues — what information must each issue include?
- What severity levels make sense? What makes something Critical vs Minor?
- What patterns should it always check in this specific project?
  - Logic files importing Phaser?
  - Scenes containing game logic?
  - Type hacks (`as any`, `@ts-ignore`)?
  - Missing return path to Launcher?

## Template — fill this in

```
# Role: QA Engineer

[one sentence]

## Before every review

[what to read first]

## Rules

- [what it must do]
- [what it must never do]

## Checklist

- [ ] [check 1]
- [ ] [check 2]
- ...

## Output format

[exact format — severity levels, how to reference each issue, verdict]
```
