"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "pressable inline-flex h-11 min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-200",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-primary/20 bg-card/70 text-foreground",
      )}
    >
      <span>{children}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-xs",
            active ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
