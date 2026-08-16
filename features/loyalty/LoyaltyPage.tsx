"use client";

import { useRef, useState } from "react";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { seedDemoWalletIfEmpty } from "@/services/loyaltyService";
import { isIndianMobile } from "@/utils/theme";

export function LoyaltyPage() {
  const restaurant = useRestaurant();
  const { account, rewards, guestName, guestMobile, join, redeem, refresh } =
    useLoyalty();
  const [name, setName] = useState(guestName || "Rahul");
  const [mobile, setMobile] = useState(guestMobile || "9876543210");
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [joining, setJoining] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleJoin = async () => {
    const nextName = name.trim() ? "" : "Enter your name.";
    const nextMobile = isIndianMobile(mobile)
      ? ""
      : "Enter a 10-digit Indian mobile number starting with 6–9.";
    setNameError(nextName);
    setMobileError(nextMobile);
    if (nextName || nextMobile) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    setJoining(true);
    try {
      await join(name.trim(), mobile.trim());
    } finally {
      setJoining(false);
    }
  };

  const loadDemo = async () => {
    seedDemoWalletIfEmpty(restaurant.slug);
    await refresh();
  };

  return (
    <div className="animate-rise">
      <PageHeader
        title="Rewards"
        subtitle={restaurant.loyaltyProgramName}
        backHref={`/restaurant/${restaurant.slug}`}
      />
      <div className="space-y-6 px-4 py-5">
        <LoyaltyCard />

        {!account.joined ? (
          <section className="space-y-3 rounded-[1.4rem] bg-card p-4 ring-1 ring-foreground/8">
            <h2 className="font-heading text-2xl">Join the house</h2>
            <p className="text-sm text-muted-foreground">
              {restaurant.loyaltyTagline}. Identification is by mobile number only.
            </p>
            {nameError || mobileError ? (
              <div
                ref={summaryRef}
                role="alert"
                tabIndex={-1}
                className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm"
              >
                <p className="font-medium">There is a problem</p>
                <ul className="mt-1 list-disc pl-5">
                  {nameError ? (
                    <li>
                      <a href="#loyalty-name" className="underline">
                        {nameError}
                      </a>
                    </li>
                  ) : null}
                  {mobileError ? (
                    <li>
                      <a href="#loyalty-mobile" className="underline">
                        {mobileError}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="loyalty-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="loyalty-name"
                autoComplete="name"
                value={name}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "loyalty-name-error" : undefined}
                onChange={(event) => setName(event.target.value)}
              />
              {nameError ? (
                <p id="loyalty-name-error" className="text-sm text-destructive">
                  {nameError}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyalty-mobile">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="loyalty-mobile"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={mobile}
                aria-invalid={Boolean(mobileError)}
                aria-describedby={mobileError ? "loyalty-mobile-error" : undefined}
                onChange={(event) =>
                  setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
              {mobileError ? (
                <p id="loyalty-mobile-error" className="text-sm text-destructive">
                  {mobileError}
                </p>
              ) : null}
            </div>
            <Button
              className="h-12 w-full rounded-full"
              disabled={joining}
              onClick={() => void handleJoin()}
            >
              {joining ? "Joining…" : `Join ${restaurant.loyaltyProgramName}`}
            </Button>
            {restaurant.slug === "abc-lounge" ? (
              <Button
                variant="ghost"
                className="w-full rounded-full"
                onClick={() => void loadDemo()}
              >
                Load Rahul’s demo wallet
              </Button>
            ) : null}
          </section>
        ) : (
          <>
            <section>
              <h2 className="font-heading text-2xl">Available rewards</h2>
              <div className="mt-3 space-y-3">
                {rewards.map((reward) => {
                  const affordable = account.points >= reward.pointsCost;
                  return (
                    <article
                      key={reward.id}
                      className="flex items-center justify-between gap-3 rounded-[1.3rem] bg-card p-4 ring-1 ring-foreground/8"
                    >
                      <div>
                        <h3 className="font-medium">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reward.description}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary">
                          {reward.pointsCost} pts
                        </p>
                      </div>
                      <Button
                        className="rounded-full"
                        disabled={!affordable}
                        onClick={() => void redeem(reward.id)}
                      >
                        Redeem
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl">History</h2>
              <ul className="mt-3 divide-y divide-border/70 overflow-hidden rounded-[1.3rem] bg-card ring-1 ring-foreground/8">
                {account.history.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <span>
                      {event.points > 0 ? "+" : ""}
                      {event.points} {event.label}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(event.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
