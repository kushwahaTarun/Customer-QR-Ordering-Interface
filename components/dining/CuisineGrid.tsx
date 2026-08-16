"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { usePrefs } from "@/features/prefs/PrefsProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { matchesDiet, menuHref } from "@/utils/diet";

export function CuisineGrid() {
  const restaurant = useRestaurant();
  const { dietFilter } = usePrefs();
  const { t, lang } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-3">
      {restaurant.categories.map((category, index) => {
        const count = restaurant.menuItems.filter(
          (item) =>
            item.categoryId === category.id &&
            item.available &&
            matchesDiet(item.diet, dietFilter),
        ).length;
        const name = lang === "hi" ? category.nameHi : category.name;

        return (
          <Link
            key={category.id}
            href={menuHref(restaurant.slug, category.slug)}
            className="pressable group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-[1.25rem] gold-hairline"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-heading text-[1.35rem] leading-none text-white">
                {name}
              </p>
              <p className="mt-1 text-xs text-white/80">
                {t("dishes", { count: String(count) })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
