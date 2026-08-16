"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DietBadge } from "@/components/dining/DietBadge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import type { MenuItem } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { itemRequiresCustomization } from "@/utils/pricing";
import { cn } from "@/lib/utils";

export function MenuCard({
  item,
  layout = "editorial",
}: {
  item: MenuItem;
  layout?: "editorial" | "compact";
}) {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { addItem } = useCart();
  const href = `/restaurant/${restaurant.slug}/item/${item.id}`;

  const handleAdd = () => {
    if (!item.available) return;
    if (itemRequiresCustomization(item)) {
      router.push(href);
      return;
    }
    addItem({ item });
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.35rem] bg-card gold-hairline",
        !item.available && "opacity-70",
      )}
    >
      <Link href={href} className="block" aria-label={`View ${item.name}`}>
        <div
          className={cn(
            "relative overflow-hidden",
            layout === "editorial" ? "aspect-[5/4]" : "aspect-[5/4]",
          )}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <DietBadge diet={item.diet} className="bg-black/40 backdrop-blur" />
            {!item.available ? (
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                This evening, spoken for
              </span>
            ) : item.chefPick ? (
              <span className="rounded-full border border-primary/50 bg-black/35 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-primary backdrop-blur">
                House signature
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-heading text-[1.7rem] leading-[0.95] text-white">
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
          <p className="price mt-3 text-sm tracking-[0.04em] text-primary">
            {formatINR(item.price)}
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-full border-primary/35 px-4"
          disabled={!item.available}
          onClick={handleAdd}
        >
          <Plus className="size-4" aria-hidden="true" />
          {itemRequiresCustomization(item) ? "Compose" : "Add"}
        </Button>
      </div>
    </article>
  );
}
