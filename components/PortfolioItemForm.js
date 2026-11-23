import ImageFileInput from "@/components/ImageFileInput";
import AIAssistantButton from "@/components/AIAssistantButton";
import PortfolioDisplayFields from "@/components/PortfolioDisplayFields";

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none";

export default function PortfolioItemForm({ action, item, submitLabel, aiEnabled = false }) {
  return (
    <form action={action} className="mt-6 space-y-4">
      <ImageFileInput
        name="imageFile"
        label="Image"
        currentImage={item?.image}
        helpText="Optional — case-study cards (the fields below) don't need a photo."
      />

      <div>
        <label className="block text-sm font-medium text-foreground">Project name</label>
        <input
          type="text"
          name="name"
          defaultValue={item?.name}
          placeholder="e.g. Riverside Apartments"
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          id="portfolio-description"
          name="description"
          rows={3}
          defaultValue={item?.description}
          placeholder="Short description of the project"
          className={fieldClass}
        />
        {aiEnabled && (
          <AIAssistantButton targetId="portfolio-description" fieldLabel="portfolio project description" />
        )}
      </div>

      <fieldset className="space-y-4 rounded-lg border border-border bg-surface-alt p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Case-study card (optional)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Badge</label>
            <input name="badge" defaultValue={item?.badge} placeholder="Live Activation" className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Sector</label>
            <input name="sector" defaultValue={item?.sector} placeholder="Tech & Mobile Retail" className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Hardware / solution</label>
          <input name="solution" defaultValue={item?.solution} placeholder="Multi-Terminal Dojo Go" className={fieldClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Footer — status</label>
            <input name="statusText" defaultValue={item?.status_text} placeholder="Status: Accepting Payments" className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Footer — benefit</label>
            <input name="benefit" defaultValue={item?.benefit} placeholder="✓ Verified Milestone" className={fieldClass} />
          </div>
        </div>
        <p className="text-xs text-muted">
          When a badge, sector or solution is filled in, the project is shown as a case-study card
          instead of an image card.
        </p>
      </fieldset>

      <PortfolioDisplayFields item={item} />

      <div>
        <label className="block text-sm font-medium text-foreground">Display order</label>
        <input
          type="number"
          name="displayOrder"
          defaultValue={item?.display_order ?? 0}
          className={fieldClass}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
        <a
          href="/admin/portfolio"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-alt"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
