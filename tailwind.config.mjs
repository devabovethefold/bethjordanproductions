/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E63946',
          amber: '#F4A261',
          gold: '#E9C46A',
          cyan: '#2EC4B6',
          blue: '#1D7EBF',
          dark: '#0A0A0F',
          darker: '#06060A',
          glass: 'rgba(255,255,255,0.04)',
          'glass-border': 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'mesh-hero': 'radial-gradient(ellipse at 20% 50%, rgba(230,57,70,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(30,126,191,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(46,196,182,0.08) 0%, transparent 50%)',
        'mesh-radio': 'radial-gradient(ellipse at 10% 50%, rgba(46,196,182,0.12) 0%, transparent 60%), radial-gradient(ellipse at 90% 50%, rgba(30,126,191,0.15) 0%, transparent 60%)',
        'mesh-production': 'radial-gradient(ellipse at 80% 20%, rgba(233,196,106,0.10) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(230,57,70,0.08) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(230,57,70,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(230,57,70,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
