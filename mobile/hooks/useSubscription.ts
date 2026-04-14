import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { createApiClient } from '@/lib/api';
import { UserSubscription } from '@/types';

export function useSubscription() {
  const { getToken } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const api = createApiClient(getToken);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getSubscription();
      setSubscription(data);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const isPro = subscription?.status === 'active' &&
    (subscription.planId === 'professional' || subscription.planId === 'enterprise');

  return { subscription, loading, isPro, refresh: fetch };
}
