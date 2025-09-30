import type { Config } from "tailwindcss";
import TailwindCssAnimation from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          body: "hsl(var(--body-background))",
        },

        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          300: "hsl(var(--primary-300))",
          500: "hsl(var(--primary-500))",
          foreground: "hsl(var(--primary-foreground))",
          selected: "hsl(var(--primary-selected))",
        },
        secondary: {
          200: "hsl(var(--secondary-200))",
          300: "hsl(var(--secondary-300))",
          DEFAULT: "hsl(var(--secondary))",
          500: "hsl(var(--secondary-500))",
          600: "hsl(var(--secondary-600))",
          700: "hsl(var(--secondary-700))",
          800: "hsl(var(--secondary-800))",
          foreground: "hsl(var(--secondary-foreground))",
          text: "hsl(var(--secondary-text))",
        },
        gray: {
          DEFAULT: "hsl(var(--gray))",
          600: "hsl(var(--gray-600))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        input: {
          DEFAULT: "hsl(var(--input))",
          disabled: "hsl(var(--input-disabled))",
          placeholder: "hsl(var(--placeholder))",
        },

        // stroke, divider and border
        border: {
          DEFAULT: "hsl(var(--border))",
          primary: "hsl(var(--primary-border))",
        },

        ring: "hsl(var(--ring))",
        divider: {
          DEFAULT: "hsl(var(--divider))",
          secondary: "hsl(var(--divider-secondary))",
        },

        btn: {
          "outline-border": "hsl(var(--btn-outline-border))",
        },

        // status colors

        status: {
          secondary: {
            DEFAULT: "hsl(var(--status-secondary))",
            foreground: "hsl(var(--status-secondary-foreground))",
          },
        },

        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },

        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },

        important: {
          DEFAULT: "hsl(var(--important))",
          foreground: "hsl(var(--important-foreground))",
        },

        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },

        spacial: {
          green: {
            DEFAULT: "hsl(var(--spacial-green))",
            foreground: "hsl(var(--spacial-green-foreground))",
          },

          blue: {
            DEFAULT: "hsl(var(--spacial-blue))",
            foreground: "hsl(var(--spacial-blue-foreground))",
          },

          red: {
            DEFAULT: "hsl(var(--spacial-red))",
            foreground: "hsl(var(--spacial-red-foreground))",
          },
        },
      },
      boxShadow: {
        default:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
        defaultLite:
          "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
        "light-8":
          "0px 4px 8px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
        "light-16":
          "0px 8px 16px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
        featured:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [TailwindCssAnimation],
} satisfies Config;

export default config;
