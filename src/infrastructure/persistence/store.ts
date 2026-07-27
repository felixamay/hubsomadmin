import {
  computeDashboardStats,
  createSeedDatabase,
  type AdminDatabase,
} from "@/infrastructure/seed/database";
import type {
  Auction,
  Category,
  CustomerUser,
  Delivery,
  Driver,
  FraudCase,
  LiveStream,
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
  AuditLogEntry,
} from "@/domain/entities";
import { nowIso, uid } from "@/lib/utils";

declare global {
  var __hubsomAdminDb: AdminDatabase | undefined;
}

function getDb(): AdminDatabase {
  if (!globalThis.__hubsomAdminDb) {
    globalThis.__hubsomAdminDb = createSeedDatabase();
  }
  return globalThis.__hubsomAdminDb;
}

function mutate(mutator: (db: AdminDatabase) => void) {
  const db = getDb();
  mutator(db);
  return db;
}

function addAudit(
  actorId: string,
  actorName: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>,
) {
  mutate((db) => {
    const entry: AuditLogEntry = {
      id: uid("audit"),
      actorId,
      actorName,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: nowIso(),
    };
    db.auditLogs.unshift(entry);
  });
}

export const adminStore = {
  getDatabase: () => getDb(),
  getStats: () => computeDashboardStats(getDb()),

  getAdmins: () => getDb().admins,
  findAdminByEmail: (email: string) =>
    getDb().admins.find((a) => a.email.toLowerCase() === email.toLowerCase()),
  findAdminById: (id: string) => getDb().admins.find((a) => a.id === id),

  getUsers: () => getDb().users,
  updateUser: (id: string, patch: Partial<CustomerUser>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.users.findIndex((u) => u.id === id);
      if (idx >= 0) {
        db.users[idx] = { ...db.users[idx], ...patch, updatedAt: nowIso() };
        if (actor) addAudit(actor.id, actor.name, "user.update", "user", id, patch as Record<string, unknown>);
      }
    });
    return getDb().users.find((u) => u.id === id);
  },

  getSellers: () => getDb().sellers,
  updateSeller: (id: string, patch: Partial<Seller>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.sellers.findIndex((s) => s.id === id);
      if (idx >= 0) {
        db.sellers[idx] = { ...db.sellers[idx], ...patch, updatedAt: nowIso() };
        if (actor) addAudit(actor.id, actor.name, "seller.update", "seller", id, patch as Record<string, unknown>);
      }
    });
    return getDb().sellers.find((s) => s.id === id);
  },

  getDrivers: () => getDb().drivers,
  updateDriver: (id: string, patch: Partial<Driver>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.drivers.findIndex((d) => d.id === id);
      if (idx >= 0) {
        const next = { ...db.drivers[idx], ...patch, updatedAt: nowIso() };
        next.canGoOnline = next.verificationStatus === "approved";
        if (next.verificationStatus !== "approved" && next.status !== "offline") {
          next.status = "offline";
        }
        db.drivers[idx] = next;
        if (actor) addAudit(actor.id, actor.name, "driver.update", "driver", id, patch as Record<string, unknown>);
      }
    });
    return getDb().drivers.find((d) => d.id === id);
  },

  updateDriverDocument: (
    driverId: string,
    docId: string,
    status: Driver["documents"][number]["status"],
    notes?: string,
    actor?: { id: string; name: string },
  ) => {
    mutate((db) => {
      const driver = db.drivers.find((d) => d.id === driverId);
      if (!driver) return;
      const doc = driver.documents.find((d) => d.id === docId);
      if (!doc) return;
      doc.status = status;
      doc.notes = notes;
      doc.reviewedAt = nowIso();
      doc.reviewedBy = actor?.id;
      if (actor) addAudit(actor.id, actor.name, "document.review", "document", docId, { status, notes });
    });
  },

  getProducts: () => getDb().products,
  updateProduct: (id: string, patch: Partial<Product>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.products.findIndex((p) => p.id === id);
      if (idx >= 0) {
        db.products[idx] = { ...db.products[idx], ...patch, updatedAt: nowIso() };
        if (actor) addAudit(actor.id, actor.name, "product.update", "product", id, patch as Record<string, unknown>);
      }
    });
  },

  getCategories: () => getDb().categories,
  updateCategory: (id: string, patch: Partial<Category>) => {
    mutate((db) => {
      const idx = db.categories.findIndex((c) => c.id === id);
      if (idx >= 0) db.categories[idx] = { ...db.categories[idx], ...patch };
    });
  },
  addCategory: (category: Category) => {
    mutate((db) => {
      db.categories.push(category);
    });
  },
  deleteCategory: (id: string) => {
    mutate((db) => {
      db.categories = db.categories.filter((c) => c.id !== id);
    });
  },

  getOrders: () => getDb().orders,
  updateOrder: (id: string, patch: Partial<Order>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.orders.findIndex((o) => o.id === id);
      if (idx >= 0) {
        db.orders[idx] = { ...db.orders[idx], ...patch, updatedAt: nowIso() };
        if (actor) addAudit(actor.id, actor.name, "order.update", "order", id, patch as Record<string, unknown>);
      }
    });
  },

  getPayments: () => getDb().payments,
  updatePayment: (id: string, patch: Partial<Payment>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.payments.findIndex((p) => p.id === id);
      if (idx >= 0) {
        db.payments[idx] = { ...db.payments[idx], ...patch };
        if (actor) addAudit(actor.id, actor.name, "payment.update", "payment", id, patch as Record<string, unknown>);
      }
    });
  },

  getPayouts: () => getDb().payouts,
  updatePayout: (id: string, patch: Partial<Payout>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.payouts.findIndex((p) => p.id === id);
      if (idx >= 0) {
        db.payouts[idx] = { ...db.payouts[idx], ...patch };
        if (actor) addAudit(actor.id, actor.name, "payout.update", "payout", id, patch as Record<string, unknown>);
      }
    });
  },

  getStreams: () => getDb().streams,
  updateStream: (id: string, patch: Partial<LiveStream>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.streams.findIndex((s) => s.id === id);
      if (idx >= 0) {
        db.streams[idx] = { ...db.streams[idx], ...patch };
        if (actor) addAudit(actor.id, actor.name, "stream.update", "stream", id, patch as Record<string, unknown>);
      }
    });
  },

  getAuctions: () => getDb().auctions,
  updateAuction: (id: string, patch: Partial<Auction>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.auctions.findIndex((a) => a.id === id);
      if (idx >= 0) {
        db.auctions[idx] = { ...db.auctions[idx], ...patch };
        if (actor) addAudit(actor.id, actor.name, "auction.update", "auction", id, patch as Record<string, unknown>);
      }
    });
  },

  getDeliveries: () => getDb().deliveries,
  updateDelivery: (id: string, patch: Partial<Delivery>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.deliveries.findIndex((d) => d.id === id);
      if (idx >= 0) {
        db.deliveries[idx] = { ...db.deliveries[idx], ...patch, updatedAt: nowIso() };
        if (actor) addAudit(actor.id, actor.name, "delivery.update", "delivery", id, patch as Record<string, unknown>);
      }
    });
  },

  getReviews: () => getDb().reviews,
  updateReview: (id: string, patch: Partial<Review>) => {
    mutate((db) => {
      const idx = db.reviews.findIndex((r) => r.id === id);
      if (idx >= 0) db.reviews[idx] = { ...db.reviews[idx], ...patch };
    });
  },

  getReports: () => getDb().reports,
  updateReport: (id: string, status: "open" | "resolved" | "dismissed") => {
    mutate((db) => {
      const idx = db.reports.findIndex((r) => r.id === id);
      if (idx >= 0) {
        db.reports[idx] = {
          ...db.reports[idx],
          status,
          resolvedAt: status === "open" ? undefined : nowIso(),
        };
      }
    });
  },

  getTickets: () => getDb().tickets,
  updateTicket: (id: string, patch: Partial<SupportTicket>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      const idx = db.tickets.findIndex((t) => t.id === id);
      if (idx >= 0) {
        db.tickets[idx] = { ...db.tickets[idx], ...patch, updatedAt: nowIso() };
        if (actor) addAudit(actor.id, actor.name, "ticket.update", "ticket", id, patch as Record<string, unknown>);
      }
    });
  },

  getPromotions: () => getDb().promotions,
  addPromotion: (promo: Promotion) => {
    mutate((db) => {
      db.promotions.unshift(promo);
    });
  },
  updatePromotion: (id: string, patch: Partial<Promotion>) => {
    mutate((db) => {
      const idx = db.promotions.findIndex((p) => p.id === id);
      if (idx >= 0) db.promotions[idx] = { ...db.promotions[idx], ...patch };
    });
  },

  getNotifications: () => getDb().notifications,
  addNotification: (n: NotificationCampaign) => {
    mutate((db) => {
      db.notifications.unshift(n);
    });
  },

  getFraudCases: () => getDb().fraudCases,
  updateFraudCase: (id: string, patch: Partial<FraudCase>) => {
    mutate((db) => {
      const idx = db.fraudCases.findIndex((f) => f.id === id);
      if (idx >= 0) db.fraudCases[idx] = { ...db.fraudCases[idx], ...patch, updatedAt: nowIso() };
    });
  },

  getSettings: () => getDb().settings,
  updateSettings: (patch: Partial<PlatformSettings>, actor?: { id: string; name: string }) => {
    mutate((db) => {
      db.settings = { ...db.settings, ...patch, updatedAt: nowIso() };
      if (actor) addAudit(actor.id, actor.name, "settings.update", "settings", "platform", patch as Record<string, unknown>);
    });
    return getDb().settings;
  },

  getSessions: () => getDb().sessions,
  revokeSession: (id: string) => {
    mutate((db) => {
      const idx = db.sessions.findIndex((s) => s.id === id);
      if (idx >= 0) db.sessions[idx] = { ...db.sessions[idx], revokedAt: nowIso() };
    });
  },

  getLoginHistory: () => getDb().loginHistory,
  addLoginHistory: (entry: Omit<AdminDatabase["loginHistory"][number], "id">) => {
    mutate((db) => {
      db.loginHistory.unshift({ ...entry, id: uid("login") });
    });
  },

  getAuditLogs: () => getDb().auditLogs,
  getWalletAdjustments: () => getDb().walletAdjustments,
};
