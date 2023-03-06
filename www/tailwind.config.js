/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  darkMode: "class", //"class", '[data-theme="dark"]'], // hooks into docusaurus' dark mode settigns

  theme: {
    extend: {
      colors: {
        background: "#3A3A3A",
      },
    },
  },
  plugins: [],
};
