const memoryStore = new Map<string, string>();

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = canUseBrowserStorage()
      ? localStorage.getItem(key)
      : memoryStore.get(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  if (canUseBrowserStorage()) {
    localStorage.setItem(key, raw);
    return;
  }
  memoryStore.set(key, raw);
}

export function removeStorage(key: string) {
  if (canUseBrowserStorage()) {
    localStorage.removeItem(key);
    return;
  }
  memoryStore.delete(key);
}

export const storageKeys = {
  table: (slug: string) => `dde:table:${slug}`,
  cart: (slug: string) => `dde:cart:${slug}`,
  orders: "dde:orders",
  orderSequence: "dde:order-sequence",
  loyalty: (slug: string) => `dde:loyalty:${slug}`,
  guest: "dde:guest",
} as const;
