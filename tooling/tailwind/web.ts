import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

import base from "./base";

export default {
  content: base.content,
  presets: [base],
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
        "text-primary": "rgba(23, 22, 25, 1)",
        "text-secondary": "rgba(61, 56, 73, 1)",
        "text-tertiary": "rgba(185, 184, 188, 1)",
        "text-inverse": "rgba(254, 254, 254, 1)",
        "text-error": "rgba(220, 58, 58, 1)",
        "text-accent": "rgba(86, 58, 220, 1)",
        "buttons-primary": "rgba(86, 58, 220, 1)",
        "buttons-secondary": "rgba(243, 245, 247, 1)",
        "buttons-hover-primary": "rgba(102, 77, 222, 1)",
        "buttons-hover-secondary": "rgba(232, 236, 239, 1)",
        "buttons-inverse": "rgba(254, 254, 254, 1)",
        "buttons-hover-inverse": "rgba(232, 236, 239, 1)",
        "button-hover-stroke": "rgba(243, 245, 247, 1)",
        "purple-2": "rgba(236, 236, 255, 1)",
        "green-1": "rgba(9, 255, 75, 1)",
        "surface-inverse": "rgba(254, 254, 254, 1)",
        "stroke-secondary": "rgba(236, 236, 236, 1)",
        "surface-secondary": "rgba(243, 245, 247, 1)",
        "sroke-state-disable": "rgba(232, 236, 239, 1)",
        "icons-tertiary": "rgba(61, 56, 73, 1)",
      },
      borderRadius: {
        "panel-l": "20px",
      },
      backgroundImage: {
        "linear-pink": "linear-gradient(265.1deg, #563ADC 0%, #884DE8 100%);",
        "linear-purple": "linear-gradient(265.1deg, #563ADC 0%, #884DE8 100%);",
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
    },
  },
  plugins: [animate],
} satisfies Config;
