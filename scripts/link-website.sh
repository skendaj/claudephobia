#!/usr/bin/env bash
# Wires the deployed Vercel landing URL into the repo.
#   - Replaces placeholder URLs in README.md
#   - Sets the GitHub repo "Website" field via gh CLI
#   - Updates landing metadataBase + page metadata
#
# Usage:
#   ./scripts/link-website.sh https://clawdephobia.vercel.app
#   ./scripts/link-website.sh https://clawdephobia.app
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <https://your-vercel-url>"
  exit 1
fi

URL="${1%/}"
HOST="${URL#https://}"
HOST="${HOST#http://}"
REPO="skendaj/Claudephobia"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "→ Repo:    $REPO"
echo "→ Website: $URL"

# 1. README — swap placeholder host(s)
README="$REPO_ROOT/README.md"
echo "→ Patching $README"
# Replace any existing clawdephobia.vercel.app / clawdephobia.app references
sed -i.bak \
  -e "s#https://clawdephobia\.vercel\.app#$URL#g" \
  -e "s#https://clawdephobia\.app#$URL#g" \
  "$README"
rm -f "$README.bak"

# 2. landing layout.tsx — update metadataBase
LAYOUT="$REPO_ROOT/landing/app/layout.tsx"
echo "→ Patching $LAYOUT"
sed -i.bak \
  -e "s#new URL(\"https://clawdephobia\.app\")#new URL(\"$URL\")#g" \
  -e "s#new URL(\"https://clawdephobia\.vercel\.app\")#new URL(\"$URL\")#g" \
  "$LAYOUT"
rm -f "$LAYOUT.bak"

# 3. gh — set the repo homepage field
echo "→ Setting GitHub repo homepage..."
gh repo edit "$REPO" --homepage "$URL"

# 4. Show diff for review
echo
echo "Changes staged:"
git -C "$REPO_ROOT" diff --stat README.md landing/app/layout.tsx || true
echo
echo "Done. Commit when ready:"
echo "  git add README.md landing/app/layout.tsx"
echo "  git commit -m 'docs: link landing site ($HOST)'"
echo "  git push"
