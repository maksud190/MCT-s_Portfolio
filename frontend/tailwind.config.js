export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class', // 🔥 এটা theme এর আগে রাখুন
  theme: {
    extend: {
      fontFamily: {
        // ✅ Add Poppins as default sans font
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};