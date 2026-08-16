import type { LoyaltyAccount, LoyaltyReward } from "@/types/dining";

export const loyaltyRewards: LoyaltyReward[] = [
  {
    id: "abc-free-coffee",
    restaurantSlug: "abc-lounge",
    name: "Free Cold Coffee",
    description: "A house cold coffee, on us.",
    pointsCost: 100,
  },
  {
    id: "abc-dessert",
    restaurantSlug: "abc-lounge",
    name: "Fondant on the house",
    description: "Dark chocolate fondant after dinner.",
    pointsCost: 220,
  },
  {
    id: "abc-nightcap",
    restaurantSlug: "abc-lounge",
    name: "Nightcap credit",
    description: "₹200 toward any drink after 9 pm.",
    pointsCost: 280,
  },
  {
    id: "xyz-free-latte",
    restaurantSlug: "cafe-xyz",
    name: "Free Oat Latte",
    description: "Your usual, already waiting.",
    pointsCost: 120,
  },
  {
    id: "xyz-croissant",
    restaurantSlug: "cafe-xyz",
    name: "Almond croissant",
    description: "From the morning bake.",
    pointsCost: 90,
  },
];

export const demoLoyaltySeed: Record<string, LoyaltyAccount> = {
  "abc-lounge": {
    restaurantSlug: "abc-lounge",
    name: "Rahul",
    mobile: "9876543210",
    points: 450,
    joined: true,
    history: [
      {
        id: "h1",
        type: "bonus",
        label: "Joining Bonus",
        points: 50,
        createdAt: "2026-07-02T18:10:00.000Z",
      },
      {
        id: "h2",
        type: "earn",
        label: "Order Reward",
        points: 80,
        createdAt: "2026-07-12T20:40:00.000Z",
      },
      {
        id: "h3",
        type: "earn",
        label: "Weekend Dining",
        points: 120,
        createdAt: "2026-07-19T21:05:00.000Z",
      },
      {
        id: "h4",
        type: "earn",
        label: "Chef's Table",
        points: 200,
        createdAt: "2026-08-01T21:30:00.000Z",
      },
      {
        id: "h5",
        type: "redeem",
        label: "Reward Used",
        points: -100,
        createdAt: "2026-08-03T19:12:00.000Z",
      },
      {
        id: "h6",
        type: "earn",
        label: "Late supper",
        points: 100,
        createdAt: "2026-08-09T22:18:00.000Z",
      },
    ],
  },
};
