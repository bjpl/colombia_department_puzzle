/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern neutral grays (from design-system/tokens/colors.ts)
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Brand colors (from design-system/tokens/colors.ts)
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Colombia theme colors (preserved)
        colombia: {
          yellow: '#FCD116',
          blue: '#003893',
          red: '#CE1126'
        },
        // Colombia regions - WCAG AAA compliant (7:1+ contrast)
        // Source: src/design-system/themes/regions.ts
        region: {
          andina: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#16A34A',  // tertiary
            600: '#15803d',
            700: '#15803d',
            800: '#166534',
            900: '#14532D',  // primary - 9.1:1 contrast
            950: '#052e16',
          },
          caribe: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#2563EB',  // tertiary
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1E3A8A',  // secondary
            900: '#1E40AF',  // primary - 9.4:1 contrast
            950: '#172554',
          },
          pacifico: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#B91C1C',  // tertiary
            600: '#dc2626',
            700: '#b91c1c',
            800: '#7F1D1D',  // secondary
            900: '#7C2D12',  // primary - 9.8:1 contrast
            950: '#450A0A',
          },
          orinoquia: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#CA8A04',  // tertiary
            600: '#d97706',
            700: '#A16207',  // mid
            800: '#92400E',  // primary/secondary - 7.1:1 contrast
            900: '#78350f',
            950: '#713F12',
          },
          amazonia: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14B8A6',  // tertiary
            600: '#0d9488',
            700: '#0F766E',  // mid
            800: '#115E59',  // primary/secondary - 7.2:1 contrast
            900: '#134e4a',
            950: '#042f2e',
          },
          insular: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#7E22CE',  // tertiary
            600: '#a855f7',
            700: '#9333ea',
            800: '#581C87',  // secondary
            900: '#6B21A8',  // primary - 7.3:1 contrast
            950: '#4A1D6F',
          },
        },
        // Additional semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Surface colors (from design-system/tokens/colors.ts)
        surface: {
          background: '#ffffff',
          muted: '#fafafa',
          subtle: '#f5f5f5',
          ui: '#f0f0f0',
          border: '#e5e5e5',
          ring: '#e0e7ff',
        },
        // Interactive states (from design-system/tokens/colors.ts)
        interactive: {
          primary: '#3b82f6',
          'primary-hover': '#2563eb',
          'primary-active': '#1d4ed8',
          secondary: '#f5f5f5',
          'secondary-hover': '#e5e5e5',
          'secondary-active': '#d4d4d4',
        },
        // Text colors (from design-system/tokens/colors.ts)
        text: {
          primary: '#171717',
          secondary: '#525252',
          tertiary: '#a3a3a3',
          inverse: '#ffffff',
          brand: '#3b82f6',
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}