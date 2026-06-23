import { NextResponse } from "next/server";

// Alias of /health — Render's default health check path is /healthz, and this
// matches the backend convention. Kept in sync with src/app/health/route.ts.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
