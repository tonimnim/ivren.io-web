import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Emits og:image:alt — what a text-only LLM fetcher reads in place of the image.
export const alt =
  "Ivren — healthcare interface assurance and integration platform";

export default async function OgImage() {
  const logoData = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={64} height={64} alt="" />
        <div
          style={{
            marginTop: 40,
            fontSize: 56,
            fontWeight: 600,
            color: "#14181d",
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Your hospital&rsquo;s interfaces, mapped, proven, and watched.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#4a525b" }}>
          Ivren — healthcare interface assurance and integration platform
        </div>
      </div>
    ),
    { ...size },
  );
}
