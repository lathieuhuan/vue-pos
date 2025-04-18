// import colors from 'tailwindcss/colors';
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,vue}"],
  theme: {
    colors: {
      transparent: "transparent",
      surface: {
        0: "#ffffff",
        100: "var(--p-surface-100)",
        200: "var(--p-surface-200)",
        300: "var(--p-surface-300)",
        400: "var(--p-surface-400)",
        500: "var(--p-surface-500)",
        600: "var(--p-surface-600)",
        700: "var(--p-surface-700)",
        800: "var(--p-surface-800)",
        900: "var(--p-surface-900)",
      },
      primary: {
        100: "var(--p-primary-100)",
        200: "var(--p-primary-200)",
        300: "var(--p-primary-300)",
        400: "var(--p-primary-400)",
        500: "var(--p-primary-500)",
        600: "var(--p-primary-600)",
        700: "var(--p-primary-700)",
        800: "var(--p-primary-800)",
        900: "var(--p-primary-900)",
      },
      warn: {
        100: "var(--p-orange-100)",
        200: "var(--p-orange-200)",
        300: "var(--p-orange-300)",
        400: "var(--p-orange-400)",
        500: "var(--p-orange-500)",
        600: "var(--p-orange-600)",
        700: "var(--p-orange-700)",
        800: "var(--p-orange-800)",
        900: "var(--p-orange-900)",
      },
      danger: {
        100: "var(--p-red-100)",
        200: "var(--p-red-200)",
        300: "var(--p-red-300)",
        400: "var(--p-red-400)",
        500: "var(--p-red-500)",
        600: "var(--p-red-600)",
        700: "var(--p-red-700)",
        800: "var(--p-red-800)",
        900: "var(--p-red-900)",
      },
      borderRadius: {
        xs: "var(--p-border-radius-xs)",
        sm: "var(--p-border-radius-sm)",
        DEFAULT: "var(--p-border-radius-md)",
        lg: "var(--p-border-radius-lg)",
        xl: "var(--p-border-radius-xl)",
      },
    },
    extend: {
      content: {
        pseudo: "''",
      },
    },
  },
  plugins: [],
};
