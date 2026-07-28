import type {
  HubsomAdminCatalog,
  HubsomPromotion,
  HubsomPromotionInput,
} from "@/domain/hubsom-promotions";

function baseUrl() {
  return (process.env.HUBSOM_API_BASE_URL ?? "").replace(/\/$/, "");
}

function adminKey() {
  return process.env.HUBSOM_ADMIN_API_KEY ?? "";
}

export function hubsomConfigured() {
  return Boolean(baseUrl());
}

function headers(json = false): HeadersInit {
  const key = adminKey();
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(key
      ? {
          "X-Hubsom-Admin-Key": key,
          Authorization: `Bearer ${key}`,
        }
      : {}),
  };
}

async function hubsomFetch(path: string, init?: RequestInit) {
  const base = baseUrl();
  if (!base) {
    throw new Error("HUBSOM_API_BASE_URL is not configured");
  }
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      ...headers(Boolean(init?.body)),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || res.statusText };
  }
  return { res, data };
}

export async function fetchHubsomCatalog(): Promise<HubsomAdminCatalog> {
  const { res, data } = await hubsomFetch("/api/admin/catalog");
  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error ?? `Catalog failed (${res.status})`;
    throw new Error(err);
  }
  return data as HubsomAdminCatalog;
}

export async function listHubsomPromotions(): Promise<HubsomPromotion[]> {
  const { res, data } = await hubsomFetch("/api/admin/promotions");
  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error ?? `List failed (${res.status})`;
    throw new Error(err);
  }
  const payload = data as { promotions?: HubsomPromotion[] };
  return payload.promotions ?? [];
}

export async function createHubsomPromotion(
  promotion: HubsomPromotionInput,
): Promise<HubsomPromotion> {
  const { res, data } = await hubsomFetch("/api/admin/promotions", {
    method: "POST",
    body: JSON.stringify({ promotion }),
  });
  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error ?? `Create failed (${res.status})`;
    throw new Error(err);
  }
  return (data as { promotion: HubsomPromotion }).promotion;
}

export async function updateHubsomPromotion(
  id: string,
  patch: Partial<HubsomPromotionInput>,
): Promise<HubsomPromotion> {
  const { res, data } = await hubsomFetch(
    `/api/admin/promotions?id=${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(patch),
    },
  );
  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error ?? `Update failed (${res.status})`;
    throw new Error(err);
  }
  return (data as { promotion: HubsomPromotion }).promotion;
}

export async function deleteHubsomPromotion(id: string): Promise<void> {
  const { res, data } = await hubsomFetch(
    `/api/admin/promotions?id=${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error ?? `Delete failed (${res.status})`;
    throw new Error(err);
  }
}
