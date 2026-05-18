import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Clawdephobia — Claude usage limits in your menu bar",
  description:
    "A lightweight macOS menu bar app that monitors your Claude AI usage limits in real time. Track 5-hour, 7-day, and per-model limits across every account.",
  metadataBase: new URL("https://clawdephobia.vercel.app"),
  openGraph: {
    title: "Clawdephobia",
    description: "Claude usage limits, right in your menu bar.",
    type: "website",
  },
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
        <SmoothScroll />
        <SideWordmark />
        {children}
      </body>
    </html>
  );
}
