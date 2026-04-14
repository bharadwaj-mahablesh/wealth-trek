import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { WealthTrekLogo } from '@/components/WealthTrekLogo';
import { useStatements } from '@/hooks/useStatements';
import { useNetWorthHistory } from '@/hooks/useNetWorthHistory';
import { NetWorthCard } from '@/components/NetWorthCard';
import { InsightCard } from '@/components/ui/InsightCard';
import { StatementForm } from '@/components/StatementForm';
import { StatementEntry } from '@/types';

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function DashboardScreen() {
  const { isDark } = useTheme();
  const {
    totalAssets, totalLiabilities, netWorth, loading: stmtLoading,
    refresh: refreshStatements, addStatement,
  } = useStatements();
  const {
    latest, netWorthChange, netWorthChangePct,
    loading: snapLoading, refresh: refreshSnapshots,
  } = useNetWorthHistory();

  const [formVisible, setFormVisible] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState<'asset' | 'liability'>('asset');

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';

  const loading = stmtLoading || snapLoading;
  const refresh = () => { refreshStatements(); refreshSnapshots(); };

  const liabilityRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  const handleAddStatement = async (entry: Omit<StatementEntry, 'id'>) => {
    await addStatement(entry);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={primaryColor} />}
      >
        <View style={{ paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <WealthTrekLogo size={24} color={primaryColor} style={{ marginBottom: 4 }} />
            <Text style={{ fontSize: 24, fontWeight: '700', color: textColor }}>Dashboard</Text>
            <Text style={{ color: mutedColor, marginTop: 2 }}>Your wealth overview</Text>
          </View>
        </View>

        <NetWorthCard netWorth={netWorth} change={netWorthChange} changePct={netWorthChangePct} />

        {/* Summary row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, padding: 14 }}>
            <Text style={{ color: mutedColor, fontSize: 11, marginBottom: 4 }}>Total Assets</Text>
            <Text style={{ color: positiveColor, fontSize: 17, fontWeight: '700' }}>{formatCurrency(totalAssets)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, padding: 14 }}>
            <Text style={{ color: mutedColor, fontSize: 11, marginBottom: 4 }}>Liabilities</Text>
            <Text style={{ color: '#dc2626', fontSize: 17, fontWeight: '700' }}>{formatCurrency(totalLiabilities)}</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => { setDefaultCategory('asset'); setFormVisible(true); }}
            style={{ flex: 1, backgroundColor: positiveColor, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Plus size={18} color="#ffffff" />
            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>Add Asset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setDefaultCategory('liability'); setFormVisible(true); }}
            style={{ flex: 1, backgroundColor: '#dc2626', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Plus size={18} color="#ffffff" />
            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>Add Liability</Text>
          </TouchableOpacity>
        </View>

        {/* Insights */}
        <Text style={{ color: textColor, fontWeight: '600', fontSize: 16, marginBottom: 12 }}>Insights</Text>

        {netWorth === 0 && totalAssets === 0 ? (
          <InsightCard
            icon={<Activity size={18} color={primaryColor} />}
            title="Get Started"
            description="Add your assets and liabilities in the Snapshot tab to see your net worth here."
            accent="neutral"
          />
        ) : (
          <>
            {netWorthChange !== null && (
              <InsightCard
                icon={netWorthChange >= 0
                  ? <TrendingUp size={18} color={positiveColor} />
                  : <TrendingDown size={18} color="#dc2626" />
                }
                title={netWorthChange >= 0 ? 'Net Worth Growing' : 'Net Worth Declined'}
                description={`Your net worth ${netWorthChange >= 0 ? 'increased' : 'decreased'} by ${formatCurrency(Math.abs(netWorthChange))} since your last snapshot.`}
                accent={netWorthChange >= 0 ? 'positive' : 'negative'}
              />
            )}
            {liabilityRatio > 50 && (
              <InsightCard
                icon={<AlertCircle size={18} color="#dc2626" />}
                title="High Liability Ratio"
                description={`Your liabilities are ${liabilityRatio.toFixed(0)}% of your total assets. Consider reducing debt.`}
                accent="negative"
              />
            )}
            {liabilityRatio <= 30 && totalAssets > 0 && (
              <InsightCard
                icon={<TrendingUp size={18} color={positiveColor} />}
                title="Healthy Balance Sheet"
                description={`Your liabilities are only ${liabilityRatio.toFixed(0)}% of your assets — great financial health!`}
                accent="positive"
              />
            )}
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <StatementForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSave={handleAddStatement}
        editEntry={null}
      />
    </SafeAreaView>
  );
}
