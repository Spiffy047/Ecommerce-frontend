// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecf0f1',
          500: '#3498db',
          600: '#2980b9',
        },
        secondary: {
          500: '#2ecc71',
          600: '#27ae60',
        },
        gray: {
          700: '#34495e',
          600: '#2c3e50',
          500: '#7f8c8d',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 6px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
};

