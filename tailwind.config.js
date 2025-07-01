/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // --- Dark/Gray & Gold Palette ---
        main_bg: '#23272a',        // App dark gray background
        main_dark: '#18191a',      // Even darker gray
        main_gold: '#FFD700',      // Gold
        main_gold_dark: '#B8860B', // Deeper/darker gold

        accent: '#FFD700',         // Gold as accent
        primary: '#23272a',        // Use for main backgrounds
        muted: '#666',             // For muted text/etc
        glass: '#23272a99',        // For frosted overlays

        // --- Your legacy palette, unchanged ---
        blue_side: '#1e3a8a',   // Strong blue
        red_side: '#be123c',    // Strong red
        winner_gold: '#ffd700',
        dark_bg: '#131313',
        
      }
    }
  },
  plugins: [],
}
