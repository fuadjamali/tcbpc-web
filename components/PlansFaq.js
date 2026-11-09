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

// "Questions people ask first" — shared by the home page's Plans area and /compare-plans so the
// copy can't drift. Renders just the heading + cards; the page supplies the wrapping section
// (and any links via `children`).
export default function PlansFaq({ children }) {
  return (
    <>
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
      {children}
    </>
  );
}
