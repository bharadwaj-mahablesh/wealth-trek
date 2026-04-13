import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { hapticLight } from '@/lib/haptics';

interface ThemeToggleProps extends TouchableOpacityProps {
  size?: number;
}

export function ThemeToggle({ size = 22, style, ...props }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const handlePress = () => {
    hapticLight();
    toggleTheme();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#1e2228' : '#eef0f4',
        },
        style,
      ]}
      {...props}
    >
      {isDark
        ? <Sun size={size} color="#6ba3b8" />
        : <Moon size={size} color="#1a6b8a" />
      }
    </TouchableOpacity>
  );
}
