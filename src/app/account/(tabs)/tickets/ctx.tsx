"use client";

import { useToggle } from "@/hooks/useToggle";
import { type AccountTicket } from "convex/events/d";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface TicketViewerCtxValues {
  open: boolean;
  toggle: VoidFunction;
  ticket: AccountTicket | null;
  getTicket: (ticket: AccountTicket | null) => void;
}
export const TicketViewerCtx = createContext<TicketViewerCtxValues | null>(
  null,
);

export const TicketViewerCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ticket, setTicket] = useState<AccountTicket | null>(null);
  const { open, toggle } = useToggle();
  const getTicket = useCallback((ticket: AccountTicket | null) => {
    setTicket(ticket);
  }, []);
  const value = useMemo(
    () => ({
      open,
      toggle,
      ticket,
      getTicket,
    }),
    [open, toggle, ticket, getTicket],
  );
  return <TicketViewerCtx value={value}>{children}</TicketViewerCtx>;
};

export const useTicketViewer = () => {
  const context = useContext(TicketViewerCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
