#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

APP_NAME="Clawdephobia"
BUILD_DIR=".build/release"
APP_BUNDLE="dist/${APP_NAME}.app"
CONTENTS="${APP_BUNDLE}/Contents"
SIGNING_IDENTITY="Developer ID Application: Bruno Skendaj (53CZ5753ZD)"

# Derive version from the nearest git tag (strip leading 'v')
VERSION=$(git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || echo "0.0.0")
echo "Version: ${VERSION}"
DMG_NAME="${APP_NAME}-${VERSION}.dmg"

echo "Building ${APP_NAME}..."
swift build -c release

echo "Creating app bundle..."
rm -rf dist
mkdir -p "${CONTENTS}/MacOS"
mkdir -p "${CONTENTS}/Resources"

# Copy binary
cp "${BUILD_DIR}/${APP_NAME}" "${CONTENTS}/MacOS/${APP_NAME}"

# Copy icon from SPM resource bundle into app Resources
RESOURCE_BUNDLE=$(find .build -path "*/release/${APP_NAME}_${APP_NAME}.bundle" -type d | head -1)
if [ -n "$RESOURCE_BUNDLE" ] && [ -f "$RESOURCE_BUNDLE/icon.png" ]; then
    cp "$RESOURCE_BUNDLE/icon.png" "${CONTENTS}/Resources/icon.png"
    echo "App icon (icon.png) included."
elif [ -f "Sources/Resources/icon.png" ]; then
    cp "Sources/Resources/icon.png" "${CONTENTS}/Resources/icon.png"
    echo "App icon (icon.png) included from source."
else
    echo "Warning: icon.png not found."
fi

# Copy Info.plist and stamp version from git tag
cp Resources/Info.plist "${CONTENTS}/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${VERSION}" "${CONTENTS}/Info.plist"

# Copy app icon if it exists
if [ -f "Resources/AppIcon.icns" ]; then
    cp "Resources/AppIcon.icns" "${CONTENTS}/Resources/AppIcon.icns"
    echo "App icon included."
else
    echo "Warning: Resources/AppIcon.icns not found. App will have no icon."
fi

# Code sign with Developer ID + hardened runtime (required for notarization)
echo "Signing with: ${SIGNING_IDENTITY}"
codesign --force --options runtime --entitlements Resources/Claudephobia.entitlements --sign "${SIGNING_IDENTITY}" "${APP_BUNDLE}"
echo "Signed."

# Verify signature
codesign --verify --verbose "${APP_BUNDLE}"
echo "Signature verified."

# Notarize
echo ""
echo "Creating zip for notarization..."
cd dist
zip -r "${APP_NAME}.zip" "${APP_NAME}.app"

echo "Submitting for notarization..."
xcrun notarytool submit "${APP_NAME}.zip" --keychain-profile "clawdephobia-notary" --wait

echo "Stapling notarization ticket..."
xcrun stapler staple "${APP_NAME}.app"

cd ..

echo ""
echo "Creating DMG with drag-to-Applications layout..."
TMP_DMG_DIR=$(mktemp -d)
cp -r "${APP_BUNDLE}" "${TMP_DMG_DIR}/"
ln -s /Applications "${TMP_DMG_DIR}/Applications"

hdiutil create \
  -srcfolder "${TMP_DMG_DIR}" \
  -volname "${APP_NAME}" \
  -fs HFS+ \
  -fsargs "-c c=64,a=16,b=16" \
  -format UDRW \
  -size 200m \
  "dist/${APP_NAME}-rw.dmg"

DEVICE=$(hdiutil attach -readwrite -noverify "dist/${APP_NAME}-rw.dmg" | grep "Apple_HFS" | awk '{print $1}')
sleep 2

osascript <<APPLESCRIPT
tell application "Finder"
  tell disk "${APP_NAME}"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set bounds of container window to {200, 150, 740, 470}
    set icon size of the icon view options of container window to 80
    set arrangement of the icon view options of container window to not arranged
    set position of item "${APP_NAME}.app" of container window to {130, 175}
    set position of item "Applications" of container window to {410, 175}
    close
    open
    update without registering applications
    delay 2
  end tell
end tell
APPLESCRIPT

hdiutil detach "${DEVICE}"
hdiutil convert "dist/${APP_NAME}-rw.dmg" \
  -format UDZO \
  -imagekey zlib-level=9 \
  -o "dist/${DMG_NAME}"
rm "dist/${APP_NAME}-rw.dmg"
rm -rf "${TMP_DMG_DIR}"

echo "Signing DMG..."
codesign --sign "${SIGNING_IDENTITY}" "dist/${DMG_NAME}"

echo "Submitting DMG for notarization..."
xcrun notarytool submit "dist/${DMG_NAME}" --keychain-profile "clawdephobia-notary" --wait

echo "Stapling DMG..."
xcrun stapler staple "dist/${DMG_NAME}"

echo ""
echo "Done: dist/${APP_NAME}.app (signed + notarized)"
echo "Distribution DMG: dist/${DMG_NAME}"
