// src/lib/theme.ts

export const ghibliColors = {
  // Original light theme colors
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Sky blue inspired by "Castle in the Sky"
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Lush green inspired by "My Neighbor Totoro"
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  accent: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316", // Warm orange inspired by "Howl's Moving Castle" fire
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
  },
  background: {
    light: "#fdfbf3", // Soft cream background often seen in Ghibli films
    main: "#f8f5e6",
    dark: "#ebe7d8",
  },
  foreground: {
    light: "#5c5c5c",
    main: "#4a4a4a",
    dark: "#2a2a2a",
  },
  
  // Add dark theme colors
  dark: {
    primary: {
      50: "#082f49",
      100: "#0c4a6e",
      200: "#075985",
      300: "#0369a1",
      400: "#0284c7",
      500: "#0ea5e9", // Keep the same accent blue for consistency
      600: "#38bdf8",
      700: "#7dd3fc",
      800: "#bae6fd",
      900: "#e0f2fe",
      950: "#f0f9ff",
    },
    secondary: {
      50: "#052e16",
      100: "#14532d",
      200: "#166534",
      300: "#15803d",
      400: "#16a34a",
      500: "#22c55e", // Keep the same accent green for consistency
      600: "#4ade80",
      700: "#86efac",
      800: "#bbf7d0",
      900: "#dcfce7",
      950: "#f0fdf4",
    },
    accent: {
      50: "#431407",
      100: "#7c2d12",
      200: "#9a3412",
      300: "#c2410c",
      400: "#ea580c",
      500: "#f97316", // Keep the same accent orange for consistency
      600: "#fb923c",
      700: "#fdba74",
      800: "#fed7aa",
      900: "#ffedd5",
      950: "#fff7ed",
    },
    background: {
      light: "#272727", // Darker tones inspired by night scenes in Ghibli films
      main: "#1a1a1a",
      dark: "#121212",
    },
    foreground: {
      light: "#e0e0e0",
      main: "#f0f0f0",
      dark: "#ffffff",
    }
  }
};