import type { RecommendationSet } from "@/types/dining";

export const recommendations: RecommendationSet[] = [
  {
    id: "abc-pizza-pairing",
    restaurantSlug: "abc-lounge",
    triggerItemIds: ["farmhouse-pizza"],
    headline: "Recommended for you",
    supportingCopy: "Most customers add",
    suggestedItemIds: ["cold-coffee", "cheese-fries"],
    combo: {
      name: "Pizza Evening Combo",
      itemIds: ["farmhouse-pizza", "cold-coffee"],
      saveAmount: 40,
      ctaLabel: "Add Combo",
    },
  },
  {
    id: "abc-burger-pairing",
    restaurantSlug: "abc-lounge",
    triggerItemIds: ["lounge-burger"],
    headline: "Recommended for you",
    supportingCopy: "Most customers add",
    suggestedItemIds: ["cheese-fries", "lime-cooler"],
    combo: {
      name: "Burger Evening Plate",
      itemIds: ["lounge-burger", "cheese-fries", "lime-cooler"],
      saveAmount: 49,
      ctaLabel: "Add Plate",
    },
  },
  {
    id: "abc-dessert-close",
    restaurantSlug: "abc-lounge",
    triggerItemIds: ["charred-tenderloin", "truffle-risotto"],
    headline: "A last course",
    supportingCopy: "Guests at this table often finish with",
    suggestedItemIds: ["chocolate-fondant", "affogato"],
  },
  {
    id: "xyz-morning-pair",
    restaurantSlug: "cafe-xyz",
    triggerItemIds: ["avocado-toast", "oat-latte"],
    headline: "Recommended for you",
    supportingCopy: "Most guests add",
    suggestedItemIds: ["almond-croissant", "cold-brew"],
    combo: {
      name: "Latte & Croissant",
      itemIds: ["oat-latte", "almond-croissant"],
      saveAmount: 40,
      ctaLabel: "Add Combo",
    },
  },
  {
    id: "xyz-toast-pair",
    restaurantSlug: "cafe-xyz",
    triggerItemIds: ["avocado-toast"],
    headline: "Recommended for you",
    supportingCopy: "Most guests add",
    suggestedItemIds: ["oat-latte", "house-chai"],
  },
];
