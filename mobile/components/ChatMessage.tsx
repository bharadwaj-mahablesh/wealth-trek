import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const { isDark } = useTheme();
  const isUser = message.role === 'user';

  const userBg = isDark ? '#6ba3b8' : '#1a6b8a';
  const aiBg = isDark ? '#1a1e24' : '#ffffff';
  const aiBorder = isDark ? '#252a32' : '#d8dde5';
  const userText = isDark ? '#0f1115' : '#ffffff';
  const aiText = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
      paddingHorizontal: 4,
    }}>
      {!isUser ? (
        <View style={{
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: isDark ? '#6ba3b8' : '#1a6b8a',
          alignItems: 'center', justifyContent: 'center',
          marginRight: 8, marginTop: 2,
        }}>
          <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>AI</Text>
        </View>
      ) : null}

      <View style={{ maxWidth: '78%' }}>
        <View style={{
          backgroundColor: isUser ? userBg : aiBg,
          borderRadius: 16,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          padding: 12,
          borderWidth: isUser ? 0 : 1,
          borderColor: aiBorder,
        }}>
          <Text style={{
            color: isUser ? userText : aiText,
            fontSize: 14,
            lineHeight: 20,
          }}>
            {message.content}
            {isStreaming ? <Text style={{ color: isUser ? userText : (isDark ? '#6ba3b8' : '#1a6b8a') }}>▊</Text> : null}
          </Text>
        </View>
        <Text style={{ color: mutedColor, fontSize: 10, marginTop: 3, textAlign: isUser ? 'right' : 'left', paddingHorizontal: 4 }}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}
