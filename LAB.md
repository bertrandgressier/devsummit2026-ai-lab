# AI4Dev Lab — 1h30

> Small model. Better context. Better output.

**Your stack**: Phaser 3 + TypeScript + Vite  
**Your tool**: OpenCode or GitHub Copilot CLI   
**Rule**: Small models only — `gpt-5-mini`, `claude-3-5-haiku`, `gemini-3-fash-preview`

> **Which files to fill in?**
>
> | Tool | Agent stubs | Prompt/Command stubs |
> |---|---|---|
> | **OpenCode** | `.opencode/agent/*.md` | `.opencode/command/*.md` (already wired) |
> | **GitHub Copilot** | `.github/agents/*.md` | `.github/prompts/*.prompt.md` |
>
> Fill in the files that match your tool. The hints and templates inside are identical.

---

## Setup (5 min)

### Option A — OpenCode

Install OpenCode if needed:

```bash
npm install -g opencode-ai
```

Connect GitHub Copilot:

```
/connect
```

Search for **GitHub Copilot**, navigate to `https://github.com/login/device`, enter the code, and authorize.

Select a small model:

```
/models
```

Choose `gpt-5-mini` (or `claude-3-5-haiku` / `gemini-3-fash-preview`).



### Option B — GitHub Copilot CLI

Run copilot-cli in your terminal:

```bash
copilot
```

Select a small model :  
`gpt-5-mini` · `claude-3-5-haiku` · `gemini-3-fash-preview`

---

Then start the app:

```bash
npm install && npm run dev   # → http://localhost:3000
```

Open the launcher. You'll see two challenges: Tic Tac Toe and Snake.  
Both are stubs — they compile, they render "implement me!". Your job is to implement them — with agents **you write yourself**.

---

## Step 1 — Without context (5 min)

Start a new session (OpenCode terminal or Copilot Chat). Ask:

> "Build me a Tic Tac Toe game with Phaser 3 and TypeScript"

Look at the output. What's wrong? What's missing? What did it invent?  
Write down 3 things that don't fit the project.

**The point**: the model is not bad. It just doesn't know your project.

---

## Step 2 — With context (5 min)

