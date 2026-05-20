#!/usr/bin/env bash
# sync-agents.sh — Mirror .agents/ to .opencode/ and .github/
# Source of truth: .agents/agents/ and .agents/skills/
# Run this after editing any agent or skill in .agents/
set -e

REPO="$(cd "$(dirname "$0")/.." && pwd)"

echo "Syncing agents..."

for src in "$REPO/.agents/agents/"*.md; do
  name="$(basename "$src")"
  cp "$src" "$REPO/.opencode/agent/$name"
  cp "$src" "$REPO/.github/agents/$name"
  echo "  ✓ agents/$name"
done

for src in "$REPO/.agents/prompts/"*.md; do
  name="$(basename "$src")"
  cp "$src" "$REPO/.github/prompts/$name"
  echo "  ✓ $name → .github/prompts/"
done

echo ""
echo "Note: .opencode/command/ files are NOT auto-synced (different format)."
echo "Edit them manually in .opencode/command/ after agent changes."
echo ""
echo "Done."
