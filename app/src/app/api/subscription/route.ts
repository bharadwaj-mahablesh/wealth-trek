import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const row = db
    .prepare(
      `SELECT * FROM subscriptions
       WHERE user_id = ? AND status = 'active' AND expires_at > datetime('now')
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .get(userId) as Record<string, unknown> | undefined;

  if (!row) {
    return NextResponse.json({ subscription: null });
  }

  return NextResponse.json({
    subscription: {
      id: row.id,
      plan: row.plan,
      billingCycle: row.billing_cycle,
      status: row.status,
      expiresAt: row.expires_at,
    },
  });
}
