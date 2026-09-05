"use client";

import Image from "next/image";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function BrandMark({
  size = 56,
  showName = false,
  className,
}: {
  size?: number;
  showName?: boolean;
  className?: string;
}) {
  const restaurant = useRestaurant();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-background/70 ring-1 ring-primary/40"
        style={{ width: size, height: size }}
      >
        <Image
          src={restaurant.logo}
          alt={showName ? "" : restaurant.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
      {showName ? (
        <p className="font-heading text-2xl leading-none">{restaurant.name}</p>
      ) : null}
    </div>
  );
}
