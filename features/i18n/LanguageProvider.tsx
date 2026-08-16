"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { t, type Lang, type StringKey } from "@/features/i18n/strings";
import {
  getServerSnapshot,
  readCachedStore,
  subscribeStore,
  writeCachedStore,
} from "@/utils/browserStore";

const LANG_KEY = "dde:lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    (listener) => subscribeStore(LANG_KEY, listener),
    () => readCachedStore<Lang>(LANG_KEY, "en"),
    () => getServerSnapshot(LANG_KEY, () => "en" as Lang),
  );

  const setLang = useCallback((next: Lang) => {
    writeCachedStore(LANG_KEY, next);
  }, []);

  const translate = useCallback(
    (key: StringKey, vars?: Record<string, string>) => t(lang === "hi" ? "hi" : "en", key, vars),
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang: lang === "hi" ? "hi" : "en",
      setLang,
      t: translate,
    }),
    [lang, setLang, translate],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
