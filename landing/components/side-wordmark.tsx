"use client";

import { useEffect, useRef, useState } from "react";

const FADE_DISTANCE = 280;

export function SideWordmark() {
  const [opacity, setOpacity] = useState(1);
  const prev = useRef(1);
  const [direction, setDirection] = useState<"in" | "out">("in");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const next = Math.max(0, 1 - y / FADE_DISTANCE);
      setDirection(next > prev.current ? "in" : "out");
      prev.current = next;
      setOpacity(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <span
      aria-hidden
      className="side-wordmark pointer-events-none select-none fixed left-2 bottom-2 font-display font-extrabold tracking-[-0.05em] whitespace-nowrap leading-[0.85] z-0"
      style={{
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        fontSize: "clamp(38px, 6vh, 64px)",
        opacity,
        transition:
          direction === "in"
            ? "opacity 420ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "opacity 180ms cubic-bezier(0.4, 0, 1, 1)",
      }}
    >
      Clawdephobia
    </span>
  );
}
