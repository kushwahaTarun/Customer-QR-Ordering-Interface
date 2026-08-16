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
        restaurant.theme.mode === "dark" ? "bg-[#070504]" : "bg-[#d8c7b0]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl"
          style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-[0_0_80px_rgba(0,0,0,0.35)] md:min-h-[860px] md:my-8 md:overflow-hidden md:rounded-[2rem] md:ring-1 md:ring-foreground/10">
        <main className="relative flex-1 pb-36">{children}</main>
        <FloatingCartBar />
        <BottomNav />
      </div>
    </div>
  );
}
