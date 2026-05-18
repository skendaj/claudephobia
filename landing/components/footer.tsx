import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="relative z-10 mx-auto max-w-5xl flex flex-col items-center justify-center gap-4 px-4 pt-12 pb-10">
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/skendaj/clawdephobia"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-line bg-cream-2 hover:bg-white transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
          <Link
            href="/faqs"
            className="h-9 px-4 inline-flex items-center justify-center rounded-full border border-line bg-cream-2 hover:bg-white text-[13px] font-medium transition-colors"
          >
            FAQs
          </Link>
          <Link
            href="/privacy"
            className="h-9 px-4 inline-flex items-center justify-center rounded-full border border-line bg-cream-2 hover:bg-white text-[13px] font-medium transition-colors"
          >
            Privacy
          </Link>
        </div>
        <div className="text-center text-[12.5px] text-mute">
          MIT licensed · Built by{" "}
          <a
            href="https://github.com/skendaj"
            className="underline underline-offset-2 decoration-mute/60 hover:decoration-ink"
          >
            skendaj
          </a>
          . Not affiliated with Anthropic.
        </div>
      </div>
    </footer>
  );
}
