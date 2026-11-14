#!/usr/bin/env bash
# Deploys the site to Cloudflare Pages (project "dumbworkouts").
# Needs: `npx wrangler login` once.
set -euo pipefail
cd "$(dirname "$0")"
PROJECT="${PROJECT:-dumbworkouts}"
OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT
cp index.html app.js data.js styles.css "$OUT"/
npx --yes wrangler pages project list 2>/dev/null | grep -q " $PROJECT " ||
  npx --yes wrangler pages project create "$PROJECT" --production-branch main --force
npx --yes wrangler pages deploy "$OUT" --project-name "$PROJECT" --branch main --commit-dirty=true
