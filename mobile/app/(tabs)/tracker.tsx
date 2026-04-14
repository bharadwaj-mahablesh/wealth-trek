import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, Trash2, Download } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/components/ThemeProvider';
import { useNetWorthHistory } from '@/hooks/useNetWorthHistory';
import { useUserProfile } from '@/hooks/useUserProfile';
import { NetWorthTrendChart } from '@/components/charts/NetWorthTrendChart';
import { NetWorthSnapshot } from '@/types';
import { generateNetWorthHtml } from '@/lib/generatePdf';
import { hapticLight, hapticSuccess, hapticError } from '@/lib/haptics';

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TrackerScreen() {
  const { isDark } = useTheme();
  const { snapshots, loading, refresh, deleteSnapshot } = useNetWorthHistory();
  const { profile } = useUserProfile();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';
  const negativeColor = '#dc2626';

  const handleExportPdf = async (snapshot: NetWorthSnapshot) => {
    hapticLight();
    setExporting(true);
    try {
      const html = generateNetWorthHtml(snapshot, profile);
      const { uri } = await Print.printToFileAsync({ html });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share Net Worth Statement' });
        hapticSuccess();
      } else {
        Alert.alert('Saved', `PDF saved to: ${uri}`);
      }
    } catch (e: any) {
      hapticError();
      Alert.alert('Error', e.message || 'Failed to generate PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = (snapshot: NetWorthSnapshot) => {
    Alert.alert('Delete Snapshot', `Delete snapshot from ${formatDate(snapshot.date)}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSnapshot(snapshot.id) },
    ]);
  };

  const sortedSnapshots = [...snapshots].reverse();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={primaryColor} />}
      >
        <View style={{ paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: textColor }}>Tracker</Text>
          <Text style={{ color: mutedColor, marginTop: 2 }}>Your wealth over time</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <NetWorthTrendChart snapshots={snapshots} height={240} />
        </View>

        <Text style={{ color: textColor, fontWeight: '600', fontSize: 16, marginBottom: 12 }}>
          Snapshot History ({snapshots.length})
        </Text>

        {sortedSnapshots.length === 0 ? (
          <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 32, alignItems: 'center' }}>
            <Text style={{ color: mutedColor, textAlign: 'center' }}>
              No snapshots yet. Save your first snapshot from the Snapshot tab.
            </Text>
          </View>
        ) : null}

        {sortedSnapshots.map((snapshot, index) => {
          const prev = sortedSnapshots[index + 1];
          const change = prev ? snapshot.netWorth - prev.netWorth : null;
          const isExpanded = expandedId === snapshot.id;
          const assetEntries = snapshot.entries.filter((e) => e.category === 'asset');
          const liabilityEntries = snapshot.entries.filter((e) => e.category === 'liability');

          return (
            <View key={snapshot.id} style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, marginBottom: 10, overflow: 'hidden' }}>
              <TouchableOpacity
                onPress={() => setExpandedId(isExpanded ? null : snapshot.id)}
                style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>{formatDate(snapshot.date)}</Text>
                  <Text style={{ color: primaryColor, fontSize: 18, fontWeight: '700' }}>
                    {formatCurrency(snapshot.netWorth)}
                  </Text>
                  {change !== null ? (
                    <Text style={{ color: change >= 0 ? positiveColor : negativeColor, fontSize: 12, marginTop: 2 }}>
                      {change >= 0 ? '+' : ''}{formatCurrency(change)} from previous
                    </Text>
                  ) : null}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity onPress={() => handleExportPdf(snapshot)} disabled={exporting} style={{ padding: 8 }}>
                    <Download size={16} color={primaryColor} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(snapshot)} style={{ padding: 8 }}>
                    <Trash2 size={16} color={negativeColor} />
                  </TouchableOpacity>
                  {isExpanded ? <ChevronUp size={20} color={mutedColor} /> : <ChevronDown size={20} color={mutedColor} />}
                </View>
              </TouchableOpacity>

              {isExpanded ? (
                <View style={{ borderTopWidth: 1, borderTopColor: borderColor, padding: 16 }}>
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <View style={{ flex: 1, alignItems: 'center', backgroundColor: isDark ? '#0f1115' : '#f7f8fa', borderRadius: 10, padding: 12 }}>
                      <Text style={{ color: mutedColor, fontSize: 11 }}>Assets</Text>
                      <Text style={{ color: positiveColor, fontWeight: '700', fontSize: 15 }}>{formatCurrency(snapshot.totalAssets)}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', backgroundColor: isDark ? '#0f1115' : '#f7f8fa', borderRadius: 10, padding: 12 }}>
                      <Text style={{ color: mutedColor, fontSize: 11 }}>Liabilities</Text>
                      <Text style={{ color: negativeColor, fontWeight: '700', fontSize: 15 }}>{formatCurrency(snapshot.totalLiabilities)}</Text>
                    </View>
                  </View>

                  {assetEntries.length > 0 ? (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: positiveColor, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Assets</Text>
                      {assetEntries.map((e) => (
                        <View key={e.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                          <Text style={{ color: textColor, fontSize: 13 }} numberOfLines={1}>{e.statementType}</Text>
                          <Text style={{ color: positiveColor, fontSize: 13, fontWeight: '600' }}>
                            {formatCurrency(e.closingBalance * (e.ownershipPercentage / 100))}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {liabilityEntries.length > 0 ? (
                    <View>
                      <Text style={{ color: negativeColor, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Liabilities</Text>
                      {liabilityEntries.map((e) => (
                        <View key={e.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                          <Text style={{ color: textColor, fontSize: 13 }} numberOfLines={1}>{e.statementType}</Text>
                          <Text style={{ color: negativeColor, fontSize: 13, fontWeight: '600' }}>
                            {formatCurrency(e.closingBalance * (e.ownershipPercentage / 100))}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
