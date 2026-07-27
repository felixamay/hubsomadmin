/** Shared enums aligned with Hubsom marketplace + Huber delivery. */

export type AdminRole =
  | "super_admin"
  | "finance_admin"
  | "support_admin"
  | "moderation_admin"
  | "operations_admin";

export type UserAccountStatus =
  | "active"
  | "suspended"
  | "banned"
  | "disabled"
  | "deleted";

export type SellerStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "banned";

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "banned"
  | "more_docs_required";

export type DriverStatus =
  | "offline"
  | "online"
  | "on_delivery"
  | "busy";

export type DocumentType =
  | "ghana_card"
  | "passport"
  | "drivers_license"
  | "vehicle_registration"
  | "insurance"
  | "vehicle_photo"
  | "face_scan";

export type DocumentReviewStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "more_docs_required";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded"
  | "disputed";

export type ShipmentStatus =
  | "draft"
  | "ready"
  | "offering"
  | "assigned"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

export type DeliveryStatus =
  | "queued"
  | "offered"
  | "accepted"
  | "en_route_to_pickup"
  | "arrived_at_pickup"
  | "picked_up"
  | "en_route_to_customer"
  | "arrived_at_customer"
  | "delivered"
  | "cancelled"
  | "failed";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "chargeback";

export type PayoutStatus =
  | "pending"
  | "approved"
  | "held"
  | "processing"
  | "completed"
  | "failed"
  | "rejected";

export type PayoutMethod =
  | "mtn_momo"
  | "telecel_cash"
  | "airteltigo_money"
  | "bank_transfer";

export type StreamStatus = "scheduled" | "live" | "ended" | "replay";

export type AuctionStatus =
  | "upcoming"
  | "open"
  | "paused"
  | "closing"
  | "sold"
  | "unsold"
  | "cancelled";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting"
  | "escalated"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketAudience = "customer" | "seller" | "driver" | "internal";

export type ProductModerationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "flagged"
  | "removed";

export type FraudSeverity = "low" | "medium" | "high" | "critical";

export type FraudCaseStatus =
  | "open"
  | "investigating"
  | "confirmed"
  | "dismissed"
  | "resolved";

export type NotificationChannel = "push" | "email" | "sms" | "in_app";

export type NotificationAudience =
  | "all"
  | "customers"
  | "drivers"
  | "sellers"
  | "specific";

export type PromotionType =
  | "coupon"
  | "discount"
  | "flash_sale"
  | "referral_bonus"
  | "free_delivery"
  | "seller_promotion"
  | "driver_bonus";

export type VehicleType =
  | "motorcycle"
  | "car"
  | "van"
  | "pickup_truck"
  | "bicycle"
  | "walking_courier";
