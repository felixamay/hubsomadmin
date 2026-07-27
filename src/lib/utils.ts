import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayStartIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function statusColor(status: string): "default" | "success" | "warning" | "error" | "info" {
  const s = status.toLowerCase();
  if (["approved", "active", "completed", "delivered", "captured", "resolved", "healthy", "live", "open", "paid", "fulfilled", "visible", "sent"].includes(s)) {
    return "success";
  }
  if (["pending", "offered", "processing", "held", "waiting", "investigating", "scheduled", "paused", "more_docs_required", "degraded"].includes(s)) {
    return "warning";
  }
  if (["rejected", "banned", "failed", "cancelled", "refunded", "chargeback", "critical", "deleted", "suspended", "flagged", "confirmed"].includes(s)) {
    return "error";
  }
  if (["in_progress", "assigned", "online", "featured"].includes(s)) {
    return "info";
  }
  return "default";
}
