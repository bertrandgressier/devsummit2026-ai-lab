---
description: Execute the implementation plan from .agents/spec.md. Implements files one by one following the plan exactly.
agent: coder
---

1. Read `.agents/spec.md`. If the file does not exist, stop and tell the user to run `/plan` first.
2. Execute every task in the `# Implementation Plan` section exactly as written.
3. Append the following section to `.agents/spec.md` when done:

```
## Execution Report
<your Execution Report output here>
```
