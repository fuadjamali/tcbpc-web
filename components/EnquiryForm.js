"use client";

import { useEffect, useState } from "react";
import { QUOTE_TOPIC_EVENT } from "@/components/QuotePrefill";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-foreground/20 bg-surface px-4 py-3.5 text-sm text-foreground placeholder-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent";
const labelClass = "block text-sm font-bold text-foreground";

function topicMessage(topic) {
  return `Hi, I'm interested in learning more about: ${topic}. Please get in touch for a quote/review.`;
}

// The home page's quote/enquiry form (POST /api/enquiries, read at /admin/enquiries). Name,
// phone, email and message are required; business name is optional. A click on any
// `data-quote-topic` button elsewhere on the page (see QuotePrefill.js) pre-fills the message.
export default function EnquiryForm() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    function onTopic(e) {
      setMessage(topicMessage(e.detail));
    }
    window.addEventListener(QUOTE_TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(QUOTE_TOPIC_EVENT, onTopic);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    const form = e.target;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      businessName: form.businessName.value,
      message,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage("");
      window.__quoteTopic = undefined;
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 rounded-2xl border border-brand-teal bg-brand-deep p-6 text-center text-white">
        <p className="font-bold text-brand-teal">Thank you — your enquiry has been sent.</p>
        <p className="mt-1 text-sm text-white/90">We&apos;ll get back to you directly.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-brand-teal underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className={labelClass}>
          Name <span className="text-red-600">*</span>
        </label>
        <input type="text" name="name" required placeholder="Your name" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>
          Phone <span className="text-red-600">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="Your phone number"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Business Name</label>
        <input
          type="text"
          name="businessName"
          placeholder="Your business name (optional)"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your business and what you need..."
          className={fieldClass}
        />
      </div>

      {status === "error" && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
          Something went wrong — please try again.
        </p>
      )}

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full min-w-[220px] rounded-full bg-brand-teal px-8 py-4 text-base font-extrabold text-brand-ink shadow-lg shadow-brand-teal/25 transition hover:bg-brand-teal-hover active:scale-95 disabled:opacity-50 sm:w-auto"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
