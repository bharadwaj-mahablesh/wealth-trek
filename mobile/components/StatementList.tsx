import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Trash2, Edit2 } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { StatementEntry } from '@/types';

interface StatementListProps {
  items: StatementEntry[];
  onEdit: (item: StatementEntry) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function StatementList({ items, onEdit, onDelete }: StatementListProps) {
  const { isDark } = useTheme();

  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';
  const negativeColor = '#dc2626';

  const handleDelete = (id: string, label: string) => {
    Alert.alert('Delete Statement', `Remove "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={{ padding: 32, alignItems: 'center' }}>
        <Text style={{ color: mutedColor, textAlign: 'center' }}>No statements yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => {
        const isAsset = item.category === 'asset';
        const effectiveBalance = item.closingBalance * (item.ownershipPercentage / 100);
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: bgColor,
              borderRadius: 12,
              borderWidth: 1,
              borderColor,
              padding: 14,
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }} numberOfLines={1}>
                {item.statementType}
              </Text>
              {item.description ? (
                <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                  {item.description}
                </Text>
              ) : null}
              {item.ownershipPercentage !== 100 ? (
                <Text style={{ color: mutedColor, fontSize: 11, marginTop: 2 }}>
                  {item.ownershipPercentage}% ownership
                </Text>
              ) : null}
            </View>
            <Text style={{
              color: isAsset ? positiveColor : negativeColor,
              fontWeight: '700',
              fontSize: 15,
              marginHorizontal: 12,
            }}>
              {formatCurrency(effectiveBalance)}
            </Text>
            <TouchableOpacity onPress={() => onEdit(item)} style={{ padding: 6, marginRight: 4 }}>
              <Edit2 size={16} color={mutedColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.statementType)} style={{ padding: 6 }}>
              <Trash2 size={16} color={negativeColor} />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}
