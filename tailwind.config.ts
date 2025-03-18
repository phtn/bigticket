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
          DEFAULT: "#14B8A6",
          foreground: "#F0FDFA",
          50: "#F0FDFA",
          100: "#D8F5F1",
          200: "#BFEEE7",
          300: "#A7E6DE",
          400: "#8EDED5",
          500: "#76D7CB",
          600: "#5DCFC2",
          700: "#45C7B9",
          800: "#2CC0AF",
          900: "#14B8A6",
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
  darkMode: ["class"],
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        "3000": "3000ms",
        "4000": "4000ms",
        "5000": "5000ms",
      },
      animation: {
        "background-position-spin":
          "background-position-spin 3000ms infinite alternate",
        enter: "enter 0.3s ease-out normal both",
        "enter-200": "enter 0.3s delay-200 ease-out normal both",
        shine: "shine var(--duration) infinite linear",
        "line-shadow": "line-shadow 15s linear infinite",
      },
      keyframes: {
        "background-position-spin": {
          "0%": {
            backgroundPosition: "top center",
          },
          "100%": {
            backgroundPosition: "bottom center",
          },
        },
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
        "enter-200": {
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
          "0%": {
            "background-position": "0 0",
          },
          "100%": {
            "background-position": "100% -100%",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", ...fontFamily.sans],
        mono: ["var(--font-mono)"],
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
        ice: "#ECEEFF",
        coolice: "#D6E3FF",
        coolbreeze: "#E3FAED",
        vanilla: "#F3FCEE",
        army: "#AAB5B5",
        darkarmy: "#4C5C67",
        peach: "#FB923C",
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
        google: "#464749",
        ticket: "#34373A",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // popover: {
        //   DEFAULT: "hsl(var(--popover))",
        //   foreground: "hsl(var(--popover-foreground))",
        // },
        // primary: {
        //   DEFAULT: "hsl(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        // secondary: {
        // 	DEFAULT: 'hsl(var(--secondary))',
        // 	foreground: 'hsl(var(--secondary-foreground))'
        // },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [nextui(nextuicfg), require("tailwindcss-animate")],
} satisfies Config;
