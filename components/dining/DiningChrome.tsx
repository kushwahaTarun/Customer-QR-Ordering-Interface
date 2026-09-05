"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/dining/BottomNav";
import { FloatingCartBar } from "@/components/dining/FloatingCartBar";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function DiningChrome({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();

  return (
    <div
      className={cn(
        "relative min-h-dvh",
        restaurant.theme.mode === "dark" ? "bg-[#0C0608]" : "bg-[#cbb59a]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-3xl"
          style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative mx-auto w-full max-w-md md:px-0 md:py-10">
        <div className="device-bezel mx-auto flex min-h-dvh w-full flex-col shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:min-h-[880px] md:overflow-hidden md:rounded-[2.4rem] md:p-[10px] md:ring-1 md:ring-[#d4af37]/25">
          <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-background md:min-h-[860px] md:rounded-[1.9rem]">
            <main id="main-content" className="relative flex-1 pb-40" tabIndex={-1}>
              {children}
            </main>
            <FloatingCartBar />
            <BottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
