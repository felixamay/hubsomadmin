"use server";

import { auth } from "@/auth";
import { adminStore } from "@/infrastructure/persistence/store";
import { revalidatePath } from "next/cache";
import type { CustomerUser, Driver, Order, Payout, Seller, SupportTicket } from "@/domain/entities";

async function actor() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return { id: session.user.id, name: session.user.name };
}

export async function updateUserAction(id: string, patch: Partial<CustomerUser>) {
  const a = await actor();
  adminStore.updateUser(id, patch, a);
  revalidatePath("/users");
}

export async function updateSellerAction(id: string, patch: Partial<Seller>) {
  const a = await actor();
  adminStore.updateSeller(id, patch, a);
  revalidatePath("/sellers");
  revalidatePath("/");
}

export async function updateDriverAction(id: string, patch: Partial<Driver>) {
  const a = await actor();
  adminStore.updateDriver(id, patch, a);
  revalidatePath("/drivers");
  revalidatePath("/verification");
  revalidatePath("/");
}

export async function reviewDocumentAction(
  driverId: string,
  docId: string,
  status: Driver["documents"][number]["status"],
  notes?: string,
) {
  const a = await actor();
  adminStore.updateDriverDocument(driverId, docId, status, notes, a);
  revalidatePath("/verification");
  revalidatePath("/drivers");
}

export async function updateOrderAction(id: string, patch: Partial<Order>) {
  const a = await actor();
  adminStore.updateOrder(id, patch, a);
  revalidatePath("/orders");
  revalidatePath("/");
}

export async function updatePayoutAction(id: string, patch: Partial<Payout>) {
  const a = await actor();
  adminStore.updatePayout(id, patch, a);
  revalidatePath("/payouts");
  revalidatePath("/");
}

export async function updateTicketAction(id: string, patch: Partial<SupportTicket>) {
  const a = await actor();
  adminStore.updateTicket(id, patch, a);
  revalidatePath("/support");
  revalidatePath("/");
}

export async function updateStreamAction(id: string, patch: Parameters<typeof adminStore.updateStream>[1]) {
  const a = await actor();
  adminStore.updateStream(id, patch, a);
  revalidatePath("/streams");
  revalidatePath("/");
}

export async function updateAuctionAction(id: string, patch: Parameters<typeof adminStore.updateAuction>[1]) {
  const a = await actor();
  adminStore.updateAuction(id, patch, a);
  revalidatePath("/auctions");
}

export async function updateProductAction(id: string, patch: Parameters<typeof adminStore.updateProduct>[1]) {
  const a = await actor();
  adminStore.updateProduct(id, patch, a);
  revalidatePath("/products");
}

export async function updateDeliveryAction(id: string, patch: Parameters<typeof adminStore.updateDelivery>[1]) {
  const a = await actor();
  adminStore.updateDelivery(id, patch, a);
  revalidatePath("/deliveries");
  revalidatePath("/map");
}

export async function updatePaymentAction(id: string, patch: Parameters<typeof adminStore.updatePayment>[1]) {
  const a = await actor();
  adminStore.updatePayment(id, patch, a);
  revalidatePath("/payments");
}

export async function updateReviewAction(id: string, patch: Parameters<typeof adminStore.updateReview>[1]) {
  await actor();
  adminStore.updateReview(id, patch);
  revalidatePath("/reviews");
}

export async function updateReportAction(id: string, status: "open" | "resolved" | "dismissed") {
  await actor();
  adminStore.updateReport(id, status);
  revalidatePath("/moderation");
}

export async function updateFraudAction(id: string, patch: Parameters<typeof adminStore.updateFraudCase>[1]) {
  await actor();
  adminStore.updateFraudCase(id, patch);
  revalidatePath("/fraud");
}

export async function updateSettingsAction(patch: Parameters<typeof adminStore.updateSettings>[0]) {
  const a = await actor();
  adminStore.updateSettings(patch, a);
  revalidatePath("/settings");
}

export async function updateCategoryAction(id: string, patch: Parameters<typeof adminStore.updateCategory>[1]) {
  await actor();
  adminStore.updateCategory(id, patch);
  revalidatePath("/categories");
}

export async function addCategoryAction(input: { name: string; slug: string; description: string }) {
  await actor();
  const cats = adminStore.getCategories();
  adminStore.addCategory({
    id: `cat_${Date.now()}`,
    slug: input.slug,
    name: input.name,
    description: input.description,
    visible: true,
    featured: false,
    sortOrder: cats.length + 1,
    productCount: 0,
  });
  revalidatePath("/categories");
}

export async function deleteCategoryAction(id: string) {
  await actor();
  adminStore.deleteCategory(id);
  revalidatePath("/categories");
}

export async function addPromotionAction(input: {
  name: string;
  type: Parameters<typeof adminStore.addPromotion>[0]["type"];
  code?: string;
  discountPct?: number;
  audience: string;
}) {
  await actor();
  const now = new Date();
  const ends = new Date();
  ends.setDate(ends.getDate() + 30);
  adminStore.addPromotion({
    id: `promo_${Date.now()}`,
    name: input.name,
    type: input.type,
    code: input.code,
    discountPct: input.discountPct,
    active: true,
    startsAt: now.toISOString(),
    endsAt: ends.toISOString(),
    usageCount: 0,
    audience: input.audience,
    createdAt: now.toISOString(),
  });
  revalidatePath("/promotions");
}

export async function togglePromotionAction(id: string, active: boolean) {
  await actor();
  adminStore.updatePromotion(id, { active });
  revalidatePath("/promotions");
}

export async function sendNotificationAction(input: {
  title: string;
  body: string;
  channel: Parameters<typeof adminStore.addNotification>[0]["channel"];
  audience: Parameters<typeof adminStore.addNotification>[0]["audience"];
}) {
  const a = await actor();
  adminStore.addNotification({
    id: `notif_${Date.now()}`,
    title: input.title,
    body: input.body,
    channel: input.channel,
    audience: input.audience,
    status: "sent",
    sentAt: new Date().toISOString(),
    createdBy: a.id,
    createdAt: new Date().toISOString(),
  });
  revalidatePath("/notifications");
}

export async function revokeSessionAction(id: string) {
  await actor();
  adminStore.revokeSession(id);
  revalidatePath("/security");
}
