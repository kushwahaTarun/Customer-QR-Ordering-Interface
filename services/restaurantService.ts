import { restaurants } from "@/mock-data/restaurants";
import type { Restaurant } from "@/types/dining";

const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

// Later: GET /api/restaurants
export async function listRestaurants(): Promise<Restaurant[]> {
  await wait();
  return restaurants;
}

// Later: GET /api/restaurants/:slug
export async function getRestaurantBySlug(
  slug: string,
): Promise<Restaurant | null> {
  await wait();
  return restaurants.find((restaurant) => restaurant.slug === slug) ?? null;
}

export function getRestaurantSlugs() {
  return restaurants.map((restaurant) => restaurant.slug);
}
