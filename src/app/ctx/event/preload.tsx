"use client";

import { Err } from "@/utils/helpers";
import type { SelectEvent } from "convex/events/d";
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

interface ImageURL {
  cover_src: string | null;
  logo_src?: string;
}
export type SignedEvent = SelectEvent & ImageURL;
interface PreloadedEventsCtxValues {
  signedEvents: SignedEvent[] | undefined;
  pending: boolean;
  selectedEvent: SignedEvent | null;
  getEvent: (event_id: string) => void;
}
interface PreloadedEventsCtxProps {
  children: ReactNode;
  preloaded: SelectEvent[];
  slug: string[] | undefined;
}
export const PreloadedEventsCtx =
  createContext<PreloadedEventsCtxValues | null>(null);

export const PreloadedEventsCtxProvider = ({
  children,
  preloaded,
}: PreloadedEventsCtxProps) => {
  const [selectedEvent, setSelectedEvent] = useState<SignedEvent | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [signedEvents, setSignedEvents] = useState<SignedEvent[]>();
  const { files } = use(ConvexCtx)!;

  const getEvent = useCallback(
    (event_id: string) => {
      const event =
        signedEvents?.find((event) => event.event_id === event_id) ?? null;
      setSelectedEvent(event);
    },
    [signedEvents],
  );

  const collectEvent = useCallback(
    async (event: SelectEvent) => ({
      ...event,
      cover_src: await files.get(event.cover_url),
    }),
    [files],
  );

  const createSignedEvents = useCallback(async () => {
    setPending(true);
    if (!preloaded) return;
    const promises = preloaded ? preloaded.map(collectEvent) : [];
    const resolve = await Promise.all(promises);
    if (resolve.length <= 0) setPending(false);
    setSignedEvents(resolve);
  }, [preloaded, collectEvent]);

  useEffect(() => {
    createSignedEvents()
      .then(() => setPending(false))
      .catch(Err(setPending));
  }, [createSignedEvents]);

  const value = useMemo(
    () => ({
      signedEvents,
      pending,
      selectedEvent,
      getEvent,
    }),
    [signedEvents, pending, getEvent, selectedEvent],
  );
  return <PreloadedEventsCtx value={value}>{children}</PreloadedEventsCtx>;
};
