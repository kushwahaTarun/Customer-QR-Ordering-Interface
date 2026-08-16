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
    { href: base, label: "House", icon: Home, match: (path: string) => path === base },
    {
      href: `${base}/menu/food`,
      label: "Menu",
      icon: UtensilsCrossed,
      match: (path: string) => path.includes("/menu/") || path.includes("/item/"),
    },
    {
      href: `${base}/cart`,
      label: "Table",
      icon: ShoppingBag,
      match: (path: string) => path.endsWith("/cart") || path.endsWith("/checkout"),
    },
    {
      href: `${base}/loyalty`,
      label: "House card",
      icon: Sparkles,
      match: (path: string) => path.endsWith("/loyalty"),
    },
  ];

  return (
    <nav
      aria-label="Guest navigation"
      className="glass-panel absolute inset-x-0 bottom-0 z-30 border-t border-primary/15 px-2 pt-1 pb-[max(0.55rem,env(safe-area-inset-bottom))]"
    >
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "pressable relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] tracking-[0.16em] uppercase transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" strokeWidth={1.4} aria-hidden="true" />
                {item.label}
                {active ? (
                  <span className="absolute inset-x-6 bottom-1 h-px bg-primary" />
                ) : null}
                {item.label === "Table" && count > 0 ? (
                  <span
                    className="absolute top-1.5 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
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
