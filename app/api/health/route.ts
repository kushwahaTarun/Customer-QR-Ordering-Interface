import { getApiBaseUrl, getApiTimeoutMs } from "@/lib/diningSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = getApiBaseUrl();
  try {
    const response = await fetch(`${base}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    });
    return Response.json({ ok: response.ok, api: base });
  } catch {
    return Response.json({ ok: false, api: base }, { status: 503 });
  }
}
