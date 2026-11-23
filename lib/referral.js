import { db } from "@/lib/db";

// "Refer a Friend" promotional banner — a singleton (one banner per site), switchable on/off
// without losing what was entered, same pattern as lib/contactInfo.js. `tiers` is one reward per
// line, "£50 | for your first referral"; the last tier is highlighted on the public banner.
async function ensureTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS referral_banner (
        id INT PRIMARY KEY,
        enabled BOOLEAN NOT NULL DEFAULT false,
        eyebrow VARCHAR(100),
        heading TEXT NOT NULL DEFAULT 'Refer a friend',
        body TEXT,
        cta_label VARCHAR(100),
        cta_topic VARCHAR(255),
        tiers TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  } catch (err) {
    // See lib/sectionHeadings.js's ensureTable comment — concurrent first-time
    // "CREATE TABLE IF NOT EXISTS" callers can race under Postgres.
    if (err.code !== "23505" && err.code !== "42P07") throw err;
  }
}

// Starts disabled and empty: a referral banner with placeholder rewards on a real client site
// would be worse than none.
async function ensureRow() {
  await ensureTable();
  await db.query(
    `INSERT INTO referral_banner (id, enabled, heading) VALUES (1, false, 'Refer a friend')
     ON CONFLICT (id) DO NOTHING`
  );
}

export async function getReferralBanner() {
  await ensureRow();
  const { rows } = await db.query("SELECT * FROM referral_banner WHERE id = 1");
  return rows[0];
}

export async function updateReferralBanner({ enabled, eyebrow, heading, body, ctaLabel, ctaTopic, tiers }) {
  await ensureRow();
  await db.query(
    `UPDATE referral_banner
     SET enabled = $1, eyebrow = $2, heading = $3, body = $4, cta_label = $5, cta_topic = $6,
         tiers = $7, updated_at = now()
     WHERE id = 1`,
    [
      Boolean(enabled),
      eyebrow || null,
      heading || "Refer a friend",
      body || null,
      ctaLabel || null,
      ctaTopic || null,
      tiers || null,
    ]
  );
}
