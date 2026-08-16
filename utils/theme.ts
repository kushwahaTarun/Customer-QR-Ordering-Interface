import type { CSSProperties } from "react";
import type { RestaurantTheme } from "@/types/dining";

const headingFonts = {
  cormorant: "var(--font-cormorant), 'Times New Roman', serif",
  fraunces: "var(--font-fraunces), Georgia, serif",
} as const;

const sansFonts = {
  outfit: "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif",
  "dm-sans": "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif",
} as const;

export function restaurantThemeStyle(theme: RestaurantTheme): CSSProperties {
  const { colors } = theme;
  return {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--card": colors.card,
    "--card-foreground": colors.cardForeground,
    "--popover": colors.popover,
    "--popover-foreground": colors.popoverForeground,
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondaryForeground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--accent": colors.accent,
    "--accent-foreground": colors.accentForeground,
    "--destructive": colors.destructive,
    "--border": colors.border,
    "--input": colors.input,
    "--ring": colors.ring,
    "--radius": theme.radius,
    "--restaurant-heading": headingFonts[theme.fonts.heading],
    "--restaurant-sans": sansFonts[theme.fonts.sans],
  } as CSSProperties;
}

export function isIndianMobile(value: string) {
  return /^[6-9]\d{9}$/.test(value.trim());
}
