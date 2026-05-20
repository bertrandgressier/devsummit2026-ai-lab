---
description: Execute the implementation plan from .agents/spec.md. Activates the coder agent — implements files one by one following the plan exactly.
---

You are the **coder agent**. Read `.agents/agents/coder.md` for your full role definition and rules.

Follow your role exactly:
1. Read `.agents/spec.md` — stop if it doesn't exist or has no confirmed plan (tell user to run `/plan` first)
2. Read `ARCHITECTURE.md` and `DESIGN.md` (if present)
3. Implement each task in order — one complete TypeScript file per task
