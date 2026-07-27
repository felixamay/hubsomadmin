import bcrypt from "bcryptjs";
import type {
  AdminUser,
  Auction,
  Category,
  ContentReport,
  CustomerUser,
  DashboardStats,
  Delivery,
  Driver,
  FraudCase,
  LiveStream,
  LoginHistoryEntry,
  NotificationCampaign,
  Order,
  Payment,
  Payout,
  PlatformSettings,
  Product,
  Promotion,
  Review,
  Seller,
  SupportTicket,
  WalletAdjustment,
  AdminSession,
  AuditLogEntry,
} from "@/domain/entities";
import { ROLE_PERMISSIONS } from "@/domain/permissions";
import { daysAgoIso, nowIso, uid } from "@/lib/utils";

/** Fixed MFA secret for demo admin — document in README. */
export const DEMO_MFA_SECRET = "JBSWY3DPEHPK3PXP";

const ACCRA = { latitude: 5.6037, longitude: -0.187 };
const KUMASI = { latitude: 6.6885, longitude: -1.6244 };
const TEMA = { latitude: 5.6698, longitude: -0.0166 };

function hash(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function createSeedDatabase() {
  const createdAt = daysAgoIso(90);
  const updatedAt = nowIso();

  const admins: AdminUser[] = [
    {
      id: "admin_super",
      email: "admin@hubsom.com",
      name: "Felix Amesimeku",
      passwordHash: hash("HubsomAdmin2026!"),
      role: "super_admin",
      mfaEnabled: true,
      mfaSecret: DEMO_MFA_SECRET,
      permissions: [...ROLE_PERMISSIONS.super_admin],
      status: "active",
      lastLoginAt: daysAgoIso(0),
      createdAt,
      updatedAt,
    },
    {
      id: "admin_finance",
      email: "finance@hubsom.com",
      name: "Ama Mensah",
      passwordHash: hash("FinanceAdmin2026!"),
      role: "finance_admin",
      mfaEnabled: true,
      mfaSecret: DEMO_MFA_SECRET,
      permissions: [...ROLE_PERMISSIONS.finance_admin],
      status: "active",
      createdAt,
      updatedAt,
    },
    {
      id: "admin_support",
      email: "support@hubsom.com",
      name: "Kwame Boateng",
      passwordHash: hash("SupportAdmin2026!"),
      role: "support_admin",
      mfaEnabled: false,
      permissions: [...ROLE_PERMISSIONS.support_admin],
      status: "active",
      createdAt,
      updatedAt,
    },
    {
      id: "admin_mod",
      email: "moderation@hubsom.com",
      name: "Efua Adjei",
      passwordHash: hash("ModAdmin2026!"),
      role: "moderation_admin",
      mfaEnabled: true,
      mfaSecret: DEMO_MFA_SECRET,
      permissions: [...ROLE_PERMISSIONS.moderation_admin],
      status: "active",
      createdAt,
      updatedAt,
    },
    {
      id: "admin_ops",
      email: "operations@hubsom.com",
      name: "Yaw Owusu",
      passwordHash: hash("OpsAdmin2026!"),
      role: "operations_admin",
      mfaEnabled: true,
      mfaSecret: DEMO_MFA_SECRET,
      permissions: [...ROLE_PERMISSIONS.operations_admin],
      status: "active",
      createdAt,
      updatedAt,
    },
  ];

  const users: CustomerUser[] = Array.from({ length: 28 }).map((_, i) => {
    const cities = ["Accra", "Kumasi", "Tema", "Takoradi", "Tamale", "Cape Coast"];
    const city = cities[i % cities.length];
    const statusPool = ["active", "active", "active", "active", "suspended", "banned"] as const;
    return {
      id: `user_${i + 1}`,
      email: `user${i + 1}@example.com`,
      name: ["Ama", "Kofi", "Abena", "Kojo", "Akosua", "Fiifi", "Adwoa", "Kwesi"][i % 8] + ` ${["Mensah", "Asante", "Osei", "Boateng", "Addo"][i % 5]}`,
      phone: `+23320${String(1000000 + i).slice(0, 7)}`,
      city,
      region: city === "Kumasi" ? "Ashanti" : city === "Tamale" ? "Northern" : "Greater Accra",
      role: i % 7 === 0 ? "both" : i % 5 === 0 ? "seller" : "buyer",
      sellerId: i % 5 === 0 || i % 7 === 0 ? `seller_${(i % 12) + 1}` : undefined,
      status: statusPool[i % statusPool.length],
      emailVerified: i % 4 !== 0,
      orderCount: Math.floor(Math.random() * 40),
      totalSpentGhs: Math.round(Math.random() * 8000 * 100) / 100,
      createdAt: daysAgoIso(80 - i),
      updatedAt,
      lastActiveAt: daysAgoIso(i % 10),
    };
  });

  const sellers: Seller[] = Array.from({ length: 12 }).map((_, i) => {
    const statusPool = ["approved", "approved", "pending", "approved", "suspended", "rejected"] as const;
    const status = statusPool[i % statusPool.length];
    return {
      id: `seller_${i + 1}`,
      slug: `store-${i + 1}`,
      name: ["Accra Glow", "Kumasi Crafts", "Tema Tech", "Coastal Fashion", "Northern Spice", "Ga Home", "Ashanti Gold", "Volta Fresh", "Live Market GH", "Flash Deals Accra", "Handmade Accra", "Gadget Hub GH"][i],
      ownerUserId: `user_${(i % 28) + 1}`,
      ownerName: users[i % users.length].name,
      ownerEmail: users[i % users.length].email,
      city: ["Accra", "Kumasi", "Tema", "Cape Coast", "Tamale", "Accra"][i % 6],
      region: ["Greater Accra", "Ashanti", "Greater Accra", "Central", "Northern", "Greater Accra"][i % 6],
      bio: "Trusted Hubsom seller serving Ghana.",
      avatar: `/brand/avatar-${(i % 4) + 1}.svg`,
      cover: `/brand/cover.svg`,
      rating: 3.5 + (i % 15) / 10,
      followers: 120 + i * 87,
      verified: status === "approved" && i % 3 !== 0,
      status,
      categories: [["fashion", "shoes"], ["electronics", "phones-accessories"], ["groceries", "home-kitchen"], ["beauty-personal-care"], ["handmade-crafts"], ["gaming"]][i % 6],
      productCount: 8 + i * 3,
      revenueGhs: 1200 + i * 940,
      pendingBalanceGhs: status === "approved" ? 180 + i * 65 : 0,
      reviewCount: 10 + i * 4,
      createdAt: daysAgoIso(70 - i * 2),
      updatedAt,
      rejectionReason: status === "rejected" ? "Incomplete business documents" : undefined,
    };
  });

  const drivers: Driver[] = Array.from({ length: 14 }).map((_, i) => {
    const vStatus = (["approved", "approved", "pending", "approved", "more_docs_required", "rejected", "suspended", "banned"] as const)[i % 8];
    const dStatus = vStatus === "approved"
      ? (["online", "on_delivery", "offline", "busy"] as const)[i % 4]
      : "offline";
    const locBase = i % 3 === 0 ? ACCRA : i % 3 === 1 ? KUMASI : TEMA;
    return {
      id: `driver_${i + 1}`,
      fullName: ["Kwaku Rider", "Ama Courier", "Yaw Express", "Abena Dash", "Kofi Swift", "Efua Move", "Kojo Hub", "Adwoa Go", "Fiifi Fast", "Akua Road", "Nana Bike", "Serwa Delivery", "Papa Cart", "Maame Run"][i],
      email: `driver${i + 1}@huber.gh`,
      phone: `+23324${String(2000000 + i).slice(0, 7)}`,
      photoUrl: `/brand/driver.svg`,
      city: ["Accra", "Kumasi", "Tema", "Accra"][i % 4],
      region: i % 4 === 1 ? "Ashanti" : "Greater Accra",
      vehicleType: (["motorcycle", "motorcycle", "car", "van", "bicycle", "pickup_truck"] as const)[i % 6],
      vehiclePlate: `GR-${1000 + i}-X`,
      vehicleMake: ["Honda", "Toyota", "Yamaha", "Suzuki"][i % 4],
      vehicleModel: ["CG125", "Corolla", "YZF", "Carry"][i % 4],
      verificationStatus: vStatus,
      status: dStatus,
      rating: 3.8 + (i % 12) / 10,
      totalReviews: 20 + i * 5,
      acceptanceRate: 70 + (i % 25),
      completionRate: 75 + (i % 20),
      walletBalanceGhs: vStatus === "approved" ? 320 + i * 45 : 0,
      pendingPayoutGhs: vStatus === "approved" ? 80 + i * 12 : 0,
      lifetimeEarningsGhs: 900 + i * 210,
      tipsGhs: 40 + i * 8,
      bonusesGhs: 20 + i * 5,
      currentLocation: vStatus === "approved" ? {
        latitude: locBase.latitude + (i * 0.008),
        longitude: locBase.longitude + (i * 0.006),
        address: `${["Osu", "Adum", "Community 1", "East Legon"][i % 4]}, Ghana`,
        source: "gps",
        capturedAt: nowIso(),
      } : undefined,
      documents: [
        {
          id: `doc_${i}_id`,
          driverId: `driver_${i + 1}`,
          type: "ghana_card",
          storageUrl: "/brand/doc-id.svg",
          uploadedAt: daysAgoIso(20 - (i % 10)),
          status: vStatus === "approved" ? "approved" : vStatus === "rejected" ? "rejected" : "pending",
        },
        {
          id: `doc_${i}_license`,
          driverId: `driver_${i + 1}`,
          type: "drivers_license",
          storageUrl: "/brand/doc-license.svg",
          uploadedAt: daysAgoIso(19 - (i % 10)),
          status: vStatus === "approved" ? "approved" : "pending",
        },
        {
          id: `doc_${i}_vehicle`,
          driverId: `driver_${i + 1}`,
          type: "vehicle_registration",
          storageUrl: "/brand/doc-vehicle.svg",
          uploadedAt: daysAgoIso(18 - (i % 10)),
          status: vStatus === "more_docs_required" ? "more_docs_required" : vStatus === "approved" ? "approved" : "pending",
        },
        {
          id: `doc_${i}_ins`,
          driverId: `driver_${i + 1}`,
          type: "insurance",
          storageUrl: "/brand/doc-insurance.svg",
          uploadedAt: daysAgoIso(17 - (i % 10)),
          status: vStatus === "approved" ? "approved" : "pending",
        },
        {
          id: `doc_${i}_photo`,
          driverId: `driver_${i + 1}`,
          type: "vehicle_photo",
          storageUrl: "/brand/doc-vehicle-photo.svg",
          uploadedAt: daysAgoIso(16 - (i % 10)),
          status: vStatus === "approved" ? "approved" : "pending",
        },
        {
          id: `doc_${i}_face`,
          driverId: `driver_${i + 1}`,
          type: "face_scan",
          storageUrl: "/brand/doc-selfie.svg",
          uploadedAt: daysAgoIso(15 - (i % 10)),
          status: vStatus === "approved" ? "approved" : "pending",
        },
      ],
      createdAt: daysAgoIso(60 - i),
      updatedAt,
      canGoOnline: vStatus === "approved",
      verificationNotes: vStatus === "more_docs_required" ? "Please re-upload clearer insurance certificate." : undefined,
    };
  });

  const categories: Category[] = [
    "groceries", "electronics", "fashion", "shoes", "beauty-personal-care",
    "home-kitchen", "phones-accessories", "computers-tablets", "gaming",
    "jewelry-watches", "baby-kids", "sports-outdoors", "handmade-crafts",
    "automotive", "miscellaneous",
  ].map((slug, i) => ({
    id: `cat_${i + 1}`,
    slug,
    name: slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
    description: `${slug} on Hubsom marketplace`,
    visible: i !== 14,
    featured: i < 5,
    sortOrder: i + 1,
    productCount: 12 + i * 4,
  }));

  const products: Product[] = Array.from({ length: 24 }).map((_, i) => {
    const seller = sellers[i % sellers.length];
    const mod = (["approved", "approved", "pending", "flagged", "rejected", "approved"] as const)[i % 6];
    return {
      id: `prod_${i + 1}`,
      slug: `product-${i + 1}`,
      name: ["Ankara Dress", "Bluetooth Earbuds", "Shea Butter Set", "Sneakers Pro", "Phone Case", "Rice 5kg", "LED Lamp", "Football Boots", "Laptop Sleeve", "Gold Bead Set", "Baby Carrier", "Yoga Mat"][i % 12] + ` ${i + 1}`,
      description: "Listed on Hubsom marketplace.",
      category: categories[i % categories.length].slug,
      priceGhs: 45 + i * 18,
      compareAtGhs: 60 + i * 22,
      currency: "GHS",
      images: ["/brand/product.svg"],
      sellerId: seller.id,
      sellerName: seller.name,
      stock: 5 + (i % 40),
      rating: 3.5 + (i % 15) / 10,
      reviewCount: 2 + i,
      tags: ["ghana", "hubsom"],
      moderationStatus: mod,
      featured: i < 4,
      flaggedReason: mod === "flagged" ? "Possible counterfeit branding" : undefined,
      createdAt: daysAgoIso(40 - i),
      updatedAt,
    };
  });

  const orders: Order[] = Array.from({ length: 30 }).map((_, i) => {
    const user = users[i % users.length];
    const seller = sellers[i % sellers.length];
    const subtotal = 80 + i * 35;
    const delivery = 25 + (i % 3) * 10;
    const platform = Math.round(subtotal * 0.08 * 100) / 100;
    const tax = Math.round(subtotal * 0.025 * 100) / 100;
    const status = (["paid", "fulfilled", "pending_payment", "cancelled", "refunded", "disputed", "paid", "fulfilled"] as const)[i % 8];
    const isToday = i < 8;
    return {
      id: `ord_${1000 + i}`,
      currency: "GHS",
      subtotalGhs: subtotal,
      deliveryFeeGhs: delivery,
      platformFeeGhs: platform,
      taxGhs: tax,
      totalGhs: subtotal + delivery + platform + tax,
      status,
      userId: user.id,
      buyerName: user.name,
      buyerEmail: user.email,
      sellerIds: [seller.id],
      lines: [{
        productId: products[i % products.length].id,
        sellerId: seller.id,
        name: products[i % products.length].name,
        quantity: 1 + (i % 3),
        unitPriceGhs: products[i % products.length].priceGhs,
        lineTotalGhs: products[i % products.length].priceGhs * (1 + (i % 3)),
      }],
      shippingCity: user.city ?? "Accra",
      shippingRegion: user.region ?? "Greater Accra",
      paymentMethods: [["Mobile Money"], ["Card"], ["Hubsom Pay"], ["Mobile Money", "Card"]][i % 4],
      streamId: i % 5 === 0 ? `stream_${(i % 6) + 1}` : undefined,
      createdAt: isToday ? daysAgoIso(0) : daysAgoIso(1 + (i % 20)),
      updatedAt,
    };
  });

  const payments: Payment[] = orders.map((o, i) => ({
    id: `pay_${i + 1}`,
    orderId: o.id,
    amountGhs: o.totalGhs,
    currency: "GHS" as const,
    status: (o.status === "pending_payment" ? "pending" : o.status === "refunded" ? "refunded" : o.status === "cancelled" ? "failed" : o.status === "disputed" ? "chargeback" : "captured") as Payment["status"],
    method: o.paymentMethods[0],
    processorFeeGhs: Math.round(o.totalGhs * 0.015 * 100) / 100,
    platformCommissionGhs: o.platformFeeGhs,
    netAmountGhs: Math.round((o.totalGhs - o.platformFeeGhs - o.totalGhs * 0.015) * 100) / 100,
    customerName: o.buyerName,
    createdAt: o.createdAt,
    capturedAt: o.status !== "pending_payment" ? o.createdAt : undefined,
    refundedAt: o.status === "refunded" ? o.updatedAt : undefined,
    chargebackAt: o.status === "disputed" ? o.updatedAt : undefined,
    reference: `HS-${o.id.toUpperCase()}`,
  }));

  const payouts: Payout[] = [
    ...sellers.filter((s) => s.pendingBalanceGhs > 0).slice(0, 8).map((s, i) => ({
      id: `payout_s_${i + 1}`,
      recipientType: "seller" as const,
      recipientId: s.id,
      recipientName: s.name,
      amountGhs: s.pendingBalanceGhs,
      method: (["mtn_momo", "bank_transfer", "telecel_cash"] as const)[i % 3],
      accountDetails: i % 3 === 1 ? "GCB ****4521" : `+23324****${100 + i}`,
      status: (["pending", "approved", "held", "completed", "failed", "processing"] as const)[i % 6],
      createdAt: daysAgoIso(i),
      scheduledAt: daysAgoIso(-1),
      processedAt: i % 6 === 3 ? daysAgoIso(0) : undefined,
      failureReason: i % 6 === 4 ? "Invalid MoMo number" : undefined,
    })),
    ...drivers.filter((d) => d.pendingPayoutGhs > 0).slice(0, 8).map((d, i) => ({
      id: `payout_d_${i + 1}`,
      recipientType: "driver" as const,
      recipientId: d.id,
      recipientName: d.fullName,
      amountGhs: d.pendingPayoutGhs,
      method: (["mtn_momo", "telecel_cash", "airteltigo_money", "bank_transfer"] as const)[i % 4],
      accountDetails: `+23324****${200 + i}`,
      status: (["pending", "approved", "completed", "rejected"] as const)[i % 4],
      createdAt: daysAgoIso(i + 1),
      processedAt: i % 4 === 2 ? daysAgoIso(0) : undefined,
    })),
  ];

  const walletAdjustments: WalletAdjustment[] = [
    {
      id: uid("wadj"),
      ownerType: "driver",
      ownerId: "driver_1",
      ownerName: drivers[0].fullName,
      amountGhs: 50,
      reason: "On-time delivery bonus",
      createdBy: "admin_super",
      createdAt: daysAgoIso(2),
    },
    {
      id: uid("wadj"),
      ownerType: "seller",
      ownerId: "seller_1",
      ownerName: sellers[0].name,
      amountGhs: -25,
      reason: "Chargeback recovery",
      createdBy: "admin_finance",
      createdAt: daysAgoIso(1),
    },
  ];

  const streams: LiveStream[] = Array.from({ length: 8 }).map((_, i) => {
    const seller = sellers[i % sellers.length];
    const status = (["live", "live", "scheduled", "ended", "replay", "live"] as const)[i % 6];
    return {
      id: `stream_${i + 1}`,
      title: `${seller.name} Live Drop #${i + 1}`,
      sellerId: seller.id,
      sellerName: seller.name,
      status,
      viewerCount: status === "live" ? 40 + i * 17 : 0,
      peakViewers: 80 + i * 25,
      latencyMs: 800 + i * 40,
      pinnedProductId: products[i % products.length].id,
      productIds: products.slice(i, i + 3).map((p) => p.id),
      featured: i < 2,
      startedAt: status !== "scheduled" ? daysAgoIso(0) : undefined,
      endedAt: status === "ended" || status === "replay" ? daysAgoIso(0) : undefined,
      cover: "/brand/stream.svg",
      health: status === "live" ? (i === 5 ? "degraded" : "healthy") : "healthy",
    };
  });

  const auctions: Auction[] = Array.from({ length: 10 }).map((_, i) => {
    const product = products[i % products.length];
    return {
      id: `auction_${i + 1}`,
      streamId: i < 6 ? `stream_${(i % 6) + 1}` : undefined,
      productId: product.id,
      productName: product.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      startingBidGhs: 20 + i * 5,
      currentBidGhs: 35 + i * 12,
      minIncrementGhs: 5,
      bidderCount: 3 + i,
      highestBidder: users[i % users.length].name,
      status: (["open", "open", "upcoming", "paused", "closing", "sold", "unsold", "cancelled"] as const)[i % 8],
      featured: i < 3,
      endsAt: daysAgoIso(-1),
      disputeOpen: i === 7,
      createdAt: daysAgoIso(3),
    };
  });

  const deliveries: Delivery[] = Array.from({ length: 16 }).map((_, i) => {
    const driver = drivers.filter((d) => d.verificationStatus === "approved")[i % 6] ?? drivers[0];
    const status = (["delivered", "en_route_to_customer", "picked_up", "offered", "failed", "cancelled", "accepted", "queued"] as const)[i % 8];
    const base = i % 2 === 0 ? ACCRA : TEMA;
    return {
      id: `del_${i + 1}`,
      orderId: orders[i % orders.length].id,
      shipmentId: `shp_${i + 1}`,
      driverId: ["queued", "offered"].includes(status) ? undefined : driver.id,
      driverName: ["queued", "offered"].includes(status) ? undefined : driver.fullName,
      sellerName: sellers[i % sellers.length].name,
      customerName: users[i % users.length].name,
      status,
      feeGhs: 30 + (i % 5) * 10,
      tipGhs: i % 3 === 0 ? 5 : 0,
      pickup: { latitude: base.latitude, longitude: base.longitude, address: "Seller pickup, Ghana" },
      dropoff: { latitude: base.latitude + 0.02, longitude: base.longitude + 0.015, address: "Customer dropoff, Ghana" },
      etaMinutes: status.includes("en_route") || status === "picked_up" ? 12 + i : undefined,
      createdAt: i < 6 ? daysAgoIso(0) : daysAgoIso(1 + (i % 5)),
      updatedAt,
      grouped: i % 4 === 0,
    };
  });

  const reviews: Review[] = Array.from({ length: 18 }).map((_, i) => ({
    id: `rev_${i + 1}`,
    targetType: (["product", "seller", "driver"] as const)[i % 3],
    targetId: i % 3 === 0 ? products[i % products.length].id : i % 3 === 1 ? sellers[i % sellers.length].id : drivers[i % drivers.length].id,
    targetName: i % 3 === 0 ? products[i % products.length].name : i % 3 === 1 ? sellers[i % sellers.length].name : drivers[i % drivers.length].fullName,
    authorId: users[i % users.length].id,
    authorName: users[i % users.length].name,
    rating: 1 + (i % 5),
    comment: i % 5 === 0 ? "This was terrible and abusive language here!!!" : "Great experience on Hubsom.",
    status: (["visible", "visible", "flagged", "hidden", "visible"] as const)[i % 5],
    createdAt: daysAgoIso(i),
  }));

  const reports: ContentReport[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `report_${i + 1}`,
    reporterId: users[i].id,
    reporterName: users[i].name,
    targetType: (["product", "review", "seller", "comment", "stream", "user"] as const)[i % 6],
    targetId: `target_${i}`,
    reason: ["Spam", "Counterfeit", "Harassment", "Inappropriate image", "Fake stream", "Scam"][i % 6],
    status: (["open", "open", "resolved", "dismissed"] as const)[i % 4],
    createdAt: daysAgoIso(i),
  }));

  const tickets: SupportTicket[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `ticket_${i + 1}`,
    subject: ["Payment not received", "Driver late", "Wrong item", "Cannot go live", "Payout delayed", "Account locked"][i % 6],
    description: "Customer contacted Hubsom support regarding this issue.",
    audience: (["customer", "seller", "driver", "customer"] as const)[i % 4],
    requesterId: users[i % users.length].id,
    requesterName: users[i % users.length].name,
    status: (["open", "in_progress", "waiting", "escalated", "resolved", "closed"] as const)[i % 6],
    priority: (["low", "medium", "high", "urgent"] as const)[i % 4],
    assigneeId: i % 3 === 0 ? "admin_support" : undefined,
    assigneeName: i % 3 === 0 ? "Kwame Boateng" : undefined,
    internalNotes: i % 2 === 0 ? ["Initial triage completed"] : [],
    createdAt: daysAgoIso(i),
    updatedAt,
    resolvedAt: i % 6 >= 4 ? daysAgoIso(0) : undefined,
  }));

  const promotions: Promotion[] = [
    { id: "promo_1", name: "Welcome10", type: "coupon", code: "WELCOME10", discountPct: 10, active: true, startsAt: daysAgoIso(10), endsAt: daysAgoIso(-20), usageCount: 142, usageLimit: 1000, audience: "customers", createdAt: daysAgoIso(10) },
    { id: "promo_2", name: "Free Accra Delivery", type: "free_delivery", active: true, startsAt: daysAgoIso(5), endsAt: daysAgoIso(-5), usageCount: 88, audience: "customers", createdAt: daysAgoIso(5) },
    { id: "promo_3", name: "Flash Friday", type: "flash_sale", discountPct: 25, active: false, startsAt: daysAgoIso(2), endsAt: daysAgoIso(1), usageCount: 210, audience: "all", createdAt: daysAgoIso(3) },
    { id: "promo_4", name: "Driver Weekend Bonus", type: "driver_bonus", discountGhs: 20, active: true, startsAt: daysAgoIso(1), endsAt: daysAgoIso(-2), usageCount: 34, audience: "drivers", createdAt: daysAgoIso(1) },
    { id: "promo_5", name: "Seller Boost", type: "seller_promotion", discountPct: 5, active: true, startsAt: daysAgoIso(7), endsAt: daysAgoIso(-14), usageCount: 19, audience: "sellers", createdAt: daysAgoIso(7) },
    { id: "promo_6", name: "Refer a Friend", type: "referral_bonus", discountGhs: 15, active: true, startsAt: daysAgoIso(30), endsAt: daysAgoIso(-60), usageCount: 56, audience: "customers", createdAt: daysAgoIso(30) },
  ];

  const notifications: NotificationCampaign[] = [
    { id: "notif_1", title: "Platform maintenance", body: "Hubsom will undergo maintenance tonight 1–2am GMT.", channel: "email", audience: "all", status: "sent", sentAt: daysAgoIso(2), createdBy: "admin_super", createdAt: daysAgoIso(2) },
    { id: "notif_2", title: "New delivery zones", body: "Huber now covers East Legon and Spintex.", channel: "push", audience: "customers", status: "sent", sentAt: daysAgoIso(1), createdBy: "admin_ops", createdAt: daysAgoIso(1) },
    { id: "notif_3", title: "Payout reminder", body: "Submit MoMo details before Friday payout run.", channel: "email", audience: "sellers", status: "scheduled", scheduledAt: daysAgoIso(-1), createdBy: "admin_finance", createdAt: daysAgoIso(0) },
    { id: "notif_4", title: "Verification update", body: "Please upload clearer face scan.", channel: "push", audience: "specific", specificUserId: "driver_5", status: "draft", createdBy: "admin_ops", createdAt: daysAgoIso(0) },
  ];

  const fraudCases: FraudCase[] = [
    { id: "fraud_1", title: "Duplicate buyer accounts", type: "duplicate_account", severity: "medium", status: "investigating", subjectType: "user", subjectId: "user_5", subjectName: users[4].name, evidence: "Same device fingerprint across 4 accounts", createdAt: daysAgoIso(3), updatedAt, assignedTo: "admin_mod" },
    { id: "fraud_2", title: "Suspected fake delivery", type: "fake_delivery", severity: "high", status: "open", subjectType: "driver", subjectId: "driver_8", subjectName: drivers[7].fullName, evidence: "GPS jump 12km in 40 seconds", createdAt: daysAgoIso(1), updatedAt },
    { id: "fraud_3", title: "Payment chargeback ring", type: "payment_fraud", severity: "critical", status: "confirmed", subjectType: "user", subjectId: "user_12", subjectName: users[11].name, evidence: "3 chargebacks in 7 days", createdAt: daysAgoIso(5), updatedAt, assignedTo: "admin_finance" },
    { id: "fraud_4", title: "Location spoofing", type: "location_spoofing", severity: "high", status: "open", subjectType: "driver", subjectId: "driver_6", subjectName: drivers[5].fullName, evidence: "Mock location app detected", createdAt: daysAgoIso(0), updatedAt },
    { id: "fraud_5", title: "Fake 5-star reviews", type: "fake_review", severity: "low", status: "dismissed", subjectType: "seller", subjectId: "seller_3", subjectName: sellers[2].name, evidence: "Burst of identical reviews", createdAt: daysAgoIso(8), updatedAt },
  ];

  const settings: PlatformSettings = {
    platformCommissionPct: 8,
    paymentProcessingFeePct: 1.5,
    deliveryBaseFeeGhs: 30,
    deliveryPerKmGhs: 2.5,
    driverWeightBaseLbs: 20,
    driverWeightExtraFeeGhs: 10,
    payoutSchedule: "weekly",
    autoPayoutEnabled: true,
    taxEnabled: true,
    taxPct: 2.5,
    currency: "GHS",
    languages: ["en", "tw"],
    regions: ["Greater Accra", "Ashanti", "Central", "Western", "Northern", "Volta", "Eastern"],
    verificationRequireFaceScan: true,
    verificationRequireVehicleDocs: true,
    minPayoutGhs: 50,
    updatedAt,
  };

  const sessions: AdminSession[] = [
    { id: "sess_1", adminId: "admin_super", deviceName: "Chrome · macOS", ipAddress: "154.160.22.10", userAgent: "Mozilla/5.0", createdAt: daysAgoIso(2), lastActiveAt: nowIso() },
    { id: "sess_2", adminId: "admin_super", deviceName: "Safari · iPhone", ipAddress: "154.160.22.44", userAgent: "Mobile", createdAt: daysAgoIso(10), lastActiveAt: daysAgoIso(3) },
    { id: "sess_3", adminId: "admin_finance", deviceName: "Firefox · Windows", ipAddress: "41.66.80.12", userAgent: "Mozilla/5.0", createdAt: daysAgoIso(1), lastActiveAt: daysAgoIso(0) },
  ];

  const loginHistory: LoginHistoryEntry[] = [
    { id: "login_1", adminId: "admin_super", email: "admin@hubsom.com", success: true, ipAddress: "154.160.22.10", userAgent: "Chrome", mfaUsed: true, createdAt: daysAgoIso(0) },
    { id: "login_2", adminId: "admin_finance", email: "finance@hubsom.com", success: true, ipAddress: "41.66.80.12", userAgent: "Firefox", mfaUsed: true, createdAt: daysAgoIso(1) },
    { id: "login_3", adminId: "unknown", email: "admin@hubsom.com", success: false, ipAddress: "102.176.1.9", userAgent: "curl", mfaUsed: false, createdAt: daysAgoIso(2), failureReason: "Invalid password" },
    { id: "login_4", adminId: "admin_ops", email: "operations@hubsom.com", success: true, ipAddress: "154.160.30.2", userAgent: "Chrome", mfaUsed: true, createdAt: daysAgoIso(3) },
  ];

  const auditLogs: AuditLogEntry[] = [
    { id: "audit_1", actorId: "admin_ops", actorName: "Yaw Owusu", action: "driver.approve", entityType: "driver", entityId: "driver_1", createdAt: daysAgoIso(4), ipAddress: "154.160.30.2" },
    { id: "audit_2", actorId: "admin_finance", actorName: "Ama Mensah", action: "payout.approve", entityType: "payout", entityId: "payout_s_2", createdAt: daysAgoIso(2), ipAddress: "41.66.80.12" },
    { id: "audit_3", actorId: "admin_mod", actorName: "Efua Adjei", action: "product.flag", entityType: "product", entityId: "prod_4", metadata: { reason: "counterfeit" }, createdAt: daysAgoIso(1) },
    { id: "audit_4", actorId: "admin_super", actorName: "Felix Amesimeku", action: "settings.update", entityType: "settings", entityId: "platform", createdAt: daysAgoIso(0) },
    { id: "audit_5", actorId: "admin_support", actorName: "Kwame Boateng", action: "ticket.resolve", entityType: "ticket", entityId: "ticket_5", createdAt: daysAgoIso(0) },
  ];

  return {
    admins,
    users,
    sellers,
    drivers,
    categories,
    products,
    orders,
    payments,
    payouts,
    walletAdjustments,
    streams,
    auctions,
    deliveries,
    reviews,
    reports,
    tickets,
    promotions,
    notifications,
    fraudCases,
    settings,
    sessions,
    loginHistory,
    auditLogs,
  };
}

