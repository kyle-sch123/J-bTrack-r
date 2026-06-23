import { NextResponse } from "next/server";

// Liveness probe for Render's health check (and any external uptime monitor).
// Mirrors the backend's /healthz so the platform can confirm the app is up.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
