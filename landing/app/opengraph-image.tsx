import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Clawdephobia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const buf = readFileSync(join(process.cwd(), "public/icon.png"));
  const src = `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#F0EEE5",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={320} height={320} alt="" style={{ mixBlendMode: "multiply" }} />
      </div>
    ),
    { ...size }
  );
}
