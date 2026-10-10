import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ffffff",
          border: "1px solid rgba(15, 118, 110, 0.45)",
          color: "#0f766e",
          display: "flex",
          fontSize: 14,
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
