import { db } from "@/lib/db";
import { normalizePortfolioSize } from "@/lib/portfolioDisplay";

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      image VARCHAR(500) NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  // Optional website link (opens in a new tab), per-card size, and an optional live preview of
  // the linked site. Defaults keep every existing project exactly as it was: no link, large,
  // preview off. preview_embeddable is the result of a header check at save time
  // (lib/websiteLink.js checkEmbeddable) — true / false / null (unknown).
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS website_url VARCHAR(500)`);
  await db.query(
    `ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS image_size VARCHAR(10) NOT NULL DEFAULT 'large'`
  );
  await db.query(
    `ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS live_preview BOOLEAN NOT NULL DEFAULT false`
  );
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS preview_embeddable BOOLEAN`);
  // "Case study" fields for the merchant-activation card style (components/PortfolioCaseCard.js):
  // badge pill, sector label, hardware/solution line, outcome footer text. All optional. The
  // image is optional too now — a case-study card needs no photo.
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS badge VARCHAR(60)`);
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS sector VARCHAR(100)`);
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS solution VARCHAR(150)`);
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS benefit VARCHAR(150)`);
  await db.query(`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS status_text VARCHAR(100)`);
  await db.query(`ALTER TABLE portfolio_items ALTER COLUMN image DROP NOT NULL`);
}

function caseValues(d) {
  return [d.badge || null, d.sector || null, d.solution || null, d.benefit || null, d.statusText || null];
}

// Same placeholder-content convention as gallery/products/etc — migrated off the static
// config/site.js `portfolio.items` array so a fresh install still shows something.
const DEFAULT_ITEMS = [
  { image: "/images/portfolio-1.jpg", name: "PORTFOLIO_1_NAME", display_order: 1 },
  { image: "/images/portfolio-2.jpg", name: "PORTFOLIO_2_NAME", display_order: 2 },
  { image: "/images/portfolio-3.jpg", name: "PORTFOLIO_3_NAME", display_order: 3 },
];

async function seedIfEmpty() {
  const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM portfolio_items");
  if (rows[0].count > 0) return;

  for (const p of DEFAULT_ITEMS) {
    await db.query(
      "INSERT INTO portfolio_items (image, name, display_order) VALUES ($1, $2, $3)",
      [p.image, p.name, p.display_order]
    );
  }
}

export async function getPortfolioItems() {
  await ensureTable();
  await seedIfEmpty();
  const { rows } = await db.query(
    "SELECT * FROM portfolio_items ORDER BY display_order ASC, id ASC"
  );
  return rows;
}

export async function getPortfolioItem(id) {
  await ensureTable();
  const { rows } = await db.query("SELECT * FROM portfolio_items WHERE id = $1", [id]);
  return rows[0] || null;
}

export async function createPortfolioItem({
  name,
  description,
  image,
  displayOrder,
  websiteUrl,
  imageSize,
  livePreview,
  previewEmbeddable,
  ...caseFields
}) {
  await ensureTable();
  await db.query(
    `INSERT INTO portfolio_items
       (name, description, image, display_order, website_url, image_size, live_preview, preview_embeddable,
        badge, sector, solution, benefit, status_text)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      name || null,
      description || null,
      image,
      displayOrder || 0,
      websiteUrl || null,
      normalizePortfolioSize(imageSize),
      Boolean(livePreview && websiteUrl),
      websiteUrl && livePreview ? (previewEmbeddable ?? null) : null,
      ...caseValues(caseFields),
    ]
  );
}

export async function updatePortfolioItem(
  id,
  { name, description, image, displayOrder, websiteUrl, imageSize, livePreview, previewEmbeddable, ...caseFields }
) {
  await ensureTable();
  await db.query(
    `UPDATE portfolio_items
     SET name = $1, description = $2, image = $3, display_order = $4,
         website_url = $5, image_size = $6, live_preview = $7, preview_embeddable = $8,
         badge = $9, sector = $10, solution = $11, benefit = $12, status_text = $13,
         updated_at = now()
     WHERE id = $14`,
    [
      name || null,
      description || null,
      image,
      displayOrder || 0,
      websiteUrl || null,
      normalizePortfolioSize(imageSize),
      Boolean(livePreview && websiteUrl),
      websiteUrl && livePreview ? (previewEmbeddable ?? null) : null,
      ...caseValues(caseFields),
      id,
    ]
  );
}

export async function deletePortfolioItem(id) {
  await ensureTable();
  await db.query("DELETE FROM portfolio_items WHERE id = $1", [id]);
}
