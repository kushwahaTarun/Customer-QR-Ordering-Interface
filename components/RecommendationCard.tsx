"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { usePrefs } from "@/features/prefs/PrefsProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import {
  getRecommendations,
  itemReason,
  type ResolvedRecommendation,
} from "@/services/recommendationService";
import { findMenuItemSync } from "@/services/menuService";
import { formatINR } from "@/utils/currency";
import { matchesDiet } from "@/utils/diet";
import { defaultSelections } from "@/utils/pricing";

export function RecommendationCard({
  triggerItemIds,
}: {
  triggerItemIds: string[];
}) {
  const restaurant = useRestaurant();
  const { addItem, applyComboDiscount, items } = useCart();
  const { dietFilter } = usePrefs();
  const { t } = useI18n();
  const [data, setData] = useState<ResolvedRecommendation | null>(null);
  const triggerKey = triggerItemIds.join(",");

  useEffect(() => {
    let active = true;
    const ids = triggerKey ? triggerKey.split(",").filter(Boolean) : [];
    void getRecommendations(restaurant.slug, ids, dietFilter).then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, [restaurant.slug, triggerKey, dietFilter]);

  if (!data || data.items.length === 0) return null;

  const addSuggested = (itemId: string) => {
    const item = findMenuItemSync(restaurant.slug, itemId);
    if (!item || !item.available) return;
    addItem({ item, selectedOptions: defaultSelections(item) });
  };

  const addCombo = () => {
    if (!data.set.combo) return;
    for (const itemId of data.set.combo.itemIds) {
      const already = items.some((line) => line.itemId === itemId);
      const item = findMenuItemSync(restaurant.slug, itemId);
      if (!item || already) continue;
      if (!matchesDiet(item.diet, dietFilter)) return;
      addItem({ item, selectedOptions: defaultSelections(item), silent: true });
    }
    applyComboDiscount(data.set.combo.saveAmount, data.set.combo.name);
  };

  return (
    <section className="rounded-[1.5rem] border border-primary/18 bg-card/70 p-5">
      <h2 className="font-heading text-2xl">{t("tonight")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("tonightWhy")}</p>
      <div className="mt-4 grid gap-3">
        {data.items.map((item) => {
          const reason = itemReason(data.set, item.id);
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative size-14 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="price text-sm text-primary">{formatINR(item.price)}</p>
                {reason ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("whyPrefix")}: {reason}
                  </p>
                ) : null}
              </div>
              <Button
                className="h-11 rounded-full"
                onClick={() => addSuggested(item.id)}
              >
                {t("add")}
              </Button>
            </div>
          );
        })}
      </div>
      {data.set.combo &&
      data.set.combo.itemIds.every((id) => {
        const item = findMenuItemSync(restaurant.slug, id);
        if (!item) return false;
        return matchesDiet(item.diet, dietFilter);
      }) ? (
        <div className="mt-4 border-t border-primary/15 pt-4">
          <p className="font-medium">{data.set.combo.name}</p>
          <p className="text-sm text-muted-foreground">
            {t("discount")} {formatINR(data.set.combo.saveAmount)}
          </p>
          <Button className="gold-fill mt-3 rounded-full" onClick={addCombo}>
            {data.set.combo.ctaLabel}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
