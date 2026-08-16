import { restaurants } from "@/mock-data/restaurants";
import type { Category, MenuItem } from "@/types/dining";

const wait = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));

function restaurantOrThrow(slug: string) {
  const restaurant = restaurants.find((entry) => entry.slug === slug);
  if (!restaurant) {
    throw new Error(`Restaurant not found: ${slug}`);
  }
  return restaurant;
}

// Later: GET /api/restaurants/:slug/categories
export async function getCategories(slug: string): Promise<Category[]> {
  await wait();
  return restaurantOrThrow(slug).categories;
}

// Later: GET /api/restaurants/:slug/menu?category=
export async function getMenuItems(
  slug: string,
  categoryId?: string,
): Promise<MenuItem[]> {
  await wait();
  const items = restaurantOrThrow(slug).menuItems;
  if (!categoryId) return items;
  return items.filter((item) => item.categoryId === categoryId);
}

// Later: GET /api/restaurants/:slug/menu/:itemId
export async function getMenuItem(
  slug: string,
  itemId: string,
): Promise<MenuItem | null> {
  await wait();
  return (
    restaurantOrThrow(slug).menuItems.find((item) => item.id === itemId) ?? null
  );
}

export function findMenuItemSync(slug: string, itemId: string) {
  return (
    restaurants
      .find((restaurant) => restaurant.slug === slug)
      ?.menuItems.find((item) => item.id === itemId) ?? null
  );
}
