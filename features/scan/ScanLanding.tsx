"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
      : 600;
    window.setTimeout(() => {
      router.push(`/restaurant/${slug}?table=${table}`);
    }, delay);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#070504] text-[#f4eadc]">
      <Image
        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=80"
        alt=""
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.16),transparent_42%),linear-gradient(180deg,rgba(7,5,4,0.35)_0%,rgba(7,5,4,0.82)_55%,#070504_100%)]" />

      <main
        id="main-content"
        className="relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10"
      >
        <section className="max-w-xl">
          <p className="eyebrow">Digital Dining</p>
          <div className="gold-rule mt-4" />
          <h1 className="font-heading mt-6 text-[3.4rem] leading-[0.88] sm:text-7xl">
            The house,
            <br />
            at the table.
          </h1>
          <p className="serif-italic mt-5 text-xl text-[#f4eadc]/80">
            A private dining room, in the guest’s hand.
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#f4eadc]/68">
            Scan the setting. Open a branded menu. Order without leaving the
            conversation. Built for rooms that refuse to feel like a QR code.
          </p>
        </section>

        <section className="space-y-5">
          <div className="rounded-[1.7rem] border border-[#c9a46a]/20 bg-black/35 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="eyebrow">Your table</p>
                <p className="serif-italic mt-2 text-lg">Choose the place setting</p>
              </div>
              <p className="font-heading text-4xl leading-none text-[#c9a46a]">
                {table.padStart(2, "0")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose table">
              {["1", "2", "4", "6", "8", "12"].map((number) => (
                <button
                  key={number}
                  type="button"
                  aria-pressed={table === number}
                  onClick={() => setTable(number)}
                  className={`min-h-11 min-w-11 cursor-pointer rounded-full border text-sm tracking-[0.08em] transition ${
                    table === number
                      ? "border-[#c9a46a] bg-[#c9a46a] text-[#1a140c]"
                      : "border-[#c9a46a]/20 bg-transparent text-[#f4eadc]/80"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <article
                key={restaurant.slug}
                className="overflow-hidden rounded-[1.7rem] border border-[#c9a46a]/18 bg-[#120e0b]/80 backdrop-blur-xl"
              >
                <div className="relative h-40">
                  <Image
                    src={restaurant.coverImage}
                    alt={`${restaurant.name} dining room`}
                    fill
                    sizes="520px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#120e0b] via-[#120e0b]/20 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full border border-[#c9a46a]/35 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#c9a46a] backdrop-blur">
                    {restaurant.cuisine}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <p className="eyebrow">{restaurant.location}</p>
                  <h2 className="font-heading mt-2 text-[2rem] leading-none">
                    {restaurant.name}
                  </h2>
                  <p className="serif-italic mt-2 text-[#f4eadc]/70">
                    {restaurant.tagline}
                  </p>
                  <Button
                    className="gold-fill mt-5 h-12 w-full rounded-full tracking-[0.12em] uppercase"
                    onClick={() => openRestaurant(restaurant.slug)}
                    disabled={opening !== null}
                  >
                    {opening === restaurant.slug
                      ? "Opening the room…"
                      : `Enter · Table ${table}`}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
