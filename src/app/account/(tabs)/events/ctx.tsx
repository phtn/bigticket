"use client";

import { ConvexCtx } from "@/app/ctx/convex";
import type { SelectEvent } from "convex/events/d";
import {
  createContext,
  type TransitionStartFunction,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

interface EventCtxValues {
  eventList: SelectEvent[] | undefined;
  pending: boolean;
}
export const EventCtx = createContext<EventCtxValues | null>(null);

export const EventCtxProvider = ({ children }: { children: ReactNode }) => {
  const [eventList, setEventList] = useState<SelectEvent[]>();
  const { events } = use(ConvexCtx)!;

  const [pending, fn] = useTransition();

  const setEvents = (
    tx: TransitionStartFunction,
    action: () => SelectEvent[] | undefined,
  ) => {
    tx(() => {
      setEventList(action());
    });
  };

  const getAllEvents = useCallback(() => {
    setEvents(fn, events.get.all);
  }, [events.get]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  const value = useMemo(
    () => ({
      eventList,
      pending,
    }),
    [eventList, pending],
  );
  return <EventCtx value={value}>{children}</EventCtx>;
};
