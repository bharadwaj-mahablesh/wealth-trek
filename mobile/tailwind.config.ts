import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#f7f8fa',
          dark: '#0f1115',
        },
        foreground: {
          DEFAULT: '#1a1e24',
          dark: '#e8eaf0',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1a1e24',
          foreground: {
            DEFAULT: '#1a1e24',
            dark: '#e8eaf0',
          },
        },
        primary: {
          DEFAULT: '#1a6b8a',
          dark: '#6ba3b8',
          foreground: {
            DEFAULT: '#ffffff',
            dark: '#0f1115',
          },
        },
        secondary: {
          DEFAULT: '#e8ecf1',
          dark: '#1e2228',
          foreground: {
            DEFAULT: '#1a1e24',
            dark: '#e8eaf0',
          },
        },
        accent: {
          DEFAULT: '#2a7a5a',
          dark: '#6aab8a',
          foreground: {
            DEFAULT: '#ffffff',
            dark: '#0f1115',
          },
        },
        muted: {
          DEFAULT: '#eef0f4',
          dark: '#1e2228',
          foreground: {
            DEFAULT: '#64748b',
            dark: '#8b9099',
          },
        },
        destructive: {
          DEFAULT: '#dc2626',
          dark: '#7f1d1d',
        },
        success: {
          DEFAULT: '#16a34a',
          dark: '#14532d',
          foreground: {
            DEFAULT: '#ffffff',
            dark: '#e8eaf0',
          },
        },
        border: {
          DEFAULT: '#d8dde5',
          dark: '#252a32',
        },
        input: {
          DEFAULT: '#d8dde5',
          dark: '#252a32',
        },
        ring: {
          DEFAULT: 'rgba(26, 107, 138, 0.4)',
          dark: 'rgba(107, 163, 184, 0.5)',
        },
        // Chart colors (light)
        'chart-1': '#1a6b8a',
        'chart-2': '#2a7a5a',
        'chart-3': '#8b5a2b',
        'chart-4': '#6b5a8a',
        'chart-5': '#7a5a52',
        // Chart colors (dark)
        'chart-1-dark': '#6ba3b8',
        'chart-2-dark': '#6aab8a',
        'chart-3-dark': '#b88a5a',
        'chart-4-dark': '#a08ab8',
        'chart-5-dark': '#9a8a82',
      },
      borderRadius: {
        sm: 'calc(0.75rem * 0.6)',
        md: 'calc(0.75rem * 0.8)',
        lg: '0.75rem',
        xl: 'calc(0.75rem * 1.4)',
        '2xl': 'calc(0.75rem * 1.8)',
        '3xl': 'calc(0.75rem * 2.2)',
        '4xl': 'calc(0.75rem * 2.6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
