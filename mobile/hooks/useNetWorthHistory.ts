import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { createApiClient } from '@/lib/api';
import { NetWorthSnapshot, StatementEntry } from '@/types';

export function useNetWorthHistory() {
  const { getToken } = useAuth();
  const [snapshots, setSnapshots] = useState<NetWorthSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = createApiClient(getToken);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSnapshots();
      setSnapshots(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const saveSnapshot = async (entries: StatementEntry[], date: string) => {
    const totalAssets = entries.filter((e) => e.category === 'asset').reduce((sum, e) => sum + e.closingBalance, 0);
    const totalLiabilities = entries.filter((e) => e.category === 'liability').reduce((sum, e) => sum + Math.abs(e.closingBalance), 0);
    const netWorth = totalAssets - totalLiabilities;
    
    const created = await api.createSnapshot({ date, entries, totalAssets, totalLiabilities, netWorth });
    setSnapshots((prev) => [...prev, created].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    return created;
  };

  const deleteSnapshot = async (id: string) => {
    await api.deleteSnapshot(id);
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const latest = snapshots[snapshots.length - 1] ?? null;
  const previous = snapshots[snapshots.length - 2] ?? null;

  const netWorthChange = latest && previous
    ? latest.netWorth - previous.netWorth
    : null;

  const netWorthChangePct = latest && previous && previous.netWorth !== 0
    ? ((latest.netWorth - previous.netWorth) / Math.abs(previous.netWorth)) * 100
    : null;

  return {
    snapshots,
    latest,
    previous,
    netWorthChange,
    netWorthChangePct,
    loading,
    error,
    refresh: fetch,
    saveSnapshot,
    deleteSnapshot,
  };
}
