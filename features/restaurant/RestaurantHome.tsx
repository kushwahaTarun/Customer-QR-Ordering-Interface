"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin } from "lucide-react";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { MenuCard } from "@/components/MenuCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { useSession } from "@/features/session/SessionProvider";

export function RestaurantHome() {
  const restaurant = useRestaurant();
  const { tableNumber } = useSession();
  const { items } = useCart();
  const featured = restaurant.menuItems.filter(
    (item) => item.popular || item.chefPick,
  );

  return (
    <div className="animate-rise">
      <section className="relative h-[58vh] min-h-[420px]">
        <Image
          src={restaurant.coverImage}
          alt={`${restaurant.name} dining room`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/35 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
          <div className="mb-4 flex items-end justify-between">
            <div className="relative size-16 overflow-hidden rounded-2xl bg-background/70 ring-1 ring-primary/30 backdrop-blur">
              <Image
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="rounded-full border border-primary/30 bg-background/55 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary backdrop-blur">
              Table No: {tableNumber}
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary">
            {restaurant.tagline}
          </p>
          <h1 className="font-heading mt-1 text-5xl leading-none">
            {restaurant.name}
          </h1>
          <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-foreground/80">
            {restaurant.description}
          </p>
        </div>
      </section>

      <section className="space-y-6 px-5 pt-6">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {restaurant.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {restaurant.hours}
          </span>
        </div>

        <div>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-heading text-3xl">The menu</h2>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Four rooms
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {restaurant.categories.map((category) => (
              <Link
                key={category.id}
                href={`/restaurant/${restaurant.slug}/menu/${category.slug}`}
                className="group relative overflow-hidden rounded-[1.4rem] ring-1 ring-foreground/10"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="200px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="font-heading text-2xl text-white">
                      {category.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/75">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {items.length > 0 ? (
          <RecommendationCard triggerItemIds={items.map((line) => line.itemId)} />
        ) : null}

        <div className="space-y-4">
          <h2 className="font-heading text-3xl">This evening</h2>
          {featured.slice(0, 3).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <LoyaltyCard />
      </section>
    </div>
  );
}
