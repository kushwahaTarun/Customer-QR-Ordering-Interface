"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/CartProvider";
import { LanguageProvider } from "@/features/i18n/LanguageProvider";
import { LoyaltyProvider } from "@/features/loyalty/LoyaltyProvider";
import { PrefsProvider } from "@/features/prefs/PrefsProvider";
import { RestaurantProvider } from "@/features/restaurant/RestaurantProvider";
import { SessionProvider } from "@/features/session/SessionProvider";
import { DiningChrome } from "@/components/dining/DiningChrome";
import { ThemeScope } from "@/components/dining/ThemeScope";
import { CartDrawer } from "@/components/CartDrawer";
import type { Restaurant } from "@/types/dining";

export function DiningProviders({
  restaurant,
  tableNumber,
  children,
}: {
  restaurant: Restaurant;
  tableNumber: string;
  children: ReactNode;
}) {
  return (
    <RestaurantProvider restaurant={restaurant}>
      <SessionProvider tableNumber={tableNumber}>
        <LanguageProvider>
          <PrefsProvider>
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
          </PrefsProvider>
        </LanguageProvider>
      </SessionProvider>
    </RestaurantProvider>
  );
}
