import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ogFonts } from "@/lib/og-font";

export const runtime = "nodejs";
export const alt = "Download Clawdephobia for Mac";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const iconBuf = readFileSync(join(process.cwd(), "public/icon.png"));
  const iconSrc = `data:image/png;base64,${iconBuf.toString("base64")}`;

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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} width={64} height={64} alt="" style={{ borderRadius: 14 }} />
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.3 }}>
            Clawdephobia
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 800,
              color: "#B8530F",
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            Download
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -2.5,
            }}
          >
            For macOS 13+
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 600,
              color: "#5A544A",
              letterSpacing: -0.3,
              gap: 24,
            }}
          >
            <span>Signed</span>
            <span>·</span>
            <span>Notarized</span>
            <span>·</span>
            <span>Free</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() }
  );
}
