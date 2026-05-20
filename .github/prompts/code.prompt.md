---
name: code
description: Execute the implementation plan from .agents/spec.md using the coder agent. Implements files one by one, strictly following the plan.
agent: coder
---

1. Read `.agents/spec.md`. If the file does not exist or has no confirmed plan, stop and tell the user to run `/plan` first.
2. Read `ARCHITECTURE.md` and `DESIGN.md` (if it exists).
3. Execute each task in the plan in order — one file per task.
4. After all tasks are done, output a summary of created/modified files.
