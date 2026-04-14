import { Stack } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';

export default function MoreLayout() {
  const { isDark } = useTheme();
  const headerTint = isDark ? '#e8eaf0' : '#1a1e24';
  const headerBg = isDark ? '#0f1115' : '#f7f8fa';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerTint,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'More',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="goals"
        options={{
          title: 'Financial Goals',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="pricing"
        options={{
          title: 'Pricing',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="documents"
        options={{
          title: 'Documents',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
