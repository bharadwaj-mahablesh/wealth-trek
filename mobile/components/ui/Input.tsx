import { View, TextInput, Text, TextInputProps } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, style, ...props }: InputProps) {
  const { isDark } = useTheme();

  const borderColor = error ? '#dc2626' : (isDark ? '#252a32' : '#d8dde5');
  const bgColor = isDark ? '#1e2228' : '#eef0f4';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const placeholderColor = isDark ? '#8b9099' : '#64748b';
  const labelColor = isDark ? '#e8eaf0' : '#1a1e24';
  const errorColor = '#dc2626';

  return (
    <View style={{ marginBottom: 4 }}>
      {label ? (
        <Text style={{ color: labelColor, fontSize: 14, fontWeight: '500', marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: bgColor,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        {leftIcon ? <View style={{ marginRight: 10 }}>{leftIcon}</View> : null}
        <TextInput
          style={[{ flex: 1, color: textColor, fontSize: 15 }, style]}
          placeholderTextColor={placeholderColor}
          {...props}
        />
        {rightIcon ? <View style={{ marginLeft: 10 }}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text style={{ color: errorColor, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}
