/** @type {import('tailwindcss').Config} */
export const content = [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './pages/**/*.{js,ts,jsx,tsx}',
];

export const theme = {
  extend: {
    colors: {
      'primary-green': '#69bc55', 
    },
  },
};

export const plugins = [];
