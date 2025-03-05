"use client";

import { useConvexCtx } from "@/app/ctx/convex";
import type { SelectEvent } from "convex/events/d";
import {
  createContext,
  type TransitionStartFunction,
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
  const { vxEvents } = useConvexCtx();

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
    const events = () => vxEvents.qry.getAllEvents as SelectEvent[] | undefined;
    setEvents(fn, events);
  }, [vxEvents.qry]);

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
