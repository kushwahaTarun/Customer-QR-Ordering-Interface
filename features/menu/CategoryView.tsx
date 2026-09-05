"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { DietFilterRow } from "@/components/dining/DietFilterRow";
import { FilterChip } from "@/components/dining/FilterChip";
import { LanguageToggle } from "@/components/dining/LanguageToggle";
import { PageHeader } from "@/components/dining/PageHeader";
import { MenuCard } from "@/components/MenuCard";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { usePrefs } from "@/features/prefs/PrefsProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { matchesDiet, menuHref } from "@/utils/diet";

export function CategoryView({ categorySlug }: { categorySlug: string }) {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { t, lang } = useI18n();
  const { dietFilter } = usePrefs();
  const [query, setQuery] = useState("");
  const selected = categorySlug === "food" ? "all" : categorySlug;

  const selectCategory = (next: string) => {
    router.replace(menuHref(restaurant.slug, next), { scroll: false });
  };

  const items = useMemo(() => {
    return restaurant.menuItems.filter((item) => {
      if (
        selected !== "all" &&
        item.categoryId !== selected &&
        restaurant.categories.find((entry) => entry.id === item.categoryId)
          ?.slug !== selected
      ) {
        return false;
      }
      if (!matchesDiet(item.diet, dietFilter)) return false;
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      const category = restaurant.categories.find(
        (entry) => entry.id === item.categoryId,
      );
      return (
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.ingredients.some((entry) => entry.toLowerCase().includes(needle)) ||
        Boolean(category?.name.toLowerCase().includes(needle)) ||
        Boolean(category?.nameHi.toLowerCase().includes(needle))
      );
    });
  }, [restaurant.categories, restaurant.menuItems, selected, dietFilter, query]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const item of restaurant.menuItems) {
      if (!matchesDiet(item.diet, dietFilter)) continue;
      if (query.trim()) {
        const needle = query.trim().toLowerCase();
        const hit =
          item.name.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle);
        if (!hit) continue;
      }
      counts.all += 1;
      counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [restaurant.menuItems, dietFilter, query]);

  const activeName =
    selected === "all"
      ? t("allFood")
      : restaurant.categories.find((entry) => entry.slug === selected)?.[
          lang === "hi" ? "nameHi" : "name"
        ];

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("menu")}
        subtitle={restaurant.name}
        backHref={`/restaurant/${restaurant.slug}`}
      />
      <div className="absolute top-3 right-4 z-30">
        <LanguageToggle />
      </div>
      <div className="glass-panel sticky top-[4.35rem] z-10 border-b border-primary/12 px-4 py-3">
        <p className="sr-only">{t("dietLabel")}</p>
        <DietFilterRow />
        <div
          className="mt-3 flex flex-wrap gap-2"
          role="group"
          aria-label={t("cuisineLabel")}
        >
          <FilterChip
            active={selected === "all"}
            onClick={() => selectCategory("all")}
            count={categoryCounts.all}
          >
            {t("allFood")}
          </FilterChip>
          {restaurant.categories.map((entry) => (
            <FilterChip
              key={entry.id}
              active={entry.slug === selected}
              onClick={() => selectCategory(entry.slug)}
              count={categoryCounts[entry.id] ?? categoryCounts[entry.slug] ?? 0}
            >
              {lang === "hi" ? entry.nameHi : entry.name}
            </FilterChip>
          ))}
        </div>
        <label className="relative mt-3 block">
          <span className="sr-only">{t("searchMenu")}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchMenu")}
            className="h-11 rounded-full bg-card/70 pl-10"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          {activeName ? `${activeName} · ` : null}
          {t("showing", { count: String(items.length) })}
        </p>
      </div>
      <div className="space-y-4 px-4 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.4rem] bg-card px-5 py-10 text-center">
            <p className="font-heading text-2xl">{t("noMatch")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("noMatchHint")}</p>
          </div>
        ) : (
          items.map((item) => <MenuCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
