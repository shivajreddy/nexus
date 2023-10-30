const {fontFamily} = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './index.html',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {"2xl": "1400px",},
    },
    extend: {
      borderColor: {
        DEFAULT: "var(--border-0)",
        b0: "var(--border-0)",
        b1: "var(--border-1)",
        b2: "var(--border-2)",
      },
      colors: {
        // input: "var(--input)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--bg-0)",
        foreground: "var(--fg-0)",
        // background: "var(--bg-base-1)",
        // foreground: "var(--fg-base-1)",
        default: {
          bg0: "var(--bg-0)",
          bg1: "var(--bg-1)",
          bg2: "var(--bg-2)",
          fg0: "var(--fg-0)",
          fg1: "var(--fg-1)",
          fg2: "var(--fg-2)",
        },
        button: {
          bg0: "var(--btn-bg-0)",
          bg1: "var(--btn-bg-1)",
          bg2: "var(--btn-bg-2)",
          fg0: "var(--btn-fg-0)",
          fg1: "var(--btn-fg-1)",
          fg2: "var(--btn-fg-2)",
        },
        primary: {
          DEFAULT: "var(--primary-bg-0)",
          bg0: "var(--primary-bg-0)",
          bg1: "var(--primary-bg-1)",
          fg0: "var(--primary-fg-0)",
          fg1: "var(--primary-fg-1)",
        },
        secondary: {
          DEFAULT: "var(--secondary-bg-0)",
          bg0: "var(--secondary-bg-0)",
          bg1: "var(--secondary-bg-1)",
          fg0: "var(--secondary-fg-0)",
          fg1: "var(--secondary-fg-1)",
        },
        destructive: {
          DEFAULT: "var(--destructive-bg-0)",
          bg0: "var(--destructive-bg-0)",
          bg1: "var(--destructive-bg-1)",
          fg0: "var(--destructive-fg-0)",
          fg1: "var(--destructive-fg-1)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          // DEFAULT: "var(--accent)",
          // foreground: "var(--accent-foreground)",
          DEFAULT: "var(--secondary)",
          foreground: "var(--fg-secondary)",
          hover: "var(--secondary-hover)",
          foregroundHover: "var(--fg-secondary-hover)",
          inverted: "var(--secondary-inverted)",
          foregroundInverted: "var(--fg-secondary-inverted)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--bg-2)",
          foreground: "var(--fg-0)",
        },
        borderRadius: {
          xl: `calc(var(--radius) + 4px)`,
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 2px)`,
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: ["var(--font-sans)", ...fontFamily.sans],
        },
        keyframes: {
          "accordion-down": {
            from: {height: 0},
            to: {height: "var(--radix-accordion-content-height)"},
          },
          "accordion-up": {
            from: {height: "var(--radix-accordion-content-height)"},
            to: {height: 0},
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
