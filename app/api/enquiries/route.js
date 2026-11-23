import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await db.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS business_name VARCHAR(255)`);
}

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  await ensureTable();

  await db.query(
    "INSERT INTO enquiries (name, email, phone, message, business_name) VALUES ($1, $2, $3, $4, $5)",
    [body.name, body.email, body.phone || null, body.message, body.businessName || null]
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
