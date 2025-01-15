import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import { fontFamily } from "tailwindcss/defaultTheme";

const nextuicfg = {
  themes: {
    light: {
      colors: {
        default: "#E1E2E2",
        background: "#F2F5F7",
        foreground: "#1B1F22",
        primary: {
          DEFAULT: "#1B1F22",
          foreground: "#FAFAFA",
          50: "#FAFAFA",
          100: "#E1E2E2",
          200: "#C8C9CA",
          300: "#B0B1B2",
          400: "#97999A",
          500: "#7E8082",
          600: "#65686A",
          700: "#4D5052",
          800: "#34373A",
          900: "#1B1F22",
        },
        secondary: {
          DEFAULT: "#02C7BE",
          foreground: "#FFFFFF",
          50: "#007AFE",
          100: "#53ACC0",
          200: "#4DA2B6",
          300: "#4799AB",
          400: "#418FA1",
          500: "#3B8697",
          600: "#357C8D",
          700: "#2F7382",
          800: "#296978",
          900: "#23606E",
        },
      },
    },
    dark: {
      colors: {
        background: "#1B1F22",
        foreground: "#FAFAFA",
        primary: {
          DEFAULT: "#FAFAFA",
          foreground: "#1B1F22",
          50: "#1B1F22",
          100: "#34373A",
          200: "#4D5052",
          300: "#65686A",
          400: "#7E8082",
          500: "#97999A",
          600: "#B0B1B2",
          700: "#C8C9CA",
          800: "#E1E2E2",
          900: "#FAFAFA",
        },
        secondary: {
          DEFAULT: "#59B5CA",
          foreground: "#FAFAFA",
          50: "#23606E",
          100: "#296978",
          200: "#2F7382",
          300: "#357C8D",
          400: "#3B8697",
          500: "#418FA1",
          600: "#4799AB",
          700: "#4DA2B6",
          800: "#53ACC0",
          900: "#59B5CA",
        },
      },
    },
  },
};
export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        enter: "enter 0.3s ease-out normal both",
        shine: "shine var(--duration) infinite linear",
        "line-shadow": "line-shadow 15s linear infinite",
      },
      keyframes: {
        enter: {
          "0%": {
            opacity: "0",
            transform: "translateZ(0) scale(0.90)",
          },
          "60%": {
            opacity: "0.75",
            transform: "translateZ(0) scale(1.02)",
            backfaceVisibility: "hidden",
            webkitFontSmoothing: "antialiased",
          },
          "100%": {
            opacity: "1",
            transform: "translateZ(0) scale(1)",
          },
        },
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        "line-shadow": {
          "0%": { "background-position": "0 0" },
          "100%": { "background-position": "100% -100%" },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        inter: ["var(--font-inter)"],
        cherry: ["var(--font-cherry)"],
        lucky: ["var(--font-lucky)"],
        poet: ["var(--font-poet)"],
      },
      colors: {
        void: "#1b1f22",
        chalk: "#fafafa",
        ghost: "#F2F5F7",
        cool: "#f5f5ff",
        base: "#E8EBED",
        primer: "#8D97AF",
        fade: "#D5D8DC",
        shade: "#D0D6DD",
        azure: "#79A6D3",
        tan: "#DE4A28",
        hades: "#272F43",
        demigod: "#d9d9d9",
        goddess: "#F7F6F4",
        god: "#EAE9E7",
        coal: "#171717",
        workos: "#6363f1",
        coolgray: "#eceff1",
        cake: "#F3F1FF",
        ice: "#ECEEFF", //#E7EBFF
        coolice: "#D6E3FF", //#CEE0FF
        coolbreeze: "#E3FAED",
        vanilla: "#F3FCEE",
        army: "#AAB5B5",
        darkarmy: "#4C5C67",
        peach: "#fb923c",
        ///////////////////
        //MACOS
        "macl-red": "#FF3B2F",
        "macd-red": "#FE453A",
        "macl-orange": "#FF9500",
        "macd-orange": "#FF9E0B",
        "macl-yellow": "#FFCC01",
        "macd-yellow": "#FFD608",
        "macl-green": "#26CD41",
        "macd-green": "#32D74B",
        "macl-mint": "#02C7BE",
        "macd-mint": "#66D4CF",
        "macl-teal": "#59ADC4",
        "macd-teal": "#69C4DC",
        "macl-cyan": "#54BEF0",
        "macd-cyan": "#5AC8F4",
        "macl-blue": "#007AFE",
        "macd-blue": "#0A84FF",
        "macl-indigo": "#5856D6",
        "macd-indigo": "#5E5CE6",
        "macl-purple": "#AE52DE",
        "macd-purple": "#BE5AF2",
        "macl-pink": "#FF375F",
        "macd-pink": "#FF6482",
        "macl-brown": "#A2845E",
        "macd-brown": "#AC8E68",
        "macl-gray": "#8E8E93",
        "macd-gray": "#98989D",
      },
    },
  },
  plugins: [nextui(nextuicfg)],
} satisfies Config;
