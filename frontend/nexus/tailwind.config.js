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
      background: "var(--base)",
      foreground: "var(--text)",
      // background: "var(--bg-base-1)",
      // foreground: "var(--fg-base-1)",
      default: {
        bg0: "var(--bg-base-0)",
        bg1: "var(--bg-base-1)",
        bg2: "var(--bg-base-2)",
        fg0: "var(--fg-base-0)",
        fg1: "var(--fg-base-1)",
        fg2: "var(--fg-base-2)",
      },
      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--fg-primary)",
        hover: "var(--primary-hover)",
        foregroundHover: "var(--fg-primary-hover)",
        inverted: "var(--primary-inverted)",
        foregroundInverted: "var(--fg-primary-inverted)",
      },
      secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--fg-secondary)",
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
        DEFAULT: "var(--card)",
        foreground: "var(--card-foreground)",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
