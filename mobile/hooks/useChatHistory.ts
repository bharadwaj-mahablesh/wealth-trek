import { useState, useEffect } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { ChatMessage } from '@/types';

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItem<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY).then((stored) => {
      if (stored) setMessages(stored);
      setLoading(false);
    });
  }, []);

  const addMessage = async (message: ChatMessage) => {
    const updated = [...messages, message];
    setMessages(updated);
    await setItem(STORAGE_KEYS.CHAT_HISTORY, updated);
    return updated;
  };

  const updateLastMessage = async (content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], content };
      }
      setItem(STORAGE_KEYS.CHAT_HISTORY, updated);
      return updated;
    });
  };

  const clearHistory = async () => {
    setMessages([]);
    await setItem(STORAGE_KEYS.CHAT_HISTORY, []);
  };

  return { messages, loading, addMessage, updateLastMessage, clearHistory };
}
