import { recommendations } from "@/mock-data/recommendations";
import { findMenuItemSync } from "@/services/menuLookup";
import type { DietFilter } from "@/utils/diet";
import { matchesDiet } from "@/utils/diet";
import type { DietType, MenuItem, RecommendationSet } from "@/types/dining";

const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ResolvedRecommendation {
  set: RecommendationSet;
  items: MenuItem[];
}

function filterDiet(items: MenuItem[], diet?: DietFilter) {
  if (!diet || diet === "all") return items;
  return items.filter((item) => matchesDiet(item.diet, diet));
}

function resolveSet(
  slug: string,
  set: RecommendationSet,
  diet?: DietFilter,
): ResolvedRecommendation | null {
  const items = filterDiet(
    set.suggestedItemIds
      .map((id) => findMenuItemSync(slug, id))
      .filter((item): item is MenuItem => Boolean(item && item.available)),
    diet,
  );
  if (items.length === 0) return null;
  return { set, items };
}

export async function getHomeRecommendations(
  slug: string,
  diet?: DietFilter,
): Promise<ResolvedRecommendation | null> {
  await wait();
  const match =
    recommendations.find(
      (entry) => entry.restaurantSlug === slug && entry.showOnHome,
    ) ?? null;
  return match ? resolveSet(slug, match, diet) : null;
}

export async function getRecommendations(
  slug: string,
  cartItemIds: string[],
  diet?: DietFilter,
): Promise<ResolvedRecommendation | null> {
  await wait();
  if (cartItemIds.length === 0) {
    return getHomeRecommendations(slug, diet);
  }

  const match =
    recommendations.find(
      (entry) =>
        entry.restaurantSlug === slug &&
        !entry.showOnHome &&
        entry.triggerItemIds.some((id) => cartItemIds.includes(id)),
    ) ?? null;

  if (!match) return getHomeRecommendations(slug, diet);
  return resolveSet(slug, match, diet);
}

export function itemReason(set: RecommendationSet, itemId: string) {
  return set.reasons?.[itemId];
}

export function isVegDiet(diet: DietType) {
  return diet === "veg";
}
