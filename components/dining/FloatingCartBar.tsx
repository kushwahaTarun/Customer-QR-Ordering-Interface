"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { formatINR } from "@/utils/currency";

export function FloatingCartBar() {
  const restaurant = useRestaurant();
  const { count, total, ready } = useCart();
  const { t } = useI18n();
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
          <p className="text-xs">
            {count} {t("cart")}
          </p>
          <p className="price font-medium">{formatINR(total)}</p>
        </div>
        <span className="text-sm font-medium">{t("viewCart")}</span>
      </Link>
    </div>
  );
}