Read `ARCHITECTURE.md` (2 minutes, it's short).

Now ask again, but start with:
> "Read ARCHITECTURE.md. Then build me a Tic Tac Toe game."

Compare. The model now knows the folder structure, the types, the rules.

**Insight**: same model, better context → better output.

---

## Step 3 — Write the architect agent (12 min)

**OpenCode**: open `.opencode/agent/architect.md`  
**Copilot**: open `.github/agents/architect.md`

It's a stub with hints.

An agent definition tells a model what role to play: what it does, what it must never do, and what its output looks like.

Ask your tool to help you write it:
> "Help me write an architect agent for a Phaser 3 game. It reads ARCHITECTURE.md and produces an ordered implementation plan, one task per file. It never writes code. It asks for confirmation before finishing."

Write the result into the file, keeping the frontmatter.

Then test it:

**OpenCode** or **Copilot**:
```
/plan Tic Tac Toe — classic 3x3 grid, player X vs AI opponent
```

- Read the plan. Does it respect the folder structure from `ARCHITECTURE.md`?
- If something is wrong, reply: `modify: <what to change>`
- When satisfied, reply: `yes` — the plan is saved to `.agents/spec.md`

> Stuck? → `checkpoints/plan-agent.md`

---

## Step 4 — Write the designer agent (8 min)

**OpenCode**: open `.opencode/agent/designer.md`  
**Copilot**: open `.github/agents/designer.md`

Use your tool to help you write it.

Key constraint to include: no external assets — everything drawn with `this.add.graphics()`.

Test it:

**OpenCode** or **Copilot**:
```
/design Tic Tac Toe — dark futuristic, neon teal and coral
```

Open `DESIGN.md`. Every value must be exact — the coder will use them directly.

> Stuck? → `checkpoints/designer-agent.md`

---

## Step 5 — Skill vs agent: understand the difference (8 min)

Before writing the coder agent, look at `.agents/skills/phaser-patterns/SKILL.md`.  
It's pre-filled. Read it — 2 minutes.

| Concept | What it is |
|---|---|
| **Agent** | A role + rules for a conversation |
| **Skill** | Reusable knowledge injected into an agent's context |

A skill should add knowledge that **isn't already in your project files**.

**Why `game-architecture` would be a bad skill**: the coder agent already reads `ARCHITECTURE.md`
directly. A skill that copies the same content wastes context with zero benefit.

**Why `phaser-patterns` is a good skill**: Phaser code patterns — tweens, scene transitions,
keyboard input, real-time loops — are not in `ARCHITECTURE.md`. The coder gets them injected
automatically on every task without re-explaining.

**OpenCode**: the coder stub already declares `skills: [phaser-patterns]` in its frontmatter.  
That's all it takes for OpenCode to inject the skill.

**Copilot**: skills don't exist as a first-class concept. the skill should be loaded automatically. If not, ask it to load the skill with `#phaser-patterns`. 
---

## Step 6 — Write the coder agent (10 min)

**OpenCode**: open `.opencode/agent/coder.md`  
**Copilot**: open `.github/agents/coder.md`

This is the most constrained agent — strict rules produce correct code.

Include:
- What files to read before starting (at least 3)
- What is forbidden in `logic/` files
- What is forbidden in `scenes/` files
- What to do when blocked

Test it:

**OpenCode** or **Copilot**:
```
/code
```


Then:
```bash
npm run build   # must pass with zero TypeScript errors
```

> Stuck? → `checkpoints/coder-agent.md`

---

## Checkpoint sync #1 — ~45 min in

Facilitators will show the four agent definitions side by side. Grab the checkpoint you need if you're behind.

---

## Step 7 — Write the QA agent (7 min)

**OpenCode**: open `.opencode/agent/qa.md`  
**Copilot**: open `.github/agents/qa.md`

Write a QA agent that:
- Reads `ARCHITECTURE.md` to know what rules to enforce
- Reports violations with exact file path and line number
- Classifies issues: **Critical** / **Major** / **Minor**
- Never modifies code

Test it:

**OpenCode** or **Copilot**:
```
/qa src/games/tictactoe/scenes/GameScene.ts
```


Find at least 2 issues, fix them manually, run `npm run build` again.

> Stuck? → `checkpoints/qa-agent.md`

---

## Step 8 — Run it (3 min)

```bash
npm run dev
```

Open `http://localhost:3000`. Click "LAUNCH" on Tic Tac Toe. Play against the AI.

---

## Step 9 — Snake (25 min)

**Rule: you cannot modify your agents. Reuse them exactly as written.**

Read `checkpoints/snake-architecture.md` — it explains the key difference (real-time tick vs turn-based).

Then run the same loop:

**OpenCode** or **Copilot**:
```
/plan Snake — real-time arcade snake, eat food, avoid walls and yourself
/code
/qa src/games/snake/scenes/GameScene.ts
```

When done, open the launcher and play Snake.

**The insight**: the same agents you wrote delivered two completely different games.  
That's what good context engineering looks like.

---

## Checkpoint sync #2 — ~80 min in

Facilitators will show a working Snake. Catch up if needed.

---

## Wrap-up questions (5 min)

1. Why did the same model produce better output when you added `ARCHITECTURE.md`?
2. What is the difference between a **skill** and an **agent**? Give a concrete example from this lab.
3. Why would a `game-architecture` skill be useless here? What makes `phaser-patterns` useful?
4. Your QA agent found issues — what one rule would make it find *more* issues automatically?
5. What would you do differently on your next project?

---

## Checkpoints

| File | What's inside |
|---|---|
| `checkpoints/plan-agent.md` | Working architect agent definition |
| `checkpoints/designer-agent.md` | Working designer agent definition |
| `checkpoints/coder-agent.md` | Working coder agent definition |
| `checkpoints/qa-agent.md` | Working QA agent definition |
| `checkpoints/ttt-gamelogic.ts` | Working GameLogic implementation |
| `checkpoints/snake-architecture.md` | Snake-specific architecture notes |
