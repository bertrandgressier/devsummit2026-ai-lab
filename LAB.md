# AI4Dev Lab — 1h30

> Small model. Better context. Better output.

**Your stack**: Phaser 3 + TypeScript + Vite + CLI only (no IDE assistant)  
**Rule**: Small models only — Haiku 3.5, GPT-4o mini, Gemini Flash

---

## Before you start

```bash
npm install && npm run dev   # → http://localhost:3000
```

Open the launcher. You'll see two challenges: Tic Tac Toe and Snake.  
Both are stubs — they compile, they render "implement me!". Your job is to implement them using agents.

**Stay in the terminal. No IDE Copilot.**

---

## Step 1 — Without context (5 min)

Open your CLI. Ask your small model:

> "Build me a Tic Tac Toe game with Phaser 3 and TypeScript"

Look at the output. What's wrong? What's missing? What did it invent?  
Write down 3 things that don't fit the project.

**The point**: the model is not bad. It just doesn't know your project.

---

## Step 2 — With context (5 min)

Read `ARCHITECTURE.md` (2 minutes, it's short).

Now ask again, but this time start with:
> "Read ARCHITECTURE.md. Then build me a Tic Tac Toe game."

Compare. The model now knows the folder structure, the types, the rules.

**Insight**: same model, better context → better output.

---

## Step 3 — Plan (10 min)

```
/plan Tic Tac Toe — classic 3x3 grid, player X vs AI opponent
```

The architect agent reads `ARCHITECTURE.md`, produces an ordered task list, and waits for your confirmation.

- Read the plan carefully
- If something is wrong, reply: `modify: <what to change>`
- When satisfied, reply: `yes`

The plan is written to `.agents/spec.md`.

> Stuck? → `checkpoints/plan-agent.md` shows what a good plan looks like.

---

## Step 4 — Design (5 min)

```
/design Tic Tac Toe — dark futuristic, neon teal and coral
```

The designer agent produces `DESIGN.md` with exact hex colors, pixel coordinates, and animation specs.

Open `DESIGN.md`. Every value must be exact — the coder will use them directly.

> Stuck or want to compare? → `checkpoints/designer-agent.md`

---

## Step 5 — Code (15 min)

```
/code
```

The coder agent reads `.agents/spec.md` and `DESIGN.md`, then implements files one by one in order.  
It loads the `phaser-patterns` and `game-architecture` skills automatically.

Watch it work. If it gets blocked (missing type, unclear task), reply with the clarification it asks for.

After the coder finishes:
```bash
npm run build   # must pass with zero TypeScript errors
```

> Stuck? → `checkpoints/ttt-gamelogic.ts` for the logic reference

---

## Checkpoint sync #1 — ~30 min in

Facilitators will show a working Tic Tac Toe. If you're behind, grab the checkpoint file you need.

---

## Step 6 — QA (5 min)

```
/qa src/games/tictactoe/scenes/GameScene.ts
```

The QA agent reviews your file against `ARCHITECTURE.md` rules and the checklist.  
Find at least 2 issues, fix them, run `npm run build` again.

---

## Step 7 — Run it (3 min)

```
npm run dev
```

Open `http://localhost:3000`. Click "LAUNCH" on Tic Tac Toe. Play against the AI.

---

## Step 8 — Snake (25 min)

**Rule: you cannot create new agents. Reuse the same four.**

Read `checkpoints/snake-architecture.md` — it explains the key difference (real-time tick vs turn-based).

Then run the same loop:
```
/plan Snake — real-time arcade snake, eat food, avoid walls and yourself
/code
/qa src/games/snake/scenes/GameScene.ts
```

When done, open the launcher and play Snake.

**The insight**: the same agent chain delivered two completely different games.  
That's industrialized context engineering.

---

## Checkpoint sync #2 — ~80 min in

Facilitators will show a working Snake. Catch up if needed.

---

## Wrap-up questions (5 min)

Answer these before the session ends:

1. Why did the same small model produce better output when you added `ARCHITECTURE.md`?
2. What is the difference between a **skill** and an **agent**?
3. What made your QA agent useful? What would make it more useful?
4. What would you do differently on your next project?

---

## Checkpoints (ask facilitators to unlock)

| File | What's inside |
|---|---|
| `checkpoints/phase1-architecture.md` | Complete, annotated ARCHITECTURE.md |
| `checkpoints/plan-agent.md` | Example plan output for Tic Tac Toe |
| `checkpoints/designer-agent.md` | Designer agent reference |
| `checkpoints/coder-agent.md` | Coder agent reference |
| `checkpoints/ttt-gamelogic.ts` | Working GameLogic implementation |
| `checkpoints/snake-architecture.md` | Snake-specific architecture notes |
