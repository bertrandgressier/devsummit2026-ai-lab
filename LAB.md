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

## Step 2 — Context first, then a plan (17 min)

### Why planning matters

Before writing a single line of code, you need a plan. A plan defines which files to create, in what order, and what each file is responsible for. Without it, the model invents structure — and small models invent more than large ones.

This is why the first agent you write is the **architect**: its only job is to produce a plan. No code. Just a clear, ordered list of tasks the coder can follow.

**Insight**: same model, better context → better output. The architect agent automates exactly this: it always reads the right files before responding.

### Write the architect agent

**OpenCode**: open `.opencode/agent/architect.md`  
**Copilot**: open `.github/agents/architect.md`

It's a stub with hints. Open it and read the objective.

An agent definition tells a model what role to play, what it must always do, what it must never do, and exactly what its output looks like. Small models need more structure — vague instructions produce vague plans.

Ask your tool to help you write it. Give it enough context:
> "I need you update files for architect agent definition for a Phaser 3 TypeScript game. Files are `.opencode/agent/architect.md` for OpenCode or `.github/agents/architect.md` for Copilot. The agent's objective is to turn a game description into a structured implementation plan that a coder can follow file by file. It must always read ARCHITECTURE.md first to know the folder structure, scene types, and coding rules. It produces a numbered list of tasks, one per file, each with: the file path, what to implement, and which types or interfaces to use. Maximum 8 tasks. It never writes code. At the end of every plan it asks: 'Does this plan look correct? Reply yes to confirm or modify: <what to change>.' When the user replies yes, it saves the plan to .agents/spec.md."

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

## Step 3 — Write the designer agent (8 min)

**OpenCode**: open `.opencode/agent/designer.md`  
**Copilot**: open `.github/agents/designer.md`

Ask your tool to help you write it. Give it enough context:
> "I need you to update the designer agent definition for a Phaser 3 TypeScript game. Files are `.opencode/agent/designer.md` for OpenCode or `.github/agents/designer.md` for Copilot. The agent receives a game name and a mood or theme description. It must always read ARCHITECTURE.md first to know the canvas size (800×600). It produces a DESIGN.md file with exact visual specifications: a color palette (hex only — `0xRRGGBB` for Phaser graphics, `#RRGGBB` for text), typography, layout coordinates, animations, and interactive states. No external assets — every element must be drawable with `this.add.graphics()`. Every value must be a number or hex code — no 'approximately' or 'around'. The coder must be able to implement without any design decisions left to make."

Write the result into the file, keeping the frontmatter.

Test it:

**OpenCode** or **Copilot**:
```
/design Tic Tac Toe — dark futuristic, neon teal and coral
```

Open `DESIGN.md`. Every value must be exact — the coder will use them directly.

> Stuck? → `checkpoints/designer-agent.md`

---

## Step 4 — Skill vs agent: understand the difference (8 min)

Before writing the coder agent, look at `.agents/skills/phaser-patterns/SKILL.md`.  
It's pre-filled. Read it — 2 minutes.

| Concept | What it is |
|---|---|
| **Agent** | A role + rules for a conversation |
| **Skill** | Reusable knowledge injected into an agent's context |

A skill should add knowledge that **isn't already in your project files**.

**Why `game-architecture` would be a bad skill**: the coder agent already reads `ARCHITECTURE.md`
directly. A skill that copies the same content wastes context with zero benefit.

Open `.agents/skills/game-architecture/SKILL.md` and read it. You'll see it duplicates what's already in `ARCHITECTURE.md`. Delete it:

```bash
rm -rf .agents/skills/game-architecture
```

**Why `phaser-patterns` is a good skill**: Phaser code patterns — tweens, scene transitions,
keyboard input, real-time loops — are not in `ARCHITECTURE.md`. The coder gets them injected
automatically on every task without re-explaining.

### How skill loading works

