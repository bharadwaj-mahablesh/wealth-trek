import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ title, variant = 'primary', size = 'md', loading, disabled, style, ...props }: ButtonProps) {
  const { isDark } = useTheme();

  const bgMap = {
    primary: isDark ? '#6ba3b8' : '#1a6b8a',
    secondary: isDark ? '#1e2228' : '#e8ecf1',
    destructive: '#dc2626',
    outline: 'transparent',
    ghost: 'transparent',
  };

  const textColorMap = {
    primary: isDark ? '#0f1115' : '#ffffff',
    secondary: isDark ? '#e8eaf0' : '#1a1e24',
    destructive: '#ffffff',
    outline: isDark ? '#6ba3b8' : '#1a6b8a',
    ghost: isDark ? '#6ba3b8' : '#1a6b8a',
  };

  const borderMap = {
    primary: 'transparent',
    secondary: 'transparent',
    destructive: 'transparent',
    outline: isDark ? '#6ba3b8' : '#1a6b8a',
    ghost: 'transparent',
  };

  const paddingMap = { sm: 8, md: 12, lg: 16 };
  const fontSizeMap = { sm: 13, md: 15, lg: 17 };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: bgMap[variant],
          borderColor: borderMap[variant],
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: paddingMap[size],
          paddingHorizontal: paddingMap[size] * 2,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColorMap[variant]} size="small" />
      ) : (
        <Text style={{ color: textColorMap[variant], fontSize: fontSizeMap[size], fontWeight: '600' }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
