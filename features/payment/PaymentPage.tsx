"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, TriangleAlert, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { getOrder, updatePaymentStatus } from "@/services/orderService";
import type { Order, PaymentStatus } from "@/types/dining";
import { formatINR } from "@/utils/currency";

const copy: Record<
  PaymentStatus,
  { title: string; body: string }
> = {
  pending: {
    title: "Payment pending",
    body: "Confirm to charge this table’s bill.",
  },
  processing: {
    title: "Processing",
    body: "Securely connecting with the payment rail.",
  },
  success: {
    title: "Payment Successful",
    body: "Order confirmed",
  },
  failed: {
    title: "Payment failed",
    body: "The charge did not complete. You may try again or pay at the counter.",
  },
};

export function PaymentPage({ orderId }: { orderId: string }) {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { creditOrder } = useLoyalty();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    void getOrder(orderId).then((result) => {
      setOrder(result);
      if (result) setStatus(result.paymentStatus);
    });
  }, [orderId]);

  const runPayment = async (outcome: "success" | "failed") => {
    setStatus("processing");
    setProgress(38);
    await updatePaymentStatus(orderId, "processing");
    const tick = window.setInterval(() => {
      setProgress((value) => Math.min(value + 14, 92));
    }, 280);
    await new Promise((resolve) => window.setTimeout(resolve, 1600));
    window.clearInterval(tick);
    const next = await updatePaymentStatus(orderId, outcome);
    setOrder(next);
    setStatus(outcome);
    setProgress(outcome === "success" ? 100 : 20);
    if (outcome === "success" && next) {
      if (next.joinLoyalty) {
        await creditOrder(next.total);
      }
      window.setTimeout(() => {
        router.push(`/restaurant/${restaurant.slug}/order/${next.id}`);
      }, 900);
    }
  };

  const Icon =
    status === "success"
      ? CheckCircle2
      : status === "failed"
        ? TriangleAlert
        : status === "processing"
          ? Loader2
          : Clock3;

  return (
    <div className="animate-rise">
      <PageHeader
        title="Payment"
        subtitle={restaurant.name}
        backHref={`/restaurant/${restaurant.slug}/checkout`}
      />
      <div className="px-5 py-10 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Icon
            className={status === "processing" ? "size-10 animate-spin" : "size-10"}
          />
        </div>
        <h2 className="font-heading mt-6 text-4xl">{copy[status].title}</h2>
        <p className="mt-2 text-muted-foreground">{copy[status].body}</p>
        {order ? (
          <p className="mt-4 text-sm">
            Amount {formatINR(order.total)} · Table {order.tableNumber}
          </p>
        ) : null}
        {status === "success" && order ? (
          <p className="mt-6 font-heading text-3xl">
            Order Number: #{order.orderNumber}
          </p>
        ) : null}
        {(status === "pending" || status === "processing") && (
          <Progress value={progress} className="mx-auto mt-8 max-w-xs" />
        )}
        <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2">
          {status === "pending" ? (
            <>
              <Button className="h-12 rounded-full" onClick={() => void runPayment("success")}>
                Pay now
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => void runPayment("failed")}
              >
                Simulate failed payment
              </Button>
            </>
          ) : null}
          {status === "failed" ? (
            <>
              <Button className="h-12 rounded-full" onClick={() => void runPayment("success")}>
                Try again
              </Button>
              {order ? (
                <Button
                  variant="outline"
                  className="h-11 rounded-full"
                  render={
                    <Link href={`/restaurant/${restaurant.slug}/order/${order.id}`} />
                  }
                >
                  Pay at counter instead
                </Button>
              ) : null}
            </>
          ) : null}
          {status === "success" && order ? (
            <Button
              className="h-12 rounded-full"
              render={
                <Link href={`/restaurant/${restaurant.slug}/order/${order.id}`} />
              }
            >
              View confirmation
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
