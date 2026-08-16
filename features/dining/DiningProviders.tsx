"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/CartProvider";
import { LoyaltyProvider } from "@/features/loyalty/LoyaltyProvider";
import { RestaurantProvider } from "@/features/restaurant/RestaurantProvider";
import { SessionProvider } from "@/features/session/SessionProvider";
import { DiningChrome } from "@/components/dining/DiningChrome";
import { ThemeScope } from "@/components/dining/ThemeScope";
import { CartDrawer } from "@/components/CartDrawer";
import type { Restaurant } from "@/types/dining";

export function DiningProviders({
  restaurant,
  children,
}: {
  restaurant: Restaurant;
  children: ReactNode;
}) {
  return (
    <RestaurantProvider restaurant={restaurant}>
      <SessionProvider>
        <CartProvider>
          <LoyaltyProvider>
            <ThemeScope>
              <DiningChrome>
                {children}
                <CartDrawer />
              </DiningChrome>
            </ThemeScope>
          </LoyaltyProvider>
        </CartProvider>
      </SessionProvider>
    </RestaurantProvider>
  );
}
