"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/features/cart/CartProvider";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { useSession } from "@/features/session/SessionProvider";
import { createOrder } from "@/services/orderService";
import { findMenuItemSync } from "@/services/menuService";
import type { PaymentMethod } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { isIndianMobile } from "@/utils/theme";

interface FieldErrors {
  name?: string;
  mobile?: string;
  cart?: string;
}

export function CheckoutPage() {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { tableNumber } = useSession();
  const { items, subtotal, tax, total, comboDiscount, clearCart } = useCart();
  const { guestName, guestMobile, setGuest, account, join } = useLoyalty();
  const [name, setName] = useState(guestName);
  const [mobile, setMobile] = useState(guestMobile);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [joinLoyalty, setJoinLoyalty] = useState(!account.joined);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, mobile: false });
  const summaryRef = useRef<HTMLDivElement>(null);

  const validate = (nextName = name, nextMobile = mobile): FieldErrors => {
    const next: FieldErrors = {};
    if (!nextName.trim()) next.name = "Enter the name for this table.";
    if (!isIndianMobile(nextMobile)) {
      next.mobile = "Enter a 10-digit Indian mobile number starting with 6–9.";
    }
    if (items.length === 0) next.cart = "Add at least one plate before checkout.";
    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setTouched({ name: true, mobile: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }

    setSubmitting(true);
    try {
      setGuest(name.trim(), mobile.trim());
      if (joinLoyalty && !account.joined) {
        await join(name.trim(), mobile.trim());
      }
      const order = await createOrder({
        restaurantSlug: restaurant.slug,
        tableNumber,
        customerName: name.trim(),
        mobile: mobile.trim(),
        items,
        subtotal,
        tax,
        discount: comboDiscount,
        total,
        paymentMethod,
        joinLoyalty: joinLoyalty || account.joined,
      });
      clearCart();
      if (paymentMethod === "online") {
        router.push(`/restaurant/${restaurant.slug}/payment?orderId=${order.id}`);
      } else {
        router.push(`/restaurant/${restaurant.slug}/order/${order.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const errorList = Object.entries(errors);

  return (
    <div className="animate-rise">
      <PageHeader
        title="Checkout"
        subtitle={`Table ${tableNumber}`}
        backHref={`/restaurant/${restaurant.slug}/cart`}
      />
      <div className="space-y-6 px-4 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.6rem] bg-card px-5 py-12 text-center ring-1 ring-foreground/8">
            <h2 className="font-heading text-3xl">Nothing to settle</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a plate from the menu, then return to checkout.
            </p>
            <Button
              className="mt-6 rounded-full"
              render={<Link href={`/restaurant/${restaurant.slug}/menu/food`} />}
            >
              Browse the menu
            </Button>
          </div>
        ) : (
          <>
            {errorList.length > 0 ? (
              <div
                ref={summaryRef}
                role="alert"
                tabIndex={-1}
                aria-labelledby="checkout-error-title"
                className="rounded-[1.2rem] border border-destructive/40 bg-destructive/10 p-4"
              >
                <h2 id="checkout-error-title" className="font-medium">
                  There is a problem
                </h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {errors.name ? (
                    <li>
                      <a href="#guest-name" className="underline">
                        {errors.name}
                      </a>
                    </li>
                  ) : null}
                  {errors.mobile ? (
                    <li>
                      <a href="#guest-mobile" className="underline">
                        {errors.mobile}
                      </a>
                    </li>
                  ) : null}
                  {errors.cart ? <li>{errors.cart}</li> : null}
                </ul>
              </div>
            ) : null}

            <section className="rounded-[1.4rem] bg-card p-4 ring-1 ring-foreground/8">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Order summary
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {items.map((line) => {
                  const item = findMenuItemSync(restaurant.slug, line.itemId);
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
              <div className="mt-4 flex justify-between text-base font-medium">
                <span>Total</span>
                <span className="price">{formatINR(total)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Includes taxes {formatINR(tax)}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-2xl">Payment options</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  if (value === "online" || value === "counter") {
                    setPaymentMethod(value);
                  }
                }}
              >
                <label className="flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value="online" />
                    Pay Online
                  </span>
                  <span className="text-sm text-muted-foreground">UPI / card</span>
                </label>
                <label className="flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value="counter" />
                    Pay at Counter
                  </span>
                  <span className="text-sm text-muted-foreground">Cash or card</span>
                </label>
              </RadioGroup>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-2xl">Customer information</h2>
              <div className="space-y-2">
                <Label htmlFor="guest-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guest-name"
                  autoComplete="name"
                  value={name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "guest-name-error" : undefined}
                  onBlur={() => {
                    setTouched((current) => ({ ...current, name: true }));
                    setErrors(validate());
                  }}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (touched.name) setErrors(validate(event.target.value, mobile));
                  }}
                  placeholder="Rahul"
                />
                {errors.name ? (
                  <p id="guest-name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-mobile">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guest-mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={mobile}
                  aria-invalid={Boolean(errors.mobile)}
                  aria-describedby={
                    errors.mobile ? "guest-mobile-error" : "guest-mobile-hint"
                  }
                  onBlur={() => {
                    setTouched((current) => ({ ...current, mobile: true }));
                    setErrors(validate());
                  }}
                  onChange={(event) => {
                    const next = event.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(next);
                    if (touched.mobile) setErrors(validate(name, next));
                  }}
                  placeholder="9876543210"
                />
                <p id="guest-mobile-hint" className="text-sm text-muted-foreground">
                  Used only to identify {restaurant.loyaltyProgramName}. No OTP.
                </p>
                {errors.mobile ? (
                  <p id="guest-mobile-error" className="text-sm text-destructive">
                    {errors.mobile}
                  </p>
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
                <span className="block font-medium">
                  Join {restaurant.loyaltyProgramName}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {restaurant.loyaltyTagline}
                </span>
              </span>
            </label>

            <Button
              className="gold-fill h-12 w-full rounded-full text-base tracking-[0.12em] uppercase"
              onClick={() => void handleSubmit()}
              disabled={submitting}
            >
              {submitting
                ? "Placing order…"
                : paymentMethod === "online"
                  ? "Continue to payment"
                  : "Place order"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
