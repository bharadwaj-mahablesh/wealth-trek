import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ label, value, options, onChange, placeholder = 'Select...' }: SelectProps) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  const bgColor = isDark ? '#1e2228' : '#eef0f4';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const modalBg = isDark ? '#1a1e24' : '#ffffff';
  const itemBg = isDark ? '#1e2228' : '#f7f8fa';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';

  return (
    <View style={{ marginBottom: 4 }}>
      {label ? (
        <Text style={{ color: textColor, fontSize: 14, fontWeight: '500', marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={() => setOpen(true)}
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
        <Text style={{ flex: 1, color: selected ? textColor : mutedColor, fontSize: 15 }}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={18} color={mutedColor} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <SafeAreaView style={{ backgroundColor: modalBg, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: borderColor }}>
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                {label || 'Select'}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 400 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { onChange(item.value); setOpen(false); }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: item.value === value ? itemBg : 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                  }}
                >
                  <Text style={{ flex: 1, color: textColor, fontSize: 15 }}>{item.label}</Text>
                  {item.value === value ? <Check size={18} color={primaryColor} /> : null}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={{ padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: mutedColor, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
