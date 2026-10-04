// tailwind.config.js
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blessingFall: "blessingFall 14s linear infinite",
        'fill-line': 'fillLine 1s ease-out forwards',
      },
      keyframes: {
        blessingFall: {
          "0%": { transform: "translateY(-10%) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(120vh) rotate(360deg)", opacity: "0" },
        },
        fillLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      colors: {
        primary: '#8B5CF6',
        secondary: '#4ECDC4',
      },
    },
  },
  plugins: [forms],
};
