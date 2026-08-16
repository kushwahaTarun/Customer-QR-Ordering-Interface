import { cn } from "@/lib/utils";
import type { DietType } from "@/types/dining";

const labels: Record<DietType, string> = {
  veg: "Veg",
  "non-veg": "Non-veg",
  egg: "Contains egg",
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
        diet === "veg" && "border-emerald-300/70 text-emerald-100",
        diet === "non-veg" && "border-rose-300/70 text-rose-100",
        diet === "egg" && "border-amber-300/70 text-amber-100",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2.5 border",
          diet === "veg" && "rounded-[2px] border-emerald-300 bg-emerald-400",
          diet === "non-veg" && "rotate-45 rounded-none border-rose-300 bg-rose-400",
          diet === "egg" && "rounded-full border-amber-300 bg-amber-300",
        )}
      />
      {labels[diet]}
    </span>
  );
}
