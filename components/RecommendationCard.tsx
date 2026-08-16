"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import {
  getRecommendations,
  type ResolvedRecommendation,
} from "@/services/recommendationService";
import { findMenuItemSync } from "@/services/menuService";
import { formatINR } from "@/utils/currency";
import { defaultSelections } from "@/utils/pricing";

export function RecommendationCard({
  triggerItemIds,
}: {
  triggerItemIds: string[];
}) {
  const restaurant = useRestaurant();
  const { addItem, applyComboDiscount, items } = useCart();
  const [data, setData] = useState<ResolvedRecommendation | null>(null);
  const triggerKey = triggerItemIds.join(",");

  useEffect(() => {
    let active = true;
    const ids = triggerKey ? triggerKey.split(",") : [];
    void getRecommendations(restaurant.slug, ids).then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, [restaurant.slug, triggerKey]);

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
      addItem({ item, selectedOptions: defaultSelections(item), silent: true });
    }
    applyComboDiscount(data.set.combo.saveAmount, data.set.combo.name);
  };

  return (
    <section className="overflow-hidden rounded-[1.6rem] bg-secondary/80 p-4 ring-1 ring-primary/20">
      <div className="mb-4 flex items-center gap-2 text-primary">
        <Sparkles className="size-4" />
        <p className="text-[11px] uppercase tracking-[0.22em]">
          {data.set.headline}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{data.set.supportingCopy}</p>
      <div className="mt-4 grid gap-3">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-card/80 p-2.5"
          >
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
              <p className="truncate font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{formatINR(item.price)}</p>
            </div>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => addSuggested(item.id)}
            >
              Add {item.name.split(" ")[0]}
            </Button>
          </div>
        ))}
      </div>
      {data.set.combo ? (
        <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                Combo Offer
              </p>
              <p className="mt-1 font-heading text-xl">{data.set.combo.name}</p>
              <p className="text-sm text-muted-foreground">
                Save {formatINR(data.set.combo.saveAmount)}
              </p>
            </div>
            <Button className="rounded-full" onClick={addCombo}>
              {data.set.combo.ctaLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
