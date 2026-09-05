import { cookies } from "next/headers";
import { restaurants } from "@/mock-data/restaurants";
import { fetchRestaurantBranding, fetchRestaurantMenu } from "@/lib/api/client";
import { mapApiRestaurant } from "@/lib/api/mapRestaurant";
import { SESSION_COOKIE } from "@/lib/diningSession";
import type { Restaurant } from "@/types/dining";

function mockRestaurant(slug: string) {
  return restaurants.find((restaurant) => restaurant.slug === slug) ?? null;
}

async function readSessionToken() {
  try {
    return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

async function loadFromApi(
  slug: string,
  sessionToken: string,
): Promise<Restaurant | null> {
  const fallback = mockRestaurant(slug);
  const [branding, menu] = await Promise.all([
    fetchRestaurantBranding(slug, sessionToken),
    fetchRestaurantMenu(slug, sessionToken),
  ]);

  if (!fallback) {
    return mapApiRestaurant(branding, menu.categories, menu.items, {
      slug: branding.slug,
      name: branding.name,
      tagline: branding.tagline ?? "",
      description: branding.description ?? "",
      logo: branding.logo ?? "",
      coverImage: branding.coverImage ?? "",
      ambienceImage: branding.ambienceImage ?? branding.coverImage ?? "",
      cuisine: branding.cuisine ?? "",
      location: branding.location ?? "",
      hours: branding.hours ?? "",
      loyaltyProgramName: branding.loyaltyProgramName ?? "",
      loyaltyTagline: branding.loyaltyTagline ?? "",
      taxRate: branding.taxRate ?? 0.05,
      estimatedPrepMinutes: branding.estimatedPrepMinutes ?? 20,
      theme: branding.theme,
      categories: [],
      menuItems: [],
    });
  }

  return mapApiRestaurant(branding, menu.categories, menu.items, fallback);
}

export async function getRestaurantBySlug(
  slug: string,
): Promise<Restaurant | null> {
  const sessionToken = await readSessionToken();
  if (sessionToken) {
    try {
      return await loadFromApi(slug, sessionToken);
    } catch (error) {
      console.error(`Live restaurant lookup failed for ${slug}`, error);
    }
  }
  return mockRestaurant(slug);
}

export function getRestaurantSlugs() {
  return restaurants.map((restaurant) => restaurant.slug);
}

export async function listRestaurants(): Promise<Restaurant[]> {
  return restaurants;
}
