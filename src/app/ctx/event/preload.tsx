"use client";

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
import { log } from "@/utils/logger";
import { Err } from "@/utils/helpers";

interface ImageURL {
  cover_src: string | null;
  logo_src?: string;
}
export type SignedEvent = SelectEvent & ImageURL;
interface PreloadedEventsCtxValues {
  signedEvents: SignedEvent[] | undefined;
  pending: boolean;
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
  const [pending, setPending] = useState<boolean>(false);

  const [signedEvents, setSignedEvents] = useState<SignedEvent[]>();
  const { files } = use(ConvexCtx)!;

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
    log("create signed", resolve);
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
    }),
    [signedEvents, pending],
  );
  return <PreloadedEventsCtx value={value}>{children}</PreloadedEventsCtx>;
};
