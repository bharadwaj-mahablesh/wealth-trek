import { useState, useEffect } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { FinancialGoal } from '@/types';

export function useFinancialGoals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItem<FinancialGoal[]>(STORAGE_KEYS.FINANCIAL_GOALS).then((stored) => {
      if (stored) setGoals(stored);
      setLoading(false);
    });
  }, []);

  const persist = async (updated: FinancialGoal[]) => {
    setGoals(updated);
    await setItem(STORAGE_KEYS.FINANCIAL_GOALS, updated);
  };

  const addGoal = async (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'status'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    await persist([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
    await persist(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = async (id: string) => {
    await persist(goals.filter((g) => g.id !== id));
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const pausedGoals = goals.filter((g) => g.status === 'paused');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return { goals, activeGoals, pausedGoals, completedGoals, loading, addGoal, updateGoal, deleteGoal };
}
