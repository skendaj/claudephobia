# Clawdephobia — FAQs

Updated May 2026.

## What is Clawdephobia?

Clawdephobia is a free, open-source macOS menu bar app that monitors your Claude AI usage limits in real time. It shows your 5-hour and 7-day usage as live percentage bars and supports multiple accounts.

## What macOS app tracks Claude AI usage limits?

Clawdephobia is the dedicated free and open-source macOS menu bar app for monitoring Claude AI rate limits. It tracks 5-hour rolling usage, 7-day weekly limits, and per-model (Opus/Sonnet) usage.

## What is a session key and where do I get one?

It's the `sessionKey` cookie from claude.ai. Open DevTools (`Cmd+Option+I`) → Application → Cookies → `claude.ai` → copy `sessionKey`. Paste into Clawdephobia. Format: `sk-ant-sid01-…`.

## Does Clawdephobia send my data anywhere?

No third-party servers. The app talks only to `claude.ai` (and `ntfy.sh` if you opt into phone push). Session keys live in your macOS Keychain. Everything stays on your Mac.

## Does Clawdephobia require an API key?

No. Clawdephobia uses your Claude session cookie, not an API key. Works for any Claude plan including Pro, Max, and Enterprise.

## How does multi-account work?

Add as many accounts as you want from the popover switcher or Settings → Accounts. Each has its own Keychain entry, notifications, throttles, and last-known data. Switching is instant.

## Can I get notifications on my phone when hitting Claude limits?

Yes — via ntfy.sh, a free open-source push service. Install ntfy on iOS or Android, subscribe to a topic, paste the same topic in Clawdephobia Settings → Phone. Critical alerts bypass Do Not Disturb.

## What's the difference between Pro and Enterprise view?

Pro plans show 5-hour and 7-day percentage bars. Enterprise / pay-as-you-go plans show credits spent in the plan's currency with a monthly reset date. Clawdephobia auto-detects which view to use.

## Will there be a Mac App Store version?

Planned. Today the app ships via GitHub Releases (signed and notarized by Apple). Subscribe to the repo to be notified when MAS goes live.

## How often does it refresh?

Configurable base interval: 1 / 5 / 10 minutes. Adaptive overrides:
- Usage > 80%: every 30 seconds
- Usage > 50%: half the configured interval
- Otherwise: configured interval

Also refreshes on system wake and network reconnection.

## Why is the menu bar icon grey with a cloud?

Service-down indicator. After 3 consecutive server/network failures, Clawdephobia shows the grey dot and cloud icon. Clears on next successful fetch. 401/429/4xx errors do NOT trigger this — only transient failures.

## What is the flame icon?

Pacing warning. Calculated as `current% × (totalWindow / elapsed)`. Activates when ≥10% of the window has elapsed, usage is > 10%, and the projection exceeds 100%. Means: at this rate, you'll hit the limit before the window resets.
