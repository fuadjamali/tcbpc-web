"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_KEY, getConsent } from "@/lib/consent";

export default function CookieConsent({ message, acceptLabel, declineLabel, privacyHref }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  function respond(value) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    if (value === "accepted") {
      window.dispatchEvent(new Event(CONSENT_EVENT));
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-sm md:bottom-6 md:left-6 md:right-auto rounded-xl border border-border bg-surface p-4 shadow-lg">
      <p className="text-sm text-foreground">
        {message}
        {privacyHref && (
          <>
            {" "}
            <a href={privacyHref} className="font-semibold underline">
              Privacy policy
            </a>
          </>
        )}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => respond("declined")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-alt"
        >
          {declineLabel}
        </button>
        <button
          type="button"
          onClick={() => respond("accepted")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  );
}
