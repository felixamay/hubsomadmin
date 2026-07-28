import type {
  AdminRole,
  AuctionStatus,
  DeliveryStatus,
  DocumentReviewStatus,
  DocumentType,
  DriverStatus,
  FraudCaseStatus,
  FraudSeverity,
  NotificationAudience,
  NotificationChannel,
  OrderStatus,
  PaymentStatus,
  PayoutMethod,
  PayoutStatus,
  ProductModerationStatus,
  PromotionType,
  SellerStatus,
  ShipmentStatus,
  StreamStatus,
  TicketAudience,
  TicketPriority,
  TicketStatus,
  UserAccountStatus,
  VehicleType,
  VerificationStatus,
} from "@/domain/enums";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracyM?: number;
  address?: string;
  source?: "gps" | "map-pin" | "manual" | "geocoded";
  capturedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
  image?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  permissions: string[];
  status: UserAccountStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  id: string;
  adminId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  revokedAt?: string;
}

export interface LoginHistoryEntry {
  id: string;
  adminId: string;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  mfaUsed: boolean;
  createdAt: string;
  failureReason?: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  image?: string;
  city?: string;
  region?: string;
  role: "buyer" | "seller" | "both";
  sellerId?: string;
  status: UserAccountStatus;
  emailVerified: boolean;
  orderCount: number;
  totalSpentGhs: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

export interface Seller {
  id: string;
  slug: string;
  name: string;
  ownerUserId: string;
  ownerName: string;
  ownerEmail: string;
  city: string;
  region: string;
  bio: string;
  avatar: string;
  cover: string;
  rating: number;
  followers: number;
  verified: boolean;
  status: SellerStatus;
  categories: string[];
  productCount: number;
  revenueGhs: number;
  pendingBalanceGhs: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  type: DocumentType;
  storageUrl: string;
  uploadedAt: string;
  status: DocumentReviewStatus;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Driver {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  city: string;
  region: string;
  vehicleType: VehicleType;
  vehiclePlate?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  verificationStatus: VerificationStatus;
  status: DriverStatus;
  rating: number;
  totalReviews: number;
  acceptanceRate: number;
  completionRate: number;
  walletBalanceGhs: number;
  pendingPayoutGhs: number;
  lifetimeEarningsGhs: number;
  tipsGhs: number;
  bonusesGhs: number;
  currentLocation?: GeoLocation;
  documents: DriverDocument[];
  createdAt: string;
  updatedAt: string;
  canGoOnline: boolean;
  verificationNotes?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceGhs: number;
  compareAtGhs?: number;
  currency: "GHS";
  images: string[];
  sellerId: string;
  sellerName: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  moderationStatus: ProductModerationStatus;
  featured: boolean;
  flaggedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  productCount: number;
}

export interface OrderLine {
  productId: string;
  sellerId: string;
  name: string;
  quantity: number;
  unitPriceGhs: number;
  lineTotalGhs: number;
}

export interface Order {
  id: string;
  currency: "GHS";
  subtotalGhs: number;
  deliveryFeeGhs: number;
  platformFeeGhs: number;
  taxGhs: number;
  totalGhs: number;
  status: OrderStatus;
  userId: string;
  buyerName: string;
  buyerEmail: string;
  sellerIds: string[];
  lines: OrderLine[];
  shippingCity: string;
  shippingRegion: string;
  paymentMethods: string[];
  streamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amountGhs: number;
  currency: "GHS";
  status: PaymentStatus;
  method: string;
  processorFeeGhs: number;
  platformCommissionGhs: number;
  netAmountGhs: number;
  customerName: string;
  createdAt: string;
  capturedAt?: string;
  refundedAt?: string;
  chargebackAt?: string;
  reference: string;
}

export interface Payout {
  id: string;
  recipientType: "seller" | "driver";
  recipientId: string;
  recipientName: string;
  amountGhs: number;
  method: PayoutMethod;
  accountDetails: string;
  status: PayoutStatus;
  scheduledAt?: string;
  processedAt?: string;
  failureReason?: string;
  notes?: string;
  createdAt: string;
  approvedBy?: string;
}

export interface WalletAdjustment {
  id: string;
  ownerType: "seller" | "driver";
  ownerId: string;
  ownerName: string;
  amountGhs: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface LiveStream {
  id: string;
  title: string;
  sellerId: string;
  sellerName: string;
  status: StreamStatus;
  viewerCount: number;
  peakViewers: number;
  latencyMs: number;
  pinnedProductId?: string;
  productIds: string[];
  featured: boolean;
  startedAt?: string;
  endedAt?: string;
  cover: string;
  health: "healthy" | "degraded" | "critical";
}

export interface Auction {
  id: string;
  streamId?: string;
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  startingBidGhs: number;
  currentBidGhs: number;
  minIncrementGhs: number;
  bidderCount: number;
  highestBidder?: string;
  status: AuctionStatus;
  featured: boolean;
  endsAt: string;
  disputeOpen: boolean;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  shipmentId: string;
  driverId?: string;
  driverName?: string;
  sellerName: string;
  customerName: string;
  status: DeliveryStatus;
  feeGhs: number;
  tipGhs: number;
  pickup: GeoLocation;
  dropoff: GeoLocation;
  etaMinutes?: number;
  routePolyline?: string;
  createdAt: string;
  updatedAt: string;
  grouped: boolean;
}

export interface Review {
  id: string;
  targetType: "product" | "seller" | "driver";
  targetId: string;
  targetName: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  status: "visible" | "hidden" | "deleted" | "flagged";
  createdAt: string;
  adminResponse?: string;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "user" | "seller" | "product" | "review" | "comment" | "stream";
  targetId: string;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  audience: TicketAudience;
  requesterId: string;
  requesterName: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string;
  assigneeName?: string;
  internalNotes: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: PromotionType;
  code?: string;
  discountPct?: number;
  discountGhs?: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
  usageCount: number;
  usageLimit?: number;
  audience: string;
  createdAt: string;
}

export interface NotificationCampaign {
  id: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  audience: NotificationAudience;
  specificUserId?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface FraudCase {
  id: string;
  title: string;
  type:
    | "fake_account"
    | "duplicate_account"
    | "payment_fraud"
    | "account_sharing"
    | "location_spoofing"
    | "fake_delivery"
    | "fake_review"
    | "suspicious_activity";
  severity: FraudSeverity;
  status: FraudCaseStatus;
  subjectType: "user" | "seller" | "driver";
  subjectId: string;
  subjectName: string;
  evidence: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface PlatformSettings {
  platformCommissionPct: number;
  paymentProcessingFeePct: number;
  deliveryBaseFeeGhs: number;
  deliveryPerKmGhs: number;
  driverWeightBaseLbs: number;
  driverWeightExtraFeeGhs: number;
  payoutSchedule: "daily" | "weekly" | "biweekly" | "monthly";
  autoPayoutEnabled: boolean;
  taxEnabled: boolean;
  taxPct: number;
  currency: "GHS";
  languages: string[];
  regions: string[];
  verificationRequireFaceScan: boolean;
  verificationRequireVehicleDocs: boolean;
  minPayoutGhs: number;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalDrivers: number;
  verifiedSellers: number;
  verifiedDrivers: number;
  pendingDriverVerifications: number;
  pendingSellerVerifications: number;
  activeLiveStreams: number;
  activeAuctions: number;
  ordersToday: number;
  deliveriesToday: number;
  revenueTodayGhs: number;
  platformRevenueGhs: number;
  pendingPayoutsGhs: number;
  cancelledOrders: number;
  refundRequests: number;
  supportTickets: number;
}

export type Shipment = {
  id: string;
  orderIds: string[];
  sellerId: string;
  status: ShipmentStatus;
  assignedDriverId?: string;
  destinationCity: string;
  createdAt: string;
};
