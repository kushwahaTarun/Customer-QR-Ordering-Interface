import { cn } from "@/lib/utils";
import type { DietType } from "@/types/dining";

const labels: Record<DietType, string> = {
  veg: "Veg",
  "non-veg": "Non-veg",
  egg: "Egg",
};

export function DietBadge({
  diet,
  className,
}: {
  diet: DietType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        diet === "veg" && "border-emerald-500/40 text-emerald-400",
        diet === "non-veg" && "border-rose-500/40 text-rose-400",
        diet === "egg" && "border-amber-500/40 text-amber-400",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-[2px] border",
          diet === "veg" && "border-emerald-500 bg-emerald-500",
          diet === "non-veg" && "rounded-none rotate-45 border-rose-500 bg-rose-500",
          diet === "egg" && "border-amber-500 bg-amber-400",
        )}
      />
      {labels[diet]}
    </span>
  );
}
