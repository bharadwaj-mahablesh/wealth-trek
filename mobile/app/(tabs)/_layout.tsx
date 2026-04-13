import { Tabs } from 'expo-router';
import { Home, Camera, TrendingUp, BarChart3, Menu } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

export default function TabsLayout() {
  const { isDark } = useTheme();

  const activeColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const inactiveColor = isDark ? '#8b9099' : '#64748b';
  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const borderColor = isDark ? '#252a32' : '#d8dde5';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: borderColor,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="snapshot"
        options={{
          title: 'Snapshot',
          tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
