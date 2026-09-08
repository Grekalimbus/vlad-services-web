import { ImageResponse } from "next/og";

export const dynamic = "force-static";
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
          background: "#171717",
          color: "#fafafa",
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            fontWeight: 500,
            color: "#b45309",
          }}
        >
          <span>Vlad</span>
          <span>Available 24 hours daily</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            Your television belongs on the wall.
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa", maxWidth: 680 }}>
            Concealed cables, fireplace work, and a three-year warranty.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
