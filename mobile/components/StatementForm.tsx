import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatementEntry, STATEMENT_TYPE_PRESETS } from '@/types';

interface StatementFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: Omit<StatementEntry, 'id'>) => Promise<void>;
  editEntry?: StatementEntry | null;
}

const TYPE_OPTIONS = STATEMENT_TYPE_PRESETS.map((p) => ({
  label: p.label,
  value: p.label,
}));

export function StatementForm({ visible, onClose, onSave, editEntry }: StatementFormProps) {
  const { isDark } = useTheme();
  const [statementType, setStatementType] = useState('');
  const [description, setDescription] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [ownership, setOwnership] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const headerBg = isDark ? '#1a1e24' : '#ffffff';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const borderColor = isDark ? '#252a32' : '#d8dde5';

  useEffect(() => {
    if (editEntry) {
      setStatementType(editEntry.statementType);
      setDescription(editEntry.description);
      setClosingBalance(String(editEntry.closingBalance));
      setOwnership(String(editEntry.ownershipPercentage));
    } else {
      setStatementType('');
      setDescription('');
      setClosingBalance('');
      setOwnership('100');
    }
    setError('');
  }, [editEntry, visible]);

  const selectedPreset = STATEMENT_TYPE_PRESETS.find((p) => p.label === statementType);
  const category = selectedPreset?.category ?? 'asset';

  const handleSave = async () => {
    if (!statementType) { setError('Please select a statement type'); return; }
    const balance = parseFloat(closingBalance);
    if (isNaN(balance) || balance < 0) { setError('Enter a valid balance'); return; }
    const ownershipNum = parseFloat(ownership);
    if (isNaN(ownershipNum) || ownershipNum <= 0 || ownershipNum > 100) {
      setError('Ownership must be 1–100');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave({ statementType, description, category, closingBalance: balance, ownershipPercentage: ownershipNum });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: bgColor }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          backgroundColor: headerBg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '700' }}>
            {editEntry ? 'Edit Statement' : 'Add Statement'}
          </Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <X size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ marginBottom: 16 }}>
            <Select
              label="Statement Type"
              value={statementType}
              options={TYPE_OPTIONS}
              onChange={setStatementType}
              placeholder="Select type..."
            />
          </View>

          {statementType ? (
            <View style={{
              backgroundColor: category === 'asset'
                ? (isDark ? 'rgba(106,171,138,0.15)' : 'rgba(22,163,74,0.1)')
                : (isDark ? 'rgba(127,29,29,0.2)' : 'rgba(220,38,38,0.1)'),
              borderRadius: 8,
              padding: 10,
              marginBottom: 16,
            }}>
              <Text style={{
                color: category === 'asset' ? (isDark ? '#6aab8a' : '#16a34a') : '#dc2626',
                fontWeight: '600',
                fontSize: 13,
              }}>
                Category: {category === 'asset' ? 'Asset' : 'Liability'}
              </Text>
            </View>
          ) : null}

          <View style={{ marginBottom: 16 }}>
            <Input
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. SBI savings account"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Input
              label="Closing Balance (₹)"
              value={closingBalance}
              onChangeText={setClosingBalance}
              placeholder="0"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Input
              label="Ownership %"
              value={ownership}
              onChangeText={setOwnership}
              placeholder="100"
              keyboardType="decimal-pad"
            />
          </View>

          {error ? (
            <Text style={{ color: '#dc2626', marginBottom: 12, textAlign: 'center' }}>{error}</Text>
          ) : null}

          <Button title={editEntry ? 'Update' : 'Save'} onPress={handleSave} loading={loading} size="lg" />
          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
