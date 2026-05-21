![DevSummit 2026](public/assets/images/devsummit.png)

# devsummit2026-ai-lab

**AI4Dev Lab** — Small model. Better context. Better output.

**Stack**: Phaser 3 + TypeScript + Vite  
**Model constraint**: Small models only — Haiku 3.5, GPT-4o mini, Gemini Flash  
**CLI**: OpenCode or GitHub Copilot

> Presented by [@bertrandgressier](https://github.com/bertrandgressier) & [@ThomasRumasLM](https://github.com/ThomasRumasLM)

### [→ Open the lab](LAB.md)

---

> **Which files to fill in?**
>
> | Tool | Agent stubs | Prompt/Command stubs |
> |---|---|---|
> | **OpenCode** | `.opencode/agent/*.md` | `.opencode/command/*.md` (already wired) |
> | **GitHub Copilot** | `.github/agents/*.md` | `.github/prompts/*.prompt.md` |

---

## Setup

```bash
git clone https://github.com/bertrandgressier/devsummit2026-ai-lab.git
cd devsummit2026-ai-lab
npm install
npm run dev   # → http://localhost:3000
```

---

## Configure your CLI

### OpenCode

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

### GitHub Copilot

Open the project in VS Code with the GitHub Copilot extension.  
Use **Copilot Chat** in agent mode — select a small model in Copilot Chat settings.

Agents: invoke via `@<agent-name>` in Copilot Chat.  
Prompts: run via the Copilot Chat prompt runner or `/` prefix.

---

## Slash commands / Prompts

| OpenCode command | Copilot prompt | What it does |
|---|---|---|
| `/plan <game description>` | `plan.prompt.md` | Generate an implementation plan (architect) |
| `/design <game + mood>` | `design.prompt.md` | Generate visual specs (designer) |
| `/code` | `code.prompt.md` | Implement the plan file by file (coder) |
| `/qa <file path>` | `qa.prompt.md` | Review code for issues (QA) |

**OpenCode**: commands live in `.opencode/command/`  
**Copilot**: prompts live in `.github/prompts/`

---

## Agents

Four roles — fill in the stub that matches your tool:

| Agent | Role | OpenCode | Copilot |
|---|---|---|---|
| `architect` | Reads game spec + ARCHITECTURE.md → produces an ordered plan | `.opencode/agent/architect.md` | `.github/agents/architect.md` |
| `designer` | Produces DESIGN.md with exact colors, layout, animations | `.opencode/agent/designer.md` | `.github/agents/designer.md` |
| `coder` | Implements one file per task, loads `phaser-patterns` skill | `.opencode/agent/coder.md` | `.github/agents/coder.md` |
| `qa` | Reviews code against ARCHITECTURE.md rules, never modifies files | `.opencode/agent/qa.md` | `.github/agents/qa.md` |

---

## Skills

Two skills in `.agents/skills/`:

| Skill | What it provides |
|---|---|
| `game-architecture` | Project structure, rules, types, scene contracts |
| `phaser-patterns` | Phaser 3 code patterns (interactive objects, tweens, transitions...) |

**OpenCode**: skills are declared in agent frontmatter (`skills: [phaser-patterns]`).  
**Copilot**: instruct the agent to read `.agents/skills/phaser-patterns/SKILL.md` at startup.

---

## File structure after setup

```
.agents/
  skills/        ← reusable knowledge injected into agents
  spec.md        ← generated plan (gitignored)
.opencode/
  agent/         ← OpenCode role definitions
  command/       ← OpenCode slash commands
.github/
  agents/        ← Copilot agent definitions
  prompts/       ← Copilot reusable prompts
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
