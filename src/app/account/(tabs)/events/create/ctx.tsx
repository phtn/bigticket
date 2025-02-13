"use client";

import { useToggle } from "@/hooks/useToggle";
import { createContext, useMemo, type ReactNode } from "react";

interface OptionCtxValues {
  open: boolean;
  toggle: VoidFunction;
}
export const OptionCtx = createContext<OptionCtxValues | null>(null);

export const OptionCtxProvider = ({ children }: { children: ReactNode }) => {
  const { open, toggle } = useToggle();
  const value = useMemo(
    () => ({
      open,
      toggle,
    }),
    [open, toggle],
  );
  return <OptionCtx value={value}>{children}</OptionCtx>;
};
