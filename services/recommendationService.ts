import { recommendations } from "@/mock-data/recommendations";
import { findMenuItemSync } from "@/services/menuService";
import type { MenuItem, RecommendationSet } from "@/types/dining";

const wait = (ms = 90) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ResolvedRecommendation {
  set: RecommendationSet;
  items: MenuItem[];
}

/**
 * Customer-side pairing suggestions.
 * Returns mock data for now. Replace with:
 * POST /api/restaurants/:slug/recommendations
 *
 * When the backend is ready, this is the SpaceXAI-backed
 * endpoint (XAI_API_KEY, https://api.x.ai/v1). Do not call
 * the model from the browser.
 */
export async function getRecommendations(
  slug: string,
  cartItemIds: string[],
): Promise<ResolvedRecommendation | null> {
  await wait();
  if (cartItemIds.length === 0) return null;

  const match =
    recommendations.find(
      (entry) =>
        entry.restaurantSlug === slug &&
        entry.triggerItemIds.some((id) => cartItemIds.includes(id)),
    ) ?? null;

  if (!match) return null;

  const items = match.suggestedItemIds
    .map((id) => findMenuItemSync(slug, id))
    .filter((item): item is MenuItem => Boolean(item));

  return { set: match, items };
}
