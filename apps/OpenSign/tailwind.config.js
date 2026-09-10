/** @type {import('tailwindcss').Config} */

// SWURV THEME — palette ported from swurv.tax (see NOTICE-swurv.md).
// Source tokens, verbatim from swurv.tax/index.html :root —
//   --primary #1F1E5B (Deep Navy)   --primary-dark #16154A   --secondary #5E5D8A (Slate Blue)
//   --accent  #F0790C (Orange)      --accent-light #F29E4D   --gray-900 #111827 (site canvas)
//   --text    #2D3748              --gray-50 #F9FAFB        --gray-100 #F0F0F3
//   --gray-300 #E0E0E0             --gray-600 #4B5563
// Status colours from swurv.tax/styles.css: success #10B981, warning #F59E0B, error #EF4444.
// Hairline from swurv.tax/guides/index.html: rgba(255,255,255,0.1).
//
// The theme KEYS (opensigncss / opensigndark) are deliberately unchanged: they are referenced
// as Tailwind variants (`opensigncss:` / `opensigndark:`) in ~12 components and compared as
// data-theme string literals in Header.jsx, constant/const.js, index.jsx and ThemeToggle.jsx.
// Only the values are swapped.

// Shared across both themes: swurv.tax's radius language and status colours.
const swurvShared = {
  info: "#5E5D8A",
  "info-content": "#FFFFFF",
  success: "#10B981",
  "success-content": "#052E1F",
  warning: "#F59E0B",
  "warning-content": "#2A1A00",
  error: "#EF4444",
  "error-content": "#FFFFFF",

  "--rounded-btn": "0.75rem", // 12px — swurv.tax .cta-button (upstream was 1.9rem pills)
  "--rounded-box": "1rem", // 16px — swurv.tax default card radius
  "--rounded-badge": "99px", // swurv.tax .eyebrow pill
  "--tab-border": "2px",
  "--tab-radius": "0.75rem"
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // swurv.tax loads Inter 400-800; see index.html
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      }
    }
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities, addVariant }) {
      // ✅ Variants that match html[data-theme="..."] (or any ancestor with data-theme)
      addVariant("opensigncss", '[data-theme="opensigncss"] &');
      addVariant("opensigndark", '[data-theme="opensigndark"] &');

      addUtilities({
        // Prevent iOS long-press popup
        ".touch-callout-none": {
          "-webkit-touch-callout": "none"
        },
        // Disabled button. Was hardcoded VS Code grey; now reads the per-theme
        // --btn-disabled-* variables so it is correct in light mode too.
        ".op-btn-vscode-disabled": {
          "background-color": "var(--btn-disabled-bg) !important",
          color: "var(--btn-disabled-color) !important",
          "border-color": "var(--btn-disabled-border) !important",
          cursor: "not-allowed !important",
          opacity: "1 !important",
          "&:hover": {
            "background-color": "var(--btn-disabled-bg) !important",
            color: "var(--btn-disabled-color) !important",
            "border-color": "var(--btn-disabled-border) !important",
            transform: "none !important"
          }
        },
        // Dark mode icon improvements using DaisyUI theme detection
        '[data-theme="opensigndark"] .icon-improved': {
          color: "#E0E0E0 !important"
        },
        '[data-theme="opensigndark"] .icon-muted': {
          color: "#9CA3AF !important"
        },
        '[data-theme="opensigndark"] .icon-disabled': {
          color: "#6B7280 !important"
        },
        // Gray text utilities are remapped per theme in
        // src/styles/swurv-overrides.css (single source of truth), not here --
        // !important in a utility would override that file.
        // CSS variable utilities that work with arbitrary values
        ".icon-themed": {
          color: "var(--icon-color)"
        },
        ".icon-themed-muted": {
          color: "var(--icon-color-muted)"
        },
        ".icon-themed-disabled": {
          color: "var(--icon-color-disabled)"
        },
        ".btn-themed-disabled": {
          "background-color": "var(--btn-disabled-bg)",
          color: "var(--btn-disabled-color)",
          "border-color": "var(--btn-disabled-border)",
          cursor: "not-allowed",
          "&:hover": {
            "background-color": "var(--btn-disabled-bg)",
            color: "var(--btn-disabled-color)",
            "border-color": "var(--btn-disabled-border)",
            transform: "none"
          }
        }
      });
    }
  ],
  daisyui: {
    // themes: true,
    themes: [
      {
        // Default theme (forced in src/index.jsx). This IS the swurv.tax look:
        // near-black #111827 canvas, white body copy, orange as the action colour.
        opensigndark: {
          ...swurvShared,

          // Orange is primary in BOTH themes: navy #1F1E5B on a #111827 canvas is
          // ~1.3:1 and unusable as a button. swurv.tax follows the same logic —
          // on dark, orange carries emphasis and navy is a surface colour.
          primary: "#F0790C", // --accent, Vibrant Orange
          // Navy on orange (~5:1). swurv.tax uses white-on-orange, but only as the
          // hover state of a 1.25rem/600 CTA; #FFFFFF on #F0790C is ~2.8:1 and fails
          // even large-text AA, which does not hold up on small dense buttons.
          "primary-content": "#16154A",

          secondary: "#5E5D8A", // --secondary, Slate Blue
          "secondary-content": "#FFFFFF",

          accent: "#F29E4D", // --accent-light: the site's heading/link colour on dark
          "accent-content": "#16154A",

          neutral: "#1F2937",
          "neutral-content": "#E0E0E0", // --gray-300

          "base-100": "#111827", // --gray-900, the swurv.tax canvas
          "base-200": "#171E2B", // slight elevation (cards)
          "base-300": "#1F2937", // further elevated (panels)
          "base-content": "#FFFFFF", // swurv.tax body colour

          "--icon-color": "#E0E0E0",
          "--icon-color-muted": "#9CA3AF",
          "--icon-color-disabled": "#6B7280",
          "--btn-disabled-bg": "#1F2937",
          "--btn-disabled-color": "#6B7280",
          "--btn-disabled-border": "#374151",

          "--navbar-padding": "0.8rem",
          "--border-color": "rgba(255, 255, 255, 0.1)", // swurv.tax --hairline
          "--tooltip-color": "#1F1E5B"
        }
      },
      {
        // Light theme, built from swurv.tax's own light tokens. The site itself is
        // dark-only, so this is an on-brand derivative rather than a match.
        opensigncss: {
          ...swurvShared,

          primary: "#F0790C",
          "primary-content": "#16154A",

          secondary: "#1F1E5B", // --primary, Deep Navy reads as the strong colour on light
          "secondary-content": "#FFFFFF",

          accent: "#F0790C", // full-strength orange; --accent-light is too pale on white
          "accent-content": "#16154A",

          neutral: "#E0E0E0", // --gray-300
          "neutral-content": "#4B5563", // --gray-600

          "base-100": "#FFFFFF",
          "base-200": "#F9FAFB", // --gray-50
          "base-300": "#F0F0F3", // --gray-100
          "base-content": "#2D3748", // --text

          "--icon-color": "#4B5563",
          "--icon-color-muted": "#718096", // --text-light
          "--icon-color-disabled": "#A0AEC0",
          "--btn-disabled-bg": "#F0F0F3",
          "--btn-disabled-color": "#A0AEC0",
          "--btn-disabled-border": "#E0E0E0",

          "--navbar-padding": "0.8rem",
          "--border-color": "#E0E0E0",
          "--tooltip-color": "#1F1E5B"
        }
      }
    ],
    prefix: "op-"
  }
};
