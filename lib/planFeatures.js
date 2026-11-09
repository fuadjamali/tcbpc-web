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
export const TIERS = [
  {
    key: "basic",
    label: "Basic",
    setupPrice: "£325",
    monthlyPrice: "£15",
    blurb: "A credible online presence — what you do, how to reach you.",
    highlights: [
      "Home page with hero banner + one showcase (Products or Portfolio)",
      "Contact info + enquiry form",
      "WhatsApp CTA (floating + footer, number or group invite link) + social links",
      "Basic visit analytics",
    ],
  },
  {
    key: "plus",
    label: "Plus",
    setupPrice: "£550",
    monthlyPrice: "£30",
    blurb: "For businesses actively marketing themselves and taking bookings.",
    popular: true,
    highlights: [
      "Everything in Basic, plus:",
      "Blog with rich-text editor, Gallery, News & Events",
      "Reviews, Partners, Team & People, Certifications",
      "Real-time booking + waitlist",
      "“Write with AI” content assistant",
    ],
  },
  {
    key: "premium",
    label: "Premium",
    setupPrice: "£900",
    monthlyPrice: "£50",
    blurb: "For businesses ready to transact online and build repeat customers.",
    highlights: [
      "Everything in Plus, plus:",
      "Shopping cart + checkout",
      "Discount / promo codes",
      "Member login portal + order history",
    ],
  },
];
