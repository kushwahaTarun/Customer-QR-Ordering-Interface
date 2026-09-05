"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { getOrder, updatePaymentStatus } from "@/services/orderService";
import type { Order, PaymentStatus } from "@/types/dining";
import { formatINR } from "@/utils/currency";

export function PaymentPage({ orderId }: { orderId: string }) {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { t } = useI18n();
  const { clearCart } = useCart();
  const { creditOrder } = useLoyalty();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [app, setApp] = useState<"gpay" | "phonepe" | "paytm">("gpay");

  useEffect(() => {
    void getOrder(orderId).then((result) => {
      setOrder(result);
      if (result) setStatus(result.paymentStatus);
    });
  }, [orderId]);

  const runPayment = async (outcome: "success" | "failed") => {
    setStatus("processing");
    await updatePaymentStatus(orderId, "processing");
    await new Promise((resolve) => window.setTimeout(resolve, 1400));
    const next = await updatePaymentStatus(orderId, outcome);
    setOrder(next);
    setStatus(outcome);
    if (outcome === "success" && next) {
      clearCart();
      if (next.joinLoyalty) await creditOrder(next.total);
      window.setTimeout(() => {
        router.push(`/restaurant/${restaurant.slug}/order/${next.id}`);
      }, 700);
    }
  };

  const title =
    status === "success"
      ? t("paid")
      : status === "failed"
        ? t("payFailed")
        : status === "processing"
          ? t("paying")
          : t("payUpi");

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("payUpi")}
        subtitle={restaurant.name}
        backHref={`/restaurant/${restaurant.slug}/checkout`}
      />
      <div className="px-5 py-8">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary">
          {status === "processing" ? (
            <Loader2 className="size-8 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="size-8" />
          ) : status === "failed" ? (
            <TriangleAlert className="size-8" />
          ) : (
            <span className="font-heading text-2xl">₹</span>
          )}
        </div>
        <h2 className="text-center font-heading text-4xl">{title}</h2>
        {order ? (
          <p className="mt-2 text-center text-muted-foreground">
            {formatINR(order.total)} · {t("table")} {order.tableNumber}
          </p>
        ) : null}

        {status === "pending" ? (
          <div className="mt-8 space-y-2">
            {(
              [
                ["gpay", "Google Pay"],
                ["phonepe", "PhonePe"],
                ["paytm", "Paytm"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setApp(id)}
                className={`flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 text-left ${
                  app === id ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                {label}
                {app === id ? <span className="text-sm text-primary">✓</span> : null}
              </button>
            ))}
            <Button
              className="gold-fill mt-4 h-12 w-full rounded-full"
              onClick={() => void runPayment("success")}
            >
              {t("payAmount")} {order ? formatINR(order.total) : ""}
            </Button>
            <ButtonLink
              href={`/restaurant/${restaurant.slug}/checkout`}
              variant="ghost"
              className="w-full rounded-full"
            >
              {t("cancelPay")}
            </ButtonLink>
          </div>
        ) : null}

        {status === "failed" ? (
          <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2">
            <Button
              className="gold-fill h-12 rounded-full"
              onClick={() => void runPayment("success")}
            >
              {t("tryAgain")}
            </Button>
            {order ? (
              <ButtonLink
                href={`/restaurant/${restaurant.slug}/order/${order.id}`}
                variant="outline"
                className="h-11 rounded-full"
              >
                {t("payCounterInstead")}
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
