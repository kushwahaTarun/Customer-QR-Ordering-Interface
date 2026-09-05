import { headers } from "next/headers";
import { DemoQrCard } from "@/components/dining/DemoQrCard";
import { getApiBaseUrl } from "@/lib/diningSession";
import { demoTables, signTableAccess } from "@/lib/tableAccess";
import { getRestaurantBySlug } from "@/services/restaurantService";

async function wakeApi() {
  try {
    await fetch(`${getApiBaseUrl()}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Render free tier may be cold; QR scan will retry the API.
  }
}

export default async function DemoQrPage() {
  await wakeApi();
  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3000";
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const cards = await Promise.all(
    demoTables.map(async (entry) => {
      const token = await signTableAccess(entry.slug, entry.table);
      const restaurant = await getRestaurantBySlug(entry.slug);
      return {
        ...entry,
        name: restaurant?.name ?? entry.slug,
        url: `${origin}/restaurant/${entry.slug}?k=${encodeURIComponent(token)}`,
      };
    }),
  );

  return (
    <div className="min-h-dvh bg-[#16080C] px-5 py-10 text-[#f7efe6]">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Shagun demo</p>
        <h1 className="font-heading mt-3 text-4xl">Table QR codes</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#f7efe6]/70">
          Print or scan these from your phone. Each QR opens only Shagun and
          that table. Keep the API running so the live menu loads. If someone
          changes the link, it will not open.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <DemoQrCard
              key={`${card.slug}-${card.table}`}
              value={card.url}
              name={card.name}
              table={card.table}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
