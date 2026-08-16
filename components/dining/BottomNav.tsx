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
    <nav
      aria-label="Guest navigation"
      className="glass-panel absolute inset-x-0 bottom-0 z-30 border-t border-border/70 px-2 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <ul className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "pressable relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs tracking-wide transition-colors",
                  active
                    ? "bg-primary/14 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
                {item.label === "Cart" && count > 0 ? (
                  <span
                    className="absolute top-1.5 right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground"
                    aria-label={`${count} items in cart`}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {count > 0 ? `${count} items in your cart` : "Cart is empty"}
      </p>
    </nav>
  );
}
