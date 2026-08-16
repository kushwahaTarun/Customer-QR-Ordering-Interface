"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import {
  readCachedStore,
  subscribeStore,
  writeCachedStore,
} from "@/utils/browserStore";
import { storageKeys } from "@/utils/storage";

interface SessionContextValue {
  tableNumber: string;
  setTableNumber: (table: string) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function readTable(slug: string) {
  if (typeof window === "undefined") return "6";
  const fromQuery = new URLSearchParams(window.location.search).get("table");
  if (fromQuery) return fromQuery;
  return readCachedStore<string>(storageKeys.table(slug), "6");
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  const key = storageKeys.table(restaurant.slug);
  const tableNumber = useSyncExternalStore(
    (listener) => subscribeStore(key, listener),
    () => readTable(restaurant.slug),
    () => "6",
  );

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("table");
    if (fromQuery) {
      writeCachedStore(storageKeys.table(restaurant.slug), fromQuery);
    }
  }, [restaurant.slug]);

  const setTableNumber = useCallback(
    (table: string) => {
      writeCachedStore(storageKeys.table(restaurant.slug), table);
    },
    [restaurant.slug],
  );

  const value = useMemo(
    () => ({ tableNumber, setTableNumber }),
    [tableNumber, setTableNumber],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
