"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <div className="pointer-events-none absolute inset-x-0 bottom-[5.15rem] z-20 px-4">
      <Link
        href={`/restaurant/${restaurant.slug}/cart`}
        className="gold-fill pressable pointer-events-auto flex min-h-14 items-center justify-between rounded-full px-5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">
            {count} {count === 1 ? "plate" : "plates"}
          </p>
          <p className="price font-medium">{formatINR(total)}</p>
        </div>
        <span className="text-sm tracking-[0.14em] uppercase">Review table</span>
      </Link>
    </div>
  );
}
