#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/gitmerge.sh "commit message" [new-branch]
msg="${1:-update}" || echo "Usage: ./scripts/gitmerge.sh \"commit message\" [new-branch]"
new_branch="${2:-}"
current_branch=$(git branch --show-current)

# Stage + commit + push
git add -A
git commit -m "$msg"
git push origin $current_branch

# Create PR and capture number
pr_number=$(gh pr create --title "$msg" --body "$msg" --base main --head "$current_branch")

# Merge PR (choose one: --squash | --merge | --rebase)
gh pr merge "$pr_number" --squash --delete-branch

if [[ -n "$new_branch" ]]; then
  git checkout main
  git pull
  git checkout -b "$new_branch"
fi
