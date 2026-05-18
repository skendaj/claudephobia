import { readFileSync } from "node:fs";
import { join } from "node:path";

let cached: Buffer | null = null;

function interTightBlack(): Buffer {
  if (!cached) {
    cached = readFileSync(
      join(process.cwd(), "public/fonts/InterTight-Black.ttf")
    );
  }
  return cached;
}

export function ogFonts() {
  return [
    {
      name: "Inter Tight",
      data: interTightBlack(),
      weight: 900 as const,
      style: "normal" as const,
    },
  ];
}
