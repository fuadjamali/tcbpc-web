import { IconMail, IconPhone } from "@tabler/icons-react";
import { HOW_IT_WORKS_ICONS } from "@/lib/howItWorksIcons";
import { monogram } from "@/lib/brand";

// "Label: explanation" paragraphs (the About body's typical shape) get the label in bold.
function Paragraph({ text }) {
  const match = text.match(/^([^:.]{3,60}):\s+([\s\S]+)$/);
  return (
    <p>
      {match ? (
        <>
          <strong className="font-semibold text-foreground">{match[1]}:</strong> {match[2]}
        </>
      ) : (
        text
      )}
    </p>
  );
}

// About card (left) + numbered process steps (right) in one two-column section, as in the
// card-style design. About Us data: lib/aboutInfo.js (/admin/about); steps: lib/howItWorks.js
// (/admin/how-it-works) with its heading from Section Text; phone/email: Contact Us. Either side
// can be absent: with no About the steps stand alone, with no steps the card is centred.
export default function AboutProcess({
  about,
  steps,
  stepsHeading,
  contact,
  businessName,
  sectionMaxW,
  style,
}) {
  const paragraphs = (about?.body || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <section id="about" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8" style={style}>
      <div id="how-it-works" />
      <div
        className={`mx-auto ${sectionMaxW} grid grid-cols-1 items-start gap-12 ${
          about && steps.length > 0 ? "lg:grid-cols-12" : ""
        }`}
      >
        {about && (
          <div
            className={`rounded-3xl border border-foreground/10 bg-surface p-7 shadow-md sm:p-9 ${
              steps.length > 0 ? "lg:col-span-5" : "mx-auto w-full max-w-3xl"
            }`}
          >
            <div className="mb-6 flex items-center gap-4">
              {about.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.image}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-2xl font-extrabold text-brand-teal">
                  {monogram(businessName)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">{about.heading}</h2>
                {about.subtitle && (
                  <p className="mt-0.5 text-xs font-bold text-primary">{about.subtitle}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              {paragraphs.map((text, i) => (
                <Paragraph key={i} text={text} />
              ))}
            </div>

            {(contact?.phone || contact?.email) && (
              <div className="mt-6 flex flex-col gap-2.5 border-t border-foreground/10 pt-6 text-sm">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-bold text-primary hover:underline"
                  >
                    <IconPhone size={16} />
                    <span>Direct Mobile / WhatsApp:</span>
                    <span className="whitespace-nowrap">{contact.phone}</span>
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-bold text-primary hover:underline"
                  >
                    <IconMail size={16} />
                    <span>Direct Email:</span>
                    <span className="whitespace-nowrap">{contact.email}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {steps.length > 0 && (
          <div className={`space-y-6 ${about ? "lg:col-span-7" : ""}`}>
            <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{stepsHeading}</h3>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = HOW_IT_WORKS_ICONS[step.icon]?.Icon;
                return (
                  <div
                    key={step.id}
                    className="flex items-start gap-5 rounded-3xl border border-foreground/10 bg-surface p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-teal text-lg font-extrabold text-brand-ink">
                      {StepIcon ? <StepIcon size={22} stroke={1.75} /> : index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-foreground">{step.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
