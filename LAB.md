# AI4Dev Lab — 1h30

> Small model. Better context. Better output.

| | Step | Duration |
|---|---|---|
| | [Ice breaker & Prompting tips](#ice-breaker--prompting-tips-10-min) | 10 min |
| | [Setup](#setup-5-min) | 5 min |
| 1 | [Without context](#step-1--without-context-5-min) | 5 min |
| 2 | [Context first, then a plan](#step-2--context-first-then-a-plan-10-min) | 10 min |
| 3 | [Write the designer agent](#step-3--write-the-designer-agent-5-min) | 5 min |
| 4 | [Skill vs agent](#step-4--skill-vs-agent-understand-the-difference-5-min) | 5 min |
| 5 | [Write AGENTS.md](#step-5--write-agentsmd-5-min) | 5 min |
| 6 | [Write the coder agent](#step-6--write-the-coder-agent-10-min) | 10 min |
| 7 | [Write the QA agent](#step-7--write-the-qa-agent-5-min) | 5 min |
| 8 | [Run it](#step-8--run-it-2-min) | 2 min |
| | [Checkpoint sync #1](#checkpoint-sync-1--62-min-in) | |
| 9 | [Snake](#step-9--snake-13-min) | 13 min |
| ★ | [Bonus — Orchestrator agent](#bonus--orchestrator-agent-opencode-only) | if time |
| | [Checkpoint sync #2](#checkpoint-sync-2--80-min-in) | |
| | [Wrap-up](#wrap-up-10-min) | 10 min |

**Your stack**: Phaser 3 + TypeScript + Vite  
**Your tool**: OpenCode or GitHub Copilot CLI   
**Rule**: Small models only — `gpt-5-mini`, `gpt-5.4-mini`, `claude-haiku-4-5`, `gemini-3-flash`

> In GitHub Copilot: `gpt-5-mini` costs **0×** (free), while `gpt-5.4-mini`, `claude-haiku-4-5`, and `gemini-3-flash` cost **0.33×** premium requests. Use them to see how context quality affects output across different cost tiers.

> **Which files to fill in?**
>
> | Tool | Agent stubs | Prompt/Command stubs |
> |---|---|---|
> | **OpenCode** | `.opencode/agent/*.md` | `.opencode/command/*.md` (already wired) |
> | **GitHub Copilot** | `.github/agents/*.md` | `.github/prompts/*.prompt.md` |
>
> Fill in the files that match your tool. The hints and templates inside are identical.

---

## Ice breaker & Prompting tips (10 min)

Welcome! Let's start with a quick ice breaker and some examples of what makes a good prompt when working with small models.

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

Choose `gpt-5-mini` (or `gpt-5.4-mini` / `claude-haiku-4-5` / `gemini-3-flash`).

> **OpenCode agent selection**: slash commands like `/plan`, `/code`, `/design`, `/qa` automatically route to the right agent — you don't need to select one manually. When writing agent files (Steps 2–7), stay in the default session (no agent selected). If you ever type a free-form message and want a specific agent, press **TAB** to pick it from the list — otherwise OpenCode uses the default agent.

> **When you move to a new step**, start a fresh session with `/new` first. That keeps the next agent run clean and avoids carrying old context into the new step.

### Option B — GitHub Copilot CLI

Run copilot-cli in your terminal:

```bash
copilot
```

Select a small model :  
`gpt-5-mini` · `gpt-5.4-mini` · `claude-haiku-4-5` · `gemini-3-flash`

> **Note for CLI users**: Slash commands (like `/plan`, `/code`) work directly in OpenCode and the VSCode Chat. In the **Copilot CLI**, you must use the `/agents` command to select your custom agent first, then type your request.

---

### Option C — GitHub Copilot inside VSCode

For those who prefer not to use the command line, the lab can also be completed with GitHub Copilot directly in VSCode.

Select a small model :  
`gpt-5-mini` · `gpt-5.4-mini` · `claude-haiku-4-5` · `gemini-3-flash`

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

## Step 2 — Context first, then a plan (10 min)

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
> "I need you to update the architect agent definition for a Phaser 3 TypeScript game. Files are `.opencode/agent/architect.md` for OpenCode or `.github/agents/architect.md` for Copilot. The agent's objective is to turn a game description into a structured plan that gives the coder context — not just a list of files. It must always read ARCHITECTURE.md first. Its output uses a fixed three-section template: **Goal** (one sentence on what to build and why), **Impacted Files** (list of file paths each with a description that includes key public methods or data the caller depends on — not just what the file does), and **Minimal Acceptance Criteria** (observable checklist of what done looks like). Always list `types/index.ts` first if new types are needed. Logic files must come before scene files. Maximum 8 files. It never writes code. It always saves the plan to .agents/spec.md immediately after presenting it — without waiting for confirmation. Then it asks: 'Plan saved. Does this look correct? Reply modify: \<what to change\> to adjust, or proceed.' If the user requests a modification, it updates the plan and saves again. The file must contain only the three sections — no preamble, no explanation, no confirmation question."

Write the result into the file, keeping the frontmatter.

> **OpenCode**: restart to reload the agent before testing.

Then test it:

**OpenCode**:
```
/plan Tic Tac Toe — classic 3x3 grid, player X vs AI opponent. Template exists under src/games/tictactoe/ — replace the "implement me" stub. Must launch from the menu.
```

**Copilot CLI**:
```
/agents  # Select "architect" from the list
Tic Tac Toe — classic 3x3 grid, player X vs AI opponent. Template exists under src/games/tictactoe/ — replace the "implement me" stub. Must launch from the menu.
```

**Copilot VSCode**:
```
/plan Tic Tac Toe — classic 3x3 grid, player X vs AI opponent. Template exists under src/games/tictactoe/ — replace the "implement me" stub. Must launch from the menu.
```

- Read the plan. Does the **Goal** capture what you asked for?
- Do the **Impacted Files** respect the folder structure from `ARCHITECTURE.md`?
- Do the **Minimal Acceptance Criteria** describe observable behaviour (not code)?
- If something is wrong, reply: `modify: <what to change>`
- The plan is saved to `.agents/spec.md` automatically — no confirmation needed

> Stuck? → [checkpoints/architect-agent.md](checkpoints/architect-agent.md)

---

## Step 3 — Write the designer agent (5 min)

**OpenCode**: open `.opencode/agent/designer.md`  
**Copilot**: open `.github/agents/designer.md`

Ask your tool to help you write it. Give it enough context:
> "I need you to update the designer agent definition for a Phaser 3 TypeScript game. Files are `.opencode/agent/designer.md` for OpenCode or `.github/agents/designer.md` for Copilot. The agent receives a game name and a mood or theme description. It must always read ARCHITECTURE.md first to know the canvas size (800×600). It produces a DESIGN.md file with exact visual specifications: a color palette (hex only — `0xRRGGBB` for Phaser graphics, `#RRGGBB` for text), typography, layout coordinates, animations, and interactive states. No external assets — every element must be drawable with `this.add.graphics()`. Every value must be a number or hex code — no 'approximately' or 'around'. The coder must be able to implement without any design decisions left to make."

Write the result into the file, keeping the frontmatter.

> **OpenCode**: restart to reload the agent before testing.

Test it:

**OpenCode**:
```
/design Tic Tac Toe — dark futuristic, neon teal and coral
```

**Copilot CLI**:
```
/agents  # Select "designer"
Tic Tac Toe — dark futuristic, neon teal and coral
```

**Copilot VSCode**:
```
/design Tic Tac Toe — dark futuristic, neon teal and coral
```

Open `DESIGN.md`. Every value must be exact — the coder will use them directly.

> Stuck? → [checkpoints/designer-agent.md](checkpoints/designer-agent.md)

---

## Step 4 — Skill vs agent: understand the difference (5 min)

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
> "Update the coder agent for a Phaser 3 TypeScript game (`.opencode/agent/coder.md` / `.github/agents/coder.md`). It reads ARCHITECTURE.md, DESIGN.md, and .agents/spec.md before every task, then implements one file at a time. It has two modes: if called with no argument it reads .agents/spec.md and implements every file in the Impacted Files list in order — skipping any file that already exists and does not contain 'implement me'; if called with an argument (e.g. 'fix the qa report') it treats the argument as the task and skips spec.md — if the argument is 'fix the qa report' it reads .agents/qa-report.md first. For each file it reads the spec description to know what public methods to implement, reads types/index.ts, applies DESIGN.md values, and outputs the complete TypeScript file only — no explanation, no markdown. When blocked, it stops and outputs: 'BLOCKED: <reason>'."

Write the result into the file, keeping the frontmatter.

> **OpenCode**: restart to reload the agent before testing.

Include:
- What files to read before starting (at least 3)
- What is forbidden in `logic/` files
- What is forbidden in `scenes/` files
- What to do when blocked

Test it:

**OpenCode**:
```
/code
```

**Copilot CLI**:
```
/agents  # Select "coder"
Run next task
```

**Copilot VSCode**:
```
/code
```


Then:
```bash
npm run build   # must pass with zero TypeScript errors
```

If the build fails, you can ask the agent to fix it:

**OpenCode**:
```
/code fix the TypeScript errors from npm run build
```

**Copilot CLI**:
```
/agents  # Select "coder"
fix the TypeScript errors from npm run build
```

**Copilot VSCode**:
```
/code fix the TypeScript errors from npm run build
```

But a better approach: update your coder agent definition to always run the build before finishing. Add this to its rules:

> Always run `npm run build` at the end of every task. If it fails, fix the errors and run it again before stopping.

This way, the agent self-corrects without you having to ask.

> Stuck? → [checkpoints/coder-agent.md](checkpoints/coder-agent.md)

---

## Step 7 — Write the QA agent (5 min)

**OpenCode**: open `.opencode/agent/qa.md`  
**Copilot**: open `.github/agents/qa.md`

A file-level review misses the big picture. The QA agent should scan the entire game — every file under `src/games/<game>/` — and produce a single consolidated report.

Ask your tool to help you write it:
> "Update the QA agent definition for a Phaser 3 TypeScript game (`.opencode/agent/qa.md` / `.github/agents/qa.md`). It receives a game name (e.g. `tictactoe`). It reads ARCHITECTURE.md first, then scans every TypeScript file under `src/games/<game>/`. It reports every violation with exact file path and line number. It classifies issues as Critical, Major, or Minor. It never modifies code. After the review it saves the full report to `.agents/qa-report.md`, then prints it to the conversation."

Write the result into the file, keeping the frontmatter.

> **OpenCode**: restart to reload the agent before testing.

Test it:

**OpenCode**:
```
/qa tictactoe
```

**Copilot CLI**:
```
/agents  # Select "qa"
tictactoe
```

**Copilot VSCode**:
```
/qa tictactoe
```

Read the report. If there are Critical or Major issues, hand them back to the coder — it will read `.agents/qa-report.md` automatically:

**OpenCode**:
```
/code fix the qa report
```

**Copilot CLI**:
```
/agents  # Select "coder"
fix the qa report
```

**Copilot VSCode**:
```
/code fix the qa report
```

Then run the build to confirm:

```bash
npm run build
```

> Stuck? → [checkpoints/qa-agent.md](checkpoints/qa-agent.md)

---

## Step 8 — Run it (2 min)

```bash
npm run dev
```

Open `http://localhost:3000`. Click "LAUNCH" on Tic Tac Toe. Play against the AI.

Once it works, archive the plan before moving on:

**OpenCode**:
```
/archive
```

**Copilot CLI**:
```
/agents  # Select "archive" (if available) or move .agents/spec.md manually
```

**Copilot VSCode**:
```
/archive
```

This reads the game name from `.agents/spec.md` and moves it to `.agents/archived/` so the next game starts with a clean slate.

---

## Checkpoint sync #1 — ~60 min in

Facilitators will show the four agent definitions side by side. Grab the checkpoint you need if you're behind.

> **Behind?** Switch to the `checkpoint-1` branch — it has all agents pre-filled and Tic Tac Toe working:
> ```bash
> git fetch origin && git checkout checkpoint-1
> ```

---

## Step 9 — Snake (13 min)

**Rule: you cannot modify your agents. Reuse them exactly as written.**

Snake is fundamentally different from Tic Tac Toe: it's real-time, not turn-based. Your architect agent doesn't know this — but you shouldn't have to explain Phaser internals in a plan prompt. The right place for technical context is `ARCHITECTURE.md`, not the prompt.

**First, update the architecture file** so the agent has the context it needs:

```
Read checkpoints/snake-architecture.md and append its content to ARCHITECTURE.md under a new section "## Snake — Architecture Notes".
```

Now run the same loop as before with a simple, business-level prompt:

**OpenCode**:
```
/plan Snake — real-time arcade snake, eat food, avoid walls and yourself. Template exists under src/games/snake/ — replace the "implement me" stub. Must launch from the menu.
/code
/qa snake
/code fix the qa report   # only if QA reports issues
/archive
```

**Copilot CLI**:
```
/agents  # Select "architect" -> "Snake — real-time arcade snake, eat food, avoid walls and yourself. Template exists under src/games/snake/ — replace the "implement me" stub. Must launch from the menu."
/agents  # Select "coder" -> "Run next task" (repeat as needed)
/agents  # Select "qa" -> "snake"
/agents  # Select "coder" -> "fix the qa report"  (only if QA reports issues)
/agents  # Select "archive"
```

**Copilot VSCode**:
```
/plan Snake — real-time arcade snake, eat food, avoid walls and yourself. Template exists under src/games/snake/ — replace the "implement me" stub. Must launch from the menu.
/code
/qa snake
/code fix the qa report   # only if QA reports issues
/archive
```

When done, open the launcher and play Snake.

**The insight**: you didn't change your agents, and you didn't write a technical prompt. You put the right context in the right file — and the agents did the rest.

---

## Bonus — Orchestrator agent (OpenCode only)

> Only if you have time. This is an advanced OpenCode feature.

So far you've been invoking each agent manually, one step at a time. OpenCode supports a different model: a **primary agent** that coordinates **subagents** automatically. You write the game description once — the orchestrator plans, designs, codes, reviews, and archives without you driving each step.

### Primary agents vs subagents

| | Primary agent | Subagent |
|---|---|---|
| **Invoked by** | You, directly | A primary agent (or via `@mention`) |
| **Model** | Your selected model | Can have its own dedicated model |
| **Use** | Drives the conversation | Executes a specific task |

Your 4 agents (architect, designer, coder, qa) are currently untyped — they behave like primary agents. To use them as subagents, you add one line to their frontmatter: `mode: subagent`.

A key benefit: each subagent can run on a **different model**. Architect and designer benefit from a more capable model — producing a solid plan and precise design spec requires reasoning. Coder and QA can run on a faster, cheaper model — they follow a clear spec file by file, which is a simpler task. (Though for complex games, a capable coder still helps.)

See the official docs: https://opencode.ai/docs/agents/#subagents

### Convert and create

Ask your tool to do it all in one shot:

> "Update `.opencode/agent/architect.md`, `designer.md`, `coder.md`, and `qa.md` to add `mode: subagent` to their frontmatter. Then create `.opencode/agent/orchestrator.md` as a primary agent (`mode: primary`). It receives a game description. It runs the full pipeline in order: architect to produce a plan and wait for user confirmation, then designer for visual specs, then coder for each task in the plan one by one, then QA to review the full game, then archive. It never writes code itself — it only delegates."

> **Restart OpenCode** to reload all modified agents before testing.

### Test it

```
@orchestrator build Tetris — falling blocks, one piece falls at a time, player moves and rotates it with arrow keys, full rows disappear and score increases, game over when blocks reach the top. Add it to the launcher so it appears alongside Tic Tac Toe and Snake.
```

Watch the subagents fire in sequence. Use **Leader+Down** to navigate into a child session and see what a subagent is doing, then **Up** to return to the orchestrator.

> Stuck? → [checkpoints/orchestrator-agent.md](checkpoints/orchestrator-agent.md)

> **Want a working solution?** Switch to the `bonus-orchestrator` branch:
> ```bash
> git fetch origin && git checkout bonus-orchestrator
> ```

---

## Checkpoint sync #2 — ~80 min in

Facilitators will show a working Snake. Catch up if needed.

---

## Wrap-up (10 min)

1. Why did the same model produce better output when you added `ARCHITECTURE.md`?
2. What is the difference between a **skill** and an **agent**? Give a concrete example from this lab.
3. Why would a `game-architecture` skill be useless here? What makes `phaser-patterns` useful?
4. The QA agent currently only reads files. What tool access would make it more efficient — and what could it catch automatically that it misses today?
5. The plan lives in `.agents/spec.md`. In a real project, where else could it live — and what would change if it was stored in your ticketing system (Jira, GitHub Issues...)?
6. What would you do differently on your next project?

---

## Checkpoints

| File | What's inside |
|---|---|
| `checkpoints/architect-agent.md` | Working architect agent definition |
| `checkpoints/designer-agent.md` | Working designer agent definition |
| `checkpoints/coder-agent.md` | Working coder agent definition |
| `checkpoints/qa-agent.md` | Working QA agent definition |
| `checkpoints/orchestrator-agent.md` | Working orchestrator agent definition (bonus) |
| `checkpoints/ttt-gamelogic.ts` | Working GameLogic implementation |
| `checkpoints/snake-architecture.md` | Snake-specific architecture notes |
