import { Inter, Geist_Mono } from "next/font/google";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ThemeScript from "@/components/ThemeScript";
import { CartProvider } from "@/components/CartContext";
import { BusinessNameProvider } from "@/components/BusinessNameContext";
import { LogoProvider } from "@/components/LogoContext";
import { getBusinessInfo } from "@/lib/businessInfo";
import { getBranding } from "@/lib/branding";
import { getRootAlert } from "@/lib/rootAlert";
import { getContactInfo } from "@/lib/contactInfo";
import { IconMail, IconPhone } from "@tabler/icons-react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Only two admin-only text fields use font-mono; `preload: false` stops Next.js auto-injecting
  // a <link rel="preload"> for this file in every public page's <head>, where it competes for
  // bandwidth with the hero image on a throttled mobile connection for no benefit (nothing on the
  // public site uses it). The @font-face rule still exists and loads normally if ever needed.
  preload: false,
});

// Dynamic (not a static `metadata` export) so the browser tab title / SEO title / favicon
// reflect admin-editable values (lib/businessInfo.js, lib/branding.js) instead of hardcoded
// ones. `icons` is only set when a custom favicon/apple-icon has actually been uploaded at
// /admin/logo — omitting the key otherwise lets Next.js's file-convention app/icon.svg keep
// applying exactly as before, rather than this having to duplicate that fallback itself.
export async function generateMetadata() {
  const [business, branding] = await Promise.all([getBusinessInfo(), getBranding()]);
  const icons = {};
  if (branding.favicon_url) icons.icon = branding.favicon_url;
  if (branding.apple_icon_url) icons.apple = branding.apple_icon_url;

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
    title: {
      default: business.name,
      template: `%s — ${business.name}`,
    },
    description: business.description,
    ...(Object.keys(icons).length > 0 && { icons }),
  };
}

export default async function RootLayout({ children }) {
  const [business, branding, rootAlert, contact] = await Promise.all([
    getBusinessInfo(),
    getBranding(),
    getRootAlert(),
    getContactInfo(),
  ]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Top bar: the Root Alert message (admin: /admin/root-alert) on the left — used for the
            "independent consultant" disclosure — and the Contact Us phone/email (/admin/contact)
            as click-to-call / click-to-email links on the right. */}
        {((rootAlert.enabled && rootAlert.message) || contact.phone || contact.email) && (
          <div className="border-b border-white/10 bg-brand-ink px-2 py-1.5 text-xs text-brand-cream/90 sm:px-4 sm:py-2.5">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              {rootAlert.enabled && rootAlert.message ? (
                <p className="whitespace-nowrap text-[length:clamp(7.5px,calc((100vw-20px)/40.5),11px)] font-medium tracking-tight sm:text-xs sm:tracking-normal">
                  <span className="mr-1.5 hidden h-2 w-2 rounded-full bg-brand-teal align-middle sm:inline-block" />
                  {rootAlert.message}
                </p>
              ) : (
                <span />
              )}
              <div className="hidden items-center gap-4 sm:flex">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-1 font-medium hover:text-brand-teal"
                  >
                    <IconPhone size={14} className="text-brand-teal" />
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="hidden items-center gap-1 font-medium hover:text-brand-teal md:flex"
                  >
                    <IconMail size={14} className="text-brand-teal" />
                    {contact.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        <BusinessNameProvider name={business.name}>
          <LogoProvider logoUrl={branding.logo_url} headerLogoUrl={branding.header_logo_url}>
            <SessionProviderWrapper>
              <CartProvider>{children}</CartProvider>
            </SessionProviderWrapper>
          </LogoProvider>
        </BusinessNameProvider>
      </body>
    </html>
  );
}
