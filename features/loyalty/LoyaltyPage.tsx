"use client";

import { useState } from "react";
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
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setError("");
    if (!name.trim() || !isIndianMobile(mobile)) {
      setError("A name and 10-digit mobile number are required.");
      return;
    }
    await join(name.trim(), mobile.trim());
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
            <div className="space-y-2">
              <Label htmlFor="loyalty-name">Name</Label>
              <Input
                id="loyalty-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyalty-mobile">Mobile Number</Label>
              <Input
                id="loyalty-mobile"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="h-11 rounded-2xl"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="h-11 w-full rounded-full" onClick={() => void handleJoin()}>
              Join {restaurant.loyaltyProgramName}
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
