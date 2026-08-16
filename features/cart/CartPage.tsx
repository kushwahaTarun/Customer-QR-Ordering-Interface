"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dining/PageHeader";
import { QuantityStepper } from "@/components/dining/QuantityStepper";
import { RecommendationCard } from "@/components/RecommendationCard";
import { toast } from "sonner";
import { ButtonLink } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { findMenuItemSync } from "@/services/menuService";
import { formatINR } from "@/utils/currency";
import { describeSelections } from "@/utils/pricing";

export function CartPage() {
  const restaurant = useRestaurant();
  const {
    items,
    updateQuantity,
    removeItem,
    restoreItem,
    subtotal,
    cgst,
    sgst,
    total,
    comboDiscount,
    comboLabel,
    count,
  } = useCart();

  return (
    <div className="animate-rise">
      <PageHeader
        title="Your order"
        subtitle={`${restaurant.name} · table service`}
        backHref={`/restaurant/${restaurant.slug}`}
      />
      <div className="space-y-5 px-4 py-5">
        {count === 0 ? (
          <div className="rounded-[1.6rem] bg-card px-5 py-12 text-center ring-1 ring-foreground/8">
            <p className="font-heading text-3xl">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add food from the menu.
            </p>
            <ButtonLink
              href={`/restaurant/${restaurant.slug}/menu/all`}
              className="mt-6 rounded-full"
            >
              Browse the menu
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((line) => {
                const item = findMenuItemSync(restaurant.slug, line.itemId);
                if (!item) return null;
                const extras = describeSelections(
                  item.customizations,
                  line.selectedOptions,
                );
                return (
                  <article
                    key={line.lineId}
                    className="flex gap-3 rounded-[1.3rem] bg-card p-3 ring-1 ring-foreground/8"
                  >
                    <div className="relative size-[4.5rem] overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-medium">
                            {item.name}{" "}
                            <span className="text-muted-foreground">
                              x{line.quantity}
                            </span>
                          </h2>
                          {extras.length ? (
                            <p className="text-xs text-muted-foreground">
                              {extras.join(" · ")}
                            </p>
                          ) : null}
                          {line.specialInstructions ? (
                            <p className="mt-1 text-xs italic text-muted-foreground">
                              “{line.specialInstructions}”
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const removed = removeItem(line.lineId);
                            if (!removed) return;
                            toast("Removed from your table", {
                              action: {
                                label: "Undo",
                                onClick: () => restoreItem(removed),
                              },
                            });
                          }}
                          className="flex size-11 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <QuantityStepper
                          value={line.quantity}
                          min={0}
                          onChange={(value) =>
                            updateQuantity(line.lineId, value)
                          }
                        />
                        <p className="price">{formatINR(line.unitPrice * line.quantity)}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <RecommendationCard triggerItemIds={items.map((line) => line.itemId)} />

            <div className="rounded-[1.4rem] bg-card p-4 ring-1 ring-foreground/8">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Item total</span>
                <span className="price">{formatINR(subtotal)}</span>
              </div>
              {comboDiscount > 0 ? (
                <div className="mt-2 flex justify-between text-sm text-primary">
                  <span>{comboLabel ?? "Offer"}</span>
                  <span>- {formatINR(comboDiscount)}</span>
                </div>
              ) : null}
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>CGST 2.5%</span>
                <span className="price">{formatINR(cgst)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>SGST 2.5%</span>
                <span className="price">{formatINR(sgst)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-base font-medium">
                <span>To pay</span>
                <span className="price">{formatINR(total)}</span>
              </div>
            </div>

            <ButtonLink
              href={`/restaurant/${restaurant.slug}/checkout`}
              className="gold-fill h-12 w-full rounded-full text-base tracking-[0.12em] uppercase"
            >
              Checkout
            </ButtonLink>
          </>
        )}
      </div>
    </div>
  );
}
