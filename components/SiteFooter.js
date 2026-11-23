import { IconBrandWhatsapp } from "@tabler/icons-react";
import SocialLinks from "@/components/SocialLinks";
import { monogram } from "@/lib/brand";

// Footer in the card-style design: a closing call-to-action band (Section Text → Footer heading /
// subheading, WhatsApp, social links), then three columns — brand + status line (the Root Alert
// message), quick links (the public nav), direct contact (Contact Us) — then the regulatory
// statement (Site Text → Footer & Payment Methods), copyright and published legal pages.
export default function SiteFooter({
  businessName,
  statusText,
  heading,
  subheading,
  whatsappHref,
  navLinks,
  contact,
  regulatoryText,
  legalPages,
  tagline,
}) {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-brand-ink px-4 pb-24 pt-14 text-brand-cream/85 md:pb-10 sm:px-6 lg:px-8"
      style={{ order: 999 }}
    >
      <div className="mx-auto max-w-7xl">
        {(heading || whatsappHref) && (
          <div className="flex flex-col items-center gap-3 border-b border-white/10 pb-10 text-center">
            {heading && <h2 className="text-2xl font-bold text-white">{heading}</h2>}
            {subheading && <p className="max-w-2xl text-sm text-brand-cream/75">{subheading}</p>}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-teal px-6 py-3 text-sm font-bold text-brand-ink hover:bg-brand-teal-hover"
              >
                <IconBrandWhatsapp size={18} />
                Chat on WhatsApp
              </a>
            )}
            <SocialLinks />
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal font-extrabold text-brand-ink">
                {monogram(businessName)}
              </span>
              <span className="text-lg font-bold text-white">{businessName}</span>
            </div>
            {statusText && <p className="text-xs font-semibold text-brand-teal">{statusText}</p>}
            {tagline && <p className="text-xs text-brand-cream/60">{tagline}</p>}
          </div>

          {navLinks.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition-colors hover:text-brand-teal">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(contact?.phone || contact?.email || contact?.subheading) && (
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                {contact.heading || "Contact"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="font-semibold text-white transition-colors hover:text-brand-teal"
                    >
                      Phone / WhatsApp: {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="transition-colors hover:text-brand-teal">
                      Email: {contact.email}
                    </a>
                  </li>
                )}
                {contact.subheading && (
                  <li className="pt-1 text-xs text-brand-cream/65">{contact.subheading}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-8 text-xs leading-relaxed text-brand-cream/70">
          {regulatoryText && <p className="font-medium text-brand-cream/85">{regulatoryText}</p>}
          <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
            <p className="text-brand-cream/50">
              &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
            {legalPages.length > 0 && (
              <p className="flex flex-wrap items-center gap-3">
                {legalPages.map((page) => (
                  <a key={page.slug} href={`/${page.slug}`} className="hover:text-white">
                    {page.title}
                  </a>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
