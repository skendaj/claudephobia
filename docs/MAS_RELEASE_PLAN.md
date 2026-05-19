# Post-Approval Cleanup Plan — Clawdephobia

App is accepted by App Review. Two validation errors blocking the build upload, plus user wants version unification between GitHub releases and Mac App Store.

---

## Validation errors

```
CFBundleShortVersionString [1.0.0] must be higher than previously approved [1.0.0]
Pre-Release Train '1.0.0' is closed for new build submissions
```

Train `1.0.0` is locked in App Store Connect. Must move to a new marketing version. `CFBundleVersion` (build number) must also strictly increase per upload within a train.

---

## Version detection — how it works today

- `UpdateChecker.swift:60` `currentVersion()` → reads `CFBundleShortVersionString` from `Bundle.main.infoDictionary`.
- `UpdateChecker.swift:19-23` `isFromAppStore` → checks for `MASReceipt` in `Bundle.main.appStoreReceiptURL`. True ⇒ skips GitHub check entirely (App Store handles updates).
- `UpdateChecker.swift:30` polls `https://api.github.com/repos/skendaj/Claudephobia/releases/latest`, strips leading `v` from `tag_name`, compares numerically via `isNewer`.
- `Info.plist:20` `CFBundleShortVersionString = $(MARKETING_VERSION)`. `project.yml:11` `MARKETING_VERSION: 1.0.0`. **Substitution only happens through xcodebuild** — the SPM-based `build-app-mas.sh` ships the literal string, so MAS builds must move to xcodebuild (or hardcode the value before `swift build`).

---

## Version unification — reset to v1

No Dev ID users in the wild (user confirmed). Safe to wipe GitHub release history and start fresh at v1.

### Step 1 — nuke GitHub releases + tags

```bash
gh release list --json tagName -L 200 | jq -r '.[].tagName' \
  | xargs -I{} gh release delete {} --yes --cleanup-tag
git tag -l | xargs git tag -d
gh release list -L 5            # expect empty
git tag --list | wc -l          # expect 0
```

`--cleanup-tag` removes both the GitHub release and its remote tag. The local `git tag -d` loop clears local tags.

### Step 2 — bump version

- `project.yml:11` → `MARKETING_VERSION: 1.0.1` (train `1.0.0` is closed in App Store Connect).
- `Resources/Info.plist:22` → `CFBundleVersion: 10` (must exceed any build number used in the closed `1.0.0` train; pick safely high to avoid future "must be higher" errors).

### Step 3 — fix the `$(MARKETING_VERSION)` substitution bug in MAS build

`scripts/build-app-mas.sh:14` runs `swift build` and then `cp Resources/Info.plist` on line 37 — no xcodebuild = no `$(MARKETING_VERSION)` expansion. Currently the literal token ships in the bundle, which is what caused (or will cause) Transporter validation errors on `CFBundleShortVersionString`.

Two fixes:

**Quick — hardcode in `Resources/Info.plist:20`:**
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
```

**Proper — substitute at copy time in `build-app-mas.sh`, replace line 37:**
```bash
VERSION=$(awk '/MARKETING_VERSION:/ {print $2}' project.yml)
sed "s/\$(MARKETING_VERSION)/${VERSION}/g" Resources/Info.plist > "${CONTENTS}/Info.plist"
```

### Step 4 — rebuild + upload

```bash
xcodegen generate
./scripts/build-app-mas.sh
# drag dist/Clawdephobia.pkg into Transporter.app, validate, deliver
```

### Step 5 — after Apple accepts

```bash
git tag v1.0.1
git push origin v1.0.1
gh release create v1.0.1 --generate-notes
```

Both stores aligned. Future releases: bump `MARKETING_VERSION`, bump `CFBundleVersion`, tag matching `vX.Y.Z`.

---

## Files to edit (post-approval, when implementing)

- `project.yml:11` — new `MARKETING_VERSION`.
- `Resources/Info.plist:22` — `CFBundleVersion` bump (and consider replacing `$(MARKETING_VERSION)` on line 20 with the literal version if continuing to use `build-app-mas.sh` with SPM).
- `scripts/build-app-mas.sh` — long-term: switch to `xcodebuild archive` + `-exportArchive` so `$(MARKETING_VERSION)` substitution works and the widget can be embedded. Short-term: hardcode the version string in Info.plist before signing.

---

## Quick command for next upload

```bash
# After editing project.yml MARKETING_VERSION and Info.plist CFBundleVersion:
xcodegen generate
./scripts/build-app-mas.sh
# Then drag dist/Clawdephobia.pkg into Transporter.app
```

---

## Verification

1. `defaults read "$(pwd)/dist/Clawdephobia.app/Contents/Info.plist" CFBundleShortVersionString` — must return literal version, not `$(MARKETING_VERSION)`.
2. `defaults read "$(pwd)/dist/Clawdephobia.app/Contents/Info.plist" CFBundleVersion` — must exceed last accepted build number.
3. Transporter validation passes with zero errors.
4. After App Review accepts: install from App Store, open app, confirm `UpdateChecker.isFromAppStore` returns true (debug print or breakpoint) so no GitHub poll fires.
