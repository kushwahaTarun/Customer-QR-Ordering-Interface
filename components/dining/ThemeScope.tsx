"use client";

import type { ReactNode } from "react";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { restaurantThemeStyle } from "@/utils/theme";
import { cn } from "@/lib/utils";

export function ThemeScope({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  return (
    <div
      data-restaurant={restaurant.slug}
      className={cn(
        "dining-root min-h-dvh font-sans antialiased",
        restaurant.theme.mode === "dark" && "dark",
      )}
      style={restaurantThemeStyle(restaurant.theme)}
    >
      {children}
    </div>
  );
}
