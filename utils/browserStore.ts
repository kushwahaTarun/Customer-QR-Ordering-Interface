type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const snapshotCache = new Map<string, { raw: string; value: unknown }>();
const serverSnapshots = new Map<string, unknown>();

function notify(key: string) {
  const set = listeners.get(key);
  if (!set) return;
  for (const listener of set) listener();
}

export function subscribeStore(key: string, listener: Listener) {
  const set = listeners.get(key) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
  };
}

export function readCachedStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return getServerSnapshot(key, () => fallback);
  }
  const raw = window.localStorage.getItem(key) ?? "";
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }
  let value = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  snapshotCache.set(key, { raw, value });
  return value;
}

export function getServerSnapshot<T>(key: string, create: () => T): T {
  if (serverSnapshots.has(key)) {
    return serverSnapshots.get(key) as T;
  }
  const value = create();
  serverSnapshots.set(key, value);
  return value;
}

export function writeCachedStore(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, raw);
  }
  snapshotCache.set(key, { raw, value });
  notify(key);
}
