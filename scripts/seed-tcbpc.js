// Seeds the "TC Business Payments Consultant" site content into the database that DATABASE_URL
// points at: business info, root alert, nav, hero slides, stats, partners, how-it-works, products
// (Dojo Go Max flagship) + photos, portfolio, about, contact, WhatsApp, section headings,
// switched-off modules, and unpublished privacy/terms drafts.
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
  "social_settings", "section_headings", "module_settings", "legal_pages",
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
    ["Get a Quote", "#enquiry", true],
  ];
  for (const [i, [label, href, cta]] of nav.entries()) {
    await q(`INSERT INTO nav_items(label,href,cta,highlight,display_order) VALUES ($1,$2,$3,false,$4)`, [label, href, cta, i + 1]);
  }

  await q(`DELETE FROM hero_slides`);
  const slides = [
    {
      heading: "Upgrade the way your UK business takes card payments.",
      sub: `Hi, I’m Tausif Chowdhury — a self-employed Payments Consultant working on behalf of Dojo. I review your current setup, cut unnecessary fees, and get your Dojo machine live — with our flagship Dojo Go Max for busy counters and hands-on local support.`,
      image: `${IMG}/dojo-go-black-approved.webp`,
      cta1: ["Get a Dojo Go Max Quote", "#enquiry"],
      cta2: ["Explore Dojo Go Max", "#products"],
      overlay: "light",
    },
    {
      heading: "Refer a business, earn up to £100.",
      sub: "£50 for your first referral, £75 for your second and £100 for every following referral — for introducing a fellow UK business to Dojo.",
      image: `${IMG}/hero-dojo-handheld.webp`,
      cta1: ["Refer a Business Now", "#enquiry"],
      cta2: [null, null],
      overlay: "dark",
    },
  ];
  for (const [i, s] of slides.entries()) {
    await q(
      `INSERT INTO hero_slides(display_order,active,heading,subheading,media_type,background_image,
         primary_cta_label,primary_cta_href,secondary_cta_label,secondary_cta_href,overlay_strength,text_style)
       VALUES ($1,true,$2,$3,'image',$4,$5,$6,$7,$8,$9,'auto')`,
      [i + 1, s.heading, s.sub, s.image, s.cta1[0], s.cta1[1], s.cta2[0], s.cta2[1], s.overlay]
    );
  }

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
      id: 2, order: 1, category: "Flagship", price: "Flagship · Free statement audit",
      name: "Dojo Go Max — Flagship High-Volume Card Machine",
      desc: "My flagship setup for busy counters. Dojo Go Max gives retail stores, hospitality venues and showrooms the checkout capacity to keep queues short — add extra terminals or add-on devices as you grow, with multi-device deals available. Includes a free statement audit and direct 1-to-1 setup by Tausif.",
      photos: [["dojo-go-black-approved", "5:4"], ["dojo-go-white-keypad", "5:4"], ["dojo-go-side-profile", "5:4"]],
    },
    {
      id: 1, order: 2, category: "Card machines", price: "Free statement audit",
      name: "Dojo Go — Portable Card Machine & Full Setup Service",
      desc: "Take contactless, Chip & PIN and mobile wallet payments in under 2 seconds with built-in 4G + Wi-Fi (automatic failover), an integrated thermal receipt printer with a paperless option, on-screen tipping and next-day payouts 7 days a week. Includes a free statement audit and direct 1-to-1 setup by Tausif. Available in Confident Black and Calm White.",
      photos: [["dojo-go-white-tip", "5:4"], ["dojo-go-white-keypad", "5:4"], ["dojo-go-black-approved", "5:4"], ["dojo-go-side-profile", "5:4"]],
    },
    {
      id: 3, order: 3, category: "Card machines", price: "Get a quote",
      name: "Dojo Pocket — Portable Payments, Perfected",
      desc: 'A lightweight 143 g handheld (170 × 70 × 14.7 mm) that connects automatically to Wi-Fi or 4G, with an 8-hour battery, a 4.95" touchscreen, point-to-point encryption and cloud-based EPOS integration. Accepts all major cards plus Apple Pay and Google Pay.',
      photos: [["dojo-pocket-1", "1:1"], ["dojo-pocket-2", "1:1"]],
    },
    {
      id: 4, order: 4, category: "Integrations", price: "Check compatibility",
      name: "EPOS Integrated Setups",
      desc: "Connect your Dojo card machine directly to over 450 leading EPOS systems. Push bill totals straight from your till to prevent manual keying mistakes.",
      photos: [],
    },
    {
      id: 5, order: 5, category: "Remote payments", price: "Get a quote",
      name: "Pay Links & Virtual Terminal",
      desc: "Take secure card payments over the phone, or send instant payment links by SMS or email — ideal for vehicle deposits, salon bookings and invoices.",
      photos: [],
    },
  ];
  for (const p of products) {
    const cover = p.photos.length ? `${IMG}/${p.photos[0][0]}.webp` : null;
    await q(
      `INSERT INTO products(id,name,description,price,image,category,display_order) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [p.id, p.name, p.desc, p.price, cover, p.category, p.order]
    );
    for (const [i, [file, ratio]] of p.photos.entries()) {
      await q(
        `INSERT INTO product_photos(product_id,image,is_cover,display_order,aspect_ratio) VALUES ($1,$2,$3,$4,$5)`,
        [p.id, `${IMG}/${file}.webp`, i === 0, i + 1, ratio]
      );
    }
  }
  await q(`SELECT setval(pg_get_serial_sequence('products','id'), (SELECT MAX(id) FROM products))`);

  await q(`DELETE FROM portfolio_items`);
  const portfolio = [
    ["My Mobile Tech", "Tech & mobile retail — multi-terminal Dojo Go. Activated a second Dojo card machine to expand counter checkout capacity and keep pace with growing daily footfall.", "merchant-my-mobile-tech"],
    ["Independent Retail Boutique", "Fashion & high-street retail — Dojo Go Max setup. Upgraded to faster, under-2-second contactless checkouts for busy weekend trading.", "merchant-retail-boutique"],
    ["AN Car Sales Ltd", "Automotive dealership — Dojo Go Max add-on. Deployed an additional terminal for showroom-floor vehicle payments and instant customer deposits.", "merchant-an-car-sales"],
  ];
  for (const [i, [n, d, f]] of portfolio.entries()) {
    await q(`INSERT INTO portfolio_items(name,description,image,display_order) VALUES ($1,$2,$3,$4)`, [n, d, `${IMG}/${f}.svg`, i + 1]);
  }

  await q(
    `UPDATE about_info SET heading=$1, image=NULL, image_position='left', body=$2, updated_at=now() WHERE id=1`,
    [
      "About Tausif Chowdhury",
      `With years of hands-on experience in the UK payments industry, I know that every business operates differently — and that the right card machine setup makes a genuine difference to your bottom line.

Listen first, recommend second: I take the time to understand how you trade, audit what you currently pay and highlight real savings, rather than pushing a one-size-fits-all contract.

One dedicated contact: no call centres and no being passed between departments — just honest advice from the same person every time.

Hands-on support: from your first live payment to any question later on, you can call or WhatsApp me directly.

${DISCLOSURE}`,
    ]
  );

  await q(
    `UPDATE contact_info SET heading=$1, subheading=$2, address=NULL, phone=$3, email=$4, enabled=true, updated_at=now() WHERE id=1`,
    ["Contact Tausif", "Supporting UK businesses nationwide with direct 1-to-1 onboarding.", "07394 995 810", "tausif.chowdhury@dojo.tech"]
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
    ["howItWorks", "Switching to Dojo in 3 straightforward steps", "A simple, consultative process from first call to first payment."],
    ["products", "Dojo Go Max & Payment Solutions", "Our flagship Dojo Go Max for busy counters, plus tailored hardware and setups for every UK business."],
    ["portfolio", "Recent Merchant Activations", "Real UK businesses helped by Tausif Chowdhury with tailored Dojo payment upgrades."],
    ["partners", "All major cards & digital wallets accepted", null],
    ["newsEvents", "Refer a Friend", "Earn up to £100 for sharing Dojo with a fellow business."],
    ["enquiryForm", "Get a Quote", "Tell Tausif about your business and he will reply directly with tailored rates and hardware options."],
    ["footer", "Ready to upgrade your card payments?", `${DISCLOSURE} ${FCA}`],
  ];
  for (const [key, h, s] of headings) {
    await q(
      `INSERT INTO section_headings(section_key,heading,subheading) VALUES ($1,$2,$3)
       ON CONFLICT (section_key) DO UPDATE SET heading=EXCLUDED.heading, subheading=EXCLUDED.subheading, updated_at=now()`,
      [key, h, s]
    );
  }

  for (const m of ["blog", "gallery", "reviews", "team", "certifications", "map", "visionMission", "history"]) {
    await q(
      `INSERT INTO module_settings(module_name,enabled) VALUES ($1,false)
       ON CONFLICT (module_name) DO UPDATE SET enabled=false, updated_at=now()`,
      [m]
    );
  }

  const legal = {
    "privacy-policy": ["Privacy Policy", `DRAFT — review before publishing. TC Business Payments Consultant (Tausif Chowdhury, a self-employed Payments Consultant working on behalf of Dojo) collects the name, phone, email and message you submit through the enquiry form solely to respond to your enquiry. Anonymous visit analytics are collected only if you accept cookies. To ask about your data, email tausif.chowdhury@dojo.tech.`],
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
