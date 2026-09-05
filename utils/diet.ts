import type { DietType } from "@/types/dining";

export type DietFilter = "all" | "veg" | "non-veg";

export function matchesDiet(diet: DietType, filter: DietFilter) {
  if (filter === "all") return true;
  if (filter === "veg") return diet === "veg";
  return diet === "non-veg" || diet === "egg";
}

export function menuHref(slug: string, category = "all") {
  return `/restaurant/${slug}/menu/${category}`;
}
