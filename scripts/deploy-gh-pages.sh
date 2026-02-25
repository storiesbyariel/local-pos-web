#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

if [[ ! -d dist ]]; then
  echo "dist/ not found. Run npm run build first."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  git worktree remove "$TMP_DIR" --force >/dev/null 2>&1 || true
}
trap cleanup EXIT

git fetch origin gh-pages:gh-pages >/dev/null 2>&1 || true
git worktree add --force "$TMP_DIR" gh-pages >/dev/null

cd "$TMP_DIR"
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$REPO_ROOT/dist"/. .
touch .nojekyll

git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git commit -m "deploy: update gh-pages static build"
git push origin gh-pages

echo "Deployed to gh-pages successfully."