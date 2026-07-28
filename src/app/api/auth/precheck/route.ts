import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminStore } from "@/infrastructure/persistence/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
  }

  const admin = adminStore.findAdminByEmail(email);
  if (!admin || admin.status !== "active") {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    mfaRequired: admin.mfaEnabled,
    name: admin.name,
    role: admin.role,
  });
}
