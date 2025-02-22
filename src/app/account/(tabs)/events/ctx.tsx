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
  const { getAllEvents } = use(ConvexCtx)!;

  const [pending, fn] = useTransition();

  const setEvents = (
    tx: TransitionStartFunction,
    action: () => SelectEvent[] | undefined,
  ) => {
    tx(async () => {
      setEventList(action());
    });
  };

  const getEvents = useCallback(() => {
    setEvents(fn, getAllEvents);
  }, [getAllEvents]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const value = useMemo(
    () => ({
      eventList,
      pending,
    }),
    [eventList, pending],
  );
  return <EventCtx value={value}>{children}</EventCtx>;
};
