"use client";

import type { SelectUser } from "convex/users/d";
import { createContext, useMemo, type ReactNode } from "react";

interface PreloadedVxCtxValues {
  user: SelectUser | null;
}
export const PreloadedVxCtx = createContext<PreloadedVxCtxValues | null>(null);
interface PreloadedVxCtxProviderProps {
  children: ReactNode;
  user: SelectUser | null;
}

export const PreloadedVxCtxProvider = ({
  children,
  user,
}: PreloadedVxCtxProviderProps) => {
  const value = useMemo(
    () => ({
      user,
    }),
    [user],
  );
  return <PreloadedVxCtx value={value}>{children}</PreloadedVxCtx>;
};
