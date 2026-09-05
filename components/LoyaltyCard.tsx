"use client";

import { ButtonLink } from "@/components/ui/button";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function LoyaltyCard({ className }: { className?: string }) {
  const restaurant = useRestaurant();
  const { account } = useLoyalty();
  const name = account.joined ? account.name : "Guest of the house";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] p-5 text-[#1a140c] shadow-[0_24px_50px_rgba(0,0,0,0.22)]",
        "bg-[linear-gradient(145deg,#f3e2bc_0%,#c9a46a_46%,#8d6a32_100%)]",
        restaurant.theme.mode === "light" &&
          "bg-[linear-gradient(145deg,#f0d2c4_0%,#c4784a_48%,#7a2e22_100%)] text-[#fff8f1]",
        className,
      )}
    >
      <div className="absolute top-5 right-5 size-10 rounded-full border border-current/25" />
      <div className="absolute top-7 right-7 size-6 rounded-full border border-current/20" />
      <p className="text-[10px] tracking-[0.32em] uppercase opacity-70">
        {restaurant.loyaltyProgramName}
      </p>
      <h2 className="font-heading mt-6 text-4xl leading-none">{name}</h2>
      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase opacity-70">
            House points
          </p>
          <p className="font-heading mt-1 text-5xl leading-none">
            {account.joined ? account.points : "—"}
          </p>
        </div>
        <ButtonLink
          href={`/restaurant/${restaurant.slug}/loyalty`}
          variant="secondary"
          className="rounded-full border border-current/20 bg-black/10 text-inherit hover:bg-black/16"
        >
          Rewards
        </ButtonLink>
      </div>
    </section>
  );
}
