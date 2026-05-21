---
description: "Archive the current .agents/spec.md into .agents/archived/ under a given name. Use this when a game is complete to preserve its plan before starting the next one."
argument-hint: "Archive name (e.g. 'tictactoe', 'snake')"
tools: { execute: true, read: true }
---

1. Check that `.agents/spec.md` exists. If it does not, stop and tell the user there is nothing to archive.
2. Create the `.agents/archived/` directory if it does not exist.
3. Move `.agents/spec.md` to `.agents/archived/$ARGUMENTS.md`.
4. Confirm to the user that the spec has been archived at `.agents/archived/$ARGUMENTS.md`.
