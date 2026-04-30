/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          200: '#FFB3B3',
          300: '#FF8A8A',
          400: '#FF6B6B',
          500: '#FF5252',
          600: '#E55555',
          700: '#CC4444',
          800: '#B33333',
          900: '#992222',
        },
        secondary: {
          50: '#E8F6F5',
          100: '#D0EDEB',
          200: '#A1DBD7',
          300: '#72C9C3',
          400: '#4ECDC4',
          500: '#3DBDB4',
          600: '#339C94',
          700: '#297B74',
          800: '#1F5A55',
          900: '#153935',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}