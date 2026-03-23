/**
 * theme-tokens.ts — "Liquid Precision" Design System
 *
 * Centralised color tokens for dark and light modes.
 * Import `useTokens()` in any component to get the correct
 * set of colors for the active theme, avoiding prop-drilling
 * and keeping inline styles theme-aware.
 */

export interface ThemeTokens {
  // Backgrounds
  bg: string;           // page background
  surface: string;      // card / panel background
  surface2: string;     // slightly elevated surface
  surfaceHover: string; // surface on hover
  panelBg: string;      // slide-in panel background
  navBg: string;        // top nav scrolled background

  // Borders
  border: string;       // default border
  borderSubtle: string; // very subtle border

  // Text
  textPrimary: string;  // headings
  textSecondary: string;// body copy
  textMuted: string;    // muted / placeholder
  textDim: string;      // very dim labels

  // Accents (same in both modes)
  mint: string;
  mintDim: string;      // mint at low opacity
  violet: string;

  // Watermark section numbers
  sectionNumber: string;

  // Misc
  backdropBg: string;   // overlay backdrop
  scrollbarThumb: string;
}

const dark: ThemeTokens = {
  bg:            "oklch(0.09 0.018 240)",
  surface:       "oklch(0.12 0.022 240)",
  surface2:      "oklch(0.16 0.018 240)",
  surfaceHover:  "oklch(0.14 0.025 240)",
  panelBg:       "oklch(0.10 0.02 240)",
  navBg:         "oklch(0.09 0.018 240 / 0.92)",

  border:        "oklch(0.22 0.02 240)",
  borderSubtle:  "oklch(0.18 0.018 240)",

  textPrimary:   "oklch(0.92 0.008 220)",
  textSecondary: "oklch(0.55 0.025 240)",
  textMuted:     "oklch(0.50 0.02 240)",
  textDim:       "oklch(0.45 0.02 240)",

  mint:          "oklch(0.88 0.18 168)",
  mintDim:       "oklch(0.88 0.18 168 / 0.5)",
  violet:        "oklch(0.62 0.22 285)",

  sectionNumber: "oklch(0.92 0.008 220 / 0.03)",

  backdropBg:    "oklch(0.05 0.01 240 / 0.7)",
  scrollbarThumb:"oklch(0.22 0.02 240)",
};

const light: ThemeTokens = {
  bg:            "oklch(0.97 0.006 240)",
  surface:       "oklch(1 0 0)",
  surface2:      "oklch(0.95 0.008 240)",
  surfaceHover:  "oklch(0.93 0.01 240)",
  panelBg:       "oklch(0.99 0.004 240)",
  navBg:         "oklch(0.97 0.006 240 / 0.94)",

  border:        "oklch(0.88 0.01 240)",
  borderSubtle:  "oklch(0.92 0.008 240)",

  textPrimary:   "oklch(0.18 0.02 240)",
  textSecondary: "oklch(0.38 0.02 240)",
  textMuted:     "oklch(0.48 0.018 240)",
  textDim:       "oklch(0.55 0.015 240)",

  mint:          "oklch(0.55 0.18 168)",   // darker mint for light bg legibility
  mintDim:       "oklch(0.55 0.18 168 / 0.5)",
  violet:        "oklch(0.50 0.22 285)",   // darker violet for light bg

  sectionNumber: "oklch(0.18 0.02 240 / 0.04)",

  backdropBg:    "oklch(0.3 0.01 240 / 0.5)",
  scrollbarThumb:"oklch(0.82 0.01 240)",
};

export const tokens = { dark, light };

import { useTheme } from "@/contexts/ThemeContext";

export function useTokens(): ThemeTokens {
  const { theme } = useTheme();
  return theme === "dark" ? dark : light;
}
