import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Upload, Camera, FileText, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/components/ThemeProvider';
import { useDocuments } from '@/hooks/useDocuments';
import { useStatements } from '@/hooks/useStatements';
import { hapticLight, hapticSuccess, hapticError } from '@/lib/haptics';
import { ExtractedEntry } from '@/types';

function formatCurrency(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function DocumentsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { uploading, extracting, extractedEntries, uploadDocument, extractDocument, clearExtraction } = useDocuments();
  const { addStatement } = useStatements();
  const [step, setStep] = useState<'upload' | 'review' | 'done'>('upload');
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';

  const handlePickDocument = async () => {
    hapticLight();
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.canceled) return;
      const file = result.assets[0];
      const doc = await uploadDocument({ uri: file.uri, name: file.name, type: 'application/pdf' });
      const entries = await extractDocument(doc.id, 'pdf');
      setSelectedEntries(new Set(entries.map((_, i) => i)));
      setStep('review');
      hapticSuccess();
    } catch (e: any) {
      hapticError();
      Alert.alert('Error', e.message || 'Failed to process document');
    }
  };

  const handlePickImage = async () => {
    hapticLight();
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to scan statements.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8, base64: false });
      if (result.canceled) return;
      const img = result.assets[0];
      const doc = await uploadDocument({ uri: img.uri, name: 'scan.jpg', type: 'image/jpeg' });
      const entries = await extractDocument(doc.id, 'image');
      setSelectedEntries(new Set(entries.map((_, i) => i)));
      setStep('review');
      hapticSuccess();
    } catch (e: any) {
      hapticError();
      Alert.alert('Error', e.message || 'Failed to scan image');
    }
  };

  const toggleEntry = (index: number) => {
    hapticLight();
    setSelectedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleImport = async () => {
    if (selectedEntries.size === 0) {
      Alert.alert('No entries selected', 'Select at least one entry to import.');
      return;
    }
    setSaving(true);
    try {
      const toImport = extractedEntries.filter((_, i) => selectedEntries.has(i));
      for (const entry of toImport) {
        await addStatement({
          statementType: entry.statementType,
          description: entry.description,
          category: entry.category,
          closingBalance: entry.closingBalance,
          ownershipPercentage: entry.ownershipPercentage ?? 100,
        });
      }
      hapticSuccess();
      setStep('done');
    } catch (e: any) {
      hapticError();
      Alert.alert('Error', e.message || 'Import failed');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    clearExtraction();
    setSelectedEntries(new Set());
    setStep('upload');
  };

  if (step === 'done') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <CheckCircle size={64} color={positiveColor} style={{ marginBottom: 16 }} />
          <Text style={{ color: textColor, fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>Imported!</Text>
          <Text style={{ color: mutedColor, textAlign: 'center', marginBottom: 32 }}>
            {selectedEntries.size} statement{selectedEntries.size !== 1 ? 's' : ''} added to your Snapshot.
          </Text>
          <TouchableOpacity
            onPress={() => { hapticLight(); router.push('/(tabs)/snapshot'); }}
            style={{ backgroundColor: primaryColor, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 14, marginBottom: 12 }}
          >
            <Text style={{ color: isDark ? '#0f1115' : '#ffffff', fontWeight: '600', fontSize: 15 }}>View Snapshot</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={{ padding: 12 }}>
            <Text style={{ color: mutedColor, fontSize: 14 }}>Upload Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'review' && extractedEntries.length > 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['bottom']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: cardBg }}>
          <TouchableOpacity onPress={handleReset} style={{ marginRight: 12 }}>
            <ArrowLeft size={22} color={textColor} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textColor, fontWeight: '700', fontSize: 17 }}>Review Entries</Text>
            <Text style={{ color: mutedColor, fontSize: 12 }}>{selectedEntries.size} of {extractedEntries.length} selected</Text>
          </View>
          <TouchableOpacity
            onPress={handleImport}
            disabled={saving || selectedEntries.size === 0}
            style={{ backgroundColor: selectedEntries.size > 0 ? primaryColor : (isDark ? '#252a32' : '#d8dde5'), borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            {saving
              ? <ActivityIndicator size="small" color={isDark ? '#0f1115' : '#ffffff'} />
              : <Text style={{ color: selectedEntries.size > 0 ? (isDark ? '#0f1115' : '#ffffff') : mutedColor, fontWeight: '600' }}>Import</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
          {extractedEntries.map((entry: ExtractedEntry, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => toggleEntry(i)}
              style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: cardBg, borderRadius: 12, borderWidth: 1,
                borderColor: selectedEntries.has(i) ? primaryColor : borderColor,
                padding: 14, marginBottom: 8,
              }}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                borderColor: selectedEntries.has(i) ? primaryColor : borderColor,
                backgroundColor: selectedEntries.has(i) ? primaryColor : 'transparent',
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
              }}>
                {selectedEntries.has(i) ? <CheckCircle size={14} color={isDark ? '#0f1115' : '#ffffff'} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }}>{entry.statementType}</Text>
                {entry.description ? <Text style={{ color: mutedColor, fontSize: 12 }}>{entry.description}</Text> : null}
                <Text style={{ color: entry.category === 'asset' ? positiveColor : '#dc2626', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  {entry.category === 'asset' ? 'Asset' : 'Liability'} · {formatCurrency(entry.closingBalance)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['bottom']}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={{ paddingTop: 16, paddingBottom: 16 }}>
          <Text style={{ color: mutedColor, fontSize: 14, lineHeight: 20 }}>
            Upload a PDF or scan a statement image to automatically extract and import your financial data.
          </Text>
        </View>

        {uploading || extracting ? (
          <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primaryColor} style={{ marginBottom: 16 }} />
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 15 }}>{uploading ? 'Uploading...' : 'Extracting data...'}</Text>
            <Text style={{ color: mutedColor, fontSize: 13, marginTop: 4 }}>This may take a few moments</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={handlePickDocument}
              style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 24, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: isDark ? '#1e2228' : '#eef0f4', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <FileText size={24} color={primaryColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontWeight: '700', fontSize: 16 }}>Upload PDF</Text>
                <Text style={{ color: mutedColor, fontSize: 13, marginTop: 2 }}>Bank or investment statements in PDF format</Text>
              </View>
              <Upload size={20} color={mutedColor} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickImage}
              style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 24, flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: isDark ? '#1e2228' : '#eef0f4', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Camera size={24} color={primaryColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontWeight: '700', fontSize: 16 }}>Scan Statement</Text>
                <Text style={{ color: mutedColor, fontSize: 13, marginTop: 2 }}>Take a photo of a physical statement</Text>
              </View>
              <Camera size={20} color={mutedColor} />
            </TouchableOpacity>

            <View style={{ backgroundColor: isDark ? 'rgba(107,163,184,0.1)' : 'rgba(26,107,138,0.06)', borderRadius: 12, padding: 16, marginTop: 20 }}>
              <Text style={{ color: primaryColor, fontWeight: '600', fontSize: 13, marginBottom: 4 }}>Supported formats</Text>
              <Text style={{ color: mutedColor, fontSize: 12, lineHeight: 18 }}>
                PDF: Bank statements, mutual fund statements, equity statements{'\n'}
                Image: JPG, PNG scans of physical documents
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
