"use client";

import { useLogoUrl } from "@/components/LogoContext";
import { useBusinessName } from "@/components/BusinessNameContext";
import { monogram } from "@/lib/brand";

// The uploaded logo (/admin/logo) when there is one; otherwise a monogram badge built from the
// business name (e.g. "TC") in the brand teal — so a site that hasn't uploaded a logo shows its
// own initials, never the template's mark. Every call site keeps working unchanged: they just
// render <Logo className="..." /> and the badge scales with that size.
export default function Logo({ className = "h-7 w-7" }) {
  const logoUrl = useLogoUrl();
  const businessName = useBusinessName();

  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt="" className={`${className} object-contain`} />;
  }

  const initials = monogram(businessName) || "•";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#3CEAC7" />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fontFamily="Inter, Arial, Helvetica, sans-serif"
        fontSize={initials.length > 2 ? 24 : 30}
        fontWeight="800"
        fill="#180F06"
      >
        {initials}
      </text>
    </svg>
  );
}
