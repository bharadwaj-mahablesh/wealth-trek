import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface FABProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  size?: number;
}

export function FAB({ icon, size = 56, style, ...props }: FABProps) {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? '#6ba3b8' : '#1a6b8a',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: isDark ? '#6ba3b8' : '#1a6b8a',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
}
