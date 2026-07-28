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

export function getHubsomConfig() {
  return {
    baseUrl: baseUrl(),
    hasApiKey: Boolean(adminKey()),
  };
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

function friendlyFetchError(err: unknown, url: string): Error {
  const raw = err instanceof Error ? err.message : String(err);
  const cause =
    err instanceof Error && "cause" in err
      ? String((err as Error & { cause?: unknown }).cause ?? "")
      : "";
  const detail = `${raw} ${cause}`.toLowerCase();

  if (detail.includes("econnrefused") || detail.includes("fetch failed")) {
    return new Error(
      `Cannot reach Hubsom at ${url}. Start Hubsom on that host (branch cursor/hubsom-live-commerce-8a7a) and confirm HUBSOM_API_BASE_URL in admin .env.local.`,
    );
  }
  if (detail.includes("enotfound") || detail.includes("getaddrinfo")) {
    return new Error(
      `Hubsom host not found for ${url}. Check HUBSOM_API_BASE_URL (use http://127.0.0.1:3000 if localhost fails).`,
    );
  }
  if (detail.includes("etimedout") || detail.includes("timeout") || detail.includes("abort")) {
    return new Error(`Timed out connecting to Hubsom at ${url}.`);
  }
  return new Error(raw || `Request to Hubsom failed (${url})`);
}

async function hubsomFetch(path: string, init?: RequestInit) {
  const base = baseUrl();
  if (!base) {
    throw new Error("HUBSOM_API_BASE_URL is not configured in .env.local");
  }
  const url = `${base}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...headers(Boolean(init?.body)),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch (err) {
    throw friendlyFetchError(err, url);
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || res.statusText };
  }
  return { res, data, url };
}

export async function pingHubsom(): Promise<{
  ok: boolean;
  baseUrl: string;
  hasApiKey: boolean;
  catalogOk?: boolean;
  promotionsOk?: boolean;
  error?: string;
}> {
  const base = baseUrl();
  const cfg = getHubsomConfig();
  if (!base) {
    return {
      ok: false,
      ...cfg,
      error: "HUBSOM_API_BASE_URL is not set",
    };
  }
  try {
    const catalog = await hubsomFetch("/api/admin/catalog");
    const promotions = await hubsomFetch("/api/admin/promotions");
    const catalogOk = catalog.res.ok;
    const promotionsOk = promotions.res.ok;
    if (!catalogOk || !promotionsOk) {
      const errPayload = (!catalogOk ? catalog.data : promotions.data) as {
        error?: string;
      } | null;
      return {
        ok: false,
        ...cfg,
        catalogOk,
        promotionsOk,
        error:
          errPayload?.error ??
          `Hubsom responded ${!catalogOk ? catalog.res.status : promotions.res.status}. Check HUBSOM_ADMIN_API_KEY matches Hubsom.`,
      };
    }
    return { ok: true, ...cfg, catalogOk, promotionsOk };
  } catch (e) {
    return {
      ok: false,
      ...cfg,
      error: e instanceof Error ? e.message : "Connection failed",
    };
  }
}

export async function fetchHubsomCatalog(): Promise<HubsomAdminCatalog> {
  const { res, data } = await hubsomFetch("/api/admin/catalog");
  if (!res.ok) {
    const err =
      (data as { error?: string } | null)?.error ?? `Catalog failed (${res.status})`;
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
