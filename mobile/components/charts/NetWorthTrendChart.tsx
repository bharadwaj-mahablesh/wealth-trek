import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useTheme } from '@/components/ThemeProvider';
import { NetWorthSnapshot } from '@/types';
import { getChartColors } from './chartTheme';

const { width } = Dimensions.get('window');

interface NetWorthTrendChartProps {
  snapshots: NetWorthSnapshot[];
  height?: number;
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value.toFixed(0)}`;
}

export function NetWorthTrendChart({ snapshots, height = 200 }: NetWorthTrendChartProps) {
  const { isDark } = useTheme();
  const colors = getChartColors(isDark);

  const bgColor = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';

  if (snapshots.length < 2) {
    return (
      <View style={{ backgroundColor: bgColor, borderRadius: 16, borderWidth: 1, borderColor, padding: 24, alignItems: 'center', justifyContent: 'center', height }}>
        <Text style={{ color: mutedColor, textAlign: 'center', fontSize: 14 }}>
          Save at least 2 snapshots to see your trend chart.
        </Text>
      </View>
    );
  }

  const maxVal = Math.max(...snapshots.map((s) => Math.max(s.totalAssets, s.netWorth)));
  const minVal = Math.min(...snapshots.map((s) => Math.min(s.netWorth, 0)));
  const range = maxVal - minVal || 1;

  const chartWidth = width - 64;
  const chartHeight = height - 60;
  const padding = { left: 48, right: 16, top: 16, bottom: 24 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const toX = (i: number) => padding.left + (i / (snapshots.length - 1)) * innerWidth;
  const toY = (val: number) => padding.top + ((maxVal - val) / range) * innerHeight;

  const assetPoints = snapshots.map((s, i) => ({ x: toX(i), y: toY(s.totalAssets) }));
  const liabilityPoints = snapshots.map((s, i) => ({ x: toX(i), y: toY(s.totalLiabilities) }));
  const networthPoints = snapshots.map((s, i) => ({ x: toX(i), y: toY(s.netWorth) }));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const yLabels = 4;
  const series = [
    { label: 'Assets', color: colors[0], points: assetPoints },
    { label: 'Liabilities', color: colors[2], points: liabilityPoints },
    { label: 'Net Worth', color: colors[1], points: networthPoints },
  ];

  return (
    <View style={{ backgroundColor: bgColor, borderRadius: 16, borderWidth: 1, borderColor, padding: 16 }}>
      <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginBottom: 12 }}>Net Worth Trend</Text>

      <Svg width={chartWidth} height={chartHeight}>
        {Array.from({ length: yLabels + 1 }).map((_, i) => {
          const val = maxVal - (range * i) / yLabels;
          const y = toY(val);
          return (
            <>
              <Line key={`grid-${i}`} x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke={borderColor} strokeDasharray="4,4" strokeWidth={1} />
              <SvgText key={`label-${i}`} x={padding.left - 4} y={y + 4} fontSize={9} fill={mutedColor} textAnchor="end">{formatCurrency(val)}</SvgText>
            </>
          );
        })}
        {series.map(({ color, points, label }) => (
          <>
            <Path key={`path-${label}`} d={toPath(points)} stroke={color} strokeWidth={2.5} fill="none" />
            {points.map((p, i) => (
              <Circle key={`dot-${label}-${i}`} cx={p.x} cy={p.y} r={3} fill={color} />
            ))}
          </>
        ))}
        {snapshots.map((s, i) => {
          if (i % Math.ceil(snapshots.length / 4) !== 0 && i !== snapshots.length - 1) return null;
          const x = toX(i);
          return (
            <SvgText key={`xlabel-${i}`} x={x} y={chartHeight - 4} fontSize={9} fill={mutedColor} textAnchor="middle">
              {s.date.slice(0, 7)}
            </SvgText>
          );
        })}
      </Svg>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {series.map(({ label, color }) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 12, height: 3, backgroundColor: color, borderRadius: 2 }} />
            <Text style={{ color: mutedColor, fontSize: 11 }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
