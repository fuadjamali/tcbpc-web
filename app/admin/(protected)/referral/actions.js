"use server";

import { revalidatePath } from "next/cache";
import { updateReferralBanner } from "@/lib/referral";

export async function updateReferralBannerAction(formData) {
  const read = (key) => formData.get(key)?.toString().trim() || "";
  await updateReferralBanner({
    enabled: formData.get("enabled") === "on",
    eyebrow: read("eyebrow"),
    heading: read("heading"),
    body: read("body"),
    ctaLabel: read("ctaLabel"),
    ctaTopic: read("ctaTopic"),
    tiers: read("tiers"),
  });

  // Revalidate immediately rather than waiting for the home page's ISR window.
  revalidatePath("/");
  revalidatePath("/admin/referral");
}
