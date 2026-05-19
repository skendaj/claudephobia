#!/bin/bash
# Unified release: bumps version, builds Dev ID (.dmg) + MAS (.pkg),
# creates GitHub release, uploads MAS pkg to App Store Connect.
#
# Usage:  ./scripts/release.sh 1.0.2
#
# Required env (App Store Connect API key):
#   ASC_API_KEY_ID       App Store Connect API key ID (10-char alphanumeric)
#   ASC_API_ISSUER_ID    Issuer ID (UUID, e.g. 57246542-96fe-1a63-e053-...)
#   The .p8 key file must live at:
#     ~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8
#   (xcrun altool auto-discovers it there)
#
# Required identities (already configured in build-app.sh / build-app-mas.sh):
#   - notarytool keychain profile "clawdephobia-notary"
#   - Developer ID Application cert
#   - 3rd Party Mac Developer Application + Installer certs
#   - Provisioning profile in ~/Library/MobileDevice/Provisioning Profiles/

set -euo pipefail

cd "$(dirname "$0")/.."

APP_NAME="Clawdephobia"

# ────────────────────────────────────────────────────────────────────
# 1. Argument validation
# ────────────────────────────────────────────────────────────────────
if [ $# -ne 1 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.2"
    exit 1
fi

NEW_VERSION="$1"

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "ERROR: version must be N.N.N (got: $NEW_VERSION)"
    exit 1
fi

TAG="v${NEW_VERSION}"

# ────────────────────────────────────────────────────────────────────
# 2. Env / credential checks
# ────────────────────────────────────────────────────────────────────
: "${ASC_API_KEY_ID:?Set ASC_API_KEY_ID (App Store Connect API key ID)}"
: "${ASC_API_ISSUER_ID:?Set ASC_API_ISSUER_ID (App Store Connect issuer ID)}"

P8_PATH="${HOME}/.appstoreconnect/private_keys/AuthKey_${ASC_API_KEY_ID}.p8"
if [ ! -f "$P8_PATH" ]; then
    echo "ERROR: API key not found at $P8_PATH"
    echo "Download from App Store Connect → Users and Access → Keys, then place there."
    exit 1
fi

if ! security find-identity -v -p codesigning | grep -q "Developer ID Application"; then
    echo "ERROR: Developer ID Application certificate missing from keychain."
    exit 1
fi
if ! security find-identity -v | grep -q "3rd Party Mac Developer Application"; then
    echo "ERROR: 3rd Party Mac Developer Application certificate missing."
    exit 1
fi
if ! security find-identity -v | grep -q "3rd Party Mac Developer Installer"; then
    echo "ERROR: 3rd Party Mac Developer Installer certificate missing."
    exit 1
fi
if ! xcrun notarytool history --keychain-profile clawdephobia-notary >/dev/null 2>&1; then
    echo "ERROR: notarytool keychain profile 'clawdephobia-notary' missing."
    echo "Run: xcrun notarytool store-credentials clawdephobia-notary --apple-id ... --team-id 53CZ5753ZD --password ..."
    exit 1
fi

for tool in gh xcodegen jq awk sed; do
    command -v "$tool" >/dev/null || { echo "ERROR: $tool not installed"; exit 1; }
done

# ────────────────────────────────────────────────────────────────────
# 3. Strict git pre-flight
# ────────────────────────────────────────────────────────────────────
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "ERROR: must be on main (currently on: $CURRENT_BRANCH)"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo "ERROR: working tree dirty. Commit or stash first:"
    git status --short
    exit 1
fi

git fetch origin --tags --quiet

if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "ERROR: local tag $TAG already exists"
    exit 1
fi
if git ls-remote --tags origin | grep -q "refs/tags/${TAG}$"; then
    echo "ERROR: remote tag $TAG already exists"
    exit 1
fi

LOCAL_SHA=$(git rev-parse HEAD)
REMOTE_SHA=$(git rev-parse origin/main)
if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
    echo "ERROR: local main not in sync with origin/main. Pull/push first."
    exit 1
fi

# ────────────────────────────────────────────────────────────────────
# 4. Bump versions
# ────────────────────────────────────────────────────────────────────
CURRENT_MARKETING=$(awk '/MARKETING_VERSION:/ {print $2}' project.yml)
CURRENT_BUILD=$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" Resources/Info.plist)
NEW_BUILD=$((CURRENT_BUILD + 1))

echo ""
echo "==============================================="
echo " Release: ${CURRENT_MARKETING} (build ${CURRENT_BUILD}) → ${NEW_VERSION} (build ${NEW_BUILD})"
echo "==============================================="
echo ""

# project.yml
sed -i.bak "s/MARKETING_VERSION: .*/MARKETING_VERSION: ${NEW_VERSION}/" project.yml
rm project.yml.bak

# Info.plist CFBundleVersion
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${NEW_BUILD}" Resources/Info.plist

# Regenerate Xcode project so xcassets / target settings stay in sync
xcodegen generate

# ────────────────────────────────────────────────────────────────────
# 5. Commit + tag (build-app.sh derives version from git tag, so tag first)
# ────────────────────────────────────────────────────────────────────
git add project.yml Resources/Info.plist
git commit -m "release: ${TAG}"
git tag -a "$TAG" -m "$TAG"

# ────────────────────────────────────────────────────────────────────
# 6. Build Dev ID (.app + .dmg, signed + notarized)
# ────────────────────────────────────────────────────────────────────
echo ""
echo "─── Building Developer ID artifacts ───"
./scripts/build-app.sh

# Stash Dev ID outputs before MAS build wipes dist/
mkdir -p release-output/devid
mv "dist/${APP_NAME}-${NEW_VERSION}.dmg" release-output/devid/
mv "dist/${APP_NAME}.zip"                release-output/devid/ 2>/dev/null || true

# ────────────────────────────────────────────────────────────────────
# 7. Build MAS (.pkg)
# ────────────────────────────────────────────────────────────────────
echo ""
echo "─── Building Mac App Store artifacts ───"
./scripts/build-app-mas.sh

mkdir -p release-output/mas
mv "dist/${APP_NAME}.pkg" release-output/mas/

# ────────────────────────────────────────────────────────────────────
# 8. Push commit + tag
# ────────────────────────────────────────────────────────────────────
echo ""
echo "─── Pushing to origin ───"
git push origin main
git push origin "$TAG"

# ────────────────────────────────────────────────────────────────────
# 9. GitHub release with Dev ID DMG
# ────────────────────────────────────────────────────────────────────
echo ""
echo "─── Creating GitHub release ${TAG} ───"
gh release create "$TAG" \
    "release-output/devid/${APP_NAME}-${NEW_VERSION}.dmg" \
    --title "$TAG" \
    --generate-notes

# ────────────────────────────────────────────────────────────────────
# 10. Upload MAS pkg to App Store Connect
# ────────────────────────────────────────────────────────────────────
echo ""
echo "─── Uploading MAS pkg to App Store Connect ───"
xcrun altool --upload-app \
    --type macos \
    --file "release-output/mas/${APP_NAME}.pkg" \
    --apiKey "$ASC_API_KEY_ID" \
    --apiIssuer "$ASC_API_ISSUER_ID"

echo ""
echo "==============================================="
echo " Release ${TAG} complete."
echo "==============================================="
echo " GitHub:           $(gh release view "$TAG" --json url --jq .url)"
echo " App Store Connect: https://appstoreconnect.apple.com — wait for processing,"
echo "                    then submit build ${NEW_BUILD} for review."
echo " Artifacts:        release-output/devid/, release-output/mas/"
echo ""
