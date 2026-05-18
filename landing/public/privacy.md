# Privacy Policy — Clawdephobia

Last updated: May 2026. Local-first by design.

## Overview

Clawdephobia is a macOS menu bar app that monitors your Claude AI usage limits. Privacy is fundamental to how it is built — it operates entirely on your device with no external servers involved.

## Data Collection

Clawdephobia does **not** collect, transmit, or store any personal data on external servers. Specifically:

- No analytics or tracking of any kind
- No crash reporting sent externally
- No user accounts or registration
- No cookies, fingerprinting, or advertising

## Network Communication

The app communicates only with your AI assistant's servers (`claude.ai`) to fetch your usage data, and optionally with `ntfy.sh` if you enable phone push notifications. No other network requests are made.

## Session Key Storage

Your session key is stored securely in the **macOS Keychain** — the same system macOS uses for passwords and certificates. It is never stored in plain text, never logged, and never transmitted anywhere other than to `claude.ai` for authentication.

## Local Data

App preferences (display settings, notification thresholds, refresh intervals) are stored locally via macOS UserDefaults. You can erase all stored data at any time from **Settings → Data → Reset All Data**.

## Third-Party Services

Clawdephobia has zero external dependencies and uses no third-party SDKs, frameworks, or services beyond what you explicitly enable.

## Children's Privacy

The app does not collect any information from anyone, including children under 13.

## Changes

If this policy is updated, changes will be reflected on this page. The app itself may also be updated to reference any new policy.

## Contact

Questions? Open an issue on GitHub: https://github.com/skendaj/Claudephobia/issues
