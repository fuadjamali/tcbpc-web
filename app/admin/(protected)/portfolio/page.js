import { getPortfolioItems } from "@/lib/portfolio";
import { deletePortfolioItemAction } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import { PORTFOLIO_SIZES, normalizePortfolioSize } from "@/lib/portfolioDisplay";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <div className="w-full max-w-4xl px-6">
      <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Portfolio</h1>
            <p className="mt-1 text-sm text-muted">
              Shown in the &quot;Our Work&quot; section on the home page. Changes appear on the
              live site immediately.
            </p>
          </div>
          <a
            href="/admin/portfolio/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Add project
          </a>
        </div>

        {items.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No portfolio items yet.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-20 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.name || "(no name)"}
                    </p>
                    <p className="text-sm text-muted">order {item.display_order}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="rounded-full bg-surface-alt px-2 py-0.5 font-semibold text-foreground">
                        {PORTFOLIO_SIZES[normalizePortfolioSize(item.image_size)].label}
                      </span>
                      {item.website_url ? (
                        <a
                          href={item.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent hover:underline"
                        >
                          {new URL(item.website_url).host.replace(/^www\./, "")} ↗
                        </a>
                      ) : (
                        <span className="text-muted">not linked</span>
                      )}
                      {item.live_preview &&
                        (item.preview_embeddable === true &&
                        item.image_size !== "small" ? (
                          <span className="text-green-700 dark:text-green-400">Live preview on</span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400">
                            Live preview on — showing image
                            {item.image_size === "small"
                              ? " (Small is too tiny)"
                              : item.preview_embeddable === false
                                ? " (site blocks embedding)"
                                : " (couldn't confirm the site allows it)"}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/admin/portfolio/${item.id}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-alt"
                  >
                    View
                  </a>
                  <a
                    href={`/admin/portfolio/${item.id}/edit`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-alt"
                  >
                    Edit
                  </a>
                  <form action={deletePortfolioItemAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton
                      confirmMessage={`Delete "${item.name || "this project"}"? This can't be undone.`}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-surface-alt dark:text-red-400"
                    />
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
