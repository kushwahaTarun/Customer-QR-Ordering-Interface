"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const restaurant = useRestaurant();
  const pathname = usePathname();
  const { count } = useCart();
  const base = `/restaurant/${restaurant.slug}`;

  const items = [
    { href: base, label: "Home", icon: Home, match: (path: string) => path === base },
    {
      href: `${base}/menu/food`,
      label: "Menu",
      icon: UtensilsCrossed,
      match: (path: string) => path.includes("/menu/") || path.includes("/item/"),
    },
    {
      href: `${base}/cart`,
      label: "Cart",
      icon: ShoppingBag,
      match: (path: string) => path.endsWith("/cart") || path.endsWith("/checkout"),
    },
    {
      href: `${base}/loyalty`,
      label: "Rewards",
      icon: Sparkles,
      match: (path: string) => path.endsWith("/loyalty"),
    },
  ];

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/88 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] tracking-wide transition-colors",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4.5" />
                {item.label}
                {item.label === "Cart" && count > 0 ? (
                  <span className="absolute top-1 right-4 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
