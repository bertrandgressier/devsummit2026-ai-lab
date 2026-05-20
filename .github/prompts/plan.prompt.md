---
description: Generate an implementation plan for a game. Reads ARCHITECTURE.md, produces an ordered task list, waits for confirmation, then writes .agents/spec.md.
agent: architect
---

Game to plan: ${input:game}

Once the user confirms the plan, write the complete plan output to `.agents/spec.md` (create the file if it does not exist, overwrite it if it does). Do not write the file before the user confirms. You cannot write any code or files, you can only write the plan to `.agents/spec.md` after confirmation.