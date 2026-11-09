import Logo from "@/components/Logo";
import ComparePricingCards from "@/components/ComparePricingCards";
import { FEATURES, TIERS, COMPARE_CATEGORIES } from "@/lib/planFeatures";
import { getBusinessInfo } from "@/lib/businessInfo";
import { getContactInfo } from "@/lib/contactInfo";
import { getSocialSettings, getWhatsappHref } from "@/lib/socialSettings";
import { buildPageMetadata } from "@/lib/seo";

// ISR like the home page: the closing band reads WhatsApp/phone from the database, so without
// this the page is frozen at build time. Admin Social/Contact saves also revalidate it.
export const revalidate = 3600;

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Compare Plans",
    description: "Compare Basic, Plus, and Premium plans to find the right fit for your business.",
    path: "/compare-plans",
  });
}

function Check({ included }) {
  return included ? (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400"
      aria-label="Included"
    >
      &#10003;
    </span>
  ) : (
    <span className="text-sm text-muted" aria-label="Not included">
      &mdash;
    </span>
  );
}

// Answers come straight from the deal terms in docs/package-plans.md — update both together.
const FAQS = [
  {
    q: "Can I upgrade later?",
    a: "Yes. Moving from Basic to Plus or Premium keeps your site, your content and your login. Nothing is rebuilt.",
  },
  {
    q: "Am I tied into a long contract?",
    a: "No. The minimum is 3 months, then 30 days' notice. We'd rather earn your monthly fee than lock you in.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. You edit text, photos, products and bookings from a simple admin panel — and we set the site up for you.",
  },
];

// Regroups FEATURES into the visitor-facing topics in COMPARE_CATEGORIES (e.g. "Get booked"),
// keeping source order within each. FEATURES' own `group` values stay matched to admin Settings
// → Feature Config, so only this display grouping differs from that page.
function categorise(features) {
  return COMPARE_CATEGORIES.map((category) => ({
    ...category,
    items: features.filter((f) => category.groups.includes(f.group)),
  })).filter((category) => category.items.length > 0);
}

export default async function ComparePlansPage() {
  const categories = categorise(FEATURES);
  const business = await getBusinessInfo();
  const contact = await getContactInfo();
  const whatsappHref = getWhatsappHref(await getSocialSettings());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 whitespace-nowrap text-xl font-bold">
            <Logo className="h-7 w-7" />
            {business.name}
          </a>
          <a href="/#plans" className="text-sm font-medium hover:text-muted">
            &larr; Back to plans
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground to-primary text-primary-foreground">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="relative mx-auto max-w-5xl px-6 py-14 text-center sm:py-16">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Every feature, side by side
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            No surprises either way — see exactly what&apos;s included in Basic, Plus, and
            Premium before you choose.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        {/* Pricing cards + Monthly/Yearly toggle */}
        <ComparePricingCards tiers={TIERS} />

        {/* Comparison by topic — native <details> so each topic opens/closes with no client JS, and
            the same stacked-row layout works on phones and desktops alike. */}
        <div className="mt-12 space-y-4">
          {categories.map((category, index) => (
            <details
              key={category.key}
              open={index === 0}
              className="group overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold">{category.title}</span>
                  <span className="block text-sm text-muted">{category.sub}</span>
                </span>
                <span
                  className={`hidden rounded-full px-3 py-1 text-[11px] font-bold sm:inline ${
                    category.badge === "In every plan"
                      ? "bg-surface-alt text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {category.badge}
                </span>
                <span
                  aria-hidden="true"
                  className="text-muted transition-transform group-open:rotate-180"
                >
                  &#9662;
                </span>
              </summary>

              <div className="border-t border-border">
                <div className="grid grid-cols-[1fr_repeat(3,3.5rem)] bg-surface-alt px-4 py-2 text-xs font-bold uppercase tracking-wide text-muted sm:grid-cols-[1fr_repeat(3,5.5rem)] sm:px-5">
                  <span>Feature</span>
                  {TIERS.map((tier) => (
                    <span
                      key={tier.key}
                      className={`text-center ${tier.popular ? "text-primary" : ""}`}
                    >
                      {tier.label}
                    </span>
                  ))}
                </div>
                {category.items.map((feature) => (
                  <div
                    key={feature.label}
                    className="grid grid-cols-[1fr_repeat(3,3.5rem)] items-center border-b border-border px-4 py-3 text-sm last:border-0 sm:grid-cols-[1fr_repeat(3,5.5rem)] sm:px-5"
                  >
                    <span className="pr-3 text-foreground">{feature.label}</span>
                    {TIERS.map((tier) => (
                      <span key={tier.key} className="text-center">
                        <Check included={feature[tier.key]} />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-center text-2xl font-extrabold sm:text-3xl">
            Questions people ask first
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-base font-bold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium">
            <a href="/downloads/falcon-web-suite-flyer.pdf" download className="text-accent hover:underline">
              Download the plans &amp; pricing PDF
            </a>
            <a href="/#plans" className="text-accent hover:underline">
              Back to plans
            </a>
          </p>
        </section>
      </main>

      {/* Closing call to action — full width, outside <main>'s max-width. WhatsApp/phone buttons
          only render when set in admin (Social / Contact), so nothing here is hard-coded. */}
      <section className="mt-14 bg-gradient-to-br from-foreground to-primary py-14 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            Not sure which plan fits?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/85">
            Book a free walkthrough. Click through the real product — not a slide deck — and we&apos;ll
            point you to the right one.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="/#enquiry"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0c2d48] hover:bg-white/90"
            >
              Book a free walkthrough
            </a>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-white/50 px-7 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                className="rounded-full border-[1.5px] border-white/50 px-7 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Call {contact.phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
