---
description: Execute the implementation plan from .agents/spec.md, or act on an explicit instruction if one is provided.
agent: coder
---

If this command was called with an argument (e.g. `/code fix the qa report`), treat the argument as the task — skip `.agents/spec.md`. If the argument is "fix the qa report", read `.agents/qa-report.md` first, then fix every Critical and Major issue listed.

If no argument was provided, start by reading `.agents/spec.md`. If the file does not exist or the plan has not been confirmed, stop and tell the user to run `/plan` first. Implement each task in order.
