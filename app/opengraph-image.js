import { ImageResponse } from "next/og";
import { getBusinessInfo } from "@/lib/businessInfo";
import { getContactInfo } from "@/lib/contactInfo";
import { getFlagshipProduct } from "@/lib/products";
import { monogram } from "@/lib/brand";

// The site-wide link-preview image (WhatsApp, LinkedIn, Facebook, X…) — Next's file-convention
// dynamic OG image, rendered as a real PNG at request time from admin-edited data: business name,
// tagline and phone, in the brand colours, with the flagship product beside them.
//
// The product image: the preview renderer can't read WebP, so a flagship cover at
// /…/name.webp is shown from a PNG copy next to it (/…/name.png) when one exists. No PNG = a
// text-only card, which still looks right.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = { deep: "#003F33", ink: "#180F06", teal: "#3CEAC7", cream: "#F1F1EC" };

async function productImageUrl(product) {
  const src = product?.image;
  if (!src || !src.startsWith("/")) return null;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const png = new URL(src.replace(/\.webp$/i, ".png"), baseUrl).toString();
  if (!png.endsWith(".png")) return null;
  try {
    const res = await fetch(png, { method: "HEAD", signal: AbortSignal.timeout(4000) });
    return res.ok ? png : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [business, contact, flagship] = await Promise.all([
    getBusinessInfo(),
    getContactInfo(),
    getFlagshipProduct(),
  ]);
  const productSrc = await productImageUrl(flagship);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: BRAND.deep,
          backgroundImage: `radial-gradient(circle at 78% 45%, rgba(60,234,199,0.28) 0%, rgba(0,63,51,0) 55%)`,
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: productSrc ? 700 : 1056,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
            <div
              style={{
                display: "flex",
                width: 92,
                height: 92,
                borderRadius: 24,
                backgroundColor: BRAND.teal,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                fontWeight: 800,
                color: BRAND.ink,
              }}
            >
              {monogram(business.name) || "•"}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 800, color: "#ffffff", lineHeight: 1.08 }}>
            {business.name}
          </div>
          {business.tagline && (
            <div style={{ display: "flex", fontSize: 32, color: BRAND.teal, marginTop: 20 }}>
              {business.tagline}
            </div>
          )}
          {contact?.phone && (
            <div
              style={{
                display: "flex",
                marginTop: 40,
                alignSelf: "flex-start",
                padding: "14px 26px",
                borderRadius: 999,
                backgroundColor: "rgba(241,241,236,0.12)",
                border: "1px solid rgba(241,241,236,0.25)",
                fontSize: 28,
                color: BRAND.cream,
              }}
            >
              {`Call or WhatsApp ${contact.phone}`}
            </div>
          )}
        </div>
        {productSrc && (
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={productSrc} height={500} style={{ objectFit: "contain" }} />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
