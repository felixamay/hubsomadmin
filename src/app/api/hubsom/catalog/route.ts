import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  fetchHubsomCatalog,
  hubsomConfigured,
} from "@/infrastructure/hubsom/admin-api";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hubsomConfigured()) {
    return NextResponse.json(
      {
        error: "HUBSOM_API_BASE_URL is not set",
        placements: [],
        categories: [],
        products: [],
      },
      { status: 503 },
    );
  }
  try {
    const catalog = await fetchHubsomCatalog();
    return NextResponse.json(catalog);
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Failed to load catalog",
        placements: [],
        categories: [],
        products: [],
      },
      { status: 502 },
    );
  }
}
