/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {},
};
export const plugins = [
  // This is DaisyUI, our component library for pre-built components
  require('daisyui'),
];
export const daisyui = {
  themes: ["dark", "cupcake"],
};
