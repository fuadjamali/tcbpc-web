"use client";

import { useEffect } from "react";

export const QUOTE_TOPIC_EVENT = "quote-topic";

// Mount once on the home page. Any link carrying `data-quote-topic="..."` (the product, referral
// and hero buttons) keeps its normal `#enquiry` scroll, and on click also announces the topic so
// the enquiry form (components/EnquiryForm.js) can pre-fill its message — no page reload, and the
// topic text itself comes from admin-edited data, never hard-coded here.
export default function QuotePrefill() {
  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest?.("[data-quote-topic]");
      if (!link) return;
      const topic = link.getAttribute("data-quote-topic");
      if (!topic) return;
      window.__quoteTopic = topic;
      window.dispatchEvent(new CustomEvent(QUOTE_TOPIC_EVENT, { detail: topic }));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
