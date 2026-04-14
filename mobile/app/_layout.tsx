import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { setUnauthorizedListener, clearUnauthorizedListener } from '@/lib/api';
import '@/global.css';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const CLERK_KNOWN_KEYS = [
  '__clerk_db_jwt', 'clerk_db_jwt', '__clerk_client_jwt',
  'clerk-js-sdk-cache', '__clerk_session', 'clerk_session',
];
const KEY_VERSION_STORE = '_clerk_key_ver';
const currentKeyVersion = clerkPublishableKey.slice(-12);

let _triggerRemount: (() => void) | null = null;
export function setRemountTrigger(fn: () => void) { _triggerRemount = fn; }

const trackedKeys = new Set<string>();
let checkedVersion = false;
let purgedThisSession = false;

async function purgeStaleSessionIfNeeded(): Promise<boolean> {
  if (checkedVersion) return purgedThisSession;
  checkedVersion = true;
  const stored = await SecureStore.getItemAsync(KEY_VERSION_STORE).catch(() => null);
  if (stored !== currentKeyVersion) {
    purgedThisSession = true;
    for (const k of CLERK_KNOWN_KEYS) {
      await SecureStore.deleteItemAsync(k).catch(() => {});
    }
    await SecureStore.setItemAsync(KEY_VERSION_STORE, currentKeyVersion).catch(() => {});
    return true;
  }
  return false;
}

const tokenCache = {
  async getToken(key: string) {
    const didPurge = await purgeStaleSessionIfNeeded();
    if (didPurge) return null;
    trackedKeys.add(key);
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    trackedKeys.add(key);
    return SecureStore.setItemAsync(key, value);
  },
  async clearToken(key: string) {
    trackedKeys.delete(key);
    return SecureStore.deleteItemAsync(key);
  },
};

async function forceSignOut(signOut: () => Promise<unknown>) {
  try { await signOut(); } catch (_) {}
  const allKeys = [...trackedKeys, ...CLERK_KNOWN_KEYS];
  for (const key of allKeys) {
    await SecureStore.deleteItemAsync(key).catch(() => {});
  }
  trackedKeys.clear();
  checkedVersion = false;
  purgedThisSession = false;
  _triggerRemount?.();
}

function RootLayoutNav() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { colorScheme } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedListener(() => { forceSignOut(signOut); });
    return () => clearUnauthorizedListener();
  }, [signOut]);

  // Imperative routing instead of conditional rendering for authentication
  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, isLoaded, segments, router]);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
export default function RootLayout() {
  const [clerkKey, setClerkKey] = useState(0);
  _triggerRemount = () => setClerkKey((k) => k + 1);

  return (
    <ClerkProvider key={clerkKey} publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <RootLayoutNav />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
