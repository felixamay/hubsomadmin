/** Hubsom storefront promotion contract (ADMIN_PROMOTIONS.md). */

export type HubsomPlacement = "landing" | "marketplace" | "category" | "product";

export type HubsomPromoTone = "forest" | "gold" | "cyan" | "live";

export interface HubsomPromotion {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  tone: HubsomPromoTone;
  placements: HubsomPlacement[];
  categorySlugs?: string[];
  productIds?: string[];
  imageUrl?: string;
  sortOrder?: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  source?: "admin" | "seed";
}

export type HubsomPromotionInput = Omit<HubsomPromotion, "id" | "source"> & {
  id?: string;
};

export interface HubsomCatalogPlacement {
  id: HubsomPlacement;
  label: string;
  description: string;
}

export interface HubsomCatalogCategory {
  slug: string;
  name: string;
  description?: string;
}

export interface HubsomCatalogProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image?: string;
  priceGhs?: number;
}

export interface HubsomAdminCatalog {
  placements: HubsomCatalogPlacement[];
  categories: HubsomCatalogCategory[];
  products: HubsomCatalogProduct[];
}

export const HUBSOM_TONES: HubsomPromoTone[] = ["forest", "gold", "cyan", "live"];

export const EMPTY_HUBSOM_PROMOTION: HubsomPromotionInput = {
  title: "",
  subtitle: "",
  ctaLabel: "Shop now",
  href: "/marketplace",
  tone: "forest",
  placements: ["landing"],
  categorySlugs: [],
  productIds: [],
  sortOrder: 100,
  active: true,
  startsAt: null,
  endsAt: null,
};
