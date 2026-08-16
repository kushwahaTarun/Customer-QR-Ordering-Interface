"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/features/i18n/LanguageProvider";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <Button
      variant="outline"
      className="h-11 rounded-full border-primary/30 px-3 text-xs tracking-[0.12em]"
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
    >
      {t("language")}
    </Button>
  );
}
