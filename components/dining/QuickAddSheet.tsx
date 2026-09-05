"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/CartProvider";
import { useI18n } from "@/features/i18n/LanguageProvider";
import type { MenuItem } from "@/types/dining";
import { formatINR } from "@/utils/currency";
import { computeUnitPrice, defaultSelections } from "@/utils/pricing";

export function QuickAddSheet({
  item,
  open,
  onOpenChange,
}: {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const [selectedOptions, setSelectedOptions] = useState(() =>
    item ? defaultSelections(item) : {},
  );
  const [instructions, setInstructions] = useState("");

  const current = item;
  const unitPrice = useMemo(
    () => (current ? computeUnitPrice(current, selectedOptions) : 0),
    [current, selectedOptions],
  );

  if (!current) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto w-full max-w-md">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-heading text-3xl">{current.name}</DrawerTitle>
          <DrawerDescription>{formatINR(unitPrice)}</DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[50vh] space-y-4 overflow-y-auto px-4">
          {(current.customizations ?? []).map((group) => (
            <div key={group.id} className="space-y-2">
              <p className="text-sm font-medium">
                {group.type === "single" ? t("size") : t("extras")}
              </p>
              {group.type === "single" ? (
                <RadioGroup
                  value={selectedOptions[group.id]?.[0] ?? ""}
                  onValueChange={(value) => {
                    if (value) {
                      setSelectedOptions((cur) => ({ ...cur, [group.id]: [value] }));
                    }
                  }}
                >
                  {group.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex min-h-12 items-center justify-between rounded-2xl border border-border px-3"
                    >
                      <span className="flex items-center gap-3">
                        <RadioGroupItem value={option.id} />
                        {option.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {option.priceDelta ? `+ ${formatINR(option.priceDelta)}` : ""}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              ) : (
                group.options.map((option) => {
                  const checked = (selectedOptions[group.id] ?? []).includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className="flex min-h-12 items-center justify-between rounded-2xl border border-border px-3"
                    >
                      <span className="flex items-center gap-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            setSelectedOptions((cur) => ({
                              ...cur,
                              [group.id]: value
                                ? [...(cur[group.id] ?? []), option.id]
                                : (cur[group.id] ?? []).filter((id) => id !== option.id),
                            }))
                          }
                        />
                        {option.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        + {formatINR(option.priceDelta)}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          ))}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("note")}</p>
            <Textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder={t("notePh")}
              className="min-h-20 rounded-2xl"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button
            className="gold-fill h-12 rounded-full"
            onClick={() => {
              addItem({
                item: current,
                selectedOptions,
                specialInstructions: instructions.trim() || undefined,
              });
              onOpenChange(false);
            }}
          >
            {t("add")} · {formatINR(unitPrice)}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
