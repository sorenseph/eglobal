/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#121212',
          800: '#1E293B',
          600: '#475569',
          400: '#94A3B8'
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#0284C7',
          600: '#0066CC',
          700: '#0052A3'
        },
        canvas: {
          DEFAULT: '#F8FAFC',
          200: '#F1F5F9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.05)',
        float: '0 12px 40px rgba(15, 23, 42, 0.12)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both'
      }
    }
  },
  plugins: []
}
