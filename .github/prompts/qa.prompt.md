---
name: qa
description: Review one or more TypeScript files using the QA agent. Reports issues with exact file and line references. Never modifies code.
argument-hint: "File path(s) to review, e.g. 'src/games/tictactoe/scenes/GameScene.ts'"
agent: qa
---

1. Read `ARCHITECTURE.md`.
2. Review the following file(s): $input
3. Output a QA report with Critical / Major / Minor issues and a final verdict.
4. Do not modify any files.
