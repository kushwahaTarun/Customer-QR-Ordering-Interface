import { getApiBaseUrl, getApiTimeoutMs } from "@/lib/diningSession";
import type {
  ApiMenuResponse,
  ApiRestaurantBranding,
} from "@/lib/api/types";

async function apiGet<T>(path: string, sessionToken: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Dining-Session": sessionToken,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(getApiTimeoutMs()),
  });

  if (!response.ok) {
    throw new Error(`API ${path} failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function fetchRestaurantBranding(
  slug: string,
  sessionToken: string,
) {
  return apiGet<ApiRestaurantBranding>(
    `/v1/restaurants/${encodeURIComponent(slug)}`,
    sessionToken,
  );
}

export function fetchRestaurantMenu(slug: string, sessionToken: string) {
  return apiGet<ApiMenuResponse>(
    `/v1/restaurants/${encodeURIComponent(slug)}/menu`,
    sessionToken,
  );
}
