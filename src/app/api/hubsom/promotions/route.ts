import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createHubsomPromotion,
  deleteHubsomPromotion,
  hubsomConfigured,
  listHubsomPromotions,
  updateHubsomPromotion,
} from "@/infrastructure/hubsom/admin-api";
import type { HubsomPromotionInput } from "@/domain/hubsom-promotions";

async function requireSession() {
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

export async function GET() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hubsomConfigured()) {
    return NextResponse.json(
      { error: "HUBSOM_API_BASE_URL is not set", promotions: [] },
      { status: 503 },
    );
  }
  try {
    const promotions = await listHubsomPromotions();
    return NextResponse.json({ promotions });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Failed to list promotions",
        promotions: [],
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hubsomConfigured()) {
    return NextResponse.json({ error: "HUBSOM_API_BASE_URL is not set" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const promotion = body.promotion as HubsomPromotionInput | undefined;
    if (!promotion?.title?.trim() || !promotion?.href?.trim()) {
      return NextResponse.json({ error: "title and href are required" }, { status: 400 });
    }
    if (!Array.isArray(promotion.placements) || promotion.placements.length === 0) {
      return NextResponse.json({ error: "Select at least one placement" }, { status: 400 });
    }
    const saved = await createHubsomPromotion({
      ...promotion,
      title: promotion.title.trim(),
      subtitle: promotion.subtitle?.trim() ?? "",
      ctaLabel: promotion.ctaLabel?.trim() || "Shop now",
      href: promotion.href.trim(),
      categorySlugs: promotion.categorySlugs ?? [],
      productIds: promotion.productIds ?? [],
    });
    return NextResponse.json({ promotion: saved });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Create failed" },
      { status: 502 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hubsomConfigured()) {
    return NextResponse.json({ error: "HUBSOM_API_BASE_URL is not set" }, { status: 503 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    const patch = (await request.json()) as Partial<HubsomPromotionInput>;
    if (patch.placements && patch.placements.length === 0) {
      return NextResponse.json({ error: "Select at least one placement" }, { status: 400 });
    }
    const saved = await updateHubsomPromotion(id, patch);
    return NextResponse.json({ promotion: saved });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hubsomConfigured()) {
    return NextResponse.json({ error: "HUBSOM_API_BASE_URL is not set" }, { status: 503 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    await deleteHubsomPromotion(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed" },
      { status: 502 },
    );
  }
}
