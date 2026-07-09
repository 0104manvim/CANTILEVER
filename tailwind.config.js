/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f0ff',
          100: '#e6e1ff',
          200: '#cfc4ff',
          300: '#ac97ff',
          400: '#8a68ff',
          500: '#6e3dff',
          600: '#5b21f0',
          700: '#4a17c9',
          800: '#3d16a1',
          900: '#331681',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(94, 40, 240, 0.25)',
        glow: '0 0 40px -5px rgba(110, 61, 255, 0.45)',
      },
      keyframes: {
        gradientMove: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        gradient: 'gradientMove 8s ease infinite',
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
};
