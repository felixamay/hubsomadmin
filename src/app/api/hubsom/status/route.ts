import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pingHubsom } from "@/infrastructure/hubsom/admin-api";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = await pingHubsom();
  return NextResponse.json(status, { status: status.ok ? 200 : 503 });
}
