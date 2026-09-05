import { restaurants } from "@/mock-data/restaurants";
import type { Category, MenuItem } from "@/types/dining";
import { getRestaurantBySlug } from "@/services/restaurantService";

function mockRestaurant(slug: string) {
  const restaurant = restaurants.find((entry) => entry.slug === slug);
  if (!restaurant) {
    throw new Error(`Restaurant not found: ${slug}`);
  }
  return restaurant;
}

export async function getCategories(slug: string): Promise<Category[]> {
  const restaurant = await getRestaurantBySlug(slug);
  return restaurant?.categories ?? mockRestaurant(slug).categories;
}

export async function getMenuItems(
  slug: string,
  categoryId?: string,
): Promise<MenuItem[]> {
  const restaurant = await getRestaurantBySlug(slug);
  const items = restaurant?.menuItems ?? mockRestaurant(slug).menuItems;
  if (!categoryId) return items;
  return items.filter((item) => item.categoryId === categoryId);
}

export async function getMenuItem(
  slug: string,
  itemId: string,
): Promise<MenuItem | null> {
  const items = await getMenuItems(slug);
  return items.find((item) => item.id === itemId) ?? null;
}


