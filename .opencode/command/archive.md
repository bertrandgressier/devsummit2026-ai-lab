---
description: "Archive the current .agents/spec.md into .agents/archived/. Use this when a game is complete to preserve its plan before starting the next one."
tools: { execute: true, read: true }
---

1. Check that `.agents/spec.md` exists. If it does not, stop and tell the user there is nothing to archive.
2. Read `.agents/spec.md` and extract the game name from its content.
3. Create the `.agents/archived/` directory if it does not exist.
4. Move `.agents/spec.md` to `.agents/archived/<game-name>.md`.
5. Confirm to the user that the spec has been archived at `.agents/archived/<game-name>.md`.
