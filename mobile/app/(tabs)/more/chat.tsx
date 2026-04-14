import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Trash2 } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '@/components/ThemeProvider';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useFinancialGoals } from '@/hooks/useFinancialGoals';
import { ChatMessage as ChatMessageComponent } from '@/components/ChatMessage';
import { createApiClient } from '@/lib/api';
import { CHAT_GOAL_MARKER } from '@/lib/constants';
import { ChatMessage } from '@/types';

export default function ChatScreen() {
  const { isDark } = useTheme();
  const { getToken } = useAuth();
  const { messages, addMessage, updateLastMessage, clearHistory } = useChatHistory();
  const { addGoal } = useFinancialGoals();
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const inputBg = isDark ? '#1e2228' : '#eef0f4';

  const api = createApiClient(getToken);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = await addMessage(userMsg);
    setStreaming(true);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    await addMessage(assistantMsg);
    scrollRef.current?.scrollToEnd({ animated: true });

    try {
      let fullContent = '';
      const apiMessages = updatedMessages.map((m) => ({ role: m.role, content: m.content }));
      for await (const chunk of api.streamChat(apiMessages as any)) {
        fullContent += chunk;
        await updateLastMessage(fullContent);
        scrollRef.current?.scrollToEnd({ animated: false });
      }

      if (fullContent.includes(CHAT_GOAL_MARKER)) {
        const parts = fullContent.split(CHAT_GOAL_MARKER);
        const cleanContent = parts[0].trim();
        await updateLastMessage(cleanContent);
        const goalJson = parts[1]?.trim();
        if (goalJson) {
          try {
            const goalData = JSON.parse(goalJson);
            Alert.alert(
              'Save Goal?',
              `"${goalData.title}" has been detected. Save it to your goals?`,
              [
                { text: 'Skip', style: 'cancel' },
                { text: 'Save', onPress: () => addGoal(goalData) },
              ]
            );
          } catch {}
        }
      }
    } catch (e: any) {
      await updateLastMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, messages]);

  const handleClear = () => {
    Alert.alert('Clear History', 'Delete all chat messages?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        {messages.length > 0 ? (
          <TouchableOpacity
            onPress={handleClear}
            style={{ position: 'absolute', top: 8, right: 16, zIndex: 10, padding: 8 }}
          >
            <Trash2 size={18} color={mutedColor} />
          </TouchableOpacity>
        ) : null}

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 20, marginBottom: 16 }}>
              <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginBottom: 6 }}>AI Financial Assistant</Text>
              <Text style={{ color: mutedColor, fontSize: 13, lineHeight: 20 }}>
                Ask me about wealth building strategies, budgeting, investments, or your financial goals. I can also help create structured goals from our conversation.
              </Text>
            </View>
          ) : null}
          {messages.map((msg, i) => (
            <ChatMessageComponent
              key={msg.id}
              message={msg}
              isStreaming={streaming && i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: borderColor, backgroundColor: cardBg }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <TextInput
              style={{
                flex: 1, backgroundColor: inputBg, borderRadius: 14, paddingHorizontal: 14,
                paddingTop: 10, paddingBottom: 10, color: textColor, fontSize: 15, maxHeight: 100,
              }}
              placeholder="Ask anything about your finances..."
              placeholderTextColor={mutedColor}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || streaming}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: !input.trim() || streaming ? (isDark ? '#252a32' : '#d8dde5') : primaryColor,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Send size={18} color={!input.trim() || streaming ? mutedColor : (isDark ? '#0f1115' : '#ffffff')} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
