import daisyui from 'daisyui'
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Scans all files in src with these extensions
    "./public/**/*.html",              // Scans all HTML files in the public folder
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
};
