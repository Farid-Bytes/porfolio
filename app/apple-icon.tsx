import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 30% 20%, rgba(20, 184, 166, 0.28), transparent 46%), #f3f5f8",
          color: "#0f766e",
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.06em",
          width: "100%",
        }}
      >
        GF
      </div>
    ),
    size,
  );
}
