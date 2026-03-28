import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { isPaidPlan, getPlanAmount, type PlanId, type BillingCycle } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    billingCycle,
  } = body as {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    plan: string;
    billingCycle: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment details" },
      { status: 400 }
    );
  }

  if (!plan || !isPaidPlan(plan) || !billingCycle) {
    return NextResponse.json(
      { error: "Invalid plan or billing cycle" },
      { status: 400 }
    );
  }

  // Verify HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid payment signature" },
      { status: 400 }
    );
  }

  // Calculate expiry date
  const now = new Date();
  const expiresAt = new Date(now);
  if (billingCycle === "yearly") {
    expiresAt.setDate(expiresAt.getDate() + 365);
  } else {
    expiresAt.setDate(expiresAt.getDate() + 30);
  }

  const amount = getPlanAmount(plan as PlanId, billingCycle as BillingCycle);

  const db = getDb();
  const id = uuidv4();

  db.prepare(
    `INSERT INTO subscriptions (id, user_id, razorpay_order_id, razorpay_payment_id, plan, billing_cycle, amount, currency, status, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'INR', 'active', ?)`
  ).run(
    id,
    userId,
    razorpay_order_id,
    razorpay_payment_id,
    plan,
    billingCycle,
    amount,
    expiresAt.toISOString()
  );

  return NextResponse.json({
    success: true,
    subscription: {
      id,
      plan,
      billingCycle,
      status: "active",
      expiresAt: expiresAt.toISOString(),
    },
  });
}
