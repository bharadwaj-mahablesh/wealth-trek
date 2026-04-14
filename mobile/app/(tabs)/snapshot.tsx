import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Save, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { WealthTrekLogo } from '@/components/WealthTrekLogo';
import { useStatements } from '@/hooks/useStatements';
import { useNetWorthHistory } from '@/hooks/useNetWorthHistory';
import { NetWorthSummary } from '@/components/NetWorthSummary';
import { StatementList } from '@/components/StatementList';
import { StatementForm } from '@/components/StatementForm';
import { StatementEntry } from '@/types';

export default function SnapshotScreen() {
  const { isDark } = useTheme();
  const {
    assets, liabilities, totalAssets, totalLiabilities, netWorth,
    loading, refresh, addStatement, updateStatement, deleteStatement, statements,
  } = useStatements();
  const { saveSnapshot } = useNetWorthHistory();

  const [formVisible, setFormVisible] = useState(false);
  const [editEntry, setEditEntry] = useState<StatementEntry | null>(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'assets' | 'liabilities'>('assets');

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const tabActiveBg = isDark ? '#1e2228' : '#e8ecf1';

  const handleEdit = (item: StatementEntry) => {
    setEditEntry(item);
    setFormVisible(true);
  };

  const handleSave = async (entry: Omit<StatementEntry, 'id'>) => {
    if (editEntry) {
      await updateStatement(editEntry.id, entry);
    } else {
      await addStatement(entry);
    }
  };

  const handleSaveSnapshot = async () => {
    if (statements.length === 0) {
      Alert.alert('No Statements', 'Add at least one statement before saving a snapshot.');
      return;
    }
    setSaving(true);
    try {
      await saveSnapshot(statements, snapshotDate);
      setSaveModalVisible(false);
      Alert.alert('Snapshot Saved', 'Your net worth snapshot has been saved.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save snapshot');
    } finally {
      setSaving(false);
    }
  };

  const displayItems = activeSection === 'assets' ? assets : liabilities;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <View>
          <WealthTrekLogo size={24} color={primaryColor} style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 24, fontWeight: '700', color: textColor }}>Snapshot</Text>
          <Text style={{ color: mutedColor, marginTop: 2 }}>Manage your statements</Text>
        </View>
        <TouchableOpacity
          onPress={() => setSaveModalVisible(true)}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: primaryColor, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }}
        >
          <Save size={16} color={isDark ? '#0f1115' : '#ffffff'} />
          <Text style={{ color: isDark ? '#0f1115' : '#ffffff', fontWeight: '600', marginLeft: 6, fontSize: 14 }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={primaryColor} />}
      >
        <NetWorthSummary totalAssets={totalAssets} totalLiabilities={totalLiabilities} netWorth={netWorth} />

        {/* Section tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: tabActiveBg, borderRadius: 10, padding: 4, marginBottom: 16 }}>
          {(['assets', 'liabilities'] as const).map((section) => (
            <TouchableOpacity
              key={section}
              onPress={() => setActiveSection(section)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: activeSection === section ? (isDark ? '#252a32' : '#ffffff') : 'transparent',
              }}
            >
              <Text style={{
                fontWeight: '600',
                fontSize: 14,
                color: activeSection === section ? (section === 'assets' ? (isDark ? '#6aab8a' : '#16a34a') : '#dc2626') : mutedColor,
              }}>
                {section === 'assets' ? `Assets (${assets.length})` : `Liabilities (${liabilities.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <StatementList items={displayItems} onEdit={handleEdit} onDelete={deleteStatement} />
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => { setEditEntry(null); setFormVisible(true); }}
        style={{
          position: 'absolute', bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: primaryColor,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: primaryColor, shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
        }}
      >
        <Plus size={24} color={isDark ? '#0f1115' : '#ffffff'} />
      </TouchableOpacity>

      <StatementForm
        visible={formVisible}
        onClose={() => { setFormVisible(false); setEditEntry(null); }}
        onSave={handleSave}
        editEntry={editEntry}
      />

      {/* Save Snapshot Modal */}
      <Modal visible={saveModalVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24 }}>
          <View style={{ backgroundColor: cardBg, borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor }}>
            <Text style={{ color: textColor, fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Save Snapshot</Text>
            <Text style={{ color: mutedColor, fontSize: 14, marginBottom: 4 }}>Snapshot Date</Text>
            <TextInput
              value={snapshotDate}
              onChangeText={setSnapshotDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={mutedColor}
              style={{ backgroundColor: isDark ? '#1e2228' : '#eef0f4', borderRadius: 10, padding: 12, color: textColor, marginBottom: 16 }}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setSaveModalVisible(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor, alignItems: 'center' }}
              >
                <Text style={{ color: mutedColor, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveSnapshot}
                disabled={saving}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: primaryColor, alignItems: 'center' }}
              >
                <Text style={{ color: isDark ? '#0f1115' : '#ffffff', fontWeight: '600' }}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
