import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: 'positive' | 'negative' | 'neutral';
}

export function InsightCard({ icon, title, description, accent = 'neutral' }: InsightCardProps) {
  const { isDark } = useTheme();

  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';

  const accentColors = {
    positive: isDark ? '#6aab8a' : '#16a34a',
    negative: '#dc2626',
    neutral: isDark ? '#6ba3b8' : '#1a6b8a',
  };
  const accentBg = {
    positive: isDark ? 'rgba(106,171,138,0.15)' : 'rgba(22,163,74,0.08)',
    negative: isDark ? 'rgba(127,29,29,0.3)' : 'rgba(220,38,38,0.08)',
    neutral: isDark ? 'rgba(107,163,184,0.15)' : 'rgba(26,107,138,0.08)',
  };

  return (
    <View style={{
      backgroundColor: bgColor,
      borderRadius: 14,
      borderWidth: 1,
      borderColor,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: accentBg[accent],
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12,
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontWeight: '600', fontSize: 14, marginBottom: 2 }}>{title}</Text>
        <Text style={{ color: mutedColor, fontSize: 13, lineHeight: 18 }}>{description}</Text>
      </View>
    </View>
  );
}
