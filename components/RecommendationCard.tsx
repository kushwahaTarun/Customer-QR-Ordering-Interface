"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
    <section className="rounded-[1.5rem] border border-primary/18 bg-card/70 p-5">
      <p className="eyebrow">{data.set.headline}</p>
      <div className="gold-rule mt-3" />
      <p className="serif-italic mt-3 text-lg">{data.set.supportingCopy}</p>
      <div className="mt-4 grid gap-3">
        {data.items.map((item) => (
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
              <p className="font-heading text-xl leading-none">{item.name}</p>
              <p className="price mt-1 text-sm text-primary">{formatINR(item.price)}</p>
            </div>
            <Button
              variant="outline"
              className="h-11 rounded-full border-primary/30"
              onClick={() => addSuggested(item.id)}
            >
              Add
            </Button>
          </div>
        ))}
      </div>
      {data.set.combo ? (
        <div className="mt-5 border-t border-primary/15 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">The pairing</p>
              <p className="font-heading mt-1 text-2xl leading-none">
                {data.set.combo.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save {formatINR(data.set.combo.saveAmount)}
              </p>
            </div>
            <Button className="gold-fill rounded-full" onClick={addCombo}>
              {data.set.combo.ctaLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
