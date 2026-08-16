"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import {
  getServerSnapshot,
  readCachedStore,
  subscribeStore,
  writeCachedStore,
} from "@/utils/browserStore";
import type { DietFilter } from "@/utils/diet";

interface PrefsContextValue {
  dietFilter: DietFilter;
  setDietFilter: (filter: DietFilter) => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

function normalizeDiet(value: DietFilter | string): DietFilter {
  if (value === "veg" || value === "non-veg") return value;
  return "all";
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  const key = `dde:diet:${restaurant.slug}`;
  const dietFilter = useSyncExternalStore(
    (listener) => subscribeStore(key, listener),
    () => normalizeDiet(readCachedStore<DietFilter>(key, "all")),
    () => getServerSnapshot(key, () => "all" as DietFilter),
  );

  const setDietFilter = useCallback(
    (filter: DietFilter) => {
      writeCachedStore(key, filter);
    },
    [key],
  );

  const value = useMemo<PrefsContextValue>(
    () => ({
      dietFilter: normalizeDiet(dietFilter),
      setDietFilter,
    }),
    [dietFilter, setDietFilter],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const context = useContext(PrefsContext);
  if (!context) {
    throw new Error("usePrefs must be used within PrefsProvider");
  }
  return context;
}

export type { DietFilter };
