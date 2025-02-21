"use client";

import { Err } from "@/utils/helpers";
import { type SelectEvent } from "convex/events/d";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConvexCtx } from "../convex";
import { type SignedEvent } from "./all";

interface PreloadedUserEventsCtxProps {
  children: ReactNode;
  events: SelectEvent[];
  id: string | undefined;
}
interface PreloadedUserEventsCtxValues {
  signedEvents: SignedEvent[] | undefined;
  pending: boolean;
}
export const PreloadedUserEventsCtx =
  createContext<PreloadedUserEventsCtxValues | null>(null);

export const PreloadedUserEventsCtxProvider = ({
  children,
  events,
}: PreloadedUserEventsCtxProps) => {
  const { files } = use(ConvexCtx)!;
  const [signedEvents, setSignedEvents] = useState<SignedEvent[]>();
  const [pending, setPending] = useState(false);

  const getUrl = useCallback(
    async (event: SelectEvent) => ({
      ...event,
      cover_src: await files.get(event.cover_url),
    }),
    [files],
  );

  const signEvents = useCallback(async () => {
    setPending(true);
    if (!events) return;
    const promises = events ? events.map(getUrl) : [];
    const resolve = await Promise.all(promises);
    if (resolve.length <= 0) setPending(false);
    setSignedEvents(resolve);
  }, [events, getUrl]);

  useEffect(() => {
    signEvents()
      .then(() => setPending(false))
      .catch(Err(setPending));
  }, [signEvents]);

  const value = useMemo(
    () => ({
      signedEvents,
      pending,
    }),
    [signedEvents, pending],
  );
  return (
    <PreloadedUserEventsCtx value={value}>{children}</PreloadedUserEventsCtx>
  );
};
