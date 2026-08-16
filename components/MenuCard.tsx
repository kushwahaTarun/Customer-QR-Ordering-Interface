"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DietBadge } from "@/components/dining/DietBadge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import type { MenuItem } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { itemRequiresCustomization } from "@/utils/pricing";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
        "group overflow-hidden rounded-[1.4rem] bg-card ring-1 ring-foreground/8 transition duration-300",
        !item.available && "opacity-70",
        layout === "editorial" && "shadow-[0_18px_40px_rgba(0,0,0,0.12)]",
      )}
    >
      <Link href={href} className="block">
        <div
          className={cn(
            "relative overflow-hidden",
            layout === "editorial" ? "aspect-[16/10]" : "aspect-[5/4]",
          )}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <DietBadge diet={item.diet} className="bg-black/35 text-white backdrop-blur" />
            {!item.available ? (
              <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                Unavailable
              </span>
            ) : item.chefPick ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-primary-foreground">
                Chef&apos;s pick
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="flex items-end justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <Link href={href}>
            <h3 className="font-heading text-[1.35rem] leading-tight">{item.name}</h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <p className="mt-3 text-base font-medium">{formatINR(item.price)}</p>
        </div>
        <Button
          className="h-10 rounded-full px-4"
          disabled={!item.available}
          onClick={handleAdd}
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </article>
  );
}
