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
        neonBlue: "#2f6bff",
        neonPink: "#ff2ebc",
        neonViolet: "#8b39ff",
        neonGreen: "#00ffb3"
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 35px rgba(139,57,255,0.35)",
        cyan: "0 0 30px rgba(47,107,255,0.28)",
        pink: "0 0 30px rgba(255,46,188,0.3)"
      }
    }
  },
  plugins: []
};
