"use client";

import { useState, useEffect, useCallback } from "react";

export interface Subscription {
  id: string;
  plan: string;
  billingCycle: string;
  status: string;
  expiresAt: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription");
      if (!res.ok) {
        setSubscription(null);
        return;
      }
      const data = await res.json();
      setSubscription(data.subscription ?? null);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return { subscription, loading, refetch: fetchSubscription };
}
