/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      textColor: {
        base: 'var(--background)'
      }
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      border: "var(--border-1)",
      input: "var(--input)",
      // input: "hsl(var(--input))",
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
        border0: "var(--border-0)",
        border1: "var(--border-1)",
        border2: "var(--border-2)",
      },
      primary: {
        DEFAULT: "var(--primary)",
        bg0: "var(--)",
        bg1: "",
        bg2: "",
        foreground: "var(--fg-primary)",
        foreground1: "var(--fg-primary)",
        hover: "var(--primary-hover)",
        foregroundHover: "var(--fg-primary-hover)",
        inverted: "var(--primary-inverted)",
        foregroundInverted: "var(--fg-primary-inverted)",
      },
      secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--fg-0)",
        hover: "var(--secondary-hover)",
        foregroundHover: "var(--fg-secondary-hover)",
        inverted: "var(--secondary-inverted)",
        foregroundInverted: "var(--fg-secondary-inverted)",
      },
      destructive: {
        DEFAULT: "var(--destructive)",
        foreground: "var(--fg-destructive)",
        hover: "var(--destructive-hover)",
        foregroundHover: "var(--fg-destructive-hover)",
        inverted: "var(--destructive-inverted)",
        foregroundInverted: "var(--fg-destructive-inverted)",
      },
      muted: {
        DEFAULT: "var(--muted)",
        foreground: "var(--muted-foreground)",
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
    }
  },
  plugins: [require("tailwindcss-animate")],
}
