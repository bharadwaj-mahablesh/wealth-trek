import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Input } from '@/components/ui/Input';

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { profile, loading, updateProfile } = useUserProfile();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [asOnDate, setAsOnDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile.fullName);
    setAddress(profile.address);
    setCertificateDate(profile.certificateDate);
    setAsOnDate(profile.asOnDate);
  }, [profile]);

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ fullName, address, certificateDate, asOnDate });
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }} edges={['bottom']}>
        <ActivityIndicator color={primaryColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['bottom']}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 20, marginTop: 16 }}>
          <Text style={{ color: textColor, fontWeight: '600', fontSize: 16, marginBottom: 16 }}>Personal Information</Text>
          <View style={{ marginBottom: 14 }}>
            <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />
          </View>
          <View style={{ marginBottom: 14 }}>
            <Input label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" multiline numberOfLines={3} />
          </View>
          <View style={{ marginBottom: 14 }}>
            <Input label="Certificate Date (YYYY-MM-DD)" value={certificateDate} onChangeText={setCertificateDate} placeholder="2024-01-01" />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input label="As On Date (YYYY-MM-DD)" value={asOnDate} onChangeText={setAsOnDate} placeholder="2024-01-01" />
          </View>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{ backgroundColor: primaryColor, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
          >
            {saving
              ? <ActivityIndicator color={isDark ? '#0f1115' : '#ffffff'} />
              : <Text style={{ color: isDark ? '#0f1115' : '#ffffff', fontWeight: '600', fontSize: 15 }}>Save Changes</Text>
            }
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
