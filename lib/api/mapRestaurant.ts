import type {
  Category,
  CustomizationGroup,
  DietType,
  MenuItem,
  Restaurant,
  RestaurantTheme,
} from "@/types/dining";
import type {
  ApiCategory,
  ApiMenuItem,
  ApiRestaurantBranding,
} from "@/lib/api/types";

const DIETS: DietType[] = ["veg", "non-veg", "egg"];

function asDiet(value: string): DietType {
  return DIETS.includes(value as DietType) ? (value as DietType) : "veg";
}

function asCustomizations(
  value: ApiMenuItem["customizations"],
): CustomizationGroup[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return value;
}

function asTheme(value: RestaurantTheme, fallback: RestaurantTheme) {
  if (!value?.colors?.primary || !value?.fonts?.heading) {
    return fallback;
  }
  return value;
}

export function mapApiMenuItem(item: ApiMenuItem): MenuItem {
  return {
    id: item.id,
    restaurantSlug: item.restaurantSlug,
    categoryId: item.categoryId,
    name: item.name,
    description: item.description,
    ingredients: item.ingredients ?? [],
    price: Number(item.price),
    image: item.image,
    diet: asDiet(String(item.diet)),
    available: item.available,
    popular: item.popular,
    chefPick: item.chefPick,
    customizations: asCustomizations(item.customizations),
    tags: item.tags ?? [],
  };
}

export function mapApiCategory(category: ApiCategory): Category {
  return {
    id: category.slug || category.id,
    slug: category.slug || category.id,
    name: category.name,
    nameHi: category.nameHi,
    description: category.description,
    image: category.image,
  };
}

export function mapApiRestaurant(
  branding: ApiRestaurantBranding,
  categories: ApiCategory[],
  items: ApiMenuItem[],
  fallback: Restaurant,
): Restaurant {
  return {
    slug: branding.slug,
    name: branding.name,
    tagline: branding.tagline ?? fallback.tagline,
    description: branding.description ?? fallback.description,
    logo: branding.logo ?? fallback.logo,
    coverImage: branding.coverImage ?? fallback.coverImage,
    ambienceImage: branding.ambienceImage ?? fallback.ambienceImage,
    cuisine: branding.cuisine ?? fallback.cuisine,
    location: branding.location ?? fallback.location,
    hours: branding.hours ?? fallback.hours,
    loyaltyProgramName:
      branding.loyaltyProgramName ?? fallback.loyaltyProgramName,
    loyaltyTagline: branding.loyaltyTagline ?? fallback.loyaltyTagline,
    taxRate: branding.taxRate ?? fallback.taxRate,
    estimatedPrepMinutes:
      branding.estimatedPrepMinutes ?? fallback.estimatedPrepMinutes,
    theme: asTheme(branding.theme, fallback.theme),
    categories: categories.map(mapApiCategory),
    menuItems: items.map(mapApiMenuItem),
  };
}
