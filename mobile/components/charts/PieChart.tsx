import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '@/components/ThemeProvider';
import { getChartColors } from './chartTheme';

interface PieSlice {
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieSlice[];
  title: string;
  size?: number;
}

export function PieChart({ data, title, size = 120 }: PieChartProps) {
  const { isDark } = useTheme();
  const colors = getChartColors(isDark);

  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <View style={{ backgroundColor: bgColor, borderRadius: 16, borderWidth: 1, borderColor, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: textColor, fontWeight: '600', marginBottom: 8 }}>{title}</Text>
        <Text style={{ color: mutedColor, fontSize: 13 }}>No data</Text>
      </View>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const innerR = r * 0.5;

  let currentAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    currentAngle += angle;
    const endAngle = currentAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const pathD = [
      `M ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
      `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${ix2.toFixed(2)} ${iy2.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
      'Z',
    ].join(' ');

    return { pathD, color: colors[i % colors.length], label: d.label, value: d.value, pct: ((d.value / total) * 100).toFixed(1) };
  });

  return (
    <View style={{ backgroundColor: bgColor, borderRadius: 16, borderWidth: 1, borderColor, padding: 16 }}>
      <Text style={{ color: textColor, fontWeight: '600', fontSize: 14, marginBottom: 12 }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, i) => (
              <Path key={i} d={slice.pathD} fill={slice.color} />
            ))}
          </G>
        </Svg>
        <View style={{ flex: 1, marginLeft: 12 }}>
          {slices.slice(0, 5).map((slice, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: slice.color, marginRight: 6 }} />
              <Text style={{ color: mutedColor, fontSize: 11, flex: 1 }} numberOfLines={1}>{slice.label}</Text>
              <Text style={{ color: textColor, fontSize: 11, fontWeight: '600' }}>{slice.pct}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
