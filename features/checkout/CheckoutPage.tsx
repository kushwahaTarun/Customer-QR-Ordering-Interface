"use client";

import { useState } from "react";
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
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) {
      setError("Please share a name for the table.");
      return;
    }
    if (!isIndianMobile(mobile)) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
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
        router.push(
          `/restaurant/${restaurant.slug}/payment?orderId=${order.id}`,
        );
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
        title="Checkout"
        subtitle={`Table ${tableNumber}`}
        backHref={`/restaurant/${restaurant.slug}/cart`}
      />
      <div className="space-y-6 px-4 py-5">
        <section className="rounded-[1.4rem] bg-card p-4 ring-1 ring-foreground/8">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
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
                  <span>{formatINR(line.unitPrice * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between text-base font-medium">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
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
            <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
              <span className="flex items-center gap-3">
                <RadioGroupItem value="online" />
                Pay Online
              </span>
              <span className="text-xs text-muted-foreground">UPI / card</span>
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
              <span className="flex items-center gap-3">
                <RadioGroupItem value="counter" />
                Pay at Counter
              </span>
              <span className="text-xs text-muted-foreground">Cash or card</span>
            </label>
          </RadioGroup>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl">Customer information</h2>
          <div className="space-y-2">
            <Label htmlFor="guest-name">Name</Label>
            <Input
              id="guest-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Rahul"
              className="h-11 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-mobile">Mobile Number</Label>
            <Input
              id="guest-mobile"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(event) =>
                setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              className="h-11 rounded-2xl"
            />
            <p className="text-xs text-muted-foreground">
              Used only to identify {restaurant.loyaltyProgramName}. No OTP.
            </p>
          </div>
        </section>

        <label className="flex items-start gap-3 rounded-[1.3rem] bg-secondary/70 p-4">
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

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          className="h-12 w-full rounded-full text-base"
          onClick={() => void handleSubmit()}
          disabled={submitting || items.length === 0}
        >
          {submitting
            ? "Placing order…"
            : paymentMethod === "online"
              ? "Continue to payment"
              : "Place order"}
        </Button>
      </div>
    </div>
  );
}
