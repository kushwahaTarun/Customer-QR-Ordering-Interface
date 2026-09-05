"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { useSession } from "@/features/session/SessionProvider";
import { createOrder } from "@/services/orderService";
import { findMenuItemSync } from "@/services/menuLookup";
import type { PaymentMethod } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { isIndianMobile } from "@/utils/theme";

export function CheckoutPage() {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { t } = useI18n();
  const { tableNumber } = useSession();
  const { items, subtotal, cgst, sgst, total, comboDiscount, comboLabel } =
    useCart();
  const { guestName, guestMobile, setGuest, account, join } = useLoyalty();
  const [name, setName] = useState(guestName);
  const [mobile, setMobile] = useState(guestMobile);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [joinLoyalty, setJoinLoyalty] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const validate = () => {
    const next: { name?: string; mobile?: string } = {};
    if (joinLoyalty && !isIndianMobile(mobile)) next.mobile = t("mobileRequired");
    if (!joinLoyalty && mobile && !isIndianMobile(mobile)) {
      next.mobile = t("mobileRequired");
    }
    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      if (name.trim()) setGuest(name.trim(), mobile.trim());
      if (joinLoyalty && !account.joined) {
        await join(name.trim() || "Guest", mobile.trim());
      }
      const order = await createOrder({
        restaurantSlug: restaurant.slug,
        tableNumber,
        customerName: name.trim() || "Guest",
        mobile: mobile.trim(),
        items,
        subtotal,
        tax: cgst + sgst,
        discount: comboDiscount,
        total,
        paymentMethod,
        joinLoyalty: joinLoyalty || account.joined,
      });
      if (paymentMethod === "online") {
        router.push(`/restaurant/${restaurant.slug}/payment?orderId=${order.id}`);
      } else {
        router.push(`/restaurant/${restaurant.slug}/order/${order.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("checkout")}
        subtitle={`${t("table")} ${tableNumber}`}
        backHref={`/restaurant/${restaurant.slug}/cart`}
      />
      <div className="space-y-6 px-4 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.6rem] bg-card px-5 py-12 text-center">
            <h2 className="font-heading text-3xl">{t("emptyCart")}</h2>
            <ButtonLink
              href={`/restaurant/${restaurant.slug}/menu/all`}
              className="mt-6 rounded-full"
            >
              {t("browseMenu")}
            </ButtonLink>
          </div>
        ) : (
          <>
            {Object.keys(errors).length > 0 ? (
              <div
                ref={summaryRef}
                role="alert"
                tabIndex={-1}
                className="rounded-[1.2rem] border border-destructive/40 bg-destructive/10 p-4"
              >
                <p className="font-medium">{errors.name || errors.mobile}</p>
              </div>
            ) : null}

            <section className="rounded-[1.4rem] bg-card p-4">
              <ul className="space-y-2 text-sm">
                {items.map((line) => {
                  const item = findMenuItemSync(restaurant.slug, line.itemId, restaurant.menuItems);
                  return (
                    <li key={line.lineId} className="flex justify-between gap-3">
                      <span>
                        {item?.name ?? line.itemId} x{line.quantity}
                      </span>
                      <span className="price">
                        {formatINR(line.unitPrice * line.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t("subtotal")}</span>
                  <span className="price">{formatINR(subtotal)}</span>
                </div>
                {comboDiscount > 0 ? (
                  <div className="flex justify-between text-primary">
                    <span>{comboLabel ?? t("discount")}</span>
                    <span>- {formatINR(comboDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>{t("cgst")}</span>
                  <span className="price">{formatINR(cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("sgst")}</span>
                  <span className="price">{formatINR(sgst)}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-base font-medium">
                <span>{t("total")}</span>
                <span className="price">{formatINR(total)}</span>
              </div>
            </section>

            <section className="space-y-3">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  if (value === "online" || value === "counter") {
                    setPaymentMethod(value);
                  }
                }}
              >
                <label className="flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4">
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value="online" />
                    {t("payUpi")}
                  </span>
                  <span className="text-sm text-muted-foreground">GPay / PhonePe</span>
                </label>
                <label className="flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4">
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value="counter" />
                    {t("payCounter")}
                  </span>
                </label>
              </RadioGroup>
            </section>

            <section className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="guest-name">{t("yourName")}</Label>
                <Input
                  id="guest-name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                {errors.name ? (
                  <p className="text-sm text-destructive">{errors.name}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-mobile">{t("mobile")}</Label>
                <Input
                  id="guest-mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(event) =>
                    setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                />
                <p className="text-sm text-muted-foreground">{t("mobileHint")}</p>
                {errors.mobile ? (
                  <p className="text-sm text-destructive">{errors.mobile}</p>
                ) : null}
              </div>
            </section>

            <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-[1.3rem] bg-secondary/70 p-4">
              <Checkbox
                checked={account.joined || joinLoyalty}
                disabled={account.joined}
                onCheckedChange={(checked) => setJoinLoyalty(Boolean(checked))}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium">{t("joinRewards")}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {t("joinHint")}
                </span>
              </span>
            </label>

            <Button
              className="gold-fill h-12 w-full rounded-full text-base"
              onClick={() => void handleSubmit()}
              disabled={submitting}
            >
              {submitting
                ? "..."
                : paymentMethod === "online"
                  ? t("continuePay")
                  : t("placeOrder")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
