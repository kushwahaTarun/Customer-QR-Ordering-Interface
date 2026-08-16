"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { loyaltyRewards } from "@/mock-data/loyalty";
import {
  awardOrderPoints,
  getLoyaltyAccount,
  joinLoyaltyProgram,
  redeemReward,
} from "@/services/loyaltyService";
import type { GuestProfile, LoyaltyAccount } from "@/types/dining";
import {
  getServerSnapshot,
  readCachedStore,
  subscribeStore,
  writeCachedStore,
} from "@/utils/browserStore";
import { storageKeys } from "@/utils/storage";

interface LoyaltyContextValue {
  account: LoyaltyAccount;
  rewards: import("@/types/dining").LoyaltyReward[];
  guestName: string;
  guestMobile: string;
  setGuest: (name: string, mobile: string) => void;
  join: (name: string, mobile: string) => Promise<void>;
  redeem: (rewardId: string) => Promise<void>;
  creditOrder: (total: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

const emptyAccounts = new Map<string, LoyaltyAccount>();

function emptyAccount(slug: string): LoyaltyAccount {
  const cached = emptyAccounts.get(slug);
  if (cached) return cached;
  const next: LoyaltyAccount = {
    restaurantSlug: slug,
    name: "",
    mobile: "",
    points: 0,
    joined: false,
    history: [],
  };
  emptyAccounts.set(slug, next);
  return next;
}

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  const loyaltyKey = storageKeys.loyalty(restaurant.slug);
  const guestKey = storageKeys.guest;

  const account = useSyncExternalStore(
    (listener) => subscribeStore(loyaltyKey, listener),
    () =>
      readCachedStore<LoyaltyAccount>(
        loyaltyKey,
        emptyAccount(restaurant.slug),
      ),
    () => getServerSnapshot(loyaltyKey, () => emptyAccount(restaurant.slug)),
  );

  const guest = useSyncExternalStore(
    (listener) => subscribeStore(guestKey, listener),
    () => readCachedStore<GuestProfile | null>(guestKey, null),
    () => getServerSnapshot(guestKey, () => null),
  );

  const rewards = useMemo(
    () =>
      loyaltyRewards.filter((reward) => reward.restaurantSlug === restaurant.slug),
    [restaurant.slug],
  );

  const guestName = guest?.name || account.name;
  const guestMobile = guest?.mobile || account.mobile;

  const setGuest = useCallback((name: string, mobile: string) => {
    writeCachedStore(storageKeys.guest, { name, mobile });
  }, []);

  const refresh = useCallback(async () => {
    const next = await getLoyaltyAccount(restaurant.slug);
    writeCachedStore(storageKeys.loyalty(restaurant.slug), next);
  }, [restaurant.slug]);

  const join = useCallback(
    async (name: string, mobile: string) => {
      const next = await joinLoyaltyProgram({
        slug: restaurant.slug,
        name,
        mobile,
      });
      writeCachedStore(storageKeys.loyalty(restaurant.slug), next);
      setGuest(name, mobile);
      toast.success(`Welcome to ${restaurant.loyaltyProgramName}`);
    },
    [restaurant.loyaltyProgramName, restaurant.slug, setGuest],
  );

  const redeem = useCallback(
    async (rewardId: string) => {
      try {
        const next = await redeemReward({ slug: restaurant.slug, rewardId });
        writeCachedStore(storageKeys.loyalty(restaurant.slug), next);
        toast.success("Reward reserved for this table");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to redeem");
      }
    },
    [restaurant.slug],
  );

  const creditOrder = useCallback(
    async (total: number) => {
      const next = await awardOrderPoints({ slug: restaurant.slug, total });
      if (next) {
        writeCachedStore(storageKeys.loyalty(restaurant.slug), next);
      }
    },
    [restaurant.slug],
  );

  const value = useMemo(
    () => ({
      account,
      rewards,
      guestName,
      guestMobile,
      setGuest,
      join,
      redeem,
      creditOrder,
      refresh,
    }),
    [
      account,
      rewards,
      guestName,
      guestMobile,
      setGuest,
      join,
      redeem,
      creditOrder,
      refresh,
    ],
  );

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error("useLoyalty must be used within LoyaltyProvider");
  }
  return context;
}
