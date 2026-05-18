import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ogFonts } from "@/lib/og-font";

export const runtime = "nodejs";
export const alt = "Clawdephobia FAQs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const buf = readFileSync(join(process.cwd(), "public/icon.png"));
  const src = `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#15110C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "Inter Tight",
          color: "#F0EEE5",
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
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -3.5,
            }}
          >
            FAQs
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 28,
              color: "#B8B0A0",
              letterSpacing: -0.3,
              gap: 8,
            }}
          >
            <span>What is a session key?</span>
            <span>Does it require an API key?</span>
            <span>How does multi-account work?</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() }
  );
}
