import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

interface NetWorthCardProps {
  netWorth: number;
  change: number | null;
  changePct: number | null;
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function NetWorthCard({ netWorth, change, changePct }: NetWorthCardProps) {
  const { isDark } = useTheme();

  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';
  const negativeColor = '#dc2626';

  const isPositive = (change ?? 0) >= 0;
  const changeColor = isPositive ? positiveColor : negativeColor;

  return (
    <View style={{
      backgroundColor: bgColor,
      borderRadius: 20,
      borderWidth: 1,
      borderColor,
      padding: 24,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    }}>
      <Text style={{ color: mutedColor, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
        Net Worth
      </Text>
      <Text style={{ color: primaryColor, fontSize: 36, fontWeight: '800', marginBottom: 8 }}>
        {formatCurrency(netWorth)}
      </Text>
      {change !== null && changePct !== null ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isPositive
            ? <TrendingUp size={16} color={changeColor} />
            : <TrendingDown size={16} color={changeColor} />
          }
          <Text style={{ color: changeColor, fontWeight: '600', fontSize: 14, marginLeft: 4 }}>
            {isPositive ? '+' : ''}{formatCurrency(change)} ({isPositive ? '+' : ''}{changePct.toFixed(1)}%)
          </Text>
          <Text style={{ color: mutedColor, fontSize: 12, marginLeft: 4 }}>vs last snapshot</Text>
        </View>
      ) : (
        <Text style={{ color: mutedColor, fontSize: 13 }}>Save a snapshot to track changes</Text>
      )}
    </View>
  );
}
