import { Nav } from "@/components/nav";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";
import type { Metadata } from "next";

const breadcrumbLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
]);

export const metadata: Metadata = {
  title: "Privacy Policy — Clawdephobia",
  description:
    "Clawdephobia is local-first. No tracking, no analytics, no third-party servers.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Clawdephobia",
    description:
      "Local-first by design. Zero tracking, zero analytics, zero third-party servers.",
    type: "website",
    url: "/privacy",
    siteName: "Clawdephobia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Clawdephobia",
    description: "Local-first. Zero tracking, zero analytics.",
  },
};

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "Overview",
    body: (
      <p>
        Clawdephobia is a macOS menu bar app that monitors your Claude AI usage
        limits. Privacy is fundamental to how it is built — it operates entirely
        on your device with no external servers involved.
      </p>
    ),
  },
  {
    heading: "Data Collection",
    body: (
      <>
        <p>
          Clawdephobia does <strong>not</strong> collect, transmit, or store any
          personal data on external servers. Specifically:
        </p>
        <ul className="mt-3 list-disc pl-5 space-y-1.5">
          <li>No analytics or tracking of any kind</li>
          <li>No crash reporting sent externally</li>
          <li>No user accounts or registration</li>
          <li>No cookies, fingerprinting, or advertising</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Network Communication",
    body: (
      <p>
        The app communicates only with your AI assistant&apos;s servers (
        <strong>claude.ai</strong>) to fetch your usage data, and optionally
        with <strong>ntfy.sh</strong> if you enable phone push notifications. No
        other network requests are made.
      </p>
    ),
  },
  {
    heading: "Session Key Storage",
    body: (
      <p>
        Your session key is stored securely in the{" "}
        <strong>macOS Keychain</strong> — the same system macOS uses for
        passwords and certificates. It is never stored in plain text, never
        logged, and never transmitted anywhere other than to{" "}
        <code>claude.ai</code> for authentication.
      </p>
    ),
  },
  {
    heading: "Local Data",
    body: (
      <p>
        App preferences (display settings, notification thresholds, refresh
        intervals) are stored locally via macOS UserDefaults. You can erase all
        stored data at any time from{" "}
        <strong>Settings → Data → Reset All Data</strong>.
      </p>
    ),
  },
  {
    heading: "Third-Party Services",
    body: (
      <p>
        Clawdephobia has zero external dependencies and uses no third-party
        SDKs, frameworks, or services beyond what you explicitly enable.
      </p>
    ),
  },
  {
    heading: "Children's Privacy",
    body: (
      <p>
        The app does not collect any information from anyone, including
        children under 13.
      </p>
    ),
  },
  {
    heading: "Changes",
    body: (
      <p>
        If this policy is updated, changes will be reflected on this page. The
        app itself may also be updated to reference any new policy.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        Questions? Open an issue on{" "}
        <a
          href="https://github.com/skendaj/Claudephobia"
          target="_blank"
          rel="noreferrer"
          className="text-clay hover:underline underline-offset-2"
        >
          GitHub
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-night text-cream">
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >{JSON.stringify(breadcrumbLd)}</script>
      <Nav dark />
      <section className="px-4 pt-28 md:pt-32 pb-20 max-w-3xl mx-auto">
        <h1 className="font-display font-bold tracking-[-0.035em] text-[48px] md:text-[72px] leading-[0.95]">
          Privacy
          <br />
          Policy
        </h1>
        <p className="mt-3 text-sm text-cream/55">
          Last updated: May 2026 · Local-first by design
        </p>

        <div className="mt-12 md:mt-14 space-y-9 text-[15.5px] leading-relaxed text-cream/80">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display font-semibold text-clay text-base md:text-lg tracking-tight mb-2">
                {s.heading}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </section>
      <div className="h-16" />
    </main>
  );
}
