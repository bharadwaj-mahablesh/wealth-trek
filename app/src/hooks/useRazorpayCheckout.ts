"use client";

import { useState, useCallback } from "react";
import { loadRazorpayScript } from "@/lib/razorpay";
import type { PlanId, BillingCycle } from "@/lib/pricing";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CheckoutResult {
  success: boolean;
  subscription?: {
    id: string;
    plan: string;
    billingCycle: string;
    status: string;
    expiresAt: string;
  };
  error?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function useRazorpayCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const initiateCheckout = useCallback(
    async (plan: PlanId, billingCycle: BillingCycle) => {
      setLoading(true);
      setResult(null);

      try {
        // 1. Create order on server
        const orderRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, billingCycle }),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json();
          throw new Error(err.error || "Failed to create order");
        }

        const { orderId, razorpayKeyId, amount, currency } =
          await orderRes.json();

        // 2. Load Razorpay script
        await loadRazorpayScript();

        // 3. Open Razorpay Checkout modal
        return new Promise<CheckoutResult>((resolve) => {
          const options = {
            key: razorpayKeyId,
            amount,
            currency,
            name: "Wealth Tracker",
            description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan — ${billingCycle}`,
            order_id: orderId,
            handler: async (response: RazorpaySuccessResponse) => {
              try {
                // 4. Verify payment on server
                const verifyRes = await fetch("/api/payments/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    plan,
                    billingCycle,
                  }),
                });

                if (!verifyRes.ok) {
                  const err = await verifyRes.json();
                  const res: CheckoutResult = {
                    success: false,
                    error: err.error || "Payment verification failed",
                  };
                  setResult(res);
                  setLoading(false);
                  resolve(res);
                  return;
                }

                const data = await verifyRes.json();
                const res: CheckoutResult = {
                  success: true,
                  subscription: data.subscription,
                };
                setResult(res);
                setLoading(false);
                resolve(res);
              } catch {
                const res: CheckoutResult = {
                  success: false,
                  error: "Payment verification failed",
                };
                setResult(res);
                setLoading(false);
                resolve(res);
              }
            },
            modal: {
              ondismiss: () => {
                const res: CheckoutResult = {
                  success: false,
                  error: "Payment cancelled",
                };
                setResult(res);
                setLoading(false);
                resolve(res);
              },
            },
            theme: {
              color: "#7c3aed",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      } catch (error) {
        const res: CheckoutResult = {
          success: false,
          error:
            error instanceof Error ? error.message : "Checkout failed",
        };
        setResult(res);
        setLoading(false);
        return res;
      }
    },
    []
  );

  const clearResult = useCallback(() => setResult(null), []);

  return { initiateCheckout, loading, result, clearResult };
}
