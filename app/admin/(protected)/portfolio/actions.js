"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getPortfolioItem,
} from "@/lib/portfolio";
import { uploadImage, deleteImage } from "@/lib/blob";
import { normalizeWebsiteUrl } from "@/lib/websiteUrl";
import { checkEmbeddable } from "@/lib/websiteLink";

// The form already blocks an invalid link in the browser (components/PortfolioDisplayFields.js),
// so an invalid one here means a hand-crafted request — drop the link rather than store it.
// When the live-preview switch is on, the site's headers are checked once now (not on every
// page view) and the result saved, so the public page knows whether embedding will work.
async function readForm(formData) {
  const { url } = normalizeWebsiteUrl(formData.get("websiteUrl"));
  const websiteUrl = url || "";
  const livePreview = Boolean(websiteUrl) && formData.get("livePreview") === "on";
  return {
    name: formData.get("name")?.toString().trim() || "",
    description: formData.get("description")?.toString().trim() || "",
    displayOrder: parseInt(formData.get("displayOrder"), 10) || 0,
    badge: formData.get("badge")?.toString().trim() || "",
    sector: formData.get("sector")?.toString().trim() || "",
    solution: formData.get("solution")?.toString().trim() || "",
    benefit: formData.get("benefit")?.toString().trim() || "",
    statusText: formData.get("statusText")?.toString().trim() || "",
    websiteUrl,
    imageSize: formData.get("imageSize")?.toString() || "",
    livePreview,
    previewEmbeddable: livePreview ? await checkEmbeddable(websiteUrl) : null,
  };
}

export async function createPortfolioItemAction(formData) {
  const data = await readForm(formData);

  // Image is optional now — a case-study card (sector/solution/benefit) needs no photo.
  data.image = (await uploadImage(formData.get("imageFile"), "portfolio")) || null;
  if (!data.image && !data.name) return;

  await createPortfolioItem(data);

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItemAction(id, formData) {
  const data = await readForm(formData);

  const existing = await getPortfolioItem(id);
  const uploaded = await uploadImage(formData.get("imageFile"), "portfolio");
  if (uploaded) {
    await deleteImage(existing?.image);
    data.image = uploaded;
  } else {
    data.image = existing?.image;
  }
  if (!data.image && !data.name) return;

  await updatePortfolioItem(id, data);

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItemAction(formData) {
  const id = formData.get("id");
  if (!id) return;

  const existing = await getPortfolioItem(id);
  await deleteImage(existing?.image);
  await deletePortfolioItem(id);

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}
