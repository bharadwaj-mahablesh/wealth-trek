export type PlanId = "free" | "professional" | "enterprise";
export type BillingCycle = "monthly" | "yearly";

export interface PlanConfig {
  id: PlanId;
  name: string;
  pricing: {
    monthly: { amount: number; display: string; billing: string };
    yearly: { amount: number; display: string; billing: string };
  };
}

/**
 * Canonical pricing configuration.
 * Amounts are in paise (INR smallest unit) for Razorpay.
 * Used by both the pricing page (display) and API routes (order creation).
 */
export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    pricing: {
      monthly: { amount: 0, display: "₹0", billing: "forever" },
      yearly: { amount: 0, display: "₹0", billing: "forever" },
    },
  },
  professional: {
    id: "professional",
    name: "Professional",
    pricing: {
      monthly: { amount: 25000, display: "₹250", billing: "per month" },
      yearly: { amount: 250000, display: "₹2,500", billing: "per year" },
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    pricing: {
      monthly: { amount: 499900, display: "₹4,999", billing: "per month" },
      yearly: { amount: 4999000, display: "₹49,990", billing: "per year" },
    },
  },
};

export const PAID_PLANS: PlanId[] = ["professional", "enterprise"];

export function isPaidPlan(plan: string): plan is PlanId {
  return PAID_PLANS.includes(plan as PlanId);
}

export function getPlanAmount(plan: PlanId, billingCycle: BillingCycle): number {
  return PLANS[plan].pricing[billingCycle].amount;
}
