"use client";

import { Err } from "@/utils/helpers";
import type { SelectEvent, UserTicket } from "convex/events/d";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ConvexCtx } from "../convex";
import { getUserID } from "@/app/actions";

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
  counter: UserCounter | null;
  is_pending: boolean;
}
interface PreloadedEventsCtxProps {
  children: ReactNode;
  preloaded: SelectEvent[];
  slug: string[] | undefined;
}
export interface UserCounter {
  bookmarks: string[] | undefined;
  likes: string[] | undefined;
  followers: string[] | undefined;
  following: string[] | undefined;
  following_count: number | undefined;
  follower_count: number | undefined;
  tickets: UserTicket[] | undefined;
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
  const [counter, setCounter] = useState<UserCounter | null>(null);
  const { files, usr } = use(ConvexCtx)!;

  const [is_pending, fn] = useTransition();
  const setFn = <T,>(
    tx: TransitionStartFunction,
    action: () => Promise<T>,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    tx(async () => {
      set(await action());
    });
  };

  const userCounter = useCallback(async () => {
    const id = await getUserID();
    if (!id) return null;
    const user = await usr.get.byId(id);
    if (!user) return null;
    const {
      bookmarks,
      likes,
      followers,
      following,
      follower_count,
      following_count,
      tickets,
    } = user;
    return {
      bookmarks,
      likes,
      followers,
      following,
      follower_count,
      following_count,
      tickets,
    };
  }, [usr.get]);

  const getUserCounter = useCallback(() => {
    setFn(fn, userCounter, setCounter);
  }, [userCounter]);

  useEffect(() => {
    getUserCounter();
  }, [getUserCounter]);

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
      counter,
      is_pending,
    }),
    [signedEvents, pending, getEvent, selectedEvent, counter, is_pending],
  );
  return <PreloadedEventsCtx value={value}>{children}</PreloadedEventsCtx>;
};
