export const SESSION_COOKIE = "dde_session";
const SESSION_TTL_SECONDS = 60 * 60 * 6;

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:3001"
  );
}

export function getApiTimeoutMs() {
  return process.env.NODE_ENV === "production" ? 20000 : 8000;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

type StartSessionResponse = {
  sessionToken?: string;
};

export async function startDiningSession(input: {
  restaurantSlug: string;
  tableNumber: string;
  accessKey: string;
}): Promise<string | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/dining-session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    });

    if (!response.ok) {
      console.error(
        `Dining session start failed (${response.status}) for ${input.restaurantSlug} table ${input.tableNumber}`,
      );
      return null;
    }

    const payload = (await response.json()) as StartSessionResponse;
    return payload.sessionToken ?? null;
  } catch (error) {
    console.error("Dining session start could not reach the API", error);
    return null;
  }
}
