import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useStatements } from '@/hooks/useStatements';
import { useNetWorthHistory } from '@/hooks/useNetWorthHistory';
import { PieChart } from '@/components/charts/PieChart';

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function MetricCard({ label, value, change, isDark }: { label: string; value: string; change: number | null; isDark: boolean }) {
  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';
  const negativeColor = '#dc2626';
  const isPositive = (change ?? 0) >= 0;
  return (
    <View style={{ flex: 1, backgroundColor: bgColor, borderRadius: 14, borderWidth: 1, borderColor, padding: 12 }}>
      <Text style={{ color: mutedColor, fontSize: 10, marginBottom: 4 }}>{label}</Text>
      <Text style={{ color: textColor, fontSize: 14, fontWeight: '700', marginBottom: 4 }}>{value}</Text>
      {change !== null ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          {change > 0 ? <TrendingUp size={11} color={positiveColor} /> : change < 0 ? <TrendingDown size={11} color={negativeColor} /> : <Minus size={11} color={mutedColor} />}
          <Text style={{ color: isPositive ? positiveColor : negativeColor, fontSize: 10, fontWeight: '600' }}>
            {change > 0 ? '+' : ''}{formatCurrency(change)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function AnalyticsScreen() {
  const { isDark } = useTheme();
  const { assets, liabilities, totalAssets, totalLiabilities, netWorth, loading: stmtLoading, refresh: refreshStmt } = useStatements();
  const { latest, previous, netWorthChange, loading: snapLoading, refresh: refreshSnap } = useNetWorthHistory();

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';

  const loading = stmtLoading || snapLoading;
  const refresh = () => { refreshStmt(); refreshSnap(); };
  const assetsChange = latest && previous ? latest.totalAssets - previous.totalAssets : null;
  const liabilitiesChange = latest && previous ? latest.totalLiabilities - previous.totalLiabilities : null;

  const assetPieData = Object.entries(
    assets.reduce<Record<string, number>>((acc, s) => {
      acc[s.statementType] = (acc[s.statementType] ?? 0) + s.closingBalance * (s.ownershipPercentage / 100);
      return acc;
    }, {})
  ).map(([label, value]) => ({ label, value })).filter((d) => d.value > 0);

  const liabilityPieData = Object.entries(
    liabilities.reduce<Record<string, number>>((acc, s) => {
      acc[s.statementType] = (acc[s.statementType] ?? 0) + s.closingBalance * (s.ownershipPercentage / 100);
      return acc;
    }, {})
  ).map(([label, value]) => ({ label, value })).filter((d) => d.value > 0);

  const topMovers = latest && previous ? (() => {
    const prevMap = Object.fromEntries(previous.entries.map((e) => [e.statementType, e.closingBalance * (e.ownershipPercentage / 100)]));
    return latest.entries
      .map((e) => ({ label: e.statementType, change: e.closingBalance * (e.ownershipPercentage / 100) - (prevMap[e.statementType] ?? 0) }))
      .filter((m) => m.change !== 0)
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 5);
  })() : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={primaryColor} />}
      >
        <View style={{ paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: textColor }}>Analytics</Text>
          <Text style={{ color: mutedColor, marginTop: 2 }}>Insights & trends</Text>
        </View>

        <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginBottom: 10 }}>Change vs Last Snapshot</Text>
        {!latest || !previous ? (
          <View style={{ backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, padding: 20, alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: mutedColor, textAlign: 'center', fontSize: 13 }}>Save 2+ snapshots to see change metrics.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <MetricCard label="Net Worth" value={formatCurrency(latest.netWorth)} change={netWorthChange} isDark={isDark} />
            <MetricCard label="Assets" value={formatCurrency(latest.totalAssets)} change={assetsChange} isDark={isDark} />
            <MetricCard label="Liabilities" value={formatCurrency(latest.totalLiabilities)} change={liabilitiesChange} isDark={isDark} />
          </View>
        )}

        {topMovers.length > 0 ? (
          <>
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginBottom: 10 }}>Top Movements</Text>
            <View style={{ backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, padding: 14, marginBottom: 16 }}>
              {topMovers.map((m, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: i < topMovers.length - 1 ? 1 : 0, borderBottomColor: borderColor }}>
                  <Text style={{ color: textColor, fontSize: 13, flex: 1 }} numberOfLines={1}>{m.label}</Text>
                  <Text style={{ color: m.change >= 0 ? (isDark ? '#6aab8a' : '#16a34a') : '#dc2626', fontWeight: '700', fontSize: 13 }}>
                    {m.change >= 0 ? '+' : ''}{formatCurrency(m.change)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginBottom: 10 }}>Portfolio Breakdown</Text>
        <View style={{ marginBottom: 12 }}>
          <PieChart data={assetPieData} title="Asset Breakdown" />
        </View>
        <View style={{ marginBottom: 16 }}>
          <PieChart data={liabilityPieData} title="Liability Breakdown" />
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
