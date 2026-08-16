"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const restaurant = useRestaurant();
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = useI18n();
  const base = `/restaurant/${restaurant.slug}`;

  const items = [
    { href: base, label: t("home"), icon: Home, match: (path: string) => path === base },
    {
      href: `${base}/menu/all`,
      label: t("menu"),
      icon: UtensilsCrossed,
      match: (path: string) => path.includes("/menu/") || path.includes("/item/"),
    },
    {
      href: `${base}/cart`,
      label: t("cart"),
      icon: ShoppingBag,
      match: (path: string) => path.endsWith("/cart") || path.endsWith("/checkout"),
    },
    {
      href: `${base}/loyalty`,
      label: t("rewards"),
      icon: Sparkles,
      match: (path: string) => path.endsWith("/loyalty"),
    },
  ];

  return (
    <nav
      aria-label="Menu"
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
                  "pressable relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-xs transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                {item.label}
                {item.label === t("cart") && count > 0 ? (
                  <span
                    className="absolute top-1.5 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground"
                    aria-label={`${count}`}
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
        {count > 0 ? `${count}` : ""}
      </p>
    </nav>
  );
}
