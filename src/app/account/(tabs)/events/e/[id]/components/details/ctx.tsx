"use client";

import { useToggle } from "@/hooks/useToggle";
import { type InsertEvent } from "convex/events/d";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
export type EventDetailKey = keyof Pick<
  InsertEvent,
  | "event_type"
  | "category"
  | "subcategory"
  | "start_date"
  | "end_date"
  | "is_private"
  | "is_online"
  | "event_email"
  | "event_phone"
  | "event_name"
  | "event_desc"
  | "event_url"
  | "venue_name"
  | "venue_address"
  | "ticket_count"
  | "ticket_price"
  | "min_age"
  | "max_age"
  | "ticket_sales_open"
  | "ticket_sales_close"
  | "ticket_sales_limit"
  | "ticket_sales_estimate"
  | "ticket_sales_email"
  | "ticket_sales_phone"
>;
interface EventDetailCtxValues {
  open: boolean;
  toggle: VoidFunction;
  selectedEventDetail: EventDetailKey | null;
  setSelectedEventDetail: Dispatch<SetStateAction<EventDetailKey | null>>;
}
export const EventDetailCtx = createContext<EventDetailCtxValues | null>(null);

export const EventDetailCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open, toggle } = useToggle();
  const [selectedEventDetail, setSelectedEventDetail] =
    useState<EventDetailKey | null>(null);
  const value = useMemo(
    () => ({
      open,
      toggle,
      setSelectedEventDetail,
      selectedEventDetail,
    }),
    [open, toggle, selectedEventDetail, setSelectedEventDetail],
  );
  return <EventDetailCtx value={value}>{children}</EventDetailCtx>;
};

export const useEventDetail = () => {
  const context = useContext(EventDetailCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
