"use client";

import { Check } from "lucide-react";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { OrderKitchenStatus } from "@/types/dining";
import { kitchenSteps } from "@/services/orderService";

export function OrderStatus({
  status,
  compact = false,
}: {
  status: OrderKitchenStatus;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const labels: Record<OrderKitchenStatus, string> = {
    received: t("statusReceived"),
    preparing: t("statusPreparing"),
    cooking: t("statusCooking"),
    ready: t("statusReady"),
  };
  const steps = kitchenSteps();
  const currentIndex = steps.indexOf(status);

  return (
    <ol className={cn("relative", compact ? "space-y-3" : "space-y-5")}>
      {steps.map((step, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step} className="relative flex gap-4">
            {index !== steps.length - 1 ? (
              <span
                className={cn(
                  "absolute top-7 left-[13px] h-[calc(100%-4px)] w-px",
                  complete || current ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs",
                complete && "border-primary bg-primary text-primary-foreground",
                current && "border-primary bg-primary/15 text-primary",
                !complete && !current && "border-border text-muted-foreground",
              )}
            >
              {complete ? <Check className="size-3.5" /> : index + 1}
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  "font-medium",
                  current && "text-primary",
                  !complete && !current && "text-muted-foreground",
                )}
              >
                {complete ? `✓ ${labels[step]}` : labels[step]}
              </p>
              {current && !compact ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("kitchenWait")}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
