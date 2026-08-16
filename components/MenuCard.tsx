"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DietBadge } from "@/components/dining/DietBadge";
import { QuickAddSheet } from "@/components/dining/QuickAddSheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import type { MenuItem } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { itemRequiresCustomization } from "@/utils/pricing";
import { cn } from "@/lib/utils";

export function MenuCard({ item }: { item: MenuItem }) {
  const restaurant = useRestaurant();
  const { addItem } = useCart();
  const { t, lang } = useI18n();
  const category = restaurant.categories.find(
    (entry) => entry.id === item.categoryId,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const href = `/restaurant/${restaurant.slug}/item/${item.id}`;

  const handleAdd = () => {
    if (!item.available) return;
    if (itemRequiresCustomization(item)) {
      setSheetOpen(true);
      return;
    }
    addItem({ item });
  };

  return (
    <>
      <article
        className={cn(
          "overflow-hidden rounded-[1.35rem] bg-card gold-hairline",
          !item.available && "opacity-70",
        )}
      >
        <Link href={href} className="block" aria-label={item.name}>
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {category ? (
                <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur">
                  {lang === "hi" ? category.nameHi : category.name}
                </span>
              ) : null}
              <DietBadge diet={item.diet} className="bg-black/45 backdrop-blur" />
              {!item.available ? (
                <span className="rounded-full bg-black/65 px-2.5 py-1 text-[11px] text-white">
                  {t("unavailable")}
                </span>
              ) : item.popular || item.chefPick ? (
                <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] text-primary-foreground">
                  {t("chefPick")}
                </span>
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-heading text-[1.6rem] leading-[0.95] text-white">
                {item.name}
              </h3>
            </div>
          </div>
        </Link>
        <div className="flex items-end justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            <p className="price mt-3 text-sm text-primary">{formatINR(item.price)}</p>
          </div>
          <Button
            className="h-11 rounded-full px-4"
            disabled={!item.available}
            onClick={handleAdd}
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("add")}
          </Button>
        </div>
      </article>
      <QuickAddSheet item={item} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
