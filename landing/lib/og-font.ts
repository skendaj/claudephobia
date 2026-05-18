import { readFileSync } from "node:fs";
import { join } from "node:path";

const cache = new Map<string, Buffer>();

function load(file: string): Buffer {
  let buf = cache.get(file);
  if (!buf) {
    buf = readFileSync(join(process.cwd(), "public/fonts", file));
    cache.set(file, buf);
  }
  return buf;
}

export function ogFonts() {
  return [
    {
      name: "Inter Tight",
      data: load("InterTight-SemiBold.ttf"),
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Inter Tight",
      data: load("InterTight-Bold.ttf"),
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Inter Tight",
      data: load("InterTight-Black.ttf"),
      weight: 900 as const,
      style: "normal" as const,
    },
  ];
}
