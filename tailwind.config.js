/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#050507",
        neonBlue: "#7f95ad",
        neonPink: "#b7848f",
        neonViolet: "#8a7aa6",
        neonGreen: "#c9b07a"
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 28px rgba(138,122,166,0.2)",
        cyan: "0 0 24px rgba(127,149,173,0.2)",
        pink: "0 0 24px rgba(183,132,143,0.2)"
      }
    }
  },
  plugins: []
};
