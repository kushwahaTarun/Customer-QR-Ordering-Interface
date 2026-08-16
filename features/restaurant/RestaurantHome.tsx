"use client";

import Image from "next/image";
import Link from "next/link";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { MenuCard } from "@/components/MenuCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SectionTitle } from "@/components/dining/SectionTitle";
import { Button } from "@/components/ui/button";
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
      <section className="relative h-[68vh] min-h-[460px]">
        <Image
          src={restaurant.coverImage}
          alt={`${restaurant.name} dining room`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_32%,var(--background)_96%)]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-[max(1.1rem,env(safe-area-inset-top))]">
          <div className="relative size-[3.4rem] overflow-hidden rounded-full bg-background/50 ring-1 ring-primary/35 backdrop-blur">
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              fill
              className="object-contain p-2"
            />
          </div>
          <div className="rounded-full border border-primary/30 bg-black/25 px-3 py-2 text-center backdrop-blur">
            <p className="eyebrow !text-[0.58rem]">Table</p>
            <p className="font-heading text-xl leading-none text-primary">
              {tableNumber.padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7">
          <p className="eyebrow">{restaurant.tagline}</p>
          <h1 className="font-heading mt-3 text-[3.4rem] leading-[0.86]">
            {restaurant.name}
          </h1>
          <p className="serif-italic mt-3 max-w-[20rem] text-lg leading-snug text-foreground/82">
            {restaurant.description}
          </p>
          <Button
            className="gold-fill mt-6 h-12 rounded-full px-7 tracking-[0.14em] uppercase"
            render={<Link href={`/restaurant/${restaurant.slug}/menu/food`} />}
          >
            Open the menu
          </Button>
        </div>
      </section>

      <section className="space-y-10 px-5 pt-8">
        <div className="flex items-center justify-between gap-4 text-xs tracking-[0.14em] text-muted-foreground uppercase">
          <span>{restaurant.location}</span>
          <span className="h-px flex-1 bg-primary/20" />
          <span>{restaurant.hours}</span>
        </div>

        <div>
          <SectionTitle eyebrow="The rooms" title="A quiet menu" />
          <div className="stagger-in mt-5 grid grid-cols-2 gap-3">
            {restaurant.categories.map((category) => (
              <Link
                key={category.id}
                href={`/restaurant/${restaurant.slug}/menu/${category.slug}`}
                className="pressable group relative overflow-hidden rounded-[1.35rem] gold-hairline"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="font-heading text-[1.7rem] leading-none text-white">
                      {category.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/70">
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
          <SectionTitle eyebrow="This sitting" title="From the pass" />
          {featured.slice(0, 3).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <LoyaltyCard />
      </section>
    </div>
  );
}
