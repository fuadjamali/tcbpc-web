// Seeds the "TC Business Payments Consultant" site content into the database that DATABASE_URL
// points at: business info, root alert, nav, the split hero, stats, partners, how-it-works,
// products (Dojo Go Max flagship) + photos, portfolio case studies, about card, contact, WhatsApp,
// referral banner, section headings, footer/regulatory text, switched-off modules, and
// a published privacy policy and an unpublished terms draft.
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
      `I’m Tausif Chowdhury, a self-employed Payments Consultant working on behalf of Dojo. Free rate review, fair setup and 1-to-1 local support.`,
      "Get a Free Rate Review & Quote",
      "#enquiry",
      "07394 995 810",
      "tel:07394995810",
      "One dedicated contact\nFree rate review\nNext-day payouts",
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
    ["Free statement review", "Send a recent statement — I explain your rates and hidden fees in plain English."],
    ["Tailored proposal", "A transparent quote for your turnover — Go Max, Go or EPOS."],
    ["Fast, supported activation", "Pre-configured machine, first payment live with me, then ongoing 1-to-1 support."],
  ];
  for (const [i, [t, d]] of steps.entries()) {
    await q(`INSERT INTO how_it_works_steps(title,description,display_order) VALUES ($1,$2,$3)`, [t, d, i + 1]);
  }

  await q(`DELETE FROM product_photos`);
  await q(`DELETE FROM products`);
  const products = [
    {
      id: 2, order: 1, category: "Flagship", price: "Flagship · Free statement audit", flagship: true,
      name: "Dojo Go Max",
      desc: "Built for busy counters — fast checkouts, extra terminals as you grow, and multi-device deals.",
      badges: "Flagship Solution\nMulti-device deals",
      features: "High volume | Built for busy counters.\nMulti-terminal | Add terminals as you grow.\nDevice deals | One quote for every till.\nNext-day payouts | 7 days a week, <2s payments.",
      serviceLabel: "Included",
      serviceText: "Free statement audit + 1-to-1 setup",
      ctaLabel: "Get a Go Max quote",
      ctaTopic: "Dojo Go Max flagship card machine",
      icon: "store",
      // Cut-outs built from Dojo's official high-resolution Dojo Go Max images (sources kept in
      // docs/refdocs/Dojo Go max/official/). The hero stage and flagship preview float these out
      // over the card; see components/ProductStage.js.
      photos: [
        ["cutout/dojo-go-max-white", "1:1", "White", "Dojo Go Max — Calm White finish."],
        ["cutout/dojo-go-max-black-keypad", "1:1", "Black", "Dojo Go Max — Confident Black finish, keypad view."],
        ["cutout/dojo-go-max-black-front", "1:1", "Black front", "Front view — Confident Black."],
        ["cutout/dojo-go-max-white-front", "1:1", "White front", "Front view — Calm White."],
      ],
    },
    {
      id: 1, order: 2, category: "Portable", price: "Free statement audit",
      name: "Dojo Go",
      desc: "Contactless in under 2 seconds, with 4G + Wi-Fi and a built-in printer.",
      ctaLabel: "Get a Go quote", ctaTopic: "Dojo Go card machine", icon: "card",
      photos: [
        ["dojo-go-white-tip", "5:4", null, null],
        ["dojo-go-white-keypad", "5:4", null, null],
        ["dojo-go-black-approved", "5:4", null, null],
        ["dojo-go-side-profile", "5:4", null, null],
      ],
    },
    {
      id: 3, order: 3, category: "Compact", price: "Get a quote",
      name: "Dojo Pocket",
      desc: "143 g handheld with 4G + Wi-Fi and an 8-hour battery.",
      ctaLabel: "Get a Pocket quote", ctaTopic: "Dojo Pocket", icon: "handheld",
      photos: [["dojo-pocket-1", "1:1", null, null], ["dojo-pocket-2", "1:1", null, null]],
    },
    {
      id: 4, order: 4, category: "450+ systems", price: "Check compatibility",
      name: "EPOS integration",
      desc: "Totals go straight from your till — no manual keying.",
      ctaLabel: "Check EPOS compatibility", ctaTopic: "EPOS integrated setup", icon: "plug",
      photos: [],
    },
    {
      id: 5, order: 5, category: "Remote payments", price: "Get a quote",
      name: "Pay links & virtual terminal",
      desc: "Take card payments by phone, SMS or email link.",
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
    ["My Mobile Tech", "Live Activation", "Tech & Mobile Retail", "Multi-terminal Dojo Go", "Added a second terminal for growing footfall.", "Accepting payments", null],
    ["Independent Retail Boutique", "Deal Signed", "Fashion Retail", "Dojo Go Max", "Faster weekend checkouts, under 2 seconds.", "Faster queues", null],
    ["AN Car Sales Ltd", "Add-On Secured", "Car Dealership", "Dojo Go Max add-on", "Showroom payments and instant deposits.", "Reliable deposits", null],
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
      `Years of hands-on UK payments experience. I listen first, recommend second — and audit what you pay today to find real savings.

One dedicated contact: no call centres, just honest advice and hands-on support.`,
    ]
  );

  // The Contact Us *section* stays off — its details are shown in the top bar, About card and
  // footer instead — but the row's phone/email/heading still feed those.
  await q(
    `UPDATE contact_info SET heading=$1, subheading=$2, address=NULL, phone=$3, email=$4, enabled=false, updated_at=now() WHERE id=1`,
    ["Direct Consultant Contact", "Supporting UK businesses nationwide.", "07394 995 810", "tausif.chowdhury@dojo.tech"]
  );

  await q(
    `UPDATE referral_banner SET enabled=true, eyebrow=$1, heading=$2, body=$3, cta_label=$4, cta_topic=$5, tiers=$6, updated_at=now() WHERE id=1`,
    [
      "Refer a Friend to Dojo",
      "Refer a business, earn up to **£100**.",
      "Know a business that wants better card payments? Earn cash when they go live.",
      "Refer a business →",
      "Business Referral Submission",
      "£50 | first referral\n£75 | second referral\n£100 | every one after",
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
    `UPDATE social_settings SET whatsapp_number='447394995810', whatsapp_group_url=NULL, whatsapp_message=$1, footer_whatsapp_message=$1,
       x_enabled=false, facebook_enabled=false, instagram_enabled=false, tiktok_enabled=false,
       linkedin_enabled=false, youtube_enabled=false, updated_at=now() WHERE id=1`,
    [WA_MESSAGE]
  );

  const headings = [
    ["howItWorks", "Switch to Dojo in 3 steps", "From first call to first payment.", "How It Works"],
    ["products", "Dojo card machines & setups for UK businesses", "The right hardware and rates for how you trade.", "Products & Services"],
    ["portfolio", "Recent Merchant Activations", "UK businesses Tausif has helped switch and grow.", "Proven UK Track Record"],
    ["partners", "All major cards & digital wallets accepted", null, null],
    ["newsEvents", "Refer a Friend", "Earn up to £100 for sharing Dojo with a fellow business.", null],
    ["enquiryForm", "Get a Quote", "Tausif replies directly with tailored rates and hardware options.", "No-Obligation Consultation"],
    ["footer", "Ready to upgrade your card payments?", null, null],
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
    "privacy-policy": ["Privacy Policy", `Who we are
TC Business Payments Consultant is the website of Tausif Chowdhury, a self-employed Payments Consultant working on behalf of Dojo. Tausif is responsible for the personal data collected through this site.

What we collect
When you send an enquiry we collect the name, phone number, email address, business name and message you enter. If you accept cookies we also collect anonymous visit statistics (pages viewed and general location). We do not collect payment card details on this site.

Why we use it
We use your enquiry details only to reply to you and to prepare the rates and hardware options you asked about. We use the visit statistics to understand how the site is used. We do not sell your data.

Who sees it
Your enquiry is seen by Tausif. Where you go on to apply for a Dojo service, your details are handled under Dojo's own terms and privacy notice (Dojo is a trading name of Paymentsense Limited).

Your rights
Under UK data protection law you can ask to see, correct or delete the personal data we hold about you, or object to how we use it. You can also complain to the Information Commissioner's Office (ico.org.uk).

Contact
To ask about your data, email tausif.chowdhury@dojo.tech or call 07394 995 810.`],    "terms-of-service": ["Terms of Service", `DRAFT — review before publishing. This website is operated by Tausif Chowdhury, a self-employed Payments Consultant working on behalf of Dojo. Information here is general and not a binding offer; rates and hardware are confirmed in your written Dojo proposal. Dojo is a trading name of Paymentsense Limited, authorised and regulated by the FCA (FRN 738728 and FRN 900925).`],
  };
  for (const [slug, [title, body]] of Object.entries(legal)) {
    // The privacy policy is published; the terms stay an unpublished draft until reviewed.
    await q(`UPDATE legal_pages SET title=$2, body=$3, enabled=$4, updated_at=now() WHERE slug=$1`, [slug, title, body, slug === "privacy-policy"]);
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
