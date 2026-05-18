import { Nav } from "@/components/nav";
import { FAQAccordion } from "@/components/faq-accordion";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs — Clawdephobia",
  description: "Frequently asked questions about Clawdephobia.",
};

export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-night text-cream">
      <Nav dark />
      <FaqsBody />
      <div className="h-24" />
    </main>
  );
}

function FaqsBody() {
  return (
    <section className="px-4 pt-36 md:pt-44 pb-12 max-w-3xl mx-auto">
      <h1 className="font-display font-bold tracking-[-0.035em] text-[64px] md:text-[96px] leading-[0.95]">
        FAQs
      </h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-cream/60">
        <FileText className="h-4 w-4" />
        Updated May 2026
      </p>
      <div className="mt-12 md:mt-16">
        <FAQAccordion />
      </div>
    </section>
  );
}

// Force the body dark class — handled inline via min-h-screen bg. Layout body
// stays cream by default; this page paints over it.
