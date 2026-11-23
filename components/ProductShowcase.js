import {
  IconBolt,
  IconBuildingStore,
  IconCash,
  IconCreditCard,
  IconDeviceMobile,
  IconDiscount2,
  IconLink,
  IconPlug,
  IconStack2,
} from "@tabler/icons-react";
import FlagshipPreview from "@/components/FlagshipPreview";
import { parsePairs, splitLines } from "@/lib/textLines";

const CARD_ICONS = {
  card: IconCreditCard,
  handheld: IconDeviceMobile,
  plug: IconPlug,
  link: IconLink,
  store: IconBuildingStore,
  bolt: IconBolt,
};
const FEATURE_ICONS = [IconBolt, IconStack2, IconDiscount2, IconCash];

// Logos for the "accepted payment methods" strip (public/logos/payments/, see ATTRIBUTION.txt).
// Matched by name, so the list stays admin-editable in Site Text; an unknown name falls back to a
// plain text pill.
const PAYMENT_LOGOS = {
  mastercard: "mastercard",
  maestro: "maestro",
  visa: "visa",
  "apple pay": "apple-pay",
  "google pay": "google-pay",
  "samsung pay": "samsung-pay",
};

function QuoteLink({ href, topic, className, children }) {
  return (
    <a href={href} data-quote-topic={topic} className={className}>
      {children}
    </a>
  );
}

// The products section in the card-style design: one flagship product as a large spotlight card
// (badges, feature cards, consultant-service line, button, and a photo preview), the remaining
// products as a grid of smaller cards, and an optional "accepted payment methods" strip. Every
// piece of copy comes from the products table (/admin/products) and Site Text (/admin/site-text).
export default function ProductShowcase({
  flagship,
  flagshipPhotos,
  others,
  quoteHref,
  paymentsLabel,
  paymentMethods,
}) {
  const badges = splitLines(flagship?.badges);
  const features = parsePairs(flagship?.features).slice(0, 4);
  const methods = splitLines(paymentMethods);

  return (
    <div>
      {flagship && (
        <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-7">
              <div>
                {badges.length > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {badges.map((badge, i) => (
                      <span
                        key={badge}
                        className={
                          i === 0
                            ? "rounded-full bg-brand-deep px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-teal"
                            : "rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-semibold text-foreground"
                        }
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-2xl font-extrabold text-foreground sm:text-3xl">{flagship.name}</h3>
                {flagship.description && (
                  <p className="mt-3 text-base leading-relaxed text-muted">{flagship.description}</p>
                )}

                {features.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {features.map((feature, i) => {
                      const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                      return (
                        <div
                          key={feature.title}
                          className="flex items-start gap-3 rounded-2xl bg-surface-alt p-3.5"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-deep text-brand-teal">
                            <Icon size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                            {feature.text && (
                              <p className="mt-0.5 text-xs text-muted">{feature.text}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center">
                <div>
                  {flagship.service_label && (
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      {flagship.service_label}
                    </span>
                  )}
                  {flagship.service_text && (
                    <span className="text-sm font-bold text-primary">{flagship.service_text}</span>
                  )}
                </div>
                <QuoteLink
                  href={quoteHref}
                  topic={flagship.cta_topic || flagship.name}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-teal px-6 py-3.5 text-sm font-bold text-brand-ink shadow-md transition hover:bg-brand-teal-hover"
                >
                  {flagship.cta_label || "Get a quote"}
                </QuoteLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <FlagshipPreview title={`Explore ${flagship.name.split(/\s[—-]\s/)[0]}`} photos={flagshipPhotos} />
            </div>
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div
          className={`${flagship ? "mt-10" : ""} grid grid-cols-1 gap-6 md:grid-cols-2 ${
            others.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {others.map((product) => {
            const Icon = CARD_ICONS[product.icon] || IconCreditCard;
            return (
              <div
                key={product.id}
                className="flex flex-col justify-between rounded-3xl border border-foreground/10 bg-surface p-7 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-deep text-brand-teal">
                    <Icon size={24} />
                  </div>
                  {product.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {product.category}
                    </span>
                  )}
                  <h3 className="mt-1 text-xl font-extrabold text-foreground">{product.name}</h3>
                  {product.description && (
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{product.description}</p>
                  )}
                </div>
                <div className="mt-6 border-t border-foreground/10 pt-4">
                  <QuoteLink
                    href={quoteHref}
                    topic={product.cta_topic || product.name}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-foreground"
                  >
                    <span>{product.cta_label || "Get a quote"}</span>
                    <span aria-hidden="true">→</span>
                  </QuoteLink>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {methods.length > 0 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-surface p-5 sm:flex-row">
          {paymentsLabel && (
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {paymentsLabel}
            </span>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            {methods.map((method) => {
              const logo = PAYMENT_LOGOS[method.trim().toLowerCase()];
              return logo ? (
                // Static local SVG — plain <img>, same reasoning as other images in this file.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={method}
                  src={`/logos/payments/${logo}.svg`}
                  alt={method}
                  title={method}
                  width={60}
                  height={40}
                  className="h-10 w-[60px] rounded-md border border-foreground/10 bg-white shadow-sm"
                />
              ) : (
                <span
                  key={method}
                  className="rounded-lg border border-foreground/10 bg-background px-3.5 py-1.5"
                >
                  {method}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
