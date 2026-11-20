#!/usr/bin/env bash
# Deploys the site to Cloudflare Pages (project "dumbworkouts").
# Needs: `npx wrangler login` once.
set -euo pipefail
cd "$(dirname "$0")"
PROJECT="${PROJECT:-dumbworkouts}"
if [ ! -x node_modules/.bin/tsc ]; then npm install --no-audit --no-fund; fi
npm run build
npx --yes wrangler pages project list 2>/dev/null | grep -q " $PROJECT " ||
  npx --yes wrangler pages project create "$PROJECT" --production-branch main --force
npx --yes wrangler pages deploy dist --project-name "$PROJECT" --branch main --commit-dirty=true
