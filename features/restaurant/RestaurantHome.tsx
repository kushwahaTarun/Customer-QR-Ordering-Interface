"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/dining/BrandMark";
import { CuisineGrid } from "@/components/dining/CuisineGrid";
import { DietFilterRow } from "@/components/dining/DietFilterRow";
import { HelpSheet } from "@/components/dining/HelpSheet";
import { LanguageToggle } from "@/components/dining/LanguageToggle";
import { MenuCard } from "@/components/MenuCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { usePrefs } from "@/features/prefs/PrefsProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { useSession } from "@/features/session/SessionProvider";
import { matchesDiet, menuHref } from "@/utils/diet";

export function RestaurantHome() {
  const restaurant = useRestaurant();
  const { tableNumber } = useSession();
  const { t } = useI18n();
  const { dietFilter } = usePrefs();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const popular = restaurant.menuItems.filter((item) => {
    if (!item.available || !(item.popular || item.chefPick)) return false;
    return matchesDiet(item.diet, dietFilter);
  });

  return (
    <div className="animate-rise">
      <section className="relative h-[52vh] min-h-[340px]">
        <Image
          src={restaurant.coverImage}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,8,12,0.45)_0%,transparent_32%,var(--background)_96%)]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <BrandMark size={58} />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <div className="rounded-full border border-primary/30 bg-black/35 px-3 py-2 text-center backdrop-blur">
              <p className="text-[11px] text-primary">{t("table")}</p>
              <p className="font-heading text-xl leading-none text-primary">
                {tableNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
          <p className="eyebrow">{t("welcomeTo")}</p>
          <h1 className="font-heading mt-2 text-5xl leading-[0.88]">
            {restaurant.name}
          </h1>
          <p className="mt-3 max-w-[22rem] text-sm leading-6 text-foreground/88">
            {restaurant.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {restaurant.location} · {restaurant.hours}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink
              href={menuHref(restaurant.slug)}
              className="gold-fill h-12 rounded-full px-6"
            >
              {t("openMenu")}
            </ButtonLink>
            <HelpSheet />
          </div>
        </div>
      </section>

      <section className="space-y-8 px-5 pt-6">
        <div className="space-y-3">
          <h2 className="font-heading text-3xl">{t("chooseFood")}</h2>
          <DietFilterRow />
          <CuisineGrid />
          <Link
            href={menuHref(restaurant.slug)}
            className="inline-flex min-h-11 items-center text-sm text-primary underline-offset-4 hover:underline"
          >
            {t("seeAll")}
          </Link>
        </div>

        {ready ? <RecommendationCard triggerItemIds={[]} /> : null}

        <div className="space-y-4">
          <h2 className="font-heading text-3xl">{t("popular")}</h2>
          {popular.slice(0, 4).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
