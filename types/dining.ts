export type DietType = "veg" | "non-veg" | "egg";

export type PaymentMethod = "online" | "counter";

export type PaymentStatus = "pending" | "processing" | "success" | "failed";

export type OrderKitchenStatus =
  | "received"
  | "preparing"
  | "cooking"
  | "ready";

export type CustomizationType = "single" | "multiple";

export interface RestaurantTheme {
  mode: "light" | "dark";
  radius: string;
  fonts: {
    heading: "playfair" | "cormorant" | "fraunces";
    sans: "karla" | "outfit" | "dm-sans";
  };
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
  };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  image: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  type: CustomizationType;
  required: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  restaurantSlug: string;
  categoryId: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  diet: DietType;
  available: boolean;
  popular?: boolean;
  chefPick?: boolean;
  customizations?: CustomizationGroup[];
  tags?: string[];
}

export interface Restaurant {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  ambienceImage: string;
  cuisine: string;
  location: string;
  hours: string;
  loyaltyProgramName: string;
  loyaltyTagline: string;
  taxRate: number;
  estimatedPrepMinutes: number;
  theme: RestaurantTheme;
  categories: Category[];
  menuItems: MenuItem[];
}

export interface ComboOffer {
  name: string;
  itemIds: string[];
  saveAmount: number;
  ctaLabel: string;
}

export interface RecommendationSet {
  id: string;
  restaurantSlug: string;
  triggerItemIds: string[];
  headline: string;
  supportingCopy: string;
  suggestedItemIds: string[];
  reasons?: Record<string, string>;
  combo?: ComboOffer;
  showOnHome?: boolean;
}

export interface CartLine {
  lineId: string;
  itemId: string;
  quantity: number;
  selectedOptions: Record<string, string[]>;
  specialInstructions?: string;
  unitPrice: number;
}

export interface CartSnapshot {
  restaurantSlug: string;
  items: CartLine[];
  comboDiscount: number;
  comboLabel?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantSlug: string;
  tableNumber: string;
  customerName: string;
  mobile: string;
  items: CartLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderKitchenStatus;
  joinLoyalty: boolean;
  createdAt: string;
  estimatedReadyAt: string;
}

export interface CreateOrderInput {
  restaurantSlug: string;
  tableNumber: string;
  customerName: string;
  mobile: string;
  items: CartLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  joinLoyalty: boolean;
}

export interface LoyaltyEvent {
  id: string;
  type: "earn" | "redeem" | "bonus";
  label: string;
  points: number;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  restaurantSlug: string;
  name: string;
  description: string;
  pointsCost: number;
}

export interface LoyaltyAccount {
  restaurantSlug: string;
  name: string;
  mobile: string;
  points: number;
  joined: boolean;
  history: LoyaltyEvent[];
}

export interface GuestProfile {
  name: string;
  mobile: string;
}
