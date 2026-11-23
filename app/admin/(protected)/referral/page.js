import { getReferralBanner } from "@/lib/referral";
import { updateReferralBannerAction } from "./actions";

export const dynamic = "force-dynamic";

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none";
const labelClass = "block text-sm font-medium text-foreground";

export default async function AdminReferralPage() {
  const banner = await getReferralBanner();

  return (
    <div className="w-full max-w-lg px-6">
      <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">Refer a Friend banner</h1>
        <p className="mt-1 text-sm text-muted">
          A promotional banner on the home page with reward tiers and a button that opens the quote
          form. Switch it off without losing what you&apos;ve entered.
        </p>

        <form action={updateReferralBannerAction} className="mt-6 space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={banner.enabled}
              className="h-4 w-4 rounded border-border"
            />
            Show this banner on the home page
          </label>

          <div>
            <label className={labelClass}>Eyebrow (small pill)</label>
            <input name="eyebrow" defaultValue={banner.eyebrow || ""} className={fieldClass} />
          </div>

          <div>
            <label className={labelClass}>Heading</label>
            <textarea name="heading" rows={2} defaultValue={banner.heading} className={fieldClass} />
            <p className="mt-1 text-xs text-muted">
              Wrap words in **double asterisks** to highlight them, e.g. Earn up to **£100** for
              sharing.
            </p>
          </div>

          <div>
            <label className={labelClass}>Text</label>
            <textarea name="body" rows={3} defaultValue={banner.body || ""} className={fieldClass} />
          </div>

          <div>
            <label className={labelClass}>
              Reward tiers (one per line, &quot;Amount | description&quot;)
            </label>
            <textarea
              name="tiers"
              rows={4}
              defaultValue={banner.tiers || ""}
              placeholder={"£50 | for your first referral\n£75 | for your second referral\n£100 | for every following referral"}
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-muted">The last tier is highlighted.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Button label</label>
              <input name="ctaLabel" defaultValue={banner.cta_label || ""} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Quote topic</label>
              <input name="ctaTopic" defaultValue={banner.cta_topic || ""} className={fieldClass} />
            </div>
          </div>
          <p className="text-xs text-muted">
            The button scrolls to the enquiry form and pre-fills its message with the topic.
          </p>

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
