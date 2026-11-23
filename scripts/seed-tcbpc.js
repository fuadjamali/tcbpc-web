// Seeds the "TC Business Payments Consultant" site content into the database that DATABASE_URL
// points at: business info, root alert, nav, the split hero, stats, partners, how-it-works,
// products (Dojo Go Max flagship) + photos, portfolio case studies, about card, contact, WhatsApp,
// referral banner, section headings, footer/regulatory text, switched-off modules, and
// unpublished privacy/terms drafts.
//
// Run: npm run seed:tcbpc
//
// REPLACES the content of those tables (it does not merge), so only run it on a database you want
// to turn into the TC site. It does not create the admin login (npm run seed does that), and it
// does not set PLAN — the TC site runs on PLAN=basic (set it in .env.local / Vercel).
//
// Tables are created lazily by the app (no migrations directory), so they must exist first. Either
// open the site once in a browser, or set BASE_URL (e.g. http://localhost:3000 or the deployed
// URL) and this script will request the needed pages itself to create them.
//
// Images are referenced as /images/tcbpc/* and live in public/images/tcbpc/ in this repo.

const { Client } = require("pg");

const WARM_UP_PATHS = ["/", "/products/1", "/news-events", "/gallery", "/blog", "/team", "/privacy-policy", "/terms-of-service"];
const REQUIRED_TABLES = [
  "business_info", "root_alert", "nav_items", "hero_slides", "stats", "partners", "how_it_works_steps",
  "products", "product_photos", "portfolio_items", "about_info", "contact_info", "news_events",
  "social_settings", "section_headings", "module_settings", "legal_pages", "referral_banner", "site_text",
];

const DISCLOSURE = "Tausif Chowdhury is a self-employed Payments Consultant working on behalf of Dojo.";
const FCA =
  "Dojo is a trading name of Paymentsense Limited. Paymentsense Limited is authorised and regulated by the Financial Conduct Authority (FCA FRN 738728) and under the Electronic Money Regulations 2011 (FCA FRN 900925) for the issuing of electronic money and provision of payment services.";
const WA_MESSAGE = "Hi Tausif, I’d like a free rate review and quote for Dojo card payments.";
const IMG = "/images/tcbpc";

async function missingTables(client) {
  const { rows } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  );
  const have = new Set(rows.map((r) => r.table_name));
  return REQUIRED_TABLES.filter((t) => !have.has(t));
}

async function warmUp(baseUrl) {
  console.log(`Requesting pages on ${baseUrl} so the app creates its tables...`);
  for (const p of WARM_UP_PATHS) {
    // Concurrent first-time table creation can fail once and succeeds on retry (documented in
    // docs/developer-notes.md), so each page gets a few attempts.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(baseUrl.replace(/\/$/, "") + p, { signal: AbortSignal.timeout(120000) });
        if (res.status < 500) break;
      } catch {
        /* retry */
      }
    }
  }
}

