// Closing call-to-action band — shared by the home page's Plans area and /compare-plans.
// WhatsApp/phone buttons only render when set in admin (Social / Contact), so nothing here is
// hard-coded. `className` lets each page set its own spacing/order; `style` carries the home
// page's flex `order`.
export default function PlansCta({ bookHref, whatsappHref, phone, className = "", style }) {
  return (
    <section
      className={`bg-gradient-to-br from-foreground to-primary py-14 text-center text-primary-foreground ${className}`}
      style={style}
    >
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          Not sure which plan fits?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-primary-foreground/85">
          Book a free walkthrough. Click through the real product — not a slide deck — and we&apos;ll
          point you to the right one.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={bookHref}
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0c2d48] hover:bg-white/90"
          >
            Book a free walkthrough
          </a>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-[1.5px] border-white/50 px-7 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Chat on WhatsApp
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="rounded-full border-[1.5px] border-white/50 px-7 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Call {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
