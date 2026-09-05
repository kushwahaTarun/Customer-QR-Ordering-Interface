import type {
  Category,
  CustomizationGroup,
  DietType,
  RestaurantTheme,
} from "@/types/dining";

export type ApiRestaurantBranding = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  ambienceImage: string | null;
  cuisine: string | null;
  location: string | null;
  hours: string | null;
  loyaltyProgramName: string | null;
  loyaltyTagline: string | null;
  taxRate: number;
  estimatedPrepMinutes: number;
  theme: RestaurantTheme;
};

export type ApiCategory = Category;

export type ApiMenuItem = {
  id: string;
  restaurantSlug: string;
  categoryId: string;
  name: string;
  description: string;
  ingredients?: string[];
  price: number | string;
  image: string;
  diet: DietType | string;
  available: boolean;
  popular?: boolean;
  chefPick?: boolean;
  customizations?: CustomizationGroup[] | null;
  tags?: string[];
};

export type ApiMenuResponse = {
  restaurantSlug: string;
  categories: ApiCategory[];
  items: ApiMenuItem[];
};
