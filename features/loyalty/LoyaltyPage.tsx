"use client";

import { useMemo, useRef, useState } from "react";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { PageHeader } from "@/components/dining/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useLoyalty } from "@/features/loyalty/LoyaltyProvider";
import { useRestaurant } from "@/features/restaurant/RestaurantProvider";
import { isIndianMobile } from "@/utils/theme";

export function LoyaltyPage() {
  const restaurant = useRestaurant();
  const { t } = useI18n();
  const { account, rewards, guestName, guestMobile, join, redeem } = useLoyalty();
  const [name, setName] = useState(guestName);
  const [mobile, setMobile] = useState(guestMobile);
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const nextReward = useMemo(
    () =>
      [...rewards].sort((a, b) => a.pointsCost - b.pointsCost).find(
        (reward) => reward.pointsCost > account.points,
      ) ?? rewards[0],
    [rewards, account.points],
  );

  const handleJoin = async () => {
    const nextName = name.trim() ? "" : t("nameRequired");
    const nextMobile = isIndianMobile(mobile) ? "" : t("mobileRequired");
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

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("rewards")}
        subtitle={restaurant.loyaltyProgramName}
        backHref={`/restaurant/${restaurant.slug}`}
      />
      <div className="space-y-6 px-4 py-5">
        <LoyaltyCard />

        {!account.joined ? (
          <section className="space-y-3 rounded-[1.4rem] bg-card p-4">
            <h2 className="font-heading text-2xl">{t("joinRewards")}</h2>
            <p className="text-sm text-muted-foreground">{t("joinHint")}</p>
            {nameError || mobileError ? (
              <div
                ref={summaryRef}
                role="alert"
                tabIndex={-1}
                className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm"
              >
                {nameError || mobileError}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="loyalty-name">{t("yourName")}</Label>
              <Input
                id="loyalty-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyalty-mobile">{t("mobile")}</Label>
              <Input
                id="loyalty-mobile"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </div>
            <Button
              className="gold-fill h-12 w-full rounded-full"
              disabled={joining}
              onClick={() => void handleJoin()}
            >
              {t("joinRewards")}
            </Button>
          </section>
        ) : (
          <>
            {nextReward ? (
              <p className="rounded-2xl bg-secondary p-4 text-sm">
                {t("pointsToGo", {
                  points: String(Math.max(nextReward.pointsCost - account.points, 0)),
                  reward: nextReward.name,
                })}
              </p>
            ) : null}

            {code ? (
              <div className="rounded-[1.4rem] border border-primary/30 bg-card p-4 text-center">
                <p className="text-sm">{t("showCode")}</p>
                <p className="font-heading mt-2 text-4xl tracking-[0.14em]">{code}</p>
              </div>
            ) : null}

            <section>
              <div className="space-y-3">
                {rewards.map((reward) => {
                  const affordable = account.points >= reward.pointsCost;
                  return (
                    <article
                      key={reward.id}
                      className="flex items-center justify-between gap-3 rounded-[1.3rem] bg-card p-4"
                    >
                      <div>
                        <h3 className="font-medium">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reward.description}
                        </p>
                        <p className="mt-1 text-sm text-primary">
                          {reward.pointsCost} points
                        </p>
                      </div>
                      <Button
                        className="rounded-full"
                        disabled={!affordable}
                        onClick={() => {
                          void redeem(reward.id);
                          setCode(
                            `${restaurant.slug.slice(0, 3).toUpperCase()}-${tableCode()}`,
                          );
                        }}
                      >
                        {t("redeem")}
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function tableCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}
