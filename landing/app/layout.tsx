import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist } from "next/font/google";
import Script from "next/script";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SideWordmark } from "@/components/side-wordmark";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const BASE_URL = "https://clawdephobia.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clawdephobia",
  description:
    "A lightweight macOS menu bar app that monitors your Claude AI usage limits in real time. Track 5-hour, 7-day, and per-model limits across every account.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "macOS 13+",
  url: BASE_URL,
  downloadUrl:
    "https://github.com/skendaj/clawdephobia/releases/latest/download/Clawdephobia.dmg",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "skendaj",
    url: "https://github.com/skendaj",
  },
  codeRepository: "https://github.com/skendaj/clawdephobia",
  keywords:
    "Claude AI, usage monitor, rate limit tracker, menu bar app, macOS, Anthropic",
};

export const metadata: Metadata = {
  title: "Clawdephobia — Claude usage limits in your menu bar",
  description:
    "A lightweight macOS menu bar app that monitors your Claude AI usage limits in real time. Track 5-hour, 7-day, and per-model limits across every account.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Clawdephobia — Claude usage limits in your menu bar",
    description: "Claude usage limits, right in your menu bar.",
    type: "website",
    url: BASE_URL,
    siteName: "Clawdephobia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clawdephobia — Claude usage limits in your menu bar",
    description:
      "A lightweight macOS menu bar app that monitors your Claude AI usage limits in real time. Free & open source.",
  },
  keywords: [
    "Claude AI usage monitor",
    "Claude rate limit tracker",
    "Claude menu bar app",
    "macOS Claude limits",
    "Anthropic Claude usage",
    "Claude API limits dashboard",
  ],
};

export const viewport: Viewport = {
  themeColor: "#F0EEE5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${geist.variable}`}>
      <body>
        {/* Static hardcoded object — no user input, no XSS risk */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <SideWordmark />
        {children}
      </body>
    </html>
  );
}
