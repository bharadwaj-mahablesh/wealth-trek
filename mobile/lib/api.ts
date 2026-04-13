import {
  StatementEntry,
  NetWorthSnapshot,
  UploadedDocument,
  ExtractedEntry,
  ChatMessage,
  UserSubscription,
} from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const REQUEST_TIMEOUT_MS = 15000;

type UnauthorizedListener = () => void;
let _unauthorizedListener: UnauthorizedListener | null = null;
export function setUnauthorizedListener(fn: UnauthorizedListener) { _unauthorizedListener = fn; }
export function clearUnauthorizedListener() { _unauthorizedListener = null; }

export class AuthError extends Error { constructor() { super('Session expired. Please sign in again.'); } }

export function createApiClient(getToken: () => Promise<string | null>) {
  async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await getToken();
    console.log("[Mobile API] getToken() returned:", token ? "a valid token" : "null");
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, { ...options, headers, signal: controller.signal });
    } catch (e: any) {
      clearTimeout(timer);
      if (e.name === 'AbortError') throw new Error('Request timed out. Check your connection.');
      throw e;
    }
    clearTimeout(timer);

    if (res.status === 401) {
      _unauthorizedListener?.();
      throw new AuthError();
    }
    return res;
  }

  // Statements
  async function getStatements(): Promise<StatementEntry[]> {
    const res = await fetchWithAuth('/api/statements');
    if (!res.ok) throw new Error('Failed to fetch statements');
    const data = await res.json();
    return data.statements;
  }

  async function createStatements(
    entries: Omit<StatementEntry, 'id'>[]
  ): Promise<StatementEntry[]> {
    const res = await fetchWithAuth('/api/statements', {
      method: 'POST',
      body: JSON.stringify(entries),
    });
    if (!res.ok) throw new Error('Failed to create statements');
    const data = await res.json();
    return data.statements;
  }

  async function updateStatement(
    id: string,
    updates: Partial<Omit<StatementEntry, 'id'>>
  ): Promise<StatementEntry> {
    const res = await fetchWithAuth(`/api/statements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update statement');
    const data = await res.json();
    return data.statement;
  }

  async function deleteStatement(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/statements/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete statement');
  }

  // Snapshots
  async function getSnapshots(): Promise<NetWorthSnapshot[]> {
    const res = await fetchWithAuth('/api/snapshots');
    if (!res.ok) throw new Error('Failed to fetch snapshots');
    const data = await res.json();
    return data.snapshots;
  }

  async function createSnapshot(data: {
    date: string;
    entries: StatementEntry[];
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  }): Promise<NetWorthSnapshot> {
    const res = await fetchWithAuth('/api/snapshots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create snapshot');
    const result = await res.json();
    return result.snapshot;
  }

  async function deleteSnapshot(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/snapshots/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete snapshot');
  }

  // Documents
  async function uploadDocument(file: { uri: string; name: string; type: string }): Promise<UploadedDocument> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const token = await getToken();
    const res = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    const data = await res.json();
    return data.document;
  }

  async function extractDocument(
    documentId: string,
    type: 'pdf' | 'image'
  ): Promise<ExtractedEntry[]> {
    const res = await fetchWithAuth(`/api/documents/${documentId}/extract`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error('Failed to extract document');
    const data = await res.json();
    return data.entries;
  }

  async function deleteDocument(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
  }

  // Chat
  async function* streamChat(
    messages: ChatMessage[],
    snapshotSummary?: { assets: number; liabilities: number; netWorth: number }
  ): AsyncGenerator<string, void, unknown> {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ messages, snapshotSummary }),
    });

    if (!res.ok) throw new Error('Failed to stream chat');

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          yield data;
        }
      }
    }
  }

  // Subscription
  async function getSubscription(): Promise<UserSubscription | null> {
    const res = await fetchWithAuth('/api/subscription');
    if (!res.ok) return null;
    const data = await res.json();
    return data.subscription;
  }

  // Payments
  async function createPaymentOrder(plan: string, cycle: 'monthly' | 'yearly'): Promise<{
    orderId: string;
    amount: number;
    currency: string;
  }> {
    const res = await fetchWithAuth('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ plan, cycle }),
    });
    if (!res.ok) throw new Error('Failed to create payment order');
    return res.json();
  }

  async function verifyPayment(data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }): Promise<boolean> {
    const res = await fetchWithAuth('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to verify payment');
    const result = await res.json();
    return result.success;
  }

  return {
    getStatements,
    createStatements,
    updateStatement,
    deleteStatement,
    getSnapshots,
    createSnapshot,
    deleteSnapshot,
    uploadDocument,
    extractDocument,
    deleteDocument,
    streamChat,
    getSubscription,
    createPaymentOrder,
    verifyPayment,
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
