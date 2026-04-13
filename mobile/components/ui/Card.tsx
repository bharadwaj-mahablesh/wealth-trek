import { View, ViewProps } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  padding?: number;
}

export function Card({ variant = 'default', padding = 16, style, children, ...props }: CardProps) {
  const { isDark } = useTheme();

  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';

  return (
    <View
      style={[
        {
          backgroundColor: bgColor,
          borderRadius: 16,
          borderWidth: 1,
          borderColor,
          padding,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: variant === 'elevated' ? 4 : 1 },
          shadowOpacity: variant === 'elevated' ? 0.12 : 0.05,
          shadowRadius: variant === 'elevated' ? 12 : 4,
          elevation: variant === 'elevated' ? 6 : 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
