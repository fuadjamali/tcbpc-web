import AIAssistantButton from "@/components/AIAssistantButton";
import { PRODUCT_ICONS } from "@/lib/products";

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none";

export default function ProductForm({ action, product, submitLabel, aiEnabled = false }) {
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground">Name</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Product name"
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          id="product-description"
          name="description"
          rows={3}
          defaultValue={product?.description}
          placeholder="Short description"
          className={fieldClass}
        />
        {aiEnabled && (
          <AIAssistantButton targetId="product-description" fieldLabel="product description" />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Price label</label>
          <input
            type="text"
            name="price"
            defaultValue={product?.price}
            placeholder="$29"
            className={fieldClass}
          />
          <p className="mt-1 text-xs text-muted">
            Shown on the site. Can be free text, e.g. &quot;From $29&quot; or &quot;Contact for
            quote&quot;.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Category</label>
          <input
            type="text"
            name="category"
            defaultValue={product?.category}
            placeholder="e.g. General"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Cart price (leave blank to disable &quot;Add to cart&quot; for this product)
        </label>
        <input
          type="number"
          name="priceAmount"
          step="0.01"
          min="0"
          defaultValue={product?.price_amount ?? ""}
          placeholder="29.00"
          className={fieldClass}
        />
      </div>

      <fieldset className="space-y-4 rounded-lg border border-border bg-surface-alt p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Home-page showcase</legend>

        <label className="flex items-start gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="isFlagship"
            defaultChecked={product?.is_flagship}
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span>
            Flagship product — gets the large spotlight card and fills the split hero&apos;s product
            stage. Only one product can be the flagship; ticking this clears it from the others.
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-foreground">Badges (one per line)</label>
          <textarea
            name="badges"
            rows={2}
            defaultValue={product?.badges}
            placeholder={"Flagship Solution\nMulti-device deals available"}
            className={fieldClass}
          />
          <p className="mt-1 text-xs text-muted">Small pills above the title (flagship card only).</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Feature cards (one per line, &quot;Title | short description&quot;)
          </label>
          <textarea
            name="features"
            rows={4}
            defaultValue={product?.features}
            placeholder={"Built for high volume | Capacity for busy counters."}
            className={fieldClass}
          />
          <p className="mt-1 text-xs text-muted">Flagship card only — up to 4 are shown.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Service line — label</label>
            <input
              type="text"
              name="serviceLabel"
              defaultValue={product?.service_label}
              placeholder="Included Consultant Service"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Service line — text</label>
            <input
              type="text"
              name="serviceText"
              defaultValue={product?.service_text}
              placeholder="Free statement audit + 1-to-1 setup"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Button label</label>
            <input
              type="text"
              name="ctaLabel"
              defaultValue={product?.cta_label}
              placeholder="Request a quote"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Quote topic</label>
            <input
              type="text"
              name="ctaTopic"
              defaultValue={product?.cta_topic}
              placeholder="Dojo Go Max card machine"
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-muted">
              The button scrolls to the enquiry form and pre-fills its message with this topic.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Icon (smaller cards)</label>
          <select name="icon" defaultValue={product?.icon || ""} className={fieldClass}>
            <option value="">Default</option>
            {PRODUCT_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <div>
        <label className="block text-sm font-medium text-foreground">Display order</label>
        <input
          type="number"
          name="displayOrder"
          defaultValue={product?.display_order ?? 0}
          className={fieldClass}
        />
      </div>

      {!product && (
        <p className="text-xs text-muted">
          Photos are added after the product is created — you&apos;ll be taken to the photo
          manager next.
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
        <a
          href="/admin/products"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-alt"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
