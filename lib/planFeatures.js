// Mirrors docs/package-plans.md's "Feature comparison" table — keep both in sync if the
// tier/module mapping changes. Deliberately static (not derived from lib/plan.js's module
// list) since it's meant to read like a sales comparison, not a literal dump of internal
// module names. Shared by the admin "Compare plans" page (no pricing) and the public home
// page "Plans" section (with pricing) so the two never drift apart.
//
// `group` matches the module grouping shown in admin Settings → Feature Config
// (lib/moduleSettings.js MODULE_GROUPS), so a client sees the same categories whether they're
// reading the public comparison page or an admin is toggling features off.
export const FEATURES = [
  { group: "Core", label: "Home page (hero, stats, how it works, about, map)", basic: true, plus: true, premium: true },
  { group: "Core", label: "Hero banner — multi-slide carousel, image or video backgrounds, adjustable height & focus", basic: true, plus: true, premium: true },
  { group: "Core", label: "About, Vision & Mission, History (dated text becomes a timeline automatically)", basic: true, plus: true, premium: true },
  { group: "Core", label: "Home page layout editor — reorder sections, sidebar layout, on/off switches", basic: true, plus: true, premium: true },
  { group: "Core", label: "Contact info block + enquiry form", basic: true, plus: true, premium: true },
  { group: "Core", label: "WhatsApp CTA (floating + footer, number or group invite link) + social links", basic: true, plus: true, premium: true },
  { group: "Core", label: "Products or Portfolio showcase — multi-photo galleries with crop (pick one at onboarding)", basic: true, plus: true, premium: true },
  { group: "Core", label: "Both Products and Portfolio", basic: false, plus: true, premium: true },
  { group: "Core", label: "Basic analytics (visit counter)", basic: true, plus: true, premium: true },
  { group: "Appearance", label: "Full 8-theme switcher + dark mode", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "Blog with rich-text editor", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "Gallery — masonry, search, tag & date filters, zoom lightbox", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "News & Events", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "Reviews (third-party ratings) + Partners strip (clickable logos)", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "Customer-submitted reviews (moderated)", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "Team & People directory (current / former teams)", basic: false, plus: true, premium: true },
  { group: "Content & Marketing", label: "Certifications", basic: false, plus: true, premium: true },
  { group: "Tools", label: "“Write with AI” content assistant", basic: false, plus: true, premium: true },
  { group: "Booking", label: "Online booking / appointment scheduling", basic: false, plus: true, premium: true },
  { group: "Booking", label: "Booking waitlist for fully-booked dates", basic: false, plus: true, premium: true },
  { group: "Commerce", label: "Shopping cart + checkout + order management", basic: false, plus: false, premium: true },
  { group: "Commerce", label: "Discount / promo codes at checkout", basic: false, plus: false, premium: true },
  { group: "Commerce", label: "Member login portal + order history", basic: false, plus: false, premium: true },
  { group: "Commerce", label: "Membership verification lookup", basic: false, plus: false, premium: true },
  { group: "Commerce", label: "GDPR account closure (member request, admin-reviewed)", basic: false, plus: false, premium: true },
];

// Current pricing — flat rates (not ranges). Setup fees were raised (Nov 2026) to £325/£550/£900;
// monthly fees were deliberately kept at £15/£30/£50. Clients who signed at the earlier founding
// setup fees (£250/£400/£750) keep their locked rate for as long as they stay — don't change
// existing clients' invoiced amounts when editing these.
// Yearly billing = pay 9 months, get 3 free (matches docs/package-plans.md's annual prices:
// £135 / £270 / £450). Derived from the monthly price so the two can never drift apart.
export const YEARLY_PAID_MONTHS = 9;

function poundsToNumber(price) {
  return Number(price.replace(/[^0-9.]/g, ""));
}

function formatPounds(n) {
  return `£${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

export function getYearlyPricing(monthlyPrice) {
  const yearly = poundsToNumber(monthlyPrice) * YEARLY_PAID_MONTHS;
  return { yearlyTotal: formatPounds(yearly), yearlyPerMonth: formatPounds(yearly / 12) };
}

// `tagline`/`bestFor`/`lead`/`highlights` are the benefit-led marketing copy for the home page
// Plans section; `blurb` stays as the shorter description used on the compare page cards.
// `lead` is the small heading above the highlights; `highlights` may contain **bold** spans,
// rendered by components/PlansPricing.js as a highlighted phrase.
export const TIERS = [
  {
    key: "basic",
    label: "Basic",
    setupPrice: "£325",
    monthlyPrice: "£15",
    blurb: "A credible online presence — what you do, how to reach you.",
    tagline: "Look credible. Get contacted.",
    bestFor: "sole traders, freelancers and local businesses.",
    lead: "Your professional shop window",
    highlights: [
      "A **striking hero banner** — slides, photo or video",
      "Show off your **products or your work** in photo galleries",
      "Enquiries and **WhatsApp** straight to your phone",
      "Your story: about, mission and a **history timeline**",
      "Update everything yourself and see **who's visiting**",
    ],
  },
  {
    key: "plus",
    label: "Plus",
    setupPrice: "£550",
    monthlyPrice: "£30",
    blurb: "For businesses actively marketing themselves and taking bookings.",
    tagline: "Get found. Get booked.",
    bestFor: "salons, clinics, consultants, trades and growing brands.",
    lead: "Everything in Basic, plus:",
    popular: true,
    highlights: [
      "**Online booking** that fills your diary — with a waitlist for full days",
      "Win trust: **reviews**, partner logos, certifications",
      "Stay in Google's sight with a **blog**, news & events",
      "A searchable **photo gallery** and a meet-the-team page",
      "Make it yours: **8 colour themes** + dark mode, and an **AI writing assistant**",
    ],
  },
  {
    key: "premium",
    label: "Premium",
    setupPrice: "£900",
    monthlyPrice: "£50",
    blurb: "For businesses ready to transact online and build repeat customers.",
    tagline: "Sell online. Keep them coming back.",
    bestFor: "shops, makers and membership businesses.",
    lead: "Everything in Plus, plus:",
    highlights: [
      "A full **shopping cart** and checkout, with orders in your admin",
      "**Promo codes** to drive first orders and repeat sales",
      "A **customer login** with order history",
      "Membership checks and **GDPR-ready** account closure",
    ],
  },
];

// How the compare page groups FEATURES for visitors. FEATURES' own `group` values stay matched
// to admin Settings → Feature Config (see top of file); this only regroups them for display, so
// the admin side is untouched. Every FEATURES group must appear in exactly one category.
export const COMPARE_CATEGORIES = [
  { key: "professional", title: "Look professional", sub: "Your home page, story and contact details", badge: "In every plan", groups: ["Core"] },
  { key: "trusted", title: "Get found & trusted", sub: "Content, reviews and proof that you're the real deal", badge: "From Plus", groups: ["Content & Marketing"] },
  { key: "booked", title: "Get booked", sub: "Let customers book you, day or night", badge: "From Plus", groups: ["Booking", "Tools", "Appearance"] },
  { key: "sell", title: "Sell online", sub: "A shop, customer accounts and repeat business", badge: "Premium", groups: ["Commerce"] },
];
