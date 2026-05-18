import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ogFonts } from "@/lib/og-font";

export const runtime = "nodejs";
export const alt = "Clawdephobia — Claude usage limits in your menu bar";
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
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "Inter Tight",
          color: "#1F1B16",
          border: "1px solid #E6E2D6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={64} height={64} alt="" style={{ borderRadius: 14 }} />
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            Clawdephobia
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2.5,
            }}
          >
            <span>Claude usage limits.</span>
            <span>Right in your menu bar.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#5A544A",
              letterSpacing: -0.4,
            }}
          >
            Free · Open source · macOS 13+
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() }
  );
}
