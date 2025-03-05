"use client";

import { Err } from "@/utils/helpers";
import { type SelectEvent } from "convex/events/d";
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConvexCtx } from "../convex";
import type { XEvent } from "@/app/types";

interface PreloadedUserEventsCtxProps {
  children: ReactNode;
  events: SelectEvent[];
  id: string | undefined;
}
interface PreloadedUserEventsCtxValues {
  x: XEvent[] | undefined;
  pending: boolean;
}
export const PreloadedUserEventsCtx =
  createContext<PreloadedUserEventsCtxValues | null>(null);

export const PreloadedUserEventsCtxProvider = ({
  children,
  events,
}: PreloadedUserEventsCtxProps) => {
  const { vxFiles } = use(ConvexCtx)!;
  const [x, setXEvents] = useState<XEvent[]>();
  const [pending, setPending] = useState(false);

  const getUrl = useCallback(
    async (event: SelectEvent) => ({
      ...event,
      cover_src: await vxFiles.getUrl(event.cover_url),
    }),
    [vxFiles],
  );

  const signEvents = useCallback(async () => {
    setPending(true);
    if (!events) return;
    const promises = events ? events.map(getUrl) : [];
    const resolve = await Promise.all(promises);
    if (resolve.length <= 0) setPending(false);
    setXEvents(resolve);
  }, [events, getUrl]);

  useEffect(() => {
    signEvents()
      .then(() => setPending(false))
      .catch(Err(setPending));
  }, [signEvents]);

  const value = useMemo(
    () => ({
      x,
      pending,
    }),
    [x, pending],
  );
  return (
    <PreloadedUserEventsCtx value={value}>{children}</PreloadedUserEventsCtx>
  );
};

export const usePreloadedUserEvents = () => {
  const context = useContext(PreloadedUserEventsCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
