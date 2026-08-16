"use client";

import Link from "next/link";
import { MenuCard } from "@/components/MenuCard";
import { PageHeader } from "@/components/dining/PageHeader";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function CategoryView({ categorySlug }: { categorySlug: string }) {
  const restaurant = useRestaurant();
  const category =
    restaurant.categories.find((entry) => entry.slug === categorySlug) ??
    restaurant.categories[0];
  const items = restaurant.menuItems.filter(
    (item) => item.categoryId === category.id,
  );

  return (
    <div className="animate-rise">
      <PageHeader
        title={category.name}
        subtitle={category.description}
        backHref={`/restaurant/${restaurant.slug}`}
      />
      <div className="sticky top-[3.6rem] z-10 border-b border-border/50 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {restaurant.categories.map((entry) => {
            const active = entry.slug === category.slug;
            return (
              <Link
                key={entry.id}
                href={`/restaurant/${restaurant.slug}/menu/${entry.slug}`}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {entry.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="space-y-4 px-4 py-5">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
