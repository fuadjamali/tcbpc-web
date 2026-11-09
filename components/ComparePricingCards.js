"use client";

import { useState } from "react";
import { getYearlyPricing } from "@/lib/planFeatures";
import { BillingToggle } from "@/components/PlansPricing";

// Compact price cards for /compare-plans with the same Monthly/Yearly toggle as the home page's
// Plans section. The toggle is pulled up (-mt-12) so it sits at the bottom of the page hero,
// with the cards directly beneath it.
export default function ComparePricingCards({ tiers }) {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <BillingToggle yearly={yearly} onChange={setYearly} className="relative -mt-12" />
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {tiers.map((tier) => {
          const { yearlyTotal, yearlyPerMonth } = getYearlyPricing(tier.monthlyPrice);
          return (
            <div
              key={tier.key}
              className={`relative rounded-2xl border bg-surface p-6 text-center shadow-lg ${
                tier.popular ? "border-primary ring-2 ring-primary" : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                  Most popular
                </span>
              )}
              <p className="text-base font-bold">{tier.label}</p>
              <p className="mt-1 min-h-[34px] text-sm font-semibold text-primary">{tier.tagline}</p>
              <p className="mt-4 text-3xl font-extrabold">
                <sup className="align-top text-base font-bold">£</sup>
                {tier.setupPrice.replace("£", "")}
              </p>
              <p className="mt-1 text-xs text-muted">
                one-off setup ·{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {yearly ? yearlyPerMonth : tier.monthlyPrice}
                </span>
                /mo
              </p>
              <p className="mt-1 min-h-4 text-xs font-semibold text-green-600 dark:text-green-400">
                {yearly ? `${yearlyTotal} a year — 3 months free` : ""}
              </p>
              <a
                href="/#enquiry"
                className={`mt-4 block rounded-full py-2.5 text-sm font-semibold ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "border border-border text-foreground hover:bg-surface-alt"
                }`}
              >
                Get my free quote
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