Skills are loaded **automatically** — the agent decides based on the skill's description whether it's relevant for the current task. You don't call them manually.

If a skill isn't loading when you'd expect it to, there are two likely causes:
- The skill description is too vague or doesn't match the agent's task
- Too many skills are registered and the model picks the wrong ones

You *can* force-load a skill, but that's a fallback, not the intended workflow:

**OpenCode**: mention the skill name explicitly in your message, or add it to the agent's frontmatter:
```yaml
skills: [phaser-patterns]
```

**Copilot**: reference it explicitly with `#phaser-patterns` in your message.

**Note with small models**: skill selection is less reliable. Small models sometimes skip relevant skills or load irrelevant ones. If generated code is missing Phaser patterns you'd expect, check whether the skill was injected.

---

## Step 5 — Write AGENTS.md (5 min)

`AGENTS.md` is automatically loaded by every agent at the start of each conversation. It's the one file that's always in context — no matter which agent runs.

That makes it valuable, but also dangerous if misused. The rule is: **keep it minimal and non-redundant**.

It should not repeat what's already in `ARCHITECTURE.md`, `DESIGN.md`, or any other file. Instead it should act as a **map**: short descriptions of what each key file contains, so the agent knows what to read depending on the task.

Ask your tool to create it:
> "Create an AGENTS.md file at the project root for a Phaser 3 TypeScript game. It must be minimal — no rules, no code, no content that duplicates existing files. It lists the key project files with one-line descriptions: what each file contains and when an agent should read it. Files to reference: ARCHITECTURE.md, DESIGN.md, .agents/spec.md, src/games/tictactoe/types/index.ts, src/games/snake/types/index.ts."

Open the file once created. Ask yourself: does every line help an agent decide what to read? If something is already in `ARCHITECTURE.md`, delete it.

---

## Step 6 — Write the coder agent (10 min)

**OpenCode**: open `.opencode/agent/coder.md`  
**Copilot**: open `.github/agents/coder.md`

This is the most constrained agent — strict rules produce correct code.

Ask your tool to help you write it. Give it enough context:
> "Update the coder agent for a Phaser 3 TypeScript game (`.opencode/agent/coder.md` / `.github/agents/coder.md`). It reads ARCHITECTURE.md, DESIGN.md, and .agents/spec.md before every task, then implements one file at a time. Output is the complete TypeScript file only — no explanation. When blocked, it stops and outputs: 'BLOCKED: <reason>'."

Write the result into the file, keeping the frontmatter.

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

If the build fails, you can ask the agent to fix it:
```
/code fix the TypeScript errors from npm run build
```

But a better approach: update your coder agent definition to always run the build before finishing. Add this to its rules:

> Always run `npm run build` at the end of every task. If it fails, fix the errors and run it again before stopping.

This way, the agent self-corrects without you having to ask.

> Stuck? → `checkpoints/coder-agent.md`

---

## Checkpoint sync #1 — ~45 min in

Facilitators will show the four agent definitions side by side. Grab the checkpoint you need if you're behind.

---

## Step 7 — Write the QA agent (7 min)

**OpenCode**: open `.opencode/agent/qa.md`  
**Copilot**: open `.github/agents/qa.md`

A file-level review misses the big picture. The QA agent should scan the entire game — every file under `src/games/<game>/` — and produce a single consolidated report.

Ask your tool to help you write it:
> "Update the QA agent definition for a Phaser 3 TypeScript game (`.opencode/agent/qa.md` / `.github/agents/qa.md`). It receives a game name (e.g. `tictactoe`). It reads ARCHITECTURE.md first, then scans every TypeScript file under `src/games/<game>/`. It reports every violation with exact file path and line number. It classifies issues as Critical, Major, or Minor. It never modifies code. Output is a single QA report for the whole game."

Write the result into the file, keeping the frontmatter.

Test it:

**OpenCode** or **Copilot**:
```
/qa tictactoe
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
/qa snake
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
