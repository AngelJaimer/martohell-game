#!/usr/bin/env bash
# One-shot: turn this folder into a brand-new GitHub repo called "martorell-quest".
# Requires the GitHub CLI (https://cli.github.com) logged in:  gh auth login
set -e

REPO_NAME="${1:-martorell-quest}"

git init -b main
git add .
git commit -m "Martorell Quest: a Zelda-style action-adventure of Martorell (ES/CA/EN)"

# Creates the repo under your account and pushes. Public; change to --private if you prefer.
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

echo
echo "✅ Done. Repo: https://github.com/$(gh api user -q .login)/$REPO_NAME"
echo "   Enable GitHub Pages (Settings → Pages → 'GitHub Actions') to play it online."
