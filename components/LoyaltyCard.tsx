"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function LoyaltyCard({ className }: { className?: string }) {
  const restaurant = useRestaurant();
  const { account } = useLoyalty();
  const name = account.joined ? account.name : "Guest";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.7rem] bg-linear-to-br from-primary/90 via-primary to-[#8a6a38] p-5 text-primary-foreground shadow-[0_18px_40px_rgba(0,0,0,0.2)]",
        restaurant.theme.mode === "light" &&
          "from-[#9c3d2e] via-[#b4533a] to-[#7a2e22]",
        className,
      )}
    >
      <div className="absolute -top-10 -right-8 size-36 rounded-full bg-white/10" />
      <p className="text-[11px] uppercase tracking-[0.24em] opacity-80">
        {restaurant.loyaltyProgramName}
      </p>
      <h2 className="font-heading mt-2 text-3xl">{name}</h2>
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] opacity-75">
            Points
          </p>
          <p className="mt-1 flex items-center gap-2 font-heading text-5xl leading-none">
            {account.joined ? account.points : "—"}
            <Star className="size-6 fill-current" />
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-full bg-white/15 text-primary-foreground hover:bg-white/25"
          render={<Link href={`/restaurant/${restaurant.slug}/loyalty`} />}
        >
          Wallet
        </Button>
      </div>
    </section>
  );
}
