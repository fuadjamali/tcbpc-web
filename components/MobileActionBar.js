import { IconBrandWhatsapp, IconPhone } from "@tabler/icons-react";

// Phones only: two round floating buttons (WhatsApp above Call) at the bottom-right, so visitors can
// reach out from anywhere without a full-width bar covering the content. Phone comes from Contact Us,
// WhatsApp from Social & WhatsApp settings; a missing one simply isn't shown.
export default function MobileActionBar({ phone, whatsappHref }) {
  const items = [
    whatsappHref && {
      key: "whatsapp",
      href: whatsappHref,
      label: "WhatsApp",
      Icon: IconBrandWhatsapp,
      className: "bg-[#25D366] text-white",
      external: true,
    },
    phone && {
      key: "call",
      href: `tel:${phone.replace(/\s+/g, "")}`,
      label: "Call",
      Icon: IconPhone,
      className: "bg-brand-teal text-brand-ink",
    },
  ].filter(Boolean);
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Quick contact"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 flex flex-col gap-3 md:hidden"
    >
      {items.map(({ key, href, label, Icon, className, external }) => (
        <a
          key={key}
          href={href}
          aria-label={label}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 ${className}`}
        >
          <Icon size={26} />
        </a>
      ))}
    </nav>
  );
}
