"use client";

import { useToggle } from "@/hooks/useToggle";
import { createContext, useMemo, type ReactNode } from "react";

interface EventViewerCtxValues {
  toggle: VoidFunction;
  open: boolean;
}
export const EventViewerCtx = createContext<EventViewerCtxValues | null>(null);

export const EventViewerCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open, toggle } = useToggle();
  const value = useMemo(
    () => ({
      open,
      toggle,
    }),
    [open, toggle],
  );
  return <EventViewerCtx value={value}>{children}</EventViewerCtx>;
};
