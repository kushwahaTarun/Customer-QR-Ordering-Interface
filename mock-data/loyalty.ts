import type { LoyaltyAccount, LoyaltyReward } from "@/types/dining";

export const loyaltyRewards: LoyaltyReward[] = [
  {
    id: "shagun-chai",
    restaurantSlug: "shagun",
    name: "Free Masala Chai",
    description: "One hot masala chai, on us.",
    pointsCost: 80,
  },
  {
    id: "shagun-sweet",
    restaurantSlug: "shagun",
    name: "Free Gulab Jamun",
    description: "A sweet after your meal.",
    pointsCost: 150,
  },
  {
    id: "shagun-thali",
    restaurantSlug: "shagun",
    name: "₹150 off on thali",
    description: "Use this on any Shagun thali.",
    pointsCost: 220,
  },
];

export const demoLoyaltySeed: Record<string, LoyaltyAccount> = {
  shagun: {
    restaurantSlug: "shagun",
    name: "Guest",
    mobile: "9876543210",
    points: 180,
    joined: true,
    history: [
      {
        id: "h1",
        type: "bonus",
        label: "Welcome gift",
        points: 50,
        createdAt: "2026-07-02T18:10:00.000Z",
      },
      {
        id: "h2",
        type: "earn",
        label: "Order at Shagun",
        points: 80,
        createdAt: "2026-07-12T20:40:00.000Z",
      },
      {
        id: "h3",
        type: "earn",
        label: "Weekend dinner",
        points: 50,
        createdAt: "2026-07-19T21:05:00.000Z",
      },
    ],
  },
};
