import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} · ${siteConfig.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 78% 18%, rgba(20, 184, 166, 0.2), transparent 36%), radial-gradient(circle at 16% 86%, rgba(15, 118, 110, 0.12), transparent 34%), #f3f5f8",
        color: "#0b1220",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        padding: "72px 82px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 960,
        }}
      >
        <div
          style={{
            color: "#0f766e",
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {siteConfig.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            marginTop: 34,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            color: "#5b6578",
            display: "flex",
            fontSize: 28,
            lineHeight: 1.35,
            marginTop: 34,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            background: "linear-gradient(90deg, #0f766e, #14b8a6)",
            display: "flex",
            height: 5,
            marginTop: 48,
            width: 190,
          }}
        />
      </div>
    </div>,
    size,
  );
}
