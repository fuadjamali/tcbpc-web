import { IconBrandWhatsapp, IconFileText, IconPhone } from "@tabler/icons-react";

// Phones only: a bar fixed to the bottom of the screen with the three ways to get in touch —
// call, WhatsApp and the quote form — so a visitor can act from anywhere on the page without
// scrolling to the form. Phone comes from Contact Us, WhatsApp from Social & WhatsApp settings;
// a missing one simply isn't shown. Replaces the floating WhatsApp button below `md`.
export default function MobileActionBar({ phone, whatsappHref, quoteHref }) {
  const items = [
    phone && {
      key: "call",
      href: `tel:${phone.replace(/\s+/g, "")}`,
      label: "Call",
      Icon: IconPhone,
      className: "bg-white/10 text-white",
    },
    whatsappHref && {
      key: "whatsapp",
      href: whatsappHref,
      label: "WhatsApp",
      Icon: IconBrandWhatsapp,
      className: "bg-white/10 text-white",
      external: true,
    },
    quoteHref && {
      key: "quote",
      href: quoteHref,
      label: "Get a Quote",
      Icon: IconFileText,
      className: "bg-brand-teal text-brand-ink",
    },
  ].filter(Boolean);
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-brand-ink/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
    >
      <div className="flex gap-2">
        {items.map(({ key, href, label, Icon, className, external }) => (
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold ${className}`}
          >
            <Icon size={18} />
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
