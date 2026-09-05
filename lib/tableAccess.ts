export type TableAccess = {
  slug: string;
  table: string;
};

export const ACCESS_COOKIE = "dde_access";
const ACCESS_TTL_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

function secret() {
  return process.env.TABLE_ACCESS_SECRET ?? "dde-table-demo-secret-v1";
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signTableAccess(slug: string, table: string) {
  const payload = bytesToBase64Url(
    encoder.encode(JSON.stringify({ s: slug, t: String(table) })),
  );
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

export async function verifyTableAccess(
  token: string | undefined | null,
): Promise<TableAccess | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = await hmac(payload);
  if (!safeEqual(expected, signature)) return null;
  try {
    const decoded = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      s?: string;
      t?: string;
    };
    const table = String(decoded.t ?? "");
    const slug = String(decoded.s ?? "");
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) return null;
    if (!/^[1-9]\d{0,2}$/.test(table) || Number(table) > 80) return null;
    return { slug, table };
  } catch {
    return null;
  }
}

export function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_TTL_SECONDS,
  };
}

export const demoTables = [
  { slug: "shagun", table: "4", label: "Shagun · Table 4" },
  { slug: "shagun", table: "6", label: "Shagun · Table 6" },
  { slug: "shagun", table: "8", label: "Shagun · Table 8" },
  { slug: "shagun", table: "10", label: "Shagun · Table 10" },
  { slug: "shagun", table: "12", label: "Shagun · Table 12" },
] as const;
