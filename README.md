# AI4Dev Lab — Dev Summit 2026

**Stack**: Phaser 3 + TypeScript + Vite  
**Model constraint**: Small models only — Haiku 3.5, GPT-4o mini, Gemini Flash  
**CLI**: opencode or GitHub Copilot CLI

---

## Setup

```bash
git clone <repo-url>
cd ai4dev-lab
npm install
npm run dev   # → http://localhost:3000
```

---

## Configure your CLI


https://opencode.ai/docs/#install

```bash
npm install -g opencode-ai
opencode providers login 
```


select github-copilot` → opens browser → login to GitHub → authorize device


Running opencode in your terminal
```bash
opencode
```

Then select a small model:
In opencode settings (/models), select a **small model only**:
- `google-vertex/claude-haiku-4-5@20251001`
- `github-copilot/gpt-5-mini`
- `github-copilot/gemini-3-flash-preview`

Forbidden: `claude-sonnet`, `claude-opus`, `gpt-4o`, `gemini-pro`


---

## Slash commands

| Command | What it does |
|---|---|
| `/plan <game description>` | Generate an implementation plan (architect) |
| `/design <game + mood>` | Generate visual specs (designer) |
| `/code` | Implement the plan file by file (coder) |
| `/qa <file path>` | Review code for issues (QA) |

**opencode**: commands live in `.opencode/command/`  

---

## Agents

Four roles, each in `.opencode/agents/`:

| Agent | Role |
|---|---|
| `architect` | Reads game spec + ARCHITECTURE.md → produces an ordered plan |
| `designer` | Produces DESIGN.md with exact colors, layout, animations |
| `coder` | Implements one file per task, loads `phaser-patterns` skill |
| `qa` | Reviews code against ARCHITECTURE.md rules, never modifies files |

---

## Skills

Two skills in `.agents/skills/`:

| Skill | What it provides |
|---|---|
| `game-architecture` | Project structure, rules, types, scene contracts |
| `phaser-patterns` | Phaser 3 code patterns (interactive objects, tweens, transitions...) |

---

## File structure after setup

```
.agents/
  skills/        ← reusable knowledge injected into agents
  spec.md        ← generated plan (gitignored)
.opencode/
 agent/         ← role definitions
 command/       ← slash commands
checkpoints/     ← reference implementations (facilitator unlocks)
src/             ← Phaser project (implement inside games/)
ARCHITECTURE.md  ← read this first
LAB.md           ← step-by-step lab guide
```

---

## Verify build

```bash
npm run build   # must exit 0
```
