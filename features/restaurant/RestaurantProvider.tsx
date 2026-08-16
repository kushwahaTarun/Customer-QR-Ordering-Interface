"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Restaurant } from "@/types/dining";

interface RestaurantContextValue {
  restaurant: Restaurant;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({
  restaurant,
  children,
}: {
  restaurant: Restaurant;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ restaurant }), [restaurant]);
  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within RestaurantProvider");
  }
  return context.restaurant;
}
