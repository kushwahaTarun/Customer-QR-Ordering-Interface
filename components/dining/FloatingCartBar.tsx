"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { formatINR } from "@/utils/currency";

export function FloatingCartBar() {
  const restaurant = useRestaurant();
  const { count, total, ready } = useCart();
  const pathname = usePathname();
  const hidden =
    !ready ||
    count === 0 ||
    pathname.endsWith("/cart") ||
    pathname.endsWith("/checkout") ||
    pathname.includes("/payment") ||
    pathname.includes("/order/") ||
    pathname.includes("/track/");

  if (hidden) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[5.25rem] z-20 px-4">
      <Link
        href={`/restaurant/${restaurant.slug}/cart`}
        className="pressable pointer-events-auto flex min-h-14 items-center justify-between rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition hover:brightness-105"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.16em] opacity-80">
            {count} {count === 1 ? "item" : "items"}
          </p>
          <p className="price font-medium">{formatINR(total)}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium">
          View cart
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}
