"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useI18n } from "@/features/i18n/LanguageProvider";
import { useSession } from "@/features/session/SessionProvider";

const HELP_KEYS = ["helpWater", "helpCutlery", "helpBill", "helpOther"] as const;

export function HelpSheet() {
  const { t } = useI18n();
  const { tableNumber } = useSession();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-12 rounded-full border-primary/30"
        onClick={() => {
          setSent(false);
          setOpen(true);
        }}
      >
        <Bell className="size-4" aria-hidden="true" />
        {t("callWaiter")}
      </Button>
      <Drawer
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSent(false);
        }}
      >
        <DrawerContent className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="font-heading text-3xl">{t("helpTitle")}</DrawerTitle>
            <DrawerDescription>
              {t("table")} {tableNumber}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-2 px-4 pb-6">
            {sent ? (
              <p className="rounded-2xl bg-secondary p-4 text-sm">
                {t("helpSent", { table: tableNumber })}
              </p>
            ) : (
              HELP_KEYS.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-12 justify-start rounded-2xl"
                  onClick={() => setSent(true)}
                >
                  {t(key)}
                </Button>
              ))
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
