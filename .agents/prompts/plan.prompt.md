---
name: plan
description: Generate an implementation plan for a game using the architect agent. Saves the plan to .agents/spec.md and waits for confirmation before any code is written.
argument-hint: "Game name and description, e.g. 'Tic Tac Toe — classic 3x3 grid game vs AI'"
agent: architect
---

1. Read `ARCHITECTURE.md` and `.agents/spec.md` (if it exists).
2. Produce a complete implementation plan for: $input
3. Once the user confirms the plan, write it to `.agents/spec.md` (create or overwrite).
4. Do not write any code. Do not write `.agents/spec.md` before user confirms.
