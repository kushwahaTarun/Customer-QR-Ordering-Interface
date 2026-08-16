"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import { PageHeader } from "@/components/dining/PageHeader";
import { Input } from "@/components/ui/input";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function CategoryView({ categorySlug }: { categorySlug: string }) {
  const restaurant = useRestaurant();
  const [query, setQuery] = useState("");
  const category =
    restaurant.categories.find((entry) => entry.slug === categorySlug) ??
    restaurant.categories[0];
  const items = useMemo(() => {
    const list = restaurant.menuItems.filter(
      (item) => item.categoryId === category.id,
    );
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle),
    );
  }, [restaurant.menuItems, category.id, query]);

  return (
    <div className="animate-rise">
      <PageHeader
        title={category.name}
        subtitle={category.description}
        backHref={`/restaurant/${restaurant.slug}`}
      />
      <div className="glass-panel sticky top-[4.35rem] z-10 border-b border-primary/12 px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {restaurant.categories.map((entry) => {
            const active = entry.slug === category.slug;
            return (
              <Link
                key={entry.id}
                href={`/restaurant/${restaurant.slug}/menu/${entry.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 text-sm whitespace-nowrap transition",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary/15 bg-transparent text-foreground",
                )}
              >
                {entry.name}
              </Link>
            );
          })}
        </div>
        <label className="relative block">
          <span className="sr-only">Search {category.name}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${category.name.toLowerCase()}`}
            className="h-11 rounded-full bg-card/70 pl-10"
          />
        </label>
      </div>
      <div className="stagger-in space-y-4 px-4 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.4rem] bg-card px-5 py-10 text-center ring-1 ring-foreground/8">
            <p className="font-heading text-2xl">Nothing matches that search</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another word, or browse a different room of the menu.
            </p>
          </div>
        ) : (
          items.map((item) => <MenuCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
