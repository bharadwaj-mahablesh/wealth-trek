import { STATEMENT_TYPE_PRESETS } from '@/types';

export { STATEMENT_TYPE_PRESETS };

export const STORAGE_KEYS = {
  CHAT_HISTORY: 'financial-chat-history',
  FINANCIAL_GOALS: 'financial-goals',
  USER_PROFILE: 'user-profile',
  THEME: 'theme-preference',
} as const;

export const API_ENDPOINTS = {
  STATEMENTS: '/api/statements',
  SNAPSHOTS: '/api/snapshots',
  DOCUMENTS: '/api/documents',
  CHAT: '/api/chat',
  PAYMENTS: '/api/payments',
  SUBSCRIPTION: '/api/subscription',
} as const;

export const CHAT_GOAL_MARKER = '|||GOAL|||';

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'Basic tracking for individuals',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Unlimited snapshots',
      'Basic net worth tracking',
      'Manual statement entry',
      'Email support',
    ],
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    description: 'For serious wealth builders',
    priceMonthly: 299,
    priceYearly: 2990,
    features: [
      'Everything in Free',
      'AI document extraction',
      'AI financial chat',
      'Goal tracking',
      'PDF certificates',
      'Priority support',
    ],
    isPopular: true,
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For families and advisors',
    priceMonthly: 799,
    priceYearly: 7990,
    features: [
      'Everything in Professional',
      'Multiple profiles',
      'Family sharing',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
} as const;
