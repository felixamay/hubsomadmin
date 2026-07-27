import fs from "fs";
import path from "path";
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
import { nowIso } from "@/lib/utils";

export type AdminDatabase = {
  admins: AdminUser[];
  users: CustomerUser[];
  sellers: Seller[];
  drivers: Driver[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  payments: Payment[];
  payouts: Payout[];
  walletAdjustments: WalletAdjustment[];
  streams: LiveStream[];
  auctions: Auction[];
  deliveries: Delivery[];
  reviews: Review[];
  reports: ContentReport[];
  tickets: SupportTicket[];
  promotions: Promotion[];
  notifications: NotificationCampaign[];
  fraudCases: FraudCase[];
  settings: PlatformSettings;
  sessions: AdminSession[];
  loginHistory: LoginHistoryEntry[];
  auditLogs: AuditLogEntry[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "admin-db.json");

function defaultSettings(): PlatformSettings {
  return {
    platformCommissionPct: 8,
    paymentProcessingFeePct: 1.5,
    deliveryBaseFeeGhs: 30,
    deliveryPerKmGhs: 2.5,
    driverWeightBaseLbs: 20,
    driverWeightExtraFeeGhs: 10,
    payoutSchedule: "weekly",
    autoPayoutEnabled: false,
    taxEnabled: true,
    taxPct: 2.5,
    currency: "GHS",
    languages: ["en", "tw"],
    regions: [
      "Greater Accra",
      "Ashanti",
      "Central",
      "Western",
      "Northern",
      "Volta",
      "Eastern",
    ],
    verificationRequireFaceScan: true,
    verificationRequireVehicleDocs: true,
    minPayoutGhs: 50,
    updatedAt: nowIso(),
  };
}

function emptyDatabase(): AdminDatabase {
  return {
    admins: [],
    users: [],
    sellers: [],
    drivers: [],
    categories: [],
    products: [],
    orders: [],
    payments: [],
    payouts: [],
    walletAdjustments: [],
    streams: [],
    auctions: [],
    deliveries: [],
    reviews: [],
    reports: [],
    tickets: [],
    promotions: [],
    notifications: [],
    fraudCases: [],
    settings: defaultSettings(),
    sessions: [],
    loginHistory: [],
    auditLogs: [],
  };
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadFromDisk(): AdminDatabase | null {
  try {
    if (!fs.existsSync(DB_PATH)) return null;
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw) as AdminDatabase;
  } catch {
    return null;
  }
}

export function persistDatabase(db: AdminDatabase) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function bootstrapOwner(db: AdminDatabase) {
  const email = (process.env.ADMIN_EMAIL ?? "felixames0808@gmail.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Afia@April21";
  const name = process.env.ADMIN_NAME ?? "Felix Amesimeku";
  const now = nowIso();

  const existing = db.admins.find((a) => a.email.toLowerCase() === email);
  const passwordHash = bcrypt.hashSync(password, 12);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    existing.role = "super_admin";
    existing.permissions = [...ROLE_PERMISSIONS.super_admin];
    existing.status = "active";
    existing.updatedAt = now;
    // Keep MFA settings if already configured by the user
  } else {
    db.admins.push({
      id: "admin_owner",
      email,
      name,
      passwordHash,
      role: "super_admin",
      mfaEnabled: false,
      permissions: [...ROLE_PERMISSIONS.super_admin],
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  }

  // Remove any leftover demo accounts
  db.admins = db.admins.filter(
    (a) =>
      a.email.toLowerCase() === email ||
      !a.email.endsWith("@hubsom.com"),
  );
}

/** Create or load the admin database — no demo marketplace/driver data. */
export function createSeedDatabase(): AdminDatabase {
  const loaded = loadFromDisk();
  const db = loaded ?? emptyDatabase();

  // Ensure required collections exist after schema evolution
  const blank = emptyDatabase();
  for (const key of Object.keys(blank) as (keyof AdminDatabase)[]) {
    if (db[key] === undefined) {
      // @ts-expect-error index assign
      db[key] = blank[key];
    }
  }

  bootstrapOwner(db);
  persistDatabase(db);
  return db;
}

export function computeDashboardStats(db: AdminDatabase): DashboardStats {
  const today = nowIso().slice(0, 10);
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
    pendingDriverVerifications: db.drivers.filter(
      (d) => d.verificationStatus === "pending" || d.verificationStatus === "more_docs_required",
    ).length,
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
