import { loyaltyRewards } from "@/mock-data/loyalty";
import type { LoyaltyAccount, LoyaltyReward } from "@/types/dining";
import { readCachedStore, writeCachedStore } from "@/utils/browserStore";
import { storageKeys } from "@/utils/storage";

const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

function emptyAccount(slug: string): LoyaltyAccount {
  return {
    restaurantSlug: slug,
    name: "",
    mobile: "",
    points: 0,
    joined: false,
    history: [],
  };
}

// Later: GET /api/restaurants/:slug/loyalty?mobile=
export async function getLoyaltyAccount(
  slug: string,
): Promise<LoyaltyAccount> {
  await wait();
  return readCachedStore<LoyaltyAccount>(
    storageKeys.loyalty(slug),
    emptyAccount(slug),
  );
}

export async function listRewards(slug: string): Promise<LoyaltyReward[]> {
  await wait();
  return loyaltyRewards.filter((reward) => reward.restaurantSlug === slug);
}

// Later: POST /api/restaurants/:slug/loyalty
export async function joinLoyaltyProgram(input: {
  slug: string;
  name: string;
  mobile: string;
}): Promise<LoyaltyAccount> {
  await wait(140);
  const existing = await getLoyaltyAccount(input.slug);
  if (existing.joined) {
    return { ...existing, name: input.name, mobile: input.mobile };
  }

  const account: LoyaltyAccount = {
    restaurantSlug: input.slug,
    name: input.name,
    mobile: input.mobile,
    points: 50,
    joined: true,
    history: [
      {
        id: `loy_${Date.now()}`,
        type: "bonus",
        label: "Joining Bonus",
        points: 50,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  writeCachedStore(storageKeys.loyalty(input.slug), account);
  return account;
}

export async function awardOrderPoints(input: {
  slug: string;
  total: number;
}): Promise<LoyaltyAccount | null> {
  await wait();
  const account = await getLoyaltyAccount(input.slug);
  if (!account.joined) return account;
  const points = Math.max(10, Math.round(input.total / 10));
  const next: LoyaltyAccount = {
    ...account,
    points: account.points + points,
    history: [
      {
        id: `loy_${Date.now()}`,
        type: "earn",
        label: "Order Reward",
        points,
        createdAt: new Date().toISOString(),
      },
      ...account.history,
    ],
  };
  writeCachedStore(storageKeys.loyalty(input.slug), next);
  return next;
}

// Later: POST /api/restaurants/:slug/loyalty/redeem
export async function redeemReward(input: {
  slug: string;
  rewardId: string;
}): Promise<LoyaltyAccount> {
  await wait(160);
  const account = await getLoyaltyAccount(input.slug);
  const reward = loyaltyRewards.find(
    (entry) => entry.id === input.rewardId && entry.restaurantSlug === input.slug,
  );
  if (!account.joined || !reward) return account;
  if (account.points < reward.pointsCost) {
    throw new Error("Not enough points");
  }
  const next: LoyaltyAccount = {
    ...account,
    points: account.points - reward.pointsCost,
    history: [
      {
        id: `loy_${Date.now()}`,
        type: "redeem",
        label: reward.name,
        points: -reward.pointsCost,
        createdAt: new Date().toISOString(),
      },
      ...account.history,
    ],
  };
  writeCachedStore(storageKeys.loyalty(input.slug), next);
  return next;
}
