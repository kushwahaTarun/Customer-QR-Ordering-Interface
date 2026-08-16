"use client";

import { FilterChip } from "@/components/dining/FilterChip";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { usePrefs } from "@/features/prefs/PrefsProvider";
import type { DietFilter } from "@/utils/diet";

const OPTIONS: { id: DietFilter; labelKey: "allFood" | "vegOnly" | "nonVeg" }[] =
  [
    { id: "all", labelKey: "allFood" },
    { id: "veg", labelKey: "vegOnly" },
    { id: "non-veg", labelKey: "nonVeg" },
  ];

export function DietFilterRow() {
  const { dietFilter, setDietFilter } = usePrefs();
  const { t } = useI18n();

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={t("dietLabel")}
    >
      {OPTIONS.map((option) => (
        <FilterChip
          key={option.id}
          active={dietFilter === option.id}
          onClick={() => setDietFilter(option.id)}
        >
          {t(option.labelKey)}
        </FilterChip>
      ))}
    </div>
  );
}
