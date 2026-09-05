import { restaurants } from "@/mock-data/restaurants";
import type { MenuItem } from "@/types/dining";

export function findMenuItemSync(
  slug: string,
  itemId: string,
  liveItems?: MenuItem[] | null,
) {
  const fromLive = liveItems?.find((item) => item.id === itemId);
  if (fromLive) return fromLive;

  return (
    restaurants
      .find((restaurant) => restaurant.slug === slug)
      ?.menuItems.find((item) => item.id === itemId) ?? null
  );
}
