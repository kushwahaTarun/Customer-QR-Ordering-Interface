"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderStatus } from "@/components/OrderStatus";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { getOrder, refreshKitchenStatus } from "@/services/orderService";
import { findMenuItemSync } from "@/services/menuService";
import type { Order } from "@/types/dining";
import { formatINR } from "@/utils/currency";

export function OrderConfirmation({ orderId }: { orderId: string }) {
  const restaurant = useRestaurant();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      const next =
        (await refreshKitchenStatus(orderId)) ?? (await getOrder(orderId));
      setOrder(next);
    };
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 2500);
    return () => window.clearInterval(timer);
  }, [orderId]);

  if (!order) {
    return (
      <div className="px-5 py-16 text-center text-sm text-muted-foreground">
        Finding your order…
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <PageHeader title="Confirmed" subtitle={restaurant.name} />
      <div className="space-y-6 px-5 py-6">
        <section className="text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Thank you
          </p>
          <h2 className="font-heading mt-2 text-4xl">Order #{order.orderNumber}</h2>
          <p className="mt-2 text-muted-foreground">Table {order.tableNumber}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.paymentMethod === "online"
              ? order.paymentStatus === "success"
                ? "Paid online"
                : "Online payment pending"
              : "Pay at the counter"}
            {" · "}
            {formatINR(order.total)}
          </p>
        </section>

        <section className="rounded-[1.5rem] bg-card p-5 ring-1 ring-foreground/8">
          <OrderStatus status={order.status} />
          <p className="mt-5 text-sm text-muted-foreground">
            Estimated preparation time: {restaurant.estimatedPrepMinutes} minutes
          </p>
        </section>

        <section>
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            This sitting
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {order.items.map((line) => {
              const item = findMenuItemSync(restaurant.slug, line.itemId);
              return (
                <li key={line.lineId}>
                  {item?.name ?? line.itemId} x{line.quantity}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid gap-2">
          <Button
            className="h-12 rounded-full"
            render={
              <Link href={`/restaurant/${restaurant.slug}/track/${order.id}`} />
            }
          >
            Track order
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full"
            render={<Link href={`/restaurant/${restaurant.slug}/loyalty`} />}
          >
            View {restaurant.loyaltyProgramName}
          </Button>
        </div>
      </div>
    </div>
  );
}
