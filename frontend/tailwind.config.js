import daisyui from 'daisyui'
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Scans all files in src with these extensions
    "./public/**/*.html",              // Scans all HTML files in the public folder
  ],
  theme: {
    extend: {},
  },
  plugins: 
  [daisyui],
  daisyui:
  {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  }
};
