"use client";

import { useToggle } from "@/hooks/useToggle";
import { createContext, useContext, useMemo, type ReactNode } from "react";

interface CheckoutCtxValues {
  open: boolean;
  toggle: VoidFunction;
}
export const CheckoutCtx = createContext<CheckoutCtxValues | null>(null);

export const CheckoutCtxProvider = ({ children }: { children: ReactNode }) => {
  const { open, toggle } = useToggle();

  const value = useMemo(
    () => ({
      open,
      toggle,
    }),
    [open, toggle],
  );
  return <CheckoutCtx value={value}>{children}</CheckoutCtx>;
};

export const useCheckout = () => {
  const context = useContext(CheckoutCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
