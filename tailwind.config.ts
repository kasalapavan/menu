// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define Inter font
      },
      colors: {
        primary: '#fa6498', // Light Pink (page background)
        secondary: '#E91E63', // Dark Pink (buttons, headers)
        accent: '#880E4F', // Dark Dark Pink (headings, specialty text)
        textLight: '#FFFFFF', // White for main text
        textMuted: '#F0F0F0', // Slightly off-white for muted text (descriptions)
        warningRed: '#B71C1C', // A deep red for warning sections
        onHover: '#e2004b', 
      },
    },
  },
  plugins: [],
};
export default config;