export type AdminDatabase = ReturnType<typeof createSeedDatabase>;

export function computeDashboardStats(db: AdminDatabase): DashboardStats {
  const today = daysAgoIso(0).slice(0, 10);
  const ordersToday = db.orders.filter((o) => o.createdAt.startsWith(today));
  const deliveriesToday = db.deliveries.filter((d) => d.createdAt.startsWith(today));
  const revenueToday = ordersToday
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((s, o) => s + o.totalGhs, 0);
  const platformRevenue = db.payments
    .filter((p) => p.status === "captured")
    .reduce((s, p) => s + p.platformCommissionGhs, 0);
  const pendingPayouts = db.payouts
    .filter((p) => ["pending", "approved", "held", "processing"].includes(p.status))
    .reduce((s, p) => s + p.amountGhs, 0);

  return {
    totalUsers: db.users.length,
    totalSellers: db.sellers.length,
    totalDrivers: db.drivers.length,
    verifiedSellers: db.sellers.filter((s) => s.verified).length,
    verifiedDrivers: db.drivers.filter((d) => d.verificationStatus === "approved").length,
    pendingDriverVerifications: db.drivers.filter((d) => d.verificationStatus === "pending" || d.verificationStatus === "more_docs_required").length,
    pendingSellerVerifications: db.sellers.filter((s) => s.status === "pending").length,
    activeLiveStreams: db.streams.filter((s) => s.status === "live").length,
    activeAuctions: db.auctions.filter((a) => a.status === "open" || a.status === "closing").length,
    ordersToday: ordersToday.length,
    deliveriesToday: deliveriesToday.length,
    revenueTodayGhs: Math.round(revenueToday * 100) / 100,
    platformRevenueGhs: Math.round(platformRevenue * 100) / 100,
    pendingPayoutsGhs: Math.round(pendingPayouts * 100) / 100,
    cancelledOrders: db.orders.filter((o) => o.status === "cancelled").length,
    refundRequests: db.orders.filter((o) => o.status === "refunded" || o.status === "disputed").length,
    supportTickets: db.tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length,
  };
}
