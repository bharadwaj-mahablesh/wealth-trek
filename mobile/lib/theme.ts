export const lightTheme = {
  background: '#f7f8fa',
  foreground: '#1a1e24',
  card: '#ffffff',
  cardForeground: '#1a1e24',
  primary: '#1a6b8a',
  primaryForeground: '#ffffff',
  secondary: '#e8ecf1',
  secondaryForeground: '#1a1e24',
  muted: '#eef0f4',
  mutedForeground: '#64748b',
  accent: '#2a7a5a',
  accentForeground: '#ffffff',
  destructive: '#dc2626',
  success: '#16a34a',
  successForeground: '#ffffff',
  border: '#d8dde5',
  input: '#d8dde5',
  ring: 'rgba(26, 107, 138, 0.4)',
  chart1: '#1a6b8a',
  chart2: '#2a7a5a',
  chart3: '#8b5a2b',
  chart4: '#6b5a8a',
  chart5: '#7a5a52',
};

export const darkTheme = {
  background: '#0f1115',
  foreground: '#e8eaf0',
  card: '#1a1e24',
  cardForeground: '#e8eaf0',
  primary: '#6ba3b8',
  primaryForeground: '#0f1115',
  secondary: '#1e2228',
  secondaryForeground: '#e8eaf0',
  muted: '#1e2228',
  mutedForeground: '#8b9099',
  accent: '#6aab8a',
  accentForeground: '#0f1115',
  destructive: '#7f1d1d',
  success: '#14532d',
  successForeground: '#e8eaf0',
  border: '#252a32',
  input: '#252a32',
  ring: 'rgba(107, 163, 184, 0.5)',
  chart1: '#6ba3b8',
  chart2: '#6aab8a',
  chart3: '#b88a5a',
  chart4: '#a08ab8',
  chart5: '#9a8a82',
};

export type Theme = typeof lightTheme;

export function getChartColors(isDark: boolean): string[] {
  const theme = isDark ? darkTheme : lightTheme;
  return [theme.chart1, theme.chart2, theme.chart3, theme.chart4, theme.chart5];
}
