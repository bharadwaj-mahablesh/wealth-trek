import { lightTheme, darkTheme } from '@/lib/theme';

export function getChartTheme(isDark: boolean) {
  const t = isDark ? darkTheme : lightTheme;
  return {
    axis: {
      style: {
        axis: { stroke: t.border },
        tickLabels: { fill: t.mutedForeground, fontSize: 10 },
        grid: { stroke: t.border, strokeDasharray: '4,4', opacity: 0.5 },
      },
    },
    line: {
      style: {
        data: { strokeWidth: 2 },
      },
    },
    scatter: {
      style: {
        data: { fill: t.primary },
      },
    },
  };
}

export function getChartColors(isDark: boolean) {
  const t = isDark ? darkTheme : lightTheme;
  return [t.chart1, t.chart2, t.chart3, t.chart4, t.chart5];
}
