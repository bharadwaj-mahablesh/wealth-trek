import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Target, MessageCircle, User, CreditCard, ChevronRight, Moon, Sun, LogOut, FileText, Trash2 } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/ThemeProvider';
import { hapticLight, hapticMedium } from '@/lib/haptics';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
  isDark: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, isDestructive, isDark }: MenuItemProps) {
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const textColor = isDestructive ? '#dc2626' : (isDark ? '#e8eaf0' : '#1a1e24');
  const mutedColor = isDark ? '#8b9099' : '#64748b';

  return (
    <TouchableOpacity
      onPress={() => { hapticLight(); onPress(); }}
      style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14,
        backgroundColor: cardBg, borderRadius: 14, marginBottom: 8,
        borderWidth: 1, borderColor,
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDestructive ? 'rgba(220,38,38,0.1)' : (isDark ? '#1e2228' : '#eef0f4'), alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: textColor, fontWeight: '600', fontSize: 15 }}>{title}</Text>
        {subtitle ? <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>{subtitle}</Text> : null}
      </View>
      <ChevronRight size={18} color={mutedColor} />
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';

  const handleSignOut = async () => {
    hapticMedium();
    try {
      await signOut();
    } catch (e) {
      try {
        const keys = await SecureStore.getItemAsync('__clerk_session');
        if (keys) await SecureStore.deleteItemAsync('__clerk_session');
      } catch (_) {}
      Alert.alert('Signed out', 'Session cleared. Please restart the app.');
    }
  };

  const handleClearSession = async () => {
    hapticMedium();
    // Clear all possible Clerk storage locations
    const CLERK_KEYS = ['__clerk_db_jwt', 'clerk_db_jwt', '__clerk_client_jwt', 'clerk-js-sdk-cache', '__clerk_session', 'clerk_session', '_clerk_key_ver', 'clerk_active_org', '__clerk_client', 'clerk_client', '__clerk_accounts', 'clerk_accounts'];
    for (const k of CLERK_KEYS) {
      await SecureStore.deleteItemAsync(k).catch(() => {});
    }
    // Clear AsyncStorage (Clerk may store session metadata here)
    try {
      const keys = await AsyncStorage.getAllKeys();
      const clerkKeys = keys.filter(k => k.toLowerCase().includes('clerk'));
      await AsyncStorage.multiRemove(clerkKeys);
    } catch (_) {}
    Alert.alert('Session fully cleared', 'CLOSE Expo Go completely (swipe up), reopen it, then scan the QR code again.');
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 4, paddingHorizontal: 4 }}>
      {label}
    </Text>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={{ paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: textColor }}>More</Text>
          <Text style={{ color: mutedColor, marginTop: 2 }}>Settings and features</Text>
        </View>

        <View style={{ marginBottom: 8 }}>
          <SectionLabel label="Features" />
          <MenuItem isDark={isDark} icon={<Target size={20} color={primaryColor} />} title="Financial Goals" subtitle="Track your wealth milestones" onPress={() => router.push('/(tabs)/more/goals')} />
          <MenuItem isDark={isDark} icon={<MessageCircle size={20} color={primaryColor} />} title="AI Chat" subtitle="Get financial advice" onPress={() => router.push('/(tabs)/more/chat')} />
          <MenuItem isDark={isDark} icon={<FileText size={20} color={primaryColor} />} title="Documents" subtitle="Upload & extract statements" onPress={() => router.push('/(tabs)/more/documents' as any)} />
        </View>

        <View style={{ marginBottom: 8 }}>
          <SectionLabel label="Account" />
          <MenuItem isDark={isDark} icon={<User size={20} color={primaryColor} />} title="Profile" subtitle="Manage personal information" onPress={() => router.push('/(tabs)/more/profile')} />
          <MenuItem isDark={isDark} icon={<CreditCard size={20} color={primaryColor} />} title="Pricing" subtitle="Subscription plans" onPress={() => router.push('/(tabs)/more/pricing')} />
        </View>

        <View style={{ marginBottom: 8 }}>
          <SectionLabel label="Preferences" />
          <TouchableOpacity
            onPress={() => { hapticLight(); toggleTheme(); }}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, backgroundColor: cardBg, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? '#1e2228' : '#eef0f4', alignItems: 'center', justifyContent: 'center' }}>
              {isDark ? <Sun size={20} color={primaryColor} /> : <Moon size={20} color={primaryColor} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: textColor, fontWeight: '600', fontSize: 15 }}>Appearance</Text>
              <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
            </View>
            <ChevronRight size={18} color={mutedColor} />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 8 }}>
          <MenuItem isDark={isDark} icon={<Trash2 size={20} color="#dc2626" />} title="Clear Session & Restart" subtitle="Use if stuck on expired session" onPress={handleClearSession} isDestructive />
        </View>
        <View style={{ marginBottom: 24 }}>
          <MenuItem isDark={isDark} icon={<LogOut size={20} color="#dc2626" />} title="Sign Out" onPress={handleSignOut} isDestructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
