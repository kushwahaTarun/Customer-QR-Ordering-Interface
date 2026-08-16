import type { RecommendationSet } from "@/types/dining";

export const recommendations: RecommendationSet[] = [
  {
    id: "shagun-home",
    restaurantSlug: "shagun",
    triggerItemIds: [],
    headline: "Suggested for your table",
    supportingCopy: "People here often start with these.",
    suggestedItemIds: ["paneer-tikka", "masala-dosa", "mango-lassi"],
    reasons: {
      "paneer-tikka": "Most ordered starter this week.",
      "masala-dosa": "A light and filling plate.",
      "mango-lassi": "Usually ordered with spicy food.",
    },
    showOnHome: true,
  },
  {
    id: "shagun-butter-chicken",
    restaurantSlug: "shagun",
    triggerItemIds: ["butter-chicken"],
    headline: "Goes well with this",
    supportingCopy: "Most people add bread and a drink.",
    suggestedItemIds: ["butter-naan", "mango-lassi"],
    reasons: {
      "butter-naan": "Best with butter chicken.",
      "mango-lassi": "Cools the spice.",
    },
  },
  {
    id: "shagun-dosa",
    restaurantSlug: "shagun",
    triggerItemIds: ["masala-dosa"],
    headline: "Goes well with this",
    supportingCopy: "A small extra and a coffee.",
    suggestedItemIds: ["filter-coffee", "medu-vada"],
    reasons: {
      "filter-coffee": "Usually ordered with dosa.",
      "medu-vada": "A crispy side.",
    },
    combo: {
      name: "South Indian Combo",
      itemIds: ["masala-dosa", "idli-sambar", "filter-coffee"],
      saveAmount: 30,
      ctaLabel: "Add combo",
    },
  },
  {
    id: "shagun-noodles",
    restaurantSlug: "shagun",
    triggerItemIds: ["hakka-noodles", "chilli-paneer"],
    headline: "Goes well with this",
    supportingCopy: "People often make this a full Chinese plate.",
    suggestedItemIds: ["chilli-paneer", "lime-soda"],
    reasons: {
      "chilli-paneer": "Often shared with noodles.",
      "lime-soda": "A light drink with Chinese food.",
    },
    combo: {
      name: "Chinese Combo",
      itemIds: ["hakka-noodles", "chilli-paneer", "lime-soda"],
      saveAmount: 40,
      ctaLabel: "Add combo",
    },
  },
];
