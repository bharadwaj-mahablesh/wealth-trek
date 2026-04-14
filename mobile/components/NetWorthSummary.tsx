import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface NetWorthSummaryProps {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (absValue >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function NetWorthSummary({ totalAssets, totalLiabilities, netWorth }: NetWorthSummaryProps) {
  const { isDark } = useTheme();

  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';
  const negativeColor = '#dc2626';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';

  return (
    <View style={{
      backgroundColor: bgColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor,
      padding: 20,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 4 }}>Total Assets</Text>
          <Text style={{ color: positiveColor, fontSize: 18, fontWeight: '700' }}>
            {formatCurrency(totalAssets)}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: borderColor }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 4 }}>Liabilities</Text>
          <Text style={{ color: negativeColor, fontSize: 18, fontWeight: '700' }}>
            {formatCurrency(totalLiabilities)}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: borderColor }} />
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 4 }}>Net Worth</Text>
          <Text style={{ color: primaryColor, fontSize: 18, fontWeight: '700' }}>
            {formatCurrency(netWorth)}
          </Text>
        </View>
      </View>
    </View>
  );
}
