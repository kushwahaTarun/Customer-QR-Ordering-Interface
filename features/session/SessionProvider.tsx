"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

interface SessionContextValue {
  tableNumber: string;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  tableNumber,
  children,
}: {
  tableNumber: string;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ tableNumber }), [tableNumber]);
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
