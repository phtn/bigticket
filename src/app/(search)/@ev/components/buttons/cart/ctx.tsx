"use client";

import { useToggle } from "@/hooks/useToggle";
import { createContext, useContext, useMemo, type ReactNode } from "react";

interface CartCtxValues {
  open: boolean;
  toggle: VoidFunction;
}
export const CartCtx = createContext<CartCtxValues | null>(null);

export const CartCtxProvider = ({ children }: { children: ReactNode }) => {
  const { open, toggle } = useToggle();

  const value = useMemo(
    () => ({
      open,
      toggle,
    }),
    [open, toggle],
  );
  return <CartCtx value={value}>{children}</CartCtx>;
};

export const useCart = () => {
  const context = useContext(CartCtx);
  if (!context) {
    throw new Error("useCart must be used within an CartCtxProvider");
  }
  return context;
};
