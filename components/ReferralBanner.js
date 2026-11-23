import { parseAccent, parsePairs } from "@/lib/textLines";

// "Refer a Friend" banner (lib/referral.js, /admin/referral): copy + button on the left, reward
// tiers on the right with the last tier highlighted. The button carries the admin-set topic so the
// enquiry form pre-fills (see QuotePrefill.js).
export default function ReferralBanner({ banner, quoteHref, sectionMaxW, style }) {
  const tiers = parsePairs(banner.tiers).slice(0, 4);

  return (
    <section id="referral" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8" style={style}>
      <div
        className={`relative mx-auto ${sectionMaxW} overflow-hidden rounded-3xl bg-brand-ink p-8 text-white shadow-2xl sm:p-12`}
      >
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-teal/15 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            {banner.eyebrow && (
              <span className="inline-block rounded-full bg-brand-teal px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-ink">
                {banner.eyebrow}
              </span>
            )}
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {parseAccent(banner.heading).map((part, i) => (
                <span key={i} className={part.accent ? "text-brand-teal" : undefined}>
                  {part.text}
                </span>
              ))}
            </h2>
            {banner.body && (
              <p className="text-sm leading-relaxed text-brand-cream/80 sm:text-base">{banner.body}</p>
            )}
            {banner.cta_label && (
              <div className="pt-2">
                <a
                  href={quoteHref}
                  data-quote-topic={banner.cta_topic || undefined}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-teal px-6 py-3.5 text-sm font-bold text-brand-ink transition hover:bg-brand-teal-hover"
                >
                  {banner.cta_label}
                </a>
              </div>
            )}
          </div>

          {tiers.length > 0 && (
            <div
              className={`grid grid-cols-1 gap-4 lg:col-span-6 ${
                tiers.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
              }`}
            >
              {tiers.map((tier, i) => {
                const last = i === tiers.length - 1;
                return (
                  <div
                    key={`${tier.title}-${i}`}
                    className={`rounded-2xl border p-5 text-center ${
                      last
                        ? "border-brand-teal/50 bg-brand-deep shadow-lg"
                        : "border-white/15 bg-white/10"
                    }`}
                  >
                    <div className="text-3xl font-extrabold text-brand-teal">{tier.title}</div>
                    <div
                      className={`mt-1.5 text-xs ${last ? "font-semibold text-white" : "font-medium text-brand-cream/85"}`}
                    >
                      {tier.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
