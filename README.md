![DevSummit 2026](public/assets/images/devsummit.png)

# devsummit2026-ai-lab

**AI4Dev Lab** — Small model. Better context. Better output.

**Stack**: Phaser 3 + TypeScript + Vite  
**Model constraint**: Small models only — `gpt-5-mini`, `gpt-5.4-mini`, `claude-haiku-4-5`, `gemini-3-flash`  
**CLI**: OpenCode or GitHub Copilot

> In GitHub Copilot: `gpt-5-mini` costs **0×** (free), `gpt-5.4-mini` / `claude-haiku-4-5` / `gemini-3-flash` cost **0.33×**.

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

select `github-copilot` → opens browser → login to GitHub → authorize device


Running opencode in your terminal
```bash
opencode
```

Then select a small model:
In opencode settings (/models), select a **small model only**:
- `github-copilot/gpt-5-mini` (0×)
- `github-copilot/gpt-5.4-mini` (0.33×)
- `github-copilot/claude-haiku-4-5` (0.33×)
- `github-copilot/gemini-3-flash` (0.33×)

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
| `/code [instruction]` | `code.prompt.md` | Implement plan files in order, or act on an explicit instruction |
| `/qa <game name>` | `qa.prompt.md` | Review all game files, save report to `.agents/qa-report.md` |
| `/archive` | `archive.prompt.md` | Archive the current spec before the next game |

**OpenCode**: commands live in `.opencode/command/`  
**Copilot**: prompts live in `.github/prompts/`

---

## Agents

Four roles — fill in the stub that matches your tool:

| Agent | Role | OpenCode | Copilot |
|---|---|---|---|
| `architect` | Reads game description + ARCHITECTURE.md → produces ordered plan saved to `.agents/spec.md` | `.opencode/agent/architect.md` | `.github/agents/architect.md` |
| `designer` | Produces DESIGN.md with exact colors, layout, animations | `.opencode/agent/designer.md` | `.github/agents/designer.md` |
| `coder` | Implements all spec files in order (skips already-done), or acts on an explicit instruction | `.opencode/agent/coder.md` | `.github/agents/coder.md` |
| `qa` | Reviews code against ARCHITECTURE.md rules, saves report to `.agents/qa-report.md`, never modifies files | `.opencode/agent/qa.md` | `.github/agents/qa.md` |

---

## Skills

One skill in `.agents/skills/`:

| Skill | What it provides |
|---|---|
| `phaser-patterns` | Phaser 3 code patterns (interactive objects, tweens, transitions...) |

**OpenCode**: skills are declared in agent frontmatter (`skills: [phaser-patterns]`).  
**Copilot**: instruct the agent to read `.agents/skills/phaser-patterns/SKILL.md` at startup.

---

## File structure after setup

```
.agents/
  skills/        ← reusable knowledge injected into agents
  spec.md        ← generated plan (gitignored)
  qa-report.md   ← latest QA report (gitignored)
.opencode/
  agent/         ← OpenCode role definitions
  command/       ← OpenCode slash commands
.github/
  agents/        ← Copilot agent definitions
  prompts/       ← Copilot reusable prompts
checkpoints/     ← reference implementations (facilitator unlocks)
src/             ← Phaser project (implement inside games/)
AGENTS.md        ← auto-loaded by every agent, maps key project files
ARCHITECTURE.md  ← folder structure, mandatory rules, scene types
LAB.md           ← step-by-step lab guide
```

---

## Checkpoint branches

| Branch | What's in it |
|---|---|
| `checkpoint-1` | All agents pre-filled, Tic Tac Toe working — start here for Step 9 |
| `bonus-orchestrator` | Full orchestrator setup with all subagents configured |

```bash
git fetch origin && git checkout checkpoint-1
```

---

## Verify build

```bash
npm run build   # must exit 0
```
