"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { OrderStatus } from "@/components/OrderStatus";
import { PageHeader } from "@/components/dining/PageHeader";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { getOrder, refreshKitchenStatus } from "@/services/orderService";
import { findMenuItemSync } from "@/services/menuLookup";
import type { Order } from "@/types/dining";

export function OrderTracking({ orderId }: { orderId: string }) {
  const restaurant = useRestaurant();
  const { t } = useI18n();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      const next = (await refreshKitchenStatus(orderId)) ?? (await getOrder(orderId));
      setOrder(next);
    };
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 2000);
    return () => window.clearInterval(timer);
  }, [orderId]);

  if (!order) {
    return (
      <div className="px-5 py-16 text-center text-sm text-muted-foreground">
        Connecting to the kitchen…
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("trackOrder")}
        subtitle={`Order #${order.orderNumber}`}
        backHref={`/restaurant/${restaurant.slug}/order/${order.id}`}
      />
      <div className="space-y-6 px-5 py-6">
        <section className="rounded-[1.6rem] bg-primary/10 p-5 ring-1 ring-primary/20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Current status
          </p>
          <h2 className="font-heading mt-2 text-4xl">
            {order.status === "received"
              ? t("statusReceived")
              : order.status === "preparing"
                ? t("statusPreparing")
                : order.status === "cooking"
                  ? t("statusCooking")
                  : t("statusReady")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("kitchenWait")}</p>
        </section>

        <section>
          <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Your order
          </h3>
          <div className="space-y-2">
            {order.items.map((line) => {
              const item = findMenuItemSync(restaurant.slug, line.itemId, restaurant.menuItems);
              if (!item) return null;
              return (
                <div
                  key={line.lineId}
                  className="flex items-center gap-3 rounded-2xl bg-card p-2.5 ring-1 ring-foreground/8"
                >
                  <div className="relative size-12 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{line.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.5rem] bg-card p-5 ring-1 ring-foreground/8">
          <OrderStatus status={order.status} />
        </section>
      </div>
    </div>
  );
}