async function seed(client) {
  const q = (text, params) => client.query(text, params);

  await q(
    `UPDATE business_info SET name=$1, tagline=$2, description=$3, domain=$4, updated_at=now() WHERE id=1`,
    [
      "TC Business Payments Consultant",
      "Listen first, recommend second.",
      `${DISCLOSURE} Free statement reviews, Dojo card machines, EPOS integration and 1-to-1 support for UK businesses.`,
      "businesspaymentsconsultantco.uk",
    ]
  );
  await q(`UPDATE root_alert SET enabled=true, message=$1, updated_at=now() WHERE id=1`, [DISCLOSURE]);

  await q(`DELETE FROM nav_items`);
  const nav = [
    ["Dojo Go Max & Solutions", "#products", false],
    ["Merchant Portfolio", "#portfolio", false],
    ["About & Process", "#about", false],
    ["Refer a Friend", "#referral", false],
    ["Get a Quote", "#enquiry", true],
  ];
  for (const [i, [label, href, cta]] of nav.entries()) {
    await q(`INSERT INTO nav_items(label,href,cta,highlight,display_order) VALUES ($1,$2,$3,false,$4)`, [label, href, cta, i + 1]);
  }

  // One split hero slide: copy + buttons on the left, the flagship product's photos on the right.
  await q(`DELETE FROM hero_slides`);
  await q(
    `INSERT INTO hero_slides(display_order,active,layout,eyebrow,heading,subheading,media_type,
       primary_cta_label,primary_cta_href,secondary_cta_label,secondary_cta_href,trust_points,badges,
       overlay_strength,text_style)
     VALUES (1,true,'split',$1,$2,$3,'image',$4,$5,$6,$7,$8,$9,'medium','auto')`,
    [
      "Listen First, Recommend Second",
      "Upgrade the way your UK business takes **card payments.**",
      `Hi, I’m Tausif Chowdhury — a self-employed Payments Consultant working on behalf of Dojo. No call centres or pushy scripts: I review your current setup, cut unnecessary fees, and get your Dojo machine live — with our flagship Dojo Go Max for busy counters and hands-on local support.`,
      "Get a Free Rate Review & Quote",
      "#enquiry",
      "07394 995 810",
      "tel:07394995810",
      "Single dedicated point of contact\nFree statement & rate review\nNext-day payouts, 7 days a week",
      "<2 sec Approval\nNext-day payouts",
    ]
  );

  await q(`DELETE FROM stats`);
  const stats = [
    ["99.99%", "Uptime reliability"],
    ["<2 sec", "Payments processed in under 2 seconds"],
    ["450+", "EPOS integrations"],
    ["Next-day", "Payouts, 7 days a week"],
  ];
  for (const [i, [v, l]] of stats.entries()) {
    await q(`INSERT INTO stats(value,label,display_order) VALUES ($1,$2,$3)`, [v, l, i + 1]);
  }

  await q(`DELETE FROM partners`);
  for (const [i, name] of ["Mastercard", "Maestro", "VISA", "Apple Pay", "Google Pay", "Samsung Pay"].entries()) {
    await q(`INSERT INTO partners(name,status,display_order) VALUES ($1,'Active',$2)`, [name, i + 1]);
  }

  await q(`DELETE FROM how_it_works_steps`);
  const steps = [
    ["Free Statement & Setup Review", "Share a recent merchant statement or tell me about your current provider. I break down your transaction rates, hidden PCI/authorisation fees and hardware costs in plain English."],
    ["Tailored Hardware & Rate Proposal", "Whether you need our flagship Dojo Go Max, a single Dojo Go, extra terminals or full EPOS integration, I present a transparent, competitive quote tailored to your turnover."],
    ["Fast Activation & Hands-On Support", "Once approved, your pre-configured Dojo machine arrives rapidly. I help get your first payment live and remain your direct contact whenever you need assistance."],
  ];
  for (const [i, [t, d]] of steps.entries()) {
    await q(`INSERT INTO how_it_works_steps(title,description,display_order) VALUES ($1,$2,$3)`, [t, d, i + 1]);
  }

  await q(`DELETE FROM product_photos`);
  await q(`DELETE FROM products`);
  const products = [
    {
      id: 2, order: 1, category: "Flagship", price: "Flagship · Free statement audit", flagship: true,
      name: "Dojo Go Max — Flagship High-Volume Card Machine",
      desc: "My flagship setup for busy counters. Dojo Go Max gives retail stores, hospitality venues and showrooms the checkout capacity to keep queues short — add extra terminals or add-on devices as you grow, with multi-device deals available.",
      badges: "Flagship Solution\nMulti-device deals available",
      features: "Built for high volume | Checkout capacity for busy retail, hospitality and showrooms.\nMulti-terminal ready | Add extra terminals or add-on devices as you grow.\nMulti-device deals | Ask for a bundled quote across every till you run.\nNext-day payouts | Payouts 7 days a week, with <2 second payments.",
      serviceLabel: "Included Consultant Service",
      serviceText: "Free Statement Audit + Direct 1-to-1 Setup by Tausif",
      ctaLabel: "Request Dojo Go Max Quote",
      ctaTopic: "Dojo Go Max flagship card machine",
      icon: "store",
      photos: [
        ["dojo-go-black-approved", "5:4", "Black finish", "Confident Black finish — approved payment screen."],
        ["dojo-go-white-keypad", "5:4", "White finish", "Calm White finish — keypad view."],
        ["dojo-go-side-profile", "5:4", "Side profile", "Ergonomic side profile."],
      ],
    },
    {
      id: 1, order: 2, category: "Card machines", price: "Free statement audit",
      name: "Dojo Go — Portable Card Machine & Full Setup",
      desc: "Contactless, Chip & PIN and mobile wallets in under 2 seconds with built-in 4G + Wi-Fi, an integrated receipt printer, smart tipping and next-day payouts. Includes a free statement audit and direct 1-to-1 setup by Tausif.",
      ctaLabel: "Request a Dojo Go quote", ctaTopic: "Dojo Go card machine", icon: "card",
      photos: [
        ["dojo-go-white-tip", "5:4", null, null],
        ["dojo-go-white-keypad", "5:4", null, null],
        ["dojo-go-black-approved", "5:4", null, null],
        ["dojo-go-side-profile", "5:4", null, null],
      ],
    },
    {
      id: 3, order: 3, category: "Card machines", price: "Get a quote",
      name: "Dojo Pocket — Portable Payments, Perfected",
      desc: 'A lightweight 143 g handheld (170 × 70 × 14.7 mm) that connects automatically to Wi-Fi or 4G, with an 8-hour battery, a 4.95" touchscreen, point-to-point encryption and cloud-based EPOS integration.',
      ctaLabel: "Request a Dojo Pocket quote", ctaTopic: "Dojo Pocket", icon: "handheld",
      photos: [["dojo-pocket-1", "1:1", null, null], ["dojo-pocket-2", "1:1", null, null]],
    },
    {
      id: 4, order: 4, category: "450+ Integrations", price: "Check compatibility",
      name: "EPOS Integrated Setups",
      desc: "Connect your Dojo card machine directly to over 450 leading EPOS systems. Push bill totals straight from your till to prevent manual keying mistakes.",
      ctaLabel: "Check EPOS compatibility", ctaTopic: "EPOS integrated setup", icon: "plug",
      photos: [],
    },
    {
      id: 5, order: 5, category: "Remote & Deposits", price: "Get a quote",
      name: "Pay Links & Virtual Terminal",
      desc: "Take secure card payments over the phone, or send instant payment links by SMS or email — ideal for vehicle deposits, salon bookings and invoices.",
      ctaLabel: "Ask about remote payments", ctaTopic: "Pay Links and Virtual Terminal", icon: "link",
      photos: [],
    },
  ];
  for (const p of products) {
    const cover = p.photos.length ? `${IMG}/${p.photos[0][0]}.webp` : null;
    await q(
      `INSERT INTO products(id,name,description,price,image,category,display_order,is_flagship,badges,features,
         service_label,service_text,cta_label,cta_topic,icon)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [p.id, p.name, p.desc, p.price, cover, p.category, p.order, Boolean(p.flagship), p.badges || null,
        p.features || null, p.serviceLabel || null, p.serviceText || null, p.ctaLabel || null,
        p.ctaTopic || null, p.icon || null]
    );
    for (const [i, [file, ratio, label, caption]] of p.photos.entries()) {
      await q(
        `INSERT INTO product_photos(product_id,image,is_cover,display_order,aspect_ratio,label,caption)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [p.id, `${IMG}/${file}.webp`, i === 0, i + 1, ratio, label, caption]
      );
    }
  }
  await q(`SELECT setval(pg_get_serial_sequence('products','id'), (SELECT MAX(id) FROM products))`);

  await q(`DELETE FROM portfolio_items`);
  const portfolio = [
    ["My Mobile Tech", "Live Activation", "Tech & Mobile Retail", "Multi-Terminal Dojo Go", "Activated a second Dojo card machine to expand counter checkout capacity and keep pace with growing daily customer footfall.", "Status: Accepting Payments", "✓ Verified Milestone"],
    ["Independent Retail Boutique", "Deal Signed", "Fashion & High-Street Retail", "Dojo Go Max Setup", "Upgraded an independent clothing & accessories retailer to smarter, faster, under-2-second contactless checkouts for busy weekend trading.", "Benefit: Faster Queue Turnover", "✓ Verified Milestone"],
    ["AN Car Sales Ltd", "Add-On Secured", "Automotive Dealership", "Dojo Go Max Add-On", "Deployed an additional Dojo Go Max solution for seamless showroom-floor vehicle payments and instant customer deposits.", "Benefit: High-Value Reliability", "✓ Verified Milestone"],
  ];
  for (const [i, [n, badge, sector, solution, d, status, benefit]] of portfolio.entries()) {
    await q(
      `INSERT INTO portfolio_items(name,description,image,display_order,badge,sector,solution,status_text,benefit)
       VALUES ($1,$2,NULL,$3,$4,$5,$6,$7,$8)`,
      [n, d, i + 1, badge, sector, solution, status, benefit]
    );
  }

  await q(
    `UPDATE about_info SET heading=$1, subtitle=$2, image=NULL, image_position='left', body=$3, updated_at=now() WHERE id=1`,
    [
      "Tausif Chowdhury",
      "Self-employed Payments Consultant working on behalf of Dojo",
      `With years of hands-on experience in the UK payments industry, I know that every business operates differently — and that the right card machine setup makes a genuine difference to your bottom line.

My approach is simple — listen first, recommend second. Rather than pushing a one-size-fits-all contract, I take the time to understand how you trade, audit what you are currently paying, and highlight real savings.

Working with me means you get a single, dedicated point of contact. No call centres, no being passed between departments — just honest advice and hands-on support.`,
    ]
  );

  // The Contact Us *section* stays off — its details are shown in the top bar, About card and
  // footer instead — but the row's phone/email/heading still feed those.
  await q(
    `UPDATE contact_info SET heading=$1, subheading=$2, address=NULL, phone=$3, email=$4, enabled=false, updated_at=now() WHERE id=1`,
    ["Direct Consultant Contact", "Supporting UK businesses nationwide with direct 1-to-1 onboarding.", "07394 995 810", "tausif.chowdhury@dojo.tech"]
  );

  await q(
    `UPDATE referral_banner SET enabled=true, eyebrow=$1, heading=$2, body=$3, cta_label=$4, cta_topic=$5, tiers=$6, updated_at=now() WHERE id=1`,
    [
      "Refer a Friend to Dojo",
      "Earn up to **£100** for sharing Dojo with a fellow business.",
      "Know another UK business owner frustrated with slow card machines or high processing fees? Introduce them to Tausif Chowdhury and earn cash rewards as your referrals go live.",
      "Refer a Business Now →",
      "Business Referral Submission",
      "£50 | for your first referral\n£75 | for your second referral\n£100 | for every following referral",
    ]
  );

  // Kept so an upgrade to Plus (which enables News & Events) already has the referral post.
  await q(`DELETE FROM news_events`);
  await q(
    `INSERT INTO news_events(slug,type,title,summary,description,published_date) VALUES ($1,'News',$2,$3,$4,CURRENT_DATE)`,
    [
      "refer-a-friend-to-dojo",
      "Refer a Friend to Dojo — earn up to £100",
      "Know another UK business frustrated with slow card machines or high processing fees? Introduce them to Tausif and earn cash rewards as your referrals go live.",
      `Know another UK business owner frustrated with slow card machines or high processing fees? Introduce them to Tausif Chowdhury and earn cash rewards as your referrals go live.

£50 for your first referral.

£75 for your second referral.

£100 for every following referral.

To refer a business, use the Get a Quote form on this site or call or WhatsApp 07394 995 810 and mention the referral.`,
    ]
  );

  await q(
    `UPDATE social_settings SET whatsapp_number='447394995810', whatsapp_group_url=NULL, whatsapp_message=$1, footer_whatsapp_message=$1, updated_at=now() WHERE id=1`,
    [WA_MESSAGE]
  );

  const headings = [
    ["howItWorks", "Switching to Dojo in 3 straightforward steps", "A simple, consultative process from first call to first payment.", "How It Works"],
    ["products", "Tailored Dojo payment hardware & setups for every UK business.", "Whether you run a busy high-street salon, retail boutique, restaurant, or mobile catering van, I configure the exact hardware and rate package your business needs.", "Product & Service Catalog"],
    ["portfolio", "Recent Merchant Activations", "Real UK businesses helped by Tausif Chowdhury with tailored Dojo payment upgrades and on-site activation.", "Proven UK Track Record"],
    ["partners", "All major cards & digital wallets accepted", null, null],
    ["newsEvents", "Refer a Friend", "Earn up to £100 for sharing Dojo with a fellow business.", null],
    ["enquiryForm", "Get a Quote", "Fill in your details below and Tausif Chowdhury will get back to you directly with tailored rates and hardware options.", "No-Obligation Consultation"],
    ["footer", "Ready to upgrade your card payments?", "Reach out directly — I’ll reply personally with tailored rates and hardware options.", null],
  ];
  for (const [key, h, s, eyebrow] of headings) {
    await q(
      `INSERT INTO section_headings(section_key,heading,subheading,eyebrow) VALUES ($1,$2,$3,$4)
       ON CONFLICT (section_key) DO UPDATE SET heading=EXCLUDED.heading, subheading=EXCLUDED.subheading,
         eyebrow=EXCLUDED.eyebrow, updated_at=now()`,
      [key, h, s, eyebrow]
    );
  }

  await q(
    `UPDATE site_text SET regulatory_text=$1, payments_label=$2, payment_methods=$3, updated_at=now() WHERE id=1`,
    [`${FCA}`, "All Major Cards & Digital Wallets Accepted:", "Mastercard\nMaestro\nVISA\nApple Pay\nGoogle Pay\nSamsung Pay"]
  );

  for (const m of ["blog", "gallery", "reviews", "team", "certifications", "map", "visionMission", "history"]) {
    await q(
      `INSERT INTO module_settings(module_name,enabled) VALUES ($1,false)
       ON CONFLICT (module_name) DO UPDATE SET enabled=false, updated_at=now()`,
      [m]
    );
  }

  const legal = {
    "privacy-policy": ["Privacy Policy", `DRAFT — review before publishing. TC Business Payments Consultant (Tausif Chowdhury, a self-employed Payments Consultant working on behalf of Dojo) collects the name, phone, email, business name and message you submit through the enquiry form solely to respond to your enquiry. Anonymous visit analytics are collected only if you accept cookies. To ask about your data, email tausif.chowdhury@dojo.tech.`],
    "terms-of-service": ["Terms of Service", `DRAFT — review before publishing. This website is operated by Tausif Chowdhury, a self-employed Payments Consultant working on behalf of Dojo. Information here is general and not a binding offer; rates and hardware are confirmed in your written Dojo proposal. Dojo is a trading name of Paymentsense Limited, authorised and regulated by the FCA (FRN 738728 and FRN 900925).`],
  };
  for (const [slug, [title, body]] of Object.entries(legal)) {
    await q(`UPDATE legal_pages SET title=$2, body=$3, enabled=false, updated_at=now() WHERE slug=$1`, [slug, title, body]);
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set (run via `npm run seed:tcbpc`, which loads .env.local).");
    process.exit(1);
  }
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    let missing = await missingTables(client);
    if (missing.length && process.env.BASE_URL) {
      await warmUp(process.env.BASE_URL);
      missing = await missingTables(client);
    }
    if (missing.length) {
      console.error(
        `These tables don't exist yet: ${missing.join(", ")}.\n` +
          "The app creates them on first use — open the site (home page, /products/1, /news-events, /privacy-policy) " +
          "or set BASE_URL to a running copy of the app, then run this again."
      );
      process.exit(1);
    }
    await client.query("BEGIN");
    await seed(client);
    await client.query("COMMIT");
    console.log("Seeded TC Business Payments Consultant content. Remember: PLAN=basic, and `npm run seed` for the admin login.");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Seed failed, nothing was changed:", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
