"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import type { CartLine, CartSnapshot, MenuItem } from "@/types/dining";
import { computeTotals } from "@/utils/currency";
import {
  computeUnitPrice,
  createLineId,
  defaultSelections,
  linesSubtotal,
  optionSignature,
} from "@/utils/pricing";
import {
  readCachedStore,
  subscribeStore,
  writeCachedStore,
} from "@/utils/browserStore";
import { storageKeys } from "@/utils/storage";

interface AddItemInput {
  item: MenuItem;
  quantity?: number;
  selectedOptions?: Record<string, string[]>;
  specialInstructions?: string;
  silent?: boolean;
}

interface CartContextValue {
  ready: boolean;
  items: CartLine[];
  comboDiscount: number;
  comboLabel?: string;
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (input: AddItemInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  applyComboDiscount: (amount: number, label: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const emptyCart = (slug: string): CartSnapshot => ({
  restaurantSlug: slug,
  items: [],
  comboDiscount: 0,
});

function getCart(slug: string) {
  const stored = readCachedStore<CartSnapshot | null>(storageKeys.cart(slug), null);
  if (stored?.restaurantSlug === slug) return stored;
  return emptyCart(slug);
}

function saveCart(slug: string, snapshot: CartSnapshot) {
  writeCachedStore(storageKeys.cart(slug), snapshot);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  const key = storageKeys.cart(restaurant.slug);
  const snapshot = useSyncExternalStore(
    (listener) => subscribeStore(key, listener),
    () => getCart(restaurant.slug),
    () => emptyCart(restaurant.slug),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const persist = useCallback(
    (updater: (current: CartSnapshot) => CartSnapshot) => {
      saveCart(restaurant.slug, updater(getCart(restaurant.slug)));
    },
    [restaurant.slug],
  );

  const addItem = useCallback(
    ({
      item,
      quantity = 1,
      selectedOptions,
      specialInstructions,
      silent,
    }: AddItemInput) => {
      const options = selectedOptions ?? defaultSelections(item);
      const unitPrice = computeUnitPrice(item, options);
      persist((current) => {
        const signature = `${item.id}|${optionSignature(options)}|${specialInstructions ?? ""}`;
        const existing = current.items.find(
          (line) =>
            `${line.itemId}|${optionSignature(line.selectedOptions)}|${line.specialInstructions ?? ""}` ===
            signature,
        );
        if (existing) {
          return {
            ...current,
            items: current.items.map((line) =>
              line.lineId === existing.lineId
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            ),
          };
        }
        const line: CartLine = {
          lineId: createLineId(),
          itemId: item.id,
          quantity,
          selectedOptions: options,
          specialInstructions,
          unitPrice,
        };
        return { ...current, items: [...current.items, line] };
      });
      if (!silent) {
        toast.success(`${item.name} added to your table`);
      }
    },
    [persist],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      persist((current) => {
        const items =
          quantity <= 0
            ? current.items.filter((line) => line.lineId !== lineId)
            : current.items.map((line) =>
                line.lineId === lineId ? { ...line, quantity } : line,
              );
        return {
          ...current,
          items,
          comboDiscount: items.length === 0 ? 0 : current.comboDiscount,
          comboLabel: items.length === 0 ? undefined : current.comboLabel,
        };
      });
    },
    [persist],
  );

  const removeItem = useCallback(
    (lineId: string) => {
      persist((current) => {
        const items = current.items.filter((line) => line.lineId !== lineId);
        return {
          ...current,
          items,
          comboDiscount: items.length === 0 ? 0 : current.comboDiscount,
          comboLabel: items.length === 0 ? undefined : current.comboLabel,
        };
      });
    },
    [persist],
  );

  const applyComboDiscount = useCallback(
    (amount: number, label: string) => {
      persist((current) => ({
        ...current,
        comboDiscount: amount,
        comboLabel: label,
      }));
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    saveCart(restaurant.slug, emptyCart(restaurant.slug));
  }, [restaurant.slug]);

  const subtotal = linesSubtotal(snapshot.items);
  const totals = computeTotals(
    subtotal,
    restaurant.taxRate,
    snapshot.comboDiscount,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ready: true,
      items: snapshot.items,
      comboDiscount: snapshot.comboDiscount,
      comboLabel: snapshot.comboLabel,
      count: snapshot.items.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      applyComboDiscount,
      clearCart,
    }),
    [
      snapshot,
      totals.subtotal,
      totals.tax,
      totals.total,
      drawerOpen,
      addItem,
      updateQuantity,
      removeItem,
      applyComboDiscount,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
