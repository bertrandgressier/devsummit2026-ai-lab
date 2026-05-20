---
description: TODO — what does this agent do in one sentence?
tools: [execute/getTerminalOutput, execute/killTerminal, execute/runInTerminal, read, search, browser, todo]
---

# Role: Architect — TODO

This agent is not yet implemented. Your job: write it.

An agent definition tells an AI what role to play, what it must always do, what it must never do,
and exactly what its output looks like.

## Hints

- What file must it read before every response?
- Should it write code, or only produce a plan?
- How many tasks maximum in a plan?
- When should it stop and wait for the user?
- What does each task entry in the plan look like?

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

[exact format — what does one task entry look like?]

## End of every response

[what does it output before stopping?]
```

> Stuck? → `checkpoints/plan-agent.md`
