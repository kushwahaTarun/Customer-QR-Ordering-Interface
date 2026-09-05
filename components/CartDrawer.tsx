"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/dining/QuantityStepper";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { findMenuItemSync } from "@/services/menuLookup";
import { formatINR } from "@/utils/currency";
import { describeSelections } from "@/utils/pricing";

export function CartDrawer() {
  const restaurant = useRestaurant();
  const {
    items,
    drawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    tax,
    total,
    comboDiscount,
    comboLabel,
    count,
  } = useCart();

  return (
    <Drawer open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerContent className="mx-auto w-full max-w-md bg-popover">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-heading text-3xl">Your table</DrawerTitle>
          <DrawerDescription>
            {count === 0
              ? "Nothing selected yet."
              : `${count} ${count === 1 ? "item" : "items"} waiting for the kitchen.`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[46vh] space-y-3 overflow-y-auto px-4">
          {items.map((line) => {
            const item = findMenuItemSync(restaurant.slug, line.itemId, restaurant.menuItems);
            if (!item) return null;
            const extras = describeSelections(
              item.customizations,
              line.selectedOptions,
            );
            return (
              <div
                key={line.lineId}
                className="flex gap-3 rounded-2xl bg-card p-2.5 ring-1 ring-foreground/8"
              >
                <div className="relative size-16 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="truncate font-medium">{item.name}</p>
                      {extras.length ? (
                        <p className="text-xs text-muted-foreground">
                          {extras.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-muted-foreground"
                      onClick={() => removeItem(line.lineId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper
                      value={line.quantity}
                      min={0}
                      onChange={(value) => updateQuantity(line.lineId, value)}
                    />
                    <p className="text-sm">
                      {formatINR(line.unitPrice * line.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {count > 0 ? (
          <div className="space-y-1 px-4 pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {comboDiscount > 0 ? (
              <div className="flex justify-between text-primary">
                <span>{comboLabel ?? "Combo offer"}</span>
                <span>- {formatINR(comboDiscount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-muted-foreground">
              <span>Taxes</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-medium">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        ) : null}
        <DrawerFooter>
          {count === 0 ? (
            <Button className="h-12 rounded-full" disabled>
              Review cart
            </Button>
          ) : (
            <ButtonLink
              href={`/restaurant/${restaurant.slug}/cart`}
              className="h-12 rounded-full"
              onClick={closeDrawer}
            >
              Review cart
            </ButtonLink>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
