import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { createApiClient } from '@/lib/api';
import { StatementEntry } from '@/types';

export function useStatements() {
  const { getToken } = useAuth();
  const [statements, setStatements] = useState<StatementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = createApiClient(getToken);

  const fetchStatements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStatements();
      setStatements(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatements(); }, [fetchStatements]);

  const addStatement = async (entry: Omit<StatementEntry, 'id'>) => {
    const created = await api.createStatements([entry]);
    setStatements((prev) => [...prev, ...created]);
    return created[0];
  };

  const updateStatement = async (id: string, updates: Partial<Omit<StatementEntry, 'id'>>) => {
    const updated = await api.updateStatement(id, updates);
    setStatements((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteStatement = async (id: string) => {
    await api.deleteStatement(id);
    setStatements((prev) => prev.filter((s) => s.id !== id));
  };

  const assets = statements.filter((s) => s.category === 'asset');
  const liabilities = statements.filter((s) => s.category === 'liability');
  const totalAssets = assets.reduce((sum, s) => sum + s.closingBalance * (s.ownershipPercentage / 100), 0);
  const totalLiabilities = liabilities.reduce((sum, s) => sum + s.closingBalance * (s.ownershipPercentage / 100), 0);
  const netWorth = totalAssets - totalLiabilities;

  return {
    statements,
    assets,
    liabilities,
    totalAssets,
    totalLiabilities,
    netWorth,
    loading,
    error,
    refresh: fetchStatements,
    addStatement,
    updateStatement,
    deleteStatement,
  };
}
