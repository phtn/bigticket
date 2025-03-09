"use client";

import { useToggle } from "@/hooks/useToggle";
import { createContext, useContext, useMemo, type ReactNode } from "react";

interface SidebarCtxValues {
  toggle: VoidFunction;
  open: boolean;
}
export const SidebarCtx = createContext<SidebarCtxValues | null>(null);

export const SidebarCtxProvider = ({ children }: { children: ReactNode }) => {
  const { open, toggle } = useToggle();
  const value = useMemo(
    () => ({
      open,
      toggle,
    }),
    [open, toggle],
  );
  return <SidebarCtx value={value}>{children}</SidebarCtx>;
};

export const useSidebar = () => {
  const context = useContext(SidebarCtx);
   if (!context) {
     throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
 };
 