import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Clawdephobia — Claude usage limits in your menu bar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F0EEE5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "#1A1916",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 36,
              color: "#F0EEE5",
              fontWeight: 700,
            }}
          >
            C
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#1A1916",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Clawdephobia
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#6B6860",
            textAlign: "center",
            maxWidth: 720,
            lineHeight: 1.4,
            marginBottom: 48,
          }}
        >
          Claude usage limits, right in your menu bar.
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Free", "Open source", "macOS 13+", "Menu bar app"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "#E8E5DB",
                border: "1px solid #D4D0C8",
                borderRadius: 100,
                padding: "8px 20px",
                fontSize: 18,
                color: "#4A4840",
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
