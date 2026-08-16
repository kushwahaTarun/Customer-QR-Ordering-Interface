"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DietBadge } from "@/components/dining/DietBadge";
import { PageHeader } from "@/components/dining/PageHeader";
import { QuantityStepper } from "@/components/dining/QuantityStepper";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/CartProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import type { MenuItem } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { computeUnitPrice, defaultSelections } from "@/utils/pricing";

export function FoodDetail({ item }: { item: MenuItem }) {
  const restaurant = useRestaurant();
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const [selectedOptions, setSelectedOptions] = useState(() =>
    defaultSelections(item),
  );
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const unitPrice = useMemo(
    () => computeUnitPrice(item, selectedOptions),
    [item, selectedOptions],
  );

  const setSingle = (groupId: string, optionId: string) => {
    setSelectedOptions((current) => ({ ...current, [groupId]: [optionId] }));
  };

  const toggleMultiple = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedOptions((current) => {
      const existing = current[groupId] ?? [];
      return {
        ...current,
        [groupId]: checked
          ? [...existing, optionId]
          : existing.filter((id) => id !== optionId),
      };
    });
  };

  const handleAdd = () => {
    if (!item.available) return;
    addItem({
      item,
      quantity,
      selectedOptions,
      specialInstructions: instructions.trim() || undefined,
    });
    setJustAdded(true);
    openDrawer();
  };

  return (
    <div className="animate-rise">
      <div className="relative h-[46vh] min-h-[280px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/25" />
        <PageHeader
          title=""
          backHref={`/restaurant/${restaurant.slug}/menu/${item.categoryId}`}
          transparent
        />
      </div>

      <section className="relative -mt-16 space-y-6 px-5 pb-8">
        <div className="rounded-[1.6rem] bg-card/92 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] gold-hairline backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">
                {restaurant.categories.find((c) => c.id === item.categoryId)?.name}
              </p>
              <h1 className="font-heading mt-2 text-[2.6rem] leading-[0.9]">{item.name}</h1>
            </div>
            <DietBadge diet={item.diet} />
          </div>
          <p className="serif-italic mt-3 text-lg leading-snug text-foreground/80">
            {item.description}
          </p>
          <p className="price mt-4 text-sm tracking-[0.08em] text-primary">
            {formatINR(unitPrice)}
          </p>
          {!item.available ? (
            <p className="mt-2 text-sm text-destructive">Currently unavailable</p>
          ) : null}
        </div>

        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Ingredients
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{item.ingredients.join(" · ")}</p>
        </div>

        {(item.customizations ?? []).map((group) => (
          <div key={group.id} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-2xl">{group.name}</h2>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {group.required ? "Required" : "Optional"}
              </span>
            </div>
            {group.type === "single" ? (
              <RadioGroup
                value={selectedOptions[group.id]?.[0] ?? ""}
                onValueChange={(value) => {
                  if (value) setSingle(group.id, value);
                }}
                className="gap-2"
              >
                {group.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <RadioGroupItem value={option.id} />
                      {option.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {option.priceDelta === 0
                        ? "Included"
                        : `+ ${formatINR(option.priceDelta)}`}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            ) : (
              <div className="grid gap-2">
                {group.options.map((option) => {
                  const checked = (selectedOptions[group.id] ?? []).includes(
                    option.id,
                  );
                  return (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleMultiple(group.id, option.id, Boolean(value))
                          }
                        />
                        {option.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        + {formatINR(option.priceDelta)}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-[11px] uppercase tracking-[0.18em]">
            Special instructions
          </Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Less spicy"
            className="min-h-24 rounded-2xl bg-card"
          />
        </div>

        <div className="flex items-center justify-between">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <p className="price text-sm text-muted-foreground">
            {formatINR(unitPrice * quantity)}
          </p>
        </div>

        <Button
          className="gold-fill h-12 w-full rounded-full text-base tracking-[0.12em] uppercase"
          disabled={!item.available}
          onClick={handleAdd}
        >
          Add to Cart · {formatINR(unitPrice * quantity)}
        </Button>

        {justAdded ? (
          <div className="space-y-4">
            <RecommendationCard triggerItemIds={[item.id]} />
            <Button
              variant="outline"
              className="h-11 w-full rounded-full"
              onClick={() => router.push(`/restaurant/${restaurant.slug}/cart`)}
            >
              Review cart
            </Button>
          </div>
        ) : (
          <Link
            href={`/restaurant/${restaurant.slug}/menu/${item.categoryId}`}
            className="block text-center text-sm text-muted-foreground"
          >
            Continue browsing
          </Link>
        )}
      </section>
    </div>
  );
}
