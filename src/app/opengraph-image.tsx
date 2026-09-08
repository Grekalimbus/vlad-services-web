import { ImageResponse } from "next/og";

export const alt = "Vlad 24 Hours Daily — TV wall mounting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0a09",
          color: "#fafaf9",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#d6d3d1",
          }}
        >
          <span>Vlad</span>
          <span>24 Hours Daily</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 920 }}>
            Your television belongs on the wall.
          </div>
          <div style={{ fontSize: 26, color: "#a8a29e", maxWidth: 720 }}>
            Concealed cables. Fireplace work. Three-year warranty.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
