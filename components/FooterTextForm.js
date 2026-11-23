"use client";

import { useActionState } from "react";
import { updateFooterTextAction } from "@/app/admin/(protected)/site-text/actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none";

export default function FooterTextForm({ values }) {
  const [state, formAction, pending] = useActionState(updateFooterTextAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Regulatory statement</label>
        <textarea
          name="regulatoryText"
          rows={4}
          defaultValue={values.regulatory_text || ""}
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-muted">Shown in the footer. Leave blank to hide it.</p>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Payment methods — label</label>
        <input
          type="text"
          name="paymentsLabel"
          defaultValue={values.payments_label || ""}
          placeholder="All major cards & digital wallets accepted:"
          className={fieldClass}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Payment methods (one per line)</label>
        <textarea
          name="paymentMethods"
          rows={4}
          defaultValue={values.payment_methods || ""}
          placeholder={"Mastercard\nVISA\nApple Pay"}
          className={fieldClass}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {state?.success && <p className="text-xs text-green-600 dark:text-green-400">{state.success}</p>}
      </div>
    </form>
  );
}
