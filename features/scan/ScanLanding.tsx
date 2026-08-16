"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/types/dining";

export function ScanLanding({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter();
  const [table, setTable] = useState("6");
  const [opening, setOpening] = useState<string | null>(null);

  const openRestaurant = (slug: string) => {
    setOpening(slug);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 500;
    window.setTimeout(() => {
      router.push(`/restaurant/${slug}?table=${table}`);
    }, delay);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0b0806] text-[#f6efe4]">
      <Image
        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80"
        alt=""
        fill
        priority
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-[#0b0806]/75 to-[#0b0806]" />
      <div className="scan-grid absolute inset-0 opacity-40" />

      <main
        id="main-content"
        className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-[#c9a46a]">
          Restaurant Digital Dining Experience
        </p>
        <h1 className="font-heading mt-4 text-5xl leading-[0.92]">
          The table is ready.
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-[#f6efe4]/80">
          Scan the QR at your place setting to open a branded menu, order from
          the table, and collect house rewards.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-[#c9a46a]/20 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-[#c9a46a]">
              Table number
            </span>
            <QrCode className="size-4 text-[#c9a46a]" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose table">
            {["1", "2", "4", "6", "8", "12"].map((number) => (
              <button
                key={number}
                type="button"
                aria-pressed={table === number}
                onClick={() => setTable(number)}
                className={`min-h-11 min-w-11 cursor-pointer rounded-full px-3 text-sm transition ${
                  table === number
                    ? "bg-[#c9a46a] text-[#1a140c]"
                    : "bg-white/5 text-[#f6efe4]/80"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        <div className="stagger-in mt-6 space-y-4">
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.slug}
              className="overflow-hidden rounded-[1.6rem] bg-[#16110d]/90 ring-1 ring-[#c9a46a]/15"
            >
              <div className="relative h-36">
                <Image
                  src={restaurant.coverImage}
                  alt={`${restaurant.name} dining room`}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#16110d] to-transparent" />
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 overflow-hidden rounded-xl bg-black/40 ring-1 ring-[#c9a46a]/30">
                    <Image
                      src={restaurant.logo}
                      alt=""
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl">{restaurant.name}</h2>
                    <p className="text-sm text-[#f6efe4]/70">{restaurant.tagline}</p>
                  </div>
                </div>
                <Button
                  className="mt-4 h-12 w-full rounded-full"
                  onClick={() => openRestaurant(restaurant.slug)}
                  disabled={opening !== null}
                >
                  {opening === restaurant.slug
                    ? "Opening your table…"
                    : `Open ${restaurant.name} · Table ${table}`}
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-auto pt-8 text-center text-xs tracking-[0.14em] text-[#f6efe4]/50">
          Guest application only
        </p>
      </main>
    </div>
  );
}
