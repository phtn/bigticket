"use client";

import { useToggle } from "@/hooks/useToggle";
import { type InsertEvent } from "convex/events/d";
import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
export type EventDetailKey = keyof Pick<
  InsertEvent,
  | "ticket_count"
  | "ticket_price"
  | "event_type"
  | "category"
  | "start_date"
  | "end_date"
  | "is_private"
  | "event_email"
  | "event_phone"
  | "event_name"
  | "event_desc"
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
