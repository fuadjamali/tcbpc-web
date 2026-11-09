"use client";

import { useState } from "react";
import { getYearlyPricing } from "@/lib/planFeatures";

function Tick() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 h-[18px] w-[18px] shrink-0 text-green-600 dark:text-green-400"
    >
      <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm4.4 7.6l-5 5a1 1 0 01-1.4 0l-2.4-2.4a1 1 0 111.4-1.4l1.7 1.7 4.3-4.3a1 1 0 111.4 1.4z" />
    </svg>
  );
}

// Turns "a **bold** phrase" into text with a highlighter-style <mark> on the bold part. Copy is
// our own static strings in lib/planFeatures.js (never user input), so no escaping concerns.
function Highlighted({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="bg-transparent px-0.5 font-semibold text-foreground [background-image:linear-gradient(transparent_55%,color-mix(in_srgb,var(--accent)_30%,transparent)_55%)]"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function BillingToggle({ yearly, onChange }) {
  const base = "rounded-full px-5 py-2 text-sm font-semibold transition";
  return (
    <div className="mt-8 flex justify-center">
      <div
        role="group"
        aria-label="Billing period"
        className="inline-flex rounded-full border border-border bg-surface p-1"
      >
        <button
          type="button"
          aria-pressed={!yearly}
          onClick={() => onChange(false)}
          className={`${base} ${!yearly ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"}`}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={yearly}
          onClick={() => onChange(true)}
          className={`${base} ${yearly ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"}`}
        >
          Yearly
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              yearly ? "bg-white/25" : "bg-accent/25 text-foreground"
            }`}
          >
            3 months free
          </span>
        </button>
      </div>
    </div>
  );
}

// The home page's Plans cards, with a Monthly/Yearly billing toggle. Tier data comes from
// lib/planFeatures.js; `quoteHref` is where each "free quote" button points (the home page
// works that out from which sections are enabled).
export default function PlansPricing({ tiers, quoteHref }) {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <BillingToggle yearly={yearly} onChange={setYearly} />

      <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => {
          const { yearlyTotal, yearlyPerMonth } = getYearlyPricing(tier.monthlyPrice);
          return (
            <div
              key={tier.key}
              className={`relative flex flex-col rounded-3xl border bg-surface p-7 transition duration-200 hover:-translate-y-1 ${
                tier.popular
                  ? "border-2 border-primary shadow-xl lg:-translate-y-3 lg:hover:-translate-y-4"
                  : "border-border shadow-sm hover:shadow-lg"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Most popular
                </span>
              )}

              <h3 className="text-2xl font-extrabold">{tier.label}</h3>
              <p className="mt-1 text-base font-bold text-primary">{tier.tagline}</p>
              <p className="mt-2 text-sm text-muted">
                <span className="font-semibold text-foreground">Best for</span> {tier.bestFor}
              </p>

              <div className="mt-5 border-y border-dashed border-border py-4">
                <p className="text-4xl font-extrabold tracking-tight">
                  {tier.setupPrice}
                  <span className="ml-1 text-sm font-normal text-muted">one-off setup</span>
                </p>
                <p className="mt-1.5 text-sm text-muted">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {yearly ? yearlyPerMonth : tier.monthlyPrice}
                  </span>{" "}
                  / month
                </p>
                {yearly && (
                  <p className="mt-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    {yearlyTotal} a year — 3 months free
                  </p>
                )}
              </div>

              <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-primary">
                {tier.lead}
              </p>
              <ul className="flex-1 space-y-2.5 text-sm">
                {tier.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Tick />
                    <span className="text-foreground">
                      <Highlighted text={item} />
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={quoteHref}
                className={`mt-7 block rounded-full py-3 text-center text-sm font-semibold transition ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "border-[1.5px] border-border text-foreground hover:bg-surface-alt"
                }`}
              >
                Get {tier.label} — free quote
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